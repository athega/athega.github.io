---
title: "Athega bidrar till öppen källkod"
date: 2009-03-25
last_updated_by: peter
---
Athega har sedan länge, ända sedan starten 1997, arbetat mycket med programmeringsspråket <a href="http://perl.org/" target="_blank">Perl</a>. Vi använder oss i mycket stor utsträckning av öppna och fria mjukvaror och verktyg för de system vi bygger. Därför är även en stor del av den kod vi själva producerar befriad från licenskostnader och betraktas som “<a href="http://sv.wikipedia.org/wiki/Open_source" target="_blank">open source</a>” även om den kanske i vissa fall inte finns publikt tillgänglig på nätet.

Saker som går att återanvända och andra kan ha nytta av delar vi gärna med oss av. Ett exempel på detta är Perl-modulen <a href="http://search.cpan.org/~jobero/Geo-SweGrid-1.0/SweGrid.pm" target="_blank"><tt>Geo::SweGrid</tt></a> som används för att konvertera geografiska koordinater mellan det system som används globalt och det som används på vissa svenska kartor.

Det distribuerade arkivet för Perl-moduler heter <a href="http://cpan.org/" target="_blank">CPAN</a>, dit kan alla bidra med sin kod. När en modul väl finns i arkivet kan den lätt installeras på vilken dator som helst så här:


    [user@host ~]$ sudo cpan
    cpan shell -- CPAN exploration and modules installation (v1.9304) ReadLine support enabled
    cpan> install Geo::SweGrid

//[[Johan]]
