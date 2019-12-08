var act = {
    start: function (list, callback) {
        textShowing = true;
        tools.series(list, function (x) {
            textShowing = false;
            if (callback) {
                callback(x);
            }
        });
    },

    block: function (list) {
        return function (callback) {
            tools.series(list, function (result) {
                if (!result || result != "stop") {
                    callback();
                    return;
                }

                callback(true);
            });
        };
    },

    stop: function () {
        return function (callback) {
            callback(0, "stop");
        }
    },

    exit: function () {
        return function (callback) {
            callback(0, "exit");
        }
    },

    skip: function (skips) {
        return function (callback) {
            callback(skips);
        };
    },

    exec: function (func) {
        return function (callback) {
            func(callback);
        };
    },

    execSync: function (func) {
        return function (callback) {
            func();
            callback();
        };
    },

    alert: function (x, y) {
        return function (callback) {
            gameloop.addInstance("obj_surprise", x, y);
            callback();//setTimeout(callback, 1000);
        };
    },

    wait: function (time) {
        return function (callback) {
            setTimeout(callback, time);
        };
    },

    say: function (text) {
        return function (callback) {
            dialog.say(text, callback);
        };
    },

    ask: function (question, func) {
        return function (callback) {
            dialog.askYesNo(question, function (yes) {
                func(yes, callback);
            });
        };
        /*
        return function (callback) {
            dialog.askYesNo(question, function (yes) {
                if (yes) {
                    if (no) {
                        callback(skips);
                    } else {
                        callback();
                    }
                } else {
                    if (no) {
                        callback();
                    } else {
                        callback(skips);
                    }
                }
            });
        };
        */
    },

    walk: function (obj, speed, direction) {
        return function (callback) {
            movement.walk(obj, speed, direction, callback);
        };
    },

    walkCount: function (obj, speed, direction, count) {
        return function (callback) {
            var list = [];
            for (var i = 0; i < count; i++) {
                list.push(function (callback) {
                    movement.walk(obj, speed, direction, callback);
                });
            }
            tools.series(list, callback);
        };
    },

    face: function (obj, direction) {
        return function (callback) {
            obj.rotation = direction;
            callback();
        };
    },

    follow: function (objFollower, objLeader) {
        return function (callback) {
            movement.follow(objFollower, objLeader);
            callback();
        };
    },

    unfollow: function (objFollower, objLeader) {
        return function (callback) {
            movement.unfollow(objFollower, objLeader);
            callback();
        }
    }
};
