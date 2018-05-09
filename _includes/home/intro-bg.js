$(function() {
    'use strict';

    var $intro = $('.home-intro');

    if (!$intro.length) return;

    var foregroundCanvas = $intro.find('> canvas').get(0),
        canvas = document.createElement('canvas'),
        gl = canvas.getContext('webgl'),
        image = new Image(),
        width,
        height,
        shaderProgram,
        vertexCount,
        textureBounds;

    $intro.prepend(canvas);

    function init() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        gl.viewport(0, 0, width, height);
    }

    init();
    createShaders();
    createVertices();

    image.src = "/assets/img/riddarfjarden.jpg";
    image.onload = function() {
        createTexture(image);
        draw();
        $intro.on('updateBackground', draw);
    };

    $(window).on('resize orientationchange', function(event) {
        init();
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(getTextureCoords()));
    });

    function createShaders() {
        var vertexShader = getShader(gl.VERTEX_SHADER, `
            attribute vec4 coords;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;

            void main(void) {
                gl_Position = coords;
                v_texCoord = a_texCoord;
            }
        `);

        var fragmentShader = getShader(gl.FRAGMENT_SHADER, `
            precision mediump float;
            uniform sampler2D u_image;
            uniform vec2 view;
            uniform vec2 viewCenter;
            uniform vec2 textureCenter;
            uniform vec2 backgroundPosition;
            uniform float revealRatio;
            varying vec2 v_texCoord;
            void main(void) {
                float maxDist = length(view);
                float dist = length(viewCenter - gl_FragCoord.xy / 10.0);
                float ratio = revealRatio * pow(1.0 - dist / maxDist, 6.0);
                float vmin = min(view.x, view.y);
                gl_FragColor = texture2D(u_image, v_texCoord + ((textureCenter - v_texCoord) * ratio) + backgroundPosition);
                gl_FragColor.rgb = 1.0 - gl_FragColor.rgb;
                gl_FragColor.rgb *= smoothstep(revealRatio * vmin * 0.5, revealRatio * vmin * 0.6, dist) * revealRatio + (1.0 - revealRatio);
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
        var vertices = [
            -1, -1,  1, -1,   1, 1,
            -1, -1,  1,  1,  -1, 1
        ];

        vertexCount = vertices.length / 2;

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var coords = gl.getAttribLocation(shaderProgram, "coords");
        gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coords);
    }

    function getTextureCoords() {
        var overscan = 24,
            aspect = width / height,
            imageAspect = image.width / (image.height - overscan),
            top = 0 + (overscan / 2 / image.height),
            bottom = 1 - (overscan / 2 / image.height),
            left = 0,
            right = 1;

        if (aspect > imageAspect) {
            bottom = imageAspect / aspect;
            bottom += top = (1 - bottom) / 2;
        } else {
            right = aspect / imageAspect;
            right += left = (1 - right) / 2;
        }

        var texCoords = [
            left, bottom,  right, bottom,  right, top,
            left, bottom,  right, top,     left, top
        ];

        textureBounds = {
            left: left,
            top: top,
            right: right,
            bottom: bottom,
        };

        return texCoords;
    }

    function createTexture() {
        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getTextureCoords()), gl.STATIC_DRAW);

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
            textureCenter = {
                x: mapRange(center.x, 0, foregroundCanvas.width, textureBounds.left, textureBounds.right),
                y: mapRange(center.y, 0, foregroundCanvas.height, textureBounds.top, textureBounds.bottom),
            },
            viewCenter = {
                x: mapRange(center.x, 0, foregroundCanvas.width, 0, canvas.width),
                y: mapRange(center.y, 0, foregroundCanvas.height, canvas.height, 0),
            };

        var textureCenterLoc = gl.getUniformLocation(shaderProgram, "textureCenter");
        gl.uniform2f(textureCenterLoc, textureCenter.x, textureCenter.y);

        // Divide to work around limited mediump float precision.
        var viewCenterLoc = gl.getUniformLocation(shaderProgram, "viewCenter");
        gl.uniform2f(viewCenterLoc, viewCenter.x / 10, viewCenter.y / 10);

        var viewAttrib = gl.getUniformLocation(shaderProgram, "view");
        gl.uniform2f(viewAttrib, width / 10, height / 10);

        var backgroundPosition = $intro.data('backgroundPosition') || {x: 0, y: 0};
        var backgroundPositionLoc = gl.getUniformLocation(shaderProgram, "backgroundPosition");
        gl.uniform2f(backgroundPositionLoc, backgroundPosition.x / image.width, -backgroundPosition.y / image.height);

        var revealRatio = $intro.data('revealRatio') || 0;
        var revealRatioLoc = gl.getUniformLocation(shaderProgram, "revealRatio");
        gl.uniform1f(revealRatioLoc, revealRatio);

        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

    function mapRange(value, minSrc, maxSrc, minDst, maxDst) {
        return (value - minSrc) / (maxSrc - minSrc) * (maxDst - minDst) + minDst;
    }

});
