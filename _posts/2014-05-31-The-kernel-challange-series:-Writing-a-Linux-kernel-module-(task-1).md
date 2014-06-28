---
layout: post
title:  "The kernel challange series: Writing a Linux kernel module (task 1)"
date:   2014-05-31
categories: kernel system-programming Linux
---


How I am becoming a Linux kernel developer (at least, I think I am). There will be a series of these posts as I get ahead on my becoming a Linux kernel developer quest. These are the ones I have written yet.

[Writing a Linux kernel module (task 1)][] (this post)  
[Building and booting the Linux kernel (Task 2)][]  

Task #1 was to -

>Write a Linux kernel module, and stand-alone Makefile, that when loaded prints to the kernel debug log level, "Hello World!"  Be sure to make the module unloadable as well. The Makefile should build the kernel module against the source for the currently running kernel, or, use an environment variable to specify what kernel tree to build it against.

Well, particularly what I found very useful for this task was the book **[The Linux Kernel Module Programming Guide][1]** [(pdf)][2]. Read the first few chapters and you will know the solution. Since I am writing this blog post for a kind of revision for myself I will explain the whole process. You sure can skip it if you want.

First of all, for this task there is no need to download a stable linux kernel, since we are building the kernel against the source for the currently running kernel (ie using the kernel of distro you are using) as the task at hand suggests. And, for the module programming we will obviously be using C language.

Enough talk, lets start,

{% highlight C linenos %}
//Hello world module

# include <linux/module.h>      // Needed by all modules
# include <linux/kernel.h>       // Needed for KERN_DEBUG

// A non 0 return means init_module failed; module can't be loaded.
int
init_module()
{
        printk(KERN_DEBUG "Hello world !!\n");
        return 0;
}

void
cleanup_module()
{
        printk(KERN_DEBUG "Goodbye world !!\n");
}
{% endhighlight %}

The above lines are saved in a file named *'task.c'* (you can choose any name you want). Don't compile it yet. Lets delve a little bit into the code, you can also read about it in the book if you want (I am writing it for myself, remember?).  
**'linux/module.h'** is needed by every kernel module and **'linux/kernel.h'** is needed for the macro expansion for the *printk()* log level. *printk()* is the logging mechanism for the kernel and is used to log information and give warnings.  
Kernel modules must have at least two functions: a "start" (initialization) function called *init_module()* which is called when the module is _insmoded_ into the kernel, and an "end" (cleanup) function called *cleanup_module()* which is called just before it is _rmmoded_.



{% highlight basemake %}
obj-m := task.o
KDIR := /lib/modules/$(shell uname -r)/build
PWD := $(shell pwd)

all:
        $(MAKE) -C $(KDIR) M=$(PWD) modules
 
clean:
        $(MAKE) -C $(KDIR) M=$(PWD) clean
{% endhighlight %}

The above lines are saved in a file named *'Makefile'*. Now, opening the terminal in the same directory run 

{% highlight sh %}
$ make
{% endhighlight %}

You should get an output similar to

{% highlight sh %}
make -C /lib/modules/3.14.4/build M=/directory-residing-task-1-directory/task1 modules
make[1]: Entering directory `/media/minima/163be8fe-eab1-4f49-a06e-d21256f4cf00/linux-3.14.4'
  CC [M]  /directory-residing-task-1-directory/task1/task.o
  Building modules, stage 2.
  MODPOST 1 modules
  CC      /directory-residing-task-1-directory/task1/task.mod.o
  LD [M]  /directory-residing-task-1-directory/task.ko
make[1]: Leaving directory `/media/minima/163be8fe-eab1-4f49-a06e-d21256f4cf00/linux-3.14.4'
{% endhighlight %}

A few files will be generated like 'task.ko' and 'task.o'
Now Load the module by running  

{% highlight sh %}
$ insmod task.ko
{% endhighlight %}

To check if the module is loaded you can print the contents of file '/proc/modules' by running  
{% highlight sh %}
$ cat /proc/modules | grep task
{% endhighlight %}

You should get an output like  

{% highlight sh %}
 task 12426 0 - Live 0x0000000000000000 (POF)
{% endhighlight %}

This means that the task is loaded in the memory. Now, to unload the module run

{% highlight sh %}
$ rmmod task
{% endhighlight %}

This will unload the module. Now, if you again run the following command, you won't get anything.

{% highlight sh %}
$ cat /proc/modules | grep task
{% endhighlight %}

To check the output of module you can run any one of the following commands and you will see the result

{% highlight sh %}
$ cat /var/log/syslog | tail
{% endhighlight %}
or
{% highlight sh %}
$ dmesg | tail
{% endhighlight %}

It will print the last 10 lines of the file '/proc/log/syslog' in which you will also see the lines your module printed like the following lines
{% highlight sh %}
  [ 7513.661656] Hello world !!
  [ 7578.795815] Goodbye world !!
{% endhighlight %}

Now, one thing though, if you run any command and you see any error having strings similar to 'Operation not permitted', prefix that command with 'sudo' and enter the password  and run the command or run the command as root. For example -

{% highlight sh %}
$ sudo make
{% endhighlight %}
---------------------------------

Now, if you followed the process you would have been successful in creating your own sweet module. So, how does it feel having created a new module? How do you feel becoming a kernel developer?
Well, well don't start flying, you (and, me myself) have just made a small hello world module, which does nothing except printing something in the system log.

References-  
[The Linux Kernel Module Programming Guide][2] (pdf)

[1]: http://tldp.org/LDP/lkmpg/2.6/html/
[2]: http://www.tldp.org/LDP/lkmpg/2.6/lkmpg.pdf