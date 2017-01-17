$(function() {
    'use strict';

    var $intro = $('body > section.intro'),
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    $intro.prepend(canvas);

    var width = 320,
        height = 240,
        tx = 10,
        ty = 8,
        tw = width / tx,
        th = height / ty,
        points = [],
        colorStops = [
            {r: 201, g:  40, b:  0},
            {r: 216, g:  60, b:  0},
            {r: 231, g:  80, b:  0},
            {r: 246, g:  99, b:  0},
            {r: 255, g: 148, b:  0},
            {r: 255, g: 175, b:  1},
            {r: 255, g: 201, b:  7},
            {r: 255, g: 207, b: 45},
            {r: 255, g: 222, b: 90},
            {r: 255, g: 226, b: 127},
        ],
        gradient = [];

    canvas.width = width;
    canvas.height = height;


    for (var i = 0; i + 1 < colorStops.length; i++) {
        var c1 = colorStops[i],
            c2 = colorStops[i+1];
        for (var j = 0; j < 12; j++) {
            gradient.unshift({
                r: Math.floor(c1.r + (c2.r - c1.r) * j / 12),
                g: Math.floor(c1.g + (c2.g - c1.g) * j / 12),
                b: Math.floor(c1.b + (c2.b - c1.b) * j / 12)
            });
        }
    }

    for (var y = 0; y < ty + 1; y++) {
        points[y] = [];
        for (var x = 0; x < tx + 1; x++) {
            var p = {
                x: x * tw,
                y: y * th
            };

            if (x > 0 && x < tx) {
                p.x += (y % 2) * tw * 0.2 - tw * 0.1;
                p.x += Math.random() * tw * 0.5 - tw * 0.25;
            }

            if (y > 0 && y < ty) {
                p.y -= (x % 2) * th * 0.2 - th * 0.1;
                p.y += Math.random() * th * 0.5 - th * 0.25;
            }

            points[y][x] = p;
        }
    }


    var bottom = $(canvas).offset().top + $(canvas).height(),
        prevScrollTop = undefined,
        center,
        centerDist,
        maxDist;

    function update() {
        var currentScrollTop = document.documentElement.scrollTop;
        if (currentScrollTop != prevScrollTop && currentScrollTop < bottom) {

            var scrollRatio = Math.min(1, currentScrollTop / canvas.offsetHeight);

            center = {x: width/3*2 - scrollRatio * width/3, y: height/3 + scrollRatio * height * 2/3},
            centerDist = {x: Math.max(center.x, width - center.x), y: Math.max(center.y, width - center.y)},
            maxDist = Math.sqrt(centerDist.x * centerDist.x + centerDist.y * centerDist.y);

            ctx.save();
            ctx.translate(0, height * 0.8 * scrollRatio);
            ctx.scale(1, 1 - 0.7 * scrollRatio);

            draw();
            ctx.restore();


            prevScrollTop = currentScrollTop;
        }

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);


    function draw() {
        for (var y = 0; y < ty; y++) {
            for (var x = 0; x < tx; x++) {

                var p1 = points[y][x],
                    p2 = points[y][x+1],
                    p3 = points[y+1][x+1],
                    p4 = points[y+1][x];

                if (!(x % 2) != !(y % 2)) {
                    poly(p1, p2, p3);
                    poly(p1, p3, p4);
                } else {
                    poly(p2, p3, p4);
                    poly(p2, p4, p1);
                }
            }
        }
    }

    function poly(p1, p2, p3) {

        var cx = (p1.x + p2.x + p3.x) / 3,
            cy = (p1.y + p2.y + p3.y) / 3,
            dx = cx - center.x,
            dy = cy - center.y,
            dist = Math.sqrt(dx * dx + dy * dy),
            c = gradient[Math.floor(gradient.length * dist / maxDist)];

        ctx.strokeStyle = ctx.fillStyle = 'rgb(' + [c.r, c.g, c.b].join(',') + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

});
