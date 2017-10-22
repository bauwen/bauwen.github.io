
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
    
    chiptune.tempo = 10;
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
            var volumeLevel = chiptune.masterVolumeLevel / 4 / (test ? 4 : 1);
            var volume = chiptune.context.createGain();
            
            volume.gain.value = volumeLevel;
            volume.connect(chiptune.masterVolume);
            
            console.log(volume.gain);
            
            
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
                    volume.gain.setValueAtTime(0, startTime);
                    volume.gain.linearRampToValueAtTime(volumeLevel, startTime + 0.002);
                    volume.gain.setValueAtTime(volumeLevel, stopTime - 0.002);
                    volume.gain.linearRampToValueAtTime(0, stopTime);
                }
                
                if (frequency > 0) {
                    //frequency *= 2;
                    var note = this.instrument.createNote(volume, frequency);
                    
                    
                    // vibratio effect  -- (todo: create Float32Array only once and reuse (if possible))
                    // ...and many more effects possible: like slide up, slide down etc.!
                    var s = frequency;
                    var waveArray = new Float32Array(2); // important to have exact size
                    waveArray[0] = s * 1;
                    waveArray[1] = s * 0.8;
                    //waveArray[2] = s * 1.1
                    //waveArray[3] = s * 1;
                    
                    if (false && note.frequency) {
                    
                        note.frequency.setValueCurveAtTime(waveArray, startTime, stopTime - startTime);
                    
                    }
                    
                    note.start(startTime);
                    note.stop(stopTime); 
                }
                
                if (i >= this.frequencies.length - 1 && !test) {
                    note.onended = function () {
                        console.log("Song has ended.");
                    }
                }
            }
        }
    };
    
    
}



// Test

var tune = new Chiptune();

var channel1 = new tune.Channel('square');
channel1.setNotes([

"Bb4","Bb4","Bb4","Bb4","Bb4","Bb4","Bb4","Bb4",
"","","",
"Bb4",
"Bb4",
"Bb4",
"Bb4",
"Bb4","Bb4","Bb4",
"Ab4",
"Bb4","Bb4","Bb4","Bb4",
"","","",
"Bb4",
"Bb4",
"Bb4",
"Bb4",
"Bb4","Bb4","Bb4",
"Ab4",
"Bb4","Bb4","Bb4","Bb4",
"Bb4","Bb4","Bb4",
"Bb4",
"Bb4",
"Bb4",
"Bb4",
"Bb4","Bb4",
"F4",
"F4",
"F4","F4",
"F4",
"F4",
"F4","F4",
"F4",
"F4",
"F4","F4",
"F4","F4",
"Bb4","Bb4","Bb4","Bb4",
"F4","F4","F4","F4",
"F4","F4","F4",
"Bb4",
"Bb4",
"C5",
"D5",
"Eb5",
"F5","F5","F5","F5","F5","F5","F5","F5",
"","",
"F5","F5",
"F5",
"Gb5",
"Ab5",
"Bb5","Bb5","Bb5","Bb5","Bb5","Bb5","Bb5","Bb5",
"",
"Bb5",
"Bb5",
"Bb5",
"Ab5",
"Gb5",
"Ab5","Ab5","Ab5",
"Gb5",
"F5","F5","F5","F5","F5","F5","F5","F5",
"F5","F5","F5","F5",
"Eb5","Eb5",
"Eb5",
"F5",
"Gb5","Gb5","Gb5","Gb5","Gb5","Gb5","Gb5","Gb5",
"F5","F5",
"Eb5","Eb5",
"Db5","Db5",
"Db5",
"Eb5",
"F5","F5","F5","F5","F5","F5","F5","F5",
"Eb5","Eb5",
"Db5","Db5",
"C5","C5",
"C5",
"D5",
"E5","E5","E5","E5","E5","E5","E5","E5",
"G5","G5","G5","G5",
"F5","F5",
"F4",
"F4",
"F4","F4",
"F4",
"F4",
"F4","F4",
"F4",
"F4",
"F4","F4",
"F4","F4",
"Bb4","Bb4","Bb4","Bb4",
"F4","F4","F4","F4",
"F4","F4","F4",
"Bb4",
"Bb4",
"C5",
"D5",
"Eb5",
"F5","F5","F5","F5","F5","F5","F5","F5",
"","",
"F5","F5",
"F5",
"Gb5",
"Ab5",
"Bb5","Bb5","Bb5","Bb5","Bb5","Bb5","Bb5","Bb5","Bb5","Bb5","Bb5","Bb5",
"Db6","Db6","Db6","Db6",
"C6","C6","C6","C6",
"A5","A5","A5","A5","A5","A5","A5","A5",
"F5","F5","F5","F5",
"Gb5","Gb5","Gb5","Gb5","Gb5","Gb5","Gb5","Gb5",
"","","","",
"Bb5","Bb5","Bb5","Bb5",
"A5","A5","A5","A5",
"F5","F5","F5","F5","F5","F5","F5","F5",
"F5","F5","F5","F5",
"Gb5","Gb5","Gb5","Gb5","Gb5","Gb5","Gb5","Gb5",
"","","","",
"Bb5","Bb5","Bb5","Bb5",
"A5","A5","A5","A5",
"F5","F5","F5","F5","F5","F5","F5","F5",
"D5","D5","D5","D5",
"Eb5","Eb5","Eb5","Eb5","Eb5","Eb5","Eb5","Eb5",
"","","","",
"Gb5","Gb5","Gb5","Gb5",
"F5","F5","F5","F5",
"Db5","Db5","Db5","Db5","Db5","Db5","Db5","Db5",
"Bb4","Bb4","Bb4","Bb4",
"C5","C5",
"C5",
"D5",
"E5","E5","E5","E5","E5","E5","E5","E5",
"G5","G5","G5","G5",
"F5","F5",
"F4",
"F4",
"F4","F4",
"F4",
"F4",
"F4","F4",
"F4",
"F4",
"F4","F4",
"F4","F4",


]);

var channel2 = new tune.Channel('square');
channel2.setNotes([

"D4","D4","D4","D4","D4","D4","D4","D4",
"","","",
"D4",
"D4",
"D4",
"D4",
"C4","C4","C4",
"C4",
"C4","C4","C4","C4",
"","","",
"C4",
"C4",
"C4",
"C4",
"Db4","Db4","Db4",
"Db4",
"Db4","Db4","Db4","Db4",
"Db4","Db4","Db4",
"Db4",
"Db4",
"Db4",
"Db4",
"Db4","Db4",
"A3",
"A3",
"A3","A3",
"A3",
"A3",
"A3","A3",
"A3",
"A3",
"A3","A3",
"A3","A3",
"D4","D4","D4","D4",
"D4",
"D4",
"C4",
"D4","D4","D4",
"D4",
"D4",
"Eb4",
"F4",
"G4",
"Ab4","Ab4","Ab4",
"Bb4",
"Bb4",
"C5",
"D5",
"Eb5",
"F5","F5",
"F5","F5",
"Ab4",
"Bb4",
"C5",
"Db5","Db5","Db5",
"Gb4",
"Gb4",
"Ab4",
"Bb4",
"C5",
"Db5","Db5",
"Db5","Db5",
"Db5",
"C5",
"Bb4",
"Db5","Db5","Db5",
"Ab4",
"Ab4",
"Ab4",
"Gb4",
"Ab4","Ab4","Ab4",
"Ab4",
"Ab4",
"Gb4",
"Ab4",
"Gb4","Gb4",
"",
"Gb4",
"F4",
"Gb4","Gb4",
"",
"Gb4",
"F4",
"Bb4","Bb4","Bb4","Bb4",
"Ab4","Ab4",
"Gb4","Gb4",
"F4","F4",
"",
"F4",
"Eb4",
"F4","F4",
"",
"F4",
"Gb4",
"Ab4","Ab4","Ab4","Ab4",
"Gb4","Gb4",
"F4","F4",
"E4","E4","E4","E4",
"E4","E4","E4",
"F4",
"G4","G4",
"",
"G4",
"Ab4",
"Bb4","Bb4",
"C5","C5",
"A4","A4",
"A3",
"A3",
"A3","A3",
"A3",
"A3",
"A3","A3",
"A3",
"A3",
"A3","A3",
"A3","A3",
"D4","D4","D4","D4",
"D4",
"D4",
"C4",
"D4","D4","D4",
"D4",
"D4",
"Eb4",
"F4",
"G4",
"Ab4","Ab4","Ab4",
"Bb4",
"Bb4",
"C5",
"D5",
"Eb5",
"F5","F5",
"F5","F5",
"Ab4",
"Bb4",
"C5",
"Db5","Db5","Db5","Db5","Db5","Db5","Db5","Db5","Db5","Db5","Db5","Db5",
"E5","E5","E5","E5",
"Eb5","Eb5","Eb5","Eb5",
"C5","C5","C5","C5","C5","C5","C5","C5",
"A4","A4","A4","A4",
"B4","B4","B4","B4","B4","B4","B4","B4",
"","","","",
"Db5","Db5","Db5","Db5",
"C5","C5","C5","C5",
"A4","A4","A4","A4","A4","A4","A4","A4",
"A4","A4","A4","A4",
"B4","B4","B4","B4","B4","B4","B4","B4",
"","","","",
"Db5","Db5","Db5","Db5",
"C5","C5","C5","C5",
"A4","A4","A4","A4","A4","A4","A4","A4",
"A4","A4","A4","A4",
"Gb4","Gb4","Gb4","Gb4","Gb4","Gb4","Gb4","Gb4",
"","","","",
"B4","B4","B4","B4",
"Bb4","Bb4","Bb4","Bb4",
"F4","F4","F4","F4","F4","F4","F4","F4",
"Db4","Db4","Db4","Db4",
"E4","E4","E4","E4",
"E4","E4","E4",
"F4",
"G4","G4",
"",
"G4",
"Ab4",
"Bb4","Bb4",
"C5","C5",
"A4","A4",
"A3",
"A3",
"A3","A3",
"A3",
"A3",
"A3","A3",
"A3",
"A3",
"A3","A3",
"A3","A3",


]);

var channel3 = new tune.Channel('sawtooth');
channel3.setNotes([

"Bb2","Bb2","Bb2","Bb2",
"Bb2",
"Bb2",
"Bb2",
"Bb2","Bb2","Bb2","Bb2",
"Bb2",
"Bb2",
"Bb2",
"Ab2","Ab2","Ab2","Ab2",
"Ab2",
"Ab2",
"Ab2",
"Ab2","Ab2","Ab2","Ab2",
"Ab2",
"Ab2",
"Ab2",
"Gb2","Gb2","Gb2","Gb2",
"Gb2",
"Gb2",
"Gb2",
"Gb2","Gb2","Gb2","Gb2",
"Gb2",
"Gb2",
"Gb2",
"Gb2","Gb2","Gb2","Gb2",
"F2","F2","F2","F2",
"F2","F2","F2","F2",
"G2","G2",
"A2","A2",
"Bb2","Bb2","Bb2","Bb2",
"Bb2",
"Bb2",
"Ab2",
"Bb2","Bb2","Bb2","Bb2",
"Bb2","Bb2","Bb2","Bb2",
"Ab2","Ab2","Ab2","Ab2",
"Ab2",
"Ab2",
"Gb2",
"Ab2","Ab2","Ab2","Ab2",
"Ab2","Ab2","Ab2","Ab2",
"Gb2","Gb2","Gb2","Gb2",
"Gb2",
"Gb2",
"E2",
"Gb2","Gb2","Gb2","Gb2",
"Gb2","Gb2","Gb2","Gb2",
"Db3","Db3","Db3","Db3",
"Db3",
"Db3",
"B2",
"Db3","Db3","Db3","Db3",
"Db3","Db3","Db3","Db3",
"B2","B2","B2","B2",
"B2",
"B2",
"Bb2",
"B2","B2","B2","B2",
"B2",
"B2",
"B2",
"Bb2","Bb2","Bb2","Bb2",
"Bb2",
"Bb2",
"Ab2",
"Bb2","Bb2","Bb2","Bb2",
"Bb2",
"Bb2",
"Bb2",
"C3","C3","C3","C3",
"C3",
"C3",
"Bb2",
"C3","C3","C3","C3",
"C3",
"C3",
"C3",
"F2","F2","F2","F2",
"F2","F2","F2","F2",
"F2","F2","F2","F2",
"G2","G2",
"A2","A2",
"Bb2","Bb2","Bb2","Bb2",
"Bb2",
"Bb2",
"Ab2",
"Bb2","Bb2","Bb2","Bb2",
"Bb2","Bb2","Bb2","Bb2",
"Ab2","Ab2","Ab2","Ab2",
"Ab2",
"Ab2",
"Gb2",
"Ab2","Ab2","Ab2","Ab2",
"Ab2","Ab2","Ab2","Ab2",
"Gb2","Gb2","Gb2","Gb2",
"Gb2",
"Gb2",
"E2",
"Gb2","Gb2","Gb2","Gb2",
"Gb2","Gb2","Gb2","Gb2",
"F2","F2","F2","F2",
"F2",
"F2",
"Eb2",
"F2","F2","F2","F2",
"F2","F2","F2","F2",
"E2",
"Bb2",
"Db3",
"E3",
"Bb3",
"Db4",
"E4","E4","E4","E4",
"","","","",
"F4","F4","F4","F4",
"F2",
"F2",
"F2",
"F2","F2","F2","F2",
"","","","",
"E2",
"Bb2",
"Db3",
"E3",
"Bb3",
"Db4",
"E4","E4","E4","E4",
"","","","",
"F4","F4","F4","F4",
"F2",
"F2",
"F2",
"F2","F2","F2","F2",
"","","","",
"B2","B2","B2","B2",
"B2",
"B2",
"Bb2",
"B2","B2","B2","B2",
"B2",
"B2",
"B2",
"Bb2","Bb2","Bb2","Bb2",
"Bb2",
"Bb2",
"Ab2",
"Bb2","Bb2","Bb2","Bb2",
"Bb2",
"Bb2",
"Bb2",
"C3","C3","C3","C3",
"C3",
"C3",
"Bb2",
"C3","C3","C3","C3",
"C3",
"C3",
"C3",
"F2","F2","F2","F2",
"F2","F2","F2","F2",
"F2","F2","F2","F2",
"G2","G2",
"A2","A2",


]);

var started = false;
window.setTimeout(function () {
    if (!started) {
    channel1.play();
    channel2.play();
    channel3.play();
    started = true;
    }
}, 2000);

