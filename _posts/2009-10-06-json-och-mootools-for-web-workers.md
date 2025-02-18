---
title: "JSON och MooTools för Web Workers"
date: 2009-10-06
last_updated_by: peter
---
<a href="http://mootools.net/" target="_blank">MooTools</a> är en trevlig verktygslåda som främst är tänkt för att skriva JavaScript-kod som manipulerar element på en webbsida och skapar animeringar och grafiska effekter. Därför är den starkt knuten till objekten <code><b>window</b></code> och <code><b>document</b></code> som finns i det globala kontextet när JavaScript-kod körs på en vanlig webbsida.

## MooTools i Worker-kontext

Men MooTools har även hjälpmedel för att skriva objektorienterad kod samt en del utökningar och förbättringar för språket som sådant. Om man vill dra nytta av detta för kod som körs i ett annat sammanhang där <code><b>window</b></code> och <code><b>document</b></code> inte finns tillgängliga, t.ex. i en Web Worker tråd, vad gör man för att få mootools att fungera då?
En variant är att skapa mock-up objekt för att maskera det faktum att objekten inte finns, tomma skelett som bara innehåller det nödvändigaste för att mootools skall kunna laddas utan fel. Självklart ger inte detta tillgång till någon funktionalitet som är beroende av dessa objekt men övriga funktioner finns på plats.

    // If we're in a worker we need to masquerade the global context and load mootools
    if (self.importScripts) {
      document = {
        prototype: function() {},
        createElement: function() {},
        getElementsByTagName: function() {return []}
      };
      window = {
        document: document,
        Document: document,
        Element: { prototype: function() {} },
        Window:  { prototype: function() {} },
        addEventListener: function() {},
        attachEvent: function() {},
      };
      self.importScripts('mootools.js');
    }


## Skicka objekt till Workers

Eftersom Web Workers är helt isolerade från webbsidan, dvs. inte har tillgång till något delat minne, går det inte att skicka objekt till dem hur som helst. Enda sättet att kommunicera är genom att posta meddelanden som bara kan överföra strängar. Självklart kan man då serialisera objekten till JSON och skicka med dem.

### Varför heter det JSON?

Vad jag då skulle vilja reflektera över är varför det kallas <i>JavaScript <b>Object</b> Notation</i>. Ett objekt är ju en sak som vet vad den är och kan göra saker själv, dvs. en datastruktur med tillhörande kod som beskriver hur den skall uppföra sig.
När man serialiserar ett objekt till en JSON-sträng försvinner alla kodreferenser, dvs. objektets metoder, kvar har man bara datastrukturen. Därför kan det tyckas vara mer korrekt att det borde kallas <i>JavaScript <b>Data</b> Notation</i>

### Välsigna datastrukturer

Vad gör vi då för att kunna använda datastrukturer som blivit deserialiserade från JSON som fullfjädrade objekt? Vi kan välsigna dem tillbaka till sin klasstillhörighet genom att koppla ihop datastrukturen med metoderna från klassen igen. Därför skapar vi en en konstruktor som heter <code><b>bless</b></code> i basklassen för alla klasser <code><b>Class</b></code> som tar en datastruktur och utökar en ny instans av klassen med denna.

    // Contructor that returns a new instance of this class
    // extended with all properties of the given data structure
    Class.prototype.bless = function(data) {
      return $extend(new this(), data);
    };

Då kan vi sedan göra exempelvis så här:

    var MyClass = new Class({
      myData: "Hello, world!",
      doStuff: function() {
        alert(this.myData);
      }
    });

    var myObject = new MyClass();
    var string = JSON.encode(myObject);

    var data = JSON.decode(string);
    // data.doStuff();  <--- Not possible here
    var newObject = MyClass.bless(data);
    newObject.doStuff();

På så vis kan man återskapa objekt som är identiska med de som skickades trots att de har blivit omvandlade till och från en ren textsträng på vägen.

/ [Johan](/johan)
