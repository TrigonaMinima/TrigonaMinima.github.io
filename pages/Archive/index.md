---
layout: page
title: Archive
permalink: /archive/
---

<!-- <div  style="text-align: center;"> -->
<div>
      {% for post in site.posts %}
            {% unless post.quote == 'y' %}
                <!-- <li> -->
                <a href="{{ post.url }}">{{ post.title }}</a>
                <div style="float: right">
                    {{ post.annotation }}
                </div>
                  
                  <br>
                <!-- </li> -->
            {% endunless %}
      {% endfor %}
</div>