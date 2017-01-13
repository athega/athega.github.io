$(function() {
    'use strict';

    var GLOBAL = {
        smallTabletThreshold: 960,
        mobileThreshold: 720,
        menuVisible: false,
        squizedHeaderThresh: 100
    };

    // Resize header on scroll
    function resizeHeader() {
        $('#site-header').toggleClass('small', window.innerWidth > GLOBAL.mobileThreshold && window.pageYOffset > GLOBAL.squizedHeaderThresh);
    }

    $(window).on('scroll', resizeHeader);
    resizeHeader();

    // Ignore empty # links and create smooth scroll
    function initAnchors() {
        $('a[href*="#"]:not([href="#"])').click(function() {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        });
        $('a[href="#"]').click(function(event){
            event.preventDefault();
        });
    }

    // Initialize hidden header menu
    function initHeaderMenu() {
        var button = $('#main-menu-button');
        GLOBAL.toggleMenu = function(key) {
            if (key == 'close' || GLOBAL.menuVisible) {
                $('#main-menu').removeClass('visible');
                GLOBAL.menuVisible = false;
            }
            else if (key == 'open' || !GLOBAL.menuVisible) {
                $('#main-menu').addClass('visible');
                GLOBAL.menuVisible = true;
            }
        };
        button.on('click', function(){
            GLOBAL.toggleMenu();
        });
    }

    initAnchors();
    initHeaderMenu();

    $(".owl-carousel").owlCarousel({
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
