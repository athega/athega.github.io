---
title: "Bloggportalen visar relaterade nyheter från Sesam"
date: 2009-03-14
last_updated_by: peter
---
<a href="http://www.bloggportalen.se/">Bloggportalen</a>, som <a href="http://www.athega.se/14/sv/Aftonbladet">byggts av Athega</a>, har en ny funktion för att visa relaterade nyheter från <a href="http://sesam.se/">Sesam</a> när man tittar på en av de mest diskterade nyheterna i bloggvärlden. Exempel på detta kan ses <a href="http://www.bloggportalen.se/BlogPortal/view/MostLinkedMediaEntries?id=217223">här</a>.

Funktionen är liksom Bloggportalen i övrigt byggd i <a href="http://java.sun.com/" target="_blank">Java</a> med <a href="http://struts.apache.org/" target="_blank">Struts</a> som applikationsramverk och <a href="http://www.hibernate.org/" target="_blank">Hibernate</a> som <a href="http://en.wikipedia.org/wiki/Object-relational_mapping" target="_blank">ORM / Object-relational mapping</a> och persistenslager. Data hämtas som XML över nätet från en webbtjänst hos Sesam. Sedan används <a href="http://www.w3.org/TR/xpath" target="_blank">XPath</a> för att välja ut relevant data att presentera.

Detta sätt att presentera information och funktionalitet från flera olika källor på en och samma webbplats kallas ibland för en <a href="http://en.wikipedia.org/wiki/Mashup_(web_application_hybrid)" target="_blank">"mashup"</a>. Ett annat exempel på detta är kartorna på Bloggportalen som skapas med hjälp av en tjänst från Google Maps.
