var camera, scene, renderer;
var geometry, material, mesh;
var container;
var uniforms;
var stats;

var shaderPath = 'shaders/';
var shaderFiles = [
    'causticsWater.glsl',
    'clouds.glsl',
    'fastWater.glsl',
    'fractal3-Kaleidoscope.glsl',
    'ring.glsl',
    'ink.glsl',
    'lcdGradient.glsl',
    'powGradient.glsl',
    'stars1.glsl',
    'sunset.glsl',
    'text.glsl',
    'windwaker.glsl',
    'fractal3D.glsl',
    'perlin.glsl'
];

//var shaderFileIndex = Math.floor(Math.random() * shaderFiles.length);
var shaderFileIndex = 4; //4
var shaderFile = shaderFiles[shaderFileIndex];

var startTime = Date.now();
var isMobileDevice = ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1));
var renderScale = 1/4;
var framerate = 60;
var renderOnMouseMove = false;

var leftKey = 37, leftA =65, rightKey = 39, rightD = 68;

function init() {

    container = document.getElementById( 'top-animation' );

    uniforms = {
        time:       { value: 1.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mouse:      { value: new THREE.Vector2() },
        backbuffer: { value: 0 }
    };

    if (isMobileDevice) {
        console.log("running cube animation");
        window.addEventListener('resize', onWindowResizeMobile, false);
        initCube(container);
    } else {
        console.log("loading shader");
        window.addEventListener('resize', onWindowResize, false);
        container.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('keydown', onKeyDown, false);
        initShaders(container);
    }

    console.log("loaded " + shaderFile);

    requestAnimationFrame( animate );
}

function initShaders() {
    stats = new Stats();
    //stats.showPanel(0);

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();

    geometry = new THREE.PlaneBufferGeometry( 2, 2 );

    var request = new XMLHttpRequest();
    request.open("GET", shaderPath + shaderFile, false);
    request.send(null);

    var shaderText = request.responseText;

    getRendererDirectives(shaderText);

    material = new THREE.ShaderMaterial( {

        uniforms: uniforms,
        vertexShader: document.getElementById( 'surfaceVertexShader' ).textContent,
        //surfaceVertexShader: document.getElementById( 'surfaceVertexShader' ).textContent,
        fragmentShader: shaderText

    } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio * renderScale );
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild( renderer.domElement );
    //container.appendChild(stats.dom);
}

function initCube() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10 );
    camera.position.z = 3;

    scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry( 1, 1, 1 );
    material = new THREE.MeshBasicMaterial( { color: 0x2f5fff, wireframe: true } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio( window.devicePixelRatio * 0.5 );
    container.appendChild( renderer.domElement );
}

function animate(time) {
    stats.update();

    setTimeout( function() {

        requestAnimationFrame( animate );

    }, 1000 / framerate );

    if(isMobileDevice) {
        mesh.rotation.x = time * 0.0005;
        mesh.rotation.y = time * 0.001;

        renderer.render( scene, camera );
    } else {
        render();
    }
}

function render() {
    var elapsedMilliseconds = Date.now() - startTime;
    uniforms.time.value = elapsedMilliseconds / 1000.;

    renderer.render( scene, camera );
}

function onWindowResizeMobile() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    uniforms.resolution.value.x = window.innerWidth;
    uniforms.resolution.value.y = window.innerHeight;
}

function onMouseMove(event) {
    // Update the mouse variable
    event.preventDefault();
    uniforms.mouse.value.x = (event.clientX / window.innerWidth)/2;
    //console.log("mouse x: " + uniforms.mouse.value.x);
    uniforms.mouse.value.y = (- (event.clientY / window.innerHeight) + 1)/2;
    //console.log("mouse y: " + uniforms.mouse.value.y);

    if(renderOnMouseMove) {
        render();
    }
}

function onKeyDown(event) {
    if(event.keyCode === leftA || event.keyCode === leftKey) {
        shaderFileIndex = ((shaderFileIndex - 1) < 0) ? (shaderFiles.length - 1) : (shaderFileIndex - 1);
        shaderFile = shaderFiles[shaderFileIndex];
        reloadShaders();
    } else if (event.keyCode === rightD || event.keyCode === rightKey) {
        shaderFileIndex = (++shaderFileIndex)%shaderFiles.length;
        shaderFile = shaderFiles[shaderFileIndex];
        reloadShaders();
    }
}

function reloadShaders() {
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }

    var request = new XMLHttpRequest();
    request.open("GET", shaderPath + shaderFile, false);
    request.send(null);

    var shaderText = request.responseText;

    console.log("loaded " + shaderFile);

    getRendererDirectives(shaderText);

    material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'surfaceVertexShader' ).textContent,
        fragmentShader: shaderText,

    } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer.setPixelRatio( window.devicePixelRatio * renderScale );
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function getRendererDirectives(shaderText) {
    var lines = shaderText.split('\n');

    for(var i = 0; i < lines.length; i++) {
        if(lines[i].startsWith("//")) {
            lines[i] = lines[i].substr(2);
            if(lines[i].startsWith("renderScale:")) {
                renderScale = parseFloat(lines[i].substr(lines[i].lastIndexOf(':') + 1).trim());
                //console.log("renderScale set: " + renderScale);
            } else if (lines[i].startsWith("framerate:")) {
                framerate = parseInt(lines[i].substr(lines[i].lastIndexOf(':') + 1).trim());
                console.log("framerate set: " + framerate);
            } else if (lines[i].startsWith("renderOnMouseMove")) {
                renderOnMouseMove = true;
            }
        }
    }
}

init();