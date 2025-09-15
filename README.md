# athega.github.io

> The Athega GitHub Place

## Uppdatera sajten

### Utvecklingsberoenden

#### Ruby Version Manager (RVM)

```console
\curl -sSL https://get.rvm.io | bash -s stable
```

> [!TIP]
> Verifiera att din installation av RVM fungerar mha `rvm --version`

### Första gången behöver du klona repot och köra `bundle install`
```console
git clone git@github.com:athega/athega.github.io.git
cd athega.github.io
```

```sh { name=bundle-install }
bundle install
```

### Följande gånger räcker det med att hämta eventuella ändringar

```console
git pull --rebase
```

### Starta en lokal server

```sh { name=jekyll-serve interactive=true }
bundle exec jekyll serve -l -H 0.0.0.0 -P 4500
```

> [!TIP]
> Nu kan du titta på sajten lokalt på <http://localhost:4000/>

### Diverse kommandon

#### Hämta eventuella ändringar i repot från GitHub

```sh { name=git-pull-rebase }
git pull --rebase
```

#### Lägg till en commit

Efter att du gjort din ändring så kan du;

```console
git add <filnamn>
git commit -m "Meddelande som beskriver ändringen"
```

#### Pusha dina ändringar till GitHub

```console
git push
```

#### Uppdatera Ruby-beroenden

```sh { name=bundle-update }
bundle update
```

### Att lägga till en bloggpost

1. Ladda upp bilderna man vill ha med i posten.
    - Dom ska laddas upp under `assets/blog/`
2. Skapa en ny fil under `_posts` med `yyyy-mm-dd-namn.md` _(Viktigt med `.md` på slutet)_
3. Lägg till metadata om posten likt följande i toppen av filen.
    ```yaml
    ---
    title: "Titel"
    date: 2015-04-14
    description: "Kort beskrivning av bloggposten"
    tags:
        - blogg
    last_updated_by: namn
    image_url: /assets/blog/bilden.png
    ---
    ```
4. Skriv sedan bloggposten i [Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
5. Förhandsgranska din ändring på <http://localhost:4000/>
6. Committa den nya filen och pusha till `master` (Eller skapa en **PR** först)
    - När GitHub har behandlat ändringen _(via [Jekyll](https://jekyllrb.com/), vilket kan ta en stund)_ så uppdateras <https://athega.se/>
