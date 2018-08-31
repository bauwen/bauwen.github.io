function unlockAllLevels() {
    highscore1 = 300;
    highscore2 = 300;
    setLocalStorage("highscore1", highscore1);
    setLocalStorage("highscore2", highscore2);
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
