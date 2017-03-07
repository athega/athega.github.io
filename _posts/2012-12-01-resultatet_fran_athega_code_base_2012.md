---
title: "Athega Code Base 2012"
date: 2012-12-01
description: "Höstkonferensen kallas Athega Codebase. Vi brukar bege oss ut i ytterskärgården till Söderarm där vi huserar, leker med senaste tekniken och har en väldigt trevlig helg."
last_updated_by: mats
image_url: https://athega.se/system/uploads/2013/10/sodera.png
---
![Snöstorm](http://assets.athega.se/blogg/2012/12/acb2012-snow.jpg)

Årets Athega Code Base 2012, [#acb2012](https://twitter.com/search?q=%23acb2012) bjöd på en hård start i ca 20 m/s och en ganska skumpig båtfärd ut till Söderarm. Vinden mojnade så småningom och i takt med att utkikstornet vi befann oss i slutade gunga tog projekten form.

## Innovativa lösningar för effektivare resor och transporter

[Mats](/mats) och [Torbjörn](/tobbe) har jobbat med ett tävlingsbidrag till en tävling utlyst av ITS Innovation Stockholm Kista. Vi kan inte berätta om vår lösning innan vi lämnat in och vunnit. Men stor rapportering kommer ske efter vinsten.

[Här](http://www.mynewsdesk.com/se/pressroom/stockholms_stad/pressrelease/view/banbrytande-innovationstaevling-foer-framtidens-trafikloesningar-816653) kan ni läsa mer om tävlingen.

## En responsiv live-graphite-dashboard

Jag ville utforska möjligheterna att skriva en egen dashboard mot en graphitedatabas. För ett tag sedan installerade jag en rad mätare hemma som håller reda på temperatur, luftfuktighet, elförbrukning, mm. Dessa rapporterar löpande in till en graphiteserver som jag har i Amazons fantastiska moln, [EC2](http://aws.amazon.com/ec2/). [Graphite](http://graphite.wikidot.com/) har dessutom möjligheten att exponera [data som JSON](http://graphite.readthedocs.org/en/1.0/url-api.html#format) utan att man ens behöver anstränga sig. Upplägget är alltså en dashboard för huset.

![Källaren](https://www.evernote.com/shard/s19/sh/ca82d9b8-4908-498a-a0b0-84328687a824/17aa447f2faa35d48b23a2d8315c43cd/res/1be692af-1fa7-42e9-a75f-3050c2909aee/skitch.png?resizeSmall&width=260)

Det responsiva löser jag med [Skeleton](http://www.getskeleton.com/), som på ett lättviktigt och rent sätt hjälper mig med strukturen. Graferna ritar jag inte med graphite eftersom jag vill ha litet termometrar och mätare, samt kunna animera dem. Valet denna gång föll på [RGraph](http://www.rgraph.net/) som mer än väl räcker till för mina behov. Det hela knyts ihop med [jQuery](http://jquery.com/).

Ett fungerande exempel kan finnas [här](http://hem.lizell.se/content/dash/).

/ [Christian](/chrille)

## Enkelt API för populära bilder på 500px

Jag hittade nyligen tjänsten [ScraperWiki](https://scraperwiki.com/)
som låter dig bygga enkla scrapers i Ruby, Python och PHP. 

Mitt lilla [hack](https://scraperwiki.com/scrapers/500px/) 
består i att skrapa några sidor med populära 
bilder från [500px](http://500px.com/), informationen sparar jag 
ner i ScraperWikis datastore vilket gör att jag kan använda mig 
av deras generella [data API](https://scraperwiki.com/docs/api#sqlite)

![iPad med 500px hacket](http://assets.athega.se/blogg/2012/12/ipad-mini-with-500px-hack.jpg)

Presentationen av bilderna lade jag på [JS Bin](http://jsbin.com/uribis/3).

Jag använder mig av “[Seamless Responsive Photo Grid](http://css-tricks.com/seamless-responsive-photo-grid/)” för att fylla hela browserfönstret med bilder.

/ [Peter](/peter)

## Bo i Stockholm (Alex)

Alla människor har adresser som deras liv kretsar kring, t.ex. arbete eller skola. Dessa adresser begränsar vart man kan kan bo med tanke på restid. Målet var (och är) att skapa en karta med områden där användaren kan bo är markerade. Användaren skriver in adresser som är viktiga samt hur lång tid det får ta att ta sig dit. Tjänsten använder sedan api:et SLs Reseplanerare för att se vilka områden i Stockholm som fungerar för användaren.

Teknikerna som användes var JavaScript, [node.js](http://nodejs.org/), [OpenStreetMap](http://www.openstreetmap.org/), SLs Reseplanerare.

/ [Alex](/alex)


## Ansiktsigenkänning med WebRTC, Websockets och OpenCV (Micke)

Jag har labbat med ansiktsigenkänning i webbläsaren. Jag kommer åt webkameran genom  [WebRTC](http://www.webrtc.org/) vilket innebär att jag inte behöver använda mig av några webbläsarplugin.

Videoströmmen från kameran renderar jag sedan i en canvastagg. Pixlarna från canvasen skickas över websockets till en python server som snurrar på [Tornado](http://www.tornadoweb.org/). På serversidan processas bilderna av [OpenCV](http://opencv.org/).

Ansiktsigenkänning med OpenCV bygger på att en statistisk modell tränas med ett antal bilder med kända ansikten. Sedan skickas bilden som ska processas in till modellen och förhoppningsvis svarar modellen tillbaka med rätt namn på ansiktet. För att träna en grundmodell har jag använt mig av AT&T:s ansiktsdatabas.

Bilderna från webbkameran skickas in till min modell för igenkänning. Om resultat inte är tillräckligt bra tränas modellen om med de nya bildera för att ge ett bättre resultat i framtiden.

/ [Micke](/mikael)
