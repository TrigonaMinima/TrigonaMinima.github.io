---
layout: page
title: Archive
permalink: /archive/
---

<div class="home">

      {% for post in site.posts %}
            {% unless post.quote == 'y' %}
                <li>
                  <a href="{{ post.url }}">{{ post.title }}</a>
                </li>
            {% endunless %}
      {% endfor %}

</div>