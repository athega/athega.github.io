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

## Vanliga uppgifter

### Hämta ändringar från GitHub

```console
git pull --rebase
```

### Lägga till en bloggpost

1. **Skapa en ny fil** under `_posts/` med namnet `yyyy-mm-dd-namn.md`

   Exempel: `_posts/2024-03-15-min-nya-post.md`

2. **Lägg till metadata** i toppen av filen:
   ```yaml
   ---
   title: "Titel på inlägget"
   date: 2024-03-15
   description: "Kort beskrivning som visas i listningar"
   tags:
     - blogg
   last_updated_by: dittnamn
   image_url: /assets/blog/din-bild.png
   ---
   ```

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
├── _layouts/         # Grundmallar och mallar för tjänste- och företagssidor
├── _posts/           # Blogginlägg
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
| Tjänste- och företagssidor: texter, kort och kontakt | YAML-fälten i sidans `index.md`, se tabellen nedan |
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

De här sidorna har innehållet samlat i YAML-fälten mellan `---` i sin Markdown-fil.
Ingen HTML eller Liquid behövs där. Sidmallarna sätter ihop komponenterna och
bestämmer sektionsordning, CSS-klasser och varianter.

| Innehållsfil | Sidmall i `_layouts/` | Innehållsgrupper utöver `hero` |
| --- | --- | --- |
| `teknikgranskning/index.md` | `technical-review.html` | `audiences`, `scope`, `result` |
| `systemutveckling/index.md` | `development.html` | `approach`, `process`, `contact` |
| `ai-labbet/index.md` | `ai.html` | `audiences`, `process`, `contact` |
| `ai-labbet/industri/index.md` | `industry.html` | `process`, `cases` |
| `jobba/index.md` | `careers.html` | `intro`, `values`, `community`, `profile`, `network`, `contact` |
| `konsultnatverk/index.md` | `network.html` | `benefits`, `contact` |
| `om-oss/index.md` | `about.html` | `history`, `facts`, `team`, `careers`, `company` |

Gemensamma fält fungerar på samma sätt mellan sidorna:

- `hero` innehåller överrubrik (`eyebrow`), huvudrubrik (`heading`), markerad text
  (`emphasis`) och ingress (`lead`), samt valfria `summary` och `link`.
- En sektion kan ha `eyebrow`, `heading` och introduktionen `intro`.
- `items` innehåller kort eller arbetssteg med `heading` och `body`.
  Målgruppskorten i `audiences.items` har även `eyebrow`, `features` och ibland `link`.
- `features` är en lista med punkter; `paragraphs` är en lista med textstycken.
- Kontaktsektioner har `body` eller `paragraphs`, samt `link` eller listan `links`.
  På Jobba med oss har `network.quote` citatets `image`, `alt`, `eyebrow` och `paragraphs`.
- På Om oss är `facts` en lista med `value` och `label`. `team` innehåller rubriker;
  personerna hämtas fortfarande automatiskt från `_employees/`.
  `company` har `heading`, `name`, raderna i `details` och stycket `board`.

Ändra en text i dess befintliga fält. Lägg till, ta bort eller flytta ett helt
listobjekt för att ändra kort, steg eller punkter. Ordningen följer listan;
nummer och växlingen mellan ljusa och mörka målgruppskort sköts av mallarna.
Behåll `layout` vid vanliga innehållsändringar. Dessa sidmallar läser YAML-fälten,
inte brödtext under det avslutande `---`. Personal och bloggposter använder
fortfarande vanlig Markdown för brödtexten.

Skriv vanlig text utan HTML eller HTML-entiteter. `>-` låter en text delas över
flera rader i filen men visas som ett stycke. Behåll indrag med mellanslag.
Använd `>-` eller citattecken om en text innehåller kolon följt av mellanslag;
sätt citattecken runt fristående faktavärden som ska vara text, exempelvis `"1997"`.

#### Exempel: teknikgranskningen

Allt innehåll finns i YAML-fälten mellan `---` i `teknikgranskning/index.md`.
Sidmallen `_layouts/technical-review.html` sköter HTML, sektionsordning och design:

- `hero` – överrubrik, huvudrubrik, markerad text, ingress och kontaktlänk.
- `audiences` – introduktion och målgruppskort i `items`, med punktlistan `features`.
- `scope` – sektionsrubrik och granskningsområden i `items`.
- `result` – avslutande rubrik, stycken i `paragraphs` och kontaktlänk.

### Återanvänd och utveckla komponenter

- `components/service-card.html` tar objektet `service` med fälten ovan.
- `components/page-hero.html` tar `hero` med fälten ovan och `variant` som är
  `default`, `ai`, `industry` eller `technical-review`. Varianten väljs i sidmallen
  och bevarar respektive sidhuvuds klasser och omslag.
- `components/section-heading.html` tar `heading` med valfria `eyebrow`, `heading`
  och `intro`, samt `variant` som är `default` eller `stacked`.
- `components/feature-list.html` tar listan `features` och visar punkterna med bockar.
- `components/audience-grid.html` tar listan `items` och växlar kortens variant.
- `components/audience-card.html` tar `audience` med `eyebrow`, `heading` och
  listan `features`, valfria `body` och `link`, samt `variant` som är `dark` eller `light`.
- `components/focus-card.html` tar `focus` med `heading` och `body`. Ange `number`
  med kortets ordningsnummer, eller `nil` för kort utan nummer. Nummer under tio
  får en inledande nolla. Kortet används i både fokus-, steg- och exempelrutnät.
- `components/value-card.html` tar `value` med `heading` och `body` för värderingskorten.
- `components/callout.html` tar `callout` med `eyebrow`, `heading` och
  antingen `body` för ett stycke eller `paragraphs` för flera. Använd ett av
  textfälten; `paragraphs` har företräde. Ange `link` för en länk eller `links`
  för flera länkar i ett gemensamt omslag. Ett valfritt `quote` visar citatet efter
  kontakttexten. `variant` är `dark` eller `light`.
- `components/text-link.html` tar `link` med antingen `href` och `label`, eller
  `email` och valfri `label`, samt `variant` som är `dark` eller `light` för
  sektionens bakgrund. Skriv e-postadressen i `email`, inte i `label`:
  mottagaradressen visas automatiskt. Utan `label` visas bara adressen.
  `email_separator` kan ange text mellan etikett och adress; standard är `" – "`.
  Det valfria `subject` anges som vanlig text och URL-kodas av mallen.
  Callout-komponenten använder samma länkkomponent och länkfält.
- Huvudmenyn använder `navigation.links` (`label`, `href`) och
  `navigation.contact` (`label`, `email`). Samma data används på dator och mobil.

Använd en befintlig komponent när dess HTML-struktur passar. Utöka den om behovet
är gemensamt; skapa en ny när strukturen faktiskt skiljer sig. Ange komponentens
indata uttryckligen vid include-anropet och dokumentera nya fält här. Allt går
att ändra; målet är att vidareutveckla samma struktur i stället för parallella
speciallösningar. Undvik att skapa ett generellt sidbyggarsystem för enstaka behov.

Äldre bloggposter och enstaka andra innehållsfiler kan fortfarande innehålla HTML,
till exempel för bilder och inbäddningar. Bedöm den utifrån det specifika innehållet
och kontrollera den genererade sidan om den ändras.

### Ändra designen

CSS-klasserna och HTML-omslagen är kopplade till varandra. Följ befintliga
komponenter och CSS-variabler när du ändrar eller utökar designen. Importordningen
i `assets/site.scss` är avsiktlig; responsiva regler kommer sist.

Äldre filer som `_includes/layout.scss`, `_includes/header.scss` och
`_includes/home/*.scss` hör till den tidigare designen och ingår inte i den
aktuella CSS-importkedjan. Äldre JavaScript finns också kvar, men den aktuella
layouten laddar inte `/assets/site.js`. Kontrollera referenser före återanvändning
eller borttagning av äldre filer och bloggdemon.

Kör `npm run build` efter ändringar, eller `npm start` för lokal förhandsvisning.
Om utvecklingsservern får en annan port än 8080 används adressen den skriver ut.
