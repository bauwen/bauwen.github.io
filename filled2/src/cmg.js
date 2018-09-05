function unlockAllLevels() {
    for (var i = 0; i <= 40; i++) {
        CONTROLLER.unlockedLevels[i] = true;
    }
    
    game.setLocalStorage("giflevel", 40);
}

parent.unlockAllLevels = unlockAllLevels;

function checkCorrectSite() {return true;
    var hostname = parent.location.hostname;
    var names = [
        "https://www.coolmath-games.com",
        "www.coolmath-games.com",
        "edit.coolmath-games.com",
        "www.stage.coolmath-games.com",
        "edit-stage.coolmath-games.com",
        "dev.coolmath-games.com",
        "m.coolmath-games.com",
        "https://www.coolmathgames.com",
        "www.coolmathgames.com",
        "edit.coolmathgames.com",
        "www.stage.coolmathgames.com",
        "edit-stage.coolmathgames.com",
        "dev.coolmathgames.com",
        "m.coolmathgames.com"
    ];
    for (var i = 0; i < names.length; i++) {
        if (hostname.indexOf(names[i]) >= 0) {
            return true;
        }
    }
    return false;
}

function cmgStart() {
    if (parent.cmgGameEvent) {
        parent.cmgGameEvent("start");
    }
}

function cmgStartLevel(n) {
    if (parent.cmgGameEvent) {
        parent.cmgGameEvent("start", "" + n);
    }
}

function cmgReplay(n) {
    if (parent.cmgGameEvent) {
        parent.cmgGameEvent("replay", "" + n);
    }
}
