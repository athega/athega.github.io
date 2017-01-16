---
---
{% comment %} Concatenation and basic whitespace minification of JavaScript files {% endcomment %}{% capture js %}

{% include lib/jquery-3.1.1.min.js %}
{% include header.js %}
{% include header/main-menu.js %}
{% include home/featured-blog.js %}
{% include lib/owl.carousel.min.js %}

{% endcapture %}{% assign lines = js | split: "
" %}{% for line in lines %}{% assign str = line | strip %}{% assign comment = str | truncate: 2, "" %}{% unless comment == '//' %}{{ str }}{% endunless %}{% endfor %}