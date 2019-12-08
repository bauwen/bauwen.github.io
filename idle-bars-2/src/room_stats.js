function loopRoomStats() {
    
    var x = 25;
    var y = 90;
    var pad = 50;
    
    var totalRevenueAll = 0;
    
    ctx.textAlign = "left";
    setFont(14);
    for (var i = 0; i < 7; i++) {
        var bar = bars[i];
        if (!bar.unlocked) continue;
        
        var by = y + i * pad;
        
        ctx.fillStyle = bar.color;
        ctx.fillRect(x, by, 80, pad - 6);
        ctx.globalAlpha = darkMode ? 0.25 : 0.1;
        ctx.fillRect(x + 80, by, 680, pad - 6);
        ctx.globalAlpha = 1;
        
        totalRevenueAll += totalRevenue[i];
        
        ctx.fillStyle = darkMode ? "white" : "black";
        ctx.fillText("Total Upgrades: " + totalUpgrades[i], x + 100 + 20, by + 28);
        //ctx.fillText("Current Level: " + bar.level, x + 100 + 200 + 20, by + 28);
        ctx.fillText("Rate: $" + formatMoney(Math.floor(bar.fillSpeed * bar.fillValue * prestige * 1) / 1) + "/sec", x + 100 + 200 + 20, by + 28);
        ctx.fillText("Revenue: $" + formatMoney(totalRevenue[i]), x + 100 + 380 + 20, by + 28);
    }
    
    setFont(18);
    ctx.fillStyle = darkMode ? "white" : "black";
    ctx.fillText("Prestige: " + Math.round(Math.log(prestige) / Math.log(2)), x + 10, y + 384);
    ctx.fillText("Total Revenue: $" + formatMoney(totalRevenueAll), x + 150, y + 384);
    
    // menu buttons
    drawMenuButton(canvas.width - 180, y + 360, 150, "GO BACK", function () {
        if (mousePressed) {
            gotoRoom(ROOM_BARS);
        }
        infoText = "Return to the bars";
    });
}
