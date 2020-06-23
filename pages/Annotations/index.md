---
layout: page
title: Annotations
permalink: /annotations/
---

{% assign sortedcats = site.categories | sort %}

<div>
{% for category in sortedcats %}
  <a href="#{{ category[0] }}">{{ category[0] }} ({{ category[1].size }})</a>,
{% endfor %}
</div>
<br>
<div>
  {% for category in sortedcats %}
    <h3><a name="{{ category[0] }}"></a>{{ category[0] }}</h3>
    {% for post in category[1] %}
        <li style="list-style-type: none;">
          <time class="post-meta">{{ post.date | date: "%d-%m-%Y" }}</time>&nbsp;&nbsp;
          <a href="{{ post.url }}">{{ post.title }}</a>
        </li>
    {% endfor %}
    <br>
  {% endfor %}
</div>
