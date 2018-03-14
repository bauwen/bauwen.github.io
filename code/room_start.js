function startRoomStart() {
    let room = document.getElementById("room-start");
    let canvas = document.getElementById("canvas-start");
    let ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    document.body.style.cursor = "default";
    ctx.textAlign = "center";
    
    let started = false;
    let fade = 255;
    let t = 0;
    
    let render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (started) {
            fade -= 1;//0.5;
            let c = Math.max(0, fade);
            let r = 0;
            let g = c;
            let b = 0;
            ctx.fillStyle =  "rgb(" + r + ", " + g + ", " + b + ")";
        } else {
            ctx.fillStyle = "rgb(7, 7, 7)";
        }
            ctx.font = "bold 99px monospace";
            
            ctx.fillText("Klik", canvas.width / 2 + 100, canvas.height / 2 - 120);
            ctx.fillText("op", canvas.width / 2 - 400, canvas.height / 2);
            ctx.fillText("het", canvas.width / 2 + 400, canvas.height / 2 + 60);
            ctx.fillText("scherm.", canvas.width / 2 - 100, canvas.height / 2 + 240);
        //}
        
        t = (t + 0.1) % 2;
        ctx.globalAlpha = 0.3;
        ctx.drawImage(img_scanlines, 0, t, img_scanlines.naturalWidth, img_scanlines.naturalHeight, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        
        window.requestAnimationFrame(render);
    };
    
    window.requestAnimationFrame(render);

    window.addEventListener("mousedown", function (evt) {
        evt.preventDefault();
        
        if (room.style.display !== "none" && !started) {
            started = true;
            snd_music.play();
            document.body.style.cursor = "none";
            
            //document.getElementById("room-start-instructions").style.display = "none";
            //document.getElementById("room-start-title").style.display = "block";
            
            let skip = 5300;
            //skip = 0; fade = 0;  // uncomment if you want to skip to start room code directly
            
            setTimeout(() => {
                room.style.display = "none";
                startRoomStartcode();
            }, skip);
        }
    });
}
