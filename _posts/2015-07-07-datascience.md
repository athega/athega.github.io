---
layout: post
title: Data Science och artificiella neuron-nät
date: 2015-07-07
description: Data-science, algoritmer, AI, neuronnät och tillämpningar en data scientist kan hjälpa till med.
category: Nyhetsbrev
tags: nyhetsbrev
---

> Jag tänkte skriva lite om data-science, algoritmer, AI, neuronnät och tillämpningar en data scientist kan
 hjälpa till med. Jag har fått hjälp av våra duktiga data-scientists att sätta ihop detta. //Mats

### Generella lösningar kräver både domän- och data-science expertis

Metoder och verktyg som används inom Data-science begränsas inte till specifika områden. Tekniken och
algoritmerna är de samma oavsett om det är finansiellt data, besöksstatistik eller CRM-data på försäljning.

Dock kan det vara svårt är se möjligheterna utan att vara områdesöverskridande expert inom programmering,
statistik, matematik och bransch/domän-expert.

Det går att gruppera expertisen i två delar

- Vi är experter på programmering, statistik och matematik.
- Våra kunder är domänexperter på sitt data.

### Rollen data-scientist

En Data-scientist är en utbildad matematiker som är mycket kunnig i statistiska modeller och dataanalys.
Självklart ska en data-scientist programmatiskt kunna modulera artificiella neuronnät och kluster samt veta
vilka implementationer som ger bästa lösning.

> På Athega är en Data-Scientist en senior utvecklare med högre akademisk examen i matematik och statistik.

#### Vad levererar en data-scientist?

De lösningar som en data-scientist kan hjälpa er ta fram jobbar typiskt med stora datamängder(big data) och
är effektiva verktyg för att upptäcka komplexa mönster som är svåra, omöjliga eller tidskrävande att
identifiera med mer konventionella metoder. Systemen blir ofta en blackbox-lösning för att lösa ett väldigt
specifikt problem. Systemen kan vara självlärande i mer eller mindre utsträckning och detta sker ofta på
två olika sätt.

- Återkoppling från användarna (supervised learning)
- Automatisk anpassning till varierande data (unsupervised learning/outlier detection)

Ni får systemet modulerat, testat och byggt med er expertis på det data som ska behandlas. Detta inkluderar
produktionssättning och förvaltningsetablerat på er IT-avdelning. Ni är inblandade som kravställare under
hela arbetet.

#### Exempel på användningsområden för finansiella institutioner
Försöker nedan beskriva olika tillämpningar som är mer eller mindre vedertagna.

##### Bedrägerikontroll

En finansiell institution eller bank monitorerar både kunder och transaktioner för att fånga upp misstänkta
bedrägerier tidigt. Att tidigt hitta kunder eller konton som uppförs sig ovanligt genom att använda ett
poängsystem/risksystem ger företaget eller myndigheten möjlighet att minska den mängd data som behöver
utredas manuellt. Resultatet blir ett indikations-system på potentiella problem. Poster med ovanliga
uppföranden rankas en mycket högre risk att vara ett bedrägeri än de som uppför sig som förväntat. Till
exempel kan det vara en ovanligt stor pengatransaktion.  Det är alltså det avvikande beteendet som ger
underlag för närmare utredning. Den närmare utredningen sker ofta manuellt.

<img src="/assets/img/blog/fullsizerender.jpg" alt="Data science" class="right">

För denna typ av lösningar finns en mängd verktyg tillgängliga. Alla har olika egenskaper och lämpar sig för
olika problem och kravställningar. Bayesian (efter Thomas Bayes) neurala nätverk används bland annat för att
fånga kreditkorts-bedrägerier.

Som kravställare är ett samarbete med en data-scientist ett bra sätt att komma igång. Vi börjar med att definiera
problemställningen och titta på det data som finns. Vi diskuterar hur en prototyp ska fungera. Viktigt är sedan
att det finns lämpliga rapporter, GUI eller system för feedback som passar ert sätt att arbeta. Ibland är kanske
en färdig programvara, som finns på marknaden, rätt val. Då hjälper våra data-scientists er att välja rätt.

##### Kvalitetskontroll av affärskritiskt- och regulatoriskt data

Det är både svårt och tidskrävande att avgöra om ursprungsdata från en stor mängd system är rätt. Aggregerade
rapporter ska gå till myndigheter och andra kontrollinstanser. Tidsrymden mellan att data skapas i grundsystem
till att data ska exponeras på aggregerad nivå krymper hela tiden i och med ökade krav från myndigheter.

Traditionellt finns larmsystem på specifika delar i processen, leveranser som uteblir eller körningar som
misslyckas. Denna övervakning kan vara byggd på hypoteser och specifika problem-fall där fel rapporterats
tidigare. Till exempel kan en leverans övervakas genom att en kontroll sker om fil levererats i tid. Kontroll
sker om filen går att validera osv.

###### Data science och kvalitetsmonitorering

Att använda data science och algoritmer för kvalitetsmonitorering av denna typ av data är ett spännande område
där helt andra och mer avancerad monitorering går att göra. Målet är att tidigt i data-leveransprocessen fånga
avvikande och ovanliga värden för att sedan snabbt indikera för kvalitetsansvarig var det finns potentiella problem.

Det går till exempel att låta ett neuron-nät “cruncha” data från transaktionsflöden, bokföringsrörelser,
trades, manuella inmatningar, antal och typ av systemändringar från IT, rapporter av incidenter. Kort och gott
allt man tror påverkar data-kvaliteten och som går att mäta.

Dessa system identifierar utan ansträngning komplexa mönster i enorma dataset och kan i och med detta, bottom-up,
beskriva hur stor risken är att vissa siffror avviker och bör kontrolleras manuellt. Kombinationen av den
mönsterletande algoritmen/neuro-nätverket och den seniora ekonomen med sin erfarenhet minskar arbetsbelastning
och gör det möjligt att kontrollera och verifiera siffrorna snabbare.

När verksamhetsdata inkluderas, till exempel change requests och IT-incidenter, går det att empiriskt skapa
argument för att driva IT-förändringar/förbättringar på lägre prioriterade system.

<div style="border: 0px solid #bdbdbd;
            border-radius: 15px 50px 30px 5px;
            background: #F0F0F0;
            padding: 20px;
            width: 50%;
            margin: 0 0 25px;
            font-size: 16px;
            color: Black; font-style: Italic;
            overflow: hidden;">
Vi är experter på programmering, statistik och matematik. Ni är domänexperter på ert data. Tillsammans kan vi
skapa konkurrensfördelar genom områdesöverskridande samarbeten.
</div>
