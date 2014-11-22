---
layout: post
title:  "Gamification of Life"
date:   2014-11-08
categories: General data-analytics idea
---

Almost two months back I stumbled upon [this][1] question on [Personal Productivity Stack Exchange][3]. Here, someone asked the following question,

>    I'm currently working out a way to gamify my daily work / life. I want to reward myself via a points system, assigning points to tasks I should do but tend to neglect.
>
>    These are things like paying invoice in a timely manner and answering important emails but also things I want to do, but never get around to, like working out from time to time.
>
>    As I'm the only "judge" I also work on way to prevent that I game the system, but this isn't a real problem for me because I tend to be objective and don't think I'll cheat myself.
>
>    Have you tried something like this?
>    Did it work out?
>    Any input?


I myself was searching for a way to quantify and observe my activities. And, this question gave me an almost perfect solution to achieve the same just like an idiomatic socratic mode of enquiry. It also gave me some fun coding ideas. Although 1st answer helped to think, I wanted something that really quantified the things in my own ways. In my own priorities. Besides, it will get me started towards the [Quantified Self][2] concept I was thinking of doing.

So, I tried to think of some ways to achieve this 'Gamification of my Life'.

At first, I thought of making a small python script that'll enter all the data given to it in an excel sheet. But, then there were some problems,

- How to give input to the Script?  
GUI might have been an answer but that was too much work. Wow, I just got a solution while writing this point. I can take input from a text file. Writing the data to be fed in a defined format. Nice. (still seems to be a hassle to work with)

- After input, I had to think of points over which I was going to quantify myself.  
That is, to decide over the scoring of activities I do. Since, I didnt know if my current decided criteria will be final or not, I couldn't start writing this script. It might need some major ammendments in the future. This was the point much required than the first one.

Thus, I first decided to explore the criteria/categories for the quantification. A set of categories I already had in mind, seemed to encompass every aspect I wanted to be covered. But, after 2-3 weeks I had to modify this set with some more elements. This was the final set which haven't been modified more.

    Categories = {Read, Write, Code, Music, Watch, Travel, Other Productive/Worthwhile activities}

There were many activities over which I wanted to observe myself. The broad categories under which they will come are written above. Most of the activities are described below.

**Watch**  

- Movies
- Shows
- Courses
- Ted
- Other Informative Videos (documentaries, debates etc)
- Entertainment videos  

**Read**

- Novels
- Books other then Novels
- Blog Articles (Pocket, Fb saved links, Quora saved answers, stack exchange etc)
- Research Papers  

**Write**  

- Blog Post  

**Code**

- Small Codes (Algos, Competitive Programming solutions, short projects)
- Completing A Project
- Maintaining Past Project
- Starting New Project
- Improving other Skills  

**Music**

- Violin
- Listening

**Travel (weekly)**  

- Alone to New Place
- Alone to Known Place
- With Friends to New Place
- With Friends to Known Place

Now the scores were decided. You can see the score distribution in the image below. 

![Scoring]({{ site.url }}assets/gamification_score.png)

I know. I know. This was a hilarious score distribution.  
Don't laugh over it. Okay?

Now, from the above scores, some numbers and figures were crunched.

| Week Length |:| Sunday to Saturday (7 days) |
| New Week starts from |:| Sunday |
| Maximum Score per week |:| 345* |

*This high score was calculated assuming that I do every proclivity shown in the image above.

Thus, I created this score system to help myself, track well.. myself. It's been 10 weeks since I started this *self tracking*. Some of the scores changed over the period and might change further. This was somewhat an enlightening period. I tracked myself almost completely, having a proper record of what I do during the week which might be a time waste or productive or worthwhile.

My weekly score started from a total of **75** which is the **lowest score** yet. I reached to a **maximum** of **186.8**. From the start I progressed the score from 75 to 186.8 following which I was unwell for a week.

Now, here's an interesting thing. In this "unwell week" I had a decent score of 143.4 but the week following this was the second lowest with a score of 85.6. I don't know, if this was a fluke but I will observe if this pattern is encountered again the next time I get unwell.

Now, I have to decide whether I should make the script/GUI of this whole process. Moreover, I would like to get some stats, some conclusion or glossary kind of thing, some prediction system, some recommendation system (to recommend to me something like, what activity should I do which I haven't done for a long time). So, I will most probably be making a script to do some or all of the things stated. And, it wouldn't hurt to build a GUI upon it, I suppose.

Also, along with this fun expt. I started making a list of movies I watched. I added in some previous ones I have watched along with the ones I have watched during these 10 weeks. There are 124 movies as of now along with the some other meta data like language it was in, subs or not, type (animation, documentary, normal), releasing year, ratings, country it belongs to (according to production house), etc. This gave rise to some other fun stats and data to play with. I Will probably write another post with those analysis results.

SR.


[1]: https://productivity.stackexchange.com/questions/2972/gamification-to-improve-myself
[2]: https://en.wikipedia.org/wiki/Quantified_Self
[3]: https://productivity.stackexchange.com/