---
layout: post
title:  "Shiny Apps"
date:   2015-07-02
categories: R Shiny
annotation: R
---

This a collection of small shiny apps I have made (or going to make) to learn [shiny](http://shiny.rstudio.com/) (by RStudio). The list of apps in this repo are listed (and documented) on this page. To learn more about the apps (what they do and how were they developed to do what they do) just read further. 

One piece of *advice!* The following write-ups on the apps are specifically for those who are developing shiny apps. You can find the deployed versions of these apps on the [shinyapps.io](https://www.shinyapps.io/) but with the free versions of the platform I can only run a maximum of 5 apps at a time. So, many apps will most probably be sleeping, although you can try your luck. May be, you'll find that app running. 

Although, looking at the working examples will be more helpful, but if you want to have any background knowledge on shiny - how it works, how to deploy your app, how to design your ui in HTML and much more - then have a look at [shiny articles](http://shiny.rstudio.com/articles/). Shiny have prepared a pretty good material to learn the platform by yourself.

If you would like to see the code and tinker with it, there are 2 ways.

1. Just follow the commands,

{% highlight sh %}
$ git clone https://github.com/TrigonaMinima/shiny_apps
$ cd shiny_apps/
$ R
{% endhighlight %}

{% highlight R %}
# Inside R console
# install.packages("shiny")
library(shiny)
# Appname is the name of directory present inside the repository thus,
# to run "wordcloud" run this
runApp("wordcloud")
{% endhighlight %}

2. To make your life (and mine) simple I have hosted each app on the github gist. And, shiny has been kind enough to provide a way to directly run the app from gists.

{% highlight R %}
# Inside R console
# install.packages("shiny")
library(shiny)
runGist("<gist_number>")
# gist_number will be given by me of course on the individual app page.
# The above instruction will launch the app in your browser.
{% endhighlight %}


Okay, enough explaining. Lets look at the app(s).

- [Wordcloud](https://trigonaminima.github.io/shiny_apps/2014/06/28/wordcloud/)

