---
title: "Rocky Mountain Ruby 2011"
date: 2011-09-12
last_updated_by: peter
---
![Boulder Theatre](/images/blogg/rocky-mountain-ruby-2011/boulder_theatre.jpg)

För lite mer än en vecka sedan kom jag hem från Colorado och konferensen
[Rocky Mountain Ruby](http://rockymtnruby.com/), förra året hette den 
[Mountain.rb](http://mountainrb.com/) men det var tydligen många som misstog den för [MountainWest
RubyConf](http://mtnwestrubyconf.org/) så arrangörerna valde helt sonika att byta
namn på konferensen. Precis som förra året hölls den på [Boulder Theater](http://www.bouldertheater.com/).

## Charity Workshops (31/8)

Dagen innan konferensen började arrangerades det ett antal halvdagslånga
välgörenhets-workshops.

### Vital Testing

På förmiddagen valde jag att medverka i
[Vital Testing](http://rockymtnruby.com/charity_workshop#vital)
med [Jim Weirich](http://onestepback.org/).

Jim inledde med att ge tips på **vad** snarare än **hur** man borde testa.
Efter det fortsatte vi med att jobba på några enkla
[problem/katas](http://onestepback.org/vital_testing/). Vi fick välja en partner att parprogrammera med, jobba ett litet tag för
att sedan kasta koden, byta partner och upprepa övningen.

> `if` is only a loop run once.

### TDD Javascript and Rails 3.1

Efter lunch anslöt jag och några nyfunna vänner till
[TDD Javascript and Rails 3.1](http://rockymtnruby.com/charity_workshop#tddjs)
på [Trada Codespace](http://www.trada.com/codespace/). Vi fick lära oss mer om hur
[Asset Pipeline](http://guides.rubyonrails.org/asset_pipeline.html) i Ruby on Rails 3.1 fungerar och hur man testar sin JavaScript-kod med [QUnit](http://docs.jquery.com/Qunit) och [Jasmine](http://pivotal.github.com/jasmine/).

Jag gillade hur de hade förberett två git-repos med kod där vi fick översätta tester från ett testramverk till det andra, samt välja mellan [CoffeeScript](http://coffeescript.com/) och JavaScript.

## Torsdag (1/9)

### Focus? Why Do I Need More Stinkin' Focus?

[Mike Gehard](https://twitter.com/mikegehard) inledde konferensen med
att [övertyga oss](http://www.slideshare.net/msgehard/focus-and-meditation) om att fokus är något man måste öva på. En metod för detta är att meditera, självklart hade han en hashtag för detta: [#devmed](http://www.hashtag.info/tag/devmed)

### Keynote

[Michael Feathers](http://michaelfeathers.typepad.com/) pratade om hur
man tar reda på vilken kod som behöver bytas ut, hur man planerar för
ersättningen, osv. Han nämnde även [Conway’s law](http://en.wikipedia.org/wiki/Conway's_Law).

### API Design Matters

[Anthony Eden](http://www.anthonyeden.com/), lika välklädd som vanligt,
höll en mycket bra föreläsning om API-design. Även fast jag såg en tidigare
version av föreläsningen på [Nordic Ruby](http://nordicruby.org/) så var
det informativt.

Han nämnde även att man ska fokusera på klienten först, sen kan man
börja tänka på implementationen. Lästips:
[Little manual of API design](http://chaos.troll.no/~shausman/api-design/api-design.pdf) (**PDF**).


#### Enligt Anthony ska ett API vara:

 1. Lätt att bygga vidare på
 2. Svårt att missbruka
 3. Tillräckligt kraftfullt

### CRUD Is Not REST - Hypermedia For Y'All!

[Nick Sutterer](http://nicksda.apotomo.de/) pratade om
[HATEOAS](http://en.wikipedia.org/wiki/HATEOAS) eller
*Hypermedia as the Engine of Application State* och varför CRUD inte är
REST! Till skillnad från föreläsningen om HATEOAS på
[Øredev 2010](http://oredev.org/2010) (där man använde XHTML)
så kombinerade Nick representationen av datat och länkarna i JSON.

Självklart hade han skrivit ett bibliotek för att göra detta på ett
smidigt sätt. [Roar!](http://rubygems.org/gems/roar) eller
RESTful, resource-oriented architectures in Ruby. Han rekomenderade även böckerna
[REST in Practice](http://restinpractice.com/) och 
[RESTful Web Services
Cookbook](http://www.restful-webservices-cookbook.org/).

### If You See the Mountain Lion, It's Too Late

[Grant Blakeman](http://grantblakeman.com/) berättade om “design thinking”
och hur det går att applicera på det mesta, inte bara grafisk design.

### Things you didn’t know about Exceptions

[Avdi Grimm](http://about.avdi.org/) pratade om kreativ felhantering i
Ruby. Ett av tipsen var att kalla på raise inne i rescue. Han har även skrivit
[Hammertime](http://avdi.org/devblog/2010/01/18/hammertime/),
en interaktiv felkonsoll för Ruby. Jag kan definitivt rekomendera att köpa hans ebok
[Exceptional Ruby - Master the art of handling failure in Ruby](http://exceptionalruby.com/).

### Mastering the Ruby Debugger

Detta var ljug, på ett bra sätt… [Jim](http://edgecase.com/)
berättade istället om IRB-ersättaren [Pry](http://pry.github.com/).

### Cognitive Psychology and the Zen of Code

[Jay Zeschin](http://unstuck.zeschin.org/) på [Bit Theory](http://bittheory.com/)
pratade om [kognitiv psykologi](http://sv.wikipedia.org/wiki/Kognitiv_psykologi). Mer specifikt så handlade det om heuristik, mönsterigenkänning och om hur man kan “hacka” [metakognition](http://sv.wikipedia.org/wiki/Metakognition). Han tipsade även om boken [Blink: The Power of Thinking Without Thinking](http://en.wikipedia.org/wiki/Blink_(book\)).

### Ignite Boulder Sweet 16

På kvällen deltog jag i [Ignite Boulder](http://igniteboulder.com/) och
det var lika inspirerande och galet som jag hört
[folk](http://acrookston.com/) berätta om tidigare. Bland annat försökte min kompis [Prakash](http://www.prakashmurthy.com/)
att förklara de något omständiga reglerna i Cricket.

Formatet för Ignite är väldigt enkelt:

 - 5 minuter
 - 20 automatiskt laddade slides

(Arrangörerna kommer snart att posta videos från eventet på
[YouTube](http://www.youtube.com/user/igniteboulder))

## Fredag (2/9)

### Real Time Rack

[Konstantin Haase](http://rkh.im/) pratade om hur man kan vrida och
vända på [Rack](http://rack.rubyforge.org/) för att få streaming
(HTTP server push) att fungera. Alternativen som presenterades var 
[Server-Sent Events](http://dev.w3.org/html5/eventsource/) (envägs,
enkelt, klienten går att implementera i JavaScript) och
[WebSockets](http://websocket.org/) (tvåvägs, men stöds sällan).

### Ruby Messaging Patterns

[Gerred Dillon](https://github.com/gerred) berättade om
[AMQP](http://en.wikipedia.org/wiki/Advanced_Message_Queuing_Protocol)
och hur man kan använda ett kösystem för att förenkla kommunikationen
med “Enterprise”-system. Han nämnde även [Chef](http://www.opscode.com/chef/), [EventMachine](http://rubyeventmachine.com/) och [Redis](http://redis.io/).

### Cloning Twitter: Rails + Cassandra = Scalable Sharing

[Charles Max Wood](http://teachmetocode.com/) berättade om ett kundprojekt som i stort sett gick ut på att bygga en klon av Twitter… med Cassandra som databas.

Begrepp som nämndes: [Brewer’s CAP Theorem](http://www.julianbrowne.com/article/viewer/brewers-cap-theorem) och [Thrift](http://thrift.apache.org/). Han har även börjat jobba på ett ORM för Cassandra som han däpt till [Sandra](http://rubygems.org/gems/sandra).

### Länkar till några presentationer

 - [Code First, Ask Questions Later](http://speakerdeck.com/u/tclem/p/code-first-ask-questions-later)
 - [A Documentation Talk](http://speakerdeck.com/u/holman/p/a-documentation-talk)
 - [Start using Jasmine. Write better JavaScript. Profit.](http://speakerdeck.com/u/searls/p/jasmine-for-rubyists-rockymtnruby-with-cory-flanigan-justin-searls)
 - [Do Your Commit Messages Suck?](http://speakerdeck.com/u/rmm5t/p/do-your-commit-messages-suck)

## Lördag (3/9)

När jag ätit frukost gick jag till [Boulder County Farmers’ Market](http://www.boulderfarmers.org/) för att sedan fortsätta upp på vandringsleden förbi [Red
Rocks](http://www.bouldercolorado.gov/index.php?option=com_content&task=view&id=3029&Itemid=1035).
Jag åt självklart lunch på [Mountain Sun](http://www.mountainsunpub.com/), beställ Tim’s Blackened Chicken Quesadilla så förstår du varför. Eftermiddagen spenderades på [The Cup](http://www.thecupboulder.com/) tillsammans med min kompis [Ben](http://benatkin.com/).
Vi snackade kod och hackade lite på min gem [Pinch](http://peterhellberg.github.com/pinch/).

Resten av helgen gick åt att flyga hem till Stockholm :)

**Uppdatering:** Nu ligger några av de filmade presentationerna uppe på [Confreaks](http://confreaks.net/events/rockymtnruby2011)

// [Peter](/peter)
