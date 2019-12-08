var ppfTweens = [];
var fpsTweens = [];
for (var i = 0; i < 7; i++) {
    ppfTweens.push(new Tween(0.8, 10));
    fpsTweens.push(new Tween(0.8, 10));
}

var arrowTimer = 0;

function loopRoomBars() {
    
    var x = 25;
    var y = 90;
    
    ctx.fillStyle = darkMode ? "white" : "black";
    ctx.globalAlpha = darkMode ? 0.07 : 0.01;
    for (var i = 1; i < 7; i += 2) {
        var lx = x + i * 75;
        var ly = y;
        
        ctx.fillRect(lx, ly, 75, 200);
    }
    ctx.globalAlpha = 1;
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = darkMode ? "rgb(60, 60, 60)" : "rgb(230, 230, 230)";
    for (var i = 1; i < 7; i++) {
        var lx = x + i * 75;
        var ly = y + 200;
        
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx, ly - 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lx, y);
        ctx.lineTo(lx, y + 5);
        ctx.stroke();
    }
    
    // bars shadow
    if (!defaultSkin) {
        for (var i = 0; i < 7; i++) {
            var bar = bars[i];
            if (!bar.unlocked) continue;
            
            var h = bar.value;
            ctx.fillStyle = darkMode ? "white" : "black";
            ctx.globalAlpha = darkMode ? 0.3 : 0.2;
            
            if (bar.fillSpeed * prestige >= 6) {
                ctx.fillRect(x + i * 75 + 7, y, 75, 200);
            } else {
                if (bar.level === 2) {
                    ctx.fillRect(x + i * 75 + 7, y, 75, h - 3);
                } else if (bar.level === 3) {
                    ctx.fillRect(x + i * 75 + 7, y, 75, h / 2 - 3);
                    ctx.fillRect(x + i * 75 + 7, y + 200 - h / 2 + 3, 75, h / 2 - 3);
                } else if (bar.level === 4) {
                    ctx.fillRect(x + i * 75 + 7, y + 100 - h / 2 + 3, 75, h / 2 - 3);
                    ctx.fillRect(x + i * 75 + 7, y + 100, 75, h / 2 - 3);
                } else {
                    ctx.fillRect(x + i * 75 + 7, y + 200 - h + 3, 75, h - 3);
                }
            }
            
            ctx.globalAlpha = 1;
        }
    }
    
    // bars
    for (var i = 0; i < 7; i++) {
        var bar = bars[i];
        if (!bar.unlocked) continue;
        
        var h = bar.value;
        var filledUp = false;
        
        if (bar.fillSpeed * prestige >= 6) {
            h = 200;
            filledUp = true;
        }
    
        ctx.fillStyle = bar.color;
        ctx.globalAlpha = Math.max(0, bar.alpha);
        ctx.fillRect(x + i * 75, y, 75, 200);
        ctx.globalAlpha = 1;
        
        if (bar.level === 2) {
            ctx.fillRect(x + i * 75, y, 75, h);
            
            if (!defaultSkin) {
                ctx.globalAlpha = 0.05;
                ctx.fillStyle = "black";
                ctx.fillRect(x + i * 75, y, 18, h);
                ctx.fillRect(x + i * 75 + 2*18, y, 18, h);
                ctx.globalAlpha = 1;
            }
        } else if (bar.level === 3) {
            ctx.fillRect(x + i * 75, y, 75, h / 2);
            ctx.fillRect(x + i * 75, y + 200 - h / 2, 75, h / 2);
            
            if (!defaultSkin) {
                ctx.globalAlpha = 0.05;
                ctx.fillStyle = "black";
                ctx.fillRect(x + i * 75, y, 18, h / 2);
                ctx.fillRect(x + i * 75 + 2*18, y, 18, h / 2);
                ctx.fillRect(x + i * 75, y + 200 - h / 2, 18, h / 2);
                ctx.fillRect(x + i * 75 + 2*18, y + 200 - h / 2, 18, h / 2);
                ctx.globalAlpha = 1;
            }
        } else if (bar.level === 4) {
            ctx.fillRect(x + i * 75, y + 100 - h / 2, 75, h / 2);
            ctx.fillRect(x + i * 75, y + 100, 75, h / 2);
            
            if (!defaultSkin) {
                ctx.globalAlpha = 0.05;
                ctx.fillStyle = "black";
                ctx.fillRect(x + i * 75, y + 100 - h / 2, 18, h / 2);
                ctx.fillRect(x + i * 75 + 18*2, y + 100 - h / 2, 18, h / 2);
                ctx.fillRect(x + i * 75, y + 100, 18, h / 2);
                ctx.fillRect(x + i * 75 + 18*2, y + 100, 18, h / 2);
                ctx.globalAlpha = 1;
            }
        } else {
            ctx.fillRect(x + i * 75, y + 200 - h, 75, h);
            
            if (!defaultSkin) {
                ctx.globalAlpha = 0.05;
                ctx.fillStyle = "black";
                ctx.fillRect(x + i * 75, y + 200 - h, 18, h);
                ctx.fillRect(x + i * 75 + 18*2, y + 200 - h, 18, h);
                ctx.globalAlpha = 1;
            }
        }
        
        if (filledUp && bar.level < 4 && false) {
            drawUpgradeButton(bar, x + i * 75 + 37 - 18, y + 70, 37, 50);
        }
    }
    
    // bar frame
    ctx.lineWidth = 2;
    ctx.strokeStyle = darkMode ? "rgb(60, 60, 60)" : "rgb(230, 230, 230)";
    ctx.strokeRect(x, y, 525, 200);
    
    // bars outline
    if (!defaultSkin) {
        for (var i = 0; i < 7; i++) {
            var bar = bars[i];
            if (!bar.unlocked) continue;
            
            var h = bar.value;
            ctx.strokeStyle = darkMode ? "white" : "black";
            ctx.globalAlpha = 1;
            
            if (bar.fillSpeed * prestige >= 6) {
                ctx.strokeRect(x + i * 75, y, 75, 200);
            } else {
                ctx.strokeRect(x + i * 75 - 0, y + 200 - h, 75, h);
            }
            
            ctx.globalAlpha = 1;
        }
    }
    
    // bar fill effect
    for (var i = 0; i < 7; i++) {
        var bar = bars[i];
        var dd = i === 0 ? 1 : 0;
        
        ctx.fillStyle = bar.color;
        ctx.globalAlpha = Math.sqrt(Math.max(0, bar.alpha));
        if (bar.level !== 2) {
            ctx.fillRect(x + i * 75 + dd, y - 2, 75 - dd, 4);
        }
        if (bar.level !== 1) {
            ctx.fillRect(x + i * 75 + dd, y + 200 - 2, 75 - dd, 4);
        }
    } 
    ctx.globalAlpha = 1;
    
    // smiley
    if (numberOfAchievements === 8) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(190 + 20, 140, 20, 0, 2*Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(390 - 20, 140, 20, 0, 2*Math.PI);
        ctx.fill();
        
        ctx.lineWidth = 8;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        //ctx.moveTo(290, 160);
        ctx.arc(290, 60, 200, 0 + Math.PI/6, Math.PI - Math.PI/6);
        ctx.stroke();
    }
    
    // ppf buttons
    ctx.lineWidth = 4;
    setFont(13);
    ctx.textAlign = "center";
    for (var i = 0; i < 7; i++) {
        var bar = bars[i];
        if (!bar.unlocked) continue;
        
        var tween = ppfTweens[i];
        var cx = x + 38 + i * 75;
        var cy = y + 230 + 60;
        var cr = 30 + tween.get();
        
        ctx.fillStyle = darkMode ? "white" : "black";
        ctx.fillText("$" + formatMoney(bar.fillValue), cx, cy - 60 + 5);
        
        ctx.fillStyle = bar.color;
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, cr, -Math.PI/2, -Math.PI/2 + 2*Math.PI * Math.min(money / bar.fillValuePrice, 1));
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        
        ctx.strokeStyle = bar.color;
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, 2 * Math.PI);
        ctx.stroke();
        
        var count = 1;
        var price = bar.fillValuePrice;
        var value = bar.fillValueNext;
        if (buyState === BUY_TEN) {
            var nextPrice = price + Math.floor(bar.fillValuePriceFormula(bar.fillValueUpdate + count));
            while (count < 10 && nextPrice <= money) {
                price = nextPrice;
                value = Math.floor(bar.fillValueFormula(bar.fillValueUpdate + count));
                count += 1;
                nextPrice = price + Math.floor(bar.fillValuePriceFormula(bar.fillValueUpdate + count));
            }
        } else if (buyState === BUY_MAX) {
            var nextPrice = price + Math.floor(bar.fillValuePriceFormula(bar.fillValueUpdate + count));
            while (nextPrice <= money) {
                price = nextPrice;
                value = Math.floor(bar.fillValueFormula(bar.fillValueUpdate + count));
                count += 1;
                nextPrice = price + Math.floor(bar.fillValuePriceFormula(bar.fillValueUpdate + count));
            }
        }
        var text = "+" + (value - bar.fillValue);
        
        if (bar.fillValuePrice <= money) {
            if (mouseInBox(cx - cr, cy - cr, 2*cr, 2*cr)) {
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(cx, cy, cr + 1, 0, 2*Math.PI);
                ctx.fill();
                ctx.globalAlpha = 1;
                
                if (mousePressed) {
                    tween.set(-5);
                    for (var ti = 0; ti < count; ti++) {
                        totalUpgrades[i] += 1;
                        buyFillValueUpdate(bar);
                    }
                }
                
                infoText = "Increase money per fill: costs $" + formatMoney(price);
            }
        } else {
            if (mouseInBox(cx - cr, cy - cr, 2*cr, 2*cr)) {
                infoText = "Increase money per fill: costs $" + formatMoney(price);
            }
        }
        
        ctx.fillStyle = darkMode ? "white" : "black";
        ctx.fillText(text, cx, cy + 5);
    }
    ctx.lineWidth = 2;
    
    // add buttons
    for (var i = 0; i < 7; i++) {
        var bar = bars[i];
        
        if (bar.unlocked) continue;
        if (i > 0 && !bars[i - 1].unlocked) continue;
        
        var cx = x + 38 + i * 75;
        var cy = y + 230 + 60;
        var cr = 22;
        
        if (money < bar.price) {
            ctx.strokeStyle = "rgb(120, 120, 120)";
            
            if (mouseInBox(cx - cr, cy - cr, 2*cr, 2*cr)) {
                infoText = "Add new bar: costs $" + formatMoney(bar.price);
            }
        } else {
            ctx.strokeStyle = "rgb(90, 160, 110)";

            if (mouseInBox(cx - cr, cy - cr, 2*cr, 2*cr)) {
                ctx.strokeStyle = "rgb(80, 180, 120)";
                
                if (mousePressed) {
                    bar.unlocked = true;
                    money -= bar.price;
                    
                    if (i >= 3) { buyFourth = true; }
                    if (i === 6) { buyLast = true; }
                }
                
                infoText = "Add new bar: costs $" + formatMoney(bar.price);
            }
        }
        
        //ctx.fillStyle = darkMode ? "white" : "black";
        //ctx.fillText("bar " + (i + 1), cx, cy - 60 + 5);
        
        ctx.fillStyle = ctx.strokeStyle;
        ctx.globalAlpha = 0.1;
        ctx.fillRect(cx - cr, cy - cr, 2*cr, 2*cr);
        ctx.globalAlpha = 1;

        ctx.lineWidth = 4;
        ctx.strokeRect(cx - cr, cy - cr, 2*cr, 2*cr);
        
        var cl = 10;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(cx - cl, cy);
        ctx.lineTo(cx + cl, cy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - cl);
        ctx.lineTo(cx, cy + cl);
        ctx.stroke();
        
        ctx.globalAlpha = 1;
    }
    ctx.lineWidth = 2;
    
    // fps buttons
    setFont(13);
    for (var i = 0; i < 7; i++) {
        var bar = bars[i];
        if (!bar.unlocked) continue;
        
        var tween = fpsTweens[i];
        var tv = tween.get();
        var bw = 215;
        var bh = 42;
        var bx = canvas.width - bw - 20;
        var by = y + i * (bh + 7);
        
        bx -= tv;
        by -= tv;
        bw += 2*tv;
        bh += 2*tv;
        
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "black";
        ctx.fillRect(bx + 3, by + 3, bw, bh);
        ctx.globalAlpha = 1;
        
        ctx.fillStyle = bar.fillSpeedPrice > money ? "rgb(140, 140, 140)" : bar.color;
        ctx.fillRect(bx, by, bw, bh);
        
        var count = 1;
        var price = bar.fillSpeedPrice;
        var value = bar.fillSpeedNext;
        if (buyState === BUY_TEN) {
            var nextPrice = price + Math.floor(bar.fillSpeedPriceFormula(bar.fillSpeedUpdate + count));
            while (count < 10 && nextPrice <= money) {
                price = nextPrice;
                value = Math.floor(bar.fillSpeedFormula(bar.fillSpeedUpdate + count) * 100) / 100;
                count += 1;
                nextPrice = price + Math.floor(bar.fillSpeedPriceFormula(bar.fillSpeedUpdate + count));
            }
        } else if (buyState === BUY_MAX) {
            var nextPrice = price + Math.floor(bar.fillSpeedPriceFormula(bar.fillSpeedUpdate + count));
            while (nextPrice <= money) {
                price = nextPrice;
                value = Math.floor(bar.fillSpeedFormula(bar.fillSpeedUpdate + count) * 100) / 100;
                count += 1;
                nextPrice = price + Math.floor(bar.fillSpeedPriceFormula(bar.fillSpeedUpdate + count));
            }
        }
        
        if (mouseInBox(bx, by, bw, bh)) {
            if (bar.fillSpeedPrice <= money) {
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = "white";
                ctx.fillRect(bx, by, bw, bh);
                ctx.globalAlpha = 1;
                
                if (mouseReleased) {
                    tween.set(-2);
                    for (var si = 0; si < count; si++) {
                        totalUpgrades[i] += 1;
                        buyFillSpeedUpdate(bar);
                    }
                }
            }
            
            infoText = "Increase fills per second: costs $" + formatMoney(bar.fillSpeedPrice);
        }
        
        var v = Math.round((value - bar.fillSpeed) * 100) / 100;
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        ctx.fillText((bar.fillSpeed * prestige) + " fps (+ " + (v * prestige) + ")", bx + 10, by + 20 - 1);
        ctx.textAlign = "right";
        ctx.fillText("$" + formatMoney(price), bx + bw - 10, by + 30 + 4);
        
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = darkMode ? "white" : "black";
        ctx.strokeRect(bx, by, bw, bh);
        ctx.globalAlpha = 1;
    }
    
    if (!bars[0].unlocked) {
        infoText = "Follow the white arrow!";
        
        arrowTimer -= 1;
        if (arrowTimer < 0) {
            arrowTimer = 40;
        }
        var dx = arrowTimer + 10;
        var oxx = 4;
        var oyy = 4;
        
        if (prestige <= 1) {
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.moveTo(150 - 50 + dx + oxx, y + oyy + 285);
            ctx.lineTo(150 + dx + oxx, y + oyy + 285 - 30);
            ctx.lineTo(150 + dx + oxx, y + oyy + 285 - 15);
            ctx.lineTo(150 + dx + oxx + 70, y + oyy + 285 - 15);
            ctx.lineTo(150 + dx + oxx + 70, y + oyy + 285 + 15);
            ctx.lineTo(150 + dx + oxx, y + oyy + 285 + 15);
            ctx.lineTo(150 + dx + oxx, y + oyy + 285 + 30);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
            
            ctx.fillStyle = "rgb(240, 240, 240)";
            ctx.beginPath();
            ctx.moveTo(150 - 50 + dx, y + 285);
            ctx.lineTo(150 + dx, y + 285 - 30);
            ctx.lineTo(150 + dx, y + 285 - 15);
            ctx.lineTo(150 + dx + 70, y + 285 - 15);
            ctx.lineTo(150 + dx + 70, y + 285 + 15);
            ctx.lineTo(150 + dx, y + 285 + 15);
            ctx.lineTo(150 + dx, y + 285 + 30);
            ctx.closePath();
            ctx.fill();
            
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(150 - 50 + dx, y + 285);
            ctx.lineTo(150 + dx, y + 285 - 30);
            ctx.lineTo(150 + dx, y + 285 - 15);
            ctx.lineTo(150 + dx + 70, y + 285 - 15);
            ctx.lineTo(150 + dx + 70, y + 285 + 15);
            ctx.lineTo(150 + dx, y + 285 + 15);
            ctx.lineTo(150 + dx, y + 285 + 30);
            ctx.closePath();
            ctx.stroke();
        } else {
            infoText = "Welcome back! Fill speed is now x" + prestige + ".";
        }
    }
    
    // amount buttons
    drawAmountButton(x + 580 - 10, y + 360, 50, "ONE");
    drawAmountButton(x + 645 - 10, y + 360, 50, "TEN");
    drawAmountButton(x + 710 - 10, y + 360, 50, "MAX");
    
    // menu buttons
    drawMenuButton(x +  15, y + 360, 150, "STATISTICS", function () {
        if (mousePressed) {
            gotoRoom(ROOM_STATS);
        }
        infoText = "Check out your statistics!";
    });
    drawMenuButton(x + 185, y + 360, 200, "ACHIEVEMENTS", function () {
        if (mousePressed) {
            gotoRoom(ROOM_ACHS);
        }
        infoText = "Check out your achievements!";
    });
    drawMenuButton(x + 405, y + 360, 100, "SHOP", function () {
        if (mousePressed) {
            gotoRoom(ROOM_SHOP);
        }
        infoText = "Let's buy some stuff!";
    });
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

function drawUpgradeButton(bar, x, y, w, h) {
    var cx = x + w/2;
    var cy = y + h/2;
    
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    
    ctx.globalAlpha = 0.3;
    ctx.fillRect(cx - 4, cy, 8, 18);
    
    ctx.beginPath();
    ctx.moveTo(cx, cy - 16);
    ctx.lineTo(cx - 10, cy);
    ctx.lineTo(cx + 10, cy);
    ctx.closePath();
    ctx.fill();
    
    ctx.globalAlpha = 0.2;
    ctx.strokeRect(x, y, w, h);
    
    if (mouseInBox(x, y, w, h)) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "white";
        ctx.fillRect(x, y, w, h);
        
        if (mouseReleased) {
            bar.level += 1;
            if (bar.level >= 2) { levelUpOnce = true; }
            if (bar.level >= 4) { levelUpThrice = true; }
            
            bar.fillValueUpdate = 0;
            bar.fillSpeedUpdate = 0;
            bar.value = 0;
            bar.fillSpeedNext = bar.fillSpeedInit();
            bar.fillValueNext = bar.fillValueInit();
            bar.fillSpeedPrice = 0;
            bar.fillValuePrice = 0;
            buyFillSpeedUpdate(bar);
            buyFillValueUpdate(bar);
        }
        
        infoText = "Upgrade bar to level " + (bar.level + 1) + ", multiply bar's value by 2";
    }
    
    ctx.lineWidth = 2;
    ctx.globalAlpha = 1;
}
