---
title: "jQuery är snyggt"
date: 2010-04-09
last_updated_by: admin
---
Större delen av gårdagen ägnades åt en workshop (tack <a href="http://twitter.com/stpe">@stpe</a>) kring frontendutveckling. Fokus var på <a href="http://developer.yahoo.com/yui/">YUI</a>, men eftersom jag jobbat en del med det redan, men däremot inte hunnit dyka ner i <a href="http://jquery.org/">jQuery</a> på riktigt, valde jag det senare.

Min idé var att göra ett lajvflöde av <a href="http://www.flickr.com/">Flickr</a>-bilder och <a href="http://www.twitter.com/">Twitter</a>-postningar baserat på ett givet sökord eller tag.

<a href="/assets/legacy/uploads/2010/04/athaga.png"><img class="aligncenter size-full wp-image-624" title="athaga" src="/assets/legacy/uploads/2010/04/athaga.png" alt="" width="532" height="279" /></a>

## JSONP

Både Flickr och Twitter har rika APIer i <a href="http://www.json.org/">JSON</a>-format som gör det lätt att åstadkomma det jag vill. Då dessa av naturliga skäl inte ligger på samma domän som min labb, kan jag inte göra ett vanligt <a href="http://en.wikipedia.org/wiki/XMLHttpRequest">XHR</a>-anrop eftersom webbläsaren av säkerhetsskäl kastar ett same domain-policy-fel. Räddningen stavas <a href="http://en.wikipedia.org/wiki/JSON#JSONP">JSONP</a>, som helt enkelt wrappar hela JSON-svaret i ett metodanrop. Detta går vi inte in närmare på denna gång, utan konstaterar istället glatt att jQuery har stöd för detta och löser detta under ytan.

## jQuerys effektköer

Planen är alltså att långsamt smyga in en bild, visa den ett tag, sedan dimma ner den och till sist ta bort den helt.

Sedan jQuery 1.4 finns det en toppenmetod för att hantera pauser i den allmänna effektkön, fx. Metoden heter <a href="http://api.jquery.com/delay/">delay()</a> och låter mig åstadkomma önskat beteende på ett oerhört kompakt och tydligt vis.


    $(img).fadeIn('slow').
           delay(1000).
           fadeTo('slow', 0.3).
           delay(2000).
           fadeOut('fast', function() {
             $(this).remove();
           });


Det är ju nästan som att prata svenska (engelska)! Vi repeterar:

 - Smyg långsamt in bilden
 - Vänta en sekund
 - Dimma ner den litet
 - Vänta två sekunder
 - Smyg snabbt bort bilden och ta bort den

## Koden

Vill du se hur det ser ut, kan du titta <a href="http://www.athega.se/files/lab/athaga/">här</a> eller <a href="http://www.athega.se/files/lab/athaga/athaga.zip">ladda ner</a> hela koden och labba vidare själv.

/ [Chrille](/chrille)
