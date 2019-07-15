assets.createObject("obj_snow", {
    oncreate: function () {
        this.depth = -1001;
        this.snowflakes = [];
        for (var i = 0; i < 50; i++) {
            var s = {
                oncreate: SNOWFLAKE.oncreate,
                onupdate: SNOWFLAKE.onupdate
            };
            s.oncreate();
            this.snowflakes.push(s);
        }
    },

    onupdate: function () {
        for (var i = 0; i < this.snowflakes.length; i++) {
            this.snowflakes[i].onupdate();
        }
    }
}, true, 1, 1);

var SNOWFLAKE = {
    oncreate: function () {
        this.depth = -1001;
        this.x = Math.floor(Math.random() * canvas.width);
        this.y = Math.floor(Math.random() * (canvas.height - textBarHeight));
        this.size = Math.random();
        this.dx = 0;
        this.timer = 0;
        this.speed = 0.5 + Math.random();
        this.wiggle = 0.06 + Math.random() * 0.04;
    },

    onupdate: function () {
        if (this.size > 0) {
            this.size -= 0.002;
        }

        if (this.size <= 0 || this.y > canvas.height - textBarHeight + 32) {
            this.x = Math.floor(Math.random() * canvas.width);
            if (this.size <= 0) this.size = 1;
            if (this.y > canvas.height - textBarHeight + 32) this.y = -32;//Math.floor(Math.random() * (canvas.height - textBarHeight));

        }

        //this.x -= Math.cos(-Math.atan2(this.y - (canvas.height - textBarHeight)/2, this.x - canvas.width/2)) * 0.3;
        //this.y += Math.sin(-Math.atan2(this.y - (canvas.height - textBarHeight)/2, this.x - canvas.width/2)) * 0.3;
        this.y += this.speed;
        this.timer += this.wiggle;
        this.timer %= Math.PI*2;
        this.dx = Math.sin(this.timer) * 10;

        ctx.globalAlpha = 1// - Math.abs(this.size - 0.5) / 0.5;
        ctx.fillStyle = "rgb(240, 240, 240)";
        ctx.beginPath();
        ctx.arc(this.x + this.dx, this.y, Math.max(0.001, (1-Math.abs(this.size-0.5)/0.5) * 5), 0, 2*Math.PI);
        ctx.fill();
        //ctx.globalAlpha = 1;
        /*
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgb(80, 80, 80)";
        ctx.beginPath();
        ctx.arc(this.x + this.dx, this.y, Math.max(0.001, (this.size + 0.5) * 5), 0, 2*Math.PI);
        ctx.stroke();*/
        ctx.globalAlpha = 1;
    }
};
