---
title: "Låt inte Tomcat jobba i onödan"
date: 2009-04-24
last_updated_by: peter
---
Ett vanligt upplägg för en lastad sajt med någorlunda statiskt innehåll ser ut enligt nedan:

<img class="size-full wp-image-151" title="Internet-Cache-Front" src="/assets/legacy/uploads/2009/04/img_8759.jpg" alt="Upplägg, lastad sajt" width="640" height="440" />

I korthet innebär det att den största delen av trafiken hanteras av enkla webbcachear som leverar sidor till slutanvändarna. Med ett visst intervall efterfrågar cachearna frontarna efter nytt innehåll. Frontarna kan exempelvis köra en eller flera Tomcat-instanser som genererar innehållet. På detta sätt kan även riktigt stora siter klara sig på ett tiotal maskiner.

För alla JSP-sidor som Tomcat-frontarna genererar åt cachearna skapas nu en session, precis som <a title="JSR 154" href="http://jcp.org/en/jsr/detail?id=154">Servlet-standarden</a> föreskriver. Det är helt i sin ordning, fast helt onödigt i det här fallet. Det genererade innehållet levereras inte direkt till slutanvändaren, utan till cachen. Kan man få servlet-motorn att inte skapa sessioner i onödan och på så sätt spara sina dyra resurser?

Ja, ett sätt är att överst i sin JSP-sida helt enkelt utbrista:

    <%@page session="false"%>

Dock är det kanske inte att föredra i ett litet större projekt med hundratals JSP-sidor. Det man letar efter är ett sätt att slå av det centralt för alla JSP-sidor. Min första instikt var att konfiguerar Jasper, som kompilerar JSP-sidorna att inte skapa sessioner om man inte explicit bad om det. Någon sådan parameter hittade jag tyvärr inte. Personer som har liknande frågor på nätet får istället frågan; "Varför vill du slå av sessioner? De är ju en del av standarden!"

Mitt nästa spår var att automatiskt försöka inkludera ovanstående direktiv för varje genererad sida. Från och med JSP 2.0 (som inte direkt kom ut igår) går det att få till ganska enkelt med något som kallas för implicit includes.

Börja med att lägga till ett jsp-config-direktiv i din web.xml:
    <!-- Disable the use of sessions -->
    <jsp-config>
      <jsp-property-group>
        <url-pattern>*.jsp</url-pattern>
        <include-prelude>/WEB-INF/jspf/disableSession.jspf</include-prelude>
      </jsp-property-group>
    </jsp-config>

Detta matchar alla JSP-filer (med filändelsen .jsp) och inkluderar innehållet av filen disableSession.jspf precis som om du skulle ha skrivit

    <%@include file="/WEB-INF/jspf/disableSession.jspf"%>

högst upp i varenda JSP-fil.

Notera att filen som inkluderas är av typen .jspf, ett JSP-fragment. Detta är nödvändigt och säkerställer bland annat att du inte råkar in i några oändliga inkluderingsloopar. Att filen ligger i mappen /WEB-INF/jspf är rekommenderat och förhindrar även direkt access för en slutanvändare.

Testa! Tomcat kommer att kasta fel i loggarna så fort du försöker skapa en session, men om du har det som jag är det precis så du vill ha det!

// [Chrille](/chrille)
