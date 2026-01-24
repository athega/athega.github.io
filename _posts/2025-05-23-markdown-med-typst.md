---
title: "Markdown med Typst"
date: 2025-05-23
description: "Typsättning med hjälp av Typst är mycket smidigt, men ibland kanske man bara vill konvertera från Markdown till ett format lämpligt för utskrift."
tags:
  - blogg
  - typst
  - markdown
last_updated_by: peter
image_url: /assets/blog/2025-05-23-markdown-med-typst/2025-markdown-med-typst.png
---

![Teckning av tryckpress med rubriken Markdown med Typst]({{image_url}})

## Typst

I denna artikel kommer jag att använda mig av typsättningssystemet [Typst](https://typst.app/),
vilket är både ett språk och en kompilator som kan producera
[PDF](https://en.wikipedia.org/wiki/PDF) och [SVG](https://en.wikipedia.org/wiki/SVG)
_(Man arbetar även på att stödja [HTML](https://en.wikipedia.org/wiki/HTML) som utformat)_

> **Notera**
>
> En fiffig detalj med Typst-kompilatorn är att den innehåller en
> [WebAssembly](https://webassembly.org/)-host för plugins, dessa
> kan man använda sig av direkt ifrån sina `.typ`-filer.
>
> Jag har publicerat [en liten Zig-modul](https://github.com/peterhellberg/typ)
> för att skapa sådana plugins med hjälp av [Zig](https://ziglang.org/) ⚡

## Tanke

Härom dagen funderade jag på att det vore praktiskt om det gick att
använda sig av [Markdown](https://daringfireball.net/projects/markdown/) som
källa till ett _(hyffsat generellt)_ dokument skrivet i [Typst](https://typst.app/),
denna tanke visade sig inte vara speciellt unik då jag relativt omgående hittade
Typst-paketet [cmarker](https://typst.app/universe/package/cmarker/) vilket beskrivs
som **“Transpile CommonMark Markdown to Typst, from within Typst!”**

Precis vad jag var ute efter!

Då var det bara att börja fila på `document.typ` för att realisera min tanke.

## `document.typ`

Det första vi behöver göra är att importera `cmarker` från det globala namnutrymmet för Typst-paket.
<br>
_(Vilket heter `preview` av **anledning**)_

```console
#import "@preview/cmarker:0.1.5"
```

Efter att vi importerat `cmarker` så behöver vi deklarera en
[`dictionary`](https://typst.app/docs/reference/foundations/dictionary/)
innehållandes lite konfiguration baserad på
[sys.inputs](https://typst.app/docs/reference/foundations/sys)
vilken populeras med hjälp av `--input KEY=value` flaggan till `typst compile`.

```bash
#let cfg = (
  file: sys.inputs.at("FILE",
    default: "document.md"),
  rule: eval(sys.inputs.at("RULE",
    default: "pagebreak")),
  page: eval("("+sys.inputs.at("PAGE",
    default: "paper: \"a4\", margin: 0.5cm")+")"),
  text: eval("("+sys.inputs.at("TEXT",
    default: "font: \"Inter\", size: 14pt")+")"),
  code: eval("("+sys.inputs.at("CODE",
    default: "font: \"Office Code Pro D\", weight: \"medium\", size: 1em")+")"),
  line: eval("("+sys.inputs.at("LINE",
    default: "stroke: luma(220)")+")"),
  table: eval("("+sys.inputs.at("TABLE",
    default: "stroke: luma(220), inset: 0.4em")+")"),
  raw: (
    box: eval("("+sys.inputs.at("RAW_BOX",
      default: "")+")"),
    block: eval("("+sys.inputs.at("RAW_BLOCK",
      default: "inset: 1em")+")"),
  ),
)
```

> **Notera**
>
> Funktionen `sys.inputs.at` returnerar en `str` som jag
> [konkatenerar](https://sv.wikipedia.org/wiki/Konkatenering)
> mellan strängarna **`"("`** och **`")"`**
>
> _(då jag vill hantera dessa
> som `dictionary`-literaler, utan att behöva inkludera dessa i
> argumentet till `--input`)_
>
> Sen används `eval` för att
> konvertera dessa strängar till värden av typen `dictionary`.

Nu använder jag mig av [..spread](https://typst.app/docs/reference/foundations/arguments/#spreading)-operatorn
för att tillhandahålla argumenten till några olika
[set-regler](https://typst.app/docs/reference/styling/#set-rules)

```console
#set page(..cfg.page)
#set text(..cfg.text)
#set line(..cfg.line)
#set table(..cfg.table)
```

För att formatera både kodblock och kod i brödtext på samma sätt
så [binder](https://typst.app/docs/reference/scripting/#bindings)
jag variabeln `code` med **#let**

```console
#let code=text.with(..cfg.code)
```

Sen använder jag denna variabel i två
[show-regler](https://typst.app/docs/reference/styling/#show-rules)
som är filtrerade på om det är råtext i ett block eller inte.

```console
#show raw.where(block: false): it => box.with(..cfg.raw.box)(code(it))
#show raw.where(block: true): it => block.with(..cfg.raw.block)(code(it))
```

Nu är vi redo att använda oss av **#cmarker.render**.

Vi läser in en Markdown-fil med hjälp av [read](https://typst.app/docs/reference/data-loading/read/)
och vi sätter det kontext som ska vara tillgängligt vid parsningen.

- `cfg`: För att vi i `<!--raw-typst -->` kommentarer ska ha tillgång till konfigurationen.
- `rule`: Detta fält används för vad som ska hända med `---` (Min konfiguration har standardvärdet `pagebreak`)
- `code`: För att vi i `<!--raw-typst -->` ska ha möjlighet att ändra hur kod formateras.
- `image`: Vi behöver korrigera hur cmarker
    [hanterar sökvägar](https://github.com/typst/packages/tree/main/packages/preview/cmarker/0.1.5#resolving-paths-correctly) till bilder.

```console
#cmarker.render(
  read(cfg.file),
  scope: (
    cfg: cfg,
    rule: cfg.rule,
    code: code,
    image: (path, alt: none) => image(path, alt: alt),
  )
)
```

Klart! 🎉

## `document.md`

Vi behöver naturligtvis även skriva lite Markdown.

> **Notera**
>
> I kommentarer med formatet `<!--raw-typst -->` kan man skriva Typst
> för att styra hur man vill att dokumentet ska formateras.
> Men man behöver inte använda dessa om man enbart vill skriva Markdown.

```markdown
<!--raw-typst
#set page(
  paper: "a4",
  flipped: true,
  columns: 2,
)

#set text(
  size: 20pt,
)

#set quote(
  attribution: [Peter Hellberg],
)

#show link: underline

#show quote.where(block: true): box.with(
  stroke: (left: 4pt + rgb("FF6600")),
  width: 16em,
)
-->

# Vi kan skriva Markdown och använda den i Typst

*Med* __ett__ ~flertal~ `trevliga` [funktioner](https://athega.se/)

## Undertitel

Lite brödtext[^footnote] som formateras som förväntat.

[^footnote]: En fotnot

> Ett klyftigt citat.

- En
- Lista

1. En
2. Ordnad
2. Lista

<!--raw-typst
#colbreak()
-->

### Tabell

| **Språk** | **Hemsida**           |
| --------- | --------------------- |
| Go        | <https://go.dev>      |
| Zig       | <https://ziglang.org> |

### Rita

Vi kan även använda oss av Typst för att rita med vektorer:

<!--raw-typst
#circle(radius: 2em, fill: gradient.radial(white, rgb("FF6600")).sharp(3))
-->

Eller ladda en SVG från fil och rita ut den:

![Ewok](ewok.svg)
```

## `document.svg`

För att generera följande SVG använder jag `typst compile document.typ document.svg` vilket resulterar i:

![SVG](/assets/blog/2025-05-23-markdown-med-typst/document.svg)

> **Notera**
>
> Om du istället vill generera [`document.pdf`](/assets/blog/2025-05-23-markdown-med-typst/document.pdf)
> så behöver du bara `typst compile document.typ`

## PDF baserad på denna bloggpost

För att ta det hela ett litet steg vidare så testade jag hur smidigt
det vore att använda sig av den Markdown som ligger till grund för denna bloggpost.

Jag tog och kopierade posten till [`post.md`](/assets/blog/2025-05-23-markdown-med-typst/post.md)
och raderade den "frontmatter" som används för [Jekyll](https://jekyllrb.com/)
_(men som inte hanteras speciellt bra av `cmarker`)_

Fick lägga till några `---` för att trigga sidbrytningar,
`<!--raw-typst #colbreak() -->` för att bryta kolumner,
samt uppdatera länkar till filer.

```console
typst compile \
    --input FILE='post.md' \
    --input PAGE='paper: "a4", columns: 2, margin: (x: 1cm, y: 2cm)' \
    --input TEXT='font: "Inter", size: 8pt' \
    --input CODE='font: "Office Code Pro D", weight: "regular", size: 1.1em' \
    document.typ post.pdf
```

Detta resulterade i [`post.pdf`](/assets/blog/2025-05-23-markdown-med-typst/post.pdf)

/ [Peter](/peter)

_När denna artikel skrevs var den aktuella versionen av
[`typst`](https://github.com/typst/typst/releases)
[`v0.13.1`](https://github.com/typst/typst/releases/tag/v0.13.1)_
