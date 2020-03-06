class Multiplay {
    constructor(maxPlayers, startState) {
        if (typeof maxPlayers !== "number" || maxPlayers < 2) {
            maxPlayers = 2;
        }
        this.playerCount = maxPlayers;
        
        const channel = "generalserver";
        const username = "generalserver";
        const password = "xi4jzd5jkk7ph5spkxbb32ug9bbz7r";
        this.server = new BetterTwitchServer(channel, username, password);
        
        this.onstatechange = (state) => {};
        this.turn = false;
        this.id = -1;
        
        let players = [];
        const uuid = new Date().getTime();
        let host = false;
        let started = false;
        
        this.server.onready = () => {
            this.server.broadcast({ 
                type: "new", 
                uuid,
            });
            setTimeout(() => {
                if (players.length === 0) {
                    console.log("I'm host!");
                    $("info").textContent = "Waiting for " + (maxPlayers - 1) + " more players...";
                    host = true;
                    this.id = 0;
                    players.push({ uuid, id: this.id });
                }
            }, 2000);
        };
        
        this.server.onmessage = (message) => {
            switch (message.type) {
                case "new":
                    if (host && !started) {
                        players.push({
                            uuid: message.uuid,
                            id: players.length
                        });
                        this.server.broadcast({
                            type: "lobby",
                            uuid: message.uuid,
                            players,
                        });
                        if (players.length === maxPlayers) {
                            started = true;
                            this.server.broadcast({
                                type: "state",
                                turnId: 0,
                                state: startState,
                            });
                            this.turn = true;
                            $("info").textContent = "It's your turn!";
                        }
                    }
                    break;
                    
                case "lobby":
                    players = message.players;
                    if (message.uuid === uuid) {
                        this.id = players[players.length - 1].id;
                    }
                    var count = maxPlayers - players.length;
                    $("info").textContent = "Waiting for " + count + " more player" + (count === 1 ? "" : "s") + "...";
                    break;
                    
                case "state":
                    this.turn = (message.turnId === this.id);
                    if (typeof this.onstatechange === "function") {
                        this.onstatechange(message.state);
                    }
                    if (!gameOver) {
                        if (this.turn) {
                            $("info").textContent = "It's your turn!";
                        } else {
                            $("info").textContent = "Please wait... It's player " + (message.turnId + 1) + "'s turn";
                        }
                    }
                    break;
            }
        };
    }
    
    next(state) {
        if (!this.turn) return;
        this.turn = false;
        const turnId = (this.id + 1) % this.playerCount;
        this.server.broadcast({
            type: "state",
            turnId: turnId,
            state: state,
        });
        $("info").textContent = "Please wait... It's player " + (turnId + 1) + "'s turn";
    }
}
