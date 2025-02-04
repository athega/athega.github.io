---
title: "Mallar på klientsidan med HTMX och mustache"
date: 2025-02-04
description: "Idag började jag fundera på hur smidigt det skulle vara att använda en JSON-fil som datakälla för en tabell i en statisk HTML-fil"
tags:
  - blogg
last_updated_by: peter
image_url: /assets/blog/2025-02-04-mallar-pa-klientsidan-med-HTMX-och-mustache/2025-mallar-pa-klientsidan.png
---

![{{page.description}}]({{page.image_url}})

Jag befinner mig sällan på framsidan av webben, men har haft rätt bra erfarenheter av
[HTMX](https://htmx.org/) som ett sätt för mig _(som helst utvecklar för baksidan)_ att faktiskt
få till lite interaktivitet i HTML, utan att för den skull behöva skriva någon
_(eller iaf inte speciellt mycket)_ [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

Idag började jag fundera på hur smidigt det skulle vara att använda en [JSON](https://www.json.org/)-fil som
datakälla för en tabell i en statisk [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)-fil.

> Vanligtvis förväntar sig HTMX fragment av HTML som den kan pussla in i sidan man uppdaterar,
detta går dock att komma runt genom att använda sig av HTMX-tillägget [client-side-templates](https://github.com/bigskysoftware/htmx-extensions/tree/main/src/client-side-templates).

## JSON

Vi börjar med denna enkla JSON-array innehållandes objekt med nycklarna **url**, **name**, och **desc**.

<iframe style="width: 100%; border: 0; height: 16rem;" src="/assets/blog/2025-02-04-mallar-pa-klientsidan-med-HTMX-och-mustache/data.json"></iframe>

## HTML

Sedan skriver vi en enkel HTML-fil där vi laddar in följande bibliotek:

 - <https://picocss.com/docs>
 - <https://htmx.org/>
    - <https://github.com/bigskysoftware/htmx-extensions/tree/main/src/client-side-templates>
 - <https://mustache.github.io/>

```mustache
{% raw %}
<!DOCTYPE html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Data</title>
    <link rel="stylesheet" href="css/pico.fluid.classless.zinc.min.css">
    <script src="js/htmx.min.js"></script>
    <script src="js/htmx/client-side-templates.js"></script>
    <script src="js/mustache.min.js"></script>
  </head>
  <body>
    <main mustache-array-template="data"
          hx-ext="client-side-templates"
          hx-get="data.json"
          hx-target="#rows"
          hx-trigger="load">
      <article>
        <div style="overflow: auto;">
          <table class="striped">
            <tbody id="rows">
            </tbody>
          </table>
        </div>
      </article>
      <script type="text/template" id="data">
        {{#data}}
          {{#name}}
            <tr>
              <th>
                <a href="{{url}}">{{name}}</a>
              </th>
            </tr>
            <tr>
              <td>
                <em>{{desc}}</em>
              </td>
            </tr>
          {{/name}}
        {{/data}}
      </script>
    </main>
  </body>
</html>
{% endraw %}
```

## Resultat

Via **hx-trigger="load"** laddas vår **data.json** vid sidladdning, denna data appliceras sedan i en mustache-mall och de resulterande tabellraderna läggs till i den ursprungligen tomma tabellen;

<iframe style="width: 100%; border: 0; min-height: 20rem; overflow: auto;" src="/assets/blog/2025-02-04-mallar-pa-klientsidan-med-HTMX-och-mustache/index.html"></iframe>

/ [Peter](/peter)
