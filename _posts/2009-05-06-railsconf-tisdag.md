---
title: "RailsConf: Tisdag"
date: 2009-05-06
last_updated_by: peter
---
<h2 id="keynote_rails_3_and_the_real_secret_to_high_productivity">Keynote: Rails 3 ..and the real secret to high productivity</h2>

<p><a href="http://assets.en.oreilly.com/1/event/24/Rails%203%20and%20the%20Real%20Secret%20to%20High%20Productivity%20Presentation.pdf">Presentationen</a> (PDF)</p>

<p>David började med en tillbakablick på de 5 år som gått och vad som sagts om ramverket och hur det kom sig att det skapades så många kloner. Han fortsatte med att berätta om några förändringar i Rails 3.0</p>

<ul>
<li>Ny router</li>
<li>Snabbare och bättre Rack-stöd</li>
<li>XSS skyddet uppdateras</li>
<li>JavaScript blir unobtrusive och ramverksagnostiskt</li>
<li>Mer agnostisism; Action ORM, Generatorer</li>
<li>Refakturering; Abstract Controllers, ActiveRecord, Callbacks</li>
</ul>

<p>En välkommen förändring är att output i vyerna kommer att bli escape:ad per default. För att skriva ut råformatet använder man metoden <strong>raw</strong>.</p>

<p>Unobtrusive JavaScript kommer att implementeras genom att använda HTML 5 attribut:</p>

    ## Rails 2.x
    <%= link_to_remote "Delete", :url => @comment, :method => :delete %>
    <a href="#" onclick="new Ajax.Request('/comments/1', {asynchronous:true,
    evalScripts:true, method:'delete'}); return false;">Destroy</a>

    ## Rails 3.x
    <%= link_to "Delete", @comment, :remote => true, :method = :delete %>
    <a href="/comments/1" data-remote="true" data-method="delete">Destroy</a>

<p>Och sen appliceras metoderna med JavaScript:</p>

    $(document.body).observe("click", function(event) {
      var element = event.findElement("a['data-remote']");
      if (element) {
        var method = element.readAttribute("data-method") || "get";
        new Ajax.Request(element.readAttribute("href"), { method: method });
        event.stop();
      }
    });

<p>Han visade på hur viktigt hög produktivitet faktiskt är, hur motivation snabbt minskar vid svåra problem.</p>

<h3 id="relaterade_bloggposter">Relaterade bloggposter</h3>

<ul>
<li><a href="http://blogs.sun.com/arungupta/entry/rails_conf_2009_day_2">Rails Conf 2009 Day 2 - DHH Keynote</a></li>
</ul>

<h2 id="the_gilt_effect_handling_1000_shopping_cart_updates_per_second_in_rails">The Gilt Effect: Handling 1000 Shopping Cart Updates per second in Rails</h2>

<p>Anställda på <a href="http://www.gilt.com/">Gilt Groupe</a> berättade om hur deras serverarkitektur ser ut, de använder <a href="http://www.postgresql.org/">PostgreSQL</a>, 400+ Thin servrar, 2 <a href="http://www.zeus.com/products/zxtm/">ZXTM</a>&#8217;s  (Zeus Extensible Traffic Manager)</p>

<p>Applikationen är skriven i Ruby on Rails.</p>

<p>De måste jobba med sharding för att klara av den höga lasten.</p>

<p>De använder ett internt CMS skrivet i Rails och har två &#8220;CDN&#8221;-servrar framför som serverar förgenererade sidor. (En server på östkusten och en på västkusten)</p>

<h3 id="stort_antal_transaktioner">Stort antal transaktioner</h3>

<p>Dedikerade tjänster för varje transaktion - JRuby + EC2 + SQL + Rails</p>

<p>EC2 (lastbalanserad genom Zeus), expanderbar kapacitet, tid/behovsbaserad ökning av tillgänglig kapacitet.</p>

<p>De arbetar tillsammans med Joyent för hosting.</p>

<h3 id="hg_volym_delat_tillstnd">Hög volym / Delat tillstånd</h3>

<p>Unik ehandelsmodell, &#8220;flash sale&#8221; där alla produkter tar slut på en dag.</p>

<h3 id="inventariemodellen">Inventariemodellen</h3>

<p>Gilt hanterar varje fysiskt objekt individuellt</p>

<ul>
<li>Begränsat antal</li>
<li>Går inte att få tag i fler</li>
</ul>

<h3 id="varukorgsmodellen">Varukorgsmodellen</h3>

<h4 id="shoppingfasen">Shoppingfasen:</h4>

<ul>
<li>Att lägga till en produkt skapar en <em>reservation</em></li>
<li>Om produkten är tillgänglig får man en 10-minuters reservation
<ul>
<li>Man måste betala in</li>
</ul></li>
</ul>

<h4 id="betalningsfasen">Betalningsfasen</h4>

<ul>
<li>Förfråga om att förlänga reservationen</li>
<li>Om reservationen är <valid>, förlängs den med 10 minuter
<ul>
<li>Man kan får en prioriterad uppgradering</li>
</ul></li>
<li>Om reservationen inte är valid och det inte finns några lediga produkter
<ul>
<li>Meddelande till kunden att produkten är slut och att man kan skriva upp sig på en väntelista.</li>
</ul></li>
</ul>

<h4 id="betalning_genomfrd">Betalning genomförd</h4>

<p>Respektive produkt markeras som såld i databasen</p>

<h3 id="gilts_framtidsstrategi">Gilts framtidsstrategi</h3>

<ul>
<li>Kärntjänsterna är vy-lösa (MC)</li>
<li>Enda gränssnittet är JSON/HTTP</li>
<li>Externa tjänster skrivna i Ruby, Java för kritiska operationer internt</li>
<li>Internt ramverk kallat Blackbird under utveckling, det hanterar skalbar deployment av tjänter i Ruby.</li>
</ul>

<h2 id="pwn_your_infrastructure_behind_call_of_duty_world_at_war">PWN Your Infrastructure: Behind Call of Duty: World at War</h2>

<p>Tyvärr fick jag inte plats inne på föreläsningen <a href="http://en.oreilly.com/rails2009/public/schedule/detail/7073">UI Fundamentals for Programmers</a> med Ryan Singer från <a href="http://37signals.com/">37Signals</a> så det fick bli mitt andrahandsval om hur Agora Games skalar sin serverarkitektur.</p>

<p>Jason LaPorte (<a href="http://www.agoragames.com/">Agora Games</a>) talar om vad de tycker är fel med deployment av Rails. Ett av de största problemen är skalbarhet (Av administratörens tid) och i hans värld översätts detta i hur mycket den dagliga arbetsbördan ökar när antalet servrar ökar.</p>

<p>För att hantera fel jobbar de med virtualisering med hjälp av <a href="http://terremark.com">Terremark</a> och replikation för mjukvaruproblem.</p>

<p>De propagerar /usr/local till alla servrar med NFS, vilket gör att uppdateringar sker hyffsat smärtfritt.</p>

<p>De har ett internt system de kallar Overlord skrivet i Rails, det sköter hantering av konfigurationsfiler som sedan laddas ner av respektive server.</p>

<p><a href="http://mmonit.com/monit/">Monit</a> ser till att de konfigurerade tjänsterna startas samt startar om tjänster som gått ner.</p>

<p><a href="http://oss.oetiker.ch/rrdtool/">RRDTool</a> visualiserar hur de olika tjänsterna mår genom att använda Monits xml-format. (http://server/_status?format=xml)</p>

<p>Centraliserad deployment med ett enkelt shellscript som:</p>

<ul>
<li>Updaterar koden</li>
<li>Uppdaterar miljön</li>
<li>Startar om servrarna</li>
</ul>

<h2 id="javascript_testing_in_rails_fast_headless_in_browser_pick_any_three">JavaScript Testing in Rails: Fast, Headless, In-Browser. Pick Any Three.</h2>

<p>Larry Karnowski och Jason Rudolph (<a href="http://thinkrelevance.com/">Relevance, Inc.</a>) visar <a href="http://github.com/relevance/blue-ridge/tree/master">Blue Ridge</a>, ett ramverk för testdriven utveckling med JavaScript. </p>

<h3 id="delarna_i_blue_ridge">Delarna i Blue Ridge</h3>

<ul>
<li>Rhino - en Java-baserad JavaScript interpreter</li>
<li>Screw.Unit - en BDD syntax för JavaScript, liknar RSpec</li>
<li>Smoke - ett JavaScript mocking &amp; stubbing bibliotek, liknar Mocha</li>
<li>env.js - en DOM implementation skriven helt i JavaScript</li>
</ul>

<p>Det verkar grymt användbart att kunna köra tester av alla JavaScript från kommandoraden eller en CI-server. Tyvärr verkar det inte som om env.js fungerar tillsammans med jQuery 1.3.x så de kör med jQuery 1.2.6. De jobbar dock på att lösa problemet.</p>

<h3 id="relaterade_lnkar">Relaterade länkar</h3>

<ul>
<li><a href="http://github.com/relevance/blue-ridge-sample-app/tree/master">blue-ridge-sample-app</a></li>
<li><a href="http://pastie.org/469178">http://pastie.org/469178</a></li>
</ul>

<h2 id="smacking_git_around_advanced_git_tricks">Smacking Git Around - Advanced Git Tricks</h2>

<p><a href="http://tinyurl.com/gitrailsconf09">Presentationen</a> (PDF) |
<a href="http://tinyurl.com/gitrailsconf09-cheat">Cheat-sheet</a> (PDF)</p>

<p>Scott Chacon (<a href="http://github.com">GitHub</a>) började med &#8220;Git in 60 seconds&#8221; och gick vidare med att gå igenom mer avancerade funktioner i Git.</p>

<ul>
<li>Med filter branches kan man ta bort en fil från alla commits.</li>
<li>Subtree merging är ett alternativ till Submodules.</li>
<li>Git Bisect är användbart för att hitta vilken commit som orsakade problem</li>
<li>Man kan diffa binära filer genom att använda .gitattributes</li>
</ul>

<h2 id="quality_code_with_cucumber">Quality Code with Cucumber</h2>

<p>Aslak Hellesøy (<a href="http://www.bekk.no/">Bekk Consulting AS</a>) berättar om BDD med hjälp av <a href="http://cukes.info/">Cucumber</a>.</p>

<ul>
<li>Step - Method invocation</li>
<li>Step definition - Method definition</li>
</ul>

<p>Jag är inte helt övertygad om att det är en bra idé att kunna definiera dataset i sina steps, men för övrigt verkar det riktigt användbart.</p>

<p>Tags är en riktigt trevlig liten feature.</p>

/ [Peter](/peter)
