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
