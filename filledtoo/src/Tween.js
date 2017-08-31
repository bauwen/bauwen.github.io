function Tween(damping, stiffness) {
    this.delta = 0;
    this.speed = 0;
    this.damping = damping;
    this.stiffness = stiffness;
}

Tween.prototype = {
    get() {
        this.speed = this.damping * this.speed - this.delta / this.stiffness;
        this.delta += this.speed;
        return this.delta;
    },
    
    set(value) {
        this.delta = value;
        this.speed = 0;
    }
};
