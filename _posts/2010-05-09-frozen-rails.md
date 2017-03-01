---
title: "Frozen Rails"
date: 2010-05-09
last_updated_by: peter
---
I fredags gick konferensen <a href="http://frozenrails.eu">Frozen Rails</a> av stapeln i Helsingfors och Athega var självklart representerade.
<h2><a href="http://www.slideshare.net/err/inside-github">Rails at GitHub</a> (Chris Wanstrath, <a href="http://twitter.com/defunkt">@defunkt</a>)</h2>
Konferensen inleddes av <a href="http://chriswanstrath.com/">Chris Wanstrath</a> som gick igenom hur Ruby on Rails används på <a href="http://github.com/">GitHub</a>. Vi fick även reda på hur de använder Git (<a href="http://github.com/mojombo/grit">grit</a>, smoke, chimney) och hur de hanterar meddelandeköer (<a href="http://github.com/defunkt/resque">resque</a>).

Några av projekten som nämndes:
<ul>
	<li><a href="http://github.com/github/albino/">albino</a> för syntax highlighting genom (front för <a href="http://pygments.org/docs/cmdline/">pygmentize</a>)</li>
	<li><a href="http://faker.rubyforge.org/">faker</a> för att generera påhittad data: namn, adresser, telefonnummer</li>
	<li>Rack HTTP servern <a href="http://unicorn.bogomips.org/">Unicorn</a></li>
</ul>
<h2>The Plataforma Way (José Valim, <a href="http://twitter.com/josevalim">@josevalim</a>)</h2>
Dagens andra föreläsning hölls av <a href="http://twitter.com/josevalim">José Valim</a> från Plataforma tecnologia. José pratade om autentiseringslösningen <a href="http://blog.plataformatec.com.br/tag/devise/">Devise</a> (bygger på <a href="http://wiki.github.com/hassox/warden/">Warden</a>), domänspråket simple_form (inspirerat av <a href="http://github.com/justinfrench/formtastic">Formtastic</a>) samt <a href="http://github.com/plataformatec/responders">Responders</a> vilket är en utbyggnad av respond_with i Rails 3. Lite rörig föreläsning men med många intressanta projekt, kommer speciellt hålla koll på Devise.
<div>
<h2><a href="http://www.slideshare.net/mdirolf/mongodb-at-frozenrails">An Introduction to MongoDB</a> (Mike Dirolf, <a href="http://twitter.com/mdirolf">@mdirolf</a>)</h2>
</div>
Jag har sedan jag bloggade om MongoDB <a href="http://athega.se/2009/07/06/mongodb/">första gången</a> varit intresserad av projektet och nu fick vi verkligen en bra genomgång av <a href="http://www.10gen.com/">10gen</a>’s Michael Dirolf.

Översikt av MongoDB:
<ul>
	<li>Atomiska operationer per dokument <em>(:$push)</em></li>
	<li>Dynamiska frågor</li>
	<li>Hög prestanda (10% långsammare än <a href="http://memcached.org/">memcached</a>, snabbare än <a href="http://couchdb.apache.org/">CouchDB</a>)</li>
	<li>Master/Slave failover</li>
	<li>Auto-sharding <em>(snart)</em></li>
	<li>Servern har en <a href="http://www.mongodb.org/display/DOCS/Server-side+Code+Execution#Server-sideCodeExecution-Storingfunctionsserverside">JavaScript parser</a></li>
</ul>
<h2>Mobile Web Apps with Rails 3 (Yehuda Katz, <a href="http://twitter.com/wycats">@wycats</a>)</h2>
<img class="alignnone size-full wp-image-661" title="Yehuda Katz på Frozen Rails" src="https://athega.se/system/uploads/2010/05/Screen-shot-2010-05-09-at-23.34.43-.png" alt="Yehuda Katz på Frozen Rails" width="750" height="493" />

Även om jag sett föreläsningen tidigare (Efter <a href="http://phillyemergingtech.com/">Philly ETE, Emerging Technologies for the Enterprise</a>) så var det bra att få se den live så att säga.

Några av punkterna som <a href="http://yehudakatz.com/">Yehuda</a> berörde:
<ul>
	<li>HTML 5 LocalStorage (samt Offline API)</li>
	<li>Föredra gammal data</li>
	<li>HTML == static asset</li>
	<li>Betrakta webbläsaren som en API-klient</li>
	<li>“Sip, don’t gulp”</li>
</ul>
Projekt:
<ul>
	<li><a href="http://github.com/wycats/rack-offline">Rack::Offline</a></li>
	<li><a href="http://github.com/wycats/jquery-offline">jQuery Offline</a></li>
	<li><a href="http://github.com/jquery/jquery-tmpl">jQuery tmpl</a></li>
	<li><a href="http://github.com/janl/mustache.js">Mustache.js</a></li>
</ul>
<h2>Cucumbered (Joseph Wilk, <a href="http://twitter.com/josephwilk">@josephwilk</a>)</h2>
<p style="text-align: right;">
<img class="size-full" title="Frozen Rails Cucumbered" src="https://athega.se/system/uploads/2010/05/frozen_rails_cucumbered.jpg" alt="Frozen Rails Cucumbered" width="750" height="258" /><br />
<small>(Foto: <a href="http://twitter.com/chrisco">Chris Comella</a>)</small>
</p>
Den bästa föreläsningen på hela konferensen stod <a href="http://blog.josephwilk.net/">Joseph Wilk</a> för, ämnet var <a href="http://cukes.info/">Cucumber</a> och mer specifikt hur man ser till att testerna går så fort som möjligt. (Cucumber 0.7 är för övrigt så galet snabb att det inte ens är roligt nu när de bytt från <a href="http://treetop.rubyforge.org/">TreeTop</a> till <a href="http://www.complang.org/ragel/">Ragel</a>)

Några av Josephs punkter:
<ul>
	<li>Cukover vs. Autotest</li>
	<li><a href="http://github.com/mynyml/harmony">Harmony</a> (Frontar Trace/SpiderMonkey i Ruby)</li>
	<li>cucumber --format</li>
</ul>
<h2><a href="http://www.slideshare.net/jweiss/couchdb-on-rails-frozenrails-2010">CouchDB on Rails</a> (Jonathan Weiss, <a href="http://twitter.com/jweiss">@jweiss</a>)</h2>
Jonathan hade ett digert uppdrag framför sig då konferensdeltagarna direkt jämförde allt med hur det fungerar i MongoDB. Tyvärr var exemplen lite för enkla och visade inte riktigt på styrkan i CouchDB, snarare att det är “svårare” att ställa enkla frågor än med SQL då man måste implementera map/reduce i JavaScript själv. (Vilket är en <strong>BRA</strong> grej när man gör lite mer avancerade saker)

Några av punkterna:
<ul>
	<li>“Built for the web”</li>
	<li>Skalar bra</li>
	<li>Inga konstigheter: HTTP, JavaScript, JSON</li>
	<li>Revisioner (id + rev)</li>
	<li>Inga collections (på gott och ont)</li>
	<li>“JavaScript, easier than SQL”</li>
	<li>Värdet kan vara komplex JSON</li>
	<li>Nycklarna kan vara arrayer</li>
	<li>Statiska frågor (map/reduce)</li>
	<li>Compaction of B-tree via HTTP request (tänker inte ens försöka översätta :)</li>
	<li>HTTP cache (<a href="http://varnish-cache.org/">Varnish</a>) och lastbalansering (<a href="http://haproxy.1wt.eu/">HAProxy</a>, <a href="http://nginx.org/">nginx</a>)</li>
	<li>Inbäddad <a href="http://lucene.apache.org">Lucene</a> (<strong>Killer feature?</strong>)</li>
</ul>
<h2><a href="http://www.slideshare.net/carllerche/frozen-rails-slides">Rails 3: Tasty Burgers</a> (Carl Lerche, <a href="http://twitter.com/carllerche">@carllerche</a>)</h2>
<ul>
	<li><a href="http://gembundler.com/">Bundler</a> (Isolation av gems)</li>
	<li>Möjligt att använda <a href="http://jquery.com">jQuery</a> i Rails!</li>
	<li>Routern kan nu ha valfria segment, scopes och HTTP verb</li>
	<li>Rack överallt!</li>
	<li><a href="http://github.com/rails/rails_upgrade">rails_upgrade</a></li>
</ul>
<h2>Perfectionism (Jarkko Laine, <a href="http://twitter.com/jarkko">@jarkko</a>)</h2>
Priset för den nervösaste killen på hela konferensen måste ha gått till Jarkko. Förutom detta var det en grym sista föreläsning om hur vi perfektionister ofta har problem med att skeppa något innan det är helt <strong>perfekt</strong>. (vilket det kanske aldrig blir) Han rekomenderade även boken <a href="http://www.cluetrain.com/book/index.html">The Cluetrain Manifesto</a> (hela bokens text)

<a href="https://athega.se/system/uploads/2010/05/perfection.png"><img class="alignnone size-full wp-image-656" title="SHIP!" src="https://athega.se/system/uploads/2010/05/perfection.png" alt="Perfection, Minimally Viable Product, Markets are conversations, Ship!" width="750" height="690" /></a>
