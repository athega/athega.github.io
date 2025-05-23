---
title: "Geotagga bilder"
date: 2009-03-04
tags:
  - blogg
last_updated_by: peter
---
<p style="text-align: left;">Att <a href="http://sv.wikipedia.org/wiki/Geotaggning" target="_blank">geotagga </a>bilder är att lagra koordinaterna för den geografiska positionen där bilden fotograferades i själva bildfilen. Det skapar många nya möjligheter för att t.ex. söka fram bilder och presentera dem på en karta. Tyvärr är det fortfarande inte många riktiga kameror (och då menar jag inte mobiltelefoner) som har inbyggd GPS vilket krävs för detta. Däremot är vanliga GPS-navigatorer väldigt vanliga nu för tiden, vissa av dem kan kontinuerligt lagra positionen till en spårfil.</p>

Jag tänkte därför presentera en liten guide hur man kan kombinera denna information i efterhand så att man får geotaggade bilder när man laddar över dem till datorn.

<ul>
	<li>Ladda över spårfilen/filerna i <a href="http://www.topografix.com/GPX/" target="_blank">GPX-format</a> från navigatorn till datorn. Du behöver vara så noga med att du hittar spåret från det exakta fototillfället. Om du t.ex. har en fil från varje dag på en resa, ta med allihopa.<img class="size-full wp-image-48 aligncenter" title="GPX fil från GPS navigator " src="/assets/legacy/uploads/2009/03/oregon.jpg" alt="GPX fil från GPS navigator " width="277" height="284" /></li>
	<li>Ladda över bilderna som JPG-filer från kameran till datorn. En viktig sak man inte får glömma innan man börjar fotografera är att ställa klockan rätt i kameran. Detta är avgörande för att kunna hitta positionen för det exakta tillfället för varje bild. Glöm inte eventuella inställningar för sommar/vintertid och tidszon. Om du märker tiden är fel för bilder du redan tagit bör du korrigera detta innan du fortsätter. <a href="http://www.sno.phy.queensu.ca/~phil/exiftool/" target="_blank">ExifTool</a> kan justera tiden, t.ex. framåt eller bakåt en timme om man har glömt ställa om för sommar/vintertid. Ett annat verktyg som klarar detta och möjligtvis är lite enklare är <a href="http://www.sentex.net/~mwandel/jhead/" target="_blank">jhead</a>.<img class="size-full wp-image-49 aligncenter" title="JPG-filer från en digitalkamera" src="/assets/legacy/uploads/2009/03/digicam-pics.jpg" alt="JPG-filer från en digitalkamera" width="281" height="251" /></li>
	<li>Nu behöver vi ett program som läser positionerna från spårfilen och skriver till bilderna. Programmet <a href="http://geotag.sourceforge.net/" target="_blank">Geotag</a> är just ett sådant som dessutom är snyggt, enkelt och gratis. (Open Source - GPL)</li>
	<li>Kolla sidorna <a href="http://geotag.sourceforge.net/?q=node/12" target="_blank">Quick start</a> och <a href="http://geotag.sourceforge.net/?q=node/2" target="_blank">Requirements</a> vad som krävs för att köra programmet. Man behöver Java och verktyget <a href="http://www.sno.phy.queensu.ca/~phil/exiftool/" target="_blank">ExifTool</a>, ladda ned det först och lägg filen i en körbar programkatalog. (t.ex. <em>C:\\Windows</em> på Windows)</li>
	<li>Har du redan <a href="http://java.com/sv/download/" target="_blank">Java 6</a> är det jätteenkelt, klicka bara <a href="http://geotag.sourceforge.net/geotag.jnlp" target="_blank">Run it now</a> så körs programmet direkt via Java Webstart utan att man behöver installera något. Första gången laddas det ned men sedan finns det sparat på datorn och en genväg har skapats på skrivbordet. Klicka på <em>"Kör"</em> för att lita på utgivaren av progmmet.</li>
	<li>Välj <em>Load tracks from file</em> från File-menyn. Du kan välja en eller flera filer, det gör som sagt inget om du får med spår från innan eller efter fototillfället. Ingenting syns på skärmen än.<img class="aligncenter size-full wp-image-50" title="Ladda filer i Geotag" src="/assets/legacy/uploads/2009/03/geotag-load.jpg" alt="Ladda filer i Geotag" width="466" height="400" /></li>
	<li>Välj sedan <em>Add image</em> eller <em>Add images from directory</em> beroende på om det är ett fåtal eller en alla bilder i en katalog du vill geotagga. Nu dyker alla bilder upp i en lista.</li>
	<li>Högerklicka på en godtycklig bild, välj <em>Find locations</em> &gt; <em>for all images</em>. Nu kommer listan uppdateras med latitud och longitud för alla bilder.<img class="aligncenter size-full wp-image-51" title="geotag-findloc" src="/assets/legacy/uploads/2009/03/geotag-findloc.jpg" alt="geotag-findloc" width="419" height="378" /></li>
	<li>Om det finns luckor i spåret från din GPS, dvs. att den inte har spelat in någon position för det exakta tillfället då bilden togs kan du använda funktionen <em>Fill gaps</em> för att räkna ut en mellanliggande position från de två närmast kända.</li>
	<li>Nästa steg är frivilligt men kan vara skoj. Högerklicka på en godtycklig bild, välj <em>Location names</em> &gt; <em>for all images</em>. Nu kommer programmet att gå ut på nätet och söka upp ortsnamn för alla positioner från <a href="http://www.geonames.org/" target="_blank">Geonames</a>. Ortsnamnen kommer att lagras som text i bildfilerna.<img class="aligncenter size-full wp-image-52" title="geotag-findnames" src="/assets/legacy/uploads/2009/03/geotag-findnames.jpg" alt="geotag-findnames" width="446" height="405" /></li>
	<li>Nu kan du spara ändringarna till bildfilerna. Välj <em>Save new locations</em> &gt; <em>All images</em>. <img class="aligncenter size-full wp-image-53" title="geotag-save" src="/assets/legacy/uploads/2009/03/geotag-save.jpg" alt="geotag-save" width="407" height="389" /></li>
	<li>Verktyget ExifTool som används för att skriva till bildfilerna kommer att skapa en backup-kopia av alla filer. Om man redan har en kopia av bildfilerna eller om de finns kvar på kamerans minneskort så är detta onödigt och tar bara extra lagringsutrymme. Detta kan man stänga av med inställningen <em>-overwrite_original</em>. Vill man att filerna skall behålla sin "Senast ändrad"-tid kan man även lägga in inställningen <em>-preserve</em>.<img class="aligncenter size-full wp-image-54" title="geotag-settings" src="/assets/legacy/uploads/2009/03/geotag-settings.jpg" alt="geotag-settings" width="440" height="409" /></li>
	<li>Klart!</li>
</ul>

/ [Johan](/johan)
