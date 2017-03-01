---
title: "Därför är Aftonbladet ohotat i toppen"
date: 2014-04-04
description: "Aftonbladet är ohotad etta igen. Vår konsult Christian Lizell vet hur sajten håller sig kvar på toppen."
tags:
  - nyhetsbrev
last_updated_by: chrille
image_url: http://athega.se/images/employees/chrille/medium.jpg
---
##"Vi releasar nytt dygnet runt. Som att bypass-operera ett nyhetsankare under sändning."

**Aftonbladet är ohotad etta igen. Internetworld säger att det är en ynnest att ha Aftonbladet i landet. Vår konsult [Christian Lizell](/chrille) vet hur sajten håller sig kvar på toppen.**

_Aftonbladet blev Sveriges bästa sajt igen. Hur behåller man greppet om läsarna?_

– Genom att aldrig vila. Alla har en stark tro på sig själva och är ständigt på jakt efter nya idéer, funktioner och lösningar. De är inte rädda att prova nya grepp och har lätt för att göra sig av med det som inte fungerar. Ibland driftsätter vi nya funktioner flera gånger om dagen.

![Christian Lizell](http://athega.se/images/employees/chrille/wide.jpg)
_Vår konsult Christian Lizell ingår i Aftonbladets team och gillar pulsen och ambitionen på landets bästa sajt._

_Hur testas nya funktioner utan risk?_

– Det är aldrig helt riskfritt. Men det går att minimera följderna av att något eventuellt går sönder. Innan ny funktionalitet tas i drift granskas och testas allt, både i teori och praktik. Kodgranskning sker med en Pull Request. Det är en förfrågan om att lyfta in ny funktionalitet där varenda förändring visas tydligt i ett grafiskt gränssnitt. Utvecklarna kan direkt testa, kommentera och diskutera förändringen. 
    Förbättringar görs direkt i en gren av huvudkoden och resultatet kan sedan lyftas in i huvudkoden för att driftsättas. Det innebär att det som ligger i huvudkoden alltid är redo att driftsättas. Det gör stor skillnad.

_Arbetar Aftonbladet annorlunda än andra stora sajter?_

– Alla sajter jobbar naturligtvis på sitt sätt, men jag tror att Aftonbladet har en klok strategi för hur nya funktioner tas i drift, stora som små. Det kan handla om att byta ut hela systemet, inklusive infrastruktur och kringsystem eller något så enkelt som att lägga ut en ny logga på en undersajt. Målet är att läsaren aldrig ska påverkas och helst inte ens märka att något skett. Det finns exempel på sajter som stänger ner ett dygn eller ett par timmar för "uppgradering". Det finns också exempel på driftsättning av nya funktioner som lett till att sajter gått ner och att man tvingats rulla tillbaka till en gammal version. Båda dessa exempel är naturligtvis negativa för besökarna. 
    Aftonbladet jobbar med Feature Toggles. Det är ett sätt att driftsätta ny funktionalitet utan att den omedelbart kommer i drift. Se det som en spak som slår av och på funktionaliteten som då kan testas i lugn och ro på en mindre trafikerad del av sajten. Går allt bra provar man över hela sajten. Skulle det ändå bli problem är det lätt att stänga av funktionaliteten genom att dra i spaken. Ingen kod behöver rullas tillbaka. 
    Detta är ofta applicerbart även på större systemförändringar. Ny hårdvara eller nya lösningar kan testas på delar av infrastrukturen. Det kräver mer förarbete och planering men är väl investerad tid. Det är lite som att bypass-operera ett nyhetsankare under sändning.

_Hur har man organiserat arbetet?_

– Aftonbladets IT-avdelning är uppdelad i team som jobbar i Scrumliknande upplägg. Vissa team kör Kanban, men alla har en PO, Product Owner. Beställningar hanteras i backlogs som prioriteras av produktägaren. Ny funktionalitet läggs ut genom ett release pipeline/release-flöde så snart behovet finns. Ibland flera gånger per dag. Det finns ett Core-team som hanterar driftsättningar av sajten. Teamet håller också koll på systemen och att allt ser normalt ut före och efter en driftsättning. En beskrivning av hur det går till skulle lätt fylla upp ett helt eget blogginlägg.
