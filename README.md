# athega.github.io
The Athega GitHub Place

## Uppdatera sajten

### Första gången
```
\curl -sSL https://get.rvm.io | bash -s stable
git clone git@github.com:athega/athega.github.io.git
cd athega.github.io
gem install bundle
bundle install
 
```

### Om du vill
```
bundle update
```

### Lokal server
```
bundle exec jekyll serve
```
Nu kan du titta på sajten lokalt på http://localhost:4000.


### Diverse kommandon

#### Hämta
git pull https://github.com/athega/athega.github.io.git

#### Commit
git commit <filnamn>

#### Push
git push https://github.com/athega/athega.github.io.git


#### Add blog post
1.	Ladda upp bilderna man vill ha i posten. 
a.	Dom ska laddas upp under /athega.github.io/assets/img/blog/
2.	Skapa en ny fil under posts med yyyy-mm-dd-namn-namn.md (Viktigt med md på slutet)
3.	Lägg till huvud med
a.	--- 
b.	title: "Titel"
c.	date: 2015-04-14
d.	description: "description."
e.	tags:   
		- nyhetsbrev
f.	last_updated_by: namn
g.	image_url: /system/uploads/liten.jpg
h.	---
4.	Skriv sedan bloggposten med Markdown
5.	Preview
6.	Commit new file -    master uppdaterar siten i samma sekund

