import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { PointerLockControls } from '/js/PointerLockControls.js';
window.PointerLockControls = PointerLockControls;

import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

import * as func from './func.js';

let buttonPressed = false;
let buttonAverage = 0;

let moon;
let meteor;
let volumeModel;
let moonanimation = false;
let meteoranimation = false;
let birdanimation = false;

let audioContext;
let volumeDisplay;
let average;
let watertexture;
let volumes = [];

//gltb
let animateRocket = false;
let rocket;
let fire1;
let fire2;
let fire3;

let shakeInterval;

function createStartButton() {
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'button-container';
    const volbutcont = document.createElement('div');
    volbutcont.id = 'volbutcont';
    
    const startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.textContent = 'Start Visualization';
    startButton.addEventListener('click', function() {
        handleAudioInput();
        startButton.style.display = 'none';
    });
    buttonContainer.appendChild(startButton);
    document.body.appendChild(buttonContainer);


    const ani1 = document.createElement('button');
    ani1.textContent = 'ani1';
    ani1.addEventListener('click', function() {
        buttonPressed = true;
        buttonAverage = 41;
    });
    volbutcont.appendChild(ani1);
    
    const ani2 = document.createElement('button');
    ani2.textContent = 'ani2';
    ani2.addEventListener('click', function() {
        buttonPressed = true;
        buttonAverage = 61;
    });
    volbutcont.appendChild(ani2);

    const ani3 = document.createElement('button');
    ani3.textContent = 'ani3';
    ani3.addEventListener('click', function() {
        buttonPressed = true;
        buttonAverage = 101;
    });
    volbutcont.appendChild(ani3);
    document.body.appendChild(volbutcont);

    volumeDisplay = document.createElement('div');
    volumeDisplay.id = 'volume-display';
    document.body.appendChild(volumeDisplay);
}

function initializeAudioContext() {
    // Check if audioContext is already initialized
    if (!audioContext) {
        console.log('Initializing AudioContext...');
        audioContext = new AudioContext();
        console.log('AudioContext initialized.');
    }
}

// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(100, 22.5, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
//renderer.setClearColor(0xFFFFFF, 1);

//const axes = new THREE.AxesHelper(15);
//axes.position.set(-20, 0, 0);
//scene.add(axes);

//glb moons
const loaderg = new GLTFLoader();

loaderg.load(
    '../mdls/Telescope.glb',
    function ( gltf ) {
        const scale = 1.9;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(93, 21, 4);
        func.enableShadows(gltf.scene);
        scene.add( gltf.scene );
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);
loaderg.load(
    '../mdls/Chair.glb',
    function ( gltf ) {
        const scale = 4.3;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(93, 20, -4);
        gltf.scene.rotation.y = - Math.PI / 4;
        func.enableShadows(gltf.scene);
        scene.add( gltf.scene );
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);

loaderg.load(
    '../mdls/desk.glb',
    function ( gltf ) {
        const scale = 2;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(118, 19.6, -32);
        gltf.scene.rotation.y = -Math.PI /2;
        func.enableShadows(gltf.scene);
        scene.add( gltf.scene );
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);

loaderg.load(
    '../mdls/Stop.glb',
    function ( gltf ) {
        const scale = 1.5;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(106.9, 24.2, 5);
        gltf.scene.rotation.z = -Math.PI /2;
        gltf.scene.rotation.y = -Math.PI ;
        gltf.scene.rotation.x = -Math.PI /2;
        func.enableShadows(gltf.scene);
        scene.add( gltf.scene );
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);
loaderg.load(
    '../mdls/LightCeiling.glb',
    function ( gltf ) {
        const scale = 3;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(100, 29, 0);
        gltf.scene.rotation.y = -Math.PI /2;
        scene.add( gltf.scene );
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);

loaderg.load(
    '../mdls/Rocketship.glb',
    function ( gltf ) {
        const scale = 1;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(50, 23, 33);
        gltf.scene.rotation.y = -Math.PI;

        func.enableShadows(gltf.scene);

        scene.add( gltf.scene );
        rocket = gltf.scene;
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);

loaderg.load(
    '../mdls/LandingPad.glb',
    function ( gltf ) {
        const scale = 15;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(50, -5, 35);
        func.enableShadows(gltf.scene);
        scene.add( gltf.scene );
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);

loaderg.load(
    '../mdls/Rock1.glb',
    function ( gltf ) {
        const scale = 20;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(62, -2, -25);
        func.enableShadows(gltf.scene);
        scene.add( gltf.scene );

        var rock2 = gltf.scene.clone();
        var rock3 = gltf.scene.clone();
        var rock4 = gltf.scene.clone();

        rock2.position.set(-188, -2, 58);
        rock2.scale.set(50, 50, 50);
        rock2.rotation.y = Math.PI / 2;
        scene.add(rock2);
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);

loaderg.load(
    '../mdls/Rock2.glb',
    function ( gltf ) {
        const scale = 40;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(-140, -2, 35);
        func.enableShadows(gltf.scene);
        scene.add( gltf.scene );
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);

function createBird(callback) {
    loaderg.load(
        '../mdls/Bird.glb',
        function (gltf) {
            const scale = 0.02;
            gltf.scene.scale.set(scale, scale, scale);
            callback(gltf.scene);
        },
        // called while loading is progressing
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // called when loading has errors
        function (error) {
            console.log('An error happened', error);
        }
    );
}

loaderg.load(
    '../mdls/Fire.glb',
    function ( gltf ) {
        const scale = 20;
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.rotation.x = Math.PI;
        fire1 = gltf.scene;
        fire2 = gltf.scene.clone();
        fire3 = gltf.scene.clone();
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
        console.log( 'An error happened', error );
    }
);

//ambient light
//var light = new THREE.AmbientLight(0xffffff); // soft white light
//scene.add(light);

const cabinlight = new THREE.PointLight(0xffffff, 1, 13);
cabinlight.position.set(100, 24, 0);
scene.add(cabinlight);

const light = new THREE.PointLight(0xffffff, 1, 1900);
light.position.set(-10, 500, 1);

// // Enable shadows for the light
light.castShadow = true;

light.shadow.mapSize.width = 1024; // default is 512
light.shadow.mapSize.height = 1024; // default is 512

// Adjust the shadow bias to remove artifacts

// // Add the light to the scene
scene.add(light);

//create sky
var skyGeo = new THREE.SphereGeometry(1700, 25, 25);
var loader  = new THREE.TextureLoader();

loader.load("textures/nightsky2.jpg", function(texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5); // Repeat the texture 10 times in both directions

    var skymaterial = new THREE.MeshPhongMaterial({ 
        map: texture,
    });
    skymaterial.side = THREE.BackSide; // Set the side property on skymaterial
    var sky = new THREE.Mesh(skyGeo, skymaterial);
    scene.add(sky);
});   

//add plane
var loader = new THREE.TextureLoader();
loader.load('textures/ground.png', function(texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4); // Repeat the texture 4 times in both directions

    var geometry = new THREE.BoxGeometry(1500, 1500, 3);
    const material = new THREE.MeshPhongMaterial({ map: texture }); 
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to make it horizontal
    plane.position.y = -3.5;
    plane.receiveShadow = true;
    scene.add(plane);

    //mountaintains
    geometry = new THREE.ConeGeometry(250, 150, 10);
    var mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(-390, 10, 350);
    mountain.castShadow = true;
    scene.add(mountain);
    
    geometry = new THREE.ConeGeometry(350, 250, 10);
    mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(-400, 40, 150);
    mountain.castShadow = true;
    scene.add(mountain);
    
    geometry = new THREE.ConeGeometry(500, 350, 10);
    mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(-450, 70, -150);
    mountain.castShadow = true;
    scene.add(mountain);
    
    geometry = new THREE.ConeGeometry(200, 200, 10);
    mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(175, -5, 600);
    mountain.castShadow = true;
    scene.add(mountain);

    geometry = new THREE.ConeGeometry(100, 50, 6);
    mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(100, -5, 0); 
    mountain.castShadow = true;
    scene.add(mountain);

});

// Function to create a tree
function createTree() {
    var textureLoader = new THREE.TextureLoader();
    var leavesTexture = textureLoader.load('textures/leaves.png');
    var trunkTexture = textureLoader.load('textures/trunk.jpg'); // Load the trunk texture

    // Repeat the texture
    leavesTexture.wrapS = THREE.RepeatWrapping;
    leavesTexture.wrapT = THREE.RepeatWrapping;
    leavesTexture.repeat.set(3, 3);

    // Repeat the trunk texture
    trunkTexture.wrapS = THREE.RepeatWrapping;
    trunkTexture.wrapT = THREE.RepeatWrapping;
    trunkTexture.repeat.set(3, 3); 

    var geometry = new THREE.ConeGeometry(2, 4, 4); 
    var material = new THREE.MeshPhongMaterial({map: leavesTexture});
    var treeTop = new THREE.Mesh(geometry, material);

    geometry = new THREE.CylinderGeometry(0.5, 0.5, 3); 
    material = new THREE.MeshPhongMaterial({map: trunkTexture}); 
    var treeTrunk = new THREE.Mesh(geometry, material);

    treeTrunk.position.y = -3.5; 
    treeTop.add(treeTrunk);
    treeTop.castShadow = true;
    treeTop.receiveShadow = true;

    return treeTop;
}

// Function to create a forest
function createForest(x, y, z, treeCount) {
    var forest = new THREE.Group();

    for (var i = 0; i < treeCount; i++) {
        var tree = createTree();
        tree.position.set(
            x + Math.random() * 120 - 25, 
            y,
            z + Math.random() * 90 - 25  
        );
        tree.scale.set(1.4, 1.4, 1.4);
        forest.add(tree);
    }

    return forest;
}

// Create forests
var forest1 = createForest(-30, 5, -50, 70);
scene.add(forest1);
var forest2 = createForest(80, 5, 80, 80);
scene.add(forest2);
var forest3 = createForest(-80, 5, 90, 70);
scene.add(forest3);

//river
loader = new THREE.TextureLoader();
loader.load('textures/water.jpg', function(texture) {
    watertexture = texture;
    // Define the points along the path of the river
    const points = [
        new THREE.Vector3(-280, -2, 70),
        new THREE.Vector3(-260, -6, 50),
        new THREE.Vector3(-100, -6, 12),
        new THREE.Vector3(20, -6, 60),
        new THREE.Vector3(50, -6, 200),
        new THREE.Vector3(100, -6, 300),
        new THREE.Vector3(40, -6, 600)
    ];

    // Create a curve from the points
    const curve = new THREE.CatmullRomCurve3(points);
    const riverGeometry = new THREE.TubeGeometry(curve, 70, 8, 16, false);
    const riverMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: 0.7
    });
    const river = new THREE.Mesh(riverGeometry, riverMaterial);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    scene.add(river);

    const lakeGeometry = new THREE.PlaneGeometry(50, 50, 10);

    // Create the lake mesh
    const lake = new THREE.Mesh(lakeGeometry, riverMaterial);

    // Position the lake at the end of the vector
    lake.position.set(50,-2, 80);
    lake.rotation.x = -Math.PI / 2;

    // Add the lake to the scene
    //scene.add(lake);
});

function createCabin() {
    var cabin = new THREE.Group();

    // Create the walls
    var geometry = new THREE.PlaneGeometry(7, 5);
    var geo2 = new THREE.PlaneGeometry(7.5, 5);
    var material = new THREE.MeshPhongMaterial({color: 0x8b4513, side: THREE.DoubleSide}); // Make the walls double-sided
    var wall1 = new THREE.Mesh(geometry, material);
    var wall2 = new THREE.Mesh(geo2, material);
    var wall3 = wall1.clone();
    var wall4 = wall1.clone();

    wall1.rotation.y = Math.PI;
    wall2.rotation.y = Math.PI / 2;
    wall3.rotation.y = -Math.PI / 2;
    wall4.rotation.y = 0;

    wall1.position.z = 3.75;
    wall2.position.x = 3.5;
    wall3.position.x = -2.5;
    wall4.position.z = -3.75;

    wall1.castShadow = true;
    wall2.castShadow = true;
    wall3.castShadow = true;
    wall4.castShadow = true;

    wall1.receiveShadow = true;
    wall2.receiveShadow = true;
    wall3.receiveShadow = true;
    wall4.receiveShadow = true;

    cabin.add(wall1, wall2, wall4);

    // Create the roof
    geometry = new THREE.ConeGeometry(6, 3, 4);
    material = new THREE.MeshPhongMaterial({color: 0x8b4513});
    var roof = new THREE.Mesh(geometry, material);
    roof.position.y = 4;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    roof.receiveShadow = true;
    cabin.add(roof);

    // Create the door
    geometry = new THREE.BoxGeometry(1, 2, 0.1);
    material = new THREE.MeshPhongMaterial({color: 0x663300});
    var door = new THREE.Mesh(geometry, material);
    door.position.y = -1.5;
    door.position.z = 3.75;
    cabin.add(door);
    
    // Create the floor
    var floorGeometry = new THREE.BoxGeometry(19, 15,0.8); // Adjust the size as needed
    var floorMaterial = new THREE.MeshPhongMaterial({color: 0x654321}); // Adjust the color as needed
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);

    floor.position.set(97.5, 19.6, 0); 
    floor.rotation.x = -Math.PI / 2; 
    floor.receiveShadow = true;
    floor.castShadow = true;
    scene.add(floor);
    return cabin;
}

// Create a cabin and add it to the scene
var cabin = createCabin();
cabin.position.set(100, 24, 0); // Set the position to the starting position
cabin.scale.set(2, 2, 2); // Scale the cabin
scene.add(cabin);


var city = new THREE.Group();
var buildings = [
    { position: { x: -10, y: 0, z: -40 }, size: { width: 12, height: 30, depth: 12 } },
    { position: { x: 10, y: 0, z: -30 }, size: { width: 12, height: 24, depth: 12 } },
    { position: { x: 30, y: 0, z: -20 }, size: { width: 12, height: 36, depth: 12 } },
    { position: { x: -10, y: 0, z: -10 }, size: { width: 12, height: 18, depth: 12 } },
    { position: { x: 12, y: 0, z: -6 }, size: { width: 12, height: 12, depth: 12 } },
    { position: { x: 20, y: 0, z: -50 }, size: { width: 12, height: 42, depth: 12 } },
    { position: { x: -30, y: 0, z: -30 }, size: { width: 12, height: 24, depth: 12 } },
];


// Create the buildings
for (var i = 0; i < buildings.length; i++) {
    var buildingGeometry = new THREE.BoxGeometry(buildings[i].size.width, buildings[i].size.height, buildings[i].size.depth);
    var buildingMaterial = new THREE.MeshPhongMaterial({color: 0x1C1D22});
    var building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(buildings[i].position.x, buildings[i].size.height / 2, buildings[i].position.z);
    city.add(building);
}

// Position the city
city.position.set(10, -2, -60);
scene.add(city);



const volumeModelGeometry = new THREE.BoxGeometry(2, 2, 2);
volumeModelGeometry.translate(0, 0.5, 0);
const volumeModelMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
volumeModel = new THREE.Mesh(volumeModelGeometry, volumeModelMaterial);
volumeModel.position.set(100, 21, -6.2);
volumeModel.scale.y = 0;
scene.add(volumeModel);
const baseGeometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
const baseMaterial = new THREE.MeshPhongMaterial({color: 0x1C1D22}); // Change the color as needed
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.set(100, 19.9, -6.2); // Position it under the volumeModel
scene.add(base);

// Create a sphere for visualization
//moon
loader = new THREE.TextureLoader();
loader.load('textures/moon.jpg', function(texture) {
    const sungeo = new THREE.SphereGeometry(80, 32, 32);
    const sunmat = new THREE.MeshBasicMaterial({ map: texture });
    moon = new THREE.Mesh(sungeo, sunmat);
    moon.position.set(-500, 250, 0);
    scene.add(moon);
    moon.visible = false; // Initially hide the moon
});

//meteor
loader = new THREE.TextureLoader();
loader.load('textures/sun.jpg', function(texture) {
    var meteorgeo = new THREE.SphereGeometry(150, 32, 32);
    var meteormat = new THREE.MeshBasicMaterial({ map: texture });
    meteor = new THREE.Mesh(meteorgeo, meteormat);
    scene.add(meteor);
    meteor.visible = false; // Initially hide the moon

});

const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
const material = new THREE.MeshPhongMaterial({color: 0xff0000});
const button = new THREE.Mesh(geometry, material);
button.rotation.z = Math.PI / 2;
button.position.set(107, 22.5, 5);

scene.add(button);

// Create a raycaster and a vector to hold the mouse position
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Add an event listener for the mouse click
window.addEventListener('click', function(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    const rocketLight = new THREE.PointLight(0xffa4a1, 2, 200);
    rocketLight.position.set(0, -30, 0); // Position the light below the rocket
    rocketLight.visible = false; 
    rocket.add(rocketLight);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object === button) {
            button.scale.y *= 0.2;
            animateRocket = true;
            scene.add(fire1);
            scene.add(fire2);
            scene.add(fire3);
            rocket.add(fire1);
            rocket.add(fire2);
            rocket.add(fire3);
            fire1.position.set(0, rocket.position.y - 47, 0); // Top of the triangle
            fire2.position.set(-5, rocket.position.y - 47, -5); // Bottom left of the triangle
            fire3.position.set(5, rocket.position.y - 47, -5); // Bottom right of the triangle
            rocketLight.visible = true;
            rocket.add(rocketLight);
            shakeCamera(7000); 
        }
    }
}, false);

let birds = [];
for (let i = 0; i < 10; i++) {
    createBird(function(bird) {
        bird.visible = false;
        bird.position.set(
            -30 + (Math.random() * 100 - 50), // Random point within 50 units of the forest's x position
            3, // Same y position as the forest
            -50 + (Math.random() * 100 - 50) // Random point within 50 units of the forest's z position
        );
        bird.rotation.x = Math.random() * Math.PI * 2; // Random rotation
        scene.add(bird);
        birds.push(bird);
    });
}

// Function to handle user audio input
let lastUpdateTime = Date.now();
function handleAudioInput() {
    console.log('Requesting microphone access...');
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            console.log('Microphone access granted.');
            initializeAudioContext(); // Initialize audioContext
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            source.connect(analyser);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            setTimeout(() => {
                function draw() {
                    requestAnimationFrame(draw);
                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    let currentVolume = sum / bufferLength;
                
                    // Add the current volume to the volumes array
                    volumes.push({ volume: currentVolume, time: Date.now() });
                    // Remove volumes that are more than 2 seconds old
                    let currentTime = Date.now();
                    while (volumes.length > 0 && currentTime - volumes[0].time > 2000) {
                        volumes.shift();
                    }
                
                    average = 0;
                    if (volumes.length > 0) {
                        let totalVolume = 0;
                        for (let i = 0; i < volumes.length; i++) {
                            totalVolume += volumes[i].volume;
                        }
                        if (buttonPressed) {
                            average = buttonAverage;
                            buttonPressed = false; // Reset the flag
                        } else {
                            average = totalVolume / volumes.length;
                        }
                    }
                    volumeDisplay.textContent = 'Volume Level: ' + Math.round(average);
                
                    
                    if (average > 60 && average <= 70 && moonanimation == false ) { 
                        moonanimation = true;
                        moon.visible = true;
                        moon.scale.set(0, 0, 0);

                        // Create a point light and position it at the same location as the moon
                        var moonLight = new THREE.PointLight(0xffffff, 5, 1000);
                        moonLight.castShadow = true;
                        moonLight.position.set(moon.position.x, moon.position.y, moon.position.z);
                        moonLight.intensity = 0;
                        scene.add(moonLight);

                        gsap.to([moon.scale, moonLight],{ x: 1, y: 1, z: 1, intensity: 1, duration: 20, onComplete: function() {
                            gsap.to([moon.scale, moonLight], { x: 0, y: 0, z: 0, intensity: 0,duration: 20, delay: 10, onComplete: function() {
                                scene.remove(moonLight);
                                moon.visible = false;
                                moonanimation = false;
                            }});
                        }});

                    } else if (average > 40 && average <= 50 && birdanimation == false) {
                        birdanimation = true;
                        let completedAnimations = 0;
                        
                        // Make all birds visible
                        for (let bird of birds) {
                            bird.visible = true;
                        }
                        
                        // Start the animations
                        for (let i = 0; i < birds.length; i++) {
                            gsap.to(birds[i].position, { 
                                y: 300, x: birds[i].position.x + (Math.random() * 1000 - 50), z: birds[i].position.z + (Math.random() * 1000 - 50),  
                                duration: 15, 
                                onComplete: function() {
                                    birds[i].visible = false;
                        
                                    completedAnimations++; // Increment the counter
                        
                                    // If all animations have completed, set birdanimation to false
                                    if (completedAnimations === birds.length) {
                                        for(let i = 0; i < birds.length; i++) {
                                            birds[i].position.set(
                                                -30 + (Math.random() * 100 - 50), // Random point within 50 units of the forest's x position
                                                3, // Same y position as the forest
                                                -50 + (Math.random() * 100 - 50) // Random point within 50 units of the forest's z position
                                            );
                                        }
                                        birdanimation = false;
                                        
                                    }
                                }
                            });
                        }

                    } else if (average > 100 && meteoranimation == false) {
                        meteor.visible = true;
                        meteor.scale.set(1, 1, 1);
                        meteor.position.set(-150, 1000, 40);
                        let meteorLight = new THREE.PointLight(0xffffff, 1, 1000);
                        meteorLight.position.set(-150, 800, 40);
                        scene.add(meteorLight);
                        setTimeout(function() {
                            shakeCamera(3000);
                        }
                        , 2000);
                        
                        // Animate the meteor, the light, and the light's intensity
                        gsap.to([meteor.position, meteorLight.position], { y: 130, x: 0, z: 0, duration: 60,  onComplete: function() {
                                meteor.visible = false;
                                meteorLight.visible = false; // Hide the light
                                meteor.position.set(-150, 1500, 40);
                                meteorLight.position.set(-150, 1500, 40); // Move the light out of view
                                meteor.scale.set(1, 1, 1);
                                setTimeout(function() {
                                    meteoranimation = false;
                                }, 30000);
                            }
                        });
                        
                        gsap.to(meteorLight, {
                            intensity: 3, // Increase the light's intensity
                            duration: 30
                        });
                    }

                    volumeModel.scale.y = average / 100 *2;
                }
                draw();
            }, 2000);
        })
        .catch(handleAudioInputError);
}

function shakeCamera(duration = 1000) {
    const shakeIntensity = 0.3;
    clearInterval(shakeInterval); // Clear any existing shake interval

    const initialY = camera.position.y;

    shakeInterval = setInterval(() => {
        camera.position.x += Math.random() * shakeIntensity - shakeIntensity / 2;
        camera.position.y += Math.random() * shakeIntensity - shakeIntensity / 2;
        camera.position.z += Math.random() * shakeIntensity - shakeIntensity / 2;
    }, 50); // Apply shake effect every 100ms

    setTimeout(() => {
        clearInterval(shakeInterval); // Stop shaking after the duration
        camera.position.y = initialY;
    }, duration);
}
// Function to handle errors with audio input
function handleAudioInputError(error) {
    console.error('Error accessing microphone:', error);
}


let keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

const controls = new PointerLockControls(camera, document.body);

function setupControlsAndListeners(camera) {
    
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        keys[key] = true;
    }, false);
    
    document.addEventListener('keyup', function(event) {
        const key = event.key;
        keys[key] = false;
    }, false);

    document.addEventListener('click', function () {
        controls.lock();
    }, false);
}

function moveControls(keys, controls, speed) {
    if (keys["w"]) controls.moveForward(speed);
    if (keys["a"]) controls.moveRight(-speed);
    if (keys["s"]) controls.moveForward(-speed);
    if (keys["d"]) controls.moveRight(speed);
}


let rocketSpeed = 0.001; // Start speed
const speedIncrement = 0.0002;
function animate() {
    requestAnimationFrame(animate);

    if (watertexture) {
        watertexture.offset.x -= 0.001;
    }
    if (rocket && animateRocket) {
        rocket.position.y += rocketSpeed;
        rocket.rotation.y += 0.001;
        rocketSpeed += speedIncrement;
    }
    const movementspeed = 0.1;
    moveControls(keys, controls, movementspeed);
    renderer.render(scene, camera);
}

// Ensure start button is created after DOM content is loaded
window.addEventListener('DOMContentLoaded', createStartButton);
setupControlsAndListeners(camera);
animate();