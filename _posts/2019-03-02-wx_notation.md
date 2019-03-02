---
layout: post
title:  "Understanding WX notation"
date:   2019-03-02
categories: NLP Hindi
annotation: NLP
---


In this post, I'll discuss the [WX notation](https://en.wikipedia.org/wiki/WX_notation), which is used for computational processing of Indian languages. We'll work with Devanagri script which has 47 primary characters - 14 vowels ans 33 consonants. We'll see how using WX notation, we can convert from Devanagari unicode characters to Roman ASCII characters. This process of conversion of scripts is called [transliteration](https://en.wikipedia.org/wiki/Transliteration). So WX notation is a transliteration scheme which is specifically made for NLP. Note that, wx is not same as [informal transliteration](https://trigonaminima.github.io/2018/06/hinglish-and-transliteration/) used in general conversations. Each word will only have a single WX notation.

To understand how it works and why to use it, lets cover some background topics.


1. [Groundwork](#groundwork)
    1. [Devanagari Script for Hindi](#dev)
    2. [Prefix Code](#prefix)
    3. [Size: Unicode vs ASCII](#unicode_ascii)
2. [Why use WX notation](#why_wx)
3. [How WX works?](#how_wx)
4. [WX implementation](#wx)


```python
import re
import sys
import random
import string

import pandas as pd
```

## Groundwork <a name="groundwork"></a>

### 1. Devanagari Script <a name="dev"></a>

Since WX works on Devanagari script, it'll be good to have some understanding of the Devanagari character set - vowels and consonants - and how they combine thogether to make a word. Devanagari script has the following characterstics-

1. Conventions for writing in Devanagari focus on pronunciation.
2. There is no concept of letter case like in Roman script
3. A horizontal line runs along the top of full letters (a visual way to identify Devanagari script)

The arrangement of Devanagari letters is called varnamala (वर्णमाला)


{% highlight python linenos %}
hin_vowels = ["अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ"]
hin_sonorants = ["ऋ", "ॠ", "ऌ"]
hin_anuswara = ["अं"]
hin_nukta = ["़"]
hin_consonants = [
    "क", "ख", "ग", "घ", "ङ",
    "च", "छ", "ज", "झ", "ञ",
    "ट", "ठ", "ड", "ढ", "ण",
    "त", "थ", "द", "ध", "न",
    "प", "फ", "ब", "भ", "म",
    "य", "र", "ल", "व",
    "श", "ष", "स", "ह"
]
{% endhighlight %}

### 2. Prefix Code <a name="prefix"></a>

An example first. While adding the two factor authentication on any of your online account, the form asks for your cellphone number. It's usually prefixed with a country code or they ask you to add the country code. For India, it's +91. Now, if you look at the [complete list of country codes](https://en.wikipedia.org/wiki/List_of_country_calling_codes), you will not find any other country code starting with +91.

We will take the complete country codes list, take a random country code and check whether any other country code starts with the random country code. Let's see it in action.


{% highlight python linenos %}
all_country_codes = {
    0, 1, 7, 20, 27, 30, 31, 32, 33, 34, 36, 39, 40, 41, 43, 44, 45, 46, 47,
    48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 66, 81,
    82, 84, 86, 90, 91, 92, 93, 94, 95, 98, 211, 212, 213, 216, 218, 220,
    221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234,
    235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248,
    249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 260, 261, 262, 263,
    264, 265, 266, 267, 268, 269, 290, 291, 297, 298, 299, 350, 351, 352,
    353, 354, 355, 356, 357, 358, 359, 370, 371, 372, 373, 374, 375, 376,
    377, 378, 379, 380, 381, 382, 383, 385, 386, 387, 389, 420, 421, 423,
    500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 590, 591, 592, 593,
    594, 595, 596, 597, 598, 599, 670, 672, 673, 674, 675, 676, 677, 678,
    679, 680, 681, 682, 683, 685, 686, 687, 688, 689, 690, 691, 692, 800,
    808, 850, 852, 853, 855, 856, 870, 878, 880, 881, 882, 883, 886, 888,
    960, 961, 962, 963, 964, 965, 966, 967, 968, 970, 971, 972, 973, 974,
    975, 976, 977, 979, 992, 993, 994, 995, 996, 998
}

def get_codes_starting_with(prefix):
    """
    Prints all the country codes starting with the `prefix`.
    """
    found_codes = []
    for code in all_country_codes:
        if str(code).startswith(prefix):
            found_codes.append(code)
    return found_codes


check_codes = ["91", "1", "7", "41", "57"]
for check_code in check_codes:
    print("Prefix to check:", check_code)
    print("Found match:", *get_codes_starting_with(check_code))
    print()
{% endhighlight %}

    Prefix to check: 91
    Found match: 91

    Prefix to check: 1
    Found match: 1

    Prefix to check: 7
    Found match: 7

    Prefix to check: 41
    Found match: 41

    Prefix to check: 57
    Found match: 57



For each case, only the country code itself was found as a match. Prefix codes have a very useful property - given a sequence, you can identify each word uniquely without the need of any marker between words. Let's take the example of country codes again. We'll take 10 random country codes, concatenate them together into a single string and then we'll decode the string into the original 10 components.


{% highlight python linenos %}
random.seed(2019)
rand_codes = random.choices(list(all_country_codes), k=10)
print("Random country codes:", *rand_codes)
rand_codes_combined = "".join(map(str, rand_codes))
print("Concatenated codes string:", rand_codes_combined)

orig_rand_codes = []
current_code = ""
for i in rand_codes_combined:
    current_code += i
    if int(current_code) in all_country_codes:
        orig_rand_codes.append(current_code)
        current_code = ""

print("Decoded parts:", *orig_rand_codes)
{% endhighlight %}

    Random country codes: 421 381 994 65 853 421 507 993 382 503
    Concatenated codes string: 42138199465853421507993382503
    Decoded parts: 421 381 994 65 853 421 507 993 382 503


As you can see, decoding the sequence was very easy. And we didn't need any separator between the words.

### 3. Size: Unicode vs ASCII <a name="unicode_ascii"></a>

You can find a lot of literature on Unicode and ASCII. Their utilities, differences, etc. I'll discuss the size differences in Devanagari script and Roman script. Actually, Unicode is a superset of ASCII; the numbers 0-128 have the same meaning in ASCII, as they have in Unicode. Each ASCII character can be defined by using an 8-bit byte, whereas each Devanagari script character won't fit in a single byte, so multiple bytes are required to represent 1 character.

Let's look at the actual sizes of all the Roman and Devanagari characters.


{% highlight python linenos %}
print("Roman characters")
roman_chars = string.ascii_letters[:26]
for i, roman_char in enumerate(roman_chars):
    print((roman_char, len(roman_char.encode('utf8'))), end=" ")
    if (i+1)%10 == 0:
        print()
print()

print("\nDevanagari characters")
devanagari_chars = hin_vowels + hin_sonorants + hin_anuswara + hin_consonants
for i, devanagari_char in enumerate(devanagari_chars):
    print((devanagari_char, len(devanagari_char.encode('utf8'))), end=" ")
    if (i+1)%10 == 0:
        print()
print()
{% endhighlight %}

    Roman characters
    ('a', 1) ('b', 1) ('c', 1) ('d', 1) ('e', 1) ('f', 1) ('g', 1) ('h', 1) ('i', 1)
    ('j', 1) ('k', 1) ('l', 1) ('m', 1) ('n', 1) ('o', 1) ('p', 1) ('q', 1) ('r', 1)
    ('s', 1) ('t', 1)('u', 1) ('v', 1) ('w', 1) ('x', 1) ('y', 1) ('z', 1)

    Devanagari characters
    ('अ', 3) ('आ', 3) ('इ', 3) ('ई', 3) ('उ', 3) ('ऊ', 3) ('ए', 3) ('ऐ', 3) ('ओ', 3)
    ('औ', 3) ('ऋ', 3) ('ॠ', 3) ('ऌ', 3) ('अं', 6) ('क', 3) ('ख', 3) ('ग', 3) ('घ', 3)
    ('ङ', 3) ('च', 3) ('छ', 3) ('ज', 3) ('झ', 3) ('ञ', 3) ('ट', 3) ('ठ', 3) ('ड', 3)
    ('ढ', 3) ('ण', 3) ('त', 3) ('थ', 3) ('द', 3) ('ध', 3) ('न', 3) ('प', 3) ('फ', 3)
    ('ब', 3) ('भ', 3) ('म', 3) ('य', 3) ('र', 3) ('ल', 3) ('व', 3) ('श', 3) ('ष', 3)
    ('स', 3) ('ह', 3)


So all the Roman characters take 1 Byte each, whereas, all the Devanagari characters take 3 Bytes each in memory (except on which takes 6). Thus, Devanagari characters (Unicode) are more memory intensive than Roman characters (ASCII). And becasue of this, working with ASCII characters is more efficient.

## Why use WX notation? <a name="why_wx"></a>

Since WX was made specifically for NLP; it tries to make many things efficient and easy.

- Computational and Memory Efficiency
    1. In WX, every consonant and every vowel has a single mapping into Roman. Making it a prefix code. Advantageous of view we discussed in the previous section.
    2. As we are working with ASCII rather than Unicode, we also get memory efficiency. How it is memory efficient is discussed in the previous section.
- Readability
    3. WX allows one to read any Indic language string even if (s)he has no idea about the original script. This helps in analysis of the developed system.


## How WX works? <a name="how_wx"></a>

Now that we have understood the basic concept related to Devanagari script and the reasons why WX notation is helpful for us, we'll get into the workings of WX notation.

### Hindi to WX

At the base of WX notation is the following character mapping. Note that this mapping is complete. Actual mapping includes handling of various corner cases and more characters that are not a part of actual *varnamala*. I'll still show how the conversion is done using the below defined mapping. I'll take a few Hindi words, their true WX notation (determined using this [online Sanskrit toolkit](http://sanskrit.uohyd.ac.in/scl/)) and our function output.

Here's our Hindi to ASCII character mapping.

{% highlight python linenos %}
hin2wx_vowels = {
    "अ": "a",
    "आ": "A",
    "इ": "i",
    "ई": "I",
    "उ": "u",
    "ऊ": "U",
    "ए": "e",
    "ऐ": "E",
    "ओ": "o",
    "औ": "O",
    "ै": "E",
    "ा": "A",
    "ो": "o",
    "ू": "U",
    "ु": "u",
    "ि": "i",
    "ी": "I",
    "े": "e",
}
hin2wx_sonorants = {
    "ऋ": "q",
    "ॠ": "Q",
    "ऌ": "L"
}
hin2wx_anuswara = {"अं": "M", "ं": "M"}
hin2wx_consonants = {
    "क": "k",
    "ख": "K",
    "ग": "g",
    "घ": "G",
    "ङ": "f",
    "च": "c",
    "छ": "C",
    "ज": "j",
    "झ": "J",
    "ञ": "F",
    "ट": "t",
    "ठ": "T",
    "ड": "d",
    "ढ": "D",
    "ण": "N",
    "त": "w",
    "थ": "W",
    "द": "x",
    "ध": "X",
    "न": "n",
    "प": "p",
    "फ": "P",
    "ब": "b",
    "भ": "B",
    "म": "m",
    "य": "y",
    "र": "r",
    "ल": "l",
    "व": "v",
    "श": "S",
    "ष": "R",
    "स": "s",
    "ह": "h",
}
hin2wx_all = {
    **hin2wx_vowels, **hin2wx_anuswara,
    **hin2wx_sonorants, **hin2wx_consonants
}
{% endhighlight %}

Now, we'll define the Hindi to ASCII conversion function.

{% highlight python linenos %}
def is_vowel_hin(char):
    """
    Checks if the character is a vowel.
    """
    if char in hin2wx_anuswara or char in hin2wx_vowels:
        return True
    return False


def hin2wx(hin_string):
    """
    Converts the Hindi string to the WX string.

    This function goes through each character from the hin_string and
    maps it to a corresponding Roman character according to the
    Devanagari to Roman character mapping defined previously.
    """
    wx_string = []
    for i, current_char in enumerate(hin_string[:-1]):
        # skipping over the character as it's not included
        # in the mapping
        if current_char == "्":
            continue

        # get the Roman character for the Devanagari character
        wx_string.append(hin2wx_all[current_char])

        # Handling of "a" sound after a consonant if the next
        # character is not "्" which makes the previous character half
        if not is_vowel_hin(current_char):
            if hin_string[i+1] != "्" and not is_vowel_hin(hin_string[i+1]):
                wx_string.append(hin2wx_all["अ"])

    wx_string.append(hin2wx_all[hin_string[-1]])
    if not is_vowel_hin(hin_string[-1]):
        wx_string.append(hin2wx_all["अ"])

    wx_string = "".join(wx_string)

    # consonant + anuswara should be replaced by
    # consonant + "a" sound + anuswara
    reg1 = re.compile("([kKgGfcCjJFtTdDNwWxXnpPbBmyrlvSRsh])M")
    wx_string = reg1.sub("\g<1>aM", wx_string)

    # consonant + anuswara should be replaced by
    # consonant + "a" sound + anuswara
    reg1 = re.compile("([kKgGfcCjJFtTdDNwWxXnpPbBmyrlvSRsh])M")
    wx_string = reg1.sub("\g<1>aM", wx_string)

    return wx_string
{% endhighlight %}

Let's evaluate our conversion function.

{% highlight python linenos %}
pairs = [
    ("शहरों", "SaharoM"),
    ("खूबसूरत", "KUbasUrawa"),
    ("बैंगलोर", "bEMgalora"),
    ("कोलकाता", "kolakAwA"),
    ("हैदराबाद", "hExarAbAxa"),
    ("कोझिकोडे", "koJikode"),
    ("सफर", "saPara"),
    ("उसमे", "usame"),
    ("संभावनाओं", "saMBAvanAoM"),
    ("मुंबई", "muMbaI"),
    ("नई", "naI"),
    ("मंगलवार", "maMgalavAra"),
    ("घंटे", "GaMte"),
    ("ट्रंप", "traMpa"),
    ("डोनाल्ड", "donAlda"),
    ("स्टेट", "steta"),
    ("संगठन", "saMgaTana"),
    ("प्रतिबंध", "prawibaMXa"),
    ("एंड", "eMda"),
    ("अंदेशे", "aMxeSe")
]

test_df = pd.DataFrame(pairs, columns=["Hindi String", "Actual WX"])
test_df["Our WX"] = test_df["Hindi String"].apply(hin2wx)
test_df["Both WX eq?"] = test_df["Actual WX"] == test_df["Our WX"]
test_df.index = test_df.index + 1
print(test_df)
{% endhighlight %}


<div class="rendered_html">
    <table style="margin-left: 0;">
      <thead>
        <tr>
          <th></th>
          <th>Hindi String</th>
          <th>Actual WX</th>
          <th>Our WX</th>
          <th>Both WX eq?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>1</th>
          <td>शहरों</td>
          <td>SaharoM</td>
          <td>SaharoM</td>
          <td>True</td>
        </tr>
        <tr>
          <th>2</th>
          <td>खूबसूरत</td>
          <td>KUbasUrawa</td>
          <td>KUbasUrawa</td>
          <td>True</td>
        </tr>
        <tr>
          <th>3</th>
          <td>बैंगलोर</td>
          <td>bEMgalora</td>
          <td>bEMgalora</td>
          <td>True</td>
        </tr>
        <tr>
          <th>4</th>
          <td>कोलकाता</td>
          <td>kolakAwA</td>
          <td>kolakAwA</td>
          <td>True</td>
        </tr>
        <tr>
          <th>5</th>
          <td>हैदराबाद</td>
          <td>hExarAbAxa</td>
          <td>hExarAbAxa</td>
          <td>True</td>
        </tr>
        <tr>
          <th>6</th>
          <td>कोझिकोडे</td>
          <td>koJikode</td>
          <td>koJikode</td>
          <td>True</td>
        </tr>
        <tr>
          <th>7</th>
          <td>सफर</td>
          <td>saPara</td>
          <td>saPara</td>
          <td>True</td>
        </tr>
        <tr>
          <th>8</th>
          <td>उसमे</td>
          <td>usame</td>
          <td>usame</td>
          <td>True</td>
        </tr>
        <tr>
          <th>9</th>
          <td>संभावनाओं</td>
          <td>saMBAvanAoM</td>
          <td>saMBAvanAoM</td>
          <td>True</td>
        </tr>
        <tr>
          <th>10</th>
          <td>मुंबई</td>
          <td>muMbaI</td>
          <td>muMbI</td>
          <td>False</td>
        </tr>
        <tr>
          <th>11</th>
          <td>नई</td>
          <td>naI</td>
          <td>nI</td>
          <td>False</td>
        </tr>
        <tr>
          <th>12</th>
          <td>मंगलवार</td>
          <td>maMgalavAra</td>
          <td>maMgalavAra</td>
          <td>True</td>
        </tr>
        <tr>
          <th>13</th>
          <td>घंटे</td>
          <td>GaMte</td>
          <td>GaMte</td>
          <td>True</td>
        </tr>
        <tr>
          <th>14</th>
          <td>ट्रंप</td>
          <td>traMpa</td>
          <td>traMpa</td>
          <td>True</td>
        </tr>
        <tr>
          <th>15</th>
          <td>डोनाल्ड</td>
          <td>donAlda</td>
          <td>donAlda</td>
          <td>True</td>
        </tr>
        <tr>
          <th>16</th>
          <td>स्टेट</td>
          <td>steta</td>
          <td>steta</td>
          <td>True</td>
        </tr>
        <tr>
          <th>17</th>
          <td>संगठन</td>
          <td>saMgaTana</td>
          <td>saMgaTana</td>
          <td>True</td>
        </tr>
        <tr>
          <th>18</th>
          <td>प्रतिबंध</td>
          <td>prawibaMXa</td>
          <td>prawibaMXa</td>
          <td>True</td>
        </tr>
        <tr>
          <th>19</th>
          <td>एंड</td>
          <td>eMda</td>
          <td>eMda</td>
          <td>True</td>
        </tr>
        <tr>
          <th>20</th>
          <td>अंदेशे</td>
          <td>aMxeSe</td>
          <td>aMxeSe</td>
          <td>True</td>
        </tr>
      </tbody>
    </table>
</div>


As you can see, most of the cases are correctly converted by our conversion function. I have deliberately left out 2 cases to show that this function is imcomplete. Just like I handled the anuswara case, this and other cases where vowels are there needs to be handled. Further, there are more characters which are not included in the mapping. I wanted to show how a WX conversion function will work based on the provided mapping.

### WX to Hindi

Let's do the reverse now - conversion of WX to Hindi. For this we'll start with the creation of our reverse mapping.


{% highlight python linenos %}
wx2hin_vowels = {
    "a": "अ",
    "A": "आ",
    "i": "इ",
    "I": "ई",
    "u": "उ",
    "U": "ऊ",
    "e": "ए",
    "E": "ऐ",
    "o": "ओ",
    "O": "औ"
}
wx2hin_vowels_half = {
    "A": "ा",
    "e": "े",
    "E": "ै",
    "i": "ि",
    "I": "ी",
    "o": "ो",
    "U": "ू",
    "u": "ु"
}
wx2hin_sonorants = {
    "q": "ऋ",
    "Q": "ॠ",
    "L": "ऌ"
}
wx2hin_anuswara = {"M": "अं"}
wx2hin_anuswara_half = {"M": "ं"}
wx2hin_consonants = {
    "k": "क",
    "K": "ख",
    "g": "ग",
    "G": "घ",
    "f": "ङ",
    "c": "च",
    "C": "छ",
    "j": "ज",
    "J": "झ",
    "F": "ञ",
    "t": "ट",
    "T": "ठ",
    "d": "ड",
    "D": "ढ",
    "N": "ण",
    "w": "त",
    "W": "थ",
    "x": "द",
    "X": "ध",
    "n": "न",
    "p": "प",
    "P": "फ",
    "b": "ब",
    "B": "भ",
    "m": "म",
    "y": "य",
    "r": "र",
    "l": "ल",
    "v": "व",
    "S": "श",
    "R": "ष",
    "s": "स",
    "h": "ह",
}
wx2hin_all = {
    **wx2hin_vowels,
    **wx2hin_vowels_half,
    **wx2hin_sonorants,
    **wx2hin_anuswara,
    **wx2hin_anuswara_half,
    **wx2hin_consonants
}
{% endhighlight %}


As before, we’ll new define the ASCII to Hindi conversion function.


{% highlight python linenos %}
def is_vowel_wx(char):
    if char in {"a", "A", "e", "E", "i", "I", "o", "O", "u", "U", "M"}:
        return True
    return False


def wx2hin(wx_string):
    """
    Converts the WX string to the Hindi string.

    This function goes through each character from the wx_string and
    maps it to a corresponding Devanagari character according to the
    Roman to Devanagari character mapping defined previously.
    """
    wx_string += " "
    hin_string = []
    for i, roman_char in enumerate(wx_string[:-1]):
        if is_vowel_wx(roman_char):
            # If current character is "a" and not the first character
            # then skip
            if roman_char == "a" and i != 0:
                continue

            if roman_char == "M":
                hin_string.append(wx2hin_anuswara_half[roman_char])
            elif i == 0 or wx_string[i-1] == "a":
                hin_string.append(wx2hin_vowels[roman_char])
            else:
                hin_string.append(wx2hin_vowels_half[roman_char])
        else:
            hin_string.append(wx2hin_all[roman_char])
            if not is_vowel_wx(wx_string[i+1]) and wx_string[i+1] != " ":
                hin_string.append("्")
    return "".join(hin_string)
{% endhighlight %}


And now, the evaluation of the our reverse conversion function.


{% highlight python linenos %}
test_df = pd.DataFrame(pairs, columns=["Hindi String", "Actual WX"])
test_df["Our Hin"] = test_df["Actual WX"].apply(wx2hin)
test_df["Both Hin eq?"] = test_df["Hindi String"] == test_df["Our Hin"]
test_df.index = test_df.index + 1
test_df
{% endhighlight %}


<div class="rendered_html">
    <table style="margin-left: 0;">
  <thead>
    <tr>
      <th></th>
      <th>Hindi String</th>
      <th>Actual WX</th>
      <th>Our Hin</th>
      <th>Both Hin eq?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>शहरों</td>
      <td>SaharoM</td>
      <td>शहरों</td>
      <td>True</td>
    </tr>
    <tr>
      <th>2</th>
      <td>खूबसूरत</td>
      <td>KUbasUrawa</td>
      <td>खूबसूरत</td>
      <td>True</td>
    </tr>
    <tr>
      <th>3</th>
      <td>बैंगलोर</td>
      <td>bEMgalora</td>
      <td>बैंगलोर</td>
      <td>True</td>
    </tr>
    <tr>
      <th>4</th>
      <td>कोलकाता</td>
      <td>kolakAwA</td>
      <td>कोलकाता</td>
      <td>True</td>
    </tr>
    <tr>
      <th>5</th>
      <td>हैदराबाद</td>
      <td>hExarAbAxa</td>
      <td>हैदराबाद</td>
      <td>True</td>
    </tr>
    <tr>
      <th>6</th>
      <td>कोझिकोडे</td>
      <td>koJikode</td>
      <td>कोझिकोडे</td>
      <td>True</td>
    </tr>
    <tr>
      <th>7</th>
      <td>सफर</td>
      <td>saPara</td>
      <td>सफर</td>
      <td>True</td>
    </tr>
    <tr>
      <th>8</th>
      <td>उसमे</td>
      <td>usame</td>
      <td>उसमे</td>
      <td>True</td>
    </tr>
    <tr>
      <th>9</th>
      <td>संभावनाओं</td>
      <td>saMBAvanAoM</td>
      <td>संभावनाों</td>
      <td>False</td>
    </tr>
    <tr>
      <th>10</th>
      <td>मुंबई</td>
      <td>muMbaI</td>
      <td>मुंबई</td>
      <td>True</td>
    </tr>
    <tr>
      <th>11</th>
      <td>नई</td>
      <td>naI</td>
      <td>नई</td>
      <td>True</td>
    </tr>
    <tr>
      <th>12</th>
      <td>मंगलवार</td>
      <td>maMgalavAra</td>
      <td>मंगलवार</td>
      <td>True</td>
    </tr>
    <tr>
      <th>13</th>
      <td>घंटे</td>
      <td>GaMte</td>
      <td>घंटे</td>
      <td>True</td>
    </tr>
    <tr>
      <th>14</th>
      <td>ट्रंप</td>
      <td>traMpa</td>
      <td>ट्रंप</td>
      <td>True</td>
    </tr>
    <tr>
      <th>15</th>
      <td>डोनाल्ड</td>
      <td>donAlda</td>
      <td>डोनाल्ड</td>
      <td>True</td>
    </tr>
    <tr>
      <th>16</th>
      <td>स्टेट</td>
      <td>steta</td>
      <td>स्टेट</td>
      <td>True</td>
    </tr>
    <tr>
      <th>17</th>
      <td>संगठन</td>
      <td>saMgaTana</td>
      <td>संगठन</td>
      <td>True</td>
    </tr>
    <tr>
      <th>18</th>
      <td>प्रतिबंध</td>
      <td>prawibaMXa</td>
      <td>प्रतिबंध</td>
      <td>True</td>
    </tr>
    <tr>
      <th>19</th>
      <td>एंड</td>
      <td>eMda</td>
      <td>एंड</td>
      <td>True</td>
    </tr>
    <tr>
      <th>20</th>
      <td>अंदेशे</td>
      <td>aMxeSe</td>
      <td>अंदेशे</td>
      <td>True</td>
    </tr>
  </tbody>
</table>
</div>



Only one case failed which is becasue the case of short and full vowels was not handled properly. There'll be many such cases and thus this ```wx2hin``` conversion function is incomplete and just a toy implementation to show how it works.

## WX implementation <a name="wx"></a>

The complete implementation of this conversion between Devanagari and WX and reverse, can be found in this library - [wxconv](https://github.com/irshadbhat/indic-wx-converter/). It handles many other Indic languages. Lets try it out.

### Hindi to WX

{% highlight python linenos %}
from wxconv import WXC

hin2wx = WXC(order='utf2wx', lang="hin").convert

test_df = pd.DataFrame(pairs, columns=["Hindi String", "Actual WX"])
test_df["Our WX"] = test_df["Hindi String"].apply(hin2wx)
test_df["Both WX eq?"] = test_df["Actual WX"] == test_df["Our WX"]
test_df.index = test_df.index + 1
test_df
{% endhighlight %}


<div class="rendered_html">
    <table style="margin-left: 0;">
  <thead>
    <tr>
      <th></th>
      <th>Hindi String</th>
      <th>Actual WX</th>
      <th>Our WX</th>
      <th>Both WX eq?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>शहरों</td>
      <td>SaharoM</td>
      <td>SaharoM</td>
      <td>True</td>
    </tr>
    <tr>
      <th>2</th>
      <td>खूबसूरत</td>
      <td>KUbasUrawa</td>
      <td>KUbasUrawa</td>
      <td>True</td>
    </tr>
    <tr>
      <th>3</th>
      <td>बैंगलोर</td>
      <td>bEMgalora</td>
      <td>bEMgalora</td>
      <td>True</td>
    </tr>
    <tr>
      <th>4</th>
      <td>कोलकाता</td>
      <td>kolakAwA</td>
      <td>kolakAwA</td>
      <td>True</td>
    </tr>
    <tr>
      <th>5</th>
      <td>हैदराबाद</td>
      <td>hExarAbAxa</td>
      <td>hExarAbAxa</td>
      <td>True</td>
    </tr>
    <tr>
      <th>6</th>
      <td>कोझिकोडे</td>
      <td>koJikode</td>
      <td>koJikode</td>
      <td>True</td>
    </tr>
    <tr>
      <th>7</th>
      <td>सफर</td>
      <td>saPara</td>
      <td>saPara</td>
      <td>True</td>
    </tr>
    <tr>
      <th>8</th>
      <td>उसमे</td>
      <td>usame</td>
      <td>usame</td>
      <td>True</td>
    </tr>
    <tr>
      <th>9</th>
      <td>संभावनाओं</td>
      <td>saMBAvanAoM</td>
      <td>saMBAvanAoM</td>
      <td>True</td>
    </tr>
    <tr>
      <th>10</th>
      <td>मुंबई</td>
      <td>muMbaI</td>
      <td>muMbaI</td>
      <td>True</td>
    </tr>
    <tr>
      <th>11</th>
      <td>नई</td>
      <td>naI</td>
      <td>naI</td>
      <td>True</td>
    </tr>
    <tr>
      <th>12</th>
      <td>मंगलवार</td>
      <td>maMgalavAra</td>
      <td>maMgalavAra</td>
      <td>True</td>
    </tr>
    <tr>
      <th>13</th>
      <td>घंटे</td>
      <td>GaMte</td>
      <td>GaMte</td>
      <td>True</td>
    </tr>
    <tr>
      <th>14</th>
      <td>ट्रंप</td>
      <td>traMpa</td>
      <td>traMpa</td>
      <td>True</td>
    </tr>
    <tr>
      <th>15</th>
      <td>डोनाल्ड</td>
      <td>donAlda</td>
      <td>donAlda</td>
      <td>True</td>
    </tr>
    <tr>
      <th>16</th>
      <td>स्टेट</td>
      <td>steta</td>
      <td>steta</td>
      <td>True</td>
    </tr>
    <tr>
      <th>17</th>
      <td>संगठन</td>
      <td>saMgaTana</td>
      <td>saMgaTana</td>
      <td>True</td>
    </tr>
    <tr>
      <th>18</th>
      <td>प्रतिबंध</td>
      <td>prawibaMXa</td>
      <td>prawibaMXa</td>
      <td>True</td>
    </tr>
    <tr>
      <th>19</th>
      <td>एंड</td>
      <td>eMda</td>
      <td>eMda</td>
      <td>True</td>
    </tr>
    <tr>
      <th>20</th>
      <td>अंदेशे</td>
      <td>aMxeSe</td>
      <td>aMxeSe</td>
      <td>True</td>
    </tr>
  </tbody>
</table>
</div>


### WX to Hindi

{% highlight python linenos %}
wx2hin = WXC(order='wx2utf', lang="hin").convert
test_df = pd.DataFrame(pairs, columns=["Hindi String", "Actual WX"])
test_df["Our Hin"] = test_df["Actual WX"].apply(wx2hin)
test_df["Both Hin eq?"] = test_df["Hindi String"] == test_df["Our Hin"]
test_df.index = test_df.index + 1
test_df
{% endhighlight %}

<div class="rendered_html">
    <table style="margin-left: 0;">

  <thead>
    <tr>
      <th></th>
      <th>Hindi String</th>
      <th>Actual WX</th>
      <th>Our Hin</th>
      <th>Both Hin eq?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>शहरों</td>
      <td>SaharoM</td>
      <td>शहरों</td>
      <td>True</td>
    </tr>
    <tr>
      <th>2</th>
      <td>खूबसूरत</td>
      <td>KUbasUrawa</td>
      <td>खूबसूरत</td>
      <td>True</td>
    </tr>
    <tr>
      <th>3</th>
      <td>बैंगलोर</td>
      <td>bEMgalora</td>
      <td>बैंगलोर</td>
      <td>True</td>
    </tr>
    <tr>
      <th>4</th>
      <td>कोलकाता</td>
      <td>kolakAwA</td>
      <td>कोलकाता</td>
      <td>True</td>
    </tr>
    <tr>
      <th>5</th>
      <td>हैदराबाद</td>
      <td>hExarAbAxa</td>
      <td>हैदराबाद</td>
      <td>True</td>
    </tr>
    <tr>
      <th>6</th>
      <td>कोझिकोडे</td>
      <td>koJikode</td>
      <td>कोझिकोडे</td>
      <td>True</td>
    </tr>
    <tr>
      <th>7</th>
      <td>सफर</td>
      <td>saPara</td>
      <td>सफर</td>
      <td>True</td>
    </tr>
    <tr>
      <th>8</th>
      <td>उसमे</td>
      <td>usame</td>
      <td>उसमे</td>
      <td>True</td>
    </tr>
    <tr>
      <th>9</th>
      <td>संभावनाओं</td>
      <td>saMBAvanAoM</td>
      <td>संभावनाओं</td>
      <td>True</td>
    </tr>
    <tr>
      <th>10</th>
      <td>मुंबई</td>
      <td>muMbaI</td>
      <td>मुंबई</td>
      <td>True</td>
    </tr>
    <tr>
      <th>11</th>
      <td>नई</td>
      <td>naI</td>
      <td>नई</td>
      <td>True</td>
    </tr>
    <tr>
      <th>12</th>
      <td>मंगलवार</td>
      <td>maMgalavAra</td>
      <td>मंगलवार</td>
      <td>True</td>
    </tr>
    <tr>
      <th>13</th>
      <td>घंटे</td>
      <td>GaMte</td>
      <td>घंटे</td>
      <td>True</td>
    </tr>
    <tr>
      <th>14</th>
      <td>ट्रंप</td>
      <td>traMpa</td>
      <td>ट्रंप</td>
      <td>True</td>
    </tr>
    <tr>
      <th>15</th>
      <td>डोनाल्ड</td>
      <td>donAlda</td>
      <td>डोनाल्ड</td>
      <td>True</td>
    </tr>
    <tr>
      <th>16</th>
      <td>स्टेट</td>
      <td>steta</td>
      <td>स्टेट</td>
      <td>True</td>
    </tr>
    <tr>
      <th>17</th>
      <td>संगठन</td>
      <td>saMgaTana</td>
      <td>संगठन</td>
      <td>True</td>
    </tr>
    <tr>
      <th>18</th>
      <td>प्रतिबंध</td>
      <td>prawibaMXa</td>
      <td>प्रतिबंध</td>
      <td>True</td>
    </tr>
    <tr>
      <th>19</th>
      <td>एंड</td>
      <td>eMda</td>
      <td>एंड</td>
      <td>True</td>
    </tr>
    <tr>
      <th>20</th>
      <td>अंदेशे</td>
      <td>aMxeSe</td>
      <td>अंदेशे</td>
      <td>True</td>
    </tr>
  </tbody>
</table>
</div>


As can be seen, every conversion is correct for the above selected cases.

Internally, this library has an extensive mapping between unicode and ISCII (and vice versa), and between ISCII and ASCII (and vice versa). Using these conversion tables, to obtain a WX notation of a Hindi string, it'll first be converted to the ISCII representation and then from ISCII to ASCII.
