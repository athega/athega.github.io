# Athega · Designmanual

**Förslag 0.1 · 21 oktober 2026.** En gemensam riktning för figurer, illustrationer, färg, typografi och layout. Underlag för diskussion, inte en fastställd grafisk profil.

[Öppna hela manualen som PDF](athega-designmanual-0.1.pdf). GitHub visar PDF-filen direkt; om förhandsvisningen inte laddas går den att ladda ned därifrån.

![Scen med Athegamannen, Ada och Byte](assets/samarbete.png)

## Riktningen

Bygg vidare på alternativ 3, med mindre magasinkänsla. Låt bilderna bära personligheten och låt webbsidan vara lugn, tydlig och enkel att använda. Illustrationerna ska visa en konkret handling som hör ihop med sidans budskap.

Athega-orange **#ff6600**, företagets logotyp och sajtens texter behålls. Typografi, kompletterande färger, layout och de nya figurernas detaljer är förslag att ta ställning till.

## Tre karaktärer

Trion heter **Athegamannen, Ada och Byte**. Athegamannen följer med från [sajten från 1997](https://1997.athega.se/athega.html). Ada är uppfinnaren och Byte är hunden. Namnen är fastställda. Ada har en blinkning till Ada Lovelace; Byte förenar datorvärlden med hundens nyfikenhet.

[Läs deras berättelse på sajten](../../vara-figurer/index.md).

![Karaktärsblad med tre figurer och handlingsposer](assets/karaktarer.png)

- **Athegamannen:** originalets svarta framåtsvepta frisyr, mörka glasögon, vita dräkt och orange handskar. Bred bröstkorg, breda axlar och kraftiga armar och lår ger honom en kompakt silhuett. Proportionerna har korrigerats i både bladet och scenen efter återkoppling på det första, för smala förslaget.
- **Ada:** kopparröd hårknut, runda glasögon, vit arbetsjacka och orange scarf. Utgår från skissen Tobbe delade. Tar lika mycket initiativ som Athegamannen; båda får tänka, bygga och testa.
- **Byte:** rufsig, ljus päls med mörka fält, asymmetriska öron och orange halsband. Upptäcker det andra missar genom naturligt hundbeteende.

Alla tre behöver inte vara med i varje bild. Ansikten, hundens exakta teckning och standardposer återstår att låsa. Dräkternas triangelsymboler ersätter inte företagets logotyp.

[Se den ursprungliga Athegamannen](assets/athegamannen-original.jpg).

## Bildspråk

Ren europeisk serieteckning med tydliga bläckkonturer, begränsade plana färger och lätt skuggning. En tydlig handling per bild, luft runt motivet och få men meningsfulla detaljer. Undvik generiska kontorsmotiv, överlastade maskiner och inbakad text.

Bilderna här är **AI-genererade konceptskisser**. De visar riktningen men behöver fortsatt granskning av anatomi, uttryck och kontinuitet inför slutlig produktion. Kommande bilder ska använda samma godkända karaktärsblad och stilreferens.

## Färg och typografi

| Del            | Förslag                                     |
| -------------- | ------------------------------------------- |
| Athega-orange  | `#ff6600`, befintlig signaturfärg           |
| Text           | `#111315`, sekundär text `#363a3c`          |
| Grund          | Vitt `#ffffff` och varm neutral `#f4f2ed`   |
| Avdelare       | `#dedfdb`                                   |
| Illustrationer | Dämpad blå `#6b7f8a` som komplement         |
| Rubriker       | Georgia, fet                                |
| Brödtext       | Helvetica Neue, Segoe UI, Arial, sans-serif |

Mörk text på ljusa ytor. Fristående uppmaningar använder vita ramknappar med orange kant. Orange används som accent och som text på mörka ytor. Det innebär ett föreslaget avsteg från sajtens nuvarande orange rubrikbetoning på vitt. Logotypens färg och form ändras inte.

Rubriktypsnittet är ett förslag, inte ett beslut. HTML-manualens provsida låter er jämföra serif och sans-serif utan att ändra innehållet.

## Layout och interaktion

- Innehållsbredd upp till 1 216 px, sidmarginaler 24 px på större skärmar och 20 px på mobil.
- Avståndsskala: 8, 16, 24, 32, 48, 64 och 96 px.
- Tydlig introduktion, relevant illustration och snabb väg vidare till tjänsterna. Ingen tidningsliknande sidindelning.
- Kort får orange understrykning vid hovring och tangentbordsfokus, utan pilikoner.
- Diskreta övergångar på 150–250 ms, synligt tangentbordsfokus och stöd för minskad rörelse. Ingen styrning av besökarens scrollning.
- Nya bilder planeras för sin placering och mobilversion. De befintliga 3:2-skisserna visas utan att figurer kapas.

PDF-manualen innehåller även typografisk skala, skisser för sidstruktur, komponentexempel, produktionsregler och öppna beslut.

## Prova den interaktiva manualen lokalt

Öppna `docs/designmanual/index.html` från en lokal kopia av den här branchen. På macOS, från repots rot:

```sh
open docs/designmanual/index.html
```

Ingen installation eller server behövs. På avsnittet **Layout** går det att växla mellan mobil och större vy samt mellan två rubriktypsnitt. GitHub visar HTML-källan, men kör inte den interaktiva sidan i sin filförhandsvisning.

## Filer och fortsatt arbete

- [Hela manualen, PDF](athega-designmanual-0.1.pdf)
- [Interaktiv manual, HTML-källa](index.html)
- [Provsida, HTML-källa](preview.html)
- [Bildbrief att återanvända](bildbrief.txt)
- [Sammanfattade genereringsinstruktioner](genereringsprompter.txt)
- [Färger och grundvärden i CSS](tokens.css)

Riktningen provas nu på startsidan, tjänste- och företagssidorna, personalsidorna och bloggöversikten i samma PR. Bloggposternas innehåll och mallar är oförändrade. Kör `npm ci` och `npm start` från repots rot för att prova sajten. Själva manualen ligger separat och är undantagen från Eleventy-bygget.

## Fastställd knappstil i det lokala förslaget

Alla fristående uppmaningar använder samma ramknapp: vit bakgrund, mörk text
(`#111315`, 16 px, vikt 600, 24 px radavstånd) och 2 px Athega-orange ram
med 4 px hörnradie. Minst 48 px höjd och 10 × 20 px inre luft.
Vid hover används `#fff4eb`; tangentbordsfokus har en separat mörk kontur.

Relaterade knappar placeras tillsammans med 16 px mellanrum. Den viktigaste
kommer först. Länkar i löptext är understrukna. Navigation och klickbara kort
behåller sina egna beteenden. Tidigare fyllda knappvarianter ersätts i förslaget.
