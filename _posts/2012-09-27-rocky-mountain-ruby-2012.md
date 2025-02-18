---
title: "Rocky Mountain Ruby 2012"
date: 2012-09-27
last_updated_by: peter
---
![Boulder Theatre - Rocky Mountain Ruby Conference](http://assets.athega.se/blogg/2012/09/boulder_theatre_rmr.jpg)

Förra veckan fylldes [Boulder Theater](http://www.bouldertheater.com/)
ännu en gång av Rubyister från ett flertal delstater och länder,
det var dags för årets upplaga av konferensen
[Rocky Mountain Ruby](http://rockymtnruby.com/).

## Onsdag 19/9

Kvällen innan konferensen kom igång på riktigt höll
[Quick Left](http://quickleft.com/) en [Arduino](http://arduino.cc/)-hackfest.
(Hårdvaran sponsrades av [SparkFun](http://www.sparkfun.com/))

![Quick Left - Arduino](http://assets.athega.se/blogg/2012/09/quickleft_arduino.jpg)

## Torsdag 20/9

[Mike Gehard](https://twitter.com/mikegehard) inledde med
några minuter av [\#devmed](https://twitter.com/i/#!/search/realtime/%23devmed)

### Go Ahead, Make a Mess

> What is the future cost of doing nothing now?

Den första presentationen hölls av [Sandi Metz](https://twitter.com/sandimetz)
och hon satte ribban riktigt högt för de andra talarna :)

Hon beskrev hur man kan göra för att strukturera sin kod så att man
kapslar in de tråkigaste delarna av en kodbas.

[Kommentarer](https://github.com/newhavenrb/conferences/wiki/Go-Ahead-Make-a-Mess),
[Video](http://www.confreaks.com/videos/1115-gogaruco2012-go-ahead-make-a-mess) och
[Slides](https://speakerdeck.com/u/skmetz/p/go-ahead-make-a-mess-sandi-metz-rocky-mountain)

PS. Hennes bok [Practical Object-Oriented Design in Ruby](http://www.poodr.info/)
har precis släppts!

### Refactoring from Good to Great

> Tell don’t ask.

[Ben Orenstein](https://twitter.com/r00k) visade några bra knep på hur
man effektivt refaktorerar kod.

 * Börja inte jobba innan det finns specs på plats!
 * Extrahera till privat metod.
 * Skapa nya klasser, var inte blyg.
 * Använd arv när ingenting annan fungerar.
 * Förlita dig på abstraktioner.

Han rekomenderade även var man kan börja sitt arbete.

 * “God Objects”
 * Filer med mycket [churn](https://rubygems.org/gems/churn)
 * Buggar, eftersom de antagligen beror på att man inte har full
   förståelse för vad koden gör.

[Video](http://video2012.scotlandonrails.com/D1_GH_06-Ruby1280_b.mp4)

### To Mock or Not to Mock

> Reality is expensive.

[Justin Searls](https://twitter.com/searls) berättade om olika typer av
“[Test Doubles](http://en.wikipedia.org/wiki/Test_double)” och att man
borde fråga sig själv hur realistiskt man behöver testa för att få det
resultat man är ute efter.

Vad man testar olika test doubles:

 * Stub: Returvärden
 * Mock: Meddelanden
 * Spy: Interaktioner

Han visade även sitt bibliotek [Gimme](https://github.com/searls/gimme).

[Bloggpost](http://searls.testdouble.com/2011/06/03/whats-wrong-with-rubys-test-doubles/)

### The Joy of Front-End, A Journey with Bob Ross

> Clean code goes in clean files

[Roy Tomeij](https://twitter.com/roy) höll mycket bra dragning om hur
man kan strukturera sin HTML och CSS på ett modulärt sätt, en lösning
som hade vissa likheter med SMACSS som
[Jonathan Snooks](https://twitter.com/snookca) pratade om på förra
[Geek Meet Stockholm](http://robertnyman.com/geekmeet/).

[Video](http://www.youtube.com/watch?v=TqPzxrCIJTs) och [Slides](http://roytomeij.com/slides/rockymountainruby2012/)

### Lightning talks

[Colin Thomas-Arnold](https://twitter.com/colinta) visade
[RubyMotion](http://www.rubymotion.com/) samt biblioteken
[BubbleWrap](https://github.com/rubymotion/bubblewrap),
[SugarCube](https://github.com/rubymotion/sugarcube) och
[Teacup](https://github.com/rubymotion/teacup).

[Derrick Ko](https://twitter.com/derrickko) visade [mailcheck.js](https://github.com/Kicksend/mailcheck)

## Fredag 21/9

### Let’s talk concurrency

[José Valim](https://twitter.com/josevalim) förklarade på ett enkelt
sätt hur samtidighet (concurrency) fungerar. Han rekomenderade även sitt
språk [Elixir](http://elixir-lang.org/), Ruby-biblioteken
[Celluloid](http://celluloid.io/)
och [DCell](https://github.com/celluloid/dcell) samt boken
[Seven languages in seven weeks](http://pragprog.com/book/btlang/seven-languages-in-seven-weeks).

[Video](http://www.youtube.com/watch?v=ojU4O2CMeSc) och [Slides](https://speakerdeck.com/u/plataformatec/p/le)

### Building Rich Client Apps

> Pre-auth BOSH

[Derrick Ko](https://twitter.com/derrickko) berättade om hur
[Kicksend](http://kicksend.com/) använder sig av
[ejabberd](http://www.ejabberd.im/),
[RubyBOSH](https://github.com/skyfallsin/ruby_bosh) och
[Strophe.js](http://strophe.im/strophejs/) för att öka prestandan på sin
tjänst. (både riktig och upplevd)

[Slides](https://speakerdeck.com/u/dk/p/building-rich-client-apps)

### Expert Consulting

> Own the role as the expert.

[Paul Elliott](https://twitter.com/p_elliott) gav tips på vad man ska
tänka på som konsult, några hans exempel var:

 * Lär dig att säga **Nej**. _(Eller, Ja)_
 * Tänk på hur du uttrycker dig.
 * Bråka inte framför kunder, diskutera eventuella problem innan mötet.
 * Prata bara om sådant som kunden har nytta av.

### Eloquent Explanations

> Experts know it so well. They forget that there is anything to know.

Har du tänkt på hur stor del av din arbetsdag består av att förklara saker?
Det har [Russ Olsen](https://twitter.com/russolsen) gjort och han delade
med sig några av sina tankar runt ämnet under konferensens sista
föreläsning.

 * Ta ditt förklarande seriöst
 * Var agil
 * Förklara det viktigaste först
 * [DRY](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself), eller
   snarare “Repeat Yourself Enough”
 * Ta det inte så seriöst…

[Slides](https://speakerdeck.com/u/russolsen/p/eloquent-explanations-rubynation-2012)

## Lördag 22/9

Jag och [Paul](https://twitter.com/p_elliott) tänkte hitta något bra
café att äta frukost på, men så visade det sig att
[Matt](https://twitter.com/mattyoho) redan var på väg till
[The Kitchen](http://thekitchencommunity.com/the-kitchen-boulder/)
för att möta upp några fler som fortfarande var kvar i Boulder.
Vi var självklart inte sena med att haka på :)

Under frukosten bestämde vi oss för att det skulle vara kul att
se mer av de klippiga bergen. [Brian](https://twitter.com/brianlong)
var snäll och ställde upp som både chaufför och guide.

_(Boulder -> Nederland -> Peak 2 Peak -> Brainard Lake -> Ward -> Boulder)_

![10k feet](http://assets.athega.se/blogg/2012/09/10k_feet.jpg)

Resten av helgen gick åt att flyga hem till Stockholm :)

/ [Peter](/peter)
