var canvas = document.getElementById("display");
var ctx = canvas.getContext("2d");

canvas.setAttribute("tabindex", 1);
canvas.style.outline = "none";
canvas.addEventListener("click", function () {
    self.canvas.focus();
});
canvas.focus();

var backgroundColor = "rgb(40, 40, 40)";

canvas.style.backgroundColor = backgroundColor;
canvas.width = 810;
canvas.height = 540;

var initialize;

//var money; // TODO
(function () {
    
    var money = 0;
    var buyMax = false;
    
    var musicClicked = false;
    var musicPlaying = true;
    var musicLoaded = false;
    var music = new Audio();
    music.src = "src/music.mp3";
    music.oncanplaythrough = function () {
        if (music.paused || music.currentTime === 0) {
            musicLoaded = true;
            music.loop = true;
            //music.play();
            
            if (musicPlaying) {
                music.volume = 1;
            } else {
                music.volume = 0;
            }
        }
    };
    
    window.addEventListener("mousedown", function (event) {
        if (!musicClicked) {
            musicClicked = true;
            music.play();
        }
    });
    
    window.addEventListener("keydown", function (event) {
        var key = event.which || event.keyCode;
        if (key + "" == "77") { /* m */
            toggleMusic();
        }
    });

    var infoText = "";

    var Bar = function (color) {
        this.color = color;
        this.value = 0;
        this.alpha = 0;
        this.unlocked = false;
        this.price = 0;
              
        this.fillSpeed = 0.3;
        this.fillSpeedPrice = 5;
        this.fillSpeedNext = 0.3;
        this.fillSpeedUpdate = 0;
        this.fillSpeedFormula = null;
        this.fillSpeedPriceFormula = null;
        
        this.fillValue = 1;
        this.fillValuePrice = 20;
        this.fillValueNext = 1;
        this.fillValueUpdate = 0;
        this.fillValueFormula = null;
        this.fillValuePriceFormula = null;
    };
    
    var bars;

    var setup = function () {       
        bars = [
            new Bar("red"),
            new Bar("orange"),
            //new Bar("yellow"),
            new Bar("lime"),
            new Bar("cyan"),
            //new Bar("purple"),
            //new Bar("fuchsia"),
            new Bar("salmon"),
            new Bar("yellow"),
            //new Bar("gray"),
            new Bar("white")
        ];

        bars[0].price = 0;
        bars[0].fillSpeedNext = 0.3;
        bars[0].fillSpeedFormula      = function (t) { return 0.3 + (0.05+0.04*0) * t;  };
        bars[0].fillSpeedPriceFormula = function (t) { return 1 * Math.pow(1.3, t);  };
        bars[0].fillValueNext = 1;
        bars[0].fillValueFormula      = function (t) { return 1 + 1 * t;  };
        bars[0].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.1, t);  };

        bars[1].price = 500;//100;
        bars[1].fillSpeedNext = 0.2;
        bars[1].fillSpeedFormula      = function (t) { return 0.2 + (0.05+0.03*0) * t;  };
        bars[1].fillSpeedPriceFormula = function (t) { return 2 * Math.pow(1.4, t); };
        bars[1].fillValueNext = 30;
        bars[1].fillValueFormula      = function (t) { return 30 + 10 * t; };
        bars[1].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.3, t); };

        bars[2].price = 20000;//5000;
        bars[2].fillSpeedNext = 0.2;
        bars[2].fillSpeedFormula      = function (t) { return 0.2 + (0.045+0.03*0) * t;  };
        bars[2].fillSpeedPriceFormula = function (t) { return 2 * Math.pow(1.5, t); };
        bars[2].fillValueNext = 300;
        bars[2].fillValueFormula      = function (t) { return 300 + 25 * t; };
        bars[2].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.4, t); };

        bars[3].price = 100000//200000;//30000;
        bars[3].fillSpeedNext = 0.2;
        bars[3].fillSpeedFormula      = function (t) { return 0.2 + (0.045+0.02*0) * t;  };
        bars[3].fillSpeedPriceFormula = function (t) { return 2 * Math.pow(1.6, t); };
        bars[3].fillValueNext = 1000;
        bars[3].fillValueFormula      = function (t) { return 1000 + 50 * t; };
        bars[3].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.5, t); };

        bars[4].price = 400000;//1000000;//200000;
        bars[4].fillSpeedNext = 0.2;
        bars[4].fillSpeedFormula      = function (t) { return 0.2 + (0.04+0.02*0) * t;  };
        bars[4].fillSpeedPriceFormula = function (t) { return 2 * Math.pow(1.7, t); };
        bars[4].fillValueNext = 5000;
        bars[4].fillValueFormula      = function (t) { return 5000 + 100 * t; };
        bars[4].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.3, t); };

        bars[5].price = 10000000;//1000000;
        bars[5].fillSpeedNext = 0.2;
        bars[5].fillSpeedFormula      = function (t) { return 0.2 + (0.03+0.01*0) * t;  };
        bars[5].fillSpeedPriceFormula = function (t) { return 2 * Math.pow(1.8, t); };
        bars[5].fillValueNext = 20000;
        bars[5].fillValueFormula      = function (t) { return 20000 + 500 * t; };
        bars[5].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.1, t); };

        bars[6].price = 1000000000;//100000000;
        bars[6].fillSpeedNext = 0.2;
        bars[6].fillSpeedFormula      = function (t) { return 0.2 + (0.025+0.01*0) * t;  };
        bars[6].fillSpeedPriceFormula = function (t) { return 2 * Math.pow(1.9, t); };
        bars[6].fillValueNext = 300000//100000;
        bars[6].fillValueFormula      = function (t) { return 300000 + 999 * t; };
        bars[6].fillValuePriceFormula = function (t) { return 1 * Math.pow(1.2, t); };
        
        for (var i = 0; i < bars.length; i++) {
            buyFillSpeedUpdate(bars[i]);
            buyFillValueUpdate(bars[i]);
        }

        money = 0;
    }

    setup();

    var prestige = 1;
    var prestigeFormula = function () {
        return 1000000 * Math.pow(10, Math.log(prestige) / Math.log(2)) * 2;
    };

    var width = 490;
    var height = 250;
    var barWidth = width / bars.length;
    var barPadding = 0;

    var arrowTimer = 0;
    var kongApi = null;
    var fillsPerSecond = 0;

    initialize = function () {
        loadKongregateApi(function (api) {
            kongApi = api;
            
            setInterval(function () {
                //kongApi.submitStat("Points", Math.floor(money));
                kongApi.submitStat("Progress", Math.floor(fillsPerSecond));
                saveGameState();
            }, 5000);
            
            loadGameState();
            gameloop();
        });
    }
    
    var previousTime = 0;

    function gameloop() {
        var deltaTime = performance.now() - previousTime;
        //console.log(deltaTime);
        //if (deltaTime > 20) console.log("many seconds passed:", deltaTime / 1000);
        var wentAway = deltaTime > 30;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        infoText = "";
        
        var full = 0;
        let ox = canvas.width/2 - width/2 - 100;
        let oy = 110;
        
        if (!bars[0].unlocked) {
            infoText = "Follow the white arrow!";
            
            arrowTimer -= 1;
            if (arrowTimer < 0) {
                arrowTimer = 40;
            }
            var dx = arrowTimer - 20//-1 * (arrowTimer < 25 ? 1 : 0) * 30 + 10;
            
            if (prestige <= 1) {
                ctx.fillStyle = "rgb(200, 200, 200)";
                ctx.fillRect(ox + barWidth*2 + dx, oy + height + 65, barWidth - 20, 20);
                ctx.beginPath();
                ctx.moveTo(ox + barWidth*1.5 + dx, oy + height + 75);
                ctx.lineTo(ox + barWidth*2 + dx, oy + height + 75 - 20);
                ctx.lineTo(ox + barWidth*2 + dx, oy + height + 75 + 20);
                ctx.closePath();
                ctx.fill();
            } else {
                infoText = "Welcome back! Fill speed is now x" + prestige + ".";
            }
        }
        
        var fpsize = 54;
        var fmoney = formatMoney(money);
        if (fmoney.length > 12) {
            fpsize = 36;
        }
        ctx.font = fpsize + "px gamefont, sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.fillText(fmoney, ox + 20, 72);
        
        /*
        if (bars[0].unlocked) bars[0].value += 20 * clicks;
        if (bars[1].unlocked) bars[1].value += 12 * clicks;
        if (bars[2].unlocked) bars[2].value += 7 * clicks;
        if (bars[3].unlocked) bars[3].value += 15 * clicks;
        if (bars[4].unlocked) bars[4].value += 11 * clicks;
        if (bars[5].unlocked) bars[5].value += 4 * clicks;
        if (bars[6].unlocked) bars[6].value += 9 * clicks;
        */
        
        ctx.fillStyle = "rgb(30, 30, 30)";
        //ctx.fillRect(ox, oy, width, height);
        
        ctx.font = "18px sans-serif";
        ctx.textAlign = "center";
        
        ctx.strokeStyle = "rgb(60, 60, 60)";
        for (var i = 1; i < bars.length; i++) {
            drawLine(ox + i * barWidth, oy + height, ox + i * barWidth, oy + height - 3);
        }
        
        fillsPerSecond = 0;
        for (var i = 0; i < bars.length; i++) {
            var bar = bars[i];
            if (!bar.unlocked) {
                continue;
            }
            fillsPerSecond += bar.fillSpeed * bar.fillValue * prestige;
        }
        
        ctx.font = "18px gamefont, sans-serif";
        ctx.textAlign = "right";
        ctx.fillStyle = "rgb(120, 120, 120)";
        ctx.fillText("+" + formatMoney(Math.ceil(fillsPerSecond * 1) / 1) + "/sec", ox + width - 15, 90);
        
        if (bars[4].unlocked) {
            ctx.strokeStyle = "rgb(120, 90, 70)";//"rgb(140, 140, 140)";
            ctx.fillStyle = ctx.strokeStyle;
            if (mouseInBox(ox + width - 15 - 100, 30, 100, 30)) {
                var prestigePrice = prestigeFormula();

                if (prestigePrice <= money) {
                    ctx.strokeStyle = "rgb(180, 140, 120)";
                    ctx.fillStyle = ctx.strokeStyle;
                }
                
                ctx.globalAlpha = 0.2;
                ctx.fillRect(ox + width - 15 - 100, 30, 100, 30);
                ctx.globalAlpha = 1;
                
                if (mousePressed && prestigePrice <= money) {
                    // prestige!
                    prestige *= 2;
                    // TODO(?): money should stay after prestige'ing!
                    //money -= prestigePrice;
                    setup();
                }
                
                infoText = "Restart the game and double the fill speed: costs " + formatMoney(prestigePrice);
            }
            ctx.font = "18px gamefont, sans-serif";
            ctx.lineWidth = 4;
            ctx.strokeRect(ox + width - 15 - 100, 30, 100, 30);
            ctx.textAlign = "center";
            ctx.fillText("Prestige", ox + width - 15 - 50, 51);
        }
        
        
        for (var i = 0; i < bars.length; i++) {
            var bar = bars[i];
            
            if (bar.unlocked) {
                if (wentAway) {
                    bar.value += height * bar.fillSpeed * prestige * deltaTime / 1000;// (1000 / deltaTime);
                } else {
                    bar.value += height * bar.fillSpeed * prestige / 60;
                }
            }
            
            if (bar.value > height) {
                var fills = Math.floor(bar.value / height);
                money += fills * bar.fillValue;
                
                bar.value %= height;
                bar.alpha = 1;
            }
            
            if (bar.alpha > 0) {
                bar.alpha -= 0.06;
            }
            
            // buttons
            
            var bx = ox + i * barWidth;
            var by = oy + height;
            
            if (bar.unlocked) {
                var cx = bx + barWidth/2;
                var cy = by + 70 + 5;
                var cr = 25;
                
                ctx.fillStyle = bar.color;
                ctx.globalAlpha = 0.2;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, cr, -Math.PI/2, -Math.PI/2 + 2*Math.PI*Math.min(money / bar.fillValuePrice, 1));
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = 1;
                
                ctx.lineWidth = 4;
                ctx.strokeStyle = bar.color;
                ctx.beginPath();
                ctx.arc(cx, cy, cr, 0, 2*Math.PI);
                ctx.stroke();
                
                ctx.font = "14px gamefont, sans-serif";
                ctx.textAlign = "center";
                ctx.fillStyle = "rgb(180, 170, 70)";
                ctx.fillText(bar.fillValue, cx, cy - 45);
                
                var count = 1;
                var price = bar.fillValuePrice;
                var value = bar.fillValueNext;
                if (buyMax) {
                    var nextPrice = price + Math.floor(bar.fillValuePriceFormula(bar.fillValueUpdate + count));
                    while (nextPrice <= money) {
                        price = nextPrice;
                        value = Math.floor(bar.fillValueFormula(bar.fillValueUpdate + count));
                        count += 1;
                        nextPrice = price + Math.floor(bar.fillValuePriceFormula(bar.fillValueUpdate + count));
                        //price += Math.floor(bar.fillValuePriceFormula(bar.fillValueUpdate + count));
                    }                    
                }
                var text = "+" + (value - bar.fillValue);
                
                if (bar.fillValuePrice <= money) {
                    var fpsize = 16;
                    if (text.length > 5) {
                        fpsize = 11;
                    } else if (text.length > 4) {
                        fpsize = 13;
                    }
                    ctx.font = fpsize + "px gamefont, sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "rgb(160, 160, 160)";
                    ctx.fillText(text, cx, cy + 5);
                    
                    if (mouseInBox(cx - cr, cy - cr, 2*cr, 2*cr)) {
                        ctx.globalAlpha = 0.2;
                        ctx.fillStyle = "white";
                        ctx.beginPath();
                        ctx.arc(cx, cy, cr + 1, 0, 2*Math.PI);
                        ctx.fill();
                        ctx.globalAlpha = 1;
                        
                        if (mousePressed) {
                            for (var ti = 0; ti < count; ti++) {
                                buyFillValueUpdate(bar);
                            }
                        }
                        
                        //infoText = "Increase money per fill: " + bar.fillValue + " (+ " + (bar.fillValueNext - bar.fillValue) + ")";
                        infoText = "Increase points per fill: costs " + formatMoney(price);
                    }
                } else {
                    if (mouseInBox(cx - cr, cy - cr, 2*cr, 2*cr)) {
                        //infoText = "Money per fill: " + bar.fillValue + " ".repeat(20) + "Increase +" + (bar.fillValueNext - bar.fillValue) + ", costs " + bar.fillValuePrice;
                        //infoText = "Increase points per fill: +" + (bar.fillValueNext - bar.fillValue) + ", costs " + bar.fillValuePrice;
                        infoText = "Increase points per fill: costs " + formatMoney(price);
                    }
                }
            } else {
                var cx = bx + barWidth/2;
                var cy = by + 70 + 5;
                var cr = 22;
                
                if (i === 0 || bars[i - 1].unlocked) {
                    if (money < bar.price) {
                        ctx.strokeStyle = "rgb(80, 80, 80)";
                        
                        if (mouseInBox(cx - cr, cy - cr, 2*cr, 2*cr)) {
                            infoText = "Add new bar: costs " + formatMoney(bar.price);
                        }
                    } else {
                        ctx.strokeStyle = "rgb(80, 130, 100)";

                        if (mouseInBox(cx - cr, cy - cr, 2*cr, 2*cr)) {
                            ctx.strokeStyle = "rgb(60, 160, 100)";
                            
                            if (mousePressed) {
                                if (i === bars.length - 1) {
                                    //kongApi.submitStat("Last", "1");
                                }
                                //kongApi.submitStat("Bars", i + 1);
                                bar.unlocked = true;
                                money -= bar.price;
                            }
                            
                            infoText = "Add new bar: costs " + formatMoney(bar.price);
                        }
                    }
                    
                    ctx.fillStyle = ctx.strokeStyle;
                    ctx.globalAlpha = 0.1;
                    ctx.fillRect(cx - cr, cy - cr, 2*cr, 2*cr);
                    ctx.globalAlpha = 1;

                    ctx.lineWidth = 4;
                    ctx.strokeRect(cx - cr, cy - cr, 2*cr, 2*cr);
                    
                    var cl = 10;
                    ctx.lineWidth = 8;
                    drawLine(cx - cl, cy, cx + cl, cy);
                    drawLine(cx, cy - cl, cx, cy + cl);
                    
                    ctx.globalAlpha = 1;
                }
                continue;
            }
            
            
            // render
            
            var h = bar.value;
            
            if (bar.fillSpeed * prestige >= 6) {
                full += 1;
                h = height;
            }
            
            ctx.fillStyle = bar.color;
            ctx.globalAlpha = Math.max(0, bar.alpha);
            ctx.fillRect(ox + i * barWidth + barPadding, oy, barWidth - 2*barPadding, height);
            ctx.globalAlpha = 1;
            ctx.fillRect(ox + i * barWidth + barPadding, oy + height - h, barWidth - 2*barPadding, h);  
            
            
            // sidebar
            
            var sw = 200;
            var sh = 60;
            var sp = 2;
            var sx = canvas.width - sw;
            var sy = 40 + 60*i - 20;
            var ol = false;
            
            var count = 1;
            var price = bar.fillSpeedPrice;
            var value = bar.fillSpeedNext;
            if (buyMax) {
                var nextPrice = price + Math.floor(bar.fillSpeedPriceFormula(bar.fillSpeedUpdate + count));
                while (nextPrice <= money) {
                    price = nextPrice;
                    value = Math.floor(bar.fillSpeedFormula(bar.fillSpeedUpdate + count) * 100) / 100;
                    count += 1;
                    nextPrice = price + Math.floor(bar.fillSpeedPriceFormula(bar.fillSpeedUpdate + count));
                }
            }
            
            ctx.globalAlpha = 0.8;
            if (mouseInBox(sx, sy + sp, sw, sh - 2*sp)) {
                ctx.globalAlpha = 0.9;
                
                if (mouseReleased && bar.fillSpeedPrice <= money) {
                    for (var si = 0; si < count; si++) {
                        buyFillSpeedUpdate(bar);
                    }
                }
                
                ol = mouseDown;
                infoText = "Increase fill speed: costs " + formatMoney(bar.fillSpeedPrice);
            }
            
            var relief = true;
            
            //ctx.fillStyle = "rgb(20, 20, 20)";
            //ctx.fillRect(sx - 2, sy + sp + 2, sw, sh - 2*sp);
            
            ctx.fillStyle = bar.color;
            
            /*
            if (bar.fillSpeedPrice > money) {
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = "gray";
                //ctx.fillRect(sx, sy + sp, sw, sh - 2*sp);
                ctx.fillStyle = "rgb(140, 140, 140)";
                ol = false;
            }
            */
            
            //ctx.globalAlpha = 1;
            if (bar.fillSpeedPrice > money) {
                ctx.globalAlpha = 1;
                ctx.fillStyle = "rgb(140, 140, 140)";
                ctx.fillRect(sx, sy + sp, sw, sh - 2*sp);
                ctx.globalAlpha = 0;
            }    
            
            ctx.fillStyle = bar.color;
            ctx.fillRect(sx, sy + sp, sw, sh - 2*sp);
            ctx.globalAlpha = 1;
            
            relief = !false;
            ol = false;
            if (relief) {
                if (ol) {
                    ctx.lineWidth = 2;
                    ctx.globalAlpha = 0.3;
                    ctx.strokeStyle = "white";
                    drawLine(sx, sy + sh - 1 - sp, sx + sw, sy + sh - 1 - sp);
                    //drawLine(sx, sy + sp, sx, sy + sh - sp);
                    ctx.globalAlpha = 1;
                } else {
                    ctx.lineWidth = 2;
                    ctx.globalAlpha = 0.1;
                    ctx.strokeStyle = "white";
                    drawLine(sx, sy + sp, sx + sw, sy + sp);
                    drawLine(sx, sy + sp, sx, sy + sh - sp);
                    ctx.globalAlpha = 1;
                }
            }
            //*/
            ctx.fillStyle = backgroundColor;//"rgb(200, 200, 200)";
            ctx.textAlign = "left";
            ctx.font = "13px gamefont, sans-serif";
            //var v = Math.round((bar.fillSpeedNext - bar.fillSpeed) * 100) / 100;
            var v = Math.round((value - bar.fillSpeed) * 100) / 100;
            ctx.fillText((bar.fillSpeed * prestige) + " fills/sec (+" + (v * prestige) + ")", sx + 10, sy + 23);
            ctx.textAlign = "right";
            ctx.font = "18px gamefont, sans-serif";
            ctx.fillText(formatMoney(price), sx + +sw - 10, sy + 48);
        }
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(60, 60, 60)";
        ctx.strokeRect(ox, oy, width, height);
        
        for (var i = 0; i < bars.length; i++) {
            var bar = bars[i];
            ctx.fillStyle = bar.color;
            ctx.globalAlpha = Math.sqrt(Math.max(0, bar.alpha));
            ctx.fillRect(ox + i * barWidth + barPadding, oy - 2, barWidth - 2*barPadding, 4);
        } 
        ctx.globalAlpha = 1;
        
        if (full === bars.length) {
            ctx.fillStyle = backgroundColor;
            ctx.strokeStyle = backgroundColor;
            
            ctx.beginPath();
            ctx.arc(ox + width/2 - 100, oy + 70, 30, 0, 2*Math.PI);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(ox + width/2 + 100, oy + 70, 30, 0, 2*Math.PI);
            ctx.fill();
            
            if (prestige > 16) {
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.arc(ox + width/2, oy + height/2 + 40, 40, 0, 2*Math.PI);
                ctx.stroke();
            } else {
                var sm = 0.12;
                
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.arc(ox + width/2, oy - 90, 300, 2*Math.PI*(0.25 - sm), 2*Math.PI*(0.25 + sm));
                ctx.stroke();
                
                if (prestige > 8) {
                    ctx.beginPath();
                    ctx.moveTo(ox + width/2 - 205, oy + height/2 + 5);
                    ctx.lineTo(ox + width/2 + 205, oy + height/2 + 5);
                    ctx.stroke();
                }
            }
        }
        
        
        // options
        
        var mmx = canvas.width - 50;
        var mmy = canvas.height - 43 - 43 + 1;
        
        if (musicPlaying) {
            ctx.fillStyle = "rgb(120, 120, 120)";
        } else {
            ctx.fillStyle = "rgb(60, 60, 60)";
        }
        if (mouseInBox(mmx, mmy, 32, 32)) {
            ctx.fillStyle = "rgb(200, 200, 200)";
                        
            if (mousePressed) {
                toggleMusic();
            }
            
            infoText = "Toggle the music";
        }
        
        ctx.strokeStyle = ctx.fillStyle;
        drawMusicIcon(mmx, mmy);
        
        
        ctx.font = "16px gamefont, sans-serif";
        ctx.textAlign = "center"; 
        
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgb(60, 60, 60)";
        if (buyMax) {
            ctx.fillStyle = "rgb(120, 120, 120)";
            //ctx.lineWidth = 4;
        }
        if (mouseInBox(mmx - 70, mmy + 4, 50, 25)) {
            ctx.fillStyle = "rgb(200, 200, 200)";
            if (mousePressed) {
                buyMax = true;
            }
            infoText = "Buy the maximum amount";
        }
        ctx.strokeStyle = ctx.fillStyle;                
        ctx.strokeRect(mmx - 70, mmy + 4, 50, 25);
        ctx.fillText("MAX", mmx - 70 + 25, mmy + 22);
        
        //ctx.lineWidth = 4;
        ctx.fillStyle = "rgb(60, 60, 60)";
        if (!buyMax) {
            ctx.fillStyle = "rgb(120, 120, 120)";
            //ctx.lineWidth = 4;
        }
        if (mouseInBox(mmx - 140, mmy + 4, 50, 25)) {
            ctx.fillStyle = "rgb(200, 200, 200)";
            if (mousePressed) {
                buyMax = false;
            }
            infoText = "Buy only 1";
        } 
        ctx.strokeStyle = ctx.fillStyle;
        ctx.strokeRect(mmx - 140, mmy + 4, 50, 25);
        ctx.fillText("ONE", mmx - 140 + 25, mmy + 22);
        
        
        
        
        // footer
        
        if (infoText === "") {
            ctx.globalAlpha = 0.5;
        }
        
        var fth = 50 - 10 + 2;
        ctx.fillStyle = "rgb(20, 20, 20)";
        ctx.fillRect(0, canvas.height - fth, canvas.width + 1, fth + 1);
        
        // if there's text, the bar get slightly darker (not transparent, otherwise transparent)
        ctx.font = "18px gamefont, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgb(160, 160, 160)";
        ctx.fillText(infoText, canvas.width/2, canvas.height - 19 + 4);
        
        ctx.globalAlpha = 1;
        
        if (wentAway) {
            saveGameState();
        }
        
        window.requestAnimationFrame(gameloop);
        previousTime = performance.now();
        //window.setTimeout(gameloop, 1000/60);
        mousePressed = false;
        mouseReleased = false;
    }
    
    function toggleMusic() {
        if (!musicLoaded) {
            return;
        }
        
        if (musicPlaying) {
            music.volume = 0;
        } else {
            music.volume = 1;
        }
        musicPlaying = !musicPlaying;
    }
    
    function drawMusicIcon(x, y) {
        var size = 32;
        var cx = x + size / 2 + 4;
        var cy = y + size / 2;
        
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy - 10 + 2 + 2 + 1);
        ctx.lineTo(cx - 8 + 12 - 1, cy - 10 + 2 + 1);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy - 10 + 1 + 2 + 1);
        ctx.lineTo(cx - 8, cy - 10 + 14 + 1 + 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(cx - 8 + 12 - 1, cy - 10 + 1 + 1);
        ctx.lineTo(cx - 8 + 12 - 1, cy - 10 + 14 + 1 + 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(cx - 11 + 1, cy + 6 - 1, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(cx - 11 + 12 + 1 - 1, cy + 6 - 1, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx - 3, cy + 1 - 1, size / 2 - 4 + 2 + 2, 0, 2 * Math.PI);
        ctx.stroke();
        
        if (!musicPlaying) {
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(cx - 13, cy + 13);
            ctx.lineTo(cx + 10, cy - 10);
            ctx.stroke();
        }
    }

    function formatMoney(value) {
        var val = "" + value;
        var str = "";
        var k = 0;
        
        for (var i = val.length - 1; i >= 0; i--) {
            var c = val.charAt(i);
            str = c + str;
            k += 1;
            if (k === 3 && i > 0) {
                str = "," + str;
                k = 0;
            }
        }
        
        return str;
    }

    function buyFillSpeedUpdate(bar) {
        money -= bar.fillSpeedPrice;
        var tmp = bar.fillSpeedNext;
        
        bar.fillSpeedUpdate += 1;
        bar.fillSpeedNext = bar.fillSpeedFormula(bar.fillSpeedUpdate);
        bar.fillSpeedPrice = bar.fillSpeedPriceFormula(bar.fillSpeedUpdate);
        
        bar.fillSpeedPrice = Math.floor(bar.fillSpeedPrice);
        bar.fillSpeedNext = Math.floor(bar.fillSpeedNext * 100) / 100;
        bar.fillSpeed = tmp;
    }

    function buyFillValueUpdate(bar) {
        money -= bar.fillValuePrice;
        var tmp = bar.fillValueNext;
        
        bar.fillValueUpdate += 1;
        bar.fillValueNext = bar.fillValueFormula(bar.fillValueUpdate);
        bar.fillValuePrice = bar.fillValuePriceFormula(bar.fillValueUpdate);
        
        bar.fillValuePrice = Math.floor(bar.fillValuePrice);
        bar.fillValueNext = Math.floor(bar.fillValueNext)// * 100) / 100;
        bar.fillValue = tmp;
    }

    function drawLine(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function mouseInBox(x, y, width, height) {
        return x <= mouseX && mouseX < x + width && y <= mouseY && mouseY < y + height;
    }

    function saveGameState() {
        if (!hasLocalStorage) {
            return;
        }
        
        var data = {
            money: money,
            prestige: prestige,
            bars: bars,
            music: musicPlaying
        };
        
        var text = JSON.stringify(data);
        localStorage.setItem("idlebars_save", text);
    }

    function loadGameState() {
        if (!hasLocalStorage) {
            return;
        }
        
        var text = localStorage.getItem("idlebars_save");
        if (!text) {
            return;
        }
        
        try {
            var data = JSON.parse(text);
            money = data.money;
            prestige = data.prestige;
            dbars = data.bars;
            
            for (var i = 0; i < bars.length; i++) {
                dbars[i].fillSpeedFormula = bars[i].fillSpeedFormula;
                dbars[i].fillSpeedPriceFormula = bars[i].fillSpeedPriceFormula;
                dbars[i].fillValueFormula = bars[i].fillValueFormula;
                dbars[i].fillValuePriceFormula = bars[i].fillValuePriceFormula;
            }
            
            bars = dbars;
            
            musicPlaying = data.music;
            if (musicLoaded) {
                if (musicPlaying) {
                    music.volume = 1;
                } else {
                    music.volume = 0;
                }
            }
        } catch (err) {
            // unable to load data
        }
    }
    
})();
