class TwitchServer {
    constructor(channel, username, password) {
        this.username = username;
        this.onready = () => {};
        this.onmessage = (message) => {};
        this.websocket = new WebSocket("wss://irc-ws.chat.twitch.tv:443/");
        
        this.websocket.onmessage = (event) => {
            let message = event.data;
            
            if (message.trim().startsWith("PING")) {
                this.websocket.send("PONG");
            }
            else if (typeof this.onmessage === "function") {
                const index = message.indexOf("PRIVMSG");
                if (index >= 0) {
                    message = message.slice(index);
                    this.onmessage(message.slice(message.indexOf(":") + 1));
                }
            }
        };

        this.websocket.onopen = () => {
            this.websocket.send("PASS oauth:" + password);
            this.websocket.send("NICK " + username);
            setTimeout(() => {
                this.websocket.send("JOIN #" + channel);
                if (typeof this.onready === "function") {
                    this.onready();
                }
            }, 500);
        };
    }
    
    broadcast(message) {
        if (typeof message === "string") {
            this.websocket.send("PRIVMSG #" + this.username + " :" + message);
        }
    }
}
