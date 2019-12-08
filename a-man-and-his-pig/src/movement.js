var movement = {
    walkThrough: function (obj, speed, direction, through, callback) {
        //tools.assert(obj.sprite.length === 4);

        if (speed === 0) {
            return;
        }

        var cx = Math.floor(obj.x / 32) * 32;
        var cy = Math.floor(obj.y / 32) * 32;

        if (obj.x !== cx || obj.y !== cy) {
            return;
        }

        direction %= 360;
        obj.rotation = direction;

        var hspeed = -((direction - 90) % 180) / 90 * speed;
        var vspeed = ((direction - 180) % 180) / 90 * speed;
        var x = obj.x + Math.sign(hspeed) * 32;
        var y = obj.y + Math.sign(vspeed) * 32;

        var prevx = cx;
        var prevy = cy;

        if (!through && collision.check(x, y)) {
            if (callback) {
                callback();
            }
            return;
        }

        if (obj.follower !== null) {
            var fx = Math.floor(obj.follower.x / 32) * 32;
            var fy = Math.floor(obj.follower.y / 32) * 32;
            var dir = (1 + Math.sign(fx - cx)) * 90;

            if (dir === 90) {
                dir = (2 + Math.sign(cy - fy)) * 90;
                if (dir === 180) {
                    dir = -1;
                }
            }

            if (dir >= 0) {
                movement.walkThrough(obj.follower, speed, dir, true);
            }
        }

        if (obj.solid) {
            collision.fill(x, y);
        }

        gameloop.pushEvent(function () {
            obj.index = (obj.index + Math.abs(speed) / (32 / 2) + 0.001) % 4;
            obj.x += hspeed;
            obj.y += vspeed;

            if (obj.x === x && obj.y === y) {
                obj.index = Math.floor(obj.index / 2) * 2;

                if (callback) {
                    callback();
                }

                collision.free(prevx, prevy);
                return true;
            }

            return false;
        });
    },

    walk: function (obj, speed, direction, callback) {
        movement.walkThrough(obj, speed, direction, false, callback);
    },

    push: function (obj, speed, direction, other, callback) {
        movement.walkThrough(obj, speed, direction, true);
        movement.walkThrough(other, speed, direction, true, callback);
    },

    slide: function (obj, speed, direction, predicate, callback) {
        if (speed === 0) {
            return;
        }

        var cx = Math.floor(obj.x / 32) * 32;
        var cy = Math.floor(obj.y / 32) * 32;

        if (obj.x !== cx || obj.y !== cy) {
            return;
        }

        direction %= 360;
        obj.rotation = direction;

        gameloop.pushEvent(function () {
            var cx = Math.floor(obj.x / 32) * 32;
            var cy = Math.floor(obj.y / 32) * 32;
            var hspeed = -((direction - 90) % 180) / 90 * speed;
            var vspeed = ((direction - 180) % 180) / 90 * speed;

            if (obj.x !== cx || obj.y !== cy) {
                obj.x += hspeed;
                obj.y += vspeed;
                return false;
            }

            var x = obj.x + Math.sign(hspeed) * 32;
            var y = obj.y + Math.sign(vspeed) * 32;

            var prevx = cx;
            var prevy = cy;

            if ((predicate && predicate()) || collision.check(x, y)) {
                if (callback) {
                    callback();
                }
                return true;
            }

            if (obj.follower !== null) {
                var fx = Math.floor(obj.follower.x / 32) * 32;
                var fy = Math.floor(obj.follower.y / 32) * 32;
                var dir = (1 + Math.sign(fx - cx)) * 90;

                if (dir === 90) {
                    dir = (2 + Math.sign(cy - fy)) * 90;
                    if (dir === 180) {
                        dir = -1;
                    }
                }

                if (dir >= 0) {
                    movement.walkThrough(obj.follower, speed, dir, true);
                }
            }

            if (obj.solid) {
                collision.free(prevx, prevy)
                collision.fill(x, y);
                obj.x += hspeed;
                obj.y += vspeed;
            }

            return false;
        });
    },

    walkNumber: function (obj, speed, direction, number, callback) {
        var sequence = [];
        var func = function (callback) {
            movement.walk(obj, speed, direction, callback);
        };

        for (var i = 0; i < number; i++) {
            sequence.push(func);
        }

        tools.series(sequence, callback);
    },

    walkUntil: function (obj, speed, direction, predicate, callback) {
        tools.until(function (callback) {
            movement.walk(obj, speed, direction, callback);
        }, predicate, callback);
    },

    isFacing: function (obj, x, y) {
        var dx = -((obj.rotation - 90) % 180) / 90 * 32;
        var dy = ((obj.rotation - 180) % 180) / 90 * 32;

        return obj.x + dx === x && obj.y + dy === y;
    },

    follow: function (objFollower, objLeader) {
        objFollower.solid = false;
        objLeader.follower = objFollower;
    },

    unfollow: function (objFollower, objLeader) {
        if (objLeader.follower !== objFollower) {
            return;
        }

        collision.fill(objFollower.x, objFollower.y);
        objFollower.solid = true;
        objLeader.follower = null;
    }
};
