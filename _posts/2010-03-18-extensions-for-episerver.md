---
title: "Extensions för EPiServer"
date: 2010-03-18
last_updated_by: peter
---
Jag har arbetat med EPiServer ett bra tag nu, och har sedan .NET 3.5 släpptes med möjligheten att "bygga ut" objekt med egna funktioner använt ett gäng sådana för att underlätta mitt dagliga arbete. Jag har haft mina Extensions liggande ett tag på Github men tänkte även skriva en liten post om det här.

Ett exempel på en användning skulle t.ex kunna vara att du vill slumpa ut tio av en sidas barn, du vill också se till att bara hämta de som är publicerade. Genom att ha några smarta extensions så skulle du kunna göra såhär.


    PageDataCollection pages = CurrentPage.GetChildren(new FilterPublished(), new FilterRandom(10));


Utan Extensions skulle detta kräva ett antal rader kod ytterligare och det är det lilla extra som gör att man trivs med ett API.
Eftersom filterparametern är en <em>params</em> parameter kan man kombinera ihop hur många filter man vill, egengjorda eller de som ingår i EPiServer. FilterRandom är bara ett enkelt filter för att slumpa ut ett antal sidor som jag gjort.
Min klass innehåller ett antal funktioner för att underlätta arbetet med EPiServer så det är bara att ta ner min klass och se om det är något ni gillar.

<ul>
 <li><a href="http://github.com/ullmark/cs-extensions/blob/master/EPiServerExtensions.cs">EPiServer Extensions</a></li>
</ul>

Inte nöjd med mina eller vill du ha ännu mer extensions så kan du kolla på EPiCode där man försöker sammanställa bra extensions från epi-utvecklare.
<ul><li><a href="https://www.coderesort.com/p/epicode/wiki/Extensions">EPiCode</a></li></ul>

// Markus
