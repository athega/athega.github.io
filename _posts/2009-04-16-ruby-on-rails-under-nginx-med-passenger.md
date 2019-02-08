---
title: "Ruby on Rails under Nginx med Phusion Passenger"
date: 2009-04-16
last_updated_by: peter
---
<a href="http://wiki.nginx.org/"><img class="size-full wp-image-135" title="nginx-logo" src="/assets/legacy/uploads/2009/04/nginx-logo.png" alt="Nginx" width="350" height="90" /></a>

Sedan några timmar så kan man köra <a href="http://www.modrails.com/">Phusion Passenger</a> under <a href="http://wiki.nginx.org/Main">Nginx!</a>

<a href="http://www.modrails.com/">Phusion Passenger</a> och <a href="http://httpd.apache.org/">Apache</a> har under en tid varit det populäraste sättet att enkelt driftsätta <a href="http://rubyonrails.org/">Ruby on Rails</a> och <a href="http://rack.rubyforge.org/">Rack</a>-applikationer. Nu kan man alltså välja att köra Passenger under den ryska (och <a href="http://www.linuxjournal.com/article/10108">tokigt snabba</a>) <a href="http://wiki.nginx.org/Main">Nginx</a>.

Det enda man behöver göra är:
<ol>
	<li>Installera gem: <code style="padding: 0 0.5em; color: #fff; background-color: #000;">sudo gem install passenger</code></li>
	<li>Köra Nginx installern: <code style="padding: 0 0.51em; color: #fff; background-color: #000;">sudo passenger-install-nginx-module</code></li>
	<li>Konfigurera (Det mesta sköts automagiskt)</li>
	<li>Starta</li>
</ol>
Mer ingående instruktioner finns på <a href="http://blog.phusion.nl/2009/04/16/phusions-one-year-anniversary-gift-phusion-passenger-220">Phusion’s blogg</a>
<h2>Phusion Passenger</h2>
Hongli Lai och Ninh Bui <a href="http://en.oreilly.com/rails2008/public/schedule/detail/4354">presenterade</a> Phusion Passenger (också känd som <strong>mod_rails</strong>) under <a href="http://en.oreilly.com/rails2008/">RailsConf 2008</a>, det var då jag verkligen fick upp ögonen för projektet.

I den nya versionen har Phusion-grabbarna förutom att man nu kan använda sig av två olika webbservrar för att köra Passenger lagt till:
<ul>
	<li>Stöd för "chunked file uploads"</li>
	<li>Stöd för Capistranos sätt att sköta driftsättning (Symlänkning av <code>current</code> osv.)</li>
	<li>Förmåga att ladda <code>application_controller.rb</code> från en icke-standard sökväg</li>
	<li>"Worker process event hooks" för Rack</li>
</ul>
<h2>Nginx</h2>
Nginx driver ett flertal stora webbplatser, såsom <a class="external text" title="http://www.wordpress.com" rel="nofollow" href="http://www.wordpress.com/">WordPress</a>, <a class="external text" title="http://www.hulu.com" rel="nofollow" href="http://www.hulu.com/">Hulu</a>, <a class="external text" title="http://www.github.com/" rel="nofollow" href="http://www.github.com/">Github</a>, och <a class="external text" title="http://www.ohloh.net/" rel="nofollow" href="http://www.ohloh.net/">Ohloh</a>. Den serverar mer än två miljoner webbplatser och är därmed den näst populäraste webbservern under Linux.

<img class="alignnone size-full wp-image-137" title="Fördelning mellan olika webbservrar" src="/assets/legacy/uploads/2009/04/web_servers_pie_chart.png" alt="Fördelning mellan olika webbservrar" width="300" height="150" />

// [Peter](/peter)
