var reachedMoney = false;
var reachedMoney2 = false;
var levelUpOnce = false;
var levelUpThrice = false;
var buyFourth = false;
var buyLast = false;

var achs = [
    {
        text: "Buy the 4th bar",
        done: function () { return buyFourth; },
    },
    {
        text: "Buy the 7th bar",
        done: function () { return buyLast; },
    },
    {
        text: "Prestige once",
        done: function () { return prestige >= 2; },
    },
    {
        text: "Prestige 3 times",
        done: function () { return prestige >= 8; },
    },
    /*
    {
        text: "Level up any bar",
        done: function () { return levelUpOnce; },
    },
    {
        text: "Level up every bar 3 times",
        //done: function () { return levelUpThrice; },
        done: function () {
            var yep = true;
            for (var i = 0; i < 7; i++) {
                if (bars[i].level !== 4) {
                    yep = false;
                    break;
                }
            }
            return yep;
        }
    },
    */
    {
        text: "Reach money amount of 1 million",
        done: function () { return reachedMoney2; },
    },
    {
        text: "Reach money amount of 10 billion",
        done: function () { return reachedMoney; },
    },
    {
        text: "Make fill speed of every bar at least 6 fps",
        done: function () {
            var yep = true;
            
            for (var i = 0; i < 7; i++) {
                var bar = bars[i];
                
                if (!bar.unlocked || bar.fillSpeed * prestige < 6) {
                    yep = false;
                    break;
                }
            }
            
            return yep;
        },
    },
    {
        text: "Buy everything in the shop",
        done: function () { return shoppedItem1 && shoppedItem2 && shoppedItem3; },
    },
];

function loopRoomAchs() {
    
    var x = 25;
    var y = 90;
    
    var count = 0;
    
    ctx.lineWidth = 2;
    setFont(16);
    ctx.textAlign = "center";
    for (var i = 0; i < achs.length; i++) {
        var ach = achs[i];
        var ax = x + 10 + (i % 2 === 0 ? 0 : 390);
        var ay = y + 20 + Math.floor(i / 2) * 80;
        
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = ach.done() ? "yellow" : "black";
        var ts = ach.done() ? 5 : 3;
        var fs = ach.done() ? 2*ts : 0;
        ctx.fillRect(ax - ts, ay - ts, 350 + fs, 46 + fs);
        ctx.globalAlpha = 1;
        
        ctx.fillStyle = ach.done() ? "rgb(220, 210, 60)" : "rgb(180, 180, 180)";
        ctx.fillRect(ax, ay, 350, 46);
        
        ctx.fillStyle = "black";
        ctx.fillText(ach.text, ax + 175, ay + 26 + 3);
        
        ctx.strokeStyle = darkMode ? "white" : "black";
        ctx.strokeRect(ax, ay, 350, 46);
        
        if (mouseInBox(ax, ay, 350, 46)) {
            if (i === 4) {
                infoText = "1 million is $1,000,000";
            }
            if (i === 5) {
                infoText = "10 billion is $10,000,000,000";
            }
        }
        
        if (ach.done()) {
            count += 1;
        }
    }
    
    //numberOfAchievements = count;
    setFont(18);
    ctx.fillStyle = darkMode ? "white" : "black";
    ctx.textAlign = "left";
    ctx.fillText("Achievements: " + count + " / 8", x + 10, y + 385);
    
    // menu buttons
    drawMenuButton(canvas.width - 180, y + 360, 150, "GO BACK", function () {
        if (mousePressed) {
            gotoRoom(ROOM_BARS);
        }
        infoText = "Return to the bars";
    });
}