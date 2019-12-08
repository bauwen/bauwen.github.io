function Disk(x, y) {
    this.x = x;
    this.y = y;
    this.popped = false;
    this.direction = Math.floor(Math.random() * 2 * Math.PI);
    this.startRadius = Math.floor(9 / incr.roomSize.value);
    this.radius = this.startRadius;
    this.lifetime = 0;
    this.dying = false;
    this.dead = false;
    this.score = 0;
    this.depth = 0;
    this.tween = new Tween(0.8, 15);
    this.chain = 0;
    this.initialValue = 1;

    var r = Math.floor(Math.random() * 220);
    var g = Math.floor(Math.random() * 220);
    var b = Math.floor(Math.random() * 220);
    this.color = { r: r, g: g, b: b };
}

Disk.prototype.update = function () {
    if (this.dead) return;

    if (this.popped) {
        if (this.dying) {
            if (this.radius > 0) {
                this.radius -= 2;
            } else {
                this.dead = true;
            }
        } else {
            this.radius = Math.floor(incr.popSize.value / incr.roomSize.value) - this.tween.get();
        }

        if (this.lifetime < incr.popTime.value) {
            this.lifetime += 1;
        } else {
            this.dying = true;
        }
    } else {
        this.x += Math.cos(this.direction) * Math.floor(incr.ballSpeed.value / Math.sqrt(incr.roomSize.value));
        this.y -= Math.sin(this.direction) * Math.floor(incr.ballSpeed.value / Math.sqrt(incr.roomSize.value));

        if (boosting) {
            if (this.x - this.startRadius < areaX) this.x = areaX + this.startRadius;
            if (this.x + this.startRadius >= areaX + areaWidth) this.x = areaX + areaWidth - this.startRadius;
            if (this.y - this.startRadius < areaY) this.y = areaY + this.startRadius;
            if (this.y + this.startRadius >= areaY + areaHeight) this.y = areaY + areaHeight - this.startRadius;

            var spd = level < 3 ? 2 : 3;
            this.x += Math.cos(this.direction) * Math.floor(spd / Math.sqrt(incr.roomSize.value));
            this.y -= Math.sin(this.direction) * Math.floor(spd / Math.sqrt(incr.roomSize.value));
        }

        if (this.x - this.startRadius < areaX || areaX + areaWidth <= this.x + this.startRadius) {
            this.direction = (3 * Math.PI - this.direction) % (2 * Math.PI);
        }
        if (this.y - this.startRadius < areaY || areaY + areaHeight <= this.y + this.startRadius) {
            this.direction = (2 * Math.PI - this.direction) % (2 * Math.PI);
        }

        for (var i = 0; i < disks.length; i++) {
            var that = disks[i];
            if (that.popped && !that.dying) {
                var dx = this.x - that.x;
                var dy = this.y - that.y;

                if (Math.sqrt(dx * dx + dy * dy) < this.radius + that.radius) {
                    popCount += 1;
                    this.popped = true;
                    this.depth = popCount;
                    //this.score = this.initialValue * Math.pow(incr.multiplier.value, this.chain);
                    this.score = that.score * incr.multiplier.value;
                    this.chain = that.chain + 1;
                    this.tween.set(Math.floor(incr.popSize.value / incr.roomSize.value) - this.startRadius);

                    var scoreValue = Math.floor(this.score);
                    statTotalMoney += scoreValue;
                    money += scoreValue;
                    extraMoney += scoreValue;

                    // all pop money bonus!
                    if (popCount === incr.ballNumber.value) {
                        var extraScoreValue = Math.floor(extraMoney * 0.1);
                        money += extraScoreValue;
                        extraMoney += extraScoreValue;
                        statTotalMoney += extraScoreValue;
                    }

                    if (extraMoney > moneyRecord) {
                        moneyRecord = extraMoney;
                    }

                    statTotalPops += 1;
                    doQuake(Math.floor(this.chain / 5));
                    break;
                }
            }
        }
    }

    var offset = this.popped ? 4 : 2;

    ctx.globalAlpha = (this.radius < 20 ? 0.1 : this.popped ? 0.2 : 0.2);// * roomPlayAlpha;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x + offset, this.y + offset, Math.max(0, this.radius), 0, 2 * Math.PI);
    ctx.fill();

    ctx.globalAlpha = 0.85;// * roomPlayAlpha;
    ctx.fillStyle = "rgb(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ")";
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0, this.radius), 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;

    /*
    ctx.font = "16px gamefont, sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText(this.chain, this.x, this.y - 50);
    */

    if (this.popped && !this.dying) {
        ctx.globalAlpha = 1;//roomPlayAlpha;
        var val = formatMoney(Math.floor(this.score));

        var fontsize = (val.length < 7 ? 18 : val.length < 9 ? 16 : 14);
        fontsize = Math.floor(fontsize / incr.roomSize.value);
        if (level >= 3) fontsize += 3;
        ctx.font = fontsize + "px gamefont, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "black"
        var yp = -5;//fontsize === 18 ? 40 : 0;
        ctx.fillText(val, this.x + 1, this.y + 1 + 7 + yp);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "white";
        ctx.fillText(val, this.x, this.y + 7 + yp);
        ctx.textBaseline = "top";
        ctx.globalAlpha = 1;
    }
};
