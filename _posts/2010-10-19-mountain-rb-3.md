---
title: "Mountain.rb - Dag 3"
date: 2010-10-19
last_updated_by: peter
---
<h2>Keynote: Aaron Patterson (<a href="http://twitter.com/tenderlove"><span style="color: #000000;"><span style="color: #888888;">@tenderlove</span></span></a>) - "Fear Driven Development".</h2>
<img class="alignright size-medium wp-image-898" title="mountain-rb-buddy-system" src="/wp-content/uploads/2010/10/mountain-rb-buddy-system-300x162.png" alt="" width="300" height="162" />Aaron öppnade med en kort presentation om hans professionella liv som utvecklare där han började med Perl 1999 och blev mer eller mindre tvingad att byta till Java 2002 som fortsatte till 2007 då han började använda Ruby.

I och med att Aarons kunskaper kring Ruby ökade, ökade även hans rädsla för att han inte kunde tillräckligt mycket – kanske något många kan relatera till? Detta var i alla fall ämnet för hans tal.

Hans tips för att motverka den känslan är att <em>"Läsa, Läsa, Läsa"</em> – varje dag, samt vad han gärna kallar <em>"The Buddy System"</em> eller i en något mer <img class="size-medium wp-image-899 alignright" title="mountain-rb-fear-exp" src="/wp-content/uploads/2010/10/mountain-rb-fear-exp-300x118.png" alt="" width="270" height="106" />bekant term Pair Programming. I Aarons fall fortsatte han lite längre och gick med i e-post listor för ruby-talk och ruby-core, började gå på massor av konferenser och även undervisa på ett lokalt universitet i Seattle.

En fras som är viktig i Aarons vardag är <em>"I don't know",</em> om man inte förstår något hjälper oftast personen du pratar med att lära dig och hjälpa dig förstå.
<h2 style="display: block; clear: both; margin-top: 2em;">Jonathan Dahl (<a href="http://twitter.com/jondahl"><span style="color: #000000;"><span style="color: #888888;">@jondahl</span></span></a>) - "Programming and minimalism: lessons from Orwell and the Clash".</h2>
Jons presentation började med liknelser mellan programmerare och andra professioner. Bland annat:
<ul>
	<li>Ingenjörer: <em>"Not about building things – about building processes"</em> och <em>"Designing solutions to direct problems"</em></li>
	<li>Hantverkare: Att ha rätt verktyg, kunskaper, jobbar i små team och att ha rätt vanor och rutiner.</li>
	<li>Författare: Skriv, skriv, refaktorera</li>
</ul>
Presentationen fortsatte med att antal musikdemonstrationer genom tiderna med exempel som Bach, Mozart, Mahler till lite mer nutida pop musik med Beatles och även punk musik. Han ville med dessa exempel demonstrera hur

Hans tips för att bli en bättre programmare är:
<ul>
	<li>Konsumera: Läs mycket och inte bara om det du gör</li>
	<li>Studera - hur skriver andra?</li>
	<li>Producera - ju mer du skriver desto bättre blir du</li>
</ul>
<blockquote><em>Not only is bad writing impossible to understand, it is buggy.</em></blockquote>
<h2>Tech Block #2</h2>
Ett Tech Block består av tre kortare presentationer.
<h3>Jim Remsick (<a href="http://twitter.com/jremsikjr"><span style="color: #888888;">@jremsikjr</span></a>) - "Functionally Equivalent"</h3>
<img class="alignright size-thumbnail wp-image-804" title="mountain-rb-bugs" src="http://blogg.athega.se/wp-content/uploads/2010/10/mountain-rb-bugs-150x150.png" alt="" width="150" height="150" />Jims tal var något kortare men med ett direkt budskap att förklara fördelarna med funktionell programmering som letade sig ner till dessa tre punkter:
<ul>
	<li>Kortfattat (mer koncist)</li>
	<li>Trådbarhet (<em>Concurrency</em>)</li>
	<li>Inga buggar<span style="color: #ff0000;">*</span> - Går att bevisa matematiskt</li>
</ul>
Ruby är ett objektorienterat språk men det är inte helt ovanligt att skriva det i funktionell stil. Jim avslutade med en uppmaning
<blockquote><em>Gå ut och prova något du inte är bekväm med.</em></blockquote>
<h3>CJ Kihlbom (<a href="http://twitter.com/cjkihlbom"><span style="color: #888888;">@cjkihlbom</span></a>) - "Frontend Testing Frontier"</h3>
Det var extra kul att höra CJ tala då han kommer från Göteborg och driver firman Elabs. CJ/Elabs var också initiativtagarna till konferensen Nordic Ruby som Athega sponsrade och vi har bloggat om tidigare.

Elabs har länge lagt ett stort fokus på frontend testning där Elabs, Jonas Nicklas (<a href="http://twitter.com/jncoward"><span style="color: #888888;">@jncoward</span></a>) bland annat har gjort ett par stora bidrag till Ruby commityn via <a href="http://github.com/jnicklas/capybara">Capybara</a> och <a href="http://github.com/jnicklas/evergreen">Evergreen</a>. Detta var fokus för CJs tal.

CJ pratade om verktyg för integrationstestning:
<ul>
	<li><a href="http://cukes.info/">cucumber</a></li>
	<li><a href="http://github.com/cavalle/steak">steak</a></li>
	<li><a href="http://github.com/jnicklas/capybara">capybara</a></li>
</ul>
Capybara är "driver agnostic" vilket innebär att man kan köra Capybara med hjälp av annan mjukvara som:
<ul>
	<li><a href="http://github.com/brynary/rack-test">rack-test</a></li>
	<li><a href="http://selenium.rubyforge.org/">selenium</a></li>
	<li><a href="http://htmlunit.sourceforge.net/">HTMLUnit</a> via <a href="http://celerity.rubyforge.org/">celerity</a>/<a href="http://github.com/langalex/culerity/">culerity</a>/<a href="http://github.com/bernerdschaefer/akephalos">akephalos</a></li>
	<li><a href="http://www.envjs.com/">envjs</a> via <a href="http://github.com/smparkes/capybara-envjs">capybara-envjs</a></li>
</ul>
JavaScript unit testing är inte så vanligt så CJ tog tillfället att berätta om ett bra alternativ nämligen <a href="http://github.com/pivotal/jasmine-gem">Jasmine</a> av Pivotal Labs, tillsammans med <a href="http://github.com/jnicklas/evergreen">Evergreen</a> av Jonas Nicklas. En riktigt bra feature med Evergreen är att man kan skriva sina JavaScript tester i <a href="http://jashkenas.github.com/coffee-script/">CoffeeScript</a>. CoffeeScript är för JavaScript vad HAML/SASS är för HTML/CSS.
<blockquote><em>Front end testing is NOT hard</em></blockquote>
<h3>Paul Sadauskas (<a href="http://twitter.com/theamazingrando"><span style="color: #888888;">@theamazingrando</span></a>) - Forms Don't Have to be this Complicated</h3>
<blockquote><em>Forms Suck</em></blockquote>
Paul pratade om hur krångliga fomulär kan vara i Rails, framförallt om man har <abbr title="has and belongs to many">HABTM</abbr> relationer mellan sina modeller. Eller ännu värre, nästlade formulär.

<img class="alignright size-medium wp-image-809" title="mountain-rb-nested-forms-are-bad" src="http://blogg.athega.se/wp-content/uploads/2010/10/mountain-rb-nested-forms-are-bad-300x149.png" alt="" width="300" height="149" />

Paul visade exempel på krångliga formulär och olika lösningar, de inkluderade bland annat att ladda om hela sidan, olika sidor för olika formulärdelar eller att generera direkt från JavaScript.

Paul's förslag till slut var att använda progressiv förbättring som laddar om sidan om man inte har JavaScript aktiverat men endast hämtar en partial via AJAX om man har JS aktiverat. Denna metod blir dessutom ganska enkel att testa.
<h2>Blake Mizerany (<a href="http://twitter.com/bmizerany"><span style="color: #888888;"><span style="color: #000000;"><span style="color: #888888;">@bmizerany</span></span></span></a>) - 1000 ways to kill a Buffalo</h2>
<img class="alignright size-medium wp-image-911" title="Killing Buffalo" src="http://blogg.athega.se/wp-content/uploads/2010/10/killing_buffalo-300x210.jpg" alt="Killing Buffalo" width="300" height="210" />

Blake är uppfinnaren av <a href="http://sinatrarb.com">Sinatra</a> och jobbar till vardags på <a href="http://heroku.com/">Heroku</a> som har en intressant och mycket flexibel Rails

hosting med enkel Add-on arkitektur.

Blakes presentation tillhörde definitivt en av de mer humoristiska. I princip hela presentationen bestod av en serie tecknade figurer ("Ugh" grottmannen, hans familj och en buffel) ritade på en iPad i en rad olika situationer.

Presentationen (som kunde vart en säljpitch för Heroku) ville få oss att fokusera på problem istället för idéer, hur problem i vår vardag driver innovation och utveckling. För att knyta ihop med titeln var Blakes exempel på hur Ugh försökte jaga buffel på stenåldern.

Han pratade om hur man som Ruby on Rails utvecklare kan skriva små problemlösande add-ons till Heroku som andra utvecklare kan dra nytta av (och på så vis tjäna pengar).

<img class="alignright size-medium wp-image-815" title="mountain-rb-thousands-of-developers" src="http://blogg.athega.se/wp-content/uploads/2010/10/mountain-rb-thousands-of-developers-300x141.png" alt="" width="240" height="113" />Heroku add-ons är små självständiga tjänster som man laddar upp i Heroku som i läggs på en Amazon EC2 instans. EC2 arkitekturen var ett starkt argument eftersom alla Heroku appar ligger i EC2 så är det extremt låg latens mellan instanserna (add-ons/appar), även internationellt och mellan kontinenter.
<h2>Lightning talks</h2>
Lightning talks är snabba presentationer, man har 5-7 minuter att lära ut något. Det var många snabbpresentationer men en som jag tycker var värd att nämna.
<h3>Neal Enssle (<a href="http://twitter.com/nealenssle"><span style="color: #888888;">@nealenssle</span></a>) - How to be a better developer in 90 days</h3>
Denna presentation var tre bok rekommendationer för alla som vill bli bättre utvecklare (inte bara Ruby/Rails). Tanken är att man ska läsa en bok per månad.

<strong><a href="http://amzn.com/1934356344">The Passionate Programmer</a></strong><strong> - Chad Fowler</strong>
<ul>
	<li>Om du inte bryr dig kommer det att märkas.</li>
	<li>Var en generalist.</li>
	<li>Gör det du kan - klaga inte, lös problem.</li>
	<li>Kom ihåg vem du arbetar för - hur mycket värde tillför du?</li>
	<li>Daglig framgång - vad åstadkom du idag?</li>
	<li>Är du bättre idag än igår? (n + 1)</li>
</ul>
<strong><a href="http://amzn.com/0132350882">Clean Code</a> - Robert C. Martin</strong>
<ul>
	<li>Semi-objektiv och praktisk.</li>
	<li>Storleken spelar roll.</li>
	<li>Gör en sak, på ett enda ställe.</li>
	<li>Scout-regeln, lämna koden bättre än du hittade den.</li>
</ul>
<strong><a href="http://amzn.com/0321603508">Refactoring: Ruby edition</a> - Martin Fowler (m.fl.)</strong>
<ul>
	<li>Koda för att öka förtroende för gammal kod</li>
	<li><em>"Smells in code" </em>- motverka dålig kod, duplicering, långa funktioner m.m.</li>
	<li>Självförklarande variabelnamn</li>
	<li>60 refaktoreringsmönster</li>
</ul>
