//var timeMark = 0;
var prevTime = 0;
var currentTime = 0;
var totalTime = 0;
var wasPlaying = false;

function playAudio() {
    if (BUFFER === null || MESSAGE !== "") {
        return;
    }
    
    PLAYING = true;
    
    source = ac.createBufferSource();
    source.buffer = BUFFER;
    source.connect(filter);
    
    //timeMark = ac.currentTime - currentTime;
    source.start(ac.currentTime, currentTime);
}

function pauseAudio() {
    if (!PLAYING) {
        return;
    }
    
    PLAYING = false;
    
    source.stop(ac.currentTime);
    source.disconnect(filter);
}

function stopAudio() {
    pauseAudio();
    currentTime = 0;
}

function seekAudio(p) {
    var value = p / 100;
    
    currentTime = totalTime * value;
    
    if (!SEEKING) {
        wasPlaying = PLAYING;
        pauseAudio();
    }
}

function updateControl() {
    if (PLAYING) {
        //currentTime = ac.currentTime - timeMark;
        currentTime += (ac.currentTime - prevTime) * source.playbackRate.value;
        
        if (currentTime > totalTime) {
            if (LOOPING) {
                stopAudio();
                playAudio();
            } else {
                currentTime = totalTime;
                pauseAudio();
            }
        }
    }
    
    if (wasPlaying && !SEEKING) {
        wasPlaying = false;
        playAudio();
    }
    
    prevTime = ac.currentTime;
}
