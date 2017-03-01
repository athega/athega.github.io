---
title: "Tekniken bakom Jullunchen"
date: 2011-12-21
last_updated_by: peter
---
<p style="padding: 1em; background-color:#FAFAFA; border:1px solid rgba(0, 0, 0, 0.2); color:#777; text-shadow:0 0 1px white; -webkit-border-radius: 6px; -moz-border-radius: 6px; border-radius: 6px;">
<strong>OBS!</strong> Ovanligt mycket tekniksnack i denna
bloggpost, sådant som vi tycker är extra roligt :)
</p>

Vi har utvecklat ett antal skräddarsydda applikationer
för Jullunchen, det handlar både om några
webbapplikationer och en nativ (iOS) applikation.

Koden för dessa ligger självklart tillgänglig på
vårt [GitHub](https://github.com/athega)-konto.

## [athega-jullunch](https://github.com/athega/athega-jullunch)

Applikationen som hanterar inbjudningar, incheckningar och bildspelet
har vi driftsatt på [Heroku](http://www.heroku.com/).
Vi använder oss av ramverken [Sinatra](http://www.sinatrarb.com/)
och [Backbone.js](http://documentcloud.github.com/backbone/)
(Det senare används främst för bildspelet).

Språken vi använt oss av är [Ruby](http://www.ruby-lang.org/en/)
och [CoffeeScript](http://coffeescript.org/).

Epost hanteras av tjänsten [MailGun](https://mailgun.net/)
(Genom deras enkla Heroku Add-on).

![jullunch.athega.se](http://assets.athega.se/blogg/2011/12/jullunch_athega_se.png)
![tweets](http://assets.athega.se/blogg/2011/12/athega_jullunch_tweets.png)

### Bildspelet

Koden för bildspelet ligger i filen
[application.coffee](https://github.com/athega/athega-jullunch/blob/master/coffeescripts/application.coffee)

#### Ett exempel på hur trevligt CoffeeScript är att jobba med:

    class window.PresentationLoop
    
      constructor: (ms) ->
        @delay     = ms
        @iteration = 0
    
        window.loop = @
        window.loop.run()
    
      tweets: ->
        tweets.fetch()
        setTimeout 'tweets.fetch()', @delay/2
        setTimeout 'window.loop.check_ins()', @delay
    
      check_ins: ->
        check_ins.fetch()
        setTimeout 'window.loop.images()', @delay
    
      images: ->
        images.fetch()
        setTimeout 'images.fetch()', @delay/2
        setTimeout 'window.loop.ads()', @delay
    
      ads: ->
        ads.fetch()
        setTimeout 'window.loop.iterate()', @delay
    
      iterate: ->
        @iteration += 1
        console.log('iteration: ' + @iteration)
        setTimeout 'window.loop.tweets()', 0
    
      run: ->
        setTimeout (=> @tweets()), 0
    

## [jullunch_daemon](https://github.com/athega/jullunch_daemon)

På en av våra servrar
(Virtuell maskin, hostad av [GleSYS](http://glesys.se/))
kör vi en bakgrundsprocess som hämtar ner nya tweets, kollar om det
finns några nya bilder, etc.
Ett antal [JSON](http://json.org/)-dokument skrivs ner på disk med
jämna mellanrum (vi pratar sekunder). Dessa filer används sedan
som datakällor i bildspelet
([Backbone.Collection](http://documentcloud.github.com/backbone/#Collection)).

Ramverket [Foreverb](https://github.com/DAddYE/foreverb) används för att
köra bakgrundsprocessen (schemaläggning, loggning, etc.).

## [tomtelizer](https://github.com/athega/tomtelizer)

Nativ iOS applikation för att ta bilder och lokalisera ansikten 
([CIFaceFeature](http://developer.apple.com/library/mac/#documentation/CoreImage/Reference/CIFaceFeature/Reference/Reference.html) och
 [CIDetector](http://developer.apple.com/library/ios/#documentation/CoreImage/Reference/CIDetector_Ref/Reference/Reference.html)).

## [tomtelizer-server](https://github.com/athega/tomtelizer-server)

Serversidan av tomtelizern är utvecklad med
ramverket [Ruby on Rails](http://rubyonrails.org/).

Den använder sig av [Delayed Job](https://github.com/collectiveidea/delayed_job)
för att köa upp inkommande bilder för processning. De slutgiltiga
bilderna genereras med hjälp av [RMagic](http://rmagick.rubyforge.org/).

/ [Peter](/peter)
