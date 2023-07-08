---
layout: post
title: "[Mini] How to Parse JSON in Spark without Knowing the Schema?"
date: "2023-07-08"
categories:
---

## Problem Statement

I have a JSON column in my DataFrame.

- The JSON is in string format.
- It is a nested JSON.
- It is a large string.
- I do not know the schema and want to avoid defining it manually.
- All the JSONs follow the same schema definition.

I need to format it as a JSON object ([`struct`](https://spark.apache.org/docs/2.2.1/api/java/org/apache/spark/sql/types/StructType.html)) to extract anything out of it. How do I convert it into a `struct`?


## Solution

Here is the solution if you are short on time. In the next section, I discuss it in more detail.

{% highlight python linenos %}
# Spark 3.2.1 | Scala 2.12
import pyspark.sql.functions as F

# Sample json we will work with.
sample_json = """
{
  "lvl1":  {
    "lvl2a": {
      "lvl3a":   {
        "lvl4a": "random_data",
        "lvl4b": "random_data"
      }
    },
    "lvl2b":   {
      "lvl3a":   {
        "lvl4a": "ramdom_data"
      },
      "lvl3b":  [
        {"lvl4a": "random_data"},
        {"lvl4b": "random_data"}
      ]
    }
  }
}
"""

# Spark dataframe with json column
df = spark.createDataFrame([(sample_json,)]*4, ["json_data"])

# determine the schema
json_schema = F.schema_of_json(df.select(F.col("json_data")).first()[0])

# converting json to struct
df = df.withColumn("json_data_struct", F.from_json("json_data", json_schema))

{% endhighlight %}


## Details

We will use [`pyspark.sql.functions.schema_of_json`](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.functions.schema_of_json.html) to do our dirty work of determining the schema.

Just like any other column-based function, I expected this function to work on a column. So I tried this as below:


{% highlight python %}
df = df.withColumn("sch", F.schema_of_json(F.col("json_data")))
{% endhighlight %}

It threw the below error:

{% highlight shell %}
AnalysisException: cannot resolve 'schema_of_json(json_data)' due to data type mismatch: The input json should be a foldable string expression and not null; however, got json_data.;
...
{% endhighlight %}

I did not know what is a *foldable string*. The data type of the `json_data` column was a string. The ChatGPT also suggested the same way of using this function. :)

The [documentation](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.functions.schema_of_json.html) and multiple Stack Overflow answers [[1](https://stackoverflow.com/a/64032076/2650427), [2](https://stackoverflow.com/a/64077996/2650427), [3](https://stackoverflow.com/a/59143129/2650427)] helped me reach an explanation.

The `schema_of_json` needs a single string instead of a column. So I extracted one JSON string from the column and passed it to the function. This is how I did it:

{% highlight python linenos %}
json_string = df.select(F.col("json_data")).first()[0]
json_schema = F.schema_of_json(json_string)
{% endhighlight %}

The end.

<br>
