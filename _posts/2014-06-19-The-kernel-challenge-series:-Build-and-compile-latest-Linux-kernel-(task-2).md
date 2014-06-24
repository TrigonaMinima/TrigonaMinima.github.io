---
layout: post
title:  "The kernel challange (Task 2)"
date:   2014-06-19
categories: kernel system-programming 
---


Task 2 is as follows -

>Download Linus's latest git tree from git.kernel.org. Build it, install it, and boot it. You can use whatever kernel configuration options you wish to use, but you must enable CONFIG_LOCALVERSION_AUTO=y. Show proof of booting this kernel. Bonus points if you do it on a "real" machine, and not a virtual machine (virtual machines are acceptable, but come on, real kernel developers don't mess around with virtual machines, they are too slow. Oh yeah, we aren't real kernel developers just yet.)

Okay, so there's nothing much to say what I did, but still to document I'll write.

I first ran 

{% highlight sh %}
$ make menuconfig
{% endhighlight %}

Went to the general settings & selected the automatically update local version and then saved the file as '.config'. You will have the file named the same in your kernel directory. Now run as root

{% highlight sh %}
$ make && make modules_install && make install
{% endhighlight %}

This won't end anytime soon so go have a walk or something. I went for dinner, if you were wondering. I did this whole compiling process three times. The first time I didn't know how much time it will take so, I was watching it compile and install for 15-20 minutes (even after, I was warned by various blogs that it'll take time). I should have taken some inspiration from this xkcd comic [here][1].

When the show's over reboot your machine and in the grub only you will be able to see the kernel version you used. For further proof you can run in your terminal the following command.

{% highlight sh %}
$ uname -a
{% endhighlight %}

It will give a lot of information in one line along with the kernel version like I got.

{% highlight text %}
Linux Shivam 3.16.0-rc2y #1 SMP Sun Jun 22 21:24:16 IST 2014 x86_64 x86_64 x86_64 GNU/Linux
{% endhighlight %}

[1]: http://xkcd.com/303/