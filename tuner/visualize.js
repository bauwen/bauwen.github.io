var fftm = 4;

analyser.fftSize = 256 * fftm;//2048;

var binCount = analyser.frequencyBinCount;
var analyserData = new Uint8Array(binCount);

function visualizeTimeDomain(x, y, w, h) {
    if (!PLAYING) {
        return;
    }
    
    y += 10;
    
    analyser.getByteTimeDomainData(analyserData);
    
    ctx.lineWidth = 3;
    ctx.strokeStyle = color2;
    /*
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();
    */
    ctx.beginPath();
    
    binCount = analyser.frequencyBinCount
    var s = w / binCount;
    var xx = x;
    
    for (var i = 0; i < binCount; i++) {
        var yy = y + analyserData[i] / 128.0 * h / 2.5;
        
        if (i === 0) {
            ctx.moveTo(xx, yy);
        } else {
            ctx.lineTo(xx, yy);
        }
        
        xx += s;
    }
    
    //ctx.lineTo(w, y + h / 2);
    ctx.stroke();
}

function visualizeFrequency(x, y, w, h) {
    if (!PLAYING) {
        return;
    }
    
    analyser.getByteFrequencyData(analyserData);
    
    ctx.lineWidth = 2;
    ctx.fillStyle = color1;
    
    var ii = 3 * fftm;
    var s = w / binCount * ii;// * 2.5;
    var xx = x + 2;
    
    for (var i = 0; i < binCount; i += ii) {
        var height = analyserData[i] / 256.0 * h;
        
        ctx.globalAlpha = height / h;
        ctx.fillRect(xx, y + h - height, s, height);
        
        xx += s + 2;
    }
    
    ctx.globalAlpha = 1;
}