---
title: "HTML5 och canvas"
date: 2009-07-08
last_updated_by: peter
---
Rita, animera och kontrollera pixlarna på webbsidan. Den nya canvas-taggen i HTML5 revolutionerar det som är möjligt att göra i en webbapplikation eller webbsida.

Det bubblar av exempel på och demonstrationer av vad som är möjligt med webbläsare som har stöd för HTML5. I skrivandets stund kan man slarvigt säga att det är de flesta större alternativen till Internet Explorer som visar framfötterna. Firefox, Safari och Opera är alla långt framme vad gäller stöd för HTML5. Microsoft är <a title="Implementations in Web browsers" href="http://wiki.whatwg.org/wiki/Implementations_in_Web_browsers">inte riktigt med i matchen</a> ännu. men <a title="What's New in Internet Explorer 8" href="http://msdn.microsoft.com/en-us/library/cc288472%28VS.85%29.aspx#compat">jobbar på det</a>, i alla fall enligt egen utsago. Tyvärr är det ju så att IE måste med, för att vi ska kunna börja använda oss av HTML5-specifika funktioner på riktigt.

## Den populära spegeleffekten

<a href="http://www.athega.se/files/canvas_mirror.html"><img class="size-medium wp-image-292  alignright" title="Spegeleffekt med canvas-taggen" src="/assets/legacy/uploads/2009/07/Spegeleffekt-med-canvas-111x300.jpg" alt="Spegeleffekt med canvas-taggen" width="67" height="180" /></a>

Vi ska titta på hur man kan skapa en spegeleffekt av exempelvis en bild med hjälp av canvas-taggen. Jag har använt två canvas-taggar, en för huvudbilden och en för den reflekterande ytan. Huvudbilden hade kunnat visas med en vanlig img-tagg, men jag ville ha möjligheten att "rita" och animera bilden också. Bilden föreställer min yngsta son, Carl.

Principen är enkel; skapa en canvas-tagg med vanlig markup, rita i den med JavaScript.

### 1. Skapa canvas-taggar

Börja med att definiera två canvas att rita i.

    <canvas id="myCanvas" width="164" height="258">
      <p>Din webbläsare har inte stöd för canvas-taggen</p>
    </canvas><br/>
    <canvas id="mirrorCanvas" width="164" height="258"></canvas>

Innehållet i canvas-taggen är valfritt, men är tänkt att visas för äldre webbläsare eller webbläsare som helt enkelt inte har stöd för canvas-taggen (Varning: tidiga versioner av Safari visade dock detta innehåll). För att enkelt komma åt canvasytorna ger vi dem varsitt ID och en definierad storlek.

### 2. Ladda huvudbilden

    var mainCanvas = document.getElementById('myCanvas');
    var mainCtx = mainCanvas.getContext('2d');

    var img = new Image();
    img.src = 'carl.jpg';
    img.onload = function() {
      mainCtx.drawImage(img, 0, 0);
    };

För att komma åt pixlarna i canvas-ytan, hämtas ett 2d-kontext, som sedan används av <code>drawImage</code> för att rita bilden.

### 3. Skapa spegeleffekten

    var mirrorCanvas = document.getElementById('mirrorCanvas');
    var mirrorCtx = mirrorCanvas.getContext('2d');

    var mainData = mainCtx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
    var mirrorData = mirrorCtx.getImageData(0, 0, mirrorCanvas.width, mirrorCanvas.height);

    var gradientStep = 70 / mainData.height;
    for (var x = 0; x < mainData.width; x++) {
      var currentAlpha = 0;
      for (var y = 0; y < mainData.height ; y++) {
        var mainIdx = (x + y * mainData.width) * 4;
        var mirrorIdx = (x + (mainData.height - 1 - y) * mainData.width) * 4;
        for (p=0; p<3; p++) {
          mirrorData.data[mirrorIdx+p] = mainData.data[mainIdx+p];
        }
        mirrorData.data[mirrorIdx + 3] = currentAlpha;

        currentAlpha += gradientStep;
      }
    }

    mirrorCtx.putImageData(mirrorData, 0, 0);

Vi börjar med att hämta pixelarrayer för både huvudbilden och den spegelvända bilden. Detta görs med funktionen <code>getImageData</code>. Den returnerar en platt array med fyra poster för varje pixel. Dessa är i turordning värden för pixelns röda-, gröna-, blåa- och alphavärden.

Huvudbildens pixlar stegas sedan igenom kolumnvis, så att vi kan skapa en reflektion genom att gradvis öka värdet på alphakanalen från 0 till 70 (255 är max). Jag läser uppifrån och ner i huvudbilden, men ritar nerifrån och upp i spegelbilden och får på så sätt bilden spegelvänd.

Till sist uppdaterar vi spegelytan med den modifierade pixelarrayen genom att anropa <code>putImageData</code>.

### 4. Ett fungerande exempel

<a href="http://www.athega.se/files/canvas_mirror.html">Här</a> finns ett fungerade exempel. För att visa att spegelytan är levande, har jag lagt till en animering som startas och stoppas genom att klicka i bilden. Tänk på att du behöver en hyfsat uppdaterad webbläsare som inte är Internet Explorer.

HTML och JavaScript:

<ul>
  <li><a href="http://www.athega.se/files/canvas_mirror.html">canvas_mirror.html</a></li>
  <li><a href="http://www.athega.se/files/canvas_mirror.js">canvas_mirror.js</a></li>
</ul>

### Avslutningsvis, några imponerande canvas-exempel

<a href="http://gyu.que.jp/jscloth/touch.html"><img src="/assets/legacy/uploads/2009/07/js-touch.jpg" alt="Realtidsrendrering av 3D-modell av en iPod Touch" title="js touch" width="250" height="245" class="size-full wp-image-311" /></a>

<a href="http://www.kevs3d.co.uk/dev/asteroids/"><img src="/assets/legacy/uploads/2009/07/Asteroids-HTML-5-Canvas-and-JavaScript-demo.jpg" alt="Ett fullt fungerade Asteroids implementerat endast med Canvas och JavaScript" title="Asteroids - HTML 5 Canvas and JavaScript demo" width="184" height="219" class="size-full wp-image-312" /></a>

<a href="http://blog.mozbox.org/post/2009/04/12/Firefox-35%3A-a-new-experiment-with-Canvas-Video"><img src="/assets/legacy/uploads/2009/07/Dynamic-Content-Injection.jpg" alt="Ett canvas tillsammans med bland annat video-taggen för att analysera var de två iPhone-telfonerna är och i realtid uppdatera innehållet mellan dem med exempelvis innehållet från en annan video-tagg." title="Dynamic Content Injection" width="217" height="288" class="size-full wp-image-314" /></a>

## Läs mer

<ul>
  <li><a href="http://developer.mozilla.org/en/Canvas_tutorial">Mozilla Developer Tutorial</a></li>
  <li>Bloggat om canvas på <a href="http://hacks.mozilla.org/category/canvas/">hacks.mozilla.org</a></li>
  <li><a href="http://www.nihilogic.dk/labs/canvas_sheet/HTML5_Canvas_Cheat_Sheet.png">Canvas Cheat Sheet</a></li>
</ul>

/ [Chrille](/chrille)
