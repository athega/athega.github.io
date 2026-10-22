# Projektinstruktioner

## Arbetssätt

- Statisk Eleventy-sajt med Liquid, Markdown och Sass; Node 24. Håll lösningen enkel. Inga nya paket eller tjänster för vanliga innehålls- och layoutändringar.
- Läs berört innehåll, mall och aktiv CSS före ändring. Återanvänd befintliga komponenter och skicka deras indata uttryckligen.
- Filkarta, innehållsfält och sektionssyntax finns i [README.md](README.md). Dokumentera ändrade gemensamma mönster där.
- Bevara andras arbete. Kontrollera branch och diff före Git-operationer. Fortsätt på uppgiftens branch; ändra inte `main` utan uttrycklig instruktion. Push till `main` publicerar sajten.

## Design och figurer

- Följ [designmanualen](docs/designmanual/README.md) vid bild-, komponent- och layoutarbete. Läs relevanta avsnitt i [HTML-manualen](docs/designmanual/index.html). Uppdatera manualen när designbeslut ändras.
- Behåll Athega-orange `#ff6600`, mörk text på ljusa ytor och manualens gemensamma typografi, knappar och layoutprinciper.
- Utgå från manualens [gemensamma berättelse](docs/designmanual/README.md#gemensam-berättelse-för-bilderna) och fyll i [bildbriefen](docs/designmanual/bildbrief.txt). Bifoga de referensbilder som briefen anger. Låt figurernas egenskaper styra handlingen och bildens samspel med sidans budskap:
  - **Athegamannen:** erfaren, trygg och handlingskraftig. Bygger, granskar och omprövar. Bevara den breda, kraftiga och kompakta silhuetten.
  - **Ada:** nyfiken, uppmärksam och experimenterande. Formulerar idéer, skissar och testar. Hon och Athegamannen är jämbördiga och får växla roller.
  - **Byte:** upptäcker det andra missar genom att nosa och följa spår. Hans fynd ska tydligt höra ihop med scenens problem eller resultat.
- Figurerna berättar något; alla tre behöver inte vara med. Se [deras presentation](vara-figurer/index.md). I maskinmotivet ska instruktion in, produkt ut och granskning vara begripliga.
- Kontrollera anatomi, igenkänning och proportioner. Planera luft, bildplacering och mobilbeskärning så att handling och detaljer syns i faktisk visningsstorlek.

## Innehåll och kod

- Skriv löptext i Markdown och metadata i front matter. Behåll startsidans innehåll och navigation i befintliga `_data/`-filer.
- På sektionssidor ligger allt innehåll inom `{% section %}`-anrop. Håll presentation i mallar och CSS, inte i innehållet. Escapa textdata, inte redan renderad HTML.
- Bevara texter, permalänkar, rubriknivåer och länkmål när uppgiften inte gäller dem. E-postlänkar ska visa adressen.
- Personalmetadata renderas av medarbetarmallen. Bloggkort använder `post.data.excerpt`; artikelns ingress använder dess egen `description`. Kontrollera artikeln innan gemensamma ingressregler ändras.
- Aktiv CSS finns i `_includes/styles/`, importerad från `assets/site.scss`. Återanvänd variabler; använd `@use` och behåll responsiva importer sist. Kontrollera importkedjan innan äldre kod ändras eller tas bort.
- Bevara bilder som fortfarande används och publicerade bloggdemon under `assets/blog/`. Undanta nya interna dokument från Eleventys input.
- Ändra inte beroenden som sidoeffekt. Kontrollera projektets versioner och officiell dokumentation vid osäker API- eller konfigurationssyntax.

## Verifiering

- `npm start` startar lokal server. `npm run build` bygger till `_site/`; `npm run check` kontrollerar sajten. Kör `npm test` vid kodändringar och `npm run check:urls` när sidstruktur eller adresser påverkas.
- Kontrollera berörda sidor, länkar och bilder. Vid layoutändringar: granska dator och mobil i webbläsaren. Vid omstrukturering: jämför genererad HTML och innehåll före/efter.
- Redovisa vad som ändrats, vad som verifierats och eventuella begränsningar. Lägg inte till tester som bara speglar implementationen.
