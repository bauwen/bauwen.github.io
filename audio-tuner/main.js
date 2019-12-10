var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");

var audioContext = window.AudioContext || window.webkitAudioContext;
var ac = new audioContext();
var safariProblem = typeof ac.createStereoPanner !== "function";
var source = ac.createBufferSource();
var gain = ac.createGain();
var filter = ac.createBiquadFilter();
var analyser = ac.createAnalyser();
var panner = safariProblem ? { pan: { value: 0 } } : ac.createStereoPanner();
var convolver = ac.createConvolver();
var shaper = ac.createWaveShaper();

source.connect(filter);
filter.connect(shaper);
//convolver.connect(shaper);
if (safariProblem) {
    shaper.connect(gain);
} else {
    shaper.connect(panner);
    panner.connect(gain);
}
gain.connect(analyser);
analyser.connect(ac.destination);

//setConvolverImpulse(2, 10);
setDistortionCurve(shaper, 0);

var color1 = "rgb(220, 140, 60)";
var color2 = "rgb(180, 170, 160)";
var color3 = "rgb(100, 100, 100)";
var color4 = "rgb(60, 60, 60)";
var color5 = "rgb(130, 130, 130)";

var preverb = 0;
var predist = 0;

var sliderWidth = 300;

var pitchSlider = new Slider(0, 0, sliderWidth, 0, 200);
var filterSlider = new Slider(0, 0, sliderWidth, 0, 100);
//var reverbSlider = new Slider(0, 0, sliderWidth, 0, 100);
var distortionSlider = new Slider(0, 0, sliderWidth/* / 2.5*/, 0, 100);
var panSlider = new Slider(0, 0, sliderWidth/* / 2.5*/, 0, 100);

pitchSlider.value = 100;
filterSlider.value = 0;//100;
//reverbSlider.value = 0;
distortionSlider.value = 0;
panSlider.value = 50;

var timeSlider = new Slider(0, 0, 500, 0, 100, seekAudio);
var volumeSlider = new Slider(0, 0, 100, 0, 100);

timeSlider.value = 0;
volumeSlider.value = volumeSlider.max;

var butw = 30;
var buth = butw;

var playButton = new Button(0, 0, butw, buth, function () { if (PLAYING) { pauseAudio(); } else { playAudio(); } });
var stopButton = new Button(0, 0, butw, buth, stopAudio);
var loopButton = new Button(0, 0, butw, buth, function () { LOOPING = !LOOPING });

var exportWavButton = new Button(0, 0, 150, 30, function () { exportAudio("wav"); });
var exportMp3Button = new Button(0, 0, 150, 30, function () { exportAudio("mp3"); });

var filterButton = new Button(0, 0, 110, 20, function () { FILTER = (FILTER + 1) % filters.length; });
//var reverbButton = new Button(0, 0, 60, 20, toggleReverb);

var font = " verdana, monospace";

var PLAYING = false;
var LOOPING = true;
var REVERB = false;
var FILTER = 0;
var TITLE = "[please load an audio file]";
var BUFFER = null;
var SEEKING = false;
var MESSAGE = "Drag 'n drop your audio file or click on the button";
var LOADING = false;

var currmessage = "";
var prevloading = false;

var filters = [
    "lowpass",
    "highpass",
    //"bandpass",
    "lowshelf",
    "highshelf",
    //"peaking",
    //"notch",
    //"allpass"
];

var loadButton = new Button(0, 0, 130, 30);

function setConvolverImpulse(seconds, decay) {
    var rate = ac.sampleRate;
    var length = Math.floor(seconds * rate);
    var impulse = ac.createBuffer(1, length, rate);
    var buffer = impulse.getChannelData(0);
    
    for (var i = 0; i < length; i++) {
        buffer[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
    
    convolver.buffer = impulse;
}

function setDistortionCurve(shaper, k) {
    if (safariProblem) return;
    if (k < 0.1) {
        shaper.curve = null;
        return;
    }
    
    var rate = ac.sampleRate;
    var curve = new Float32Array(rate);
    var deg = Math.PI / 180;
    var i = 0;
    
    for (var i = 0; i < rate; i++) {
        var x = i * 2 / rate - 1;
        curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
    }
    
    shaper.curve = curve;
}

function mainloop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateControl();
    
    if (totalTime > 0) {
        timeSlider.value = currentTime / totalTime * 100;
    } else {
        timeSlider.value = 0;
    }
    
    var vy = 500;
    
    visualizeFrequency(0, vy + 10, canvas.width, canvas.height - vy);
    visualizeTimeDomain(0, vy, canvas.width, canvas.height - vy);
    
    drawTitleSection();
    drawEffectSection();
    drawControlSection();
    drawInfoSection();
    
    filter.type = filters[FILTER];
    var fv = clamp(filterSlider.value * 240, 0, 24000);
    filter.frequency.value = filters[FILTER] === "lowshelf" ? fv : 24000 - fv;
    filter.Q.value = -15;
    filter.gain.value = 20;
    
    source.playbackRate.value = clamp(pitchSlider.value / 100, 0.01, 2);
    
    panner.pan.value = clamp((panSlider.value - 50) / 50, -1, 1);
    
    /*
    if (REVERB && preverb != reverbSlider.value) {
        setConvolverImpulse(2, 10 - reverbSlider.value / 10);
    }
    preverb = reverbSlider.value;
    */
    
    if (predist != distortionSlider.value) {
        setDistortionCurve(shaper, clamp(distortionSlider.value / 5, 0, 20));
    }
    predist = distortionSlider.value;
    
    gain.gain.value = clamp(volumeSlider.value / 100, 0, 1);
    
    if (!prevloading && LOADING) {
        loadTimer = 0;
        currmessage = MESSAGE;
    }
    prevloading = LOADING;
    
    if (LOADING) {
        var tt = 60;
        loadTimer = (loadTimer + 1) % (tt * 4);
        MESSAGE = currmessage + ".".repeat(Math.floor(loadTimer / tt));
    }
    
    mousePressed = false;
    requestAnimationFrame(mainloop);
}

/*
function toggleReverb() { 
    if (REVERB) {
        convolver.disconnect(shaper);
        filter.disconnect(convolver);
        filter.connect(shaper);
        REVERB = false;
    } else {
        filter.disconnect(shaper);
        filter.connect(convolver);
        convolver.connect(shaper);
        setConvolverImpulse(2, 10 - reverbSlider.value / 10);
        REVERB = true;
    }
}
*/

function loadAudio(file) {
    if (LOADING || !file) {
        return;
    }
    
    TITLE = file.name;
    stopAudio();
    
    var reader = new FileReader();
    
    reader.addEventListener("load", function (event) {
        MESSAGE = "Please wait. Loading your audio";
        LOADING = true;
        
        ac.decodeAudioData(event.target.result, function (buffer) {
            MESSAGE = "";
            LOADING = false;
            
            BUFFER = buffer;
            
            currentTime = 0;
            totalTime = buffer.duration;
            
            try {
                source.disconnect(filter);
            } catch (err) {
                // do nothing
            }
            
            stopAudio();
            playAudio();
        });
    });
    
    reader.readAsArrayBuffer(file);
}

function exportWAV(buffer, callback) {
    document.getElementById("link").setAttribute("download", "untitled.wav");
    
    encodeWAV(buffer.getChannelData(0), function (result) {
        var blob = new Blob([result], {
            type: "audio/wav"
        });
        
        callback(blob);
    });
}

function exportMP3(buffer, callback) {
    document.getElementById("link").setAttribute("download", "untitled.mp3");
    
    encodeMP3(buffer.getChannelData(0), function (result) {
        var blob = new Blob(result, {
            type: "audio/mp3"
        });
        
        callback(blob);
    });
}

function exportAudio(type) {
    if (BUFFER === null || safariProblem) {
        return;
    }
    
    stopAudio();
    
    MESSAGE = "Please wait. Converting your tuned audio to " + (type === "wav" ? "WAV" : "MP3");
    LOADING = true;

    var rate = ac.sampleRate;
    var $ac = new OfflineAudioContext(1, rate * source.buffer.duration / source.playbackRate.value, rate);
    
    var $source = $ac.createBufferSource();
    var $gain = $ac.createGain();
    var $filter = $ac.createBiquadFilter();
    var $panner = $ac.createStereoPanner();
    //var $convolver = $ac.createConvolver();
    var $shaper = $ac.createWaveShaper();

    $source.connect($filter);
    $filter.connect($shaper);
    //$convolver.connect($shaper);
    $shaper.connect($panner);
    $panner.connect($gain);
    $gain.connect($ac.destination);
    
    $source.buffer = BUFFER;
    $filter.type = filter.type;
    $filter.frequency.value = filter.frequency.value;
    $filter.Q.value = filter.Q.value;
    $source.playbackRate.value = source.playbackRate.value;
    $panner.pan.value = panner.pan.value;
    $gain.gain.value = gain.gain.value;
    //$convolver.buffer = convolver.buffer;
    setDistortionCurve($shaper, clamp(distortionSlider.value / 5, 0, 20));
    //$shaper.curve = shaper.curve;
    
    $source.start(0);
    
    $ac.startRendering();
    $ac.addEventListener("complete", function (data) { 
        var buffer = data.renderedBuffer;
        
        console.log("Uncompressed: " + buffer.getChannelData(0).byteLength + " bytes");
        
        function downloadAudio(blob) {
            MESSAGE = "";
            LOADING = false;
            
            var url = URL.createObjectURL(blob);
            
            document.getElementById("link").setAttribute("href", url);
            document.getElementById("link").click();
        }
        
        if (type === "wav") {
            exportWAV(buffer, downloadAudio);
        } else {
            exportMP3(buffer, downloadAudio);
        }
    });
}

function encodeWAV(samples, callback) {
    var worker = new Worker("encodeWAV.js");
    
    var message = {
        buffer: samples,
        sampleRate: ac.sampleRate
    };
    
    worker.postMessage(message, [message.buffer.buffer]);
    worker.onmessage = function (message) {
        callback(message.data);
    };
}

function encodeMP3(samples, callback) {
    encodeWAV(samples, function (samples) {
        var worker = new Worker("encodeMP3.js");
        
        worker.postMessage(samples, [samples]);
        worker.onmessage = function (message) {
            callback(message.data);
        };
    });
}

window.addEventListener("load", function () {
    window.onresize();
    requestAnimationFrame(mainloop);
});
