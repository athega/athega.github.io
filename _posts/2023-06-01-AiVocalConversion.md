---
title: "Generativa AI-modeller för att konvertera röster"
date: 2021-06-01
description: "Generativa AI-modeller för att konvertera röster"
tags:
  - nyhetsbrev
  - blogg
 
last_updated_by: Mats
image_url: /assets/blog/Entropy-GrimesAI-Zymbsmall.png
---

**Vi gör ett roligt sommar-experiment, med en egentränad modell som konverterar röster**

Vi på Athega gillar att laborera och testa nya tekniker. I april skrev artisten Grimes på instagram att hon uppmuntrade folk att använda
AI-lsningar för att återskapa hennes röst och släppa låtar med GrimesAI som ett samarbete. Vi hakade direkt på eftersom vi älskar musik
och ny teknik! Vi satte igång rätt omgående.

<img src="/assets/blog/Entropy-GrimesAI-Zymbsmall.png"/>

Det började med att vi fick tillgång till flera Grimes DAW-projekt där hennes röst fanns i ett antal tagningar. Tyvärr var flera av låtarna Stem-bouncade med effekter så en stor del av träningsdatat gick inte att använda.

Vi tränade modell som skulle hitta hennes features för att senare kunna återskapa klang och röst. 
Eftersom träningsdatan inte var inte omfattande blev resultatet inte så bra vi hade önskat men vi l
yckades konvertera våra inspelade sång-spår till hennes röst.

Tekniken går ut på att modellen tränas på så sätt att den efteråt kan återskapa features baserat på ingående pitch och inkommande features.
Går att jämföra det med ett filter som "filtrerar" vilken röst som helst till att låta som den röst som används för att träna modellen. Med skillnaden att 
rösten som kommer ut, helt skapas av modellen. Inget av inkommade ljud skickas vidare.

Det var ett spännande projekt och låten vi skapade (projektlåten "Entropy") finns på alla streaming-tjänster. Här är ett litet smakprov på hur vår sång lät och hur modellen omvandlade ljudet till en kvinnlig röst. (Ligger reverb på det konverterade spåret)
<video width="400" height="340" controls>
  <source src="/assets/blog/AI.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

