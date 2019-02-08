---
title: "UR delar med sig med hjälp av WOA-teknik"
date: 2009-12-03
last_updated_by: peter
---
<img class="size-full wp-image-527 alignleft" title="ur" src="/assets/legacy/uploads/2009/12/ur2.jpg" alt="ur" width="142" height="142" />

Användandet av Web Oriented Architecture (WOA) med hjälp av lättviktiga APIer (gränssnitt) gör det möjligt att kombinera och samköra information från olika leverantörer och därigenom skapa nya tjänster och applikationer. Tekniken innebär nya affärsmöjligheter för företag som vågar tänka annorlunda, men ställer samtidigt nya krav på öppenhet av strategisk information.

Utbildningsradion har med hjälp av IT-konsultbolaget Athega möjliggjort för landets AV-centraler att via lättviktiga gränssnitt nå information om URs alla produktioner. För att göra detta krävdes ett strategiskt beslut om hur informationen bäst och framtidssäkert skulle göras tillgänglig. Valet blev att använda webbaserade APIer och på så sätt låta AV-centralerna få tillgång till informationen, direkt från huvudsystemet.

> Athega har varit en samarbetspartner under många år och drivit utvecklingen av
> URs IT-tjänster och uppbyggnaden av ett flertal projekt inom UR. När vi presenterade
> en önskan om att utveckla en tjänst som skulle underlätta hanteringen av informationen
> visade de på en rad innovativa lösningar på upplägget.
>
> #### Utbildningsradion AB

URs programinnehåll, metadata kring produkterna och tablådata för alla radio- och TV-program från URs sändningsplaneringssystem, blir webbtjänster som finns tillgängliga publikt på internet. Det gynnar AV-centralerna som nu kan inkludera informationen i sina egna applikationer via lättviktiga APIer. Detta gör det även möjligt för utvecklare att ta fram nya tjänster kring URs produktdata.

Det här tillvägagångssättet skiljer sig avsevärt mot tidigare då uppdateringar skedde på mottagarens eget initiativ, ofta via tungrodda, specialutvecklade exportformat. Import och export av data tog tid och det var svårt för AV-centralerna att alltid presentera aktuell information. Integration mellan de olika AV-centralerna krävde även anpassningar av URs system.

Lösningen blev att webbtjänsterna levererar information i ett eller flera format beroende av tjänst. AV-centralerna väljer själva om de vill hämta informationen som JSON, XML eller kanske IMS. JSON (JavaScript Object Notation) är speciellt intressant eftersom det är ett lättviktigt format för datautbyte som är enkelt att läsa och skriva för både människor och datorer. Dessutom kan det användas direkt i en webbläsare med JavaScript.

AV-centralerna, som bland annat distribuerar utbildningsmaterial till landets skolor och som traditionellt uppdaterat informationen på egen hand, får nu direkt tillgång till URs information. Flera AV-centraler har utöver UR en mängd andra leverantörer. Att UR nu erbjuder AV-centralerna sin information på detta öppna och standardiserade sätt borgar för att även andra innehållsleverantörer följer efter. I slutändan kanske AV-centralerna inte behöver uppdatera sina egna databaser varken manuellt eller via importer. Informationen kan istället hämtas direkt från källan, utan fördröjningar.

> Att utveckla generella, lättanvända webbgränssnitt mot interna system ger exempelvis
> möjligheter att anpassa information olika för olika mottagare. Det blir lättare samköra
> information från flera system och att snabbt ta ut den information som behövs för stunden.
> 
> #### Peter Hellberg, utvecklare på Athega

UR har i samarbete med Athega sedan tidigare utvecklat informationssystemet Infokuben med den samlade informationen från URs olika plattformar och system. Istället för att AV-centralerna ska uppdatera en egen databas med UR-program finns nu informationen direkt tillgänglig och korrekt uppdaterad via URs nyutvecklade sökfunktion. Mot sökfunktionen, som även finns tillgänglig via ett enkelt API, finns dessutom en generell, lättviktig klient skriven i Ruby on Rails. Den kraftfulla sökfunktionen returnerar ett resultat med information som kan kombineras från flera källor, exempelvis rättighetshantering, programtablåer och programinformation.

> Tekniken ställer nya krav på företagen att anpassa sig till ett nytt företagsklimat.
> Den som inte anpassar sig riskerar att bli frånkörd i framtiden. Tekniken öppnar upp
> för många möjligheter, men svårigheterna har visat sig framförallt finnas i styrelserummen.
> Det är ibland svårt att motivera en företagsledning att dela med sig av den värdefulla
> informationen och därigenom faktiskt även släppa kontrollen över hur den används.
>
> #### Christian Lizell, VD på Athega

I de fall informationen inte kan släppas helt fritt kan man med hjälp av autentiseringsnycklar begränsa vem som kan använda sig av tjänsten. Gränssnittet hanterar vilken information ett system har åtkomst till och hur den får användas.

Peter Hellberg ger även exempel på framtida användningsområden:

> En av de mer direkta och konkreta möjligheterna är naturligtvis för produktföretag
> att exponera hela eller delar av sina produktkataloger som fritt kan infogas i
> nya applikationer, skräddarsydda för nya målgrupper, i Facebook-sidor,
> specialiserade forum eller webbshoppar.

Genom att öppna upp sig på detta sätt har nu UR fått möjligheter att nå ut med korrekt information, snabbare, säkrare och till fler mottagare. Den enda insats som behövs är att hålla informationen uppdaterad, vilket ju redan görs.
