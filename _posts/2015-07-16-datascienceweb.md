---
title: "Data Science A/B test"
date: 2015-07-16
description: "Vad ska vi tänka på när vi testar våra hypoteser och vill få ett tillförlitligt beslutsunderlag?"
tags:
  - nyhetsbrev
last_updated_by: peter
image_url: https://athega.se/system/uploads/2015/07/ab.png
---
#### Att testa en hypotes
<div style=" float: right; margin: 0 0 10px 10px; ">
<img src="https://athega.se/system/uploads/2015/07/ab.png"/>
</div> 
Hypotesprövning innebär att vi först bestämmer oss för vad vi vill testa. Parametern kan vara antal besökare på en sida och hypotesen att en av två versioner av sidan attraherar besökaren mera. Dock vet vi inte vilken version. Tänk en försäljningssida där besökaren ska klicka på en köp-knapp. Hur ska den knappen och texten se ut för att generera mest försäljning? Vi kan testa två versioner av sidan och mäta försäljningen. Allmänt kallas detta A/B testning. Vi testar två olika fall för att se vilket som genererar högst värde av den parameter vi anser är viktig. Fördelningen eller antal procent som aktiveras kallas konverteringsgrad.

> Att genomföra ett statistiskt tillförlitligt A/B test är inte alltid så lätt
 
##### 1 - Bakgrundsdata
Först vill vi samla lite bakgrundsdata. Vad har vi för konverteringsgrad idag? Hur många som klickar på Köp genomför verkligen ett köp? Det är upp till var och en att förbereda sig med relevanta frågeställningar och data runt detta.

##### 2 - Forma hypotesen
Detta gäller för övervakade och kontrollerade A/B tester. Helt enkelt tester där vi själva bestämmer vår hypotes. ”Vi tror att en röd knapp ökar konverteringsgraden”.

##### 3 - Designa experimentet
Räkna ut hur länge vi behöver göra testet. Hur mycket data behöver vi för att kunna dra en tillförlitlig slutsats? Det finns kalkylatorer på nätet och olika tillverkare av programvaror för A/B testning har olika uppfattningar. För att bestämma detta krävs en del kunskap om statistik och kunskap om besökarnas mönster. Det går att med olika metoder komma fram till ett lämpligt underlag. Lägg gärna tid på att förstå detta. Det vore olyckligt om testet visar fel resultat pga för kort eller för lång testperiod. Se till att köra hela testet klart innan ni drar några slutsatser om signifikans. Att löpande köra ett A/B test på en sida och då och då titta efter signifikans ökar drastiskt risken för felaktiga slutsatser. Effekterna och hur svårt detta är kommer beskrivas senare i en separat bloggpost.

##### 4 - Genomför experimentet
Sätt upp det innehåll ni vill prova, programmera eller lägg in de script som behövs. Om ni redan har programvaror för detta, starta helt enkelt testet.

##### 5 - Analysera data
Precis som i punkt 3 är det viktigt att man vet vad man gör i detta moment. Statistik är inte helt intuitivt och det är lätt att misstolka data som verkar visa självklara slutsatser. Här kan en data-analytiker eller Data Scientist vara behjälplig med variationsanalys och analys av outliers som påverkar resultatet i olika riktningar. Det är sällan så lätt att det går att dra statistiskt säkerställda slutsatser från medelvärden.

##### 6 - Slutsats
Kommunicera resultatet inklusive tillförlitligheten. Detta är ett svårt men väldigt viktigt moment. Alla inblandade och alla som berörs måste få ett underlag alla förstår. Speciellt tillförlitligheten är svår att kommunicera. Grafiska och visuella förklaringar är bra. En som är duktig på statistik och kan förklara resultatet och konfidensintervall behövs ofta för att inte resultatet ska misstolkas.
 


#### Generella lösningar kräver både domän- och data-science expertis
Metoder och verktyg som används inom Data-science begränsas inte till specifika områden. Tekniken och algoritmerna är de samma oavsett om det är finansiellt data, besöksstatistik eller CRM-data på försäljning. 

#### Rollen data-scientist

En Data-scientist är en utbildad matematiker som är mycket kunnig i statistiska modeller och dataanalys. Självklart ska en data-scientist programmatiskt kunna modulera artificiella neuronnät och kluster samt veta vilka implementationer som ger bästa lösning. 
> På Athega är en Data-Scientist en senior utvecklare med högre akademisk examen i matematik och statistik.


<div style="margin: 0 0 10px 10px; ">
Läs mer om Mark som vaskar guld i databaser<br>
<a href="/blogg/2015/04/14/datascientist">
<img src="https://athega.se/system/uploads/2015/04/mark_small.jpg"/>
</a>
</div>

<div style="
            border: 0px solid #bdbdbd;
            border-radius: 15px 50px 30px 5px;
            background: #F0F0F0;
            padding: 20px; 
            width: 50%;
            margin: 0 0 25px; 
            font-size: 16px;
            color: Black; font-style: Italic;
            overflow: hidden;">
Vi är experter på programmering, statistik och matematik. Ni är domänexperter på ert data. Tillsammans kan vi skapa konkurrensfördelar genom områdesöverskridande samarbeten.
</div>
