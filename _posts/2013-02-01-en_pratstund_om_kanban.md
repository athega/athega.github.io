---
title: "En pratstund om Kanban"
date: 2013-02-01
last_updated_by: chrille
---
För några dagar sedan lunchade jag med en kollega på Aftonbladet IT, [@magnusljadas](https://twitter.com/magnusljadas), som berättade hur han såg på Kanban vs Scrum. Jag blev inspirerad och tog upp det på Athegas [Campfire](http://campfirenow.com/), där vi hänger och diskuterar allt mellan kodsnuttar och pistvakter.

Nedan återges en ganska oredigerad variant av diskussionen.

[Christian](/chrille): Fick en så himla bra jämförelse idag på lunchen av en Aftonbladetkollega. Han jämförde ett projekt med en trafikkorsning.

[Mats](/mats): ok

[Christian](/chrille): Scrum lägger till trafikljus och bringar ordning, men det är mycket stopp, start och börja om. Ett ganska hackigt flöde. Kanban känns mer som en rondell, där det mesta rullar på löpande. Man kan till och med dra det vidare och se filerna i rondellen som WIP-limits. Och en rondell med massor av filer vet vi ju hur bra den fungerar. Tyckte det var så bra att jag tänkte försöka hinna skriva en kort bloggpost om det <em>(anm. vilket nu skett)</em>.

[Mats](/mats): Jo som en metafor på en hög nivå är det en bra jämförelse. Eftersom Kanban bygger mycket på queueing theory så är jämförelser med trafik väldigt tacksamma.

[Christian](/chrille): Men även stoppljusen i Scrum känns bra

[Torbjörn](/tobbe): Men om det är rödljus för fotgängare i rondellens utfarter då? :)

[Mats](/mats): I kanban eftersträvar vi jämt flöde och samma sak i trafiken. Ju tätare bilarna åker (ju mer WIP vi har) desto långsammare går färden.

[Christian](/chrille): Tobbe!

[Mats](/mats): Det är därför man på motorvägar ibland får upp (50) i skyltar ovanför filerna. Känns väldigt långsamt då trafiken rullar i 80 men för att flödet ska bli jämt och inte klogga igen lägre fram är det i allas intresse att man kör långsammare tidigare. Balansera inflöde utifrån kapaciteten.

[Christian](/chrille): Vilket ingen gör :)

[Mats](/mats): Scrum t.ex. batchar i sprintar. Vilket gör att flödet hackar. Först väljer man ut vilka som får åka baserat på hur det gick senast. Man kanske tror att vägarna med rödljus osv kan hantera 100 bilar från A till B på 10 minutar. Sen försöker man låta dom åka samtidigt och hoppas att alla kommer fram i tid. Om det blir försenat justerar man sin gissning till nästa batch och säger vi provar med 90 denna gång verkar stämma. Och så justerar man sig hela tiden.
	
Kanban är tvärt om. Där släpper vi på en bil i taget baserat på när någon kommer fram så vi hela tiden har bilar som åker på vägarna. Då gör det inte så mycket om det blir en krock eller ett rödljus som krånglar. I genomsnitt så kommer bilarna fram och variationen (problemen på vägen) påverkar bara en eller ett par av bilarna, hela batchen med 100 bilar blir inte lidande.

[Christian](/chrille): Vilket kan fungera fint när man justerat in sig, men när bilarna är svåra att förutsäga och man har många påfarter längs vägen känns Kanban bättre. Det senare gäller för vårt projekt för tillfället och jag är glad att vi nu provar Kanban.

[Mats](/mats): Man kan blunda för murphys lag och bygga en mental bild av att "ju bättre vi blir på att tidsuppskatta desto bättre träffar vi på våra sprintar". Det är i min mening fel sätt att se på värde. Värdet är inte att bli bra på att gissa rätt. Värdet är att leverera saker i produktion som genererar pengar för företaget. Murphys lag finns alltid och är vi inte beredda och öppna för detta utan tror att vi med träning kan planera bättre och bättre ju med vi tidsuppskattar och planerar lägger man tid på fel sak.

[Christian](/chrille): Sant, men om man tvingas till tidsuppskattningar då?

[Mats](/mats): Som alltid i Kanban; samla data innan du argumenterar med beställare att tidsuppskattningar är onödiga. Bra data att ha innan diskussion startas är hur lång tid egentligen det tog jämfört med tidsuppskattningarna. Är ni bra på att uppskatta? (Räkna då in alla konstigheter som händer och inte något drömscenario där något ska ta 2 timmar och blev gjort på två timmar enligt utvecklaren men i själva verket tog 4 dagar. Ok säger du men touch time var 2 timmar, han jobbade faktiskt bara två timmar på den saker. Well, stämmer det verkligen om det tog 4 dagar?
	
Nästa sak att mäta är "Vad kostar tidsuppskattningarna?" Cost of opportunity. Hur mycket arbete, hur många timmar utveckling kunde vi gjort om vi slapp tidsuppskatta.

[Christian](/chrille): Men det kräver ju att man fått köra Kanban ett tag. Det är verkligen en bra poäng. Overheaden är rätt stor där. Dock kommer det ju bra grejer ur själva diskussionen, men den kan man säkert lösa på andra sätt.

[Mats](/mats): Man skulle kunna se det som att “köra Kanban” är en attityd. Det kan man mentalt göra även om man kör vattenfall eller Scrum. En mental bild av att med riktigt data vara öppna för förändringar och på så sätt förbättra relevanta delar av sättet att arbete. Sätta upp relevanta mätvärden, fortsätta med sitt arbetssätt som tidigare mät relevanta värden. Tidsåtgång till tidsuppskattningar, ledtider, hur många missade sprintar, hur mycket reaktiv arbete kommer in och stör sprintarna, Hur bra är vi i verkligheten på att tidsuppskatta? Hur mycket arbete kommer tillbaka efter att vi tror vi är klara och levererat t.ex. buggar? Får man en bild av nuläget kan nästa steg vara att prova att tweeka lite. Annars är det svårt att säga att “Scrum passar inte oss”. Scrum är ett sätt att arbeta som säkerligen är bättre än att inte jobbat utifrån någon metodik alls. Men man kanske ska tweeka lite på sprintarna och testa om man kan levererar mer då? Utgå från Kanbans principer och practicies och var öppna för förändring. Våga experimentera. Ibland blir det bättre. Vi levererar mer, mer förutsägbart, bättre kvalitet. Men ibland kan det blir sämre. Då lär vi oss.  

[Christian](/chrille): Situationen i vårt projekt var att vi jobbade i en tvåveckorssprint, lösa estimat med magen S,M,L, avsatte timeboxad tid till löpande förvaltning och hamnar ofta sedan i en verklighet där mycket händer och stories kastas om. Känner att det stora planeringsmötet är litet i onödan. Vi har dessutom en backlogmassage där vi diskuterar igenom stories som ligger högt i prio i backloggen. Det vi i princip gör nu är att vi skippar estimaten, annat än för att splitta för stora puckar, samt låter flödet på tavlan bestämma vad vi jobbar med. Vi stämmer fortfarande av varannan vecka och sätter mål för kommande tvåveckorsperiod.

[Mats](/mats): Att köra Kanban är en vilja att förbättra sig utan att låsa sig till befintliga regler. Verktygen är visualisering mm på olika sätt men grunden att förbättra sig i små steg, baserat på data kan man göra i alla miljöer. Och för att samla data kanske man ska börja visualisera vad som händer under sprintarna? Hur rör sig arbetet? Hur mycket oplanerat arbete trycks in? 

[Christian](/chrille): Ja och en bra start som räcker långt är att markera start- och slutdatum på lapparna ;)

[Mats](/mats):  Start och slut är jättebra. Markera eventuella blockeringar. Om saker fastnar, man börjar på annat, varför gjorde man det? Om kunden kommer in och detaljprioriterar under sprinten är ju sprintplaneringen rätt onödigt. 

Det viktiga med WIP-limits på tavlan och begränsningar är att det inte bara ska vara ett verktyg för teamet att "få göra klart något" utan det ska även vara utformat så att beställarna ser att dom får ett verktyg som bygger förtroende. Beställaren ska egentligen vara den som får mest ut av limits i form av fortroende att saker blir klara när dom kommer in på tavlan. Det är ett jobb som måste pågå en längre tid och föras i diskussion med beställarna.
	
Planering måste alltid ske och ofta i samråd med utvecklare då features kan variera så i kostnad/tid att göra så det är inget fel att planera. Som sagt finns inget i Kanban som säger att planering är fel eller dåligt. Det är snarare så det fungerar.
