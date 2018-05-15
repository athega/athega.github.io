---
# Concatenation and basic whitespace minification of JavaScript files
---
{% capture js %}

{% include lib/jquery-3.2.1.min.js %}
{% include header.js %}
{% include header/main-menu.js %}
{% include home/intro.js %}
{% include home/intro-bg.js %}
{% include home/blog.js %}

{% endcapture %}{% assign lines = js | split: "
" %}{% for line in lines %}{% assign str = line | strip | replace: "`", "'" %}{% assign comment = str | truncate: 2, "" %}{% unless comment == '//' %}{{ str }}{% endunless %}{% endfor %}