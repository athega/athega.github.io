$(function() {
    'use strict';

    var $intro = $('.home-intro'),
        canvas = document.createElement('canvas'),
        $canvas = $(canvas),
        ctx = canvas.getContext('2d'),
        $header = $('body > header'),
        canvas2 = document.createElement('canvas'),
        ctx2 = canvas2.getContext('2d'),
        width, height, vmin, top, bottom, tx, ty, points, gradient,
        prevScrollTop = undefined,
        center,
        centerDist,
        maxDist,
        deviceMoved = false,
        pointerActive = false,
        deviceXOffset = 0,
        deviceYOffset = 0,
        pointerX = 0,
        pointerY = 0,
        startOrientation = undefined,
        animationFrameId,
        revealAngle = 0,
        revealRatio = 0,
        backgroundPosition = 0;

    $intro.prepend(canvas);
    $header.prepend(canvas2);

    function init() {
        width = canvas.width = Math.floor(canvas.offsetWidth / 2) || 320;
        height = canvas.height = Math.floor(canvas.offsetHeight / 2) || 240;
        vmin = Math.min(width, height);
        top = $intro.length ? $intro.offset().top : 0;
        bottom = top + (canvas.offsetHeight || height) - canvas2.offsetHeight;
        canvas2.width = Math.floor(canvas2.offsetWidth / 2);
        canvas2.height = Math.floor(canvas2.offsetHeight / 2);
        tx = Math.floor(width/32);
        ty = Math.floor(height/32);
        points = [];
        gradient = [];

        var tw = width / tx,
            th = height / ty,
            colorStops = [
                {r: 201, g:  40, b:  0, a: 1},
                {r: 216, g:  60, b:  0, a: 1},
                {r: 231, g:  80, b:  0, a: 1},
                {r: 246, g:  99, b:  0, a: 1},
                {r: 255, g: 148, b:  0, a: 1},
                {r: 255, g: 175, b:  1, a: 1},
                {r: 255, g: 201, b:  7, a: 1},
                {r: 255, g: 207, b: 45, a: 1},
                {r: 255, g: 222, b: 90, a: 1},
                {r: 255, g: 226, b: 127, a: 1},
                {r: 255, g: 226, b: 127, a: 0},
            ];

        for (var i = 0; i + 1 < colorStops.length; i++) {
            var c1 = colorStops[i],
                c2 = colorStops[i+1];
            for (var j = 0; j < 12; j++) {
                gradient.unshift({
                    r: Math.floor(c1.r + (c2.r - c1.r) * j / 12),
                    g: Math.floor(c1.g + (c2.g - c1.g) * j / 12),
                    b: Math.floor(c1.b + (c2.b - c1.b) * j / 12),
                    a:            c1.a + (c2.a - c1.a) * j / 12
                });
            }
        }

        for (var y = 0; y <= ty; y++) {
            points[y] = [];
            for (var x = 0; x <= tx; x++) {
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

        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(update);
    }

    init();

    if ('ontouchstart' in window) {
        $intro.on({
            'touchstart touchmove': function(event) {
                deviceMoved = true;
                pointerActive = true;
                var offset = $intro.get(0).getBoundingClientRect();
                pointerX = (event.originalEvent.targetTouches[0].clientX - offset.left) * 2 / canvas.offsetWidth - 1,
                pointerY = (event.originalEvent.targetTouches[0].clientY - offset.top) * 2 / canvas.offsetHeight - 1;
            },
            'touchend': function(event) {
                pointerActive = false;
            },
        });
    } else {
        $intro.on({
            'mousedown': function(event) {
                deviceMoved = true;
                pointerActive = true;
            },
            'mousemove': function(event) {
                deviceMoved = true;
                pointerX = deviceXOffset = (event.pageX) * 2 / canvas.offsetWidth - 1;
                pointerY = deviceYOffset = (event.pageY - top) * 2 / canvas.offsetHeight - 1;
            },
            'mouseup': function(event) {
                pointerActive = false;
            },
        });
    }

    $(window).on('deviceorientation', function(event) {
        var orientation = {
                alpha: event.originalEvent.alpha * Math.PI / 180,
                beta:  event.originalEvent.beta  * Math.PI / 180,
                gamma: event.originalEvent.gamma * Math.PI / 180
            };

        deviceMoved = true;

        if (startOrientation === undefined) {
            startOrientation = orientation;
        }

        var normal = {x: 0, y: 0, z: 1};
        normal = rotateX(normal, orientation.beta);
        normal = rotateY(normal, orientation.gamma);
        normal = rotateY(normal, -startOrientation.gamma);
        normal = rotateX(normal, -startOrientation.beta);
        normal = rotateZ(normal, -startOrientation.alpha);

        if (window.orientation == 90) {
            normal = {x: normal.y, y: -normal.x, z: normal.z};
        } else if (window.orientation == -90) {
            normal = {x: -normal.y, y: normal.x, z: normal.z};
        }

        deviceXOffset = Math.max(-1, Math.min(1, -normal.x * 2));
        deviceYOffset = Math.max(-1, Math.min(1, -normal.y * 2));
    });

    function rotateX(p3, angle) {
        var p2 = rotate({a: p3.y, b: p3.z}, angle);
        return {x: p3.x, y: p2.a, z: p2.b};
    }

    function rotateY(p3, angle) {
        var p2 = rotate({a: p3.x, b: p3.z}, angle);
        return {x: p2.a, y: p3.y, z: p2.b};
    }

    function rotateZ(p3, angle) {
        var p2 = rotate({a: p3.x, b: p3.y}, angle);
        return {x: p2.a, y: p2.b, z: p3.z};
    }

    function rotate(p, angle) {
        var sin = Math.sin(angle),
            cos = Math.cos(angle);

        return {
            a: p.a * cos - p.b * sin,
            b: p.b * cos + p.a * sin
        };
    }

    $(window).on('orientationchange', function(event) {
        startOrientation = undefined;
        init();
    });

    function update() {
        var currentScrollTop = window.pageYOffset || document.documentElement.scrollTop,
            pageScrolled = currentScrollTop != prevScrollTop;

        if ((pageScrolled || deviceMoved) && currentScrollTop < bottom || prevScrollTop === undefined) {
            var scrollRatio = Math.min(1, currentScrollTop / (canvas.offsetHeight || height));

            revealAngle = Math.min(Math.PI, Math.max(0, revealAngle += pointerActive ? 0.1 : -0.1));
            revealRatio = (1 - Math.cos(revealAngle)) / 2;

            if (revealRatio > 0) {
                $canvas.css('background-position', (canvas.offsetWidth < 960 ? 'left' : 'center') + ' ' + (backgroundPosition -= 2) + 'px');
                ctx.clearRect(0, 0, width, height);
            } else {
                deviceMoved = false;
            }

            center = {
                x: width/3*2 - scrollRatio * width/3      + deviceXOffset * width / 6,
                y: height/3  + scrollRatio * height * 2/3 + deviceYOffset * height / 4
            };
            center.x = center.x * (1 - revealRatio) + (width + pointerX * width) / 2 * revealRatio;
            center.y = center.y * (1 - revealRatio) + (height + pointerY * height) / 2 * revealRatio;
            centerDist = {x: Math.max(center.x, width - center.x), y: Math.max(center.y, height - center.y)};
            maxDist = Math.sqrt(centerDist.x * centerDist.x + centerDist.y * centerDist.y);

            ctx.save();
            ctx.translate(0, height * 0.8 * scrollRatio);
            ctx.scale(1, 1 - 0.7 * scrollRatio);

            draw();
            ctx.restore();

            ctx2.drawImage(canvas, 0, Math.min(height * scrollRatio, height - canvas2.height), width, canvas2.height, 0, 0, canvas2.width, canvas2.height);

            $intro.css('background-position', 'calc(50% - ' + (160 * scrollRatio + deviceXOffset * 16) + 'px) calc(50% + ' + (currentScrollTop / 2 - deviceYOffset * 12) + 'px)');

            prevScrollTop = currentScrollTop;
        }

        animationFrameId = requestAnimationFrame(update);
    }

    function draw() {
        for (var y = 0; y < ty; y++) {
            for (var x = 0; x < tx; x++) {
                var p1 = gravitate(points[y][x]),
                    p2 = gravitate(points[y][x+1]),
                    p3 = gravitate(points[y+1][x+1]),
                    p4 = gravitate(points[y+1][x]);

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

    function gravitate(p) {
        var x = p.x,
            y = p.y,
            dx = center.x - x,
            dy = center.y - y,
            dist = Math.sqrt(dx * dx + dy * dy),
            ratio = (20 + 0.3 * vmin * revealRatio) * Math.pow(1 - dist / maxDist, 1.6);

        if (x > 0 && Math.round(x) < width) {
            x -= dx / dist * ratio;
        }

        if (y > 0 && Math.round(y) < height) {
            y -= dy / dist * ratio;
        }

        return {x: x, y: y};
    }

    function poly(p1, p2, p3) {
        var cx = (p1.x + p2.x + p3.x) / 3,
            cy = (p1.y + p2.y + p3.y) / 3,
            dx = cx - center.x,
            dy = cy - center.y,
            dist = Math.sqrt(dx * dx + dy * dy),
            gradentStart = 12,
            gradentOffset = revealRatio * 0.4 * vmin,
            gradientIndex = gradentStart - gradentOffset + (gradient.length - gradentStart + gradentOffset) * dist / maxDist,
            c = gradient[Math.max(Math.min(Math.floor(gradientIndex), gradient.length - 1), 0)];

        if (gradientIndex > 0) {
            ctx.strokeStyle = ctx.fillStyle = 'rgba(' + [c.r, c.g, c.b, c.a].join(',') + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

//        ctx.fillStyle = 'rgb(0,0,255)';
//        ctx.fillRect(p1.x-1, p1.y-1, 2, 2);
//        ctx.fillRect(p2.x-1, p2.y-1, 2, 2);
//        ctx.fillRect(p3.x-1, p3.y-1, 2, 2);
    }

});
