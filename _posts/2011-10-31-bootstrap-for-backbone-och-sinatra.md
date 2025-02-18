---
title: "Bootstrap-projekt för Backbone.js och Sinatra"
date: 2011-10-31
last_updated_by: peter
---
<a href="http://www.flickr.com/photos/athega/6291740803/" title="Söderarm by athega, on Flickr"><img src="http://farm7.static.flickr.com/6101/6291740803_5a4174264c_z.jpg" width="640" height="427" alt="Söderarm"></a>

Min tanke med mitt projekt på [Athega Code Base 2011](/code-base-2011) var att skapa en startpunkt för framtida projekt skrivna med ramverket [Backbone.js](http://documentcloud.github.com/backbone/), där testramverk och grundläggande filstruktur redan är uppsatt.

CoffeeScript används både i implementation och specs för Backbone.js.
Ruby används i Sinatra-appen. Jag experimenterade med att använda [Evergreen](https://github.com/jnicklas/evergreen),
men valde till slut att enbart förlita mig på Jasmine för att testa de genererade JavaScripten. På Rubysidan valde jag att använda MiniTest/Spec.

Jag använder mig av Guard (samt guard-sass och guard-coffeescript)
för att kompilera Sass och CoffeeScript till CSS och JavaScript.

### Tekniker som utforskades och användes

 - [Backbone.js](http://documentcloud.github.com/backbone/)
 - [CoffeeScript](http://coffeescript.org/)
 - [Jasmine](http://pivotal.github.com/jasmine/)
 - [Guard](https://github.com/guard/guard)
 - [Sinatra](http://www.sinatrarb.com/)
 - [Minitest](https://github.com/seattlerb/minitest)

Koden för den intresserade ligger på [GitHub](https://github.com/athega/bootstrap-backbone-and-sinatra).

/ [Peter](/peter)

__PS.__ _Jag är med och driver projektet [CoffeeScript Cookbook](http://coffeescriptcookbook.com) så det är verkligen på tiden att jag börjar koda lite CoffeeScript._
