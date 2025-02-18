---
title: "Unobtrusive JavaScripts"
date: 2010-04-10
last_updated_by: peter
---
I fredags så började jag och en kollega hastigt prata lite angående kodkonventioner vilket alltid får igång mig då jag älskar att ha rent och strukturerat i mina projekt. Därför kom jag på att jag kan skriva en liten bloggpost om hur jag tänker när jag lägger upp mina javascript när jag kodar gränssnitt.

Jag är ett stort fan av <a href="http://en.wikipedia.org/wiki/Unobtrusive_JavaScript">Unobtrusive Javascripts</a> där man strävar efter att helt separera scriptdelen från sin html-content. Jag använder i dagsläget nästan alltid jQuery när jag kodar javascript. Jag tänker inte gå inte gå in djupare på hur det fungerar i denna bloggpost. Generellt när jag jobbar strävar jag åt <a href="http://en.wikipedia.org/wiki/Domain-driven_design">DDD</a>-hållet så att alla namespaces innehåll enkelt kan förstås av kunden, även om han inte har någon teknisk kunskap. (Självklart ligger oerhört mycket mer i konceptet DDD)

I mitt scenario jobbar jag med ett projekt som kallas "Acme". Jag utgår därför från en scriptfil som jag döper till <b>"acme.js"</b>. I den lägger jag funktionalitet som är gemensam för hela sidan. Den skulle kunna se ut såhär;

<pre lang="javascript">
var acme = function() {

	// Initierare
	var init = function() {
		// Initiera eventuella kontroller etc.
		// Anropa eventuella andra privata funktioner
		somePrivateFunction();
	},

	// Denna funktionen blir "privat" eftersom den inte returneras
	somePrivateFunction = function() {

	}

	return {
		init: init
	};
}();

$(function() {
	acme.init();
});
</pre>

När denna scriptfil körs på sidan kommer automatiskt init anropas efter dom:en har laddats. Då kan man där i manipulera dom:en eller kanske binda något event osv.

Säg sedan att mitt projekt innehåller ett forum som behöver specifik javascriptlogik som bara gäller för forumet. Jag skapar därför en <b>"acme.forum.js"</b> som skulle kunna se ut såhär;

<pre lang="javascript">
acme.forum = function() {
	var someVariable,

	// Initierare, bind knapphändelser m.m
	init = function() {
		$("#someButton").click(validateEmail);
	},

	// Validerar e-postadress
	validateEmail = function(event) {
		// Logik för validering
	}

	return {
		init: init
	};
}();

$(function() {
	acme.forum.init();
});
</pre>

Här bygger jag vidare på "acme" variabeln som vi tidigare skapat (eller "namespacet" om ni nu så vill). Enligt detta tänk fortsätter jag med alla delar av projektet.

När koden sedan skall ut i produktion brukar jag se till att minifiera och kombinera alla mina javascript (även tredjepartsbibliotek t.ex jQuery) till en enda fil vid namn <b>"acme.min.js"</b>. Detta gör jag för att få ner antalet requests så mycket som går och även få ner storleken på dem. Jag har haft nöjet att jobba ihop med <a href="http://twitter.com/robertnyman">Robert Nyman</a> som har en bra bloggpost om vilka minifierare som finns att tillgå i <a href="http://robertnyman.com/2010/01/19/tools-for-concatenating-and-minifying-css-and-javascript-files-in-different-development-environments/">denna posten</a>.

I mitt fall har jag använt <a href="http://yuicompressor.codeplex.com/Wikipage">YUI Compressor for .NET</a> som ett "post build-event" som även sköter minifiering av din CSS. Ett tips är att endast inkludera den minifierade CSS:en när det inte är debugg-kompilerat så blir det oerhört mycket enklare i utvecklingsprocessen.

/ Markus
