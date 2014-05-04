---
layout: post
title:  "'Open Terminal Here' hotkeyed"
date:   2014-05-04
category: Linux prob
---

I expected that my first actual post would be about something related to Philosophy or Computer or Physics that is, anything pseudo intellectual, but I am going to write about the problem I faced in Linux. The problem was to have a hotkey for "Open in Terminal" (in Linux Mint) with variants as "Open Terminal here" (in Ubuntu). Without the hotkey one have to right click in the respective directory opened in file manager (Nemo in Linux Mint) and then select "Open in Terminal". 
Having a hotkey for this comes in handy and makes the life simpler. I googled it (Yeah, some people couldn't even do that properly, even **keyboard ninjas**), looked through a few posts of Linux mint forum and found the solution as follows.

Copy the following code snippet and place the code file (named anything you want) in  - *"~/.gnome2/nemo-scripts"*

{% highlight sh %}
#!/bin/bash
cd $NEMO_SCRIPT_CURRENT_URI
exec gnome-terminal
{% endhighlight %}

After the above step make the file executable by running the command in current directory or you can also got to the properties and checking on the "Allow executing file as program" in permissions tab.

{% highlight sh %}
chmod +x your-file.sh
{% endhighlight %}

Now waiting for a few minutes for the regeneration of accels file open the file *"~/.gnome2/accels/nemo"*. Find the line similar to 

{% highlight sh %}
; (gtk_accel_path "<Actions>/ScriptsGroup/script_file:\\s\\s\\shome\\sd\\s.gnome2\\snemo-scripts\\sopen-terminal" "")
{% endhighlight %}

Edit it by removing the ';' (uncommenting it) from the beginning and add your own hotkey in between the " ".
For example if you want **ctrl+j** as hotkey here it becomes **`<Primary>`j**. In place of **Primary** you can use **Alt** or **Shift** or any combination of these.

You can checkout the Forum answer **[here][here]**.

[here]: http://forums.linuxmint.com/viewtopic.php?f=90&t=146565#p773382