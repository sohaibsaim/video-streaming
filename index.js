const videoElement = document.getElementById('outputVideo');
let mediaStream; // Declare as Global

// Enumerate cameras and populate dropdown
console.log("start");
function populateCameraDropdown() {
    return navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const deviceList = document.getElementById('camera-list');
            devices.forEach(device => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = `${device.label || device.deviceId} (${device.kind})`;
                deviceList.appendChild(option);
            });
        });
}

console.log("Before MEdia Stream");
// Capture video from the selected camera and display in localVideo element
async function getMediaStream() {
    const cameraList = document.getElementById('camera-list');
    const constraints = {
        audio: true,
        video: {
            deviceId: cameraList.value,
            width: 640,
            height: 480
        }
    };

    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        const localVideo = document.getElementById('localVideo');
        localVideo.srcObject = mediaStream;
        const videoTracks = mediaStream.getVideoTracks();
        console.log('Number of video tracks:', videoTracks.length);
        localVideo.play();  // Start playing the video
    } catch (error) {
        console.error("Error accessing camera:", error);
    }
}

// videoElement.srcObject = mediaStream;

console.log("Before initializeVideoJS");
// Initialize video.js player
function OinitializeVideoJS() {
    const player = videojs('outputVideo');
    player.vr({ projection: '360', forceCardboard: false });
    player.src({
        type: 'application/x-mpegURL',
        src: mediaStream
    });
    player.play();
}

function initializeVideoJS() {
    const player = videojs('localVideo');  // Use the ID of the video element
    player.muted(true);
    player.vr({ projection: '360', forceCardboard: true });
}

console.log("Before getElementById('start-camera')");
// Event listener for the Start Camera button
document.getElementById('start-camera').addEventListener('click', () => {
    getMediaStream()
        .then(() => {
            initializeVideoJS();
        })
        .catch(error => {
            console.error("Error accessing camera:", error);
        });
});

console.log("Before populateCameraDropdown");
// Initially populate the camera dropdown
populateCameraDropdown()
    .catch(error => {
        console.error("Error enumerating devices:", error);
    });

function startCameraAndPlay() {
    getMediaStream()
        .then(() => {
            initializeVideoJS();
            const player = videojs('localVideo');
            player.play();  // Programmatic play after initializing and setting the stream.
        })
        .catch(error => {
            console.error("Error accessing camera:", error);
        });
}

