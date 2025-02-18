---
title: "Codebase 2016 (Athegas Hackday)"
date: 2016-11-08
description: "Traditionsenligt arrangerade vi vår Codebase på hösten, men två saker var lite annorlunda i år."
tags:
  - codebase 2016 athegas hackday
last_updated_by: johan
---
<img src="/assets/legacy/uploads/2016/11/friiberghs.jpg" alt="Friiberghs Herrgård">

Traditionsenligt arrangerade vi vår Codebase på hösten, men två saker var lite annorlunda i år. Det första var att vi inte badade i bräckt vatten i Östersjön utan vi besökte Friiberghs Herrgård i Mälaren (Grodhavet). Kontrasten är stor mellan Ålandshav och Ekoln men båda miljöerna lämpar sig för kreativt arbete i annorlunda miljö. Ett tydligt avbräck från vardagen.
Den andra skillnaden var att det flesta jobbade med ett gemensamt projekt som påbörjats tidigare i samband med våra gemensamma athegafredagar. Syftet är att renovera och förnya de kreativa lösningar vi använder på vår jullunch. Funktioner från inbjudan, genomförande av lunchen till uppföljning.

Peter jobbade hårt på serversidan med en meddelandebuss. Han satte upp NATS streaming och skrev en proxy för HTTP till NATS.
Proxyn utvecklades i Go och har stöd för att leverera meddelande som Server-Sent Events (SSE) till browserbaserade klienter.

Mikael jobbade med presentation av livestatistik. Han konsumerar
Server-Sent Events  (https://www.html5rocks.com/en/tutorials/eventsource/basics/) och med hjälp av dessa renderar han bubbelgrafer med D3.js (https://d3js.org/).
I takt med att händelser av en viss typ anländer till webbklienten så växer eller krymper de olika bubblorna.

<img src="/assets/legacy/uploads/2016/11/neopixel_codebase.jpg" alt="Neopixel Codebase 2016" style="float: left; margin: 0 1.5em 1.5em 0;">

Torbjörn och Mats bygger bygger ljuseffekter till en fysisk inloggningsportal som ska användas när gästerna ankommer till lunchen. De använder Led-lampor från Neopixel som de styr med hjälp av en Tessel och tar fram lämpliga effekter som kan triggas av ankomsthändelser som fotografering av deltagaren. Tessel är en hårdavuutvecklingsplatform (IoT) som kan programmeras med Javascript och Node API:er. Händelser konsumeras via Server-Sent Events.

Chistian jobbade mycket med den nya Tesselplattformen, Tessel2 och den delen som sköter incheckningar med RFID-kort. Han fixar även serversidan med både webbgränssnitt samt lagring av incheckningsdata.

Alex bygger en stämningsmätare och använder en Tessel 1 med ambient- & servo-modulen. Genom ambientmodulen får han data om ljudnivån i rummet. Datat som avspeglar ljudnivån styr ett servo. Servot flyttar på en arm över en mätartavla. Tesseln skickar även datat över Peters lösning och vi kan utnyttja informationen i våra presentationer som rullar under lunchen.

Krister kommer se till vi tar en bra bild av varje deltagare. Han labbar med C++, OpenCV, cnats och curl.

Johan bygger dynamiska presentationsbilder som ska snurra och visas på skärmar under lunchen med livestatistik. Hans bildsnurra består av HTML, Javascript med jQuery, CSS med animeringar och webb API:et EventSource för att reagera på NATS-flödet av händelser.

Mattias bygger en legorobot som spelar på en Pocket operators. Det blir den bästa demon.

Vi hade en väldigt lyckad och trevlig Codebase och ser fram emot nästa.
