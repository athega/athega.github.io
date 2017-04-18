$(function() {
    'use strict';

    var $intro = $('.home-intro'),
        foregroundCanvas = $intro.find('> canvas').get(0),
        canvas = document.createElement('canvas');

    $intro.prepend(canvas);


    var width = canvas.width = canvas.offsetWidth,
        height = canvas.height = canvas.offsetHeight,
        aspect = width / height,
        bottom = -1,
        top = 1,
        left = -1,
        right = 1,
        gl = canvas.getContext("webgl"),
        shaderProgram,
        cols = Math.floor(width / 40),
        rows = Math.floor(height / 40),
        vertices = [],
        vertexCount = rows * cols * 6;

    if (aspect > 1) {
        bottom /= aspect;
        top /= aspect;
    } else {
        left *= aspect;
        right *= aspect;
    }

    gl.viewport(0, 0, width, height);

    createShaders();
    createVertices();

    var image = new Image();
    image.src = "/assets/img/riddarfjarden.jpg";
    image.onload = function() {
        createTexture(image);
        draw();
    };

    function createShaders() {
        var vertexShader = getShader(gl.VERTEX_SHADER, `
            attribute vec4 coords;

            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;

            uniform vec4 bounds;
            uniform float aspect;
            uniform vec2 clipCenter;
            uniform float revealRatio;

            void main(void) {

                gl_Position = coords;

                float maxDist = length(vec2(1.0, 1.0) + abs(clipCenter));
                vec2 d = clipCenter - coords.xy;
                float dist = length(d);
                float ratio = 0.2 * revealRatio * pow(1.0 - dist / maxDist, 1.6);

                if (dist > 0.0 && gl_Position.x > bounds.s && gl_Position.x < bounds.t) {
                    gl_Position.x -= d.x / dist * ratio;
                }

                if (dist > 0.0 && gl_Position.y > bounds.p && gl_Position.y < bounds.q) {
                    gl_Position.y -= d.y / dist * ratio;
                }

                if (aspect > 1.0) {
                    gl_Position.y *= aspect;
                } else {
                    gl_Position.x /= aspect;
                }

                v_texCoord = a_texCoord;

                gl_PointSize = 4.0;
            }
        `);

        var fragmentShader = getShader(gl.FRAGMENT_SHADER, `
            precision mediump float;
            uniform sampler2D u_image;
            uniform vec2 view;
            uniform vec2 viewCenter;
            uniform vec2 backgroundPosition;
            uniform float revealRatio2;
            varying vec2 v_texCoord;
            void main(void) {
                vec2 d = viewCenter - gl_FragCoord.xy;
                float dist = length(d);
                float vmin = min(view.x, view.y);
                gl_FragColor = texture2D(u_image, v_texCoord + backgroundPosition);
                gl_FragColor.rgb = 1.0 - gl_FragColor.rgb;
                gl_FragColor.rgb *= smoothstep(revealRatio2 * vmin * 0.5, revealRatio2 * vmin * 0.6, dist) * revealRatio2 + (1.0 - revealRatio2);
                gl_FragColor.rgb = 1.0 - gl_FragColor.rgb;
            }
        `);

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);
    }

    function getShader(type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    function createVertices() {
        for (var y = 0; y < rows; y++) {
            var down1 = y / rows,
                down2 = (y+1) / rows;
            for (var x = 0; x < cols; x++) {
                var across1 = x / cols,
                    across2 = (x+1) / cols,
                    x1 = left + (right - left) * across1,
                    x2 = left + (right - left) * across2,
                    y1 = bottom + (top - bottom) * down1,
                    y2 = bottom + (top - bottom) * down2;

                vertices.push(x1, y1,  x2, y1,  x2, y2);
                vertices.push(x1, y1,  x2, y2,  x1, y2);
            }
        }

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var coords = gl.getAttribLocation(shaderProgram, "coords");
        gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coords);

        var viewAttrib = gl.getUniformLocation(shaderProgram, "view");
        gl.uniform2f(viewAttrib, width, height);

        var aspectAttrib = gl.getUniformLocation(shaderProgram, "aspect");
        gl.uniform1f(aspectAttrib, aspect);

        var bounds = gl.getUniformLocation(shaderProgram, "bounds");
        gl.uniform4f(bounds, left, right, bottom, top);
    }

    function createTexture(image) {


        var texCoords = [],
            overscan = 24,
            imageAspect = image.width / (image.height - overscan),
            top = 1 - (overscan / 2 / image.height),
            bottom = 0 + (overscan / 2 / image.height),
            left = 0,
            right = 1;

        if (aspect > imageAspect) {
            top = imageAspect / aspect;
            top += bottom = (1 - top) / 2;
        } else {
            right = aspect / imageAspect;
            right += left = (1 - right) / 2;
        }

        for (var y = 0; y < rows; y++) {
            var down1 = y / rows,
                down2 = (y+1) / rows;
            for (var x = 0; x < cols; x++) {
                var across1 = x / cols,
                    across2 = (x+1) / cols,
                    x1 = left + (right - left) * across1,
                    x2 = left + (right - left) * across2,
                    y1 = top + (bottom - top) * down1,
                    y2 = top + (bottom - top) * down2;

                texCoords.push(x1, y1,  x2, y1,  x2, y2);
                texCoords.push(x1, y1,  x2, y2,  x1, y2);
            }
        }

        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

        var texCoordLocation = gl.getAttribLocation(shaderProgram, "a_texCoord");
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);


        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }

    function draw() {
        var center = $intro.data('center') || {x: 0, y: 0},
            clipCenter = {
                x: mapRange(center.x, 0, foregroundCanvas.width, -1, 1),
                y: mapRange(center.y, 0, foregroundCanvas.height, 1, -1) / aspect,
            },
            viewCenter = {
                x: mapRange(center.x, 0, foregroundCanvas.width, 0, canvas.width),
                y: mapRange(center.y, 0, foregroundCanvas.height, canvas.height, 0),
            };

        var clipCenterLoc = gl.getUniformLocation(shaderProgram, "clipCenter");
        gl.uniform2f(clipCenterLoc, clipCenter.x, clipCenter.y);

        var viewCenterLoc = gl.getUniformLocation(shaderProgram, "viewCenter");
        gl.uniform2f(viewCenterLoc, viewCenter.x, viewCenter.y);

        var backgroundPosition = $intro.data('backgroundPosition') || {x: 0, y: 0};
        var backgroundPositionLoc = gl.getUniformLocation(shaderProgram, "backgroundPosition");
        gl.uniform2f(backgroundPositionLoc, backgroundPosition.x / image.width, -backgroundPosition.y / image.height);

        var revealRatio = $intro.data('revealRatio') || 0;
        var revealRatioLoc = gl.getUniformLocation(shaderProgram, "revealRatio");
        gl.uniform1f(revealRatioLoc, revealRatio);

        var revealRatio2Loc = gl.getUniformLocation(shaderProgram, "revealRatio2");
        gl.uniform1f(revealRatio2Loc, revealRatio);

        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

        requestAnimationFrame(draw);
    }

    function mapRange(value, minSrc, maxSrc, minDst, maxDst) {
        return (value - minSrc) / (maxSrc - minSrc) * (maxDst - minDst) + minDst;
    }

});
