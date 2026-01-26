---
title: "AI som primär arbetsmetod"
date: 2026-01-25
draft: true
description: "Hur Ossy-teamet på SVT Nyheter bygger hela arbetssättet runt AI, med principer, flöde och kvalitet som system."
tags:
  - blogg
  - AI
  - arbetssatt
last_updated_by: chrille
image_url: /assets/blog/2026-01-25-ai-som-primar-arbetsmetod/ossy-ai-arbetssatt.png
assets_path: /assets/blog/2026-01-25-ai-som-primar-arbetsmetod
---

Innan vi pratar arbetssätt…
Vi ingår i ett litet team på SVT som bygger chatboten [Ossy](https://www.svt.se/sport/artikel/fraga-ossy-om-vinter-os) – och ramverket med samma namn som gör det möjligt att snabbt skapa nya expertbotar. Det speciella är inte bara vad vi bygger, utan hur: vi jobbar inte på ett traditionellt sätt med stora specialistroller och långa ledtider, utan med AI som primär metod genom hela kedjan.

![AI som primär arbetsmetod]({{ image_url }})

Det finns team som “använder AI ibland” och team som har byggt hela arbetssättet runt AI. I Ossy-teamet på SVT Nyheter tillhör vi den andra kategorin: **AI är inte en perifer assistent – den är vårt primära sätt att bygga, testa, designa och verifiera.** Människorna i teamet fokuserar på riktning, kvalitet, risk och omdöme.

Tre principer styr allt:

**AI är det nya – det finns ingen väg tillbaka.** När verktygen blir tillräckligt bra förändras hela arbetsmodellen. Det handlar inte om att “effektivisera lite”, utan om att jobba på ett nytt sätt.

**AI är inte läskigt – men du måste använda det rätt.** Vår upplevelse är att AI ofta gör färre slarvfel än människor, särskilt i stressade “snabbfix”-lägen. Men det betyder inte att man kan släppa ansvaret. **Bygg arbetssättet så att kvalitet och risk hanteras som en del av flödet**, inte som ett sent “granskningssteg”.

> Notera: Vi utgår inte från att allt blir perfekt eller helt hallucinationsfritt. Vi utgår från att vi behöver ett system som tål verkligheten.

**Sluta se AI som ett sidospår.** Om AI bara används som “extra hjälp” hamnar man lätt i samma gamla utvecklingsmönster. Vi gör tvärtom: vi startar i AI och bygger runt det.

## Arbetssättet i korthet

Vi är bara **tre utvecklare + en redaktionell person**. Vi har inga dedikerade UX:are, testare, AD eller DevOps-resurser. Vår modell är enkel:

- **Vi äger riktning, ansvar och omdöme**
- **AI står för produktionstakten och bredden**: kod, test, text, designunderlag, alternativ, jämförelser, refaktoreringar

Flödet ser ut ungefär så här:

1. **Idé**
2. **Promptjam** (tillsammans, högt och snabbt)
3. **Kodgenerering** (AI skriver, vi styr)
4. **Verifiering** (automatiskt + manuellt omdöme)
5. **Test**
6. **PR**
7. **Release**

Det viktiga är inte varje steg, utan *rytmen*: vi håller oss i en snabb loop där det är billigt att prova, mäta och ändra sig.

När AI gör grovjobbet sjunker tröskeln dramatiskt:

- Har du en idé? **Prova.**
- Blev det inte bra? **Kasta och prova igen.**
- Behöver vi byta approach? **Gör det osentimentalt.**

Det här skiljer sig från traditionell utveckling där man ofta “håller fast” vid en lösning eftersom man redan investerat mycket tid i den.

> Notera: Det som kan bli svårt är när AI missförstår kontexten eller arbetar utifrån gammal dokumentation. Då kan man hamna i frustrerande loopar. Vårt motdrag är att bli väldigt tydliga med kontext, krav och källor – och byta modell/verktyg när det behövs.

## Kvalitet som system

Vi jobbar inte med idén att “människan ska dubbelkolla allt AI gör”. Vi jobbar med idén att **kvalitet byggs som ett system**. Eftersom Ossy är en chatbot går det sällan att testa “exakt rätt text”. I stället använder vi:

- **Enhetstester**
- **Integrationstester**
- **LLM-judge** som bedömer om ett svar är rimligt givet frågan

Vi accepterar också att en liten del av bedömningstesterna ibland kan fallera utan att det betyder att allt är trasigt – verkligheten för generativa system ser annorlunda ut.

![Kvalitet som system]({{ assets_path }}/kvalitet-som-system.png)

Vi har flera skyddslager för att skydda boten och människorna som använder den. Det är en kombination av säkerhetsfilter, beteenderegelverk och tester.

**Review i flera led.** Vi låter olika modeller och verktyg göra review på varandras output, och kompletterar med manuell kontroll där det behövs.

## Drift, ansvar och ramverk

När man inte har ett stort stödmaskineri behöver man ett tydligt ägarskap. Teamet äger drift och incidenter, och vi har övervakning i SVTs moln (t.ex. dashboards i Grafana), separata kostnads-/användningsdashboards för modellleverantörer och notifieringar när nivåer passeras.

Och: om en modell förändras, blir sämre eller får nya begränsningar — **då byter vi**. Vi har redan gjort flera byten under projektet.

En central del i arbetssättet är att vi byggt ett ramverk för att snabbt skapa kunniga “expertbotar”. Varje bot får:

- en **persona** (röst, ton, ansvar, gränser)
- ett antal **verktyg** (t.ex. SVTs tablå/arkiv, artiklar, FAQ, livesport-resultat)
- **tester och säkerhetsfilter**

(Detaljerna i botarnas funktion är inte poängen här — poängen är att ramverket gör det billigt att skapa och iterera.)

![Ramverk för expertbotar]({{ assets_path }}/ramverk.png)

## Vad andra team kan ta med sig

Tre saker vi tror fler kan göra direkt:

1. **Gör AI till förstahandsmetod**, inte “något man får göra om man hinner”.
2. **Bygg ett flöde som gör det billigt att prova och kasta.**
3. **Lägg kvalitet i systemet** (tester, judge, review, guardrails) – inte i att en människa ska granska allt i efterhand.

Och en varning:

> Notera: Det är lätt att “bara vibea” och tappa systemtänk. För att jobba så här behöver du kunna systemutveckling och ha omdöme kring risk, gränser och konsekvenser.

## Slutsats

AI kommer inte ta våra jobb. Den kommer göra att vi kan göra **mycket mer**, **snabbare** och ofta **bättre** – om vi bygger arbetssättet för det.

/ [Chrille](/chrille)
