function drawSliderInfo(slider, title, value) {
    ctx.textAlign = "left";
    ctx.fillText(title, slider.x, slider.y - 30);
    
    ctx.textAlign = "right";
    ctx.fillText(value, slider.x + slider.width, slider.y - 30);
    
    ctx.textAlign = "left";
}

function drawTitleSection() {
    ctx.font = "48px" + font;
    ctx.textAlign = "left";
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "black";
    ctx.fillText("Audio Tuner", 3 + 40 + 0*canvas.width / 1.05, 3 + 60);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillText("Audio Tuner", 40 + 0*canvas.width / 1.05, 60);
    
    ctx.font = "12px" + font;
    ctx.fillStyle = "rgb(100, 100, 100)";
    ctx.fillText("Purely client-side via the Web Audio API", 60, 80);
    
    ctx.textAlign = "center";
    ctx.font = "14px" + font;
    
    var title = TITLE;//"A Very Long Song Title - Kanye West.mp3";
    var width = ctx.measureText(title).width;
    var sliced = false;
    
    while (width > 400) {
        title = title.slice(0, title.length - 1);
        width = ctx.measureText(title).width;
        sliced = true;
    }
    
    if (sliced) {
        title += title.charAt(title.length - 1) === "." ? ".." : "...";
    }
    
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "black";
    ctx.fillText(title, 3 + canvas.width/2 + 180, 3 + 55);
    ctx.globalAlpha = 1;
    ctx.fillStyle = color1;
    ctx.fillText(title, canvas.width/2 + 180, 55);
    
    ctx.textAlign = "left";
}

function drawEffectSection() {
    var x = 50;
    var y = 100;
    var w = canvas.width - x;
    var ty = 30;
    var dy;
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(70, 70, 70)";
    ctx.beginPath();
    ctx.moveTo(0, y - 5);
    ctx.lineTo(canvas.width, y - 5);
    ctx.stroke();
    //*/
    
    ctx.font = "13px" + font;
    ctx.fillStyle = color2;
    
    dy = 80;
    
    filterSlider.x = x;
    filterSlider.y = y + dy;
    pitchSlider.x = w - pitchSlider.width;
    pitchSlider.y = y + dy;
    
    drawSliderInfo(filterSlider, "Filter", filterSlider.value + "%");
    drawSliderInfo(pitchSlider, "Pitch", pitchSlider.value + "%");
    
    dy = 200;
    
    //reverbSlider.x = x;
    //reverbSlider.y = y + dy;
    distortionSlider.x = x;//w - pitchSlider.width;
    distortionSlider.y = y + dy;
    panSlider.x = w - pitchSlider.width;// / 2.5;
    panSlider.y = y + dy;
    
    //drawSliderInfo(reverbSlider, "Reverb", reverbSlider.value + "%");
    drawSliderInfo(distortionSlider, "Distortion", distortionSlider.value + "%");
    drawSliderInfo(panSlider, "Pan", Math.round((panSlider.value - 50) / 50 * 100) / 100);
    
    filterButton.x = filterSlider.x + 100;
    filterButton.y = filterSlider.y - 45;
    
    filterButton.draw(function (x, y, w, h) {
        ctx.fillStyle = color4;
        ctx.fillRect(x, y, w, h);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = color5;
        ctx.strokeRect(x, y, w, h);
        
        ctx.font = "bold 12px" + font;
        ctx.textAlign = "center";
        
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "black";
        ctx.fillText(filters[FILTER], x + w/2 + 2, y + 14 + 2);
        ctx.globalAlpha = 1;
        
        ctx.fillStyle = color2;
        ctx.fillText(filters[FILTER], x + w/2, y + 14);
        
        ctx.textAlign = "left";
    });
    
    /*
    reverbButton.x = reverbSlider.x + 125;
    reverbButton.y = reverbSlider.y - 45;
    
    reverbButton.draw(function (x, y, w, h) {
        ctx.fillStyle = color4;
        
        ctx.fillStyle = color4;
        ctx.fillRect(x, y, w, h);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = color5;
        ctx.strokeRect(x, y, w, h);
        
        ctx.font = "bold 12px" + font;
        ctx.textAlign = "center";
        
        var text = REVERB ? "on" : "off";
        
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "black";
        ctx.fillText(text, x + w/2 + 2, y + 14 + 2);
        ctx.globalAlpha = 1;
        
        ctx.fillStyle = color2;
        ctx.fillText(text, x + w/2, y + 14);
        
        ctx.textAlign = "left";
    });
    */
    
    filterSlider.draw();
    pitchSlider.draw();
    //reverbSlider.draw();
    distortionSlider.draw();
    panSlider.draw();
}

function drawControlSection() {
    var x = 50;
    var y = 340;
    var w = canvas.width - x;
    var ty = 30;
    var dy;
    
    /*
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(70, 70, 70)";
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
    //*/
    
    dy = 70;
    
    timeSlider.x = x;
    timeSlider.y = y + dy;
    
    volumeSlider.x = x + timeSlider.width - volumeSlider.width;
    volumeSlider.y = y + dy + 45;
    
    ctx.font = "bold 13px" + font;
    ctx.fillStyle = color2;
    
    drawSliderInfo(timeSlider, "Time", formatTime(currentTime) + " [" + formatTime(totalTime) + "]");
    timeSlider.draw();
    volumeSlider.draw();
    
    var dxx = x + 0;
    var dyy = y + dy + 30;
    
    playButton.x = dxx;
    playButton.y = dyy;
    stopButton.x = dxx + 60;
    stopButton.y = dyy;
    loopButton.x = dxx + 60 * 2;
    loopButton.y = dyy;
    
    loadButton.x = dxx + 60 * 3;
    loadButton.y = dyy;
    
    loadButton.draw(function (x, y, w, h) {
        ctx.fillStyle = color3;
        ctx.fillRect(x, y, w, h);
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = color5;
        ctx.strokeRect(x, y, w, h);
        
        ctx.font = "bold 14px" + font;
        ctx.textAlign = "center";
        
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "black";
        ctx.fillText("Load Audio", x + w/2 + 2, y + 20 + 2);
        ctx.globalAlpha = 1;
        
        ctx.fillStyle = color1;
        ctx.fillText("Load Audio", x + w/2, y + 20);
        
        ctx.textAlign = "left";
    });
    
    playButton.draw(function (x, y, w, h) {
        ctx.fillStyle = color3;
        ctx.fillRect(x, y, w, h);
        
        ctx.fillStyle = color2;
        
        if (PLAYING) {
            ctx.fillRect(x + 8, y + 7, 5, h - 7 * 2);
            ctx.fillRect(x + w - 13, y + 7, 5, h - 7 * 2);
        } else {
            var cx = x + w / 2;
            var cy = y + h / 2;
            var s = 9;
            
            ctx.beginPath();
            ctx.moveTo(cx - s + 2, cy - s);
            ctx.lineTo(cx - s + 2, cy + s);
            ctx.lineTo(cx + s, cy);
            ctx.closePath();
            ctx.fill();
        }
    });
    
    stopButton.draw(function (x, y, w, h) {
        ctx.fillStyle = color3;
        ctx.fillRect(x, y, w, h);
        
        ctx.fillStyle = color2;
        ctx.fillRect(x + 8, y + 8, w - 8 * 2, h - 8 * 2);
    });
    
    loopButton.draw(function (x, y, w, h) {
        ctx.fillStyle = color3;
        ctx.fillRect(x, y, w, h);
        
        y += 1;
        
        var cx = x + w / 2;
        var cy = y + h / 2;
        var r = 7;
        var s = 5;
        
        ctx.strokeStyle = color2;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 3 / 2);
        ctx.stroke();
        
        ctx.fillStyle = color2;
        ctx.beginPath();
        ctx.moveTo(x + w/2, y + 8 - s);
        ctx.lineTo(x + w/2, y + 8 + s);
        ctx.lineTo(x + w/2 + s * 1.2, y + 8);
        ctx.closePath();
        ctx.fill();
        
        if (!LOOPING) {
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + 6, y + h - 6);
            ctx.lineTo(x + w - 6, y + 6);
            ctx.stroke();
        }
    });
    
    var sx = volumeSlider.x - 45;
    var sy = volumeSlider.y;
    var s = 10;
    var t = 4;
    
    ctx.fillStyle = color3;
    ctx.beginPath();
    ctx.moveTo(sx - s/2, sy);
    ctx.lineTo(sx + s, sy - s);
    ctx.lineTo(sx + s, sy + s);
    ctx.fill();
    
    ctx.fillRect(sx - t, sy - t, 2 * t, 2 * t);
    ctx.strokeStyle = color3;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx + s + 4, sy - 2);
    ctx.lineTo(sx + s + 4, sy + 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(sx + s + 7, sy - 4);
    ctx.lineTo(sx + s + 7, sy + 4);
    ctx.stroke();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(sx + s + 11, sy - 7);
    ctx.lineTo(sx + s + 11, sy + 7);
    ctx.stroke();
    
    exportWavButton.x = 620;
    exportWavButton.y = y + 40;
    exportMp3Button.x = 620;
    exportMp3Button.y = y + 95;
    
    exportWavButton.draw(function (x, y, w, h) {
        ctx.fillStyle = color3;
        ctx.fillRect(x, y, w, h);
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = color5;
        ctx.strokeRect(x, y, w, h);
        
        ctx.font = "bold 14px" + font;
        ctx.textAlign = "center";
        
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "black";
        ctx.fillText("Export to WAV", x + w/2 + 2, y + 20 + 2);
        ctx.globalAlpha = 1;
        
        ctx.fillStyle = color1;
        ctx.fillText("Export to WAV", x + w/2, y + 20);
        
        ctx.textAlign = "left";
    });
    
    exportMp3Button.draw(function (x, y, w, h) {
        ctx.fillStyle = color3;
        ctx.fillRect(x, y, w, h);
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = color5;
        ctx.strokeRect(x, y, w, h);
        
        ctx.font = "bold 14px" + font;
        ctx.textAlign = "center";
        
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "black";
        ctx.fillText("Export to MP3", x + w/2 + 2, y + 20 + 2);
        ctx.globalAlpha = 1;
        
        ctx.fillStyle = color1;
        ctx.fillText("Export to MP3", x + w/2, y + 20);
        
        ctx.textAlign = "left";
    });
}

function drawInfoSection() {
    var x = 50;
    var y = 500;
    var w = canvas.width - x;
    var dy;
    
    /*
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(70, 70, 70)";
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
    //*/
    
    ctx.font = "22px" + font;
    
    ctx.textAlign = "center";
    
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.2;
    ctx.fillText(MESSAGE, 2 + canvas.width / 2, 2 + canvas.height - 30);
    ctx.globalAlpha = 1;
    
    ctx.fillStyle = color1;"rgb(200, 80, 160)";
    ctx.fillText(MESSAGE, canvas.width / 2, canvas.height - 30);
    ctx.textAlign = "left";
}
