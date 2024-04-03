

let audioContext; // Define audioContext globally
let object; // Define object globally
let volumeDisplay; // Define volumeDisplay globally

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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 0; 
camera.position.y = 2; 
camera.position.x = 3; 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//renderer.setClearColor(0xFFFFFF, 1);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

//ambient light
var light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

//create sky
var skyGeo = new THREE.SphereGeometry(1000, 25, 25);
var loader  = new THREE.TextureLoader();

loader.load("textures/nightsky.png", function(texture) {
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

    var geometry = new THREE.PlaneGeometry(200, 200);
    var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to make it horizontal
    plane.position.y = -1;
    scene.add(plane);
});

// Create a sphere for visualization

loader = new THREE.TextureLoader();

    loader.load('textures/sun.jpg', function(texture) {
    const sungeo = new THREE.SphereGeometry(15, 32, 32);
    const sunmat = new THREE.MeshBasicMaterial({ map: texture });
    object = new THREE.Mesh(sungeo, sunmat);
    object.position.x = -100;
    object.position.y = 30;
    scene.add(object);
    object.visible = false; // Initially hide the object
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
                let average = sum / bufferLength;
                if (average > 20 && average <= 50) { // Adjust the threshold levels as needed
                    object.visible = true;
                    // Set the initial scale to 0
                    object.scale.set(0, 0, 0);
                    gsap.to(object.scale, { x: 1, y: 1, z: 1, duration: 4, onComplete: function() {
                        object.visible = false;
                    }});
                } else if (average > 50 && average <= 100) {
                   
                } else if (average > 100) {
                    
                } else {
                    
                }

                volumeDisplay.textContent = 'Volume Level: ' + Math.round(average);

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
    document.body.appendChild(buttonContainer);

    volumeDisplay = document.createElement('div');
    volumeDisplay.id = 'volume-display';
    document.body.appendChild(volumeDisplay);
}

function animate() {
    requestAnimationFrame(animate);

    // Update your scene here

    renderer.render(scene, camera);
    controls.update();
}

// Ensure start button is created after DOM content is loaded
window.addEventListener('DOMContentLoaded', createStartButton);
animate();