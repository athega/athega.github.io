---
title: "Till vad använder man ett Hadoopkluster?"
date: 2016-08-18
description: "Här är en liten översikt över Hadoop för att diskutera den övertro och förvirring som finns kring dess användning."
last_updated_by: peter
---
###  Ett försök att identifiera typiska användningsfall för ett Hadoopkluster

> Här är en liten översikt över Hadoop för att diskutera den övertro och förvirring som finns kring dess användning. Jag hoppas det ger er en intressant läsning och överblick.

![Datorskärm](/assets/legacy/uploads/2016/08/dator_arbetsplats.jpg)

Hadoop är ett högpresterande datorkluster som fungerar som en enhet. Det betyder att dina befintliga datorer effektivt kan arbeta tillsammans som en logisk enhet.

Självklart låter detta mycket spännande men frågan är hur ditt Hadoopkluster faktiskt kan leverera önskat affärsvärde.

Hadoop har blivit lite synonymt med analys och Big-data vilket jag skulle säga är en liten överdrift.

Hadoop använder sig av likväl strukturerad som ostrukturerad data. Den kan hantera enorma mängder data i terabyteklassen och lagra datat tills det ska analyseras. Då kan man använda sig av Hadoops stora utbud av kodkomponenter för exempelvis maskininlärning.

Företag som önskar sig ett datorkluster med Hadoop bör tänka igenom olika alternativ.  Ja, för det det finns flera bra alternativa datorklusterlösningar som i vissa fall kan vara mer passande. Jag kommer inte att gå på dessa i denna post.

Eftersom Hadoop är öppen källkod kan den uppfattas som kostnadsfri, men sanningen är att kostnaden finns gömd i underhåll och utveckling.

Kostnadskontroll bygger på planering och förståelse av de många spännande källkodskomponenter som eldsjälar har bidragit med. Självklart ska man förstå sin egna affärsbehov och Hadoops begränsningar.

Jag har försökt beskriva några användarfall lämpliga för Hadoop-datorkluster och hittat komponenter och kunskap som kan behövas.

## Till exempel

- Kostnadseffektiv datalagring på befintliga maskiner
- Driva utvecklingen framåt genom disruptiv innovation och användning av Hadoop
- Hitta datan du söker efter såsom “nålen i höstacken”


## Bakgrundshistoria

Hadoop var i sin linda en lösning till Yahoos sökmotorteknik.
2006 arbetade Doug Cutting på Yahoo med deras webbsöksteknik kallad Nutch. Doug kopplade samman Yahoos Nutch-teknik med kunskap av Googles Filsystem och publikationer kring Map Reduce. Det blev Hadoop (namnet Hadoop kommer från Dougs barns leksakselefant) och han släppte Hadoop som öppen källkod under Apache Software Foundation.

> “Everyone had something that pretty much was like MapReduce because we were all solving the same problems. We were trying to handle literally billions of web pages on machines that are probably, if you go back and check, epsilon more powerful than today’s cell phones. … So there was no option but to latch hundreds to thousands of machines together to build the index. So it was out of desperation that MapReduce was invented.” – Doug

Min tolkning och översättning av detta är som följer:

Vi alla hade samma utmaningar. Bokstavligen miljarder av webbsidor att granska maskinellt med datorer som var endast något kraftfullare än dagens mobiler. Därav fanns det inget annat val än att koppla ihop och indexera hundra miljoner maskiner. Det var ur detta kaos och den komplexitet som MapReduce och därmed Hadoop skapades som en nödlösning.

Även om Hadoop har funnits i åratal är tekniken fortfarande ny och utvecklas i snabb takt. Den är komplex och svår att får ett helhetsgrepp om.
Är den det “allt i allo” och parallellkluster som den anses vara?  Det är den frågan vi ska försöka svara på.

## När ska man använda Hadoop?

Enkelt svarat, när man undersöker stora datamängder i terabytesklassen.

### Användarfall 1
#### Kostnadseffektiv datalagring på befintliga maskiner

Väl fungerande och kostnadseffektiv datalagring kan lätt åstadkommas med hjälp av en HDFS (Hadoop distributed file system).
Vi ser hur kunder testar olika effektiva datalagringslösningar på deras befintliga maskinpark. En vanlig kompletterande teknik är Apache Thrift som tillåter användning av ens favorit programmeringsspråk gentemot Hadoop.

### Användarfall 2

#### Sänk kostnaden för din befintliga databaslösning genom disruptiv innovation

Genom den omdiskuterade processen disruptiv innovation skapas alternativ till dagens omfattande och kostsamma databas- och data-warehouselösningar.
För mig är just detta användarfall en förklaring till det något överraskande stora utbudet av SQL-tekniker på Hadoop. Överraskande därför att MapReduce-tekniken som Hadoop bygger på är en begränsande teknik: Det finns flera andra möjliga parallella arkitekturer och angreppssätt. Därmed är Hadoop inte ett självklart val för parallella sökningar i stora datamängder.

Import av befintligt data till en Hadoop databas underlättas av Apache sqoop. Därefter kan man använda sig av t.ex.  Apache hive eller programmera i språket Pig Latin för att utföra sökningar i datat.  För att komma igång med Apache hive räcker det med kunskaper och erfarenheter av SQL .
Pig Latin å andra sidan är tekniskt mer komplicerat i och med att sökningen av data är beroende av hur datat är strukturerad, med andra ord är språket lite “pillrigt” och det är svårt att felsöka. Med det sagt är Pig Latin värt besväret då man verkligen vill dra nytta av Hadoops totala kapacitet och möjligheter.

### Användarfall 3
#### Hitta nålen i höstacken

Användarfall 3 förklarar Hadoops nuvarande popularitet och plats som den mest omtalade analysmiljön för företag.
Här hittar vi spännande lösningar som maskininlärning och andra så kallade Big-data funktioner.  Här krävs djupare kunskap om både Hadoop-miljön och de matematiska principerna man använder sig av.

### Användarfall 4
#### Batchkörningar

Hadoops ursprungliga syfte som satsvis bearbetning genom batchkörningar.  Det är Hadoop mycket väl lämpat för till exempel omfattande ETL (extrahera, transformera och ladda data) och liknande.
Batchkörningar är inte lika hett och spännande som Big-data funktionerna som nämnts ovan i användarfall 3. Men batchkörningar är och förblir arbetshästen i de flesta företag än idag.
Apache thrift och Avro är komponenter som hjälper till och tillåter att man använder sig av sitt favoritprogrammeringsspråk.  Det är ett stort plus gällande  underhåll och att  börja utforska Hadoop-världen.

## Kunskap är nyckeln

Det är möjligt att installera och underhålla ett eget Hadoop-kluster och komponentbibliotek men det kräver orimligt mycket tid. En bättre lösning är att utnyttja standardlösningar från företag som väljer ut och paketerar mjukvaror. Hortonworks och Cloudera erbjuder sina egna snarlika Hadoops standardlösningar och kundsupport. Dessa två och andra analys- och Big-dataföretag (baserade på annat teknik) konkurrerar hårt i denna tillväxtmarknad.

## Vilka är de stora företagen inom Hadoop och hur tjänar de pengar?

Hortonworks och Cloudera säljer Hadoop-relaterade IT-tjänster på en prenumerationsbasis. Med andra ord är Hadoops komplexitet en affärsidé även om koden i själva verket är open source och gratis.

Vi arbetar med Hortonworks suveräna virtuella maskiner för träning och utveckling som stöd för era Hadoop-lösningar.

Vi tar gärna emot era frågor kring Hadoop eller andra parallellsystem liksom HPC _(hög prestanda datorlösningar)_ då vi även har erfarenhet av andra parallella ramverk.

/ [Mark](/mark)
