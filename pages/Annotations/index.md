---
layout: page
title: Annotations
permalink: /annotaions/
---

<div>
{% for category in site.categories %}
  <a href="#{{ category[0] }}">{{ category[0] }} ({{ category[1].size }})</a>, 
{% endfor %}
</div>
<br>

<div>
  {% for category in site.categories %}
    <h3><a name="{{ category[0] }}"></a>{{ category[0] }}</h3>
    {% for post in category[1] %}
        <li style="list-style-type: none;">
          <time class="post-meta">{{ post.date | date: "%d-%m-%Y" }}</time>
          <a href="{{ post.url }}">&nbsp;&nbsp;{{ post.title }}</a>
        </li>
    {% endfor %}
    <br>
  {% endfor %}
</div>
