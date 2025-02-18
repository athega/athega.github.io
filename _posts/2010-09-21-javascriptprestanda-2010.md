---
title: "JavaScriptprestanda 2010"
date: 2010-09-21
last_updated_by: johan
---
Förra hösten skrev jag ett <a href="https://johanberonius.github.io/sudokusolver/" target="_blank">program som löser Sudokus</a> och körde det som ett enkelt <a href="http://blogg.athega.se/2009/10/01/javascriptprestanda/">benchmark-test av javascriptprestandan</a> i de olika webbläsarna.

Nu har jag uppdaterat testresultatet för senaste versionen av de vanligaste webbläsarna och man kan lugnt konstatera att det hänt en hel del på javascriptfronten det senaste året.
Testet jag körde är samma <a href="https://johanberonius.github.io/sudokusolver/#CzCJYmBdUXEZADK9UgmAjgFszJIhc" target="_blank">Sudoku-kombination</a> som förra gången. Tiden det tar att räkna fram alla möjliga lösningar på just min dator jämförs med tiden det tog i den version av respektive webbläsare som var aktuell för ett år sedan.

Internet Explorer står för den överlägset största förbättringen och är verkligen med i matchen nu. Opera har gjort ett rejält ryck och kapat sin tid till en bråkdel. Firefox har förbättrat sin tid lite men har ändå helt plötsligt hamnat efter de andra. Chrome och Safari har putsat mer marginellt på sina redan låga tider.

<a href="https://johanberonius.github.io/sudokusolver/#CzCJYmBdUXEZADK9UgmAjgFszJIhc" target="_blank"><img class="aligncenter size-full wp-image-755" alt="Tid för att lösa ett Sudoku med JavaScript i olika webbläsare" src="/assets/legacy/uploads/2010/09/jsgraph2010.png" width="680" height="463" /></a>

<em>Uppdatering:</em> Grafen ovan är kompletterad med värden för senaste betan av Firefox 4, beta 6, där man kan se att hastigheten tagit ett litet steg tillbaka. Däremot verkar det vara bra saker på gång eftersom den senaste "nightly", beta 7 pre, visar att de klippt över hälften på tiden och hamnar på par med Chrome.

<a href="https://johanberonius.github.io/sudokusolver/#CzCJYmBdUXEZADK9UgmAjgFszJIhc" target="_blank"><img class="aligncenter size-full wp-image-755" alt="Tid för att lösa ett Sudoku med JavaScript i olika webbläsare på OSX" src="/assets/legacy/uploads/2010/09/jsgraph-osx.png" width="600" height="463" /></a>

På Mac OSX ser det ut så här. Där skiljer ingenting mellan Firefox 3.6 och Firefox 4.0 beta 6. Men "nightly" beta 7 pre knappar in på sina fortfarande snabbare konkurrenter. Framförallt Chrome 6 imponerar stort med bara en halv sekund.

<a href="https://johanberonius.github.io/sudokusolver/#CzCJYmBdUXEZADK9UgmAjgFszJIhc" target="_blank"><img class="aligncenter size-full wp-image-755" alt="Tid för att lösa ett Sudoku med JavaScript i olika webbläsare på olika mobiltelefoner" src="/assets/legacy/uploads/2010/09/jsgraph-mobile.png" width="500" height="463" /></a>

På mobiltelefoner går det förstås inte lika snabbt. Här blir det inte heller så mycket en jämförelse mellan olika webbläsare utan mellan olika mobilplattformar och dess hårdvara. Det kan ändå ge en liten uppfattning vad man har för javascriptprestanda att tillgå när man utvecklar webbapplikationer för en mobil jämfört med en fullstor webbläsare.
Om du klickar på grafen och kör detta test på din mobil, skriv gärna resultatet som en tweet.

/ [Johan](/johan)
