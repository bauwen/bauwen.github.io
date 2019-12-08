assets.createObject("obj_rotator", {
    oncreate: function () {
        this.depth = -5;
        this.rotation = 0;
        this.arms = {
            "0": 0,
            "90": 0,
            "180": 0,
            "270": 0,
        };
        this.moveRotation = 0;
        this.color = "blue";
    },

    onupdate: function () {
        if (this.moveRotation !== 0) {
            this.rotation += this.moveRotation * 6;
            this.rotation = (this.rotation + 360) % 360;

            if (this.rotation % 90 === 0) {
                this.moveRotation = 0;
            }
        }

        for (var i = 0; i < 4; i++) {
            var degrees = i * 90;
            this.drawArmShadow(degrees);
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.rotation/180*Math.PI);

        for (var i = 0; i < 4; i++) {
            var degrees = i * 90;
            this.drawArm(degrees);
        }

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, 2*Math.PI);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, 2*Math.PI);
        ctx.fill();

        ctx.restore();
    },

    determineMove: function (x, y, dx, dy) {
        var x11 = x + 32/2;
        var y11 = y + 32/2;
        var x12 = x11 + dx * 32;
        var y12 = y11 + dy * 32;

        for (var i = 0; i < 4; i++) {
            var degrees = i * 90;
            var length = this.arms[degrees];
            for (var j = 0; j < length; j++) {
                var d = j * 32;
                var r = (this.rotation + degrees) / 180 * Math.PI;
                var x21 = this.x + Math.cos(r) * d;
                var y21 = this.y - Math.sin(r) * d;
                var x22 = this.x + Math.cos(r) * (d + 32);
                var y22 = this.y - Math.sin(r) * (d + 32);

                if (linesIntersect(x11, y11, x12, y12, x21, y21, x22, y22)) {
                    return Math.sign(crossProduct(x21, y21, x22, y22, x12, y12));
                }
            }
        }

        return 0;
    },

    canPush: function (move) {
        if (move === 0) {
            return false;
        }
        for (var i = 0; i < 4; i++) {
            var degrees = i * 90;
            var length = this.arms[degrees];
            for (var j = 0; j < length; j++) {
                var d = j * 32 + 32/2;
                var r = (this.rotation + degrees) / 180 * Math.PI;
                var x = this.x + Math.cos(r) * d;
                var y = this.y - Math.sin(r) * d;
                x += -Math.sin(r) * move * 32/2;
                y += -Math.cos(r) * move * 32/2;

                var px = playerInstance.x + 16;
                var py = playerInstance.y + 16;
                if ((px !== x || py !== y) && collision.check(x, y)) {
                    return false;
                }
            }
        }
        return true;
    },

    doPush: function (move) {
        this.moveRotation = move;
    },

    drawArm: function (degrees) {
        var l = this.arms[degrees];
        var x = Math.cos(degrees / 180 * Math.PI) * l;
        var y = -Math.sin(degrees / 180 * Math.PI) * l;

        ctx.lineWidth = 5;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x * 32, y * 32);
        ctx.stroke();
    },

    drawArmShadow: function (degrees) {
        var l = this.arms[degrees];
        var r = (this.rotation + degrees) / 180 * Math.PI;
        var x = this.x + Math.cos(r) * l * 32;
        var y = this.y - Math.sin(r) * l * 32;

        ctx.globalAlpha = shadowAlpha;
        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.x + 3, this.y + 3);
        ctx.lineTo(x + 3, y + 3);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
}, true, 1, 1);

function crossProduct(x0, y0, x1, y1, x2, y2) {
    return (x2 - x0)*(y1 - y0) - (y2 - y0)*(x1 - x0);
}

function linesIntersect(x11, y11, x12, y12, x21, y21, x22, y22) {
    var a1 = Math.sign(crossProduct(x11, y11, x12, y12, x21, y21));
    var a2 = Math.sign(crossProduct(x11, y11, x12, y12, x22, y22));
    if (a1 === a2) return false;
    var b1 = Math.sign(crossProduct(x21, y21, x22, y22, x11, y11));
    var b2 = Math.sign(crossProduct(x21, y21, x22, y22, x12, y12));
    return b1 !== b2;
}
