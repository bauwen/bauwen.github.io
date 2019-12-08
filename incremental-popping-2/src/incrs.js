var incr = {
    multiplier: {
        text: "Multiplier",
        info: "Value of colliding ball  =  value of other ball times this number",
        getNextValue: function () {
            if (level === 2) return this.value + 0.15;
            if (level >= 3) return this.value + 0.2;
            return this.value + 0.1;
        },
        getPrice: function () {
            if (level === 1) return Math.floor(4 + Math.pow(2.8, this.progress));
            if (level === 2) return Math.floor(9 + Math.pow(6.8, this.progress));
            if (level >= 3) return Math.floor(4 + Math.pow(14.9, this.progress));
            return Math.floor(99 + Math.pow(8.8, this.progress));
        },

        getPreviousValue: function () {
            if (level === 2) return this.value - 0.15;
            if (level >= 3) return this.value - 0.2;
            return this.value - 0.1;
        },
        getPreviousPrice: function () {
            if (level === 1) return Math.floor(4 + Math.pow(2.8, this.progress-1));
            if (level === 2) return Math.floor(9 + Math.pow(6.8, this.progress-1));
            if (level >= 3) return Math.floor(4 + Math.pow(14.9, this.progress-1));
            return Math.floor(99 + Math.pow(8.8, this.progress-1));
        }
    },

    ballNumber: {
        text: "Ball Number",
        info: "The initial number of balls in a game",
        getNextValue: function () {
            //if (prestige > 0) { return this.value + 3; }
            if (level >= 3) return this.value + 3;
            return this.value + 2;
        },
        getPrice: function () {
            if (level === 1) return Math.floor(9 + Math.pow(3.0, this.progress));
            if (level === 2) return Math.floor(19 + Math.pow(6.0, this.progress));
            if (level >= 3) return Math.floor(4 + Math.pow(11.2, this.progress));
            return Math.floor(49 + Math.pow(9.1, this.progress));
        },

        getPreviousValue: function () {
            //if (prestige > 0) { return this.value - 3; }
            if (level >= 3) return this.value - 3;
            return this.value - 2;
        },
        getPreviousPrice: function () {
            if (level === 1) return Math.floor(9 + Math.pow(3.0, this.progress-1));
            if (level === 2) return Math.floor(19 + Math.pow(6.0, this.progress-1));
            if (level >= 3) return Math.floor(4 + Math.pow(11.2, this.progress-1));
            return Math.floor(49 + Math.pow(9.1, this.progress-1));
        }
    },

    popSize: {
        text: "Pop Size",
        info: "The size of a ball that has been popped",
        getNextValue: function () {
            //if (prestige > 0) { return incrRadius + 4; }
            if (level >= 3) return this.value + 3;
            return this.value + (this.progress > 2 ? 1 : 2);
        },
        getPrice: function () {
            if (level >= 3) return Math.floor(9 + Math.pow(11.4, this.progress));
            return Math.floor(9 + Math.pow(8.6, this.progress));
        },

        getPreviousValue: function () {
            //if (prestige > 0) { return incrRadius - 4; }
            if (level >= 3) return this.value - 3;
            return this.value - (this.progress-1 > 2 ? 1 : 2);
        },
        getPreviousPrice: function () {
            if (level >= 3) return Math.floor(9 + Math.pow(11.4, this.progress-1));
            return Math.floor(9 + Math.pow(8.6, this.progress-1));
        }
    },

    popTime: {
        text: "Pop Time",
        info: "The amount of time a ball stays popped (in seconds)",
        getNextValue: function () {
            return this.value + 15;
        },
        getPrice: function () {
            if (level === 2) return Math.floor(9 + Math.pow(5.5, this.progress));
            if (level >= 3) return Math.floor(9 + Math.pow(10.6, this.progress));
            return Math.floor(49 + Math.pow(8.1, this.progress));
        },

        getPreviousValue: function () {
            return this.value - 15;
        },
        getPreviousPrice: function () {
            if (level === 2) return Math.floor(9 + Math.pow(5.5, this.progress-1));
            if (level >= 3) return Math.floor(9 + Math.pow(10.6, this.progress-1));
            return Math.floor(49 + Math.pow(8.1, this.progress-1));
        }
    },

    ballSpeed: {
        text: "Ball Speed",
        info: "The initial speed of the balls",
        getNextValue: function () {
            return this.value + 0.2;
        },
        getPrice: function () {
            if (level >= 3) return Math.floor(4 + Math.pow(12.2, this.progress));
            return 999;
        },

        getPreviousValue: function () {
            return this.value - 0.2;
        },
        getPreviousPrice: function () {
            if (level >= 3) return Math.floor(4 + Math.pow(12.2, this.progress-1));
            return 999;
        }
    },

    roomSize: {
        text: "Room Size",
        info: "The size of the playground",
        getNextValue: function () {
            return this.value + 1;
        },
        getPrice: function () {
            return 999;
        },

        getPreviousValue: function () {
            return this.value - 1;
        },
        getPreviousPrice: function () {
            return 999;
        }
    },

    boostTime: {
        text: "Boost Time",
        info: "The amount of available boost time (in seconds)",
        getNextValue: function () {
            return this.value + 0.2;
        },
        getPrice: function () {
            if (level === 2) return Math.floor(49 + Math.pow(4.0, this.progress));
            if (level >= 3) return Math.floor(9 + Math.pow(8.0, this.progress));
            return 999;
        },

        getPreviousValue: function () {
            return this.value - 0.2;
        },
        getPreviousPrice: function () {
            if (level === 2) return Math.floor(49 + Math.pow(4.0, this.progress-1));
            if (level >= 3) return Math.floor(9 + Math.pow(8.0, this.progress-1));
            return 999;
        }
    }
};
