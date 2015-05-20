---
layout: post
title:  "Packages I do use"
date:   2014-07-26
categories: Linux General
modified:  2015-05-20
---

Thinking of installing a new Distro (Deepin, because of the lovely looks of this relatively new product from China) I refrained myself in apathy of installing all the packages and softwares again in the new Distro. Also, I don't remember them all. So, now at 3:00 AM in the morning I am documenting all the packages I use. This list will keep on being modified in the future (yeah, yeah, I know you knew that).

Right now I am just listing all of 'em, later I'll give details too (and remove this line too (: ).

One more thing, this list will not be much useful to non-geeky people. Although, I doubt that any reader of this post is non-geeky or further I doubt I have any readers at all. Yeah, I know my life is sad, you don't have to tell me that. Here the list goes in the order of installation.

### [Sublime Text 3][1]
It's worthy of being here as the first. I can't explain how good it is, it is that good. This text editor has got everything you can imagine and if anything is not there as then there are many plug-ins made by the active developer community. You will even find the plug-ins for the features which you can't imagine (at least not yet).

**Plugins I use**  

- [Package Control][1a]  
This is the package where you will find other packages to install. You can think of this as a *synaptic* for sublime packages. You can install it using the [link][1a].  
Press Ctrl+Shift+p and type 'install packages', you will get a prompt. Enter the required package name there and it will be installed directly. Thus for the following packages you can follow the same process
- [Python PEP8 autoformat][1b]  
You might have heard about the PEP8. It is style guidelines for the programming in python. And yes, as you can guess, this plug-in basically does that. It PEP8-ifies the python code.
- [AlignTab][1d]  
It helps in aligning the code as you want. Perhaps, the link will tell you better.
- [TodoReview][1e]  
There are many places in you code where you write a reminder keyword of sorts like (TODO) so that when you revisit the code later you can remind yourself of what you wanted to edit/add/remove. This plug-in helps in that. By default it looks for 'TODO', but you can add keywords of your like.
- [Sublime Terminal][1f]  
Open Terminal Here menu and keyboard shortcuts for Sublime Text. (Yeah, it was blatantly copied right from its Github repo.)
- [Color Highlighter][1g]  
Just click or move the cursor (or multiple cursors) on the color code e.g. "#FFFFFF" and it'll be highlighted with its real color.
- [Markdown Editing][1h]  
A plugin to handle markdown files.
- [GitGutter][1i]  
It'll be better if you look at the link.
- [Text-Pastry][1j]  
Play with multiple selections and removals.
- [GhostText][1k]  
Use Sublime Text to write in your browser. Everything you type in the editor will be instantly updated in the browser (and vice versa). For this you also have to install the Chrome/Firefox plugin listed in the Chrome section.
- [Origami][1l]  
Split your pane any way you want.
- [SublimeCodeIntel][1c]  
A code intelligence plug-in for Sublime Text. Copied from the above link. Go check it out.

### [Synaptic][2]
This essentially do the thing you do via "apt-get" but it gives you the list of packages you can install in a GUI. You can search and select the packages for installation, removal, re-installation etc.

{% highlight sh %}
sudo apt-get install synaptic
{% endhighlight %}

### [Git][3] (and [Github][3a])
{% highlight sh %}
sudo apt-get install git
{% endhighlight %}

I don't think I have to tell you anything about *git*. It is the creation of one and only, *Linus Torvalds*. Git is an awesome tool being the lifeline for almost all the open source development. Every computer programmer should understand and use version controlling. There are many version control tools like Bazaar, Mercurial, HVN etc. Git it the best out of these (according to me). It's a command line tool.
And out of many web clients [Github][3a] is the best. To know how, you can try it out yourself. This blog is hosted on Github, Github is that awesome.

### Python2.7, 3.4
There's nothing to say here. Just checkout this one of the most widely used programming language at [python.org][4].

### [pip][5]
This is the package manager (yeah, apt-get) for the python modules. You can install almost every python module via pip. And when it is combined with *virtualenv* (Next heading) then it is killer as fuck.

{% highlight sh %}
sudo apt-get install python-pip
{% endhighlight %}

### [virtualenv][6]
This is what I was talking about above. It is a simple tool to create isolated Python environments. If you don't want to clutter your standard python installation with modules and make it huge then you install this and create a isolated python interpretor. You can create the environment with any version of python. The *pip* is already generated along with the python interpretor and here you can use this pip to install your modules in the generated python interpretor and make a local environment according to your needs.
For complete understanding and documentation you can checkout this [link][6].

{% highlight sh %}
sudo pip install virtualenv
{% endhighlight %}

### [Chrome Browser][7]
I think this [wiki][7a] establishes the fact that this browser is the number one. I have tried both Firefox and Chrome. And let me show you a few points I found worth mentioning here. which makes chrome better that Firefox.

1. Syncing is better across devices.
2. If you don't worry that much about your history (search patterns) being saved and you are an Android user then using Chrome with [Google Now][7b] will show you what I am talking about. Whatever you search on your Laptop or PC you can instantly get its history in Google Now, which makes life easier.
3. [Desktop Apps][7c], install these in your Chrome browser as an app and you can get its launcher directly on  your desktop as if the app is like a software on your system. And these apps are synced across all your machines if you have logged in with the same account.
4. I can't think of any more, just move already. How much do you need?

**Extensions**

- [AdBlock][7d]  
Dude, name suggests everything.
- [Google Keep - notes and lists][7f]  
This acts as a Desktop App as I mentioned above. Since my Android and Chrome are linked with same Gmail account, my notes *keep* synced across devices. This connectivity feels awesome.
- [Google Translate][7g]  
Translates the whole page in a jiff.    
- [Hover Zoom][7h]  
Just hover over an image and see its zoomed preview.
- [Pocket][7i]  
Another desktop app which provides the articles I save on the web offline.
- [Save to Pocket][7j]  
The plugin used to save the articles in the pocket.
- [Session Buddy][7k]  
Save and manage sessions.
- [Stylish][7l]  
Restyle the web with Stylish, a user styles manager. Stylish lets you easily install themes and skins for many popular sites. Some styles which can be done can be searched on the plugin management window itself. Some I use are listed here,

    - [Wide Github][7la]
- [GhostText for Chrome][7m]  
This is the plugin which works with the above mentioned Sublime Text 3 plugin GhostText.
- [The Great Suspender][7n]  
Unload, park, suspend tabs to reduce memory footprint of chrome. 
- [Google Dictionary][7e]  
Go to the first extension I listed and read its description.

### [Dropbox for Linux][8]
Go to software center and install it.

It is another web-service I am very thankful of. My Dropbox account is linked with my Android, my Laptop and any other machine I want it to. And everything is synced everywhere. Whenever any pic is snapped with my phone it is uploaded to my Dropbox account and then it is downloaded to every linked machine. And whatever I add through the desktop once it gets uploaded it is available everywhere. It has really made my life simpler.

### [Redshift][9]
If you know what f.lux (for Windows) is then you know what redshift is. For the ignorants, it adjusts a computer display's color temperature according to its location and time of day, based on a user specified set of longitude and latitude geographical coordinates, a ZIP Code, or a city name.

{% highlight sh %}
sudo apt-get install gtk-redshift
{% endhighlight %}

### [Bleachbit][10]
Go to software center and install it.

It removes unnecessary files off your laptop. There are a lot of options provided form web history to bash history.

### [MusicBrainz Picard][11]
Go to software center and install it.

This is a product of [MusicBrainz Foundation][11a] which, for your information, is a web-service having data about the music you must have. Here data meaning metadata, metadata meaning the data about each song made commercially. Metadata like name of song, name of album, artist, year of release etc. This wiki or music database is organized and maintained by the people like you and me.
Now, what [Picard][11] does is help you make your music's metadata better. You must have had cases where the metadata of you music wasn't present or  was incorrect like when you download some songs via torrent or other sites and in your song title or artist name some sitename occurs (eg: Coldplay-Shiver-brought to you by-troll.com). I know even if it's not that big of a deal it still annoys. Picard helps in that. It searches its database and corrects its metadata. It also downloads the album art from it's databases.

### [wget][12]
Usually, it's already present in the distro.

Downloads anything - video, audio, image, zip - by just providing a link after the command. It's a command line tool.

### [cURL][13]
Helps me in sending all kind of requests, whatever it is - GET, POST, DELETE, PUT etc, to a server. You can also download an html page or some other downloadable file with this tool (yeah, same as wget). It's a command line [tool][13a].

{% highlight sh %}
sudo apt-get install curl
{% endhighlight %}

### [youtube-dl][14]
You want to download a Youtube video without using any plugin or extension via terminal, then this is the command line tool for you. It can download any video (I haven't been disappointed yet) off the Internet. Just give it the url of the video you want downloaded.

{% highlight sh %}
sudo apt-get install youtube-dl
{% endhighlight %}

### Music Player

- **[Clementine][15a]**
Best music player in terms of functionality and easiness. You will get a hang of it soon enough. With plugins like scrobbler already built in the software.

- **[Deepin Music Player][15b]**
Since switching to the Deepin linux (yeah I have switched on it) I didn't need any other music player. It's good looking with less clutter. What I miss in this player is the absence of scrobbler. I am thinking of adding that support to it and generate a PR to the Deepin guys. Lets see if it happens or not. May be they are already planning or implementing it.

### Video Player

- **[vlc][16a]**
Who can deny the dominance of VLC?
It has a large array of settings and functionality. It can play anything. I used to be my default player until...

- **[Deepin Movie][16b]**
Yeah, until I used Deepin Movie. Its looks awesome. Have the basic things that I need in a video player. It has been able to play everything I have played on it yet. No other bullshit. It's just awesome.

### [Jekyll][17]
{% highlight sh %}
sudo apt-get install jekyll
{% endhighlight %}

make sure you have libssl-dev installed:

{% highlight sh %}
dpkg -s libssl-dev
{% endhighlight %}

if not, install it:

{% highlight sh %}
sudo apt-get -y install libssl-dev
{% endhighlight %}

download Ruby, rubygems, node from here and build them. Then install jekyll by,

{% highlight sh %}
sudo gem install jekyll
{% endhighlight %}

Jekyll is my blog framework. All this reading you are doing here is due to the jekyll. You can change the theme if you want to. Its much better than Wordpress in every respect.

### [Firefox][18]
Yeah I gotta include it here. It is a good piece of software by [Mozila][18a]. Here syncing is present but not like Chrome. In Chrome it's simpler in Firefox you gotta create your account whose credentials I used to forget. So I didn't get my previously synced data.

**Addons**

- Addblock Plus  
- Dictionary Extension  
- Down Them All  
- Ginger Grammar and Spell Checker  
- InstantFox  
- Pocket  
- Session Manager  
- Thumbnail Zoom Plus  
- Lazarus  
- Evernote Web Clipper  
- Disconnect  
- Tab Mix Plus  
- Video DownloadHelper  
- Xmarks  
- InvisibleHand  
- Hola Unblocker  
- Barlesque  

### [Mackup][19]
Keep your application settings in sync. If you have Dropbox installed and want to use it to save your config files, that's super easy. Supported for Linux/OS X.

### Qt4 Designer
As the name suggests you can design apis with this software instead of making everything with code. It'll make a .ui file which can easily be converted to a python class to be used with pyqt4.

----

This above list of packages I use will change with time. More additions, removals and modifications will be done in the future.

I started writing this blog post in Linux Mint and am now ending it in Deepin after 2-3 weeks. During this time I was settling in my new virtual home, installing it, re-installing it, re-re-installing it. It was fun doing that. My post evolved during this whole time. And, now it's time to sign off.

SR.

[1]: http://www.sublimetext.com/
[1a]: https://sublime.wbond.net/installation
[1b]: https://bitbucket.org/StephaneBunel/pythonpep8autoformat
[1d]: https://github.com/randy3k/AlignTab
[1e]: https://github.com/jonathandelgado/SublimeTodoReview
[1f]: https://github.com/wbond/sublime_terminal
[1g]: https://github.com/Monnoroch/ColorHighlighter
[1h]: https://github.com/SublimeText-Markdown/MarkdownEditing
[1i]: https://github.com/jisaacks/GitGutter
[1j]: https://github.com/duydao/Text-Pastry
[1k]: https://sublime.wbond.net/packages/GhostText
[1l]: https://github.com/SublimeText/Origami
[1c]: https://sublimecodeintel.github.io/SublimeCodeIntel/
[2]: https://help.ubuntu.com/community/SynapticHowto
[3]: http://git-scm.com/
[3a]: https://github.com
[4]: https://www.python.org/
[5]: https://pip.pypa.io/en/latest/
[6]: http://virtualenv.readthedocs.org/en/latest/
[7]: https://www.google.com/chrome/browser/
[7a]: https://en.wikipedia.org/wiki/Usage_share_of_web_browsers
[7b]: https://www.google.com/landing/now/
[7c]: https://chrome.google.com/webstore/category/collection/for_your_desktop
[7d]: https://chrome.google.com/webstore/detail/adblock/gighmmpiobklfepjocnamgkkbiglidom
[7e]: https://chrome.google.com/webstore/detail/google-dictionary-by-goog/mgijmajocgfcbeboacabfgobmjgjcoja
[7f]: https://chrome.google.com/webstore/detail/google-keep-notes-and-lis/hmjkmjkepdijhoojdojkdfohbdgmmhki
[7g]: https://chrome.google.com/webstore/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb
[7h]: https://chrome.google.com/webstore/detail/hover-zoom/nonjdcjchghhkdoolnlbekcfllmednbl
[7i]: https://chrome.google.com/webstore/detail/pocket/mjcnijlhddpbdemagnpefmlkjdagkogk
[7j]: https://chrome.google.com/webstore/detail/save-to-pocket/niloccemoadcdkdjlinkgdfekeahmflj
[7k]: https://chrome.google.com/webstore/detail/session-buddy/edacconmaakjimmfgnblocblbcdcpbko
[7l]: https://chrome.google.com/webstore/detail/stylish/fjnbnpbmkenffdnngjfgmeleoegfcffe?hl=en
[7la]: https://github.com/mdo/github-wide
[7lm]: https://chrome.google.com/webstore/detail/ghosttext-for-chrome/godiecgffnchndlihlpaajjcplehddca?hl=en
[7m]: https://chrome.google.com/webstore/detail/the-great-suspender/klbibkeccnjlkjkiokjodocebajanakg
[8]: https://www.dropbox.com/
[9]: http://jonls.dk/redshift/
[10]: http://bleachbit.sourceforge.net/
[11]: https://musicbrainz.org/doc/MusicBrainz_Picard
[11a]: https://musicbrainz.org/
[12]: https://www.gnu.org/software/wget/
[13]: https://en.wikipedia.org/wiki/CURL
[13a]: http://curl.haxx.se/
[14]: https://rg3.github.io/youtube-dl/
[15a]: https://www.clementine-player.org/
[15b]: https://github.com/linuxdeepin/deepin-music-player
[16a]: https://www.videolan.org/vlc/index.html
[16b]: https://github.com/linuxdeepin/deepin-movie
[17]: http://jekyllrb.com/docs/installation/
[18]: https://www.mozilla.org/en-US/firefox/new/
[18a]: https://www.mozilla.org/en-US/
[19]: https://github.com/lra/mackup