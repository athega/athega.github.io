---
title: "Lär dig leva utan ancestorView"
date: 2009-07-02
last_updated_by: peter
---
Under våren har jag jobbat med att trimma en webbapplikation som levererar nätupplagan av en av Sveriges större tidningar. CMS-verktyget som används är <a href="http://www.escenic.com">Escenic</a> i version 4.x och det kommer med en rad egna JSP-tagar. En av dom ska man dock akta sig för – <code><section:ancestorView></code>. Den är faktiskt inte så svår att leva utan heller. I den här artikeln visar jag hur.

<img class="size-full wp-image-256 " title="Responstid" src="/assets/legacy/uploads/2009/07/response_time.jpg" alt="Responstid före och efter jag bytt ut <section:ancerstorView>" width="615" height="276" />

<h2>Vad är ancestorView?</h2>
<code>ancestorView</code> används för att skapa en hierarkisk vy av sektioner utgående från den sektion du anger. Inget speciellt avancerat eller konstigt. Det borde inte heller vara jobbigt för systemet att skapa vyn, tyvärr sker något under ytan som ställer till det. Berätta gärna vad i kommentarerna. ;)

<h2>Hur det kan se ut (före)</h2>
Ett vanligt sätt att använda sig av <code>ancestorView</code> är för att exempelvis bygga en sökväg till en navigering:

    <section:ancestorView id="sectionView" section="${article.homeSection}" includeRoot="true"/>
    <menu:use id="navigation" treeName="myMenuName">
      <c:set var="count" value="1"/>
      <view:iterate id="item" name="sectionView">
        <menu:item id="current" sectionId="${item.id}"/>
        <c:choose>
          <c:when test="${count eq 1}">
            <c:set var="sectionPath" value="${current.text}"/>
          </c:when>
          <c:otherwise>
            <c:set var="sectionPath" value="${sectionPath}/${current.text}"/>
          </c:otherwise>
        </c:choose>
        <c:set var="count" value="${count+1}"/>
      </view:iterate>
    </menu:use>

<h2>Skapa en lättviktig ersättning till <code>ancestorView</code></h2>
En enkel väg till ett liv utan <code>ancestorView</code>-taggar är att skapa en mycket enkel custom tag. Nedanstående implementation har inte stöd för precis allt du kan göra med Escenics variant, men den gör jobbet för de flesta användningsfallen. Jag döpte den till <code>ancestors.tag</code> och la den i <code>/WEB-INF/lib/tags/section</code>.

    <%@tag body-content="empty"%>
    <%@tag import="neo.xredsys.api.Section, java.util.ArrayList"%>
    <%@attribute name="id" required="true" rtexprvalue="false"%>
    <%@attribute name="section" type="neo.xredsys.api.Section" required="true"%>
    <%@attribute name="includeRoot" type="java.lang.String" required="false"%>
    <%@variable name-from-attribute="id" alias="sectionPath" scope="AT_END"%>
    <%
      final ArrayList sections = new ArrayList();
      if (section != null) {
        do {
          sections.add(0, section);
          section = section.getParent();
        } while (section != null && ("true".equals(includeRoot) || section.getParent() != null));
      }
      jspContext.setAttribute("sectionPath", sections);
    %>

Det enda som egentligen sker här är att jag bygger upp en lista med föräldrasektioner i omvänd ordning genom att anropa Escenics API. Detta går av någon anledning massor med gånger snabbare.

<h2>Hur det kan se ut utan <code>ancestorView</code> (efter)</h2>

    <%@ taglib prefix="sec" tagdir="/WEB-INF/tags/section" %>
    <sec:ancestors id="sectionView" section="${article.homeSection}"/>
    <menu:use id="navigation" treeName="myMenuName">
      <c:forEach var="item" items="${sectionView}" varStatus="itemStat">
        <menu:item id="current" sectionId="${item.id}"/>
        <c:choose>
          <c:when test="${itemStat.first}">
            <c:set var="sectionPath" value="${current.text}"/>
          </c:when>
          <c:otherwise>
            <c:set var="sectionPath" value="${sectionPath}/${current.text}"/>
          </c:otherwise>
        </c:choose>
      </c:forEach>
    </menu:use>

Eftersom jag inte längre arbetar med en vy av sektioner, kan jag iterera över listan med föräldrasektioner med en vanlig <code>c:foreach</code> med fördelar som <code>varStatus</code>, mm.

<h2>Slutsats</h2>
Om du använder Escenic i någon 4.x-version och om du får några träffar när du söker på ancestorView i din kodbas, finns all anledning att se över ett byte!

// [Chrille](/chrille)
