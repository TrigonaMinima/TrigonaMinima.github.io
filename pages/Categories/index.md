---
layout: page
title: Categories
permalink: /categories/
---

<div style="text-align: center;">

  {% for category in site.categories %}
    <h3>{{ category[0] }} ({{ category[1].size }}) </h3>
    {% for post in category[1] %}
      {% unless post.quote == 'y' %}
        <!-- <li> -->
          <a href="{{ post.url }}">
            <h4>{{ post.title }}</h4>
          </a>
        <!-- </li> -->
      {% endunless %}
    {% endfor %}
  {% endfor %}

</div>