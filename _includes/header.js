$(function() {
    'use strict';

    var mobileThreshold = 720,
        squizedHeaderThresh = 100;

    // Resize header on scroll
    function resizeHeader() {
        $('#site-header').toggleClass('small', window.innerWidth > mobileThreshold && window.pageYOffset > squizedHeaderThresh);
    }

    $(window).on('scroll', resizeHeader);
    resizeHeader();

});
