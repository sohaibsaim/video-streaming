async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.getElementById('webcamVideo');
        videoElement.srcObject = stream;
        videoElement.play();

        if (getMobileOperatingSystem() === 'iOS') {
            alert('for better user experience please use it in potrait mode');
        }

    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
}

startWebcam();

function makeLandscape() {
    if (screen.orientation.type !== 'landscape-primary') {
        // this works on android, not iOS
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape');
        }
    }
}

function fullscreen() {
    var element = document.getElementById('webcamVideo');
    if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
        makeLandscape();
        toggleFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
        makeLandscape();
        toggleFullScreen();
    }

}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        let videoElement = document.getElementById('webcamVideo');
        videoElement.requestFullscreen().catch(err => {
            console.error('Error attempting to enable full-screen mode:', err);
        });
    } else {
        document.exitFullscreen().catch(err => {
            console.error('Error attempting to exit full-screen mode:', err);
        });
    }
}

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}
