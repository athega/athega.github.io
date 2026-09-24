# athega.github.io

> Athegas webbplats byggd med [Eleventy](https://www.11ty.dev/)

## Kom igång

### Förutsättningar

Du behöver ha [Node.js](https://nodejs.org/) installerat (version 24).
Vi rekommenderar att använda [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) för att hantera Node.js-versioner.

#### Installera nvm (om du inte har det)

**Mac/Linux:**
```console
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Starta om terminalen efter installation.

**Windows:**
Använd [nvm-windows](https://github.com/coreybutler/nvm-windows/releases) istället.

#### Verifiera att nvm fungerar

```console
nvm --version
```

### Klona repot (första gången)

```console
git clone git@github.com:athega/athega.github.io.git
cd athega.github.io
```

### Installera rätt Node.js-version och beroenden

```console
nvm install
nvm use
npm ci
```

Kommandot `nvm install` läser `.nvmrc`-filen och installerar rätt version automatiskt.

### Starta lokal utvecklingsserver

```console
npm start
```

Nu kan du öppna sajten på **http://localhost:8080/**

Servern uppdaterar automatiskt när du sparar ändringar i filerna.

### Bygga sajten för produktion

```console
npm run build
```

Den färdiga sajten hamnar i mappen `_site/`.

### Kontrollera länkar och bilder

```console
npm run check
```

Kontrollen körs efter bygget (även i GitHub Actions) och misslyckas om en intern
länk eller bild leder ingenstans, en bild saknar `alt`-text eller en sida inte har
exakt en `<h1>`. Undantag för äldre innehåll som inte går att rätta finns i
`scripts/check-site.mjs`. Bildernas `width`, `height` och `loading="lazy"` läggs
till automatiskt vid bygget av `scripts/image-attributes.mjs`; skriv dem inte för
hand i innehållet. `sitemap.xml`, `robots.txt` och bloggflödet `/blogg/feed.xml`
genereras från `sitemap.xml.liquid`, `robots.txt.liquid` och `blogg/feed.xml.liquid`.
Standardbilden vid delning (`og:image`) för sidor utan egen bild anges i
`_data/site.json`.

## Vanliga uppgifter

### Hämta ändringar från GitHub

```console
git pull --rebase
```

### Lägga till en bloggpost

1. **Skapa en ny fil** under `_posts/` med namnet `yyyy-mm-dd-namn.md`

   Exempel: `_posts/2024-03-15-min-nya-post.md`

2. **Skriv en rubrik** på första raden. Det är hela metadatan som krävs:
   ```markdown
   # Titel på inlägget

   Första stycket blir ingressen i listor och vid delning.
   ```
   Datumet kommer från filnamnet, adressen och layouten sätts automatiskt.
   Utan rubrik används filnamnet som titel, och bilden i listan är valfri.

   Vill du styra mer kan du i stället lägga metadata överst i filen. Allt utom
   `title` är valfritt, och en egen `description` går före det automatiska utdraget:
   ```yaml
   ---
   title: "Titel på inlägget"
   description: "Kort beskrivning som visas i listningar"
   image_url: /assets/blog/din-bild.png
   tags:
     - blogg
   last_updated_by: dittnamn
   draft: true   # döljer inlägget i produktion
   ---
   ```
   Har du både en `# rubrik` och `title` i metadatan används `title`, och rubriken
   i texten visas då som en vanlig rubrik. Ta bort den för att undvika dubbletter.

3. **Skriv innehållet** i [Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

4. **Ladda upp bilder** till `assets/blog/` (helst i en egen mapp för posten)

5. **Förhandsgranska** på http://localhost:8080/

6. **Committa och pusha:**
   ```console
   git add _posts/2024-03-15-min-nya-post.md
   git commit -m "Lägg till blogginlägg: Titel"
   git push
   ```

### Lägga till, redigera eller ta bort en medarbetare

Medarbetarfilerna ligger i `_employees/`. Skapa en fil per person, exempelvis
`_employees/namn.md`, med följande innehåll:

```yaml
---
permalink: /namn/
name: Förnamn Efternamn
title: Roll/Titel
image: /assets/img/employees/namn.jpg
thumb: /assets/img/employees/namn-thumb.jpg
---

Beskrivning av personen i Markdown...
```

Lägg bilderna på de angivna sökvägarna. Mappens `_employees.json` väljer layout,
och layouten visar namn, roll och porträtt automatiskt. Lägg därför inte in
någon profil-include i personens Markdown-fil. Personen kommer automatiskt med
på Om oss, i filnamnsordning. Behåll `permalink` när du byter namn på en fil så
att befintliga länkar fortsätter fungera.

Ta bort personens Markdown-fil för att ta bort profilen och kortet från nästa
rena bygge. Kontrollera om personens gamla adress fortfarande används i länkar.
Ta bara bort bilder som inte används någon annanstans, till exempel i bloggen.

### Git-kommandon

```console
# Visa status
git status

# Lägg till filer
git add <filnamn>

# Committa
git commit -m "Beskrivning av ändringen"

# Pusha till GitHub
git push
```

## Projektstruktur

```
.
├── _data/            # Datafiler (site.json, etc.)
├── _employees/       # Medarbetarsidor
├── _includes/        # Återanvändbara komponenter
├── _layouts/         # Grundmallar och sidomslag
├── _posts/           # Blogginlägg
├── sidor/            # Enkla Markdown-sidor utan krav på front matter
├── _site/            # Genererad sajt (ignoreras av Git)
├── assets/           # Bilder, CSS, JavaScript
├── eleventy.config.js # Eleventy-konfiguration
└── package.json      # Node.js-beroenden
```

## Felsökning

### "nvm: command not found"
Starta om terminalen efter installation av nvm, eller kör:
```console
source ~/.bashrc   # eller ~/.zshrc på Mac
```

### "npm: command not found"
Installera Node.js via nvm:
```console
nvm install
```

### Ändringar syns inte
1. Kontrollera att utvecklingsservern körs (`npm start`)
2. Hårdladda sidan i webbläsaren (Cmd+Shift+R på Mac, Ctrl+Shift+R på Windows)
3. Kolla terminalen efter felmeddelanden

### Bilder visas inte
- Kontrollera att sökvägen börjar med `/` (t.ex. `/assets/img/bild.jpg`)
- Kontrollera att filen finns i rätt mapp

### Markdown-länkar fungerar inte
Se till att det finns en tom rad efter HTML-element (som `<h3>` eller `<img>`).
Annars tolkas inte efterföljande Markdown korrekt.

## Innehåll, komponenter och design

Sajten är statisk. Eleventy läser innehållsfilerna och skapar HTML vid bygget.
GitHub Pages publicerar `_site/`; besökarnas webbläsare behöver ingen backend,
databas eller extra tjänst. JSON-filerna används vid bygget, inte via klientkod.

| Vad vill du ändra? | Börja här |
| --- | --- |
| Startsidan: rubriker, texter och tjänstekort | `_data/home/content.json` |
| Startsidan: titel och metabeskrivning | `index.html` |
| Huvudmenyn på dator och mobil | `_data/navigation.json` |
| Personal och presentationer | `_employees/*.md` |
| Bloggposter | `_posts/*.md` |
| Tjänste- och företagssidor: texter, kort och kontakt | Markdown i sidans `index.md` |
| Nya enkla textsidor utan front matter | `sidor/*.md` |
| Övriga sidtexter | Respektive Markdown-fil |
| Gemensamma tjänstekort och kontaktsektioner | `_includes/components/` |
| Startsidessektionernas ordning och omslag | `_includes/home.html` |
| Sidmallar | `_layouts/` och `_includes/layout.html` |
| Design och responsivitet | `_includes/styles/`, importerad från `assets/site.scss` |

### Redigera startsidan

`index.html` inkluderar `_includes/home.html`, som sätter ihop sektionerna.
Deras texter finns i `_data/home/content.json`:

- `intro` – huvudrubrik (`heading`), orange text (`emphasis`) och ingress (`lead`).
- `about` – Athega i korthet.
- `services` – rubrik och tjänstekort i listan `items`.
- `blog` – rubrik och länktext; de tre senaste inläggen hämtas automatiskt.
- `consult` – erfarenhet och konsultkontakt.
- `careers` – jobba med oss.

Skriv vanlig text i JSON-fälten, utan HTML eller HTML-entiteter. Skriv exempelvis
`AI & maskininlärning`; mallen hanterar tecknen. Inuti en JSON-sträng måste ett
citattecken skrivas som `\"`. Behåll giltig JSON: inga kommentarer eller avslutande
kommatecken. Lägg till eller ta bort ett helt objekt för att ändra en lista.

Ett tjänstekort har `title`, `description` och `href`. Kortens ordning följer
listan. Lägg inte till en separat HTML-kopia för varje nytt kort.

### Redigera tjänste- och företagssidor

Innehållet på Systemutveckling, AI-labbet, AI för industri, Jobba med oss,
Konsultnätverket, Om oss och Teknikgranskning skrivs i respektive `index.md`.
Front matter längst upp innehåller bara metadata: `layout`, `title`, `description`
och vid behov `permalink`. Det behöver inte ändras för att redigera sidans innehåll.

Rubriker, texter, listor och länkar skrivs i vanlig Markdown mellan korta
sektionsanrop. Mallarna i `_includes/sections/` sköter HTML och CSS-klasser.
Exempel från upplägget på Systemutveckling:

```markdown
{% section "focus", "stacked" %}

Så arbetar vi

## Nära verksamheten. Djupt i tekniken.

Här skriver du sektionens introduktion.

### Kommer in snabbt

Här skriver du texten i första kortet. Du kan använda **fetstil**,
[länkar](/om-oss/) och flera stycken.

### Tar ansvar för helheten

Här skriver du texten i nästa kort.

{% endsection %}
```

För att lägga till ett kort: skriv en ny `###`-rubrik och texten under den.
För att ta bort ett kort: ta bort dess rubrik och tillhörande text.
Ordningen i filen styr ordningen på sidan. Inga YAML-listor eller HTML-taggar behövs.

Sektionernas anrop är presentation. Behåll dem vid textändringar och kopiera ett
befintligt block om du behöver fler sektioner av samma typ. `layout: sections`
renderar Markdown inne i blocken; allt innehåll på sådana sidor ska ligga inom
`section`/`endsection`. En vanlig textsida behöver inga block, se nästa avsnitt.

| Sektion | Så skriver du innehållet |
| --- | --- |
| `hero` | Överrubrik, sedan `#`-rubrik och ingress. `*Markerad text*` i huvudrubriken blir orange. Eventuell sammanfattning och kontaktlänk följer efter ingressen. |
| `focus`, `steps`, `cases`, `values`, `community` | Eventuell överrubrik, `##`-rubrik och introduktion. Varje `###`-rubrik börjar ett kort. Endast `steps` får automatiska nummer. |
| `audiences` | Sektionsintroduktion följd av `---` före varje målgruppskort. Kortet innehåller överrubrik, `###`-rubrik, valfri brödtext, vanlig punktlista och eventuell länk. |
| `callout` | Överrubrik, `##`-rubrik, stycken och kontaktlänkar. Varianten `network` avslutas med en Markdown-bild och ett `>`-citat; citatets första stycke är överrubrik. |
| `work-intro` | Vanliga stycken och en avslutande kontaktlänk. |
| `profile`, `benefits` | `##`-rubrik, brödtext och/eller punktlista samt en avslutande länk. |
| `history` | Överrubrik följd av vanliga stycken. |
| `facts` | Varje `###`-rubrik är ett faktavärde, med beskrivningen under. |
| `team` | Överrubrik, `##`-rubrik, introduktion och det befintliga team-include-anropet. Personer hämtas automatiskt från `_employees/`. |
| `company` | `##`-rubrik och vanlig Markdown. Ett bakstreck (`\`) före radslut ger en radbrytning i bolagsuppgifterna. |

Skriv en kontaktlänk på en egen rad och skilj den från andra stycken med en tom
rad. Avslutande länkar i kontaktsektioner får automatiskt pil och rätt utseende.
Vanliga länkar inne i brödtext påverkas inte. E-postadressen ska stå synligt:

```markdown
[Kontakta oss – reception@athega.se](mailto:reception@athega.se)
```

### Skapa en enkel sida utan front matter

Skapa exempelvis `sidor/min-sida.md` och skriv direkt:

```markdown
# Min sida

Här skriver jag vanlig text med **fetstil** och [en länk](/om-oss/).

## En underrubrik

- En punkt
- En till
```

Det räcker. `sidor/sidor.json` väljer sidmallen automatiskt och sidan får adressen
`/sidor/min-sida/`. Inga sektionsanrop, HTML-taggar eller metadata krävs.
Länka till sidan från relevant innehåll eller från navigationen när den ska vara
lätt att hitta. Sajten lägger inte automatiskt varje ny sida i huvudmenyn.

Om du vill ha en egen webbläsartitel, metabeskrivning eller annan adress kan du
valfritt lägga detta överst. Utan dessa används sajtens standardmetadata:

```yaml
---
title: Min sida
description: En kort beskrivning av sidan.
permalink: /min-sida/
---
```

För en sida på annan plats i repot, lägg också till `layout: page` i metadata,
eller kopiera en befintlig sidstruktur. Personal och bloggposter behåller sina
vanliga metadatafält och sin Markdown-brödtext.

### Återanvänd och utveckla komponenter

- `_layouts/sections.html` ger de sammansatta sidorna ett gemensamt sidomslag.
- `_includes/sections/` innehåller HTML-mallarna för Markdown-sektionerna.
  Mallarnas `heading`, `body`, `intro` och liknande är redan renderad Markdown.
- `scripts/markdown-sections.mjs` registrerar ett [parat Eleventy-anrop](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes).
  Det använder projektets befintliga Markdown- och Liquid-motorer, utan nya paket.
  Rubriknivåer och Markdown-block styr kortindelningen; rubrikernas ordalydelse
  används aldrig som nycklar. Okända sektionstyper/varianter ger fel med filnamn.
- `layout: sections` använder Liquid som yttre renderingssteg, eftersom varje
  sektion redan renderar sitt Markdown-innehåll. Det undviker dubbelrendering av
  HTML. Bloggposter, personal och vanliga textsidor använder fortsatt Eleventys
  vanliga Markdown-flöde.
- Befintliga startsideskomponenter under `_includes/components/` och navigationen
  använder fortfarande sina dataobjekt. De är inte innehållsmodellen för nya
  Markdown-sidor. Flytta inte tillbaka löptext till front matter eller JSON.

Varianter väljs i sektionsanropen: `hero` har `default`, `ai`, `industry` och
`technical-review`; `focus` har `default` och `stacked`; `steps` har `default`,
`stacked` och `soft`; `cases` har `default` och `facts`; `callout` har `default`,
`light`, `dark` och `network`. Övriga använder `default`. Ett valfritt tredje
argument anger ankaret, till exempel `{% section "focus", "default", "omfattning" %}`.

Återanvänd befintliga sektioner. Håll eventuella nya varianter konkreta och knutna
till ett verkligt layoutbehov. För ändringar i Markdown-tolkningen finns relevanta
kontroller med `node --test scripts/markdown-sections.test.mjs`. Kontrollera även
bygget och att berörda sidor behåller rätt HTML-struktur och utseende.

Äldre bloggposter och enstaka andra innehållsfiler kan fortfarande innehålla HTML,
till exempel för bilder och inbäddningar. Bedöm den utifrån det specifika innehållet.

### Bloggens typografi

Bloggartiklar använder en egen skala i `_includes/styles/article.scss`, baserad
på den tidigare publicerade bloggens faktor 1,2 och dess storleksgränser.
Brödtext, ingress och citat följer sajtens brödtextstorlek `--text-lg` (18 px)
och radavstånd `--leading-copy`, så att bloggen och övriga sidor är enhetliga.
Då blir h3 cirka 26 px, h2 cirka 31 px och h1 cirka 37 px. Kodblock är 16 px.
H1 och h2 har vikt 300, h3–h6 har vikt 400 och kod 500. Brödtexten ärver
sajtens gemensamma vikt 300. Radavståndet är 1,5 i kodblock och 1,15 i rubriker.
Den nya sidans typsnitt, omslag och komponentutseende behålls. Justera artikelns
variabler i stället för de globala rubrikstorlekarna eller artikelns Markdown.

### Ändra designen

CSS-klasserna och HTML-omslagen är kopplade till varandra. Följ befintliga
komponenter och CSS-variabler när du ändrar eller utökar designen. Importordningen
i `assets/site.scss` är avsiktlig; responsiva regler kommer sist.

Använd variablerna i `_includes/styles/base.scss` i stället för egna pixelvärden:
avståndsskalan `--space-1..7`, `--grid-gap`, `--card-padding`, hörnradierna
`--radius-sm`, `--radius` och `--radius-lg`, samt `--line-strong` och
`--on-dark-muted`. Cirkelpilen på kort är `.card-arrow` (`.card-arrow-sm` för
den mindre varianten) och kortrubriker delar en gemensam regel i `controls.scss`.
På sidor med `layout: sections` tar sektioner med egen bakgrund (`soft-section`,
`join-section`, `unified-callout`, `dark-section`) och sektionerna som gränsar
till dem hela `--section-flow-gap`; övriga sektioner tar halva.

Sidor med `layout: sections`, startsidan och bloggens arkivsidor får klassen `section-page`. Deras gemensamma
vertikala rytm finns i `_includes/styles/section-spacing.scss` och styrs av
`--section-flow-gap`: 64 px på större skärmar och 40 px på mobil. Samma mått
används ovanför sidans första etikett och mellan
sektioner. Intilliggande sektioner bidrar med halva avståndet var. Från
sektionsrubrik/intro till kortgrupper och text används det mindre måttet
`--content-gap` (24 px, 16 px på mobil), och mellan kort `--grid-gap` (12 px). Ändra dessa gemensamma regler i stället för att
lägga in extra blankrader eller avstånd i Markdown. I sidintroduktionen styr
gemensamma regler avstånden mellan omslagets direkta barn. Egna vertikala
marginaler nollställs innan avståndet läggs på en gång. Kontaktlänkar samlas i
`hero-actions` och får ett tätare avstånd på 16 px till föregående text.
Orange etiketter, huvudrubrik–ingress och sektionsrubrik–intro använder samma
`--heading-gap` (24 px) på alla sidor och skärmstorlekar. Sektionsrubriker som
ligger ovanför sin introtext får avståndet via den gemensamma `.section-heading`-
regeln. När en layoutbehållare äger avståndet nollställs etikettens egen marginal.
Sektionsrubriker och brödtextomslag ska inte lämna en extra slutmarginal mot nästa
block. Kortens inre padding och avstånd mellan nummer, rubrik och text är separata
från avståndet mellan sidans block.

Äldre filer som `_includes/layout.scss`, `_includes/header.scss` och
`_includes/home/*.scss` hör till den tidigare designen och ingår inte i den
aktuella CSS-importkedjan. Äldre JavaScript finns också kvar, men den aktuella
layouten laddar inte `/assets/site.js`. Kontrollera referenser före återanvändning
eller borttagning av äldre filer och bloggdemon.

Kör `npm run build` efter ändringar, eller `npm start` för lokal förhandsvisning.
Om utvecklingsservern får en annan port än 8080 används adressen den skriver ut.
