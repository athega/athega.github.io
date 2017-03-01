---
title: "RailsConf: Tutorials"
date: 2009-05-05
last_updated_by: peter
---
<img src="https://athega.se/system/uploads/2009/05/ruby_dinette.jpg" alt="ruby_dinette" title="ruby_dinette" width="750" height="280" class="alignnone size-full wp-image-172" />

<h2 id="jruby_on_rails_nick_sieger_sun_microsystems">JRuby on Rails - Nick Sieger (<a href="http://sun.com">SUN Microsystems</a>)</h2>

<p>Presentationen: <a href="http://blog.nicksieger.com/jruby-railsconf-2009.pdf">jruby-railsconf-2009.pdf</a></p>

<p>Huvudpunkterna på föreläsningen var:</p>

<ul>
<li>Installation</li>
<li>Utveckling</li>
<li>Prestandatestning</li>
<li>Interaktion med Java</li>
<li>Testning</li>
</ul>

<p>Jag hade gärna sett att han gått in lite mer på djupet om skillnaderna 
mellan JRuby och MRI, Olika sätt att deploya (Han visade GlassFish, 
med tveksamt resultat)</p>

<p>Ett verktyg jag helt klart kommer att använda mig av i framtiden är <a href="https://visualvm.dev.java.net/">VisualVM</a>.</p>

<h2 id="a_hat_full_of_tricks_with_sinatra_blake_mizerany_heroku">A Hat Full of Tricks with Sinatra - Blake Mizerany (<a href="http://heroku.com">Heroku</a>)</h2>

<p>Det första som händer är att <a href="http://chneukirchen.org/">Christian Neukirchen</a>, 
huvudutvecklaren av <a href="http://rack.rubyforge.org/">Rack</a> sätter sig brevid mig.</p>

<p>Första fjärdedelen av Blakes föreläsning handlar inte om 
<a href="http://www.sinatrarb.com/">Sinatra</a> över huvud taget utan om just <a href="http://rack.rubyforge.org/">Rack</a>.</p>

<h3 id="minimal_rack_applikation">Minimal Rack-applikation</h3>

    run lambda { |env| [200, {'Content-Type' => 'text/html'}, ['Hello']] }

<h3 id="minimal_sinatra_applikation">Minimal Sinatra-applikation</h3>

    require 'sinatra'
    
    get '/' do
      'Hello'
    end

<h3 id="rekomenderade_bcker">Rekomenderade böcker</h3>

<ul>
<li><a href="http://www.amazon.com/exec/obidos/ASIN/0135974445/objectmentorinc">Agile Software Development, Principles, Patterns, and Practices</a></li>
</ul>

<h3 id="exempelkod">Exempelkod</h3>

<ul>
<li>Modulen <a href="http://github.com/bmizerany/sinatra-captcha/tree/master">sinatra-captcha</a></li>
</ul>

<h2 id="links">Relaterade länkar</h2>
<ul>
  <li><a href="http://blogs.sun.com/arungupta/entry/rails_conf_2009_day_1">http://blogs.sun.com/arungupta/entry/rails_conf_2009_day_1</a></li>
</ul>

<img src="https://athega.se/system/uploads/2009/05/gae_hackathon.png" alt="gae_hackathon" title="gae_hackathon" width="750" height="818" class="alignnone size-full wp-image-176" />

// [Peter](/peter)
