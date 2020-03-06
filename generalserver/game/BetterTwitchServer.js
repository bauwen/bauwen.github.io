class BetterTwitchServer {
    constructor(channel, username, password) {
        this.server = new TwitchServer(channel, username, password);
        this.onready = () => {};
        this.onmessage = (message) => {};
        
        this.server.onready = () => {
            if (typeof this.onready === "function") {
                this.onready();
            }
        };
        
        this.server.onmessage = (message) => {
            if (typeof this.onmessage === "function") {
                const compressed = decodeBase1024(message.trim());
                LZMA.decompress(compressed, (decompressed) => {
                    //const json = new TextDecoder("UTF-8").decode(decompressed);
                    const output = JSON.parse(decompressed);
                    this.onmessage(output);
                });
            }
        };
    }
    
    // TODO: rate-limiting
    broadcast(message) {
        if (message === undefined || message === null || typeof message === "function") {
            throw new Error("BetterTwitchServer: invalid broadcast message");
        }
        const json = JSON.stringify(message);
        const utf8 = new TextEncoder("UTF-8").encode(json);
        LZMA.compress(utf8, 9, (compressed) => {
            const base1024 = encodeBase1024(compressed);
            if (base1024.length > 500) {
                throw new Error("BetterTwitchServer: resulting broadcast message is larger than 500 characters!");
            }
            this.server.broadcast(base1024);
        });
    }
}