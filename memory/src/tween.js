function Tween(damping, stiffness) {
    this.delta = 0;
    this.speed = 0;
    this.damping = damping;
    this.stiffness = stiffness;
}

Tween.prototype = {
    get: function () {
        this.speed = this.damping * this.speed - this.delta / this.stiffness;
        this.delta += this.speed;
        return this.delta;
    },

    set: function (value) {
        this.delta = value;
        this.speed = 0;
    }
};

function easeInElastic(t) {
    var b = 0;
    var c = 1;
    var d = 1;
    if (t === 0) return b;
    t /= d;
    if (t === 1) return b+c;
    var p = d*0.3;
    var a = c;
    var s = p/4;
    t -= 1;
    return -(a*Math.pow(2,10*t) * Math.sin( (t*d-s) * (2*Math.PI)/p)) + b;
}

function easeInBack(n) {
    var s = 0;
	if (s === 0) {
		s = 1.70158
	}
	return n * n * ((s+1)*n - s);
}

function easeOutBack(n) {
    var s = 0;
	if (s === 0) {
		s = 1.70158
	}
    n -= 1;
	return n*n*((s+1)*n+s) + 1;
}
