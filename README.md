# athega.github.io

> Athegas webbplats byggd med [Eleventy](https://www.11ty.dev/)

## Kom igång

### Förutsättningar

Du behöver ha [Node.js](https://nodejs.org/) installerat (version 22 eller senare).
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
npm install
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

### Redigera en medarbetarsida

Medarbetarfilerna ligger i `_employees/`. Varje fil innehåller:

```yaml
---
layout: employee
permalink: /namn
name: Förnamn Efternamn
title: Roll/Titel
image: /assets/img/employees/namn.jpg
thumb: /assets/img/employees/namn-thumb.jpg
---

Beskrivning av personen i Markdown...
```

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
├── _layouts/         # Sidmallar (default, page, post, employee)
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
