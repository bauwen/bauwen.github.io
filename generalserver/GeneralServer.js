class GeneralServer {
    constructor(username) {
        this.username = username || "generalserver";
        this.password = "xi4jzd5jkk7ph5spkxbb32ug9bbz7r";
        
        this.websocket = null;
        this.started = false;
        
        this.onmessage = () => {};
    }
    
    start() {
        if (this.started) {
            return;
        }
        this.started = true;
        
        this.websocket = new WebSocket("wss://irc-ws.chat.twitch.tv:443/");
        
        this.websocket.onmessage = (event) => {
            var message = event.data;
            
            if (message.trim().startsWith("PING")) {
                this.websocket.send("PONG");
            }
            else if (typeof this.onmessage === "function") {
                var index = message.indexOf("PRIVMSG");
                if (index >= 0) {
                    message = message.slice(index);
                    this.onmessage(message.slice(message.indexOf(":") + 1));
                }
            }
        };

        this.websocket.onopen = () => {
            this.websocket.send("PASS oauth:" + this.password);
            this.websocket.send("NICK " + this.username);
            
            setTimeout(() => {
                this.websocket.send("JOIN #" + this.username);
            }, 500);
        };
    }
    
    send(message) {
        if (typeof message === "string") {
            this.websocket.send("PRIVMSG #" + this.username + " :" + message);
        }
    }
}
