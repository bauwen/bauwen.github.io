var AG_disabled = !false;

var AG_api = null;
var AG_api_key = "";

function AG_init(api_key) {
    console.log("AG: initialized");
    if (AG_disabled) return;
    AG_api_key = api_key;
    AG_api = SWAGAPI.getInstance({
        wrapper: document.body,
        api_key: AG_api_key,
        theme: "shockwave",
        debug: true
    });
}

function AG_startSession(body) {
    console.log("AG: start session");
    if (AG_disabled) {
        body();
        return;
    }
    AG_api.startSession().then(function () {
        console.log("AG: start session ready");
        body();
    });
}

function AG_startGame(body) {
    console.log("AG: start game");
    if (AG_disabled) {
        body();
        return;
    }
    AG_api.startGame().then(function () {
        console.log("AG: start game ready");
        body();
    });
}

function AG_endGame(body, options) {
    console.log("AG: end game");
    if (AG_disabled) {
        body();
        return;
    }
    AG_api.endGame(options).then(function () {
        console.log("AG: end game ready");
        body();
    });
}

function AG_postScore(name, value) {
    if (AG_disabled) return;
    AG_api.postScore(name, value, { confirmation: false });
}

function AG_showDialog() {
    console.log("AG: showing dialog");
    if (AG_disabled) return;
    AG_api.showDialog("scores", {
        title: "Highscores",
        level_key: "highscore",
        period: "alltime",
        value_formatter: ""
    });
}
