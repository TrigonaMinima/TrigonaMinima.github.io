---
layout: post
title: "Training Word2vec on PySpark"
date: "2023-10-05"
categories:
---

When the world is working with the LLM embeddings, why am I talking about Word2vec?

Context changes things:

- Strong baseline that is quick to production.
- Latency requirements: a small dimension size helps with keeping latencies and costs low. Open AI gives an embedding vector of size 1,536. (I didn't want to do dimensionality reduction.)
- I didn't want to send the proprietary data to Open AI.
- I had millions of documents. I didn't want to incur the one-time cost of calling OpenAI.

So, back to w2v.

## Embeddings and Word2vec

Before that, what are embeddings and word2vec?

I will not get into explaining embeddings. You can read this post on [vector space models]({% post_url 2016-11-02-vsm-to-rec-sys %}) to understand more about embeddings. Another good introduction can be found here: [Embeddings: What they are and why they matter](https://simonwillison.net/2023/Oct/23/embeddings/).

The [Word2vec](https://en.wikipedia.org/wiki/Word2vec) (w2v) model is one of the models to get embeddings of a given text document. This [beautiful illustrated description](https://jalammar.github.io/illustrated-word2vec/) of w2v explains the general algorithm in detail. This [SO answer](https://stackoverflow.com/a/52392150/2650427) doesn't explain the algorithm, but explains the input and output of a w2v model.

## Setup

The documents in my case were item names of restaurant menu items. Additionally, I added other metadata like item category (from customer food taxonomy) and classifications like beverage, desserts, etc. The min tokens in a sentence were two and max were fifty.

I needed vectors that represent the item to perform similarity checks.

## Model Parameters

The w2v algorithm has multiple parameters. The important ones:

1. **Vector Size**: the size of the final embedding vector the model should output. I kept it at 32. The bigger the dimension size the more descriptive and richer the embeddings would be.
2. **Window Size**: Window size controls the number of words to keep in context while training the model. You can refer this [illustrated description of w2v](https://jalammar.github.io/illustrated-word2vec/) to understand how what window is. The higher the window size the more the context the model gets.
> Larger windows tend to capture more topic/domain information: what other words (of any type) are used in related discussions? Smaller windows tend to capture more about word itself: what other words are functionally similar? (Their own extension, the dependency-based embeddings, seems best at finding most-similar words, synonyms or obvious-alternatives that could drop-in as replacements of the origin word.) Ref: [Word2Vec: Effect of window size used](https://stackoverflow.com/a/30447723/2650427)
In my case, a window size of 4 worked well.
3.



general https://stackoverflow.com/questions/22272370/word2vec-effect-of-window-size-used

- hierarchical softmax: https://stats.stackexchange.com/questions/180076/why-is-hierarchical-softmax-better-for-infrequent-words-while-negative-sampling
- Hierarchical softmax and negative sampling: https://towardsdatascience.com/hierarchical-softmax-and-negative-sampling-short-notes-worth-telling-2672010dbe08
- Negative Sampling vs Hierarchical Softmax: https://flavien-vidal.medium.com/negative-sampling-vs-hierarchical-softmax-462d063dfca4
- https://stackoverflow.com/questions/46860197/doc2vec-and-word2vec-with-negative-sampling
- not use negative-sampling?: https://stackoverflow.com/questions/50221113/how-to-configure-word2vec-to-not-use-negative-sampling
- How to Use Negative Sampling With Word2Vec Model? https://analyticsindiamag.com/how-to-use-negative-sampling-with-word2vec-model/


- max iter = 20
- minCount = 2,


## Efficient Training in Spark

- efficient w2v training in spark: https://stackoverflow.com/questions/34377742/how-to-train-word2vec-model-efficiently-in-the-spark-cluster-environment
- w2v in spark: https://medium.com/@the.data.yoga/creating-word2vec-embeddings-on-a-large-text-corpus-with-pyspark-469007116551



## Word Vectors

- Understanding output of Word2Vec transform method: https://stackoverflow.com/questions/41374498/understanding-output-of-word2vec-transform-method



## Sentence Embeddings

- phrase vectors: https://stats.stackexchange.com/questions/267215/how-to-use-multiple-words-token-with-gensim-word2vec
- combining embeddings: https://datascience.stackexchange.com/questions/63533/ways-to-combine-embeddings
- Combining Word Embeddings to form Document Embeddings: https://medium.com/analytics-vidhya/combining-word-embeddings-to-form-document-embeddings-9135a66ae0f
- get sentence vectors from word vectors: https://stackoverflow.com/questions/29760935/how-to-get-vector-for-a-sentence-from-the-word2vec-of-tokens-in-sentence


## Cosine Similarity

- emb sim: https://developers.google.com/machine-learning/clustering/similarity/measuring-similarity






------

- w2v on 1 sentence docs: https://stackoverflow.com/questions/67185941/word2vec-on-documents-each-one-containing-one-sentence


- gensim context: https://stackoverflow.com/questions/47598369/does-word2vec-realization-from-gensim-go-beyond-sentence-level-when-examining-co



