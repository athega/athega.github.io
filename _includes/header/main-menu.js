$(function() {
    'use strict';

    var $mainMenu = $('#main-menu'),
        $button = $('#main-menu-button');

    $button.on('click', function(event) {
        $mainMenu.toggleClass('visible');
        event.preventDefault();
    });

});
