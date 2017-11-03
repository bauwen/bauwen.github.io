self.importScripts("lame.min.js");

function encodeMono(channels, sampleRate, samples) {
    var buffer = [];
    var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
    var remaining = samples.length;
    var maxSamples = 1152;
    
    for (var i = 0; remaining >= maxSamples; i += maxSamples) {
        var mono = samples.subarray(i, i + maxSamples);
        var mp3buf = mp3enc.encodeBuffer(mono);
        
        if (mp3buf.length > 0) {
            buffer.push(new Int8Array(mp3buf));
        }
        
        remaining -= maxSamples;
    }
    
    var d = mp3enc.flush();
    
    if(d.length > 0){
        buffer.push(new Int8Array(d));
    }
    
    return buffer;
}

function convertWAVToMP3(audioData) {
    var wav = lamejs.WavHeader.readHeader(new DataView(audioData));
    var samples = new Int16Array(audioData, wav.dataOffset, wav.dataLen / 2);
    
    return encodeMono(wav.channels, wav.sampleRate, samples);
};

self.onmessage = function (message) {
    var wav = message.data;
    var result = convertWAVToMP3(wav);
    
    self.postMessage(result, result.map(function (buffer) {
        return buffer.buffer;
    }));
};
