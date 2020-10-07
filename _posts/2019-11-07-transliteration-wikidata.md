---
layout: post
title: "Wikidata for Transliteration Pairs"
date: 2019-11-07
categories: NLP Data
annotation: Training Data
---

Many researchers use Wikipedia as a source of data to train NLP models. The public domain nature of the crowd-sourced articles on wide-ranging topics in multiple languages opens up a lot of possibilities for research. There are multiple modes of data extraction from Wikipedia:

- [DBpedia](https://wiki.dbpedia.org/) type data where a community has written tools to extract the structured data of the [infoboxes](https://en.wikipedia.org/wiki/Infobox) of the Wikipedia pages;
- Article texts of the Wikipedia articles;
- Metadata of each Wikipedia article containing - title, description, aliases, title in many languages, and a lot more other information.

This data can be used for multiple purposes. Article text can be used to train word embeddings like [Word2vec](https://en.wikipedia.org/wiki/Word2vec), [Glove](https://nlp.stanford.edu/projects/glove/), [Flair](https://github.com/zalandoresearch/flair) etc. Article text can also be used to train language models like [BERT](https://ai.googleblog.com/2018/11/open-sourcing-bert-state-of-art-pre.html), [GPT2](https://openai.com/blog/better-language-models/), [ULMFiT](https://arxiv.org/abs/1801.06146), [XLNet](https://github.com/zihangdai/xlnet), [MultiFiT](http://nlp.fast.ai/) etc. Structured data can be used to do disambiguation, entity recognition, translation, build knowledge graphs and to solve a wide variety of other NLP problems. Metadata can be used for many purposes. Transliteration is one of them. In this article I'll describe how I was able to quickly create a training dataset for a [transliteration](https://en.wikipedia.org/wiki/Transliteration) model. With this process, I extracted more than 87K unique English-Hindi Transliteration pairs (a source string and a target string). To read more about transliteration you can read this [very short introduction]({% post_url 2018-06-16-hinglish-and-transliteration %}) to transliteration of Hindi or Romanized Hindi or Hinglish.


# Data Source

This [download page](https://www.wikidata.org/wiki/Wikidata:Database_download/en) will give you all the information on the Wikidata and the different data formats available. I downloaded the Wikidata JSON dump, which is also the recommended way, from the [following index page](https://dumps.wikimedia.org/wikidatawiki/entities/). The snapshot (`latest-all.json.bz2`) I downloaded was created on `08-Oct-2019 11:29` and reached around 38GB in size on my HDD.

A few introductory articles about the Wikidata and the data dumps which helped me were:

- [Wikidata Home Page](https://www.wikidata.org/wiki/Wikidata:Main_Page)
- [Importing Wikidata Dumps - The Easy Part](https://topicseed.com/blog/importing-wikidata-dumps#updating-wikidata-dumps)


# Pre-processing

Before I decided to download the JSON dump, I had to see how can I process the data on my system using Python. After reading about the data format a bit, I learnt that Wikidata JSON dump is just a very big text file where each line is the JSON representation of the an item on Wikimedia sites. And this text file is zipped. So my processing logic flow was-

- Open the zip file;
- Open the text file inside;
- Read each line of the file;
- Parse the JSON string into a python dictionary;
- Extract the data;
- Save the data.

Since I didn't read in detail about the data format, to judge if the above process will fail, before starting with the code, I googled if a module is already present to process the dump. The [Tools for Programmers](https://www.wikidata.org/wiki/Wikidata:Tools/For_programmers) page gave me the name of the Python module that'll help me with this - [qwikidata](https://github.com/kensho-technologies/qwikidata/). That is what I really like about Python community: there is always a module to solve your problem.

The format of our file will be an English string followed by a pipe (\|) followed by a Hindi string - `left_string|right_string`. Following are three random lines from the final created dataset.

```sh
adinath|आदिनाथ
adipur|आदिपुर
adipurana|आदिपुराण
```

I'll interchangeably use the terms *en string*, *left string* or *source string* for the English string. Similarly, *hi string*, *right string* or *target string* for the Hindi string.


## Extraction

The [basic_json_dump.py](https://github.com/kensho-technologies/qwikidata/blob/master/examples/basic_json_dump.py) in the examples folder of the `qwikidata` Githib repo got me started with the processing of the JSON dump. With a quick look at the [data model page](https://www.mediawiki.org/wiki/Wikibase/DataModel/JSON), I gathered that the top level fields - `label`, `description` and `alias` - contain the language filter. In the final script, I used these three fields to extract the transliteration pairs. I didn't study the `claims` field, but I suspect that I missed some pairs data there.

The final JSON dump processing code is here - [datagen/wikidata2.py](https://github.com/TrigonaMinima/HinglishNLP/blob/master/datagen/wikidata2.py). Logic flow is same as I described earlier, but done using the `qwikidata` methods.

- Open the zip file and iterate through the file, done with the help of [WikidataJsonDump](https://qwikidata.readthedocs.io/en/stable/qwikidata.json_dump.html#qwikidata.json_dump.WikidataJsonDump) class which reads the zip and gives you an iterator over the lines of the file;
- Parse the JSON strings using [WikidataItem](https://qwikidata.readthedocs.io/en/stable/qwikidata.entity.html#qwikidata.entity.WikidataItem) and [WikidataProperty](https://qwikidata.readthedocs.io/en/stable/qwikidata.entity.html#qwikidata.entity.WikidataProperty) classes;
- Extract the English and Hindi versions of `label`, `description` and `alias` make them into pipe (\|) separated strings;
- Dump each pair in a file.

At the end of this extraction process, I had a ~500MB output text file (lets call it `pairs.txt`) from the 38GB Wikidata JSON dump. Each line was pipe (\|) separated en and hi strings as we established at the start of this section.

This `pairs.txt` contained a raft of transliteration pairs which was what I needed. I just had to get rid of all the noisy data. Now comes the divide and conquer strategy. Break your problem into small chunks and solve them independently. To create these small subproblems, I had to look into the data.

Vscode took some time to open the `pairs.txt`. First thing was to eliminate the completely useless rows. Brace yourself, a lot of regular expressions are going to be introduced now.

- If the source and target strings are same then that means that both the scripts are same in both the strings like numbers. Another reason can be that there are issues with the data and either both the strings are in Roman script or in Devanagari stript. Thus, it is a useless row for us. Replaced all such lines with blank using this regex - `^(.*)\|\1$\n`.

- If we don't have any target string for the source string then that line is also useless for us. This again is the issue with the source data. This regex removes the lines having a blank on the right side of the pipe: `^.*\|$\n`.

- The opposite of the previous case will also be invalid for us, that is, the examples where we have the target string and not the source string. I eliminated those rows using this regex: `^\|.*$\n`.

- After this, I removed the rows where both left and right strings were in roman form, that is, they were in English. This regex helped with that - `^[a-z \-0-9/\(\)\.]+\|[a-z \-0-9/\(\)\.]+$\n`

This removed a lot of junk. Note that, all of these steps could have been coded in the extraction script, but at the time of writing the script, I didn't think too much about all such cases. I wrote the script and ran it and then just went out for a few hours (it had to process a 38GB file without any parallel processing).

Now looking at the data, I saw many valid pairs were those where there were no spaces anywhere in the line. Lets call this set `pairs1`. The following grep command separated these rows into the `pairs1.txt` for me-

```sh
grep -Ei "^[^ ]+\|[^ ]+$" pairs.txt > pairs1.txt
```

The `-i` flag is ignore-case flag. Add an `-v` flag in the above command and you'll get all the non-matching lines.

```sh
grep -Eiv "^[^ ]+\|[^ ]+$" pairs.txt > pairs_temp.txt
mv pairs_temp.txt pairs.txt
```

Now `pairs.txt` only contains lines having at least one space in it.


## Automated Sifting

Another set of valid pairs, calling it - `pairs2`, was the rows where spaces were equal on both the sides of the pipe or number of space separated words were equal on both sides. I have made an assumption that all such pairs are word-by-word transliteration. Let's understand by examples:

1. Consider the pair: `tale of two cities|टेल ऑफ टू सिटिज़`. Here, there are four words on both sides of pipe and each English word is parallelly transliterated in Hindi. `टेल` is the transliteration of `tale`; `ऑफ` is the transliteration of `of`; `टू` is the transliteration of `two` and `सिटिज़` is the transliteration of `cities`.

2. On the contrary, consider this pair: `middle kingdoms of india|भारत के मध्य साम्राज्य`. In this pair, even though both sides have same number of words, none of them are correct transliteration pairs when taken in parallel. `भारत` is not a transliteration of `middle`; `के` is not a transliteration of `kingdoms`; `मध्य` is not a transliteration of `of` and `साम्राज्य` is not a transliteration of `india`.

My assumption in extracting `pairs2` is that all the pairs are valid as in the 1st example. Once I have identified such rows, I create a list of such parallel transliterations and dump them to the `pairs2.txt`. So for both of the above examples, following eight lines will be added to the `pairs2.txt`-

1. `tale|टेल`
2. `of|ऑफ`
3. `two|टू`
4. `cities|सिटिज़`
5. `middle|भारत`
6. `kingdoms|के`
7. `of|मध्य`
8. `india|साम्राज्य`

This whole thing is covered by this small python script - [datagen/wiki_trans_align.py](https://github.com/TrigonaMinima/HinglishNLP/blob/master/datagen/wiki_trans_align.py). The `align_on_words` function (`line 8`) defines that logic of selecting if a particular line is in `pairs2` set. In the same file, `line 38` created a list of parallel transliteration same as in the above list.

Now the remaining rows are the ones where the spaces are unequal on both sides of the pipe. For such rows, since I couldn't find any particular pattern, I created the transliteration pairs by taking cross-product of the list of words for both the source and the target strings.

If we have 2 lists - `[1, 2]` and `[3, 4, 5]`: then their cross-product will be - `[(1, 3), (1, 4), (1, 5), (2, 3), (2, 4), (2, 5)]`. So if we have the following pair - `line of control|नियंत्रण रेखा` then we'll get the following `6` (3 words from the left and 2 words from the right) transliteration pairs:

1. `line|नियंत्रण`
2. `line|रेखा`
3. `of|नियंत्रण`
4. `of|रेखा`
5. `control|नियंत्रण`
6. `control|रेखा`

We write all such cross pairs in the `pairs3.txt` file. The *divide* part of the *divide and conquer strategy* is complete. Lets start with the *conquering*. We'll call the final file with the cleaned pairs, `pairs_final.txt`.

In order to find a quick way to separate all the valid cases, I used a few heuristics:

1. Created an ad-hoc transliteration function. It uses mappings of every Devanagari character to possible Roman characters. These codified mappings can be seen here - [datagen/utils/transliterate.py:L15](https://github.com/TrigonaMinima/HinglishNLP/blob/master/datagen/utils/transliterate.py#L15). This script was written by a friend to be used for some other purpose (check out this blog entry for details - [(Mis)adventures of Building a Chat Bot]({% post_url 2018-10-06-chatbot %})). Using this function, I generated the set of possible transliterations (`transliterations`) of the Hindi word (`hi`) in every pair. If the English word (`en`) from the pair lies in `transliterations`, this pair goes to `true.txt`. If this was unsuccessful then, next check is of the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) between `en` and all the transliterations in `transliterations` to be greater than `0.85`. If it is true, then this pair goes to `true.txt`. If this test also fails, then we check for the `max` levenshtein distance to be less than `0.5`. If true then it goes to `v_false.txt`. If all the conditions fail then the pair is dumped in `false.txt`. In simple words, if a few conditions are passed then the pair will be considered almost true; if it definitely fails a few conditions then it is assumed to be almost wrong; all the remaining ones are uncategorized. The thresholds, `0.85` and `0.5` were decided after trying various other values.

2. Upon observation, I saw that, in most of the correct pairs, the difference in lengths of English and Hindi words was under `3`. So another heuristic was to put all such pairs where difference was not under 3, in `v_false.txt` and the remaining ones in `false.txt`.

3. Created a filter function to extract the pairs where I took the frequent English word endings and mapped with their corresponding Hindi word endings. The mappings I created are here: [datagen/wiki_trans_filter.py:L62](https://github.com/TrigonaMinima/HinglishNLP/blob/master/datagen/wiki_trans_filter.py#L62). I put all these extracted words in `true.txt` and the remaining ones in `false.txt`.

The implementation of all these heuristics are in the following file: [datagen/wiki_trans_filter.py](https://github.com/TrigonaMinima/HinglishNLP/blob/master/datagen/wiki_trans_filter.py).

Since there were three files having transliteration pairs - `pairs1.txt`, `pairs2.txt` and `pairs3.txt` - for each file, I created `true.txt`, `false.txt` and `v_false.txt`. There's a high degree of confidence for most of the pairs in `true.txt` to be correct. Similarly, in `v_false.txt` most of the pairs would be wrong. Whereas, `false.txt` demanded more scrutiny. The filtered results (`true.txt`, `false.txt` and `v_false.txt`) created from the pairs of `pairs3.txt`, which was the noisiest file due to the cross product, also required more careful winnowing.

Here ended our automated step.


## Manual

There was nothing special about the manual process. Just going through all the rows and segregating all the valid ones. A few things helped increase the pace of the manual process.

As predicted, `true.txt` had mostly correct pairs. There were very few wrong pairs, but mostly, the processing of the true files finished very quickly. The same was true with the `v_false.txt`. Most of the pairs were categorically wrong. Only the `v_false.txt` file generated from the `pairs3.txt` contained many valid pairs and took some time to go through.

Most time, as noted earlier, was consumed by `false.txt`. I can't talk about the exact distribution, but if I had to guess, it could be in the ratio of 40/60 with correct to wrong pairs. While working on the these files, I realised that working on the sorted file will be much faster because, after sorting, you can quickly apply binary search sort of method for each pair to find the correct row and eliminate the others. This method worked because of the

- Presence of a lot of duplicate pairs; and the
- Presence of varying transliterations for a single English word.

So sorting by English words brought all the duplicates, varying (but correct), as well as, wrong transliterations for each en word together. Thus helping with quick elimination of wrong pairs. As each file was finished, the correct pairs were being added to the `pairs_final.txt`. Thus, giving us the final dataset in the end.

# Data Stats

Let's look at some of the data stats:

<br>

<div class="rendered_html">
<table style="margin-left: 0.5cm;">
  <tr>
    <th>Statistic</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>Extracted Pairs</td>
    <td><span style="font-weight:normal">217,393</span></td>
  </tr>
  <tr>
    <td>Unique Pairs</td>
    <td><span style="font-weight:normal">87,873</span></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal">English words</span></td>
    <td><span style="font-weight:normal">70,835</span></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal">Hindi words</span></td>
    <td><span style="font-weight:normal">75,434</span></td>
  </tr>
</table>
</div>

After going through this activity, I googled for transliteration datasets available in public domain. Here's the final list I was able to create - [data/transliteration](https://github.com/TrigonaMinima/HinglishNLP/blob/master/data/transliteration/). If you take a look at all the datasets, then you'll find that the largest dataset was contains around 70k unique transliteration pairs. That alone makes this Wiki dataset largest. I have also not deduped the dataset.

In the last two rows of the table, you can see that Hindi words are more than English words. This shows that for some English words there are multiple Hindi words (or transliterations), that is, for one English word there can be multiple transliterations.

<br>

<div class="rendered_html">
<table style="margin-left: 0.5cm;">
  <tr>
    <th>Statistic</th>
    <th>Min</th>
    <th>Max</th>
    <th>Mean</th>
    <th>Median</th>
    <th>Std</th>
  </tr>
  <tr>
    <td>Word Length (En)</td>
    <td>1</td>
    <td>33</td>
    <td>6.3</td>
    <td>6.0</td>
    <td>2.2</td>
  </tr>
  <tr>
    <td>Word Length (Hi)</td>
    <td>1</td>
    <td>33</td>
    <td>5.8</td>
    <td>6.0</td>
    <td>2.2</td>
  </tr>
</table>
</div>


Most of the descriptive stats are same for both English and Hindi words. This might be because of one-to-one mapping between English and Hindi sounds because this dataset is essentially, English dictionary words (Roman Script) written in Hindi (Devanagari Script). Or this might be because of something else which I haven't observed or understood.

# Conclusion

As explained in this blog post, using Wikidata, I was able to extract a decent number of training samples to train a neural transliteration model or to do any other analysis. The whole process took me around 3-4 days with 2-3 hours of work each day. That's not a lot of time. Plus it was just a single person doing the task. Plus it was obtained for free, from crowd-sourced data without any use of platforms like mturk. And since this data is crowd-sourced and checked, revised by many volunteers, the transliterations can also be assumed to be of excellent quality.

Wikipedia (and Wikidata) is a great source of data. It's upon us to find ways to extract data for our ML models. Now that I have this data, next step is to train a seq2seq model and see how it's doing on some unseen data (eg. [chats]({% post_url 2018-10-06-chatbot %})).
