---
title: "Hpricot och Sinatra på Google App Engine"
date: 2009-09-01
last_updated_by: peter
---
<a title="Hpricot" href="http://github.com/whymirror/hpricot/tree/master">Hpricot</a> är en HTML parser som är skriven i Ruby. Jag gillar den eftersom den är snabb och extremt enkel att jobba med. Den är perfekt om man vill extrahera innehåll från en webbsida som inte tillhandahåller ett färdigt api. Det finns <a href="http://www.google.se/search?q=hpricot+tutorial&amp;ie=utf-8&amp;oe=utf-8&amp;aq=t&amp;rls=com.ubuntu:en-US:official&amp;client=firefox-a">många</a> <a href="http://soledadpenades.com/2007/06/15/extracting-data-with-hpricot/">bra</a> <a title="Installera Hpricot för Jruby" href="http://stackoverflow.com/questions/726412/installing-hpricot-for-jruby">tutorials</a> på nätet.

## Ett enkelt exempel

För att till exempel hitta alla nyheter på Athegas första sida kan man göra så här.

    require 'rubygems'
    require 'open-uri'
    require 'hpricot'

    # Läs in Athegas första sida
    doc = Hpricot(open("http://athega.se"))
    # Xpath uttryck för att hitta nyheterna
    result = doc/"//*[@id='helplist']/li/a"


## Hpricot på Google App Engine

Jag ville använda Hpricot tillsammans med <a href="http://jruby.org/">Jruby</a> och <a href="http://www.sinatrarb.com/">Sinatra</a> (som Peter har <a href="http://athega.se/2009/03/08/sinatra-och-google-spreadsheet/">skrivit</a> mer om) på <a href="http://code.google.com/appengine/">Google App Engine</a>. Jag följde den här <a href="http://blog.bigcurl.de/2009/04/running-sinatra-apps-on-google.html">guiden</a> för att komma igång med min Sinatra applikation på App Engine  och det gick smärtfritt. Tyvärr så small det direkt när jag försökte använda mig av Hpricot. Ett AccessControlException kastades.

    javax.servlet.ServletContext log: Application Error
    java.security.AccessControlException: access denied (java.net.SocketPermission athega.se resolve)
    at java.security.AccessControlContext.checkPermission(AccessControlContext.java:323)
    at java.security.AccessController.checkPermission(AccessController.java:546)
    at java.lang.SecurityManager.checkPermission(SecurityManager.java:532)
    at com.google.appengine.tools.development.DevAppServerFactory$CustomSecurityManager.checkPermission(DevAppServerFactory.java:128)
    at java.lang.SecurityManager.checkConnect(SecurityManager.java:1031)
    at java.net.InetAddress.getAllByName0(InetAddress.java:1145)
    at java.net.InetAddress.getAllByName(InetAddress.java:1083)
    at java.net.InetAddress.getAllByName(InetAddress.java:1019)
    at java.net.InetAddress.getByName(InetAddress.java:969)

Vilket tyder på att någon javaklass som inte är med på Googles <a href="http://code.google.com/appengine/docs/java/jrewhitelist.html">lista</a> över tillåtna klasser användes.  När jag studerade stacktracet lite närmare märkte jag att det var open-uri som ville använda javaklassen <a href="http://java.sun.com/j2se/1.5.0/docs/api/java/net/InetAddress.html">InetAddress</a> som inte finns med i listan på godkända klasser.

Eftersom man med hjälp av Jruby kan "scripta" java var det relativt enkelt att byta ut open-uri mot godkända javaklasser istället  och sedan <a href="http://kenai.com/projects/jruby/pages/CallingJavaFromJRuby#Convert_a_Java_InputStream_to_a_ruby_IO_object">automagiskt</a> göra om java InputStream objektet till ett ruby io objekt som Hpricot kan ta i sin konstruktor. Lösningen blev enligt nedan.

    require 'rubygems'
    require 'hpricot'
    # Importerar java istället för open-uri
    require 'java'
    # Skapa en instans av java-klassen URL
    url = java.net.URL.new("http://athega.se")
    # Kasta om java inputstreamen till ett ruby io objekt
    ruby_io = org.jruby.RubyIO.new(JRuby.runtime, url.openStream)
    io = Java.java_to_ruby(ruby_io.java_object)
    # Sen är det bara att använda Hpricot som vanligt
    doc = Hpricot(io)
    result = doc/"//*[@id='helplist']/li/a"

Sedan transformerade jag resultatet till JSON och la upp applikationen här <a href="http://athega-news-api.appspot.com">http://athega-news-api.appspot.com</a> (OBS, applikationen returnerar JSON direkt så jag rekommenderar <a href="https://addons.mozilla.org/en-US/firefox/addon/10869">JSONView</a> pluginet till Firefox om man vill titta på datan)

Om någon vill titta närmare på <a href="http://github.com/ragulin/hpricot-and-sinatra-on-google-app-engine/tree/master">koden</a> ligger den på Github men tänk på se till så att ni har tillstånd av rättighetsinnehavaren innan ni plockar data från webben.

/ [Mikael](/mikael)
