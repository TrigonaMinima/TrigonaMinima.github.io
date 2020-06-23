---
layout: page
title: Annotations
permalink: /annotations/
---

{% assign sortedcats = site.categories | sort %}

<!-- https://superdevresources.com/tag-cloud-jekyll/ -->
<div class="site-tag">
{% for category in sortedcats %}
  <a href="#{{ category | first | slugify }}" style="font-size: {{ category | last | size | times: 10 | plus: 100 }}%">{{ category[0] }} ({{ category | last | size }})</a>,
{% endfor %}
</div>

<br>

<div>
  {% for category in sortedcats %}
    <h3><a name="{{ category | first | slugify }}"></a>{{ category[0] }}</h3>
    {% for post in category[1] %}
        <li style="list-style-type: none;">
          <time class="post-meta">{{ post.date | date: "%d-%m-%Y" }}</time>&nbsp;&nbsp;
          <a href="{{ post.url }}">{{ post.title }}</a>
        </li>
    {% endfor %}
    <br>
  {% endfor %}
</div>
