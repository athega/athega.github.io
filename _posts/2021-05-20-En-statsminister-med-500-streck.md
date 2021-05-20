---
title: "En statsminister med 500 streck"
date: 2021-05-20
description: "Reinforcement Learning ett nytt verktyg för optimering och styrning"
tags:
  - nyhetsbrev
  - blogg
 
last_updated_by: Torbjörn
image_url: /assets/blog/2019-stefan_500_streck.jpg
---

**Reinforcement Learning ett nytt verktyg för optimering och styrning**

<figure style="float: right; clear: right; margin: 1em 0 1em 1em; max-width: 256px;">
<img src="/assets/blog/2019-stefan_500_streck.jpg" alt="Stefan 500 streck">
</figure>

Innan påsken höll jag en presentation om Reinforcement Learning (RL) på Luleå Science park. Kanske inte helt oväntat så föll jag ner i många djupa hål på Wikipedia under arbetet med att sammanställa materialet och kanske helt väntat så rymdes inte ens bråkdel i presentationen. 

Jag kommer därför i en serie bloggartiklar presentera några av de mest relevanta delarna av presentationen. I den här första delen tänkte jag börja med att beskriva vad som gör RL unik bland alla de otroliga framsteg som gjorts inom AI-teknik de senaste 10 åren. Samtidigt som jag ogenerat tar mig generösa friheter att generalisera och hoppa över detaljer för att åstadkomma ett lättläst bloggformat.

De flesta andra tekniker som fått genomslag är en slags mappning mellan två domäner. Resultaten presenteras ofta som bilder, ibland ansikten och det är lätt att tro att forskningen mest intresserar sig för bilder. Till viss del har det att göra med att datasamlingar av bilder varit tillgängliga under många år men jag tror att den främsta anledningen är att bilder är tacksamma när forskning ska publiceras. Ofta spelar det inte så stor roll vilken typ data som används, oavsett hur vi människor väljer att tolka den, givet förstås att strukturen i datat lämpar sig för ‘convolutional filters’ eller faltning som det heter på svenska.

Det är inte alltid lätt att förstå vilka praktiska tillämpningar ny teknik har. Teknik som kan generera fotorealistiska ansikten har använts för att ersätta Geometric Brownian Motion (GBM)  vid värdering av optioner, anonymisera datasamlingar till att argumentera och förbättra träningsdata. Men i slutändan är de just en mappning mellan två domäner, data in, svar ut – och ibland vice versa.

<img src="/assets/blog/2021-cyclegan_horse2zebra.gif" alt="CycleGAN" style="width:100%">
<small>CycleGAN, en klassiker, som ersatts med nyare och bättre algoritmer under åren.</small>

Så om vi vill mappa exempelvis partisymboler till partiledare så krävs ett par exempel och några minuters träning.

<img src="/assets/blog/2021-face_to_logo.gif" alt="FaceToSymbol" style="width:100%">
<small>Träning av modell för att koppla partisymbol till partiledare och vice versa</small>

Om vi önskar översätta partiledare till partisymbol kan det vara lämpligt att flera ansikten mappar till samma symbol så även tidigare partiledare leder till samma partisymbol.

<img src="/assets/blog/2021-v_ledare.png" alt="V-ledare" style="width:100%">

Det här är helt enkelt en mappning eller översättning mellan två domäner. En teknik som fått utstå negativ press under namnet ‘deep fakes’. Men samtidigt en arkitektur som är väldigt användbar för att översätta en typ av data till en annan. Det behöver inte alltid vara bilder – kan t.ex. vara text in, bild ut eller bild in, text ut. 
Som med alla system behöver man dock planera för vad som händer som systemet oväntat ser ny data.

<img src="/assets/blog/2021-v_sd_fi_mix.png" alt="Mix" style="width:100%"> 

Det är väldigt frestande att nu gå vidare och titta på pix2pix, en översättningsteknik som krävde att man på förhand skapade datapar, till CycleGAN som i sin tur automatiskt gör detta, till contrastive-unpaired-translation (CUT), som gör samma sak fast snabbare och bättre. Men det kräver nog bättre sin rätt och plats i eget blogginlägg i framtiden.

Så vad är då den stora skillnaden? – Vad är det som gör Reinforcement Learning till nästa stora AI-revolution?

Reinforcement Learning är en teknik som används när flera beslut ska tas i följd och vi är intresserade av att ta de bästa besluten för att långsiktigt nå ett slags optimalt utfall.

Tänk att vi vill måla en statsminister med så få streck som möjligt. Varje streck vi ritar måste bidra så mycket som möjligt till slutprodukten samtidigt som det också hjälper efterföljande streck att bidra till målet. Problemet är inte längre – ‘vilket streck är bäst att rita just nu’ utan snarare, ‘vilket streck ska ritas nu för att få ett så bra porträtt som möjligt i slutändan’. Här är ett exempel på vår nuvarande statsminister som skapas av 500 streck. 

<figure style="float: right; clear: right; margin: 1em 0 1em 1em; max-width: 256px;">
<img src="/assets/blog/2021-stefan_nocrop_slow.mp4.gif" alt="Stefan"> 
</figure>

Algoritmen (bilden till höger) ritar ett streck i taget. Den kan välja tjocklek på pensel, färg och mellan vilka två punkter strecket ritas. För att efterlikna målning av en riktig tavla så tillåts även att färgen som används är delvis genomskinlig. 

Lite som schack alltså, det gäller inte bara att ta motspelarens pjäser när möjligheten finns, utan att spela långsiktigt och strategiskt om målet är att vinna.

Reinforcement Learning, i sin moderna tappning har funnits många år. Redan 2013 publicerade DeepMind att de lyckats spela ett atari-spel med Deep Q Networks, en typ av Reinforcement Learning. Sedan dess har tekniken haft många upp- och nedgångar, en höjdpunkt var när världsmästaren i GO slogs av en dator för första gången 2016 men det har svängt mellan skyhöga förväntningar och förtvivlan flera gånger sedan dess. Idag är RL en relativt mogen teknik vilket upplevs, inte bara av stabilare algoritmer som är lättare att tämja, utan också det faktum att många traditionella system redan har börjat bytas ut. Vem vill inte delegera vissa beslut till en strateg som överträffar en världsmästare?

De flesta processer i verkliga livet är just beslutskedjor och orsakssamband, vilka är mycket svåra att optimera med traditionella verktyg. Beslutkedjor – ja det låter både lite stelt och överdrivet formellt. Vad det handlar om är förlopp där det finns fördröjningar, beroenden och flera beslut ska fattas i en följd. Fortfarande formellt men bästa analogen jag kommer på är att  det kallas verkliga livet och för att inte klanta till det krävs ofta erfarenhet. RL är en teknik för att ta dessa beslut för att uppnå ett visst mål och ett bra utfall. 

I den här serien av artiklar tänker jag visa hur Reinforcement Learning kan appliceras som optimering på kombinatoriska problem, reglersystem och för att ta fram optimerad affärslogik.

Tack så länge!

Krister Söderström

<img src="/assets/blog/2021-athega_streck_logo.gif" alt="Athega-streck-logo"> 

