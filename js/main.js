var camera, scene, renderer;
var geometry, material, mesh;
var container, stats;
var uniforms;
var worker;

var startTime = Date.now();
var isMobileDevice = ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1));


function init() {
    uniforms = {
        time:       { value: 1.0 },
        resolution: { value: new THREE.Vector2() }
    };

    if (isMobileDevice) {
        console.log("running cube animation");
        window.addEventListener('resize', onWindowResizeMobile, false);
        initCube();
    } else {
        console.log("loading shader");
        window.addEventListener('resize', onWindowResize, false);
        initShaders();
    }

    requestAnimationFrame( animate );
}

function initShaders() {
    container = document.getElementById( 'top-animation' );

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();

    var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

    uniforms = {
        time:       { value: 1.0 },
        resolution: { value: new THREE.Vector2() }
    };

    var material = new THREE.ShaderMaterial( {

        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent

    } );

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild( renderer.domElement );
}

function initCube() {

    container = document.getElementById("top-animation");

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10 );
    camera.position.z = 3;

    scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry( 1, 1, 1 );
    material = new THREE.MeshBasicMaterial( { color: 0x2f5fff, wireframe: true } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild( renderer.domElement );

}

function animate(time) {
    requestAnimationFrame( animate );
    if(isMobileDevice) {
        mesh.rotation.x = time * 0.0005;
        mesh.rotation.y = time * 0.001;

        renderer.render( scene, camera );
    } else {
        render();
    }
}

function render() {
    uniforms.time.value += 0.05;

    var elapsedMilliseconds = Date.now() - startTime;
    var elapsedSeconds = elapsedMilliseconds / 1000.;
    uniforms.time.value = 60. * elapsedSeconds;

    renderer.render( scene, camera );
}

function onWindowResizeMobile(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onWindowResize(){
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function startWorker() {
    if(typeof(Worker) !== "undefined") {
        if(typeof(worker) == "undefined") {
            worker = new Worker("demo_workers.js");
        }
        worker.onmessage = function(event) {
            document.getElementById("result").innerHTML = event.data;
        };
    } else {
        console.log("No Web Worker support!");
        return false;
    }
}

function stopWorker() {
    worker.terminate();
    worker = undefined;
}

init();