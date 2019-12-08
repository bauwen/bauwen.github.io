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

function checkCorrectSite() {
    return true;
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
