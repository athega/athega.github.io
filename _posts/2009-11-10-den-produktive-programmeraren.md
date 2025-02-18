---
title: "Den produktive programmeraren"
date: 2009-11-10
last_updated_by: peter
---
<a href="http://oreilly.com/catalog/9780596519544/"><img class="alignright" title="The Productive Programmer" src="http://covers.oreilly.com/images/9780596519544/lrg.jpg" alt="" width="108" height="142" /></a>

En av de bättre dragningarna på årets <a href="http://www.oredev.org/">Øredev</a> var <a href="http://www.nealford.com/">Neal Ford</a>'s ”The Productive Programmer: Mechanics”. Neal har skrivit en <a href="http://oreilly.com/catalog/9780596519780/">bok</a> med samma namn, som jag hört litet blandad kritik om. Därför hade jag inga större förväntningar när jag klev in i rummet. Efter orden <em>”Graphical tools are med for novices”</em> visste jag att detta var något för mig!

Nedan följer en rad tips, som alla syftar till att hjälpa dig bli en mer produktiv programmerare, oavsett om du använder <a href="http://www.gnu.org/software/emacs/">emacs</a>, <a href="http://en.wikipedia.org/wiki/Notepad_%28Windows%29">notepad</a> eller <a href="http://www.eclipse.org/">Eclipse</a>.

## Urklippshanteraren (eller clipboard)

Varför, varför finns det bara plats för ett urklipp i taget i dagens moderna operativsystem (*nix-dialekter undantagna)?

Det är ju helt tokigt att inte kunna gå tillbaka och ta fram något man kopierade eller klippte ut för bara några minuter sedan, bara för att man råkat svara på ett mail, mitt i ett enhetstest eller liknande. Lösningen finns i form av några hjälpprogram:

<ul>
	<li><a href="http://jumpcut.sourceforge.net/">Jumpcut</a> (Mac)</li>
	<li><a href="http://www.nakka.com/soft/clcl/index_eng.html">clcl</a> (Windows)</li>
</ul>

## Lär dig kortkommandon

Tiden det tar att lära sig även det mest obskyra kortkommando är väl investerad tid. Varje gång dina fingrar måste lämna tangentbord slösar du med tid. Hitta en bra partner att parprogrammera med och be honom/henne raljera över hur långsam du är varje gång du använder musen.

## Scripta dina vanligast kommandon/texter

Om du märker att du ofta skriver samma sak, skriver samma fel eller skriver samma sekvens av kommandon i en terminal, finns det hjälp. <a href="http://www.smileonmymac.com/TextExpander/">Textexpander</a> är ett litet makroverktyg som verkligen sparar tid. Du kan använda det till allt från epostsignaturer till kod-"snippets".

Tyvärr kostar det pengar och finns det bara för Mac, men jag är övertygad om att det finns ett Windowsalternativ.

## ”Locus of Attention”

Att kunna fokusera och komma in i flytet (”the Flow” eller ”<a href="http://athega.se/2009/08/12/in-i-zonen-som-systemutvecklare/">the Zone</a>”) är lika viktigt som verktygen du använder. Om du programmerar vill du att <em>platsen för din uppmärksamhet</em> (fritt översatt) ska vara din IDE. Inte din klienter för IM, Twitter eller email, etc. Med den mängd information vi utsätts för varje minut är detta svårare och svårare.

<ul>
	<li>Stäng av dina klienter för epost, twitter och IM och uppdatera dig då och då när du tar en paus från programmerandet</li>
	<li>Använd hörlurar för att visa att du inte vill bli störd</li>
	<li>Inför tysta timmar på kontoret, exempelvis mellan 14 och 16 varje dag då du verkligen kan fokusera</li>
</ul>

Neal menar exempelvis att Windows är som en treåring som konstant stör dig med påpekanden som ”<em>Du har oanvända ikoner på ditt skrivbord</em>", ”<em>Ditt virtuella minne håller på att ta slut</em>” eller ”<em>Det finns säkerhetsuppdateringar till din dator</em>”. För att ytterligare hjälpa dig att minska störande moment finns det verktyg, skärm-dimmers, som sakta släcker ner allt förutom ditt akiva fönster:

<ul>
	<li><a href="http://www.lachoseinteractive.net/en/products/doodim/">Doodim</a> (Mac)</li>
	<li><a href="http://www.anappaday.com/downloads/2006/09/day-10-jedi-concentrate.html">Jedi Concentrate</a> (Windows)</li>
</ul>

## Sök

En sökning slår alltid navigation med mus eller till och med tangentbord. Se till att du har en bra lokal sökmotor för din dator, som <a href="http://desktop.google.com/mac/">Google Desktop</a> (Mac/Windows) eller <a href="http://docs.blacktree.com/quicksilver/what_is_quicksilver">QuickSilver</a> (Mac). Neal menar att navigera i en trädstruktur i utforskaren eller i din IDE är som att berätta för datorn att du vet hur du använder musen. Om du vet vad filen heter - sök!

## Automatisera

Ett spiffigt användningsområde för <a href="http://seleniumhq.org/">Selenium</a> är faktiskt att automatisera ditt iterativa testande. Du kanske felsöker en funktion som kräver att du klickar dig igenom en sekvens, fyller i litet testdata och till slut når fram till funktionen du felsöker. Denna process kan bli ganska trist att upprepa om och om igen. Med <a href="http://seleniumhq.org/projects/ide/">Seleniums IDE</a>, som du installerar som ett plugin till Firefox, kan du enkelt spela in sekvensen en gång och sedan spela upp den varje gång du vill testa. Eller som Neal uttrycker det; ”<em>You should never manually interact with the thing you are building unless you want to</em>”.

Han avslutar med tänkvärda ”<em>Solving problems by hand, makes you dumber</em>”. Word!
