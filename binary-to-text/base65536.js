// API:
// encodeBase65536(byteArray) -> string
// decodeBase65536(string) -> byteArray

var encodeBase65536;
var decodeBase65536;

(function () {
    var characterRanges = [ ["一", "鿕"], ["𠀀", "𪛖"], ["𪜀", "𪹒"] ];  // length 65536
    var paddingRange = ["𪹓", "𪽒"].map(c => c.codePointAt(0));  // length 256
    
    var codePointRanges = characterRanges.map(r => r.map(c => c.codePointAt(0)));
    var indexRanges = [];
    indexRanges.push([0, codePointRanges[0][1] - codePointRanges[0][0]]);
    indexRanges.push([indexRanges[0][1] + 1, codePointRanges[1][1] - codePointRanges[1][0]]);
    indexRanges.push([indexRanges[1][0] + indexRanges[1][1] + 1, codePointRanges[2][1] - codePointRanges[2][0]]);
    
    var encodeDigit = function (index) {
        for (var i = 0; i < indexRanges.length; i++) {
            var from = indexRanges[i][0];
            var to = from + indexRanges[i][1];
            if (from <= index && index <= to) {
                return String.fromCodePoint(codePointRanges[i][0] + index - from);
            }
        }
        return "[ERROR]";
    };
    
    var decodeDigit = function (character) {
        var codePoint = character.codePointAt(0);
        for (var i = 0; i < codePointRanges.length; i++) {
            var from = codePointRanges[i][0];
            var to = codePointRanges[i][1];
            if (from <= codePoint && codePoint <= to) {
                return indexRanges[i][0] + codePoint - from;
            }
        }
        return -1;
    };
    
    var isPadding = function (character) {
        var codePoint = character.codePointAt(0);
        return paddingRange[0] <= codePoint && codePoint <= paddingRange[1];
    };
    
    var encodePadding = function (index) {
        return String.fromCodePoint(paddingRange[0] + index);
    };
    
    var decodePadding = function (character) {
        return character.codePointAt(0) - paddingRange[0];
    };
    
    encodeBase65536 = function (bytes) {
        if (!(bytes instanceof Uint8Array)) {
            if (!Array.isArray(bytes)) {
                throw new Error(`encodeBase65536: expected an array as second argument`);
            }
            bytes = new Uint8Array(bytes);
        }
        
        var text = "";
        
        for (var i = 0; i < bytes.length - 1; i += 2) {
            text += encodeDigit((bytes[i] << 8) + bytes[i + 1]);
        }
        
        if (bytes.length % 2 === 1) {
            text += encodePadding(bytes[bytes.length - 1]);
        }
        
        return text;
    };

    decodeBase65536 = function (text) {
        if (typeof text !== "string") {
            throw new Error(`decodeBase65536: expected a string as second argument`);
        }
        
        var characters = Array.from(text);
        var last = characters[characters.length - 1];
        var padded = isPadding(last);
        var bytes = new Uint8Array(2 * characters.length - (padded ? 1 : 0));
        var index = 0;
        
        for (var i = 0; i < characters.length - 1; i++) {
            var character = characters[i];
            var bits = decodeDigit(character);
            if (bits < 0) {
                throw new Error(`Found an invalid character: ${character}`);
            }
            bytes[index] = (bits >> 8) & 0xFF;
            bytes[index + 1] = bits & 0xFF;
            index += 2;
        }
        
        if (padded) {
            bytes[index] = decodePadding(last);
        } else {
            var bits = decodeDigit(last);
            if (bits < 0) {
                throw new Error(`Found an invalid character: ${last}`);
            }
            bytes[index] = (bits >> 8) & 0xFF;
            bytes[index + 1] = bits & 0xFF;
        }
        
        return bytes;
    };
})();
