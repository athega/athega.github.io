---
title: "Det görs alldeles för många nativa mobilappar"
date: 2011-10-28
last_updated_by: peter
---
<img src="http://farm7.static.flickr.com/6118/6290716291_3871679140_m.jpg" alt="Söderarm" style="float:right; margin-left:8px;"/>

Årets [Athega Code Base](/code-base-2011) är förlagd till ön Torskär i det allra ytterstra stråket av skärgård innan havet mot Åland. På ön står den gamla fyren, Söderarm, känd från väderrapporter och vindobservationer.

Här driver Anngret Andersson en fantastisk [konferensanläggning](http://www.soderarm.com/web/start.shtml) som jag varmt kan rekommendera. Öns [historia](http://www.soderarm.com/web/historia.shtml) är intressant och vi huserar i ett hus som byggts till i fem omgångar. Med den sista kom ett kontrolltorn åt Sjöfartsverket med makalös utsikt. Detta rum har varit vår kodplats under dessa dagar.

<img src="http://farm7.static.flickr.com/6213/6291229152_10748ddaf5_m.jpg" width="240" height="179" alt="Söderarm">

Bilden till ovan visar faktiskt inte en Athegaanställd. Den är från 1988 och visar hur rummet användes innan vi tog över.

## Projektet

Med smartphone-vågen har ett onaturligt stort behov av nativa mobilappar till framför allt iOS, men också Android, sköljt över oss. Alla vill vara representerade i Apples och Googles app stores. Som utvecklare får man frågan ”Hur mycket kostar det att göra en Iphone-app?”. Den frågan är självklart väldigt svårbesvarad utan att veta vad appen ska göra.

Jag har varit med om detta tidigare, för snart 15 år sedan. Då var världen översvämmad av webbyråer, som många gånger var konverterade reklambyråer. Deras uppgift var att svara på frågan ”Vad kostar en hemsida?" och sedan bygga en hemsida. Det var sällan viktigt vad den innehöll, bara man "fanns på nätet".

Min poäng är alltså, att det för närvarande görs på tok för mycket nativa mobilappar. Många appar skulle passa mycket bättre som mobila webbappar. Med HTML5 och kraftfulla telefoner är begränsningarna få.

### Athega Dashboard

<img src="https://github.com/athega/acb2011-chrille/blob/master/public/img/screenshot.png?raw=true" alt="Athega Dashboard" style="float:right; margin-left:8px"/>

På Athega använder vi det eminenta tidrapporteringssystemet, [Harvest](http://http://www.getharvest.com/). Vi använder även Google för mail och document, mm. Dessa system, i kombination med våra egna system har alla publicerade APIer, som lämpar sig ypperligt att bygga en webbapp på. Jag tänkte mig en dashboard där du kan se grafer över tidrapporter, mätvärden, rapportera tid, osv.

Denna gång hann jag med att göra en graf som visar hur vår rapporterade tid fördelar sig över aktuell månad. Servern kommunicerar direkt med Harvest och telefonen med servern. Lokalt ritas ett diagram upp med RGraph som använder sig av ett canvaselement. Koden för den intresserade ligger på [GitHub](https://github.com/athega/acb2011-chrille).

#### Tekniker som utforskades och användes

 - [Harvest API](http://www.getharvest.com/api/)
 - [RGraph](http://www.rgraph.net/)
 - [Ruby](http://ruby-lang.org/)
 - [Sinatra](http://www.sinatrarb.com/)

<iframe src="https://prezi.com/p/embed/q-drjfn2tjfl/" id="iframe_container" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" allow="autoplay; fullscreen" height="540" width="960"></iframe>

/ [Christian](/chrille)
