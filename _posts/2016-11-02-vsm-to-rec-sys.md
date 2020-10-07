---
layout: post
title:  "From Vector Space Models to Recommender Systems"
date:   2016-11-02
categories: Recommender-systems NLP
annotation: Recommender-systems
---

## Vector Space Models (VSM)

### What is it?

A VSM is a way to represent a document in an *n-dimensional space vector* where "n" is the size of the vocabulary of *terms* present in the set of documents that we are trying to represent. These *terms*, can be, individual words in the documents or some keywords from the documents that we want to focus on or longer phrases and are largely dependent on the problem at hand. If you are familiar with basic 3D vector mathematics (normal 3D space, in non-fancy words, that we interact with daily), then VSM can be thought of as a point or directed line corresponding to each document in a n-dimensional space emanating from the origin. Thus, each document will be embedded in a n-D space as a directed line or a point.

Lets say we want to make the vectors from individual words. To keep the visualization easy, I am fixing my vocabulary to only 3 words with my documents as follows (btw, *The Boxer Rebellion* is a band's name).

- **Document 1**: The boxer rebellion
- **Document 2**: The boxer
- **Document 3**: The rebellion

Lets assume, our 3D axes (x, y and z) are called "rebellion", "the", "boxer" respectively. So, our documents can be represented in vector form as follows:

- Document 1: [1, 1, 1]
- Document 2: [0, 1, 1]
- Document 3: [1, 1, 0]

Here, the value 1 means that that word is present in the document and 0 means absent. There are many techniques to determine these "values" (or weights) that we'll talk about a little later. In a 3D space our documents, now, can be visualized as below:

<!-- <img src="/assets/2016-11/VSM1.png" style="display: block;margin-left: auto;margin-right: auto;"> -->
<img src="{{ site.url }}/assets/2016-11/VSM1.png" style="display: block;margin-left: auto;margin-right: auto;">

### Term weights

There's a concept of term document matrix. Usually, where ever VSMs are used, we have a lot of documents (or at least, we assume there will be), so we build a term document matrix. Here, each row is a term and each column is a document. Hence, term-document matrix, duh! In short, our example will become as follows,

||doc1|doc2|doc3|
|:----| :----: | :----: | :----: |
|**the**|1|1|1|
|**boxer**|1|1|0|
|**rebellion**|1|0|1|

<br>

Lets talk about the values with which this matrix can be filled. All of these methods (models or techniques) are built upon the [bag-of-words model](https://en.wikipedia.org/wiki/Bag-of-words_model). Here, we take all the unique words (or phrases or tokens) from all the documents and create a common dictionary in no particular sequence (whether grammatically or the order in which they occur in the original text). Basically, all the words from the documents collected into a bag, hence, "bag-of-words".

1. **Binary Model**

    Binary model is the model, we used in our example above to create the document vectors, where each value is just an indication whether that word is occurring in that document or not. Thus, only ones and zeros. This model takes into account the presence or absence of a word in the document, but it doesn't take anything like the number of times a word has occurred in the document. For example, in the eyes of a binary model, 2 documents - one where we talk about Facebook and another one where we talk about social networking sites in general - will be very similar (actually, exactly the same) if we were judging based on the word facebook, but in reality, the 2nd document is not that similar.

2. **Count Model**

    Yeah, you guessed it right! Instead of having 1 or 0 for the presence or absence of a word, it gives the count of a particular word in that document. In our example, though, the term-document matrix will remain same as binary model. This model is better than the binary model as it also covers the occurrence of the words in every document. Hence, it'll be able to differentiate between the 2 documents taken in our previous example (last paragraph).

    <!--     ||doc1|doc2|
        | :---- | :----: | :----: |
        |**facebook**|6|2|
        |**social**|3|6|
 -->

    <!-- <img src="/assets/2016-11/count_vsm.png" style="display: block;margin-left: auto;margin-right: auto;"> -->
    <img src="{{ site.url }}/assets/2016-11/count_vsm.png" style="display: block;margin-left: auto;margin-right: auto;">

    You see? The separation has changed (from zero degrees as in binary model) between the two documents. This model still has a few limitations though. In any document of English language, there are mostly filler words, words like - a, an, the, then, that, by, of. These words, in particular, doesn't give any indication about the theme a document might be talking about. These words are called [stop words](https://en.wikipedia.org/wiki/Stop_words). Even if, these words are filtered out before applying the model, there are situations where, a thematic word might become a stop word for our use case. For example, if our corpus contains all the articles about instrumental music, then having the word "instrumental" in our vocabulary wont be much helpful as we already know our data is about instrumental music and the word instrumental is bound to occur in abundance in our data. Thus, it is a stop word for our use case. Another limitation is that the word count can be anything. By anything, I mean, there can be a document with a very high count of a word and the count of same word in another document can we very low or may be even zero. What this does is, it kind of, amplifies the separation between the documents. If we take the above figure, we can see that, both documents could have been more similar but the separation was big between the documents.

3. **Log-freq Weighing Model**

    This model is a slight variation of the Count Model to counter the skewness of the separation. Here, instead of the word frequency in each document, $$\displaystyle \mathrm {1+log_{10}(word\_freq)}$$ is taken. So, according to a logarithm graph, it gives high values for lower frequencies but lower values with high frequencies (although, higher than the values obtained from the lower frequencies). So, our term-document matrix now becomes,

    <!--     ||doc1|doc2|
        | :---- | :----: | :----: |
        |**facebook**|1.778|1.301|
        |**social**|1.477|1.778|
 -->

    <!-- <img src="/assets/2016-11/log_freq_vsm.png" style="display: block;margin-left: auto;margin-right: auto;"> -->
    <img src="{{ site.url }}/assets/2016-11/log_freq_vsm.png" style="display: block;margin-left: auto;margin-right: auto;">

    Now, this decreased the separation between the documents significantly, but it still doesn't handle the stop words issue.

4. **Term Frequency-Inverse Document Frequency Model (tf-idf)**

    This is the model which covers all the limitations of the models described above. In the model name, *term frequency* is, as the name suggests, the frequency of occurrence of each term in the document, whereas, *inverse document frequency* is to counter the effect of that term according to the specificity of that term across all of the documents. Mathematically, <u>term frequency</u> ($${\displaystyle \mathrm {tf} (t,d)}$$) can be calculated using any of the following formulas.

     - **Raw frequency**
         Just the ratio of term count to the total word count of the document.

     $$
    {\displaystyle \mathrm {tf} (t,d)={ \frac {term\_count} {|d|}} }
     $$

     - **Log normalized frequency**
        Exactly the same as described in the log normalized model.

     $$
    {\displaystyle \mathrm {tf} (t,d)=1+log_{10}(word\_freq) }
     $$

     - **Double normalization k (0 < k < 1)**
        This is made to prevent the bias towards the longer documents. The formula effectively is, the term's raw frequency divided the maximum raw frequency of any term in that document.

    $$
    {\displaystyle \mathrm {tf} (t,d)=k+(1-k)\cdot {\frac {f_{t,d}}{\max\{f_{t',d}:t'\in d\}}}}
    $$

    And similarly, <u>inverse document frequency</u> ($${\displaystyle \mathrm {idf} (t,D)}$$), which is a [log normalized](https://en.wikipedia.org/wiki/Logarithmic_scale) inverse fraction determined using the following expression where $${\displaystyle \mathrm N}$$ is the total number of documents and the **denominator** denotes the number of documents having the term t. If this count is 0 then a value of 1 is taken as the adjusted count. You see, the ratio of, count of, total documents to the documents having a particular term, determines the specificity or the exclusivity or commonness of that term across our corpus. Thus, if this exclusivity is better (meaning the term is rare in our corpus) then the idf will be larger and vice versa.

    $$
    {\displaystyle \mathrm {idf} (t,D)=\log {\frac {N}{|\{d\in D:t\in d\}|}}}
    $$

    Finlly, the tf-idf score is calculated by just multiplying $${\displaystyle \mathrm {tf}}$$ and $${\displaystyle \mathrm {idf}}$$. Now, lets calculate the first value using tfidf.

    $$
    {\displaystyle \mathrm {tfidf} (facebook,doc1,D)= {\frac {6} {9}}\cdot log \frac {2} {2} = {\frac {6} {9}} \cdot 0 = 0}
    $$

    Unfortunately, all the values for our new term-document matrix will come out to be zero resulting in both documents being exactly same in similarity metric. I didn't see that coming, but really we will never have documents like these in reality.

### The need for VSMs

The domain of Natural Language Processing deals with the text, a collection of words. There are no numbers to deal with. In images, for example, there are RGB values of each pixel to deal with which are encoded in numbers. In the case of text, there is nothing but words and characters. We have to find out ways to convert those *features* into numbers so that our algorithms can do some computations on it. And, converting a document into a VSM opened up some new avenues for us. Firstly, there are linear algebra concepts that can be applied to our computations, to make them efficient and scalable, to arrive at the results. Secondly, by converting our documents into a space vector we got some neat techniques (from n-dimensional mathematics) under our belt to arrive at some new insights. We can determine euclidean distance between two points telling us about the distance between 2 documents (this is not a good idea - [watch this](https://youtu.be/ZEkO8QSlynY)). We can, also, find out the angle between two vectors, representing two different documents, which can be taken as a proxy for the similarity between the documents. For example, lets say, we have one more document in our previous set of documents,

- **Document 1**: The boxer rebellion [1, 1, 1]
- **Document 2**: The boxer [0, 1, 1]
- **Document 3**: The rebellion [1, 1, 0]
- **Document 4**: Rebellion [1, 0, 0]

Now, if we consider these pairs individually, then for each pair we can intuitively say that,

- (D1, D4): There's just one word in common and they are kinda similar in meaning.
- (D2, D4): There are no common words and they mean completely different as well.
- (D3, D4): Here, there's one common word and they almost mean the same.

Now, if I ask, what should be the separation between these pairs? Intuitively, one can say that, D2 and D4 will be farther from each other, D1 and D4 will be a bit closer, and D3 and D4 will be more closer. Indeed, we see the similar pattern, with angles as 45°, 90°, and ~54° respectively.

<!-- <img src="/assets/2016-11/VSM_angles.png" style="display: block;margin-left: auto;margin-right: auto;"> -->
<img src="{{ site.url }}/assets/2016-11/VSM_angles.png" style="display: block;margin-left: auto;margin-right: auto;">

A similar calculation can be applied on the vectors of the size of the number of documents on the corpus. Thus, for each word there will be a vector in a m-Dimensional space where m is the number of documents. And, using the same similarity score calculation, we can find out the *statistical synonyms* of each word from our corpus. These word vectors, if I am correct, can also be called *word embeddings*, but more about that in some other time.

### So, a quick summary?

1. We have a n-dimensional vector space where n is the size of our vocabulary.
2. Each term (word, keyword, phrase, etc) in our vocabulary is an axis.
3. Documents are points or vectors in this n-D space.
4. With this encoding, we can apply vector mathematics by creating a term-document matrix.
5. There are many methods of obtaining each value of these document vectors, namely, binary, count, log normalized and tfidf.
6. tfidf is the most practical and useful score.
7. With this vector representation we are able to calculate similarity between documents which can be used in Information Retrieval or Recommender Systems.

### Doing it in Python

What's the point of all the above theory if we are not going to actually apply it? This section will explain the generation of a term-document matrix out of our documents using the machine learning python library, [scikit-learn](http://scikit-learn.org/stable/). Later in this article we will make a recommendation system using our term-document matrix made in this step. Lets start.

So, to create a term-document matrix there's a direct implementation in scikit-learn library. It is defined in [sklearn.feature_extraction.text.TfidfVectorizer](http://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html#sklearn.feature_extraction.text.TfidfVectorizer.transform). Let our documents be.


{% highlight python %}
docs = [
    "The boxer rebellion",
    "The boxer",
    "The rebellion"
]
{% endhighlight %}

The vectorizer can be defined as follows:

{% highlight python %}
from sklearn.feature_extraction.text import TfidfVectorizer

args = {
    "stop_words": "english",
    "lowercase": True,
    "norm": "l2",
    "use_idf": True,
    "smooth_idf": True,
    "sublinear_tf": True
}

vectorizer = TfidfVectorizer(**args)
{% endhighlight %}

In the ```args``` dictionary defined above, ```"stop_words": "english"``` makes the vectorizer to remove the stop words from the documents. So, "the" from our documents will be removed before calculating the tfidf scores. The option for ```lowercase``` converts all the characters into the lower case. With the use of ```"use_idf": True``` option we will get the <u>tfidf scores</u> else we would have gotten the <u>tf scores</u>. ```"smooth_idf": True``` means one will added to the document frequencies so that division by zero can be prevented. ```"sublinear_tf": True``` replaces ```tf``` with $$1 + log(tf)$$ (log normalization). The ```norm``` option defines the normalization of the vectors made; ```l2``` means the vectors are normalized by the euclidean norm, formally, given as.

$$
{\displaystyle \mathrm v_{norm} = \frac{v}{||v||_2} = \frac{v}{\sqrt{v{_1}^2 + v{_2}^2 + \dots + v{_n}^2}} }
$$

There are more options, which are explained in this [user guide](http://scikit-learn.org/stable/modules/feature_extraction.html#text-feature-extraction) provided by the scikit-learn documentation. Now, it's time to get the tfidf term-document matrix.

{% highlight python %}
train_tdm = vectorizer.fit_transform(docs)

print(vectorizer.get_feature_names())
# ['boxer', 'rebellion']

print(train_tdm.toarray())
#[[ 0.70710678  0.70710678]
# [ 1.          0.        ]
# [ 0.          1.        ]]
{% endhighlight %}

Thus, we got the term-document matrix for our documents. The use of this matrix will be shown later in the article when we will be getting recommendations based on documents upon which we just made the matrix.

## Recommender Systems

You can get a basic understanding of recommendation systems from this article - [Understanding basics of Recommendation Engines (with case study)](https://www.analyticsvidhya.com/blog/2015/10/recommendation-engines/). It's lacking a bit here and there, but still a *simple introduction* to the topic. I'll still give a quick summary about the topic and then move on to the kind of recommendation engine I want to construct for my personal usage.

### What is it?

Recommender Systems are something which recommend you some new content - book recommendations ([Goodreads](https://www.goodreads.com)), movie recommendations ([Netflix](https://www.netflix.com/in/)), product recommendations (Amazon) and many more such things - based on your content history and/or users similar to you.

There are two major major kinds of recommendations engines:

1. Content-Based Recommendation Engines

    Here the recommendations are based on your past history. So, to give you any recommendations, the system has to know what are the items you have liked or disliked previously, to get patterns out. To understand them a bit better you can have a look at [Beginners Guide to learn about Content Based Recommender Engines](https://www.analyticsvidhya.com/blog/2015/08/beginners-guide-learn-content-based-recommender-systems/).

2. Collaborative Recommendation Engines

    Here, the system finds users similar to you, based your history or based on some common data (location in world, age, gender, etc), and then recommend the items that others have liked but you haven't yet seen them.

These are the two kinds there are, now, you can use any of them or a combination of those to suit your application.

### What I am up to?

I try to follow a lot of technical blogs to keep myself updated with the technological changes and interesting stories (usually, technical) around the internet. But I was facing the issue that I wanted all the articles at one place and not go to the individual sites to see them. I could have easily used some blog aggregator service or, may be, made a very basic *new blog articles fetcher*, but then there was the issue that, not every article of every blog is awesome. And, I definitely have limited time to go through each of them. So, I though to make a system to fetch all the latest articles published and recommend me the ones which align with my interests. And, that's what I am building. I have thought of a few standard techniques to implement and then I'll test each out out live. Then lets see where this goes. Anyway, since, I am the only user in the system, this recommendation engine is going to be **content-based** one.

First thing I am gonna be implementing is the very basic version of a content-based recommendation engine. I have some 100+ articles that I like. So, this is going to be my corpus. Since we are talking about blog recommendation system, there has to be vector space models for each document. Training my recommendation engine upon those VSMs, it is going to recommend me the next great articles out of the new ones. The code above gives me the tfidf based VSMs for my whole corpus. Now, the next step is to fetch the new article content, create a VSM for that article based on the vocabulary of my training corpus and then find the similarity (cosine similarity) between each liked article to the new article. Now, if the maximum similarity score among all the scores, passes a certain threshold, then it'll be recommended to me, else discarded.

There were a few things that should be discussed here.

1. **What is cosine similarity and why is it being used?**

    In the **The need for VSMs** section, I discussed about the angle being the representative of the level of similarity between the articles. Cosine similarity is the measure of that angle. The domain of the angle between articles will be from 0° to 180° where 0° means the most similar vectors. And, cosine value at an angle of 0° gives a value of 1 (meaning most similar) and that of 180° as -1 (most dissimilar). Thus, the cosine value goes from 0 to 1, if the similarity increases between documents. The calculation of cosine of an angle is also easier than calculating the exact angle. So, it helps in many ways by using the cosine similarity.

2. **How does using words as features (bag-of-words) help?**

    Bag-of-words model depends on the so-called **[Distributional Hypothesis](https://en.wikipedia.org/wiki/Distributional_semantics)** concept in linguistics, which states that,

    > linguistic items with similar distributions have similar meanings.

    Now, here we don't take the order of the words in the document or the semantics of the document into account. But based on distributional hypothesis, we can assume that the articles which have similar distribution of words are similar in meanings. Furthermore, the count of the words might change the meaning/intent of the articles which is handled by the tfidf measure.

    And, if this still doesn't work, we can use word level bi-grams (or tri-grams) to take into account some of the document's structural context. In fact, this option is one of the things, I have on my list to try to see if it gives me better results.

### Again, coming to Python implementation

{% highlight python %}
from sklearn.feature_extraction.text import TfidfVectorizer

args = {
    "stop_words": "english",
    "lowercase": True,
    "norm": "l2",
    "use_idf": True,
    "smooth_idf": True,
    "sublinear_tf": True
}
vectorizer = TfidfVectorizer(**args)

docs = [
    "The boxer rebellion",
    "The boxer",
    "The rebellion"
]
train_tdm = vectorizer.fit_transform(docs)
{% endhighlight %}

Above code snippet is our previous code written together. It prepares a tfidf based term-document matrix from our set of documents. This term-document matrix has a vocabulary defined from the words found in all the docs. Now, lets say, we got a new document - boxer in rebellion. Here "in" was not the part of the vocabulary of our training set so this word will be ignored while creating the term-document matrix of this new document against the training data.

{% highlight python %}
new_doc = ["boxer in rebellion"]
test_tdm = vectorizer.transform(new_doc)
{% endhighlight %}

Note, here we used the method ```vectorizer.transform()``` instead of ```vectorizer.fit_transform()```. The latter creates a vocabulary and returns a term-document matrix according to that vocabulary whereas, the former only returns the term-document matrix based on the vocabulary of the new document passed. Thus, here any new word in the new document will be ignored. We'll calculate the similarity of this new document to every document in the training data.

{% highlight python %}
from sklearn.metrics.pairwise import linear_kernel

# train_tdm is a 3X2 matrix and test_tdm is a 1X2 matrix.
# The following code returns a 3X1 matrix
similarities = linear_kernel(train_tdm, test_tdm)
#array([[ 1.        ],
#       [ 0.70710678],
#       [ 0.70710678]])

index = similarities.argsort(axis=None)[-1]
# 0

score = similarities[index]
# array([ 1.])

article = docs[index]
# 'The boxer rebellion'
{% endhighlight %}

The method ```linear_kernel()``` multiplies one vector to another. You might have noticed that we needed *dot product* to calculate the cosine similarity whereas, we have just multiplied the two vector here. The reason is, while preparing the term-document matrix, we provided an argument, ```"norm": "l2"``` to ```TfidfVectorizer()```, this calculated the normalized values of the vectors. Thus, we only had to do the simple multiplication of 2 vectors to get the dot product.


## Conclusion

The aim of this post was to document the internals of the Vector Space Models and the basic understanding of the recommendation engine in a barely working form. This is the most basic recommendation engine that can be built. There's nothing new being done here. In future posts, I am going to write about some more sophisticated techniques that should work better than this basic one. But before exploring (and testing) those techniques, I have to make a complete working system, where I am gonna use this recommendation-engine. I am creating a sort of utility (bot/intelligence/etc) where I have many bots running on various slack channels which will do specific things, giving me new articles to read, for instance. I chose [Slack](https://slack.com/) because then I can access the platform from my android, web or laptop. I have to figure out some design details about this whole system. I'll talk about that whole thing in detail in some other post.
