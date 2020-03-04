// API:
// encodeBase85(byteArray) -> string
// decodeBase85(string) -> byteArray

var encodeBase85;
var decodeBase85;

(function () {
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!$'()*,-./:;<>[]^_`{|}~";  // absent: \ " @ # % + = & ?

    encodeBase85 = function (bytes) {
        if (!(bytes instanceof Uint8Array)) {
            if (!Array.isArray(bytes)) {
                throw new Error(`encodeBase85: expected an array as argument`);
            }
            bytes = new Uint8Array(bytes);
        }
        
        var rest = bytes.length % 4;
        var text = "";
        
        for (var i = 0; i < bytes.length - 3; i += 4) {
            var number = 0;
            for (var j = 0; j < 4; j++) {
                number = number * 256 + bytes[i + j];
            }
            for (var j = 0; j < 5; j++) {
                var digit = Math.floor(number / Math.pow(85, 4 - j)) % 85;
                text += characters.charAt(digit);
            }
        }
        
        if (rest > 0) {
            var number = 0;
            for (var j = 0; j < rest; j++) {
                number = number * 256 + bytes[bytes.length - rest + j];
            }
            for (var j = rest; j < 4; j++) {
                number = number * 256 + 0;
            }
            for (var j = 0; j < rest + 1; j++) {
                var digit = Math.floor(number / Math.pow(85, 4 - j)) % 85;
                text += characters.charAt(digit);
            }
        }
        
        return text;
    };

    decodeBase85 = function (text) {
        if (typeof text !== "string") {
            throw new Error(`decodeBase85: expected a string as argument`);
        }
        
        var rest = text.length % 5;
        if (rest === 1) {
            throw new Error(`decodeBase85: invalid length, expected at least one more character`);
        }
        
        var bytes = new Uint8Array(Math.floor(text.length / 5) * 4 + (rest > 1 ? rest - 1 : 0));
        var index = 0;
        var limit = Math.pow(2, 32) - 1;
        
        for (var i = 0; i < text.length - 4; i += 5) {
            var number = 0;
            for (var j = 0; j < 5; j++) {
                var character = text.charAt(i + j);
                var digit = characters.indexOf(character);
                if (digit < 0) {
                    throw new Error(`decodeBase85: found an invalid character: ${character}`);
                }
                number = number * 85 + digit;
            }
            if (number > limit) {
                throw new Error(`decodeBase85: invalid character group: ${text.slice(i, i + 5)}`);
            }
            for (var j = 0; j < 4; j++) {
                bytes[index] = (number >> (3 - j) * 8) & 255;
                index += 1;
            }
        }
        
        if (rest > 1) {
            var number = 0;
            for (var j = 0; j < rest; j++) {
                var character = text.charAt(text.length - rest + j);
                var digit = characters.indexOf(character);
                if (digit < 0) {
                    throw new Error(`decodeBase85: found an invalid character: ${character}`);
                }
                number = number * 85 + digit;
            }
            for (var j = rest; j < 5; j++) {
                number = number * 85 + 84;
            }
            if (number > limit) {
                throw new Error(`decodeBase85: invalid character group: ${text.slice(i, i + rest)}`);
            }
            for (var j = 0; j < rest - 1; j++) {
                bytes[index] = (number >> (3 - j) * 8) & 255;
                index += 1;
            }
        }
        
        return bytes;
    };
})();
