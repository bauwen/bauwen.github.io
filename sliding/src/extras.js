function checkCorrectSite() {
    return true; // TODO
    var hostname = window.parent.location.hostname;
    
    switch (hostname) {
        case "www.coolmath-games.com":
        case "edit.coolmath-games.com":
        case "www.stage.coolmath-games.com":
        case "edit-stage.coolmath-games.com":
        case "dev.coolmath-games.com":
        case "m.coolmath-games.com":
            return true;
    }
    
    return false;
}

function resizeIt() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var c = ctx.canvas; 
    var sw = c.width;
    var sh = c.height;
    
    var r = w / h;
    var sr = sw / sh;
    
    if (r > sr) {
        sw *= h / sh;
        sh = h;
    } else {
        sh *= w / sw;
        sw = w;
    }
    
    c.style.width = Math.floor(sw) + "px";
    c.style.height = Math.floor(sh) + "px";
    topDiv.style.marginTop = Math.floor((h - sh) / 2) + "px";
}

function cmgStart() {
    if (parent.cmgGameEvent) {
        parent.cmgGameEvent("start");
    }
}

function cmgStartLevel(n) {
    console.log("cmgStartLevel", n);
    if (parent.cmgGameEvent) {
        parent.cmgGameEvent("start", "" + n);
    }
}

function cmgReplay(n) {
    console.log("cmgReplay", n);
    if (parent.cmgGameEvent) {
        parent.cmgGameEvent("replay", "" + n);
    }
}

function unlockAllLevels() {
    for (var i = 0; i < 40; i++) {
        unlocked[i] = true;
    }
    
    updateLevelStates();
}
