$(function() {
    'use strict';

    var $header = $('body > header'),
        mobileThreshold = 720,
        squizedHeaderThresh = 100;

    // Resize header on scroll
    function resizeHeader() {
        $header.toggleClass('small', window.innerWidth > mobileThreshold && window.pageYOffset > squizedHeaderThresh);
    }

    $(window).on('scroll', resizeHeader);
    resizeHeader();

});
