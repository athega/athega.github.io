$(function() {
    'use strict';

    var $code = $('.home-intro > div > code'),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        scale = 4,
        x, y, px, py, animationFrameId;

    canvas.width = $code.outerWidth() / scale;
    canvas.height = $code.outerHeight() / scale;
    $code.css('mask-image', 'url(' + canvas.toDataURL() + ')');

    if ($code.css('mask-image'))
        $code.css('display', 'block');

    ctx.lineCap = 'round';
    ctx.lineWidth = 20;

    $code.on('mousemove', function(event) {
        var offset = $code.offset();
        x = (event.pageX - offset.left) / scale,
        y = (event.pageY - offset.top) / scale;

        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(update);
    });

    $code.on('touchmove', function(event) {
        var offset = $code.get(0).getBoundingClientRect();
        x = (event.originalEvent.targetTouches[0].clientX - offset.left) / scale,
        y = (event.originalEvent.targetTouches[0].clientY - offset.top) / scale;

        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(update);
        event.preventDefault();
    });

    function update() {
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
        px = x, py = y;
        $code.css('mask-image', 'url(' + canvas.toDataURL() + ')');
    }

});
