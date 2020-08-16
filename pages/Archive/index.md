---
layout: page
title: Archive
permalink: /archive/
---

<div class="heatmap"></div>
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

<!-- heatmap visualization stuff -->
<script src="https://d3js.org/d3.v5.min.js"></script>
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/chroma-js/2.1.0/chroma.min.js"></script> -->
<script type="text/javascript" src="{{ "/js/heatmap.js" | prepend: site.baseurl }}"></script>
