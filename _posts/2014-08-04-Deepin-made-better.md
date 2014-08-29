---
layout: post
title:  "Deepin made better"
date:   2014-08-04
category: Linux
---

The new 2014 edition of this new distro Deepin is nice in its own way. It looks lovely. Is similar to Mac OS with its Dock. Got Gnome like shell called Deepin Desktop Environment.
Its set of preinstalled applications and softwares like-

- Google Chrome
- Deepin Music Player
- Deepin Movie
- Deepin Srore
- Deepin Game
- HexChat
- Skype
- Thunderbird Mail
- LibreOffice Suite
- Python 2.7 and 3.4
- apt-get

It's good and all but it still have a few small shortcomings. I have felt a few and tried to find a solution for that. Here's the list.

**Firstly**, go have a look at the control center (a fancy name for settings) who knows you might find some of your answers there. You can open the control center from the launcher or just take the mouse in the lower right corner.
You can also install gconf-tools and see your settings there and find a few more. Like you can enable *horizontal scrolling* there. Install it as follows,

{% highlight sh %}
sudo apt-get install dconf-tools
{% endhighlight %}

-----------------
**Enable backspace**
Although instead of backapace you have <alt>+arrow_keys but even if you want backspace like me you can go ahead and run

{% highlight sh %}
$ echo '(gtk_accel_path "<Actions>/ShellActions/Up" "BackSpace")'  >> ~/.config/nautilus/accels
$ nautinus -q
$ nautinus
{% endhighlight %}

Your backspace will work now.
-----------------------
**Bookmark folders in the nautilus**
Open the Directory you want to bookmark and press <Ctrl>+d or go to *File Options* in the browser as shown in the pic below and press *Bookmark this Location* and you are done. I am writing it here because I didn't see the options rightaway. Also, previously I was on Mint so there on right clicking the directory you get an option of bookmarking it which I didn't see here.

[Image]
----------------------
**Applications and Scripts to autostart on boot**

For applications that are present in the launcher you can just right clock on the icon and there is an option of *Add to autostart*. Thus, you are over here.
For scripts you can use this standard debian method-

{% highlight sh %}
$ chmod +x your-script
$ sudo cp your-script /etc/init.d/
$ sudo update-rc.d your-script defaults 99
{% endhighlight %}

Check if it runs by running,

{% highlight sh %}
sudo /etc/init.d/your-script start
{% endhighlight %}

For explanation you can read [this][1] and for further explanation you can read [Offical Debian DOC/FAQ][2].
Or if there is a *rc.local* file in the */etc/* directory then you can insert the following command before *exit 0*

{% highlight sh %}
sh path-to-your-script
.
.
.
exit 0
{% endhighlight %}

Check if it runs by running,

{% highlight sh %}
sudo /etc/init.d/rc.local start
{% endhighlight %}

If some error occurs read [this][3].
---------------------------
**gem gives error while installing Jekyll**

run

{% highlight sh %}
$ gem sources --remove http://rubygems.org/
$ gem sources -a http://ruby.taobao.org/
$ sudo gem install jekyll
{% endhighlight %}

Now your jekyll will install and other gems too which were not getting installled
----------------------------
**Missing man pages about using GNU/Linux for Development**

run

{% highlight sh %}
apt-get install manpages-dev
apt-get install manpages-posix
apt-get install manpages-posix-dev
{% endhighlight %}
-----------------------------
**Custom Shortcuts**

| **Shortcut**     | **Command**                        | **Shortcut** |
| Sublime Text   | subl                             | alt+s      |
| Music Player   | deepin-music-player              | alt+m      |
| Control Center | /usr/bin/dde-control-center show | alt+c      |
| Chrome         | googel-chrome-stable             | alt+w      |

-------------------------------
There are still some problems which i couldn't find any solution to but will try to find.

1. Display the size of drive and size left free  
2. Zeal  
3. Man pages unscrollable with mouse  
4. No Scrobbler for the Deepin Music Player  
5. Arrows not working with Alt+Tab  

For now I just got the above solved ones. It's  time to sign off.
SR.


[1]: http://www.cyberciti.biz/tips/linux-how-to-run-a-command-when-boots-up.html
[2]: https://www.debian.org/doc/manuals/debian-faq/ch-customizing.en.html
[3]: http://askubuntu.com/a/401090/311950