$(function() {
    'use strict';

    var $header = $('body > header');

    function resizeHeader() {
        $header.toggleClass('small', document.documentElement.scrollTop > 100);
    }

    $(window).on('scroll', resizeHeader);
    resizeHeader();
});
