
var frequencyTable = {
    "": 0.0,
    "C0": 16.35,
    "C#0": 17.32,
    "Db0": 17.32,
    "D0": 18.35,
    "D#0": 19.45,
    "Eb0": 19.45,
    "E0": 20.60,
    "F0": 21.83,
    "F#0": 23.12,
    "Gb0": 23.12,
    "G0": 24.50,
    "G#0": 25.96,
    "Ab0": 25.96,
    "A0": 27.50,
    "A#0": 29.14,
    "Bb0": 29.14,
    "B0": 30.87,
    "C1": 32.70,
    "C#1": 34.65,
    "Db1": 34.65,
    "D1": 36.71,
    "D#1": 38.89,
    "Eb1": 38.89,
    "E1": 41.20,
    "F1": 43.65,
    "F#1": 46.25,
    "Gb1": 46.25,
    "G1": 49.00,
    "G#1": 51.91,
    "Ab1": 51.91,
    "A1": 55.00,
    "A#1": 58.27,
    "Bb1": 58.27,
    "B1": 61.74,
    "C2": 65.41,
    "C#2": 69.30,
    "Db2": 69.30,
    "D2": 73.42,
    "D#2": 77.78,
    "Eb2": 77.78,
    "E2": 82.41,
    "F2": 87.31,
    "F#2": 92.50,
    "Gb2": 92.50,
    "G2": 98.00,
    "G#2": 103.83,
    "Ab2": 103.83,
    "A2": 110.00,
    "A#2": 116.54,
    "Bb2": 116.54,
    "B2": 123.47,
    "C3": 130.81,
    "C#3": 138.59,
    "Db3": 138.59,
    "D3": 146.83,
    "D#3": 155.56,
    "Eb3": 155.56,
    "E3": 164.81,
    "F3": 174.61,
    "F#3": 185.00,
    "Gb3": 185.00,
    "G3": 196.00,
    "G#3": 207.65,
    "Ab3": 207.65,
    "A3": 220.00,
    "A#3": 233.08,
    "Bb3": 233.08,
    "B3": 246.94,
    "C4": 261.63,
    "C#4": 277.18,
    "Db4": 277.18,
    "D4": 293.66,
    "D#4": 311.13,
    "Eb4": 311.13,
    "E4": 329.63,
    "F4": 349.23,
    "F#4": 369.99,
    "Gb4": 369.99,
    "G4": 392.00,
    "G#4": 415.30,
    "Ab4": 415.30,
    "A4": 440.00,
    "A#4": 466.16,
    "Bb4": 466.16,
    "B4": 493.88,
    "C5": 523.25,
    "C#5": 554.37,
    "Db5": 554.37,
    "D5": 587.33,
    "D#5": 622.25,
    "Eb5": 622.25,
    "E5": 659.26,
    "F5": 698.46,
    "F#5": 739.99,
    "Gb5": 739.99,
    "G5": 783.99,
    "G#5": 830.61,
    "Ab5": 830.61,
    "A5": 880.00,
    "A#5": 932.33,
    "Bb5": 932.33,
    "B5": 987.77,
    "C6": 1046.50,
    "C#6": 1108.73,
    "Db6": 1108.73,
    "D6": 1174.66,
    "D#6": 1244.51,
    "Eb6": 1244.51,
    "E6": 1318.51,
    "F6": 1396.91,
    "F#6": 1479.98,
    "Gb6": 1479.98,
    "G6": 1567.98,
    "G#6": 1661.22,
    "Ab6": 1661.22,
    "A6": 1760.00,
    "A#6": 1864.66,
    "Bb6": 1864.66,
    "B6": 1975.53,
    "C7": 2093.00,
    "C#7": 2217.46,
    "Db7": 2217.46,
    "D7": 2349.32,
    "D#7": 2489.02,
    "Eb7": 2489.02,
    "E7": 2637.02,
    "F7": 2793.83,
    "F#7": 2959.96,
    "Gb7": 2959.96,
    "G7": 3135.96,
    "G#7": 3322.44,
    "Ab7": 3322.44,
    "A7": 3520.00,
    "A#7": 3729.31,
    "Bb7": 3729.31,
    "B7": 3951.07,
    "C8": 4186.01
};

function Chiptune() {
    var chiptune = this;
    
    chiptune.context = new AudioContext();
    
    chiptune.tempo = 3;
    chiptune.masterVolumeLevel = 1.0;
    
    chiptune.masterVolume = chiptune.context.createGain();
    chiptune.masterVolume.gain.value = chiptune.masterVolumeLevel;
    chiptune.masterVolume.connect(chiptune.context.destination);
    
    
    // An oscillator instrument.
    // The type can be "sine", "triangle", "square" or "sawtooth".
    
    var OscillatorInstrument = function (type) {
        this.type = type;
    };
    
    OscillatorInstrument.prototype = {
        createNote: function (destination, frequency) {
            var osc = chiptune.context.createOscillator();
            
            osc.type = this.type;
            osc.frequency.value = frequency;
            osc.connect(destination);
            
            return osc;
        }
    };
    
    
    // A noise instrument.
    // More specifically, white noise.
    
    var NoiseInstrument = function () {};
    
    var noiseBufferSize = chiptune.context.sampleRate / 4;
    var noiseBuffer = chiptune.context.createBuffer(1, noiseBufferSize, chiptune.context.sampleRate);
    
    NoiseInstrument.prototype = {
        createNote: function (destination, frequency) {
            var output = noiseBuffer.getChannelData(0);
            
            for (var i = 0; i < noiseBufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            
            var filter = chiptune.context.createBiquadFilter();
            
            filter.frequency.value = frequency;
            filter.type = "highpass";
            filter.Q.value = 1;
            filter.connect(destination);
            
            var noise = chiptune.context.createBufferSource();
            
            noise.buffer = noiseBuffer;
            noise.loop = true;
            noise.connect(filter);
            
            return noise;
        }
    };
    
    
    // A chiptune channel.
    // This is used to store and play notes by an instrument of the given type.
    
    chiptune.Channel = function (type) {
        switch (type) {
            case "sine":
            case "triangle":
            case "square":
            case "sawtooth":
                this.instrument = new OscillatorInstrument(type);
                break;
                
            case "noise":
                this.instrument = new NoiseInstrument();
                break;
                
            default:
                throw new Error("Invalid instrument type '" + type + "' given.");
        }
        
        this.frequencies = null;
    };
    
    chiptune.Channel.prototype = {
        setNotes: function (notes) {
            this.frequencies = new Float32Array(notes.length);
            
            for (var i = 0; i < notes.length; i++) {
                this.frequencies[i] = frequencyTable[notes[i]];
            }
        },
        
        play: function (test) {
            
            /*
            var note = this.instrument.createNote(chiptune.masterVolume, 440);
            
            var offset = chiptune.context.currentTime;
            
            note.start(offset + 1);
            note.stop(offset + 2);
            */
            
            
            var volumeLevel = chiptune.masterVolumeLevel / 4 / (test ? 4 : 1);
            var volume = chiptune.context.createGain();
            
            volume.gain.value = volumeLevel;
            volume.connect(chiptune.masterVolume);
            
            
            var offset = chiptune.context.currentTime;
            var duration = 1 / chiptune.tempo;
            
            for (var i = 0; i < this.frequencies.length; i++) {
                var frequency = this.frequencies[i];
                
                var startTime = offset + i * duration;
                
                var j = 0;  
                while (j < this.frequencies.length && frequency === this.frequencies[i + j + 1]) {
                    j += 1;
                }
                
                var stopTime = startTime + duration * (j + 1) * 0.95;
                i += j;
                
                
                if (true) {
                    if (startTime > 0) {
                        startTime -= 0.002;
                    }
                    
                    stopTime += 0.002;
                    volume.gain.setValueAtTime(0.0, startTime);
                    volume.gain.linearRampToValueAtTime(volumeLevel, startTime + 0.002);
                    volume.gain.setValueAtTime(volumeLevel, stopTime - 0.002);
                    volume.gain.linearRampToValueAtTime(0.0, stopTime);
                }
                
                if (frequency > 0) {
                    var note = this.instrument.createNote(volume, frequency);
                    
                    note.start(startTime);
                    note.stop(stopTime);
                }
            }
        }
    };
    
    
}



// Test

var tune = new Chiptune();

var channel1 = new tune.Channel("sine");
channel1.setNotes([
    
    "C5",
    "D5",
    "E5",
    "C5",
    "",
    "E5",
    "E5",
    "D5",
    "D5",
    "C5",
    "C5",
    "C5",
    "C5",
    
    "",
    "",
    
    "B5",
    "A5",
    "E5",
    "A5",
    "",
    "E5",
    "G5",
    "D5",
    "G5",
    "A5",
    "A#5",
    "A#5",
    "A5",
    
    "",
    
    // repeat
    
    "C5",
    "D5",
    "E5",
    "C5",
    "",
    "E5",
    "E5",
    "D5",
    "D5",
    "C5",
    "C5",
    "C5",
    "C5",
    
    "",
    "",
    
    "B5",
    "A5",
    "E5",
    "A5",
    "",
    "E5",
    "G5",
    "D5",
    "G5",
    "A5",
    "A#5",
    "A#5",
    "A5",
    
    ""
    
]);

var channel2 = new tune.Channel("noise");
channel2.setNotes([
    
    "C5",
    "D5",
    "E5",
    "C5",
    "",
    "E6",
    "E6",
    "D6",
    "D6",
    "C6",
    "C6",
    "C6",
    "C6",
    
    "",
    "",
    
    "",
    "",
    "",
    "",
    "",
    "E5",
    "G5",
    "D5",
    "G5",
    "A5",
    "",
    "",
    "",
    
    "",
    
    // repeat
    
    "C5",
    "D5",
    "E5",
    "C5",
    "",
    "E6",
    "E6",
    "D6",
    "D6",
    "C6",
    "C6",
    "C6",
    "C6",
    
    "",
    "",
    
    "",
    "",
    "",
    "",
    "",
    "E5",
    "G5",
    "D5",
    "G5",
    "A5",
    "",
    "",
    "",
    
    "",
    
]);

channel1.play();
channel2.play(true);

/*
var track = new tune.Track();

track.pushChannel(channel1);
track.pushChannel(channel2, true);  // true -- loop channel playback within track

setTimeout(function () {
    track.play(true);  // true -- loop whole track playback
}, 1000);

requestAnimationFrame(function tuneloop() {
    tune.update();  // used to check whether a channel is finished (and should start again if looping etc.)
    requestAnimationFrame(tuneloop);
});
*/
