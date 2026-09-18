# Projektinstruktioner

`AGENTS.md` är en länk till denna fil. Instruktionerna gäller både människor och
AI-assistenter som arbetar i repot. Praktiska exempel och innehållsfält finns i
`README.md`.

## Mål och teknik

Athegas webbplats är en statisk Eleventy-sajt med Liquid, Markdown och Sass.
GitHub Pages publicerar den genererade katalogen `_site/`. Behåll detta arbetssätt:
vanliga innehållsändringar ska inte behöva någon backend, databas, klientrendering,
extern tjänst eller nya paket.

Alla delar av lösningen får vidareutvecklas. Följ den befintliga strukturen så
att liknande uppgifter löses på samma sätt. Välj en liten, begriplig lösning och
uppdatera dokumentationen när du inför eller ändrar ett gemensamt mönster.

## Hitta rätt fil

- Startsidesinnehåll: `_data/home/content.json`.
- Startsidesmetadata: `index.html`.
- Huvudnavigation: `_data/navigation.json`, gemensam för dator och mobil.
- Personal: `_employees/*.md`; standardlayout finns i `_employees/_employees.json`.
- Bloggposter: `_posts/*.md`; standardlayout och URL-mönster i `_posts/_posts.json`.
- Tjänste- och företagssidor: vanligt Markdown-innehåll i respektive
  `index.md` under `teknikgranskning/`, `systemutveckling/`, `ai-labbet/`,
  `ai-labbet/industri/`, `jobba/`, `konsultnatverk/` och `om-oss/`.
  Korta `{% section %}`-anrop väljer presentation; gemensamma mallar
  finns i `_includes/sections/` och sidomslaget i `_layouts/sections.html`.
- Nya enkla sidor utan front matter: `sidor/*.md`; `sidor/sidor.json` väljer
  standardlayouten. Filen `sidor/exempel.md` får adressen `/sidor/exempel/`.
- Övriga innehållssidor: respektive Markdown-fil och dess valda layout.
- Sidstruktur: `_layouts/`, `_includes/layout.html` och `_includes/home.html`.
- Återanvändbara komponenter: `_includes/components/`, `_includes/employees/`
  och `_includes/blog/`; Markdown-sektioner i `_includes/sections/`.
- Aktiv CSS: `_includes/styles/`, importerad från `assets/site.scss`.
- Byggkonfiguration: `eleventy.config.js`, `package.json`, `scripts/dev.mjs`.
- Markdown-sektionernas tolkning: `scripts/markdown-sections.mjs`.

## Arbetsgång

1. Läs den berörda mallen och dess innehållsfil innan du ändrar något. Sök efter
   befintliga komponenter och användningar av fältet eller CSS-klassen.
2. Vid en textändring: ändra innehållet där det redan hör hemma. Behåll rubriknivåer,
   länkmål, omslag, CSS-klasser och sektionsordning om uppgiften inte gäller dessa.
3. Vid en strukturändring: återanvänd en komponent om dess struktur passar.
   Utöka den vid gemensamma behov. Skapa en ny när behovet har en annan struktur.
   Undvik kopierade specialvarianter och generella sidbyggare utan konkret behov.
4. Skicka komponentens indata uttryckligen som Liquid-parametrar, exempelvis
   `{% include "components/service-card.html", service: service %}`.
   Låt sidmallar välja placering och komponentvariant, medan innehållsfilerna
   innehåller texter, länkar och listor.
5. Vid en omstrukturering som ska bevara designen: jämför genererad HTML, text,
   attribut och CSS före och efter. Blanksteg mellan block får skilja sig;
   blanksteg mellan ord och inline-element kan påverka resultatet.
6. Redovisa vad som ändrats och vad som verifierats. Följ användarens avgränsning
   om denne bara vill ha en granskning eller uttryckligen avstår från tester.

## Innehållskonventioner

- Front matter ska vara metadata: titel, beskrivning, layout, permalänk och
  artikel-/personmetadata. Flytta inte löptext, sektionsrubriker, listor eller
  sidans kontaktlänkar till YAML eller JSON för att slippa HTML i Markdown.
- Skriv innehåll i Markdown: rubriker, stycken, listor, länkar, bilder och citat.
  På tjänste- och företagssidor ligger texten mellan `{% section ... %}` och
  `{% endsection %}`. Ett nytt `###`-avsnitt skapar ett kort i en kortgrupp.
  Målgruppskort avgränsas med `---`. Kopiera befintliga sektionsanrop och behåll
  deras variant vid textändringar. Lägg inte CSS-klasser eller HTML i innehållet.
- `layout: sections` renderar Markdown inne i sektionsanropen, exakt en gång;
  lägg allt sidinnehåll inom dessa anrop. Vanliga textsidor använder `layout: page`
  eller ärver den i `sidor/`, och behöver inga sektionsanrop alls.
- Navigation och startsidans befintliga strukturerade data ligger fortsatt i
  `_data/`. Escapa sådana textvärden med `escape`. Renderad Markdown i `content`
  och sektionsmallarnas HTML-fält ska däremot inte escapas en gång till.
- Länkar till e-post ska visa mottagaradressen i den synliga texten. Komponenten
  `text-link.html` (även i callouts) och huvudmenyn gör detta från fältet `email`.
  I Markdown skrivs adressen i länktexten: `[Kontakta oss – reception@athega.se](mailto:reception@athega.se)`.
- Personalens namn, roll, porträtt och bildtext renderas av medarbetarmallen.
  Skriv metadata och presentation i personens Markdown-fil, utan profil-include.
  Listan på Om oss byggs från `collections.employees` i filnamnsordning.
- Behåll befintliga permalänkar när namn, rubriker eller filnamn ändras. Vid
  borttagning av innehåll, undersök även länkar till den gamla adressen.
- Bloggens front matter nås direkt i sidmallen (`title`, `description`, `image_url`).
  I en collection används `post.data.title`, `post.data.description` och `post.url`.
- Kontrollera artikelns egen ingress innan du ändrar gemensam ingresstilldelning.
  Äldre artiklar kan innehålla `description` i brödtexten; en artikel kan använda
  `hide_excerpt_in_article` för att dölja mallens ingress.
- `draft: true` utesluter en sida vid produktionsbygge men visar den vid serve/watch.
- Markdown inne i HTML-omslag kräver rätt blankrader. Kontrollera den genererade
  strukturen när du flyttar innehåll över en sådan gräns.
- Ta inte bort bilder som fortfarande används av andra sidor eller historiska
  blogginlägg. Bedöm referenser, inte bara filnamn.

## CSS och äldre kod

Återanvänd variablerna i `_includes/styles/base.scss` och de aktiva komponenternas
klasser. Bevara importordningen i `assets/site.scss`; responsiva regler kommer sist.
Använd Sass `@use` för nya moduler.

Äldre `_includes/*.scss`, `_includes/home/*.scss` och vissa gamla HTML-komponenter
ligger kvar från tidigare design. De är inte automatiskt aktiva bara för att de
finns. Kontrollera include- och importkedjan innan du ändrar eller tar bort dem.
Den aktuella layouten laddar inte `/assets/site.js`; lägg inte tillbaka den för
att lösa ett problem utan att först kontrollera vad som faktiskt behövs.

Bloggdemon under `assets/blog/` kan innehålla egna HTML-, CSS- och JavaScript-filer.
Behandla dem som publicerat innehåll när du bedömer om kod är oanvänd.

## Lokal miljö och verifiering

Projektet anger Node.js 24 i `.nvmrc`; GitHub Actions använder också Node 24.

```bash
npm ci          # Installera låsta beroenden
npm start       # Lokal server; använd den port som skrivs ut
npm run build   # Sass och Eleventy till _site/
```

Verifiera det ändringen kan påverka: bygge, berörda sidor, personal, datum, bilder,
interna länkar och relevanta skärmstorlekar. Ett lyckat bygge bevisar inte ensamt
att en layout är oförändrad. Lägg inte till tester som bara speglar implementationen.

Eleventy använder repots rot som input. README.md, CLAUDE.md och AGENTS.md är
undantagna i konfigurationen. Nya dokumentationsfiler eller exempelsidor behöver
också placeras eller undantas så att de inte oavsiktligt blir publicerade sidor.

## Verifiera versionsberoende information

Vid ändringar av beroenden, konfiguration eller biblioteksanrop:

- Kontrollera projektets versioner i package.json, package-lock.json
  och .nvmrc.
- Verifiera osäker syntax och API-användning mot officiell dokumentation
  för den version projektet använder.
- Använd tillgänglig dokumentationssökning, exempelvis Context7 eller
  webbsökning. Inget särskilt sökverktyg är ett krav.
- Uppdatera inte beroenden som sidoeffekt av innehålls- eller layoutarbete.

Rena text- och innehållsändringar kräver normalt ingen extern sökning.

## Git och publicering

Kontrollera aktuell branch och lokala ändringar före Git-operationer. Bevara
andras arbete. Ange målbranch uttryckligen när användaren ber om en push till en
viss branch. Det incheckade arbetsflödet bygger och publicerar vid push till main
samt kan startas manuellt. För den här layoutversionen arbetar vi i NewLayout;
ändra inte main utan en uttrycklig uppgift som gäller main.
