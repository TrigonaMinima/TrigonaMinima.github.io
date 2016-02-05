---
layout: post
title:  "[Mini] Linux hardware Issues"
date:   2016-02-06
categories: Linux
annotation: Linux
---

OK, so this is my first mini. Idea of mini was brought on by the concept of shorts in the [CS50 course](https://cs50.harvard.edu/) and the periodic MINI episodes on the [Data Skeptic](http://dataskeptic.com/) podcast.

So, I got a new laptop (HP ProBook 440 G2) this January with the following specs - Intel(R) Core(TM) i7-5500U CPU @ 2.40GHz, 8GB RAM, 1TB HDD, Realtek wireless drivers. It came with Windows 8.1. My survival depends on Linux. So, I partitioned my HDD, installed [Elementary OS Freya](https://elementary.io/).
Everything worked fine while checking the live USB, but when I started the OS (after turning off the secure boot option, which took me 2-3 hours to find that to get the GRUB working, I have to disable secure boot), the first thing, I encountered, was that the logo displayed before login screen was highly pixelated. I thought maybe it'll be alright at next boot. So, I logged in and did some more exploring. Changed all the settings according to my liking. Connected to internet and started installing my tools on the terminal.

Now began my troubles. After some time, network disconnected. I couldn't even reconnect it. I restarted the laptop, saw the pixelated  `e` again and the same network problem. I was furious. I searched the problem, found some solutions, but none solved mine. I thought may be installation was buggy. So, I reinstalled the OS, but the problem persisted.

I went to bug trackers of the eOS and found 2-3 bugs relating to the same problem. But no solution was provided. In this search, luckily, I found the same problem being discussed on [voat.co](https://voat.co/v/Linux/comments/500838), a service similar to Reddit. There I found the solution.

So, I learned something from this. As my laptop was new and everything was working fine on windows, I automatically thought that not being able to connect to the internet was the error caused by the eOS. And, I guess, many thought the same, looking at the bugs on the bug tracker. But, this problem goes beyond the OS. The problem of network was because my WiFi card was comparatively new and there's a common problem with the Linux kernel and Realtek wireless chipsets where the power management is completely broken for them. So, the solution was to patch the kernel for RTL devices. I did that and tested for 2-3 days and my network is pretty smooth now. To get the instructions [see this](http://elementaryos.stackexchange.com/q/4133/3898).

The first problem of getting a pixelated logo was kinda resolved during the process. So, in a Ubuntu stack exchange, as a solution to the second problem, someone had suggested to update the kernel. My present version was 3.19. I updated the kernel and after the next boot-up the problem was resolved. So, my takeaway from this ordeal is-

1. Don't always blame the OS for the errors with the kernel/device drivers. (But I'd say, developers could have commented on the bugs about the patch.)
2. Always, update your kernel on every fresh Linux distro installation.
