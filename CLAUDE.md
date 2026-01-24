# CLAUDE.md

Instruktioner och lärdomar för AI-assistenter som arbetar med detta projekt.

## Viktigt: Verifiera alltid aktuell information

**Lita INTE på egen kunskap om versioner, API:er eller aktuell syntax.**

Använd alltid:
- **WebSearch** för att verifiera aktuella versioner (Node.js, npm-paket, etc.)
- **Context7** (`mcp__context7__resolve-library-id` + `mcp__context7__query-docs`) för biblioteksdokumentation

Exempel på saker som ändras snabbt:
- Node.js LTS-versioner
- Framework-versioner och syntax
- API-ändringar i bibliotek
- Best practices

## Projektöversikt

Detta är Athegas webbplats, byggd med **Eleventy 3.0** (migrerad från Jekyll i januari 2025).

### Viktiga kommandon

```bash
npm install    # Installera beroenden
npm start      # Starta dev-server på localhost:8080
npm run build  # Bygg sajten till _site/
```

### Nyckelkonfiguration

- **eleventy.config.js** - Huvudkonfiguration (ESM-format)
- **package.json** - Beroenden och npm-scripts
- **_data/site.json** - Site-variabler (url, etc.)

## Lärdomar från Jekyll → Eleventy-migrering

### 1. Variabelåtkomst i templates

**Jekyll:**
```liquid
{{ page.title }}
{{ page.image_url }}
{{ site.posts }}
```

**Eleventy:**
```liquid
{{ title }}
{{ image_url }}
{{ collections.posts }}
```

Front matter-variabler nås direkt utan `page.`-prefix i Eleventy.

### 2. Collection-data i loopar

I Eleventy nås front matter via `.data` när man itererar över collections:

```liquid
{% for post in collections.posts %}
  {{ post.data.title }}    <!-- OBS: .data. prefix -->
  {{ post.url }}           <!-- url är direkt på objektet -->
{% endfor %}
```

### 3. Markdown efter HTML-block

Markdown-processorn (i både Jekyll och Eleventy) kräver en tom rad efter HTML-element för att fortsätta tolka Markdown:

**Fungerar inte:**
```markdown
<h3 id="rubrik">Min rubrik</h3>
Text med [länk](http://example.com) fungerar inte.
```

**Fungerar:**
```markdown
<h3 id="rubrik">Min rubrik</h3>

Text med [länk](http://example.com) fungerar nu.
```

### 4. SCSS-hantering

Eleventy processar inte SCSS automatiskt. Vi kör Sass separat via npm:

```json
"scripts": {
  "sass": "sass assets/site.scss:_site/assets/site.css --style=compressed",
  "build": "npm run sass && npx @11ty/eleventy"
}
```

**Modern Sass-syntax:** Använd `@use` istället för `@import`:
```scss
@use "lib/prism" as *;
@use "layout" as *;
```

`@use`-statements måste komma först i filen, före all annan kod.

### 5. JavaScript-konkatenering

`assets/site.js.liquid` är en Liquid-template som konkatenerar JS-filer:

```liquid
---
permalink: /assets/site.js
layout: false
---
{% include "lib/jquery.min.js" %}
{% include "header.js" %}
```

Filen måste ha `.liquid`-extension för att processas som template.

### 6. Passthrough copy för bilder

Bilder i innehållsmappar (inte bara `assets/`) måste explicit kopieras:

```javascript
eleventyConfig.addPassthroughCopy("**/*.jpg");
eleventyConfig.addPassthroughCopy("**/*.png");
// etc.
```

### 7. Collection-sortering

Collections sorteras inte automatiskt som i Jekyll. Explicit sortering krävs:

```javascript
// Alfabetisk sortering efter filnamn
eleventyConfig.addCollection("employees", function(collection) {
  return collection.getFilteredByGlob("_employees/*.md")
    .sort((a, b) => a.inputPath.localeCompare(b.inputPath));
});
```

### 8. Layout-arv och wrappers

Sidor som behöver `<section class="content">` wrapper måste använda rätt layout:

- **page** - För vanliga innehållssidor
- **post** - För blogginlägg
- **employee** - För medarbetarsidor (ny layout skapad vid migrering)
- **default** - Bas-layout utan content wrapper

### 9. Directory data files

För att sätta layout på alla filer i en mapp, skapa en JSON-fil med mappens namn:

```
jobba/
  jobba.json      # {"layout": "page"}
  index.md
```

### 10. Syntax highlighting

Använder `@11ty/eleventy-plugin-syntaxhighlight` med Prism. CSS-tema finns i `_includes/lib/prism.scss`.

## Vanliga fallgropar

1. **Glöm inte `.data.`** när du läser front matter i collection-loopar
2. **Tom rad efter HTML** krävs för att Markdown ska processas
3. **Sortering av collections** måste göras explicit
4. **Bilder utanför assets/** kopieras inte automatiskt
5. **SCSS** kompileras separat, inte av Eleventy
6. **`@use` före allt annat** i SCSS-filer
7. **Dokumentationsfiler med Liquid-exempel** (som denna fil) måste läggas till i `eleventyConfig.ignores`, annars försöker Eleventy köra kodexemplen

## Testning vid ändringar

Efter ändringar, verifiera:

1. `npm run build` går igenom utan fel
2. Startsidan renderar korrekt
3. Blogginlägg visar rätt datum och innehåll
4. Medarbetarsidor har rätt struktur
5. Bilder laddas
6. Interna länkar fungerar
