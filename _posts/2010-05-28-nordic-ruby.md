---
title: "Nordic Ruby"
date: 2010-05-28
last_updated_by: peter
---
Förra fredagen åkte jag, Robert och Mats ner till Göteborg för att gå på konferensen <a href="http://nordicruby.org">Nordic Ruby</a>.
<h2 id="lrdag">Lördag</h2>
<h3 id="standing_on_the_shoulders_of_giants">Standing On the Shoulders of Giants</h3>
<a href="http://twitter.com/coreyhaines">Corey Haines</a> inledde konferensen med en uppmaning om att reflektera över hur och varför man arbetar som man gör.
<blockquote>
<p style="text-align: left;">“Message passing, not objects”
“Lotus notes is a good document database”</p>
</blockquote>
<h3 id="cucumber_inside">Cucumber Inside</h3>
<a href="http://twitter.com/aslak_hellesoy">Aslak Hellesøy</a> höll konferensens andra föreläsning och ämnet var inte helt oväntat testramverket <a href="http://cukes.info/">Cucumber</a> samt dess språk Gherkin vilket nu har extraherats till en <a href="http://rubygems.org/gems/gherkin">gem</a>.

Den imponerande prestandaökningen i Cucumber den senaste tiden beror på att man har bytt ut <a href="http://treetop.rubyforge.org/">TreeTop</a> mot <a href="http://www.complang.org/ragel/">Ragel</a>.

Aslak nämnde även hur <a href="http://wiki.github.com/aslakhellesoy/cucumber/hooks">hooks</a> i Cucumber fungerar.
<h3 id="neo4jrb_the_benefits_of_graph_database">Neo4j.rb - The Benefits of Graph Database</h3>
<a href="http://twitter.com/ronge">Andreas Ronge</a> berättade om sitt projekt <a href="http://github.com/andreasronge/neo4j">Neo4j.rb</a> vilket är en grafdatabas för <a href="http://jruby.org/">JRuby</a>.
<ul>
	<li>Inbäddad</li>
	<li>ACID</li>
	<li>Inga scheman</li>
	<li>Inga externa beroenden</li>
	<li>Enbart skrivlås</li>
</ul>
De två javabibliotek som är inblandade är <a href="http://neo4j.org/">Neo4j</a> samt <a href="http://lucene.apache.org/">Lucene</a>. Neo4j inkluderar ett flertal algoritmer, t.ex. <a href="http://en.wikipedia.org/wiki/Dijkstra%27s_algorithm">Dijkstra</a>.

Möjligheten att traversera djupa relationsgrafer verkar ha ett ganska begränsat användningsområde, men när man väl behöver göra det så är det säkerligen mycket kraftfullt.
<h3 id="rubyists_you_can_write_javascript_again">Rubyists, you can write JavaScript again</h3>
Priset för konferensens effektfullaste introduktion måste gått till <a href="http://twitter.com/drnic">Dr Nic</a> a.k.a. Iron Man.

Han började med att nämna att man kan köra JavaScript i Ruby med hjälp av <a href="http://github.com/jbarnette/johnson">Johnson</a> (<a href="http://www.mozilla.org/js/spidermonkey/">Mozilla SpiderMonkey</a>) och att man kan använda <a href="http://github.com/smparkes/capybara-envjs">capybara-envjs</a> för att testa sina javascript på serversidan. Men efter det var det CoffeeScript som gällde.
<blockquote>
<p style="text-align: left;">“Capybara because it’s AWESOME”</p>
</blockquote>
<a href="http://jashkenas.github.com/coffee-script/">CoffeeScript</a> är i korta drag:
<ul>
	<li>De bra delarna i JavaScript</li>
	<li>Det <a href="http://haml-lang.com/">Haml</a> är för HTML och <a href="http://sass-lang.com/">Sass</a> är för CSS</li>
	<li>Går att kombinera med alla JavaScript-bibliotek (<a href="http://jquery.com/">jQuery</a>!)</li>
	<li>Kompilatorn är skriven i CoffeeScript! (Går alltså att köra i en webbläsare)</li>
	<li>Implicita returvärden</li>
	<li>Inga onödiga tecken</li>
	<li>Går att köra i <a href="http://nodejs.org/">Node.js</a></li>
</ul>
<h3 id="enough_design">Enough Design</h3>
<a href="http://twitter.com/imf">Ian McFarland</a> från <a href="http://pivotallabs.com/">Pivotal Labs</a> pratade om agila designprocesser och hur viktigt det är med en kort “feedback loop”.

Han påpekade att det är viktigt att iterera över problem, oavsett storlek.

En bra design är:
<ul>
	<li>Modulär</li>
	<li>Principfast</li>
	<li>Regelbaserad</li>
	<li>UX &gt; Pixlar!</li>
</ul>
<h3 id="the_ruby_advantage_metaprogramming_and_dsls_pdf_22mb">The Ruby advantage - metaprogramming and DSLs (<a href="http://github.com/niclasnilsson/presentation_ruby_metaprog_dsls/raw/master/dsl-metaprogramming-ruby.pdf">.pdf</a>, 22MB)</h3>
Man kan inte bli annat än imponerad av <a href="http://twitter.com/niclasnilsson">Niclas Nilsson</a> när han så “vårdslöst” tvingar Ruby att bete sig som han vill.

Han berättade om hur man med lite fantasi kan bygga ett internt DSL utan att för den skull ha tillgång till Rubys <a href="http://en.wikipedia.org/wiki/Abstract_syntax_tree">AST</a>.

Han visade även sin gem <a href="http://github.com/niclasnilsson/properties">properties</a>.
<h2 id="middag_p_soho">Middag på SoHo</h2>
Lördagskvällen spenderade jag med att diskutera <a href="http://hackerspaces.org/">hackerspaces</a>, användning av <a href="http://rad.rubyforge.org/">Ruby</a> för utveckling mot <a href="http://www.arduino.cc/">Arduino</a>, mikrobryggerier i USA och mycket annat.
<h2 id="sndag">Söndag</h2>
<h3 id="from_artist_to_programmer">From artist to programmer</h3>
Dagens första föreläsning stod <a href="http://twitter.com/keavy">Keavy McMinn</a> för, och hon pratade om likheter (och skillnader) mellan konstnärskap och programmering.
<blockquote>
<p style="text-align: left;">“Just make”</p>
</blockquote>
<h4 id="ngra_av_hennes_punkter">Några av hennes punkter</h4>
<ul>
	<li>Var öppen för förändringar</li>
	<li>Det går att bygga något utan initial finansiering</li>
	<li>Vi utvecklas genom reflektion</li>
</ul>
<h3 id="the_mongodb_effect">The MongoDB Effect</h3>
Jag hade gärna sett att <a href="http://twitter.com/modetojoy">Durran Jordan</a> och <a href="http://twitter.com/leshill">Les Hill</a> hade fokuserat lite mer på <a href="http://mongoid.org/">Mongoid</a> än vad de gjorde. Vi vet redan att <a href="http://www.mongodb.org/">MongoDB</a> är häftigt.

Enligt Durran borde man ALLTID använda MongoDB.
<h4 id="mongoid">Mongoid</h4>
<ul>
	<li>Rails 2 och Rails 3</li>
	<li>Atomiska operationer</li>
	<li>Stora dataset</li>
	<li>Grymt kriterie API</li>
	<li>Scopes som tar block</li>
	<li>Master/Slave</li>
</ul>
<h3 id="solid_ruby">SOLID Ruby</h3>
Jag hade verkligen sett fram emot <a href="http://twitter.com/jimweirich">Jim Weirich</a> föreläsning om <a href="http://en.wikipedia.org/wiki/Solid_%28object-oriented_design%29">SOLID</a> och jag blev inte besviken.
<h4 id="ngra_av_hans_punkter">Några av hans punkter</h4>
<ul>
	<li>Fördela ansvaret</li>
	<li>Monkey patchning i bibliotek är dåligt (Arv framför öppna klasser)</li>
	<li>Protokoll är viktiga</li>
</ul>
<h3 id="artificial_stupidity_adding_smarts_to_yer_kode_with_a_little_machine_learning">Artificial stupidity, adding smarts to yer kode with a little machine learning</h3>
Konferensens tyngsta föreläsning (med råge) stod <a href="http://twitter.com/daksis">Randall Thomas</a> från <a href="http://www.engineyard.com/">Engine Yard</a> för.

<img class="alignnone size-full wp-image-730" title="The future is about information, not data" src="https://athega.se/system/uploads/2010/05/the_future_is_about_information.jpg" alt="" width="750" height="376" />

Ämnet var datautvinning genom att använda statistikspråket <a href="http://www.r-project.org/">R</a> och <a href="http://rubyforge.org/projects/rsruby/">RSRuby</a>. Den enligt mig intressantaste delen av föreläsningen bestod i användningen av en <a href="http://en.wikipedia.org/wiki/Support_vector_machine">support vector machine</a> (KSVM i R) för att gruppera data och sedan använda detta för rekomendationer.

Böcker: Super Crunchers, Introductory Statistics with R
<h3 id="software_for_the_human_animal">Software for the Human Animal</h3>
<a href="http://twitter.com/hcatlin">Hampton Catlin</a> pratade om skillnaderna mellan manlig och kvinnlig design. Att vi inte är mycket mer än djur och att Internet är den nya vildmarken.

Han hävdade att vi människor generellt sett är självorganiserande och framförallt trevliga. Vi borde alltså sluta motverka på de fåtal användare som förstör och istället uppmuntra och belöna de användare som uppför sig.

Det finns inga dumma användare, bara dåliga gränssnitt som gör dem dumma.
