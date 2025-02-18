---
title: "Mountain.rb - Dag 2"
date: 2010-10-19
last_updated_by: peter
---
<img class="alignright size-full wp-image-890" style="margin-bottom: 1em;" title="Boulder Theater" src="/assets/legacy/uploads/2010/10/mountain-rb-theater.jpg" alt="" width="750" height="189" /><img class="size-medium wp-image-816    alignright" style="float: right;" title="mountain-rb-wave" src="/assets/legacy/uploads/2010/10/mountain-rb-wave-300x81.png" alt="" width="240" height="65" />

## Jim Weirich (<a href="http://twitter.com/jimweirich">@jimweirich</a>) - “<a href="http://github.com/jimweirich/presentation_to_infinity">To Infinity And Beyond</a>”

Jim höll i konferensens första keynote, titeln löd <a href="http://github.com/jimweirich/presentation_to_infinity"><em> </em></a> och innehöll allt från Speciella relativitetsteorin, rymdresor och Jims släktskap med folkgruppen Amish.

<blockquote>Our world is stranger than we think</blockquote>

Jim identifierade några områden som går att förbättra:

<ul>
	<li>Testning/Expressiveness (Han har börjat jobba på ramverket Given)</li>
	<li>Parallellism och stöd för flera CPU-kärnor</li>
	<li>Message passing mellan Ruby VMs</li>
</ul>

## Tech Block #1

### Jay McGavren (<a href="http://twitter.com/jaymcgavren">@jaymcgavren</a>) - “Ruby on Android with Ruboto”

<img title="mountain-rb-robot" src="/assets/legacy/uploads/2010/10/mountain-rb-robot-174x300.png" alt="" width="88" height="151" />

Jay berättade om <a href="http://ruboto.org/">Ruboto</a> vilket är ett projekt som gör det möjligt att köra Ruby under Android.

Som demonstration körde han en <a href="http://ruby-doc.org/stdlib/libdoc/drb/rdoc/index.html">DRb</a> server med <a href="http://github.com/jashkenas/ruby-processing">Ruby Processing</a> som han sedan fjärrstyrde från sin Androidmobil.

Tydligen har <a href="http://en.wikipedia.org/wiki/Dalvik_%28software%29">Dalvik</a> en väldigt långsam <a href="http://en.wikipedia.org/wiki/Reflection_(computer_science)">reflektion</a>, men det är något man aktivt jobbar med att lösa.

### Wayne Seguin (<a href="http://twitter.com/wayneeseguin">@wayneeseguin</a>) - “Do not Bring a Sword to a Gun Fight”

<img title="mountain-rb-sword" src="/assets/legacy/uploads/2010/10/mountain-rb-sword-300x71.png" alt="" width="216" height="51" />

Kortfattat kan man säga att föreläsningen handlade om att välja rätt verktyg för jobbet.

<blockquote>Common sense isnt’t that common</blockquote>

De steg som Wayne gick igenom var:

<ul>
	<li>Definiera problemet</li>
	<li>Förstå problemet</li>
	<li>Hitta möjliga lösningar på problemet</li>
	<li>Utvärdera de olika lösningarna</li>
	<li>Lös problemet</li>
</ul>

Wayne är kanske mest känd för att ha skapat versionshanteraren <a href="http://rvm.beginrescueend.com/">RVM</a>.

<h3>Tony Arcieri (<a href="http://twitter.com/bascule">@bascule</a>) - “Reia: Ruby Evolved”</h3>

Tony berättade om <a href="http://wiki.reia-lang.org/wiki/Reia_Programming_Language">Reia</a> (uttalas RAY-uh), vilket är ett Ruby/Python-liknande språk som körs under <a href="http://erlang.org/">Erlangs</a> VM (BEAM)

Projektet är i sin linda, men källkoden ligger självklart på <a href="http://github.com/tarcieri/reia">GitHub</a> så det är bara att sätta igång och experimentera om man känner att man behöver en något trevligare syntax än vad Erlang erbjuder. En trevlig liten detalj är att en <a href="http://json.org/">JSON</a>-parser finns inbyggd i språket. Stränghanteringen är även helt OK, men inte direkt snabb.

<blockquote>The fun syntax isn’t that <strong>FUN</strong> in Erlang</blockquote>

## Lunch

Under lunchen snackade jag lite med Joshua Timberman (<a href="http://twitter.com/jtimberman">@jtimberman</a>) från <a href="http://opscode.com/">Opscode</a>. De utvecklar verktyget <a href="http://www.opscode.com/chef/">Chef</a> vilket används för deployment och konfiguration av servrar på infrastrukturnivå (Server configuration management). Som alternativ kan man nämna <a href="http://www.puppetlabs.com/puppet/introduction/">Puppet</a> från Puppet Labs.

## Evan Phoenix (<a href="http://twitter.com/evanphx">@evanphx</a>) - “Staking your Claim in OSS”

Evan gick igenom hur man driver ett lyckat open source-projekt. Fyra av de viktigaste poängerna var:

<ul>
	<li>Karma</li>
	<li>Open source är ett socialt fenomen</li>
	<li>Kommunicera!</li>
	<li>
        Var trevlig och håll en sansad ton, även om du inte vill acceptera vissa patchar.
        <br>
        <img title="mountain-rb-forks" src="/assets/legacy/uploads/2010/10/mountain-rb-forks-176x300.png" alt="" width="123" height="210" />
    </li>
</ul>

<blockquote>Fork for LOVE!</blockquote>

Det självklara exempelprojektet var hans eget heltidsprojekt <a href="http://rubini.us/">Rubinius</a>.

_(En implementation av Ruby, <a href="http://www.engineyard.com/">Engine Yard</a> sponsrar utvecklingen)_

### Rubinius

Projektet har många utvecklare då man från början bestämt att det räcker med en enda patch för att få commit-rättigheter. Evan beskrev lätta buggfixar som lågt hängande frukt och en “gateway drug” för nya utvecklare.

De har haft färre än 10 reverts under de tre år som projektet har funnits. Mycket beroende på det sociala kontraktet mellan utvecklarna.

<img title="mountain-rb-social-contract" src="/assets/legacy/uploads/2010/10/mountain-rb-social-contract-160x300.png" alt="" width="96" height="180" />

## Joe O'Brien (<a href="http://twitter.com/objo">@objo</a>) - “Everyone should know a little about Sales”

Joe berättade om sina erfarenheter som säljare och varför försäljning fått ett så dåligt rykte. Hans poäng var att försäljning handlar om att identifiera behov och hitta lösningar som passar båda parter. (Ganska likt det vi utvecklare gör) Han fortsatte även med att <strong>alla</strong> anställda är säljande, oavsett yrkesroll.

## Peter Jackson (<a href="http://twitter.com/peteonrails">@peteonrails</a>) - “Introduction to Geospatial Programming with GeoRuby, PostGIS, and OpenLayers”

Peter hade en ganska generell genomgång av geospatiell mappning (projektion/geometri) samt en snabb genomgång av projekten <a href="http://georuby.rubyforge.org/">GeoRuby</a>, <a href="http://postgis.refractions.net/">PostGIS</a> och <a href="http://openlayers.org/">OpenLayers</a>.

## Jay Zeschin (<a href="http://twitter.com/jayzes">@jayzes</a>) - “Avoiding the Seven Year Itch”

<img title="mountain-rb-complexity" src="/assets/legacy/uploads/2010/10/mountain-rb-complexity-300x139.png" alt="" width="210" height="97" />


Jay från <a href="http://www.factorylabs.com/">Factory Design Labs</a> avslutade dagens föreläsningar med lite tips för de
som sitter fast i långtgående projekt, föråldrade projektmodeller eller legacy-system.
Han nämnde även den stora tekniska skuld som (oftast) finns i projekt av den typen.

<blockquote>A project is a relationship</blockquote>

<ul>
	<li>Uppbrott</li>
	<li>Tyst lidande</li>
	<li>Ta lärdom och gå vidare</li>
</ul>

<blockquote>Developers have a vast amount of domain knowledge</blockquote>

Jay hade även en lista på vad man bör göra för att rädda ett projekt av denna typ:

<ul>
	<li>Snabb återkoppling (<em>test/deploy</em>)</li>
	<li>Var hänsynslös</li>
	<li>Spikes regelbundet + En titt på verkligheten</li>
	<li>Driv engagemang</li>
	<li>Sälj in fördelarna</li>
	<li>Bygg upp ett förtroende</li>
</ul>

## Quick Left Hackfest

På kvällen gick vi till <a href="http://quickleft.com/">Quick Left</a> och fortsatte diskussionerna, kodade lite och käkade pizza.

/ [Peter](/peter)
