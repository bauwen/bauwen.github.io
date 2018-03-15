function startRoomTroll() {
    let room = document.getElementById("room-troll");
    let canvas = document.getElementById("canvas-troll");
    let ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight;
    
    room.style.display = "block";
    
    let alpha = 0;
    let t = 0;
    let mirror = 1;
    let f = 1;
    let binCount = 0;
    let analyserData = null;
    let timer = 80;
    
    if (webapi) {
        analyser.fftSize = 2048;
        binCount = analyser.frequencyBinCount;
        analyserData = new Uint8Array(binCount);
    } else {
        source.loop = false;
    }
    
    let render = () => {
        if (room.style.display === "none") {
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        alpha = 0.8 + Math.random() * 0.2;
        ctx.globalAlpha = alpha;
        
        if (timer < 0) {
            if (webapi) {
                analyser.getByteFrequencyData(analyserData);
                let sum = 0;
                for (let i = 0; i < binCount; i += 1) {
                    sum += analyserData[i];
                }
                sum /= binCount;
                
                f = (sum < 0.01 ? 1 : 0.25) + sum / 80;
            } else {
                if (Math.random() < 0.07) {
                    f = 1.4;
                }
                if (f > 0.25) {
                    f -= 0.02;
                } else {
                    f = 1.4;
                }
            }
        }
        let width = img_trollface.naturalWidth * f;
        let height = img_trollface.naturalHeight * f;
        let imgx = canvas.width / 2 - width / 2 + (mirror < 0 ? width : 0);
        let imgy = canvas.height / 2 - height / 2;
        
        ctx.save();
        ctx.translate(imgx, imgy);
        ctx.scale(f * mirror, f);
        ctx.drawImage(img_trollface, 0, 0);
        ctx.restore();
        
        if (Math.random() < 0.01) {
            mirror = Math.random() < 0.5 ? 1 : -1;
        }
        
        if (timer > 0) {
            timer -= 1;
            if (timer <= 0) {
                if (webapi) {
                    source.start(ac.currentTime);
                } else {
                    source.play();
                }
                timer = -1;
            }
        }
        
        t = (t + 0.1) % 3;
        ctx.globalAlpha = 0.3;
        ctx.drawImage(img_scanlines, 0, t, img_scanlines.naturalWidth, img_scanlines.naturalHeight, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        
        window.requestAnimationFrame(render);
    };
    
    window.requestAnimationFrame(render);
    snd_music.pause();
}
