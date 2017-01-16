$(function() {
    'use strict';

    var $featuredBlog = $('.featured-blog'),
        $carousel = $featuredBlog.find(".owl-carousel");

    $carousel.owlCarousel({
        margin: 40,
        nav: true,
        dots: false,
        navContainer: ".owl-wrapper .slider-controls",
        responsive: {
            1024: {
                items: 3
            },
            720: {
                items: 2
            },
            0: {
                items: 1,
                margin: 0
            }
        }
    });

});
