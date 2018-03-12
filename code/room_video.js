function startRoomVideo() {
    let room = document.getElementById("room-video");
    let canvas = document.getElementById("canvas-video");
    let ctx = canvas.getContext("2d");
    
    let surface = document.createElement("canvas");
    let surfctx = surface.getContext("2d");
    
    room.style.display = "block";
    
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
        
        canvas.width = w * 1.2;  // depends on video size
        canvas.height = h * 1.2;
        ctx.drawImage(surface, 0, 0, surface.width, surface.height, 0, 0, canvas.width, canvas.height);
        
        window.requestAnimationFrame(render);
    };
    
    window.requestAnimationFrame(render);
    vid_video.play();
    
    vid_video.addEventListener("ended", function () {
        room.style.display = "none";
        //setTimeout(start/*something*/, 2000);
    });
}
