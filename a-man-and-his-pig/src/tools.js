var tools = {
    assert: function (condition) {
        if (!condition) {
            throw new Error("Assertion error!");
        }
    },

    getBasename: function (path) {
        var from = path.lastIndexOf("/") + 1;
        var to = path.lastIndexOf(".");

        return path.slice(from, to);
    },

    series: function (list, callback) {
        var index = 0;

        var pass = function (skips, exit) {
            if (exit || index >= list.length) {
                if (callback) {
                    setTimeout(callback, 0, exit);
                }
            } else {
                if (skips) {
                    index += skips;
                }

                setTimeout(function () {
                    list[index++](pass);
                }, 0);
            }
        };

        pass();
    },

    until: function (func, predicate, callback) {
        var pass = function (exit) {
            if (exit || predicate()) {
                if (callback) {
                    setTimeout(callback, 0, exit);
                }
            } else {
                setTimeout(function () {
                    func(pass);
                }, 0);
            }
        };

        func(pass);
    },

    forEach: function (list, callback) {
        var copy = list.slice();

        for (var i = 0, len = copy.length; i < len; i++) {
            callback(copy[i], i);
        }
    }
};
