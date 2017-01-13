---
---
{% comment %} Concatenation and basic whitespace minification of JavaScript files {% endcomment %}{% capture js %}

{% include js/jquery-3.1.1.min.js %}
{% include js/script.js %}
{% include js/owl.carousel.min.js %}

{% endcapture %}{% assign lines = js | split: "
" %}{% for line in lines %}{% assign str = line | strip %}{% assign comment = str | truncate: 2, "" %}{% unless comment == '//' %}{{ str }}{% endunless %}{% endfor %}