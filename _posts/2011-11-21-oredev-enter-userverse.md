---
title: "Øredev - Enter Userverse"
date: 2011-11-21
last_updated_by: peter
---
<a href="http://www.flickr.com/photos/athega/6338009884/" title="ImageThink at Øredev by athega, on Flickr"><img src="http://farm7.static.flickr.com/6119/6338009884_c9749eb902_z.jpg" width="640" height="425" alt="ImageThink at Øredev"></a>

För snart två veckor sedan åkte de flesta av oss till konferensen [Øredev - Enter
Userverse](http://oredev.org/2011/) i Malmö. Jag antecknade ungefär 40 sidor i min Moleskine under
konferensen, men denna bloggpost täcker bara några godbitar :)

### Keynote: Only your mom wants to use your website

[Alexis Ohanian](http://twitter.com/kn0thing) berättade om hur
[Reddit](http://reddit.com) startades, att de bara lagt ut $500 på
marknadsföring (stickers) och att genomtänkta användargränssnitt
visa att man respekterar användarna.

> Your biggest enemy online is the back button.

### JavaScript effects

[Seb Lee-Delisle](http://seb.ly/) inledde med att prata om kreativ programmering med
[Processing](http://processing.org/) och [openFrameworks](http://www.openframeworks.cc/).
Han fortsatte med att live-koda ett [animerat träd](http://dl.dropbox.com/u/5096013/ConfStuff/OredevTree.html) med Canvas och JavaScript.

#### Länkar

 - [The Creative Coding Podcast ](http://creativecodingpodcast.com/)
 - [CreativeJS.com](http://creativejs.com/)
 - [Three.js](https://github.com/mrdoob/three.js/)

### WebSocket: Hyper or What?

Peter Moskovits från [Kaazing](http://kaazing.com/)
höll en rätt imponerande
[presentation](http://prezi.com/bzx8jutmpzrb/oredev-2011-kaazing-websocket-presentation/)
och demonstration av möjligheterna med WebSocket.

#### Länkar

 - [WebSocket.org](http://websocket.org/)
 - [When can I use...](http://caniuse.com/)

### Node.js - A practical introduction

[Felix Geisendörfer](http://twitter.com/felixge) berättade om
[Node.js](http://nodejs.org/)
historia och ekosystem. Han nämnde även att de använder
V8's Crankshaft JIT i Node.js 0.6

### Keynote: Abstraction Distractions

[Neal Ford](http://twitter.com/neal4d) höll en väldigt bra keynote där
han bland annat listade 10 “regler” för att hantera abstraktioner.

 1. Förväxla inte abstraktionen för den äkta varan.
 2. Förstå en nivå under din vanliga abstraktion.
 3. När de väl internaliserats är de mycket svåra att bryta.
 4. Abstraktioner är både väggar och fängelser.
 5. Döp inte saker som exponerar underliggande detaljer.
 6. Dina abstraktioner är inte perfekta.
 7. Förstå konsekvenserna av rigiditet.
 8. Bra APIer är både hög- och lågnivå på samma gång.
 9. Generalisera för 80% av lösningen.
 10. Bli inte distraherad av dina abstraktioner.

> Users want 100% of what they want.

### Ilya Grigorik

Den enligt mig bästa talaren på konferensen var [Ilya](http://igvita.com/) från Google (tidigare
[PostRank](http://www.postrank.com/)). Det är verkligen inte vanligt med
utvecklare som har så bra förmåga att förmedla sin kunskap så bra som
han lyckades med. Jag gick därmed på alla tre av Ilyas
föreläsningar.

#### Introduction to Machine Learning

Ilya inledde med att beskriva vad maskininlärning faktiskt är. Och att
man kan se det som evolution baserat på empiriska data.

Han rekomenderade även boken [Mahout in Action](http://www.manning.com/owen/)
samt algoritmen [Perseptron](http://en.wikipedia.org/wiki/Perceptron).
Några Ruby bibliotek som användes i exempelkoden var
[rb-libsvm](https://github.com/febeling/rb-libsvm) och
[linalg](https://github.com/quix/linalg).

Han avslutade med att rekomendera att vi skulle kolla på [Google Prediction
API](http://code.google.com/apis/predict/).

#### Building High Performance Ruby Web-Services

Ilya pratade om [Goliath](http://goliath.io/) och [EM-Synchrony](https://github.com/igrigorik/em-synchrony).

> Request isolation is a bug, not a feature.

Han visade även hur man med hjälp av Fibers (genom EM-Synchrony) kan
fortsätta använda samma typ av flödeskontroll som man har tillgång till
i synkrona ramverk.

Avslutningsvis rekomenderade han två PeepCode screencasts om
[EventMachine](https://peepcode.com/products/eventmachine)
([del 2](https://peepcode.com/products/eventmachine-ii)).

> HTTP _can_ be a high performance transport.

#### Modeling concurrency in Ruby and beyond

Enligt Ilya klarar man sig inte med enbart trådar eller events, man
**behöver** båda två.

Han nämnde [Actor-modellen](http://en.wikipedia.org/wiki/Actor_model)
som hastigast, men fokuserade mer på
[CSP](http://en.wikipedia.org/wiki/Communicating_sequential_processes)
då han såg några fördelar med den modellen. En stor skillnad mellan Actors
och CSP är att man i CSP fokuserar på namngivna “kanaler” snarare än meddelanden.

I CSP kan man även delegera kanaler, kanske till en annan process.

Exempelkoden använde sig bland annat av Ruby-biblioteket [Agent](https://github.com/igrigorik/agent).

##### Några språk och ramverk fokuserade på Actors

 - [Erlang](http://www.erlang.org/)
 - [Scala](http://www.scala-lang.org/)
 - [Kilim](http://www.malhar.net/sriram/kilim/)
 - [Akka](http://akka.io/)

##### Några språk och ramverk fokuserade på CSP

 - [Limbo](http://www.vitanuova.com/inferno/limbo.html)
 - [Go](http://golang.org/)
 - [CSP++](http://www.uoguelph.ca/~gardnerw/csp++/index.html)
 - [Agent](https://github.com/igrigorik/agent)

Han rekomenderade även boken [Seven Languages in Seven Weeks: A Pragmatic Guide to Learning Programming Languages](http://pragprog.com/book/btlang/seven-languages-in-seven-weeks).

/ [Peter](/peter)
