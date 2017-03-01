---
title: "RailsConf: Onsdag"
date: 2009-05-07
last_updated_by: peter
---
<h2 id="keynote_chris_wanstrath">Keynote: Chris Wanstrath</h2>

<p>Presentationen: <a href="https://gist.github.com/0a2655aed6a26fa15a02">https://gist.github.com/0a2655aed6a26fa15a02</a></p>

<h2 id="rails_metal_rack_and_sinatra">Rails Metal, Rack, and Sinatra</h2>

<p>Adam Wiggins (<a href="http://heroku.com">Heroku</a>) berättade om hur Rails Metal går att kombinera med Sinatra.</p>

<h2 id="what_makes_ruby_go_an_implementation_primer">What Makes Ruby Go: An Implementation Primer</h2>

<p>Charles Nutter (<a href="http://sun.com">Sun Microsystems</a>) och Evan Phoenix (<a href="http://engineyard.com/">Engine Yard</a>) gick igenom olika delar av Ruby som man behöver tänka på för att inte stöta på prestandaproblem.</p>

<h3 id="metodanrop">Metodanrop</h3>

<p>Att cache:a metodanrop ger generellt sett den största prestandavinsten.</p>

<p>Object#extend är dock ett stort problem för att kunna cache:a metodanropen.</p>

<p>Det är viktigt att förstå hur extend fungerar så att man inte tömmer 
metodanropscachen i onödan.</p>

<h3 id="konstanter">Konstanter</h3>

<p>För att hålla prestandan upp ska man hålla konstanter konstanta, inte helt oväntat.</p>

<h3 id="options_argument">Options Argument</h3>

<p>En option hash strider mot DRY. 
Det är mycket snabbare att använda diskreta argument.</p>

<h3 id="objrun_rescue_nil">obj.run rescue nil</h3>

<p>Det är otroligt ovanligt att man vill fånga alla StandardError, vilket är 101 underklasser; IOError, SecurityError, TypeError, Etc.</p>

<h3 id="objrun_rescue_exception">obj.run rescue Exception</h3>

<p>I stort sett samma sak som rescue nil, fast värre, nu kan man inte ens  ctrl-C&#8217;a ut ur koden.</p>

<h3 id="autoload">Autoload</h3>

<p>Helt tråd-osäkert, fördröjer laddning av koden.
Använder inte Kernel#require, alltså går det inte att köra autoload från gems.</p>

<h3 id="super">Super</h3>

<p>Man måste ta bort blocket om man inte vill att det ska skickas uppåt:</p>

    super(a, &nil)

<p>Super ser bara senaste versionen av argumenten:</p>

    def foo(a, b)
      a = 1
      b = 'bar'
      super
    end

<h3 id="slutsats">Slutsats</h3>

<ul>
<li>Enkel kod > Komplex kod</li>
<li>Det finns inga gratis luncher</li>
<li>Tänk igenom två gånger, skriv koden en gång</li>
<li>YAGNI</li>
</ul>

<h2 id="call_into_your_ruby_code_writing_voice_enabled_apps_in_ruby_with_adhearsion">Call into your Ruby code! Writing voice-enabled apps in Ruby with Adhearsion</h2>

<p>Jay Phillips (<a href="http://jicksta.com/">Codemecca LLC</a>) visade hur man kan programmera Ruby för att styra <a href="http://www.asterisk.org/">Asterisk</a> genom att använda sig av <a href="http://adhearsion.com/">Adhearsion</a>.</p>

<p>Tyvärr fungerade det inte att använda Ahearsions Sandbox på konferensens wlan, 
så jag får ta och testa det lite senare.</p>

<p>Verkar intressant att kunna styra sin applikation genom att ringa till den :)</p>

// [Peter](/peter)
