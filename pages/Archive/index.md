---
layout: page
title: Archive
permalink: /archive/
---

<div  style="text-align: center;">

      {% for post in site.posts %}
            {% unless post.quote == 'y' %}
                <!-- <li> -->
                  <a href="{{ post.url }}">{{ post.title }}</a>
                  <br>
                <!-- </li> -->
            {% endunless %}
      {% endfor %}

</div>