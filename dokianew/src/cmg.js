function unlockAllLevels() {
    highworldnumber = 4;
    highlevelnumber = 10;
    setLocalStorage("world", highworldnumber);
    setLocalStorage("level", highlevelnumber);
    
    worldnumber = 4;
    levelnumber = 10;
    
    if (game.scene.name === "scn_world") {
        stopAllMusic();
        if (MUSIC) startCurrentMusic();
        
        game.enterScene("scn_world");
    }
}

parent.unlockAllLevels = unlockAllLevels;

function checkCorrectSite() {return true;
    var hostname = parent.location.hostname;
    if (hostname === "") return true;
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
