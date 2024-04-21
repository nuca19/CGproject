import { PointerLockControls } from '/js/PointerLockControls.js';
window.PointerLockControls = PointerLockControls;

let object;
let meteor;
let volumeModel;

let audioContext;
let volumeDisplay;
let average;
let watertexture;

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
camera.position.set(0, 1, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//renderer.setClearColor(0xFFFFFF, 1);

const axes = new THREE.AxesHelper(15);
axes.position.set(-20, 0, 0);

scene.add(axes);

//ambient light
var light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

//create sky
var skyGeo = new THREE.SphereGeometry(1000, 25, 25);
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

    var geometry = new THREE.BoxGeometry(600, 600, 3);
    var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to make it horizontal
    plane.position.y = -3.5;
    scene.add(plane);

    //mountaintains
    var geometry = new THREE.ConeGeometry(25, 15, 4);
    var mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(-80, 1, 50);
    scene.add(mountain);
    var geometry = new THREE.ConeGeometry(35, 25, 4);
    mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(-80, 4, 20);
    scene.add(mountain);
    var geometry = new THREE.ConeGeometry(50, 35, 4);
    mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(-80, 7, -10);
    scene.add(mountain);
    var geometry = new THREE.ConeGeometry(20, 20, 4);
    mountain = new THREE.Mesh(geometry, material);
    mountain.position.set(15, -0.5, 80);
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
    trunkTexture.repeat.set(3, 3); // Adjust these values as needed

    var geometry = new THREE.ConeGeometry(1, 2, 4);
    var material = new THREE.MeshPhongMaterial({map: leavesTexture});
    var treeTop = new THREE.Mesh(geometry, material);

    geometry = new THREE.CylinderGeometry(0.25, 0.25, 1.5);
    material = new THREE.MeshPhongMaterial({map: trunkTexture}); // Apply the trunk texture
    var treeTrunk = new THREE.Mesh(geometry, material);

    treeTrunk.position.y = -1.75;
    treeTop.add(treeTrunk);

    return treeTop;
}

// Function to create a forest
function createForest(x, y, z, treeCount) {
    var forest = new THREE.Group();

    for (var i = 0; i < treeCount; i++) {
        var tree = createTree();
        tree.position.set(
            x + Math.random() * 50 - 25, // Increased range for random position
            y,
            z + Math.random() * 50 - 25  // Increased range for random position
        );
        forest.add(tree);
    }

    return forest;
}

// Create forests
var forest1 = createForest(-30, 0, -30, 50);
scene.add(forest1);
var forest3 = createForest(-30, 0, 40, 50);
scene.add(forest3);

//river
loader = new THREE.TextureLoader();
loader.load('textures/water.jpg', function(texture) {
    watertexture = texture;
    // Define the points along the path of the river
    const points = [
        new THREE.Vector3(-75, 2, 10),
        new THREE.Vector3(-64, 0, 8),
        new THREE.Vector3(-61, -2, 12),
        new THREE.Vector3(-50, -3, 8),
        new THREE.Vector3(-20, -3, -1),
        new THREE.Vector3(-10, -3, -1),
        new THREE.Vector3(-5, -3, 15),
        new THREE.Vector3(20, -3, 20),
        new THREE.Vector3(20, -3, 40),
        new THREE.Vector3(20, -3, 60),
        new THREE.Vector3(50, -3, 80)
    ];

    // Create a curve from the points
    const curve = new THREE.CatmullRomCurve3(points);
    const riverGeometry = new THREE.TubeGeometry(curve, 64, 2, 8, false);
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
    lake.position.set(50,-1, 80);
    lake.rotation.x = -Math.PI / 2;

    // Add the lake to the scene
    scene.add(lake);
});

function createCabin() {
    var cabin = new THREE.Group();

    // Create the walls
    var geometry = new THREE.PlaneGeometry(5, 5);
    var material = new THREE.MeshPhongMaterial({color: 0x8b4513, side: THREE.DoubleSide}); // Make the walls double-sided
    var wall1 = new THREE.Mesh(geometry, material);
    var wall2 = wall1.clone();
    var wall3 = wall1.clone();
    var wall4 = wall1.clone();

    wall1.rotation.y = Math.PI;
    wall2.rotation.y = Math.PI / 2;
    wall3.rotation.y = -Math.PI / 2;
    wall4.rotation.y = 0;

    wall1.position.z = 2.5;
    wall2.position.x = 2.5;
    wall3.position.x = -2.5;
    wall4.position.z = -2.5;

    cabin.add(wall1, wall2, wall4);

    // Create the roof
    geometry = new THREE.ConeGeometry(5, 2, 4);
    material = new THREE.MeshPhongMaterial({color: 0x8b4513});
    var roof = new THREE.Mesh(geometry, material);
    roof.position.y = 3.5;
    roof.rotation.y = Math.PI / 4;
    cabin.add(roof);

    // Create the door
    geometry = new THREE.BoxGeometry(1, 2, 0.1);
    material = new THREE.MeshPhongMaterial({color: 0x663300});
    var door = new THREE.Mesh(geometry, material);
    door.position.y = -1.5;
    door.position.z = 2.5;
    cabin.add(door);

    return cabin;
}

// Create a cabin and add it to the scene
var cabin = createCabin();
cabin.position.set(0, 2, 0); // Set the position to the starting position
cabin.scale.set(2, 2, 2); // Scale the cabin
//scene.add(cabin);


var city = new THREE.Group();
var buildings = [
    { position: { x: -5, y: 0, z: -20 }, size: { width: 6, height: 15, depth: 6 } },
    { position: { x: 5, y: 0, z: -15 }, size: { width: 6, height: 12, depth: 6 } },
    { position: { x: 15, y: 0, z: -10 }, size: { width: 6, height: 18, depth: 6 } },
    { position: { x: -5, y: 0, z: -5 }, size: { width: 6, height: 9, depth: 6 } },
    { position: { x: 6, y: 0, z: -3 }, size: { width: 6, height: 6, depth: 6 } },
    { position: { x: 10, y: 0, z: -25 }, size: { width: 6, height: 21, depth: 6 } },
    { position: { x: -15, y: 0, z: -15 }, size: { width: 6, height: 12, depth: 6 } },
];


// Create the buildings
for (var i = 0; i < buildings.length; i++) {
    // Create a box geometry for the building
    var buildingGeometry = new THREE.BoxGeometry(buildings[i].size.width, buildings[i].size.height, buildings[i].size.depth);

    // Create a basic material for the building
    var buildingMaterial = new THREE.MeshBasicMaterial({color: 0x1C1D22});

    // Create a mesh for the building
    var building = new THREE.Mesh(buildingGeometry, buildingMaterial);

    // Position the building
    building.position.set(buildings[i].position.x, buildings[i].size.height / 2, buildings[i].position.z);

    // Add the building to the city
    city.add(building);
}

// Position the city
city.position.set(10, -2, -60);
scene.add(city);



const volumeModelGeometry = new THREE.BoxGeometry(1, 1, 1);
volumeModelGeometry.translate(0, 0.5, 0);
const volumeModelMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
volumeModel = new THREE.Mesh(volumeModelGeometry, volumeModelMaterial);
volumeModel.position.set(-1, 0, -3);
volumeModel.scale.y = 0;
scene.add(volumeModel);

// Create a sphere for visualization
//moon
loader = new THREE.TextureLoader();
loader.load('textures/moon.jpg', function(texture) {
    const sungeo = new THREE.SphereGeometry(15, 32, 32);
    const sunmat = new THREE.MeshBasicMaterial({ map: texture });
    object = new THREE.Mesh(sungeo, sunmat);
    object.position.x = -100;
    object.position.y = 30;
    scene.add(object);
    object.visible = false; // Initially hide the object
});

//meteor
loader = new THREE.TextureLoader();
loader.load('textures/sun.jpg', function(texture) {
    var meteorgeo = new THREE.SphereGeometry(15, 32, 32);
    var meteormat = new THREE.MeshBasicMaterial({ map: texture });
    meteor = new THREE.Mesh(meteorgeo, meteormat);
    meteor.position.set(-50, 50, 0);
    scene.add(meteor);
    meteor.visible = false; // Initially hide the object

});
// Function to handle user audio input
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
                    //retirar comment !!!!
                    average = sum / bufferLength;
                    
                    if (average > 40 && average <= 50) { // Adjust the threshold levels as needed
                        object.visible = true;
                        // Set the initial scale to 0
                        object.scale.set(0, 0, 0);
                        gsap.to(object.scale, { x: 1, y: 1, z: 1, duration: 4, onComplete: function() {
                            object.visible = false;
                        }});
                    } else if (average > 75 && average <= 100) {
                        meteor.visible = true;
                        meteor.scale.set(0, 0, 0);
                        gsap.to(meteor.position, { y: 4, x: 0, z: 20, duration: 6 });
                        gsap.to(meteor.scale, { x: 0.5, y: 0.5, z: 0.5, duration: 6, onComplete: function() {
                            meteor.visible = false;
                            meteor.position.set(-50, 50, 50);
                        }});
                    } else if (average > 100) {
                        
                    } else {
                        
                    }

                    volumeDisplay.textContent = 'Volume Level: ' + Math.round(average);
                    volumeModel.scale.y = average / 100 *2;

                    //average= 0; //retirar quando usar voz!!!!

                }
                draw();
            }, 2000);
        })
        .catch(handleAudioInputError);
}

// Function to handle errors with audio input
function handleAudioInputError(error) {
    console.error('Error accessing microphone:', error);
}

// Function to create and append start button
function createStartButton() {
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'button-container';
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Visualization';
    startButton.addEventListener('click', handleAudioInput);
    buttonContainer.appendChild(startButton);

    const volumeButton50 = document.createElement('button');
    volumeButton50.textContent = 'Set Volume to 50';
    volumeButton50.addEventListener('click', function() {
        average = 50;
    });
    buttonContainer.appendChild(volumeButton50);

    const volumeButton70 = document.createElement('button');
    volumeButton70.textContent = 'Set Volume to 70';
    volumeButton70.addEventListener('click', function() {
        average = 70;
    });
    buttonContainer.appendChild(volumeButton70);

    document.body.appendChild(buttonContainer);

    volumeDisplay = document.createElement('div');
    volumeDisplay.id = 'volume-display';
    document.body.appendChild(volumeDisplay);
}

function setupControlsAndListeners(camera) {
    const controls = new PointerLockControls(camera, document.body);


    document.addEventListener('keydown', function(event) {
        const key = event.key;
        const speed =3;
        switch (key) {
            case "w":
                controls.moveForward(speed);
                break;
            case "a":
                controls.moveRight(-speed);
                break;
            case "s":
                controls.moveForward(-speed);
                break;
            case "d":
                controls.moveRight(speed);
                break;
        }
    }, false);

    document.addEventListener('click', function () {
        controls.lock();
    }, false);
}


function animate() {
    requestAnimationFrame(animate);

    // Update your scene here
    if (watertexture) {
        watertexture.offset.x -= 0.001;
    }
    renderer.render(scene, camera);
}

// Ensure start button is created after DOM content is loaded
window.addEventListener('DOMContentLoaded', createStartButton);
setupControlsAndListeners(camera);
animate();