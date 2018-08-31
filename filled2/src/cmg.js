function unlockAllLevels() {
    for (var i = 0; i <= 40; i++) {
        CONTROLLER.unlockedLevels[i] = true;
    }
    
    game.setLocalStorage("giflevel", 40);
}

parent.unlockAllLevels = unlockAllLevels;

function checkCorrectSite() {return true;
    var hostname = parent.location.hostname;
    return (hostname === "" || hostname.indexOf("coolmath-games.com") >= 0);
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
