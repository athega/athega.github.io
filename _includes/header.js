$(function() {
    'use strict';

    var $header = $('body > header');

    function resizeHeader() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        $header.css('height', (4 - 2 * (Math.max(100, Math.min(200, scrollTop)) - 100) / 100) + 'em');
    }

    $(window).on('scroll', resizeHeader);
    resizeHeader();
});
