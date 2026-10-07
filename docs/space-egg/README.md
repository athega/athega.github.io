# Athega Space

Fem snabba klick (inom 2,2 sekunder) på startsidans logga, eller Konamikoden
`↑ ↑ ↓ ↓ ← → ← → B A` på valfri sida, öppnar Athega Space. Bara den lilla
triggern laddas normalt; spel, ljud och CSS laddas vid aktivering. PeerJS laddas först
när spelaren väljer Skapa rum eller Anslut.

## Kontroller och poäng

- Pilar/WASD styr skeppet, mellanslag skjuter och N skjuter blå navigationsskott.
- Mobilen har styrspak, ELD och NAV. Meny-knappen i spelet öppnar mobilmenyn.
- Vanlig eld förstör även menyn. Navigationsskott följer interna sidlänkar;
  externa länkar, e-post, nedladdningar och bloggdemon navigeras inte.
- Byt uppdrag finns alltid kvar, även om alla sidans länkar är förstörda.
  Sidan scrollar långsamt ned och upp (18 px/s) och vänder vid kanterna.
  Värden kan pausa scrollen. En helt rensad sida öppnar uppdragsväljaren.
- Länkar och små mål försvinner på en träff, textblock på två, H2-rubriker på tre
  och huvudrubriker/bilder på fyra. Skadan syns som urtag, toning och splitter.
  Poäng och powerups ges först när objektet är helt förstört.
- Täta träffar inom två sekunder bygger upp till ×5 kombopoäng. Snabbare
  sidrensning ger större tidsbonus (75 per mål minus 15 per sekund, minst 0).
- Var tredje förstört objekt släpper en powerup. Flyg nära för att plocka upp den:
  3X/trippelskott och RF/snabbeld (12 s), SK/sköld och T/turbo (10 s),
  +/reparation (+40 skrov), G↓/gravitation och S↕/snabbscroll (8 s).
  Gravitation och snabbscroll påverkar hela rummet; snabbscroll ökar till 72 px/s.
  Alla får olika startsignaler för effekterna och en kort slutsignal. Ljud av gäller
  även dessa signaler. Skeppsträffar visar ljusblixt, träffring och skada/skydd.
  Övriga powerups gäller den egna piloten.
- Under **Spelregler** kan värden slå på friendly fire och kollisionsskador.
  Båda är av från början och kan ändras under spelet. Skepp studsar även mot
  varandra när kollisionsregeln är på; sköld skyddar mot skada men stoppar inte
  studsen. Skeppet har 100 skrov;
  skott ger 20 skada och kollisioner 25. Kort skydd efter träff förhindrar skada
  varje bildruta. Vid noll skrov återkommer skeppet efter 3 s med 3 s skydd.
- Mörkt/Ljust växlar tillfälligt spelläge. Mörkt läge har stjärnor och nebulosa.
  Ljud kan stängas av. Reducerad rörelse ger stilla stjärnor, enklare toning och
  färre partiklar utan explosionsringar.
- Esc/Avsluta återställer sidan. Efter virtuella sidbyten laddas den aktuella
  destinationen om till den vanliga sajten, med rätt metadata och normala skript.


## Minor och bomber

Plocka upp **MIN** eller **BOM** från förstörda objekt. **M** placerar en mina,
**B** släpper en bomb; samma knappar finns på skärmen för touch.
Du kan bära tre av varje och ha högst tre av varje utplacerade samtidigt.

- Minan aktiveras efter 0,6 sekunder och exploderar när ett annat levande skepp
  kommer inom 60 pixlar. Ägaren kan varken utlösa minan eller skadas av den.
- Bomben exploderar efter en sekund och kan skada även den som släppte den.
- Friendly fire styr skadan på andra piloter. Sköld och respawnskydd gäller.
- Minor ger 60 skada inom 95 pixlar och bomber 80 inom 150 pixlar.
  Sidobjekt i explosionen tar två respektive tre träffar.
- Värden bestämmer ammunition, utplacering, utlösning och träffade piloter.
  Alla ser explosionerna. Självsprängning ger ingen kill.
- Ammunitionen försvinner vid krasch. Utplacerade vapen försvinner vid sidbyte,
  och en ny rond nollställer både ammunition och utplacerade vapen.

Vanliga besökare laddar bara den lilla `trigger.js`, som också skriver en diskret
ledtråd i konsolen. Spelkod, spelstilar och ljud skapas först vid aktivering.
PeerJS laddas först när man skapar eller ansluter till ett rum.

## Ronder och vinnare

En rond varar **120 sekunder** från start, även över sidbyten och öppna menyer.
Flest kills vinner; lika många ger delad seger. En kill ges till skytten när
kompisskeppets skrov når noll. Krasch mot sidan eller ett annat skepp ger ett
dödsfall men ingen kill. Skeppets explosion syns och hörs hos alla.
Värden samordnar kills, dödsfall och slutresultat. Vid 0:00 stannar spelet och
visar resultatlistan. Värden kan sedan ta alla tillbaka till lobbyn för en ny rond;
skrov, objektskador, powerups och poäng återställs. Solo har också en tvåminutersrond.

## Upp till fyra spelare med en inbjudningslänk

1. Aktivera spelet och välj **Spela tillsammans**. Skriv ett valfritt pilotnamn.
2. Välj **Skapa rum**, sedan **Kopiera inbjudningslänk**. Skicka samma länk till
   upp till tre kompisar och håll spelet öppet.
3. Kompisarna öppnar länken, skriver sina pilotnamn och väljer **Anslut**.
   Alla väntar i lobbyn tills värden klickar **Starta spelet**. En sen anslutning
   till en redan startad rond följer den pågående matchen.
   Ingen svarskod behövs. Lobbyn visar besättningen, värden och lediga platser.
   Namnen visas också vid skeppen och i spelarlistan.
4. Inbjudningslänken använder alltid startsidan. Efter anslutning följer gästen
   värdens aktuella sida, även om rummet skapades på exempelvis bloggarkivet.
   Äldre länkar med en undersida normaliseras till lobbyn automatiskt.

Alla behöver samma version av sajten på samma origin (protokoll, värd och port).
Lokalt kan flera fönster använda samma localhost-adress; den adressen fungerar
inte på kompisens dator. För spel mellan datorer behöver sajten vara publicerad.

PeerJS 1.5.5 serveras från sajten och använder kostnadsfria PeerJS Cloud för att
koppla ihop spelarna. Inbjudan öppnar spellobbyn, men varken PeerJS eller
anslutningstjänsten kontaktas förrän spelaren väljer Skapa rum eller Anslut.
STUN (`stun.cloudflare.com:3478`) hjälper webbläsarna hitta en nätverksväg.
WebRTC DataChannel skickar speldata mellan webbläsarna; värden vidarebefordrar
kompisarnas positioner och skott. Ingen kamera eller mikrofon används.
Det egna pilotnamnet sparas i webbläsarens localStorage och fylls i vid nästa
spel eller inbjudan. Töm namnfältet för att glömma det sparade namnet. Om lagring
är blockerad går det fortfarande att spela. Namnet delas med deltagarna och
ingår också i signaleringen.

Det finns ingen TURN-reläserver: vissa företagsnät och mobilnät kan därför inte
koppla ihop sig. Vid misslyckad anslutning går det att försöka igen eller byta
nätverk. Inbjudan gäller medan värden är ansluten. När en gäst lämnar frigörs
platsen; om värden lämnar fortsätter övriga i sololäge.

Värden avgör gemensamma träffar och poäng och synkroniserar förstörda objekt med
stabila index plus en innehållssignatur. Alla spelar i en gemensam layout på
1280 × 800. På mindre skärmar följer kameran skeppet, medan kontrollerna behåller
sin storlek. Radar och kantmarkörer visar kompisar utanför bilden. Den vanliga
sidan ligger kvar orörd bakom spelvyn och återkommer när spelet avslutas.
Värden styr scroll, regler och gemensamma powerup-effekter. Skeppsträffar skickas
via värden, som kontrollerar skottets ägare, livslängd och friendly fire-regeln.
Den träffade klienten tillämpar sköld/skrov och skickar träffeffekten till alla;
sidkollisioner räknas lokalt i den gemensamma geometrin.
Sidbyten hämtar statiskt sidinnehåll utan att starta om spelet eller WebRTC.
Detta är en lekfull co-op-prototyp, inte ett tävlingsläge med skydd mot fusk.

## Kodens ansvar och isolering

Vanliga sidan inkluderar endast `trigger.js`. Den känner igen aktivering och
skriver konsolhälsningen. Inga spelstilar, ljud, iframe, PeerJS eller
signalering laddas innan aktivering. Escape kan avbryta en pågående uppstart.
Misslyckad uppstart städar upp det som skapats och lämnar sidan användbar.

| Modul | Ansvar |
| --- | --- |
| `trigger.js` | Aktivering, inbjudningsfragment och dynamisk import |
| `arena.js` | Separat sandboxad iframe och gemensam spelgeometri |
| `view.js`, `game.css` | Shadow DOM-gränssnitt och speltema |
| `rendering.js`, `sound.js` | Ritfunktioner och syntetiserat ljud |
| `game.js` | Spelloop, lokal pilot, sidobjekt och samordning av livscykeln |
| `multiplayer.js` | PeerJS, anslutningar, besättning och vidarebefordran |
| `protocol.js` | Tillåtna meddelanderiktningar och matchning av rond/sidrevision |
| `ordnance.js` | Ammunition, minor, bomber och värdens explosionsbeslut |
| `physics.js`, `combat.js`, `targets.js`, `round.js`, `scoring.js` | Spelregler och beräkningar |
| `navigation.js`, `invitation.js` | Tillåtna sidlänkar och inbjudningar |

Värden beslutar om sidobjekt, gemensamma effekter, ammunition och rondresultat.
Varje klient simulerar sitt skepp och tillämpar skrov/sköld. Transporten skiljer
piloternas anrop från värdens beslut. Varje spelmeddelande har rondnummer,
sidrevision och URL, så gamla träffar inte påverkar en ny rond eller ett återbesök.
En ny anslutning ogiltigförklarar köade meddelanden från föregående anslutning.

Positioner får hoppas över vid köbildning. Skador, explosioner och övergångar
får inte tappas tyst; vid för stor kö stängs anslutningen i stället. Menyer
släpper styrningen men pausar inte den pågående matchen. Tidbonus, skydd och
respawn räknar verklig tid. Håll värdens flik aktiv: webbläsarens begränsning av
bakgrundsflikar kan ändå bromsa fysik och scroll. Rondklockan fortsätter gå.

Den vanliga sidans DOM förstörs aldrig. Spelskalet gör den tillfälligt inert;
städningen återställer tidigare inert-värden, fokus och scroll, tar bort iframe
samt avslutar händelselyssnare, timers, ljud och nätverksanslutningar.
Den äldre `assets/site.js` används inte. Vid ändring av redan publicerade
spelmoduler behöver versionsparametrarna på deras import-/resurslänkar uppdateras.

## Regressionstester

`npm test` kör spelregler och transporttester med en lokal PeerJS-testdubbel,
utan kontakt med signaleringstjänsten. `npm run build`, `npm run check` och
`npm run check:urls` kontrollerar den statiska sajten.

Två valfria browsertester ligger i `scripts/`. Installera Python-paketet
`playwright` och Chromium i en separat testmiljö. Kör mot en redan startad server:

```sh
python scripts/space-browser-smoke.py http://localhost:8082/
python scripts/space-browser-multiplayer.py http://localhost:8082/
```

Smoke-testet kontrollerar mobil/desktop, lazy loading, upprepad öppning/stängning
och misslyckad CSS-laddning. Multiplayer-testet använder riktiga WebRTC-klienter
och kräver tillgång till PeerJS Cloud. Det kontrollerar väntelobby, gamla
rond-/sidmeddelanden, navigering, kills, vinnare och omstart. Testkrokar injiceras
endast i webbläsarens testsvar; de ingår inte i publicerad spelkod.
`PLAYWRIGHT_CHROMIUM_EXECUTABLE` kan ange en befintlig Chromium-installation.
