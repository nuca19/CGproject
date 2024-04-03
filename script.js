

let audioContext; // Define audioContext globally
let object; // Define object globally

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

//add plane
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0));
const planeHelper = new THREE.PlaneHelper(plane, 200, 0xaaaaaa);
scene.add(planeHelper);

// Create a sphere for visualization
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
object = new THREE.Mesh(geometry, material);
scene.add(object);
object.visible = false; // Initially hide the object

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
                    object.material.color.set(0xff0000); // Red color
                } else if (average > 50 && average <= 100) {
                    object.visible = true;
                    object.material.color.set(0x00ff00); // Green color
                } else if (average > 100) {
                    object.visible = true;
                    object.material.color.set(0x0000ff); // Blue color
                } else {
                    object.visible = false;
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