function unlockAllLevels() {
    avoidLevel = unlockLevel;
    unlocked = true;
    if (hasLocalStorage) {
        localStorage.setItem("avoidlevel", avoidLevel);
    }
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
