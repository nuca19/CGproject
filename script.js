

let audioContext; // Define audioContext globally
let object; // Define object globally
let meteor;
let volumeDisplay; // Define volumeDisplay globally
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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);~
camera.position.set(0, 1, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//renderer.setClearColor(0xFFFFFF, 1);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(-4, 1, 0);

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
//river
loader = new THREE.TextureLoader();
loader.load('textures/water.jpg', function(texture) {
    watertexture = texture;
    // Define the points along the path of the river
    const points = [
        new THREE.Vector3(-55, -3, 12),
        new THREE.Vector3(-50, -3, 10),
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
            function draw() {
                requestAnimationFrame(draw);
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                //average = sum / bufferLength; retirar comment !!!!
                if (average > 20 && average <= 50) { // Adjust the threshold levels as needed
                    object.visible = true;
                    // Set the initial scale to 0
                    object.scale.set(0, 0, 0);
                    gsap.to(object.scale, { x: 1, y: 1, z: 1, duration: 4, onComplete: function() {
                        object.visible = false;
                    }});
                } else if (average > 50 && average <= 100) {
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

                average= 0; //retirar comment !!!!

            }
            draw();
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

function animate() {
    requestAnimationFrame(animate);

    // Update your scene here
    if (watertexture) {
        watertexture.offset.x -= 0.001;
    }
    renderer.render(scene, camera);
    controls.update();
}

// Ensure start button is created after DOM content is loaded
window.addEventListener('DOMContentLoaded', createStartButton);
animate();