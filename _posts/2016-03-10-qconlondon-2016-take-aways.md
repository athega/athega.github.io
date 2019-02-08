---
title: "QCon London 2016 – Take aways"
date: 2016-03-10
tags:
  - konferens
last_updated_by: chrille
---
## Tre dagar på Queen Elizabeth II Conference Center

![Athegakillar och Big Ben](/assets/legacy/uploads/2016/03/bigben.jpg)

Med ett spann på en genomgång av hur virtuella truckar på Volvo fungerar till vad som är nytt i Spring 5 via en redogörelse för hur man kombinerar att vara långdistanslöpare och blind(!) och hur blockchain-kedjan för Bitcoins fungerar, kan jag lugnt konstatera att [QCon](https://qconlondon.com/) är en bred konferens med något för alla.

I denna artikel ska jag så kort jag kan redogöra för hur de här tre dagarna påverkat min omedelbara framtid. Eller mindre pretantiöst, vad jag ska prova härnäst och titta litet närmare på.

Sist i artikeln kan man hitta en lista på de föreläsningar jag hann med för den som är intresserad.

**Keynotesen höll dessvärre** ingen vidare värst hög nivå, möjligen med undantag för [Adryan Colyer](https://twitter.com/adriancolyer) som nästan dagligen skriver om något av alla datorvetenskapliga artiklar som han tar sig igenom.

» Bloggen [The morning paper](http://blog.acolyer.org/) är därmed min första take away.

**Property based testing** har jag alltid velat prova på riktigt. Det utlovar en kodbas med tester som är lättare att underhålla och mindre känslig för refaktoriseringar. Istället för att testa givna fasta värden, skriver du definitioner av hur din kod ska bete sig. Du låter sedan ramverket hamra på din kod hundratals (eller fler) gånger på din kod, inom dessa givna ramar.

» [JUnitQuickcheck](https://pholser.github.io/junit-quickcheck/index.html) är min nästa take away.

**Mob programming** pratas det om på många håll och två fina killar från Cucumber Inc som ligger bakom BDD-testramverket [cucumber](https://cucumber.io/) fick mig verkligen att vilja prova direkt. För litet drygt 15 år sedan sa Kent Beck att om det är bra att lösa problem ihop, dra upp den ratten till 11 (på en tiogradig skala) och parprogrammera. Grupprogrammering (svenska för mob programming) är som att dra upp parprogrammeringsratten till 11. Några timmar om dagen programmerar hela teamet tillsammans, en dator, en skärm. Håll i er, på måndag kör vi!

» [Mob programming](http://mobprogramming.org/) är take away nummer tre.

![Retro på GitHub](/assets/legacy/uploads/2016/03/mobprogretro_169.jpg)

Litet roligt att de avslutar varje programmeringssession med en retro, som de checkar in i master.

**Monoliter ersätts av mikrotjänser (microservices)** över hela världen. Om man ska hitta ett genomgående tema under dessa dagar kan man konstatera att det var väldigt många företag som ville berätta om hur de framgångsrikt bytt ut sin monolitiska arkitektur mot mikrotjänster. BBC berättade om sin playtjänst iPlayer och det var ganska spännande att lära sig att de konstant delade upp det som sänds i delar om 80MB som sparas i S3 (Amazon). Tack vare en finurlig S3-tjänst kan man sedan supersnabbt skapa nya filer av dessa delar. På så sätt kan man sätta ihop hela program, videoklipp, sända live, osv. BBC har förmodligen ett bra avtal med Amazon eftersom de skyfflar ut ca **21 TB/dag** till S3.

![BBC iPlayer filhantering](/assets/legacy/uploads/2016/03/bbc_80mb.jpg)

Netflix, kungen av mikrotjänster, slog ett slag för sitt **Failure driven development**. Det handlar om att konstant och medvetet kasta in fel i sin arkitektur på olika ställen, utan att konsumenten drabbas. De har ett helt batteri med verktyg och strategier att göra detta. Detta känner jag att jag behöver bli bättre på, det är litet av ett annat tänk, som öppnar upp sig och möjliggörs av en mikroservicearkitektur.

» Därför blir [Chaos Monkey](https://github.com/Netflix/SimianArmy/wiki/Chaos-Monkey) nästa take away.

**Bakom brandväggen kan vi känna oss trygga**, eller kan vi det? [Christina Camilleri](https://twitter.com/0xkitty) och [Shubham Shah](http://shubh.am/) öppnade upp mina ögon för hur lätt det fortfarande är att komma över information som gör att man kan ta sig in bakom brandväggen. Genom telefonsamtal och finurliga mail och annat socialt hackande berättade de om hur lätt de kommit åt inloggningsuppgifter. Alldeles för hjälpsamma supportpersoner och att vi ofta utgår ifrån att man kan lita på folk är en väldigt effektiv attackvektor.

» Take away nummer fem är alltså att vi måste säkra upp servrar på insidan också, de är **inte säkra bara för att de är bakom brandväggen**.

**Streams i Node.js** är verkligen användbara och möjliggör snabba och effektiva system. Det jag hade missat här är att det är oerhört lätt att läcka resurser, med minnesproblem som följd. Varje gång du pipear en stream och har oturen att få något problem med den aktuella streamen måste du vara noggrann med att stänga ned källstreamen. Detta gäller för varje par och har du en litet längre kedja kan det bli riktigt hårigt. För att hjälpa till med just detta finns det en modul som heter [pump](https://github.com/mafintosh/pump).

Av någon anledning har jag undvikit både code coverage-verktyg, för att ha koll på hur duktigt jag testar och avsökningsverktyg för att hitta säkerhetshål i mina Javascriptsprojekt. Skärpning!

Mina sista take aways är alltså [pump](https://github.com/mafintosh/pump), [istanbull](https://gotwarlost.github.io/istanbul/) (code coverage) och [snyk](https://snyk.io/) samt [Node Security Project](https://nodesecurity.io/tools) (säkerhet).

/ [Christian](/chrille)

### Min första dag
 - Unevenly Distributed
 - [Spring Framework 5 - Preview & Roadmap](https://qconlondon.com/system/files/presentation-slides/juergenhoeller-springframework5_0.pdf)
 - [An Introduction to Property Based Testing](https://qconlondon.com/system/files/presentation-slides/an_introduction_to_property_based_testing.pdf)
 - Applied CI/CD: Enabling Creativity @Volvo Trucks
 - [Apache Ignite™ – In-Memory Data Fabric](https://qconlondon.com/system/files/presentation-slides/nikita.pdf)
 - [Far from the mobbing crowd](https://qconlondon.com/system/files/presentation-slides/mattwynnestevetooke.pdf)
 - [Realtime Stream Computing & Analytics @Uber ](https://qconlondon.com/system/files/presentation-slides/sudhittonse.pdf)

### Min andra dag
 - Reflections on Software Architecture
 - Cloud-based Microservices powering BBC iPlayer
 - \#NetflixEverywhere Global Architecture
 - Bitcoin Security: 1/10th cent to a billion dollars
 - [Engineering You](https://qconlondon.com/system/files/presentation-slides/martinthompsonengineeringyou.pdf)
 - Architecting Google Docs
 - Nihilist’s Guide to Wrecking Humans and Systems

### Min tredje dag
 - Monkeys in Lab Coats: Applying failure testing research @Netflix
 - Meet the Node.js anti-patterns
 - Rust: Systems Programming for Everyone
 - Successful Go program design, 6 years on
 - Applied Supervised Learning: Predicting Recidivism
