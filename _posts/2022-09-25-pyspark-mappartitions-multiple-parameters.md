---
layout: post
title: "Passing Multiple Parameters in PySpark MapPartitions"
date: 2022-09-25
categories: Python
---

**Alternate title**: k-Nearest Neighbours (kNN) in PySpark

You can follow the story of what I wanted to do and how I did it. Or [jump](#final-solution) to the solution.

## Situation

- The PySpark MLlib ([DataFrame-based](https://spark.apache.org/docs/latest/api/python/reference/pyspark.ml.html), [RDD-based](https://spark.apache.org/docs/latest/api/python/reference/pyspark.mllib.html)) does not support [kNN algorithm](https://en.wikipedia.org/wiki/K-nearest_neighbours_algorithm).
- The multiple SO questions ([1](https://stackoverflow.com/q/39509095/2650427), [2](https://stackoverflow.com/q/37767790/2650427), [3](https://stackoverflow.com/q/62896411/2650427)) did not help.
- I did not get a chance to try the available open-source code samples ([1](https://github.com/saurfang/spark-knn), [2](https://github.com/jakac/spark-python-knn)).
- There were two stable-ish solutions available:
    1. Use Spotify's library called [Annoy](https://github.com/spotify/annoy).
    2. Use Scikit-learn's [implementation of kNN](https://Scikit-learn.org/stable/modules/generated/sklearn.neighbours.NearestNeighbours.html).
- Both methods only use a single node. So, the benefit of Spark's distributed processing goes out of the window.
- That's a deal breaker because I have a large data set (~20+ mill records) with long vectors.
- I picked Annoy because I found it first. I discuss at the end why Scikit could be more performant.

The task is to parallelise the Annoy code across multiple nodes of the Spark cluster.

## Solution

- A hint about the solution is present in this [SO Answer](https://stackoverflow.com/a/38626686/2650427).
- For both Annoy and Scikit, the approach is as follows:
    1. Build the index or fit the model on a single node. Nothing is distributed here.
    2. Broadcast the index (or model) across the cluster to find the nearest neighbours of a given vector.

### Building the index

- I first tried to use [spark-annoy](https://github.com/mskimm/spark-annoy). It is in Scala. The benefit of this library was that we could build the index in a distributed manner. Unfortunately, I could not figure it out.
- The default was to use the iterative approach of building the index on a single node.
- The following is the method to build the index:

{% highlight python linenos %}
import pandas as pd
from annoy import AnnoyIndex

def build_annoy_index(vectors: pd.Series, dim: int, num_trees: int = 100):
    t = AnnoyIndex(dim, metric='angular')
    for index, vector in vectors.items():
        t.add_item(index, vector)
    t.build(num_trees)
    return t
{% endhighlight %}

- The `for` loop makes it a long-running process if the data is large. Sadly, it is unavoidable.
- Note that the type of `vectors` is `pd.Series`. I used pandas to get the goodness of indexes. It can be a `list` or any other iterable. It should be an iterable irrespective of its type. That means either of the following:
    1. Run `.collect()` on the Spark DataFrame;
    2. Turn the spark DataFrame into a pandas DataFrame.
- That will bring all the data to a single node. So, it can potentially lead to OOM error.

### Finding Nearest Neighbours

- We can parallelise this step.
- We have to broadcast the Annoy index across all the nodes of the Spark cluster.
- The Annoy indexes are memory mapped.

    > It also creates large read-only file-based data structures that are mmapped into memory so that many processes may share the same data.

- It will fail if we broadcast it using `sc.broadcast(t)`. This [SO answer](https://stackoverflow.com/a/35190477/2650427) discusses this issue.
- The solution: write the index to a file and send the file to all the workers to load.
- Use [`sc.addFile()`](https://spark.apache.org/docs/latest/api/python/reference/api/pyspark.SparkContext.addFile.html) to send the file to the workers.
- Use [`SparkFiles.get()`](https://spark.apache.org/docs/latest/api/python/reference/api/pyspark.SparkFiles.get.html#pyspark.SparkFiles.get) to get the file path and load it in the worker node.
- Here is the method to load the Annoy index in the worker nodes:

{% highlight python linenos %}
def load_annoy_index(index_file: str, dim: int):
    from annoy import AnnoyIndex

    index = AnnoyIndex(dim, metric='angular')
    index.load(SparkFiles.get(index_file))
    return index
{% endhighlight %}

- I call the below method to get the nearest neighbours of a set of index ids:

{% highlight python linenos %}
def find_neighbours(index_file, top_n, dim, item_batch):
    index = load_annoy_index(index_file, dim)

    # get similar items
    sim_items = []
    for item in item_batch:
        top_n_items = index.get_nns_by_item(i=item, n=top_n)
        sim_items.append((item, list(enumerate(top_n_items))))
    return sim_items
{% endhighlight %}

- The `item_batch` is the list of Annoy index ids.
- The function returns the list of `(annoy_item_index, [(rank_1, sim_item_1), ..., (rank_n, sim_item_n)])`.
- For example, here is one such item from the list:

```
(248, [[0, 248], [9, 284764], [3, 86148], [6, 265812], [7, 508155], [2, 48388], [10, 58786], [1, 154653], [5, 364419], [4, 4444], [8, 89955]])
```

- To validate the function, the most similar item corresponding to the query item should be itself. In the above example, the query index `248` ranks `0` in the top similar items.
- To get the nearest neighbours by vectors, you pass the vectors in the `item_batch` and use the `get_nns_by_vector` method.
- I keep my `find_neighbours` method generic for the following parameters:
    - Annoy index file name: I can have any name based on my use case.
    - Top n items: number of top items I want to retrieve.
    - Dim: The dimension of the vector can vary depending on the various ML techniques (LDA, DL, etc.)
- We have only written the method to find the nearest neighbours. How do we call it in a distributed manner? This [SO answer](https://stackoverflow.com/a/35190477/2650427) answers that too.
- The answer is [`mapPartitions`](https://spark.apache.org/docs/latest/api/python/reference/api/pyspark.RDD.mapPartitions.html). This method will apply the passed function to each RDD partition. Go through the answers of this [SO question](https://stackoverflow.com/q/21185092/2650427) to know more in detail.
- I will pass `find_neighbours` to the `mapPartitions`, and it will return an RDD with the nearest neighbours list.
- <div id="final-solution"></div>But my `find_neighbours` implementation takes four parameters, and there is no way of sending `**args` inside the `mapPartitions`.
- I use the inbuilt python [`partial()` function](https://docs.python.org/3/library/functools.html#functools.partial) from the `functools` module.

    > The `partial()` is used for partial function application which "freezes" some portion of a function's arguments and/or keywords resulting in a new object with a simplified signature.

- Here is how my final function looks:

{% highlight python linenos %}
def build_index_get_similar_items(vector_df, index_file, top_n):
    vectors = vector_df.vector
    sparkvector_ids = sc.parallelize(vector_df.index.values)

    # build and save index
    index_file = build_save_annoy_index(vectors, dim, index_file, BASE_DIR)
    print(index_file)

    # add index file to the driver files
    sc.addFile(index_file)

    # get similar items
    find_neighbours_ = partial(find_neighbours, index_file, top_n, dim)
    similar_items = sparkvector_ids.mapPartitions(find_neighbours_).collect()
    return similar_items
{% endhighlight %}

- The `build_save_annoy_index()` method builds the index, saves it to a file, and returns the file path.
- Finally, we see the use of `sc.addFile(index_file)`.
- The `find_neighbours_()` is the partial function. We froze the `index_file`, `top_n`, and `dim`. This function now only expects a single RDD as input. And this is what we wanted for the `mapPartitions()` method.

### Saving Results

- I take the `similar_items` list and convert it into a pandas DataFrame.
- Map ALL the Annoy index ids with the actual item ids. That includes all the index ids of the top-n similar items list.
- Convert the pandas DataFrame to a PySpark DataFrame.
- Save the PySpark DataFrame into a delta table.

## Result

- I was able to parallelise the kNN search based on Annoy using `mapPartitions`.
- On ~500k records, the run time was down from 8 minutes to 2 minutes.
- On ~10 million records (with an index built from ~500k records), the run time was ~1 hour.
- On ~10 million records (with an index built from ~10 million records), I got an OOM error. 🥲

## What's Next

- Find the reason it is going OOM.
- Converting the pandas DataFrame to PySpark DataFrame is expensive. I want to explore if I can directly go from pandas DataFrame to the delta. Ref: [1](https://spark.apache.org/docs/latest/api/python/reference/pyspark.pandas/api/pyspark.pandas.DataFrame.to_delta.html), [2](https://stackoverflow.com/a/72759021/2650427).
- Since the Scikit has vectorised training and inferencing, its kNN would likely be faster. This [post](https://adventuresindatascience.wordpress.com/2016/04/02/integrating-spark-with-Scikit-learn-visualizing-eigenvectors-and-fun/) shows how to do it. I would probably replace the `map` with `mapPartitions`.
