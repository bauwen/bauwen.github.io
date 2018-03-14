function startRoomVideo() {
    let room = document.getElementById("room-video");
    let canvas = document.getElementById("canvas-video");
    //let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    
    let surface = document.createElement("canvas");
    let surfctx = surface.getContext("2d");
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight;
    //let bulgedCanvas = new BulgedCanvas(glcanvas, canvas);
    
    room.style.display = "block";
    
    let fading = !true;
    let fade = 252;
    
    let t = 0;
    
    let render = () => {
        if (room.style.display === "none") {
            return;
        }
        
        let w = vid_video.videoWidth;
        let h = vid_video.videoHeight;
        
        surface.width = Math.floor(w / 2);
        surface.height = Math.floor(h / 2);
        surfctx.drawImage(vid_video, 0, 0, w, h, 0, 0, surface.width, surface.height);
        
        let imageData = surfctx.getImageData(0, 0, surface.width, surface.height);
        let data = imageData.data;
        let len = surface.width * surface.height * 4;      
        for (let i = 0; i < len; i += 4) {
            let r = data[i + 0];
            let g = data[i + 1];
            let b = data[i + 2];
            let value = (r + g + b) / 3;
            data[i + 0] = 0;
            data[i + 1] = value;
            data[i + 2] = 0;
        }
        surfctx.putImageData(imageData, 0, 0);
        
        canvas.width = window.innerWidth;// w * 1.6;  // depends on video size
        canvas.height = window.innerHeight;//h * 1.6;
        ctx.drawImage(surface, 0, 0, surface.width, surface.height, 0, 0, canvas.width, canvas.height);
        
        if (fading) {
            if (fade > 0) {
                fade -= 6;
                document.body.style.backgroundColor = "rgb(0, " + fade + ", 0)";
            } else {
                fading = false;
            }
        }
        
        t = (t + 0.1) % 3;
        ctx.globalAlpha = 0.3;
        ctx.drawImage(img_scanlines, 0, t, img_scanlines.naturalWidth, img_scanlines.naturalHeight, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        
        //bulgedCanvas.update();
        window.requestAnimationFrame(render);
    };
    
    window.requestAnimationFrame(render);
    vid_video.play();
    
    vid_video.addEventListener("ended", function () {
        room.style.display = "none";
        setTimeout(start/*something*/, 2000);
    });
}
