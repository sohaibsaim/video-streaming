// process.js
// This file contains the code for processing the video stream from the user's camera
// and displaying it in the `processedVideo` video element.

// The `getlocalStream()` function captures video from the selected camera and
// displays it in the `localVideo` element.

// The `populateCameraDropdown()` function populates the camera dropdown menu with
// a list of all available cameras.

// The `addCardboardButton()` function adds a Cardboard VR icon to the `processedVideo`
// element.
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
console.log("start");
alert(screen.orientation.type);
alert(screen.orientation.lock);

const localVideo = document.getElementById('localVideo');

document.addEventListener("DOMContentLoaded", function () {
    // Check for PiP API availability
    if ('pictureInPictureEnabled' in document) {
        console.log("PiP API is available");
    } else {
        console.log("PiP API is not available");
        alert("Your browser does not support Picture-in-Picture mode.");
    }
    document.getElementById('start-camera').addEventListener('click', getlocalStream);
    console.log("Event listener added");
});

let localStream;

const superDepth = 0; // 1 means yes, 0 means no
let width = 320;  // Default values; they will be updated
let height = 240;  // Default values; they will be updated

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
console.log("Before getlocalStream()");
// Capture video from the selected camera and display in localVideo element
async function getlocalStream() {
    const cameraList = document.getElementById('camera-list');
    const constraints = {
        audio: true,
        video: {
            deviceId: cameraList.value,
            width: width,
            height: height
        }
    };

    try {
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        const localVideo = document.getElementById('localVideo');
        localVideo.srcObject = localStream;
        await localVideo.play();
    } catch (error) {
        console.error("Error accessing camera:", error);
    }
}

console.log("Before populateCameraDropdown");
function populateCameraDropdown() {
    return navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const deviceList = document.getElementById('camera-list');
            devices.forEach(device => {
                if (device.kind === "videoinput") {
                    const option = document.createElement('option');
                    option.value = device.deviceId;
                    option.text = `${device.label || device.deviceId} (${device.kind})`;
                    deviceList.appendChild(option);
                }
            });
        });
}

console.log("Before populateCameraDropdown");
// Initially populate the camera dropdown
populateCameraDropdown()
    .catch(error => {
        console.error("Error enumerating devices:", error);
    });

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

console.log("Before Cardboard Button block");
// Add a Cardboard VR icon to the control area.

let metadataLoadedForLocalVideo = false;

localVideo.addEventListener('loadedmetadata', function () {
    metadataLoadedForLocalVideo = true;
});


const cardboardButton = document.getElementById('cardboardButton');

function handleCardboardButtonClick() {
    toggleFullscreen(document.getElementById('localVideo'));
}

cardboardButton.addEventListener('click', handleCardboardButtonClick);
cardboardButton.addEventListener('touchend', function (event) {
    event.preventDefault(); // Prevent the default touchend behavior
    handleCardboardButtonClick();
});

function toggleFullscreen(videoElement) {
    if (!document.fullscreenElement) {
        // If not in fullscreen, try to enter fullscreen in landscape mode.
        if (screen.orientation) {
            screen.orientation.lock('landscape').then(() => {
                videoElement.requestFullscreen();
            }).catch(error => {
                console.error("Couldn't lock screen orientation:", error);
                // If orientation lock fails, just enter fullscreen mode without it.
                videoElement.requestFullscreen();
            });
        } else {
            videoElement.requestFullscreen();
        }
    } else {
        // If already in fullscreen, exit fullscreen.
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {  // For Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {  // For Chrome and Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {  // For IE and Edge
            document.msExitFullscreen();
        }

        // Unlock the screen orientation if it's locked.
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    }
}

document.addEventListener('fullscreenchange', function () {
    if (document.fullscreenElement) {
        console.log('Entered fullscreen mode');
    } else {
        console.log('Exited fullscreen mode');
    }
});
