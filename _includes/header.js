$(function() {
    'use strict';

    var $header = $('body > header');

    function resizeHeader() {
        $header.css('height', (4 - 2 * (Math.max(100, Math.min(200, document.documentElement.scrollTop)) - 100) / 100) + 'em');
    }

    $(window).on('scroll', resizeHeader);
    resizeHeader();
});
