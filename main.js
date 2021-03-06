var camera, scene, renderer;
var geometry, material, mesh;
var container;
var uniforms;
var stats;
var id;

var shaderPath = 'shaders/';
var shaderFiles = [
    'fastWater.glsl',
    'lcdGradient.glsl',
    'causticsWater.glsl',
    'clouds.glsl',
    'fractal3D.glsl',
    'ring.glsl',                //default
    'ink.glsl',
    'fractal3-Kaleidoscope.glsl',
    'stars1.glsl',
    'windwaker.glsl',
    'perlin.glsl',
    'text.glsl'
];

//var shaderFileIndex = Math.floor(Math.random() * shaderFiles.length);
var shaderFileIndex = 5; //5
var shaderFile = shaderFiles[shaderFileIndex];

var startTime = Date.now();
var isMobileDevice = (window.innerWidth < 720 && (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1));
var renderScale = 1 / 4;
var framerate = 60;
var renderOnMouseMove = false;
var paused = false;
var pausedTime;
var windowHeight = window.innerHeight;

var leftKey = 37, leftA = 65, rightKey = 39, rightD = 68, space = 32;

function init() {
    //stats = new Stats();
    //stats.showPanel(0);

    container = $('#top-animation');

    uniforms = {
        time: {value: 1.0},
        resolution: {value: new THREE.Vector2(window.innerWidth, windowHeight)},
        mouse: {value: new THREE.Vector2()},
        backbuffer: {value: 0}
    };

    windowHeight = window.innerHeight;

    if (isMobileDevice) {
        windowHeight = window.innerHeight/2;
        uniforms.resolution.value.y = windowHeight;

        console.log("running cube animation");
        window.addEventListener('resize', onWindowResizeMobile, false);

        $("#shaderInfo").append(
            '<p id="display">View this page on a non-mobile device to see better animations!.</p>'
        ).animate({"opacity": "1"}, 300);

        initCube();
    } else {
        console.log("loading shader");
        window.addEventListener('resize', onWindowResize, false);
        container.on('mousemove', onMouseMove, false);
        window.addEventListener('keydown', onKeyDown, false);
        initShaders();

        $("#animationContainer").append(
            '<div id="display" class="clearfix"></div>'
        ).animate({"opacity": "1"}, 700);

        $("#shaderInfo").append(
            '<div id="shaderBtnContainer" class="center">'
            + '<a id="leftButton" href="#" class="shaderControls btn btn-md btn-default"><span>Prev Shader</span></a>'
            + '<a id="rightButton" href="#" class="shaderControls btn btn-md btn-default"><span>Next Shader</span></a>'
            + '</div>'
            + '<h4 class="lead center">Use the above buttons or click the animation to load a new pixel shader.</h4>'
        );


        $("#top-animation").click(function () {
            onButtonPress('right');
        });
        $("#leftButton").click(function () {
            onButtonPress('left');
        });
        $("#rightButton").click(function () {
            onButtonPress('right');
        });

        console.log("loaded " + shaderFile);
    }

    requestAnimationFrame(animate);

    // container.appendChild(stats.dom);
}

function initShaders() {


    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();

    geometry = new THREE.PlaneBufferGeometry(2, 2);

    var request = new XMLHttpRequest();
    request.open("GET", shaderPath + shaderFile, false);
    request.send(null);

    var shaderText = request.responseText;

    getRendererDirectives(shaderText);

    material = new THREE.ShaderMaterial({

        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        //surfaceVertexShader: document.getElementById( 'surfaceVertexShader' ).textContent,
        fragmentShader: shaderText

    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio * renderScale);
    renderer.setSize(window.innerWidth, windowHeight);
    container.append(renderer.domElement);
}

function initCube() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / windowHeight, 0.1, 10);
    camera.position.z = 2;

    scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({color: 0x2f5fff, wireframe: true});

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, windowHeight);
    renderer.setPixelRatio(window.devicePixelRatio * 0.5);
    container.append(renderer.domElement);
}

function animate(time) {
    //stats.update();

    // can no longer set framerate because chrome disables setTimeout callbacks on scroll
    // setTimeout(function () {
    //
    //     if (!paused) {
    //         id = requestAnimationFrame(animate);
    //     }
    //
    // }, 1000 / (framerate + 1));

    id = requestAnimationFrame(animate);

    if (isMobileDevice) {
        mesh.rotation.x = time * 0.0005;
        mesh.rotation.y = time * 0.001;

        renderer.render(scene, camera);
    } else {
        render();
    }
}

function render() {
    var elapsedMilliseconds = Date.now() - startTime;
    uniforms.time.value = elapsedMilliseconds / 1000.;

    renderer.render(scene, camera);
}

function onWindowResizeMobile() {

    camera.aspect = window.innerWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, windowHeight);
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, windowHeight);

    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = windowHeight;

    render();
}

function onMouseMove(event) {
    // Update the mouse variable
    event.preventDefault();
    uniforms.mouse.value.x = (event.clientX / window.innerWidth) / 2;
    console.log("mouse x: " + uniforms.mouse.value.x);
    uniforms.mouse.value.y = (-(event.clientY / windowHeight) + 1) / 2;
    console.log("mouse y: " + uniforms.mouse.value.y);

    if (renderOnMouseMove) {
        render();
    }
}

function onKeyDown(event) {
    if (event.keyCode === leftA || event.keyCode === leftKey) {
        onButtonPress('left');
    } else if (event.keyCode === rightD || event.keyCode === rightKey) {
        onButtonPress('right');
    // } else if (event.keyCode === space) {
    //     event.preventDefault();
    //     onButtonPress('pause');
    }
}

function onButtonPress(arg) {
    switch (arg) {
        case 'left':
            shaderFileIndex = ((shaderFileIndex - 1) < 0) ? (shaderFiles.length - 1) : (shaderFileIndex - 1);
            shaderFile = shaderFiles[shaderFileIndex];
            reloadShaders();
            break;
        case 'right':
            shaderFileIndex = (++shaderFileIndex) % shaderFiles.length;
            shaderFile = shaderFiles[shaderFileIndex];
            reloadShaders();
            break;
        case 'pause':
            if (paused) { //unpausing now, adjust start time for seamless rendering
                startTime = startTime + (Date.now() - pausedTime);
            }
            // else { //pausing now, record when
            //     pausedTime = Date.now();
            // }
            //
            // paused = !paused;
            // requestAnimationFrame(animate);
    }
}

function reloadShaders() {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    var request = new XMLHttpRequest();
    request.open("GET", shaderPath + shaderFile, false);
    request.send(null);

    var shaderText = request.responseText;

    console.log("loaded " + shaderFile);

    getRendererDirectives(shaderText);

    material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: shaderText
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer.setPixelRatio(window.devicePixelRatio * renderScale);
    renderer.setSize(window.innerWidth, windowHeight);

    render();
}

function getRendererDirectives(shaderText) {
    var lines = shaderText.split('\n');

    for (var i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("//")) {
            lines[i] = lines[i].substr(2);
            if (lines[i].startsWith("renderScale:")) {
                renderScale = parseFloat(lines[i].substr(lines[i].lastIndexOf(':') + 1).trim());
                //console.log("renderScale set: " + renderScale);
            } else if (lines[i].startsWith("framerate:")) {
                framerate = parseInt(lines[i].substr(lines[i].lastIndexOf(':') + 1).trim());
                //console.log("framerate set: " + framerate);
            } else if (lines[i].startsWith("renderOnMouseMove")) {
                renderOnMouseMove = true;
            }
        }
    }
}

$(document).ready(function () {
    init();
});
