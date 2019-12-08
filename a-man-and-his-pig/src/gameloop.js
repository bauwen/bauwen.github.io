var gameloop = {
    instances: [],
    events: [],
    room: "",
    roomNext: "",
    roomInit: null,
    people: {},

    pushEvent: function (event) {
        gameloop.events.push(event);
    },

    popEvent: function (event) {
        gameloop.events.splice(gameloop.events.indexOf(event), 1);
    },

    addInstance: function (name, x, y, depth, rotation) {
        /*if (!assets.objects.hasOwnProperty(name)) {
            return;
        }*/

        if (name === "obj_player" && playerInstance && missingScene) {
            return;
        }

        var instance = assets.objects[name]();

        instance.x = x;
        instance.y = y;

        if (depth) {
            instance.depth = depth;
        }

        if (rotation) {
            instance.rotation = rotation;
        }

        gameloop.instances.push(instance);

        if (instance.solid) {
            collision.fillRect(x, y, instance.width, instance.height);
        }

        instance.oncreate();

        gameloop.instances.sort(function (a, b) {
            return b.depth - a.depth;
        });

        return instance;
    },

    removeInstance: function (instance, destroy) {
        if (destroy) {
            instance.ondestroy();
        }

        gameloop.instances.splice(gameloop.instances.indexOf(instance), 1);
    },

    gotoRoom: function (room, init) {
        gameloop.roomNext = room;
        gameloop.roomInit = init || null;
    },

    prepareRoom: function () {
        collision.clear();

        gameloop.room = gameloop.roomNext;

        if (gameloop.room !== "rm_start" && gameloop.room !== "rm_white" && gameloop.room !== "rm_credits") {
            saveGame(); //TODO: enable
        }

        gameloop.roomNext = "";
        gameloop.instances = [];
        if (playerInstance) {
            gameloop.instances.push(playerInstance);
            if (playerInstance.follower) {
                gameloop.instances.push(playerInstance.follower);
            }
        }
        gameloop.events = [];
        gameloop.people = {};
        assets.rooms[gameloop.room]();

        doAtStartOfEachRoom();

        if (gameloop.roomInit) {
            gameloop.roomInit();
            gameloop.roomInit = null;
        }

        if (gameloop.room === "rm_grass1" && !missingScene) {
            missingScene = true;
            act.start([
                act.wait(1500),
                act.alert(playerInstance.x, playerInstance.y),
                act.wait(1000),
                act.face(playerInstance, 180),
                act.wait(200),
                act.face(playerInstance, 270),
                act.wait(300),
                act.face(playerInstance, 90),
                act.wait(300),
                act.face(playerInstance, 180),
                act.wait(300),
                act.face(playerInstance, 0),
                act.wait(500),
                act.say("Huh? Where is my pig?!"),
                //act.say("He would never leave my side..."),
                act.say("He cannot survive on his own!"),
                act.say("I need to find him!")
            ], function () {
                playMusic("mus_grass");
            });
        }
    }
};
