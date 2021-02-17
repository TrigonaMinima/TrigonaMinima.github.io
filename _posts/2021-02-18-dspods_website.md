---
layout: post
title: "Building and Hosting a Podcast Website for Free"
date: 2021-02-18
categories: Podcast
---


A few months back, I was looking for some good Data Science podcasts, and the only sources I found were blog posts with reviews about a few podcasts. Many of those podcasts were no longer active. A few hosts explicitly mentioned that on their homepages, and some just stopped creating new episodes. Apple Podcasts, Spotify, Pocketcasts - where you can subscribe to a podcast - none of them showed if a podcast was inactive. You've to deduce it on your own. These services also don't tell you if a podcast is about Data Science, Machine Learning, or ML Engineering.

So I decided to create a website having a regularly updated list of all such podcasts. I enjoyed developing this website. This is coming from someone who has never done any decent web development work except tweaking some HTML or CSS here and there. Here's how I made this free website.


## Guiding Principles

I wanted my whole setup to be uncomplicated and quick. Once the design is complete, I don't want to touch HTML/CSS/JS files again unless for a tweak or update, and even then, it should be minimal. It should be easy to add a new podcast. Most importantly, I wanted most of the things to be automated.


## Static Pages

I have no experience with JavaScript so, I skipped any JS Frameworks. I decided to go ahead with a vanilla static site. I used [Jekyll](https://jekyllrb.com/) to generate static pages that one can host anywhere. I am familiar with Jekyll because I use it to build this blog. Another advantage is that GitHub makes it frictionless to build and host a static website using [GitHub pages](https://pages.github.com/). Lastly, adding a new blog entry is straightforward: add a simple text file with YAML front matter and boom.


## Website Design

I rarely start working on things from scratch. I begin with copying being the first step and then taking it beyond the initial design. Jekyll provides a lot of [free themes](https://jekyllthemes.io/free) created by others. I started with [Mediumish Jekyll Theme](https://www.wowthemes.net/mediumish-free-jekyll-template/) as my first step. It used [Bootstrap](https://getbootstrap.com/) to design the interface, which was fortunate for me, as I had a tiny bit of experience in it.

I made significant modifications to make the website look the way I had imagined. I knew a large chunk of visitors would visit the website from their mobile devices, so I had to make the website behave properly with small screens, a.k.a. design it responsively. Making that homepage grid behave appropriately with different widths was a bunch of work. Firefox's [Responsive Design Mode](https://developer.mozilla.org/en-US/docs/Tools/Responsive_Design_Mode) helped a lot. With time I figured out all the parts. I learned many new things: [Viewport](https://developer.mozilla.org/en-US/docs/Glossary/Viewport), [Flexbox](https://www.youtube.com/watch?v=fYq5PXgSsbE&t), the background of the [Responsive Design from Smashing Magazine](https://www.smashingmagazine.com/2011/01/guidelines-for-responsive-web-design/), about Media Queries, and more. I also connected with a friend from my previous company for a Flexbox issue I was facing. In the end, I was satisfied with the result.

Designing the website an involved process for me. How do you ensure that it looks how you intend on all devices? Is there something like *unit-tests* for a front-end or design of a website? I know there are tools like Selenium and others which can open a website in a headless browser and aid in testing its functionality. I found this Stack Overflow question on the topic - [What are general tips to test a static website?](https://sqa.stackexchange.com/questions/32837/what-are-general-tips-to-test-a-static-website). Most of the answers were either manual checklists or websites which evaluate your website on few metric.


After I had hosted the website, I evaluated my website through the following links and made a multitude of changes to improve the score:

- [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)
- [Google's Measure Tool](https://web.dev/measure/) for performance, accessibility, use of best practices, and SEO.

For each podcast, I display a card on the homepage with its image and other details. Minimized the large images with [tinypng](https://tinypng.com/) and [GIMP](https://www.gimp.org/) (learned the basics of GIMP). Minified the CSS and JS files, so they take less time to download. Added alt text for images and did most of the suggested accessibility changes. In the process of removing these latencies, I discovered the [Coverage Tab in Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/coverage). I was using Firefox developer tools, so I didn't know Chrome had something like this. It was cool.


## Hosting

As I mentioned earlier, I used [GitHub Pages](https://pages.github.com/) to host my website. GitHub supports Jekyll right out of the box: I didn't even have to upload the final HTML files. GitHub will do all of it on its own on every push to the remote repository. One problem was that the hosted website would be available at [shivamrana.me/dspods](https://shivamrana.me/dspods/), and I didn't want the URL. [Netlify](https://www.netlify.com/) to the rescue. Netlify hosts a static website and gives you a domain like `dspods.netlify.app`, where we can put anything in place of `dspods`. It also directly links with a GitHub repository. Give it build instructions and permission to pull the repository. It'll pull the code on every push, build, and host it at the specified domain. Of course, you can use your domain name with both GitHub and Netlify.

So Now I've automated the continuous deployment pipeline. Update the code, and push it to the GitHub repository. GitHub will build it and host it at the [shivamrana.me/dspods](https://shivamrana.me/dspods/) URL. Netlify will also build it and host it at the [dspods.netlify.app](https://dspods.netlify.app/). GitHub build is redundant, but I don't know of a way to stop it. Thus, the whole pipeline is fully automated. Pretty neat, huh?


## Regular Podcast Updates

The only thing remaining is the daily podcast updates. I can't manually update and push the changes daily. It needs to be automated. [GitHub Actions](https://docs.github.com/en/actions) FTW. It was a complete game-changer. Without this, I couldn't have made this website free.

How does it work? Create a workflow with the instructions to get the updates, commit them, and push them to the repository. A Python script parses the RSS feed of each podcast for updates. The workflow runs daily at midnight. Once the commit is pushed, GitHub and Netlify then get on with their jobs to build and deploy the website.

The whole pipeline is automated now.


## Analytics

I've also added [Google Analytics](https://analytics.google.com/analytics/web/) to see the kind of response there is for the website. You add a small snippet to your website, and it handles all the analytics of your website.


## Reception and What's Next?

When I posted the link on [r/MachineLearning](https://www.reddit.com/r/MachineLearning/), people liked the website and gave me a lot more podcasts to add. You can read the discussion [here](https://www.reddit.com/r/MachineLearning/comments/liz35x/d_podcasts_about_machine_learning_and_data_science/).

The next thing I want to do is to make the podcast page a bit more informative. I want to provide some insights about the podcasts to the users. The users should understand what kind of things the podcast has discussed in the past.

I also want to work on the discoverability of the podcasts on the homepage. How can a user narrow down the podcast she may want to listen to? If you have any suggestions regarding this, I am happy to hear them.

My hole for this website is to become a go-to place where people find the next Data Science podcast they want to listen to.


## Conclusion

I wanted to write about how easy it is to build a free website today. This post was my attempt at that. I hope this will be useful to you. Here's a laundry list of the tools I've used to build this website:

- Free static site generator: [Jekyll](https://jekyllrb.com/)
- Free hosting: [Github Pages](https://pages.github.com/) and [Netlify](https://www.netlify.com/)
- Free domain: [Netlify](https://www.netlify.com/)
- Free website evaluation: [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/), [Google's Measure Tool](https://web.dev/measure/)
- Free website automates updates: [GitHub Actions](https://docs.github.com/en/actions)
- Free Analytics: [Google Analytics](https://analytics.google.com/analytics/web/)


The open-source website having a collection of podcasts about Machine Learning, Data Science, and ML Engineering is available at - [DSPods](https://dspods.netlify.app/). The website offers filtering and search options to find podcasts according to your needs. The source code is available at the [GitHub Repo](https://github.com/TrigonaMinima/dspods). Adding a new podcast is easy: add a simple text file with YAML front matter.
