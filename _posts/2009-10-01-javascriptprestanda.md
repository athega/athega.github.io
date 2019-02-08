---
title: "JavaScriptprestanda"
date: 2009-10-01
last_updated_by: johan
---
För moderna webbapplikationer där en större del av koden körs i webbläsaren blir det allt viktigare med bra prestanda för exekvering av JavaScript.
För att kontrollera text i formulärfält och liknande simpla uppgifter är inte hastigheten så avgörande, men vad händer om man försöker köra tyngre beräkningar? För att göra ett benchmark som testar prestandan i de vanligaste webbläsarna har jag skrivit ett <a href="https://johanberonius.github.io/sudokusolver/" target="_blank">program som löser Sudokus</a>.

<a href="https://johanberonius.github.io/sudokusolver/" target="_blank"><img class="aligncenter size-full wp-image-452" src="/assets/legacy/uploads/2009/10/sudoku1.png" alt="Ett program som löser Sudoku med JavaScript" width="190" height="184" /></a>

För att jämföra de olika webbläsarna har jag kört <a href="https://johanberonius.github.io/sudokusolver/#CzCJYmBdUXEZADK9UgmAjgFszJIhc" target="_blank">denna Sudoku-kombination</a> och jämfört tiden det tar att räkna fram alla möjliga lösningar på just min dator. Resultatet är ganska häpnadsväckande, som ni kan se i grafen nedan så utklassar Safari Internet Explorer med nästan en faktor på tio-till-ett. Chrome hamnar inte långt efter och både Firefox och Opera placerar sig hyffsat bra. Och då används inte ens Web Worker-trådar som har visat sig ha potential att dubbla prestandan och ytterligare öka försprånget för alla andra webbläsare framför Internet Explorer.

<a href="https://johanberonius.github.io/sudokusolver/#CzCJYmBdUXEZADK9UgmAjgFszJIhc" target="_blank"><img class="size-full wp-image-453" src="/assets/legacy/uploads/2009/10/jsgraph.png" alt="Tid för att lösa ett Sudoku med JavaScript i olika webbläsare" width="600" height="463" /></a>

// [Johan](/johan)
