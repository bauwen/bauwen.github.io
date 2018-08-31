function unlockAllLevels() {
    for (var key in stuff) {
        if (stuff.hasOwnProperty(key)) {
            var item = stuff[key];
            while (item.getProgress() < 10) {
                item.update();
            }
        }
    }
    
    saveGameState();
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
