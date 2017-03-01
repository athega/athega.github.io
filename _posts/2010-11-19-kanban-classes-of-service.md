---
title: "Kanban - Classes of Service"
date: 2010-11-19
last_updated_by: admin
---
Jag arbetar just nu med ett IT-förvaltnings-team där vi kör Kanban. Med en Kanban-tavla visualiserar vi arbetet och identifierar potentiella flaskhalsar. Vi arbetar löpande med problem, orsak och förbättring. Vi har den senaste tiden börjat arbeta med klasser på aktiviteter/tjänster.

Vi arbetar frekvent och övervägande med saker som har fasta leveransdatum. Vissa gånger har det stor betydelse för hela verksamheten att vi håller leveransdatum. Andra gånger är det snarare önskvärt från beställaren att det är klart ett visst datum. På en tavla med en stor och dynamisk backlog kan det vara svårt för beställare att prioritera när de måste hålla reda på alla leveransdatum och samtidigt hur viktiga det är att datumet hålls.

<strong>Kostnad</strong>
Vi tittar på vad kostnaden blir om vi inte levererar till utsatt datum. Kommer det kosta väldigt mycket eller finns det lite utrymme för justering av planerad leverans. För att tydliggöra detta använder vi nedan klassificeringar (Baserade på David J Anderson beskrivning av Classes Of Service) Vi har fritt översatt vissa ord och gjort en anpassning som passar oss.
<ul><li><strong>UTFÖR</strong>
Först och främst har en en utför-klass. Aktiviteter som klassas som utför ska påbörjas så fort som möjligt och vi ska lägga så mycket resurser vi behöver för att på snabbast möjliga sätt ta aktiviteten i mål. Vi har inte många men när dom kommer kan det handla om produktionsstörningar som gör att verksamheten inte kan utföra sitt arbete. Dessa rör sig i en prioriterad fil på tavlan. Går ej att planera, måste utföras direkt när dom dyker upp.</li>
<li><strong>KRITISKT DATUM</strong>
Sen har vi aktiviteter som har ett kritiskt leveransdatum. Dessa aktiviteter har hög affärspåverkan om vi inte håller leveransen. Dessa aktiviteter är UTFÖR-aktiviteter men med skillnaden att leverandatum är i framtiden. Behöver inte påbörjas direkt. Går att planera.</li>
<li><strong>FAST DATUM</strong>
Aktiviteter där affärspåverkan om vi bryter leveransdatumet blir ringa klassas som FAST DATUM. Dessa har ett tydligt leveransdatum men ofta hänger leveransdatumet mer ihop med planerade releaser än stora kostnader för verksamheten. Vi har möjlighet att i värsta fall skjuta på leveransen av dessa en kortare tid.</li>
<li><strong>STANDARD</strong>
Detta är aktiviteter som ska göras men det finns inget datum då dom måste vara klara. Alla tjänar på att göra dom så fort som möjligt men dom har inget fast leveransdatum. Det kan till exempel vara förebyggande aktiviteter för att sänka risker eller förenkla/effektivisera arbetet.</li></ul>
Hur får vi standardaktiviteter att bli utförda om det hela tiden beställs fasta och kritiska-datum-aktiviteter? Att sätta begränsning i hur mycket arbete som får pågå samtidigt är ett sätt. När pågående arbete(WIP) begränsas kan detta ske per klass. T.ex. sätter vi WIP-Limit (Begränsningen av hur många aktiviteter som får vara påbörjade samtidigt) olika för de olika klasserna.

### Exempel

- WIP-Limit 1 10% - UTFÖR
- WIP-Limit 4 40% - KRITISKA DATUM
- WIP-Limit 4 40% - FAST DATUM
- WIP-Limit 1 10% - STANDARD

Det innebär att när vi planerar aktiviteter tar vi automatiskt in STANDARD-aktiviteter när WIP-Limit för de övriga är fylld. Vi kan även procentuellt styra hur mycket aktiviteter vi måste arbeta med som är standard genom att justera WIP-Limit. Har vi en stor mängd förbättringsåtgärder som verkligen behöver göras kanske nedan fördelning gör att vi får mer av dessa proaktiva aktiviteter genomförda.

<ul>
  <li>WIP-Limit 1 10% - UTFÖR</li>
  <li>WIP-Limit 2 20% - KRITISKA DATUM</li>
  <li>WIP-Limit 2 20% - FAST DATUM</li>
  <li>WIP-Limit 5 50% - STANDARD</li>
</ul>

Så länge vi är noga med att vår totala arbetsbelastningen ligger justerad/med marginal efter vår förmåga att leverera har vi har möjlighet att göra klart aktiviteter i stället för att bara påbörja nya hela tiden. Då håller vi våra cykel-tider inom förväntade och uppskattade värden. Vi försöker nu noggrant klassificera allt samtidigt som vi diskuterar med beställare och beskriver våra klassers cykel-tider.  Det hoppas vi gör vår leveranskapacitet tydligare och lättare att förstå.

// [[Mats]]
