function startRoomStartcode() {
    let room = document.getElementById("room-startcode");
    let input = document.getElementById("input-startcode");
    let canvas = document.getElementById("canvas-startcode");
    let ctx = canvas.getContext("2d");
    
    room.style.display = "block";
    ctx.textAlign = "center";
    
    let checking = false;
    let progress = 0;
    let blinkTimer = 0;
    let blinkPeriod = 60;
    
    let success = false;
    let displaying = false;
    let displayTimer = 0;
    let displayPeriod = 100;
    
    let render = () => {
        if (room.style.display === "none") {
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "lime";
        
        if (checking) {
            progress += 3;
            if (progress > 580) {
                validateCode();
            }
            
            blinkTimer = (blinkTimer + 1) % blinkPeriod;
            if (blinkTimer < blinkPeriod / 2) {
                ctx.font = "bold 32px monospace";
                ctx.fillText("Code controleren...", canvas.width / 2, 40);
            }
            
            ctx.fillRect(10, 70, progress, 24);
        }
        
        if (displaying) {
            displayTimer += success ? 0.7 : 1;
            if (displayTimer > displayPeriod) {
                if (success) {
                    room.style.display = "none";
                    setTimeout(startRoomVideo, 1000);
                } else {
                    input.style.backgroundColor = "rgba(0, 255, 0, 0.1)";
                    input.style.border = "2px solid lime";
                    input.removeAttribute("disabled");
                }
                displaying = false;
            }
            
            ctx.font = "bold 81px monospace";
            
            if (success) {
                ctx.fillText("CORRECT!", canvas.width / 2, 80);
            } else {
                ctx.fillStyle = "red";
                ctx.fillText("VERKEERD", canvas.width / 2, 80);
            }
        }
        
        window.requestAnimationFrame(render);
    };
    
    window.requestAnimationFrame(render);
    
    let checkCode = () => {
        input.setAttribute("disabled", "true");
        progress = 0;
        checking = true;
    };
    
    let validateCode = () => {
        checking = false;
        let code = input.value.trim();
        success = code === START_CODE;
        displaying = true;
        displayTimer = 0;
        
        if (success) {
            snd_unlock.play();
        } else {
            input.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
            input.style.border = "2px solid red";
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
    
    input.addEventListener("keydown", function (evt) {
        if (evt.keyCode == 13) {
            checkCode();
        }
    });
}
