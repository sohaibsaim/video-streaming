let mediaStream; // Declare as Global

// Enumerate cameras and populate dropdown
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
        const localVideo1 = document.getElementById('localVideo1');
        localVideo1.srcObject = mediaStream;
        // const videoTracks = mediaStream.getVideoTracks();
        // console.log('Number of video tracks:', videoTracks.length);
        localVideo.play();  // Start playing the video
        localVideo1.play();  // Start playing the video
    } catch (error) {
        console.error("Error accessing camera:", error);
    }
}

function initializeVideoJS() {
    const player = videojs('localVideo');  // Use the ID of the video element
    player.muted(true);
    player.vr({ projection: 'AUTO', forceCardboard: true });
    player.play();

    const player1 = videojs('localVideo1');  // Use the ID of the video element
    player1.muted(true);
    player1.vr({ projection: 'AUTO', forceCardboard: true });
    player1.play();
}

function startCameraAndPlay() {
    getMediaStream()
        .then(() => {
            initializeVideoJS();
            // const player = videojs('localVideo');
            // player.play();  // Programmatic play after initializing and setting the stream.

            // const player1 = videojs('localVideo1');
            // player1.play();  // Programmatic play after initializing and setting the stream.
        })
        .catch(error => {
            console.error("Error accessing camera:", error);
        });
}

// Initially populate the camera dropdown
populateCameraDropdown()
    .catch(error => {
        console.error("Error enumerating devices:", error);
    });

