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
