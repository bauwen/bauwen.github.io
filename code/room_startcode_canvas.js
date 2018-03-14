function startRoomStartcode() {
    let room = document.getElementById("room-startcode");
    //let input = document.getElementById("input-startcode");
    let canvas = document.getElementById("canvas-startcode");
    //let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight;
    //let bulgedCanvas = new BulgedCanvas(glcanvas, canvas);
    
    snd_music.loop = true;
    //snd_music.play();
    
    room.style.display = "block";
    ctx.textAlign = "center";
    
    let maxLength = 8;
    let input = "";
    let inputBlinker = " ";
    let inputBlinkTimer = 0;
    let inputBlinkPeriod = 60;
    
    let checking = false;
    let progress = 0;
    let blinkTimer = 0;
    let blinkPeriod = 60;
    
    let success = false;
    let displaying = false;
    let displayTimer = 0;
    let displayPeriod = 100;
    
    let spd = 4;
    let t = 0;
    
    let alpha = 0;
    let show = true;
    
    let render = () => {
        if (room.style.display === "none") {
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!show) {
            return;
        }
        
        alpha = 0.8 + Math.random() * 0.2;
        ctx.strokeStyle = "lime";
        ctx.fillStyle = "lime";
        
        ctx.globalAlpha = alpha;
        ctx.font = "bold 64px monospace";
        ctx.fillText("Vul code in:", canvas.width / 2, canvas.height / 2 - 150);
        
        let w = 700;
        let h = 150;
        
        if (displaying && !success) {
            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";
        }
        
        ctx.globalAlpha = 0.1;
        ctx.lineWidth = 3;
        ctx.fillRect(canvas.width / 2 - w / 2, canvas.height / 2 - h / 2, w, h);
        ctx.globalAlpha = alpha;
        ctx.strokeRect(canvas.width / 2 - w / 2, canvas.height / 2 - h / 2, w, h);
        
        inputBlinkTimer = (inputBlinkTimer + 1) % inputBlinkPeriod;
        if (inputBlinkTimer > inputBlinkPeriod / 2) {
            inputBlinker = "_";
        } else {
            inputBlinker = " ";
        }
        
        //ctx.fillStyle = "lime";
        ctx.font = "bold 99px monospace";
        ctx.fillText(input, canvas.width / 2, canvas.height / 2 - h / 2 + 105);
        let blinker = checking || displaying || input.length === maxLength ? "" : " ".repeat(input.length === 0 ? 0 : input.length + 1) + inputBlinker;
        ctx.fillText(blinker, canvas.width / 2, canvas.height / 2 - h / 2 + 90);
        
        if (checking) {
            progress += spd;
            if (progress > w) {
                validateCode();
            }
            
            ctx.fillStyle = "rgb(200, 170, 0)";
            blinkTimer = (blinkTimer + 1) % blinkPeriod;
            if (blinkTimer < blinkPeriod / 2) {
                ctx.font = "bold 32px monospace";
                ctx.fillText("Code controleren...", canvas.width / 2, canvas.height / 2 + 170);
            }
            
            ctx.fillRect(canvas.width / 2 - w / 2, canvas.height / 2 + 200, progress, 24);
        }
        
        if (displaying) {
            displayTimer += success ? 0.7 : 1;
            if (displayTimer > displayPeriod) {
                if (success) {
                    show = false;
                    setTimeout(() => {
                        room.style.display = "none";
                        startRoomVideo();
                    }, 2000);
                    //document.body.style.backgroundColor = "rgb(0, 252, 0)";
                } else {
                    //input.style.backgroundColor = "rgba(0, 255, 0, 0.1)";
                    //input.style.border = "2px solid lime";
                    //input.removeAttribute("disabled");
                }
                displaying = false;
            }
            
            ctx.font = "bold 81px monospace";
            
            if (success) {
                ctx.fillText("CORRECT", canvas.width / 2, canvas.height / 2 + 220);
            } else {
                ctx.fillStyle = "red";
                ctx.fillText("INCORRECT", canvas.width / 2, canvas.height / 2 + 220);
            }
        }
        
        t = (t + 0.1) % 2;
        ctx.globalAlpha = 0.3;
        ctx.drawImage(img_scanlines, 0, t, img_scanlines.naturalWidth, img_scanlines.naturalHeight, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        
        //bulgedCanvas.update();
        window.requestAnimationFrame(render);
    };
    
    window.requestAnimationFrame(render);
    
    let checkCode = () => {
        //input.setAttribute("disabled", "true");
        progress = 0;
        checking = true;
        
        if (input === START_CODE) {
            spd = 3;
        }
    };
    
    let validateCode = () => {
        checking = false;
        //let code = input;//input.value.trim();
        success = input === START_CODE;
        displaying = true;
        displayTimer = 0;
        
        if (success) {
            snd_music.pause();
            snd_unlock.play();
        } else {
            //input.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
            //input.style.border = "2px solid red";
            snd_error.play();
            setTimeout(() => { snd_error2.play(); }, 150);
        }
        
        try {
            server.broadcast("startcode", {
                success: success,
                code: code
            });
        } catch (err) {}
    };
    
    window.addEventListener("keydown", function (evt) {
        evt.preventDefault();
        
        if (room.style.display === "none") {
            return;
        }
        
        // a-z, 0-9
        if (48 <= evt.keyCode && evt.keyCode <= 57 || 65 <= evt.keyCode && evt.keyCode <= 90) {
            if (!checking && !displaying && input.length < maxLength) {
                input += String.fromCharCode(evt.keyCode);
            }
        }
        
        // backspace
        if (evt.keyCode === 8) {
            if (!checking && !displaying && input.length > 0) {
                input = input.slice(0, input.length - 1);
            }
        }
        
        // enter
        if (evt.keyCode === 13) {
            if (!checking && !displaying) {
                checkCode();
            }
        }
    });
    
}
