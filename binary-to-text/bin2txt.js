// Binary-to-text encodings implementation
// Supported bases: 2, 4, 8, 16, 32, 64, 128, 256, 512 and 1024

// API:
// encodeBase(base, byteArray) -> string
// decodeBase(base, string) -> byteArray

// Note: all characters used are considered to be of length 1 by Twitter
// Thus, for bases 512 and 1024, more than 280 bytes can be encoded in a tweet

var encodeBase;
var decodeBase;

(function () {
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ÆÐØÞßæðøþĐđĦħıĸŁłŊŋŒœŦŧƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƢƣƤƥƦƧƨƩƪƫƬƭƮƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǝǤǥǶǷȜȝȠȡȢȣȤȥȴȵȶȷȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯͰͱͲͳͶͷͻͼͽͿΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρςστυφχψωϏϗϘϙϚϛϜϝϞϟϠϡϢϣϤϥϦϧϨϩϪϫϬϭϮϯϳϷϸϺϻϼϽϾϿЂЄЅІЈЉЊЋЏАБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзиклмнопрстуфхцчшщъыьэюяђєѕіјљњћџѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѸѹѺѻѼѽѾѿҀҁҊҋҌҍҎҏҐґҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥҦҧҨҩҪҫҬҭҮүҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿӀӃӄӅӆӇӈӉӊӋӌӍӎӏӔӕӘәӠӡӨөӶӷӺӻӼӽӾӿԀԁԂԃԄԅԆԇԈԉԊԋԌԍԎԏԐԑԒԓԔԕԖԗԘԙԚԛԜԝԞԟԠԡԢԣԤԥԦԧԨԩԪԫԬԭԮԯԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖաբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցւփքօֆऄअआइईउऊऋऌऍऎएऐऑऒओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलळवशषसहऽॐॠॡ०१२३४५६७८९ॲॳॴॵॶॷॸॹॺॻॼॽॾॿঀঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহঽৎৠৡ০১২৩৪৫৬৭৮৯ৰৱ৴৵৶৷৸৹ਅਆਇਈਉਊਏਐਓਔਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਵਸਹੜ੦੧੨੩੪੫੬੭੮੯ੲੳੴઅઆઇઈઉઊઋઌઍએઐઑઓઔકખગઘઙચછજઝઞટઠડઢણતથદધનપફબભમયરલળવશષસહઽૐૠૡ૦૧૨૩૪૫૬૭૮૯ଅଆଇଈଉଊଋଌଏଐଓଔକଖଗଘଙଚଛଜଝଞଟଠଡଢଣତଥଦଧନପଫବଭମଯରଲଳଵଶଷସହଽୟୠୡ୦୧୨୩୪୫୬୭୮";
    
    encodeBase = function (base, bytes) {
        if (typeof base !== "number" || base <= 1 || 1024 < base) {
            throw new Error(`encodeBase: expected a number between 2 and 1024 (inclusive) as first argument`);
        }
        if (!(bytes instanceof Uint8Array)) {
            if (!Array.isArray(bytes)) {
                throw new Error(`encodeBase: expected an array as second argument`);
            }
            bytes = new Uint8Array(bytes);
        }
        
        var bitsPerDigit = Math.ceil(Math.log(base) / Math.log(2));
        var text = "";
        var value = 0;
        var count = 0;
        
        for (var i = 0; i < bytes.length; i++) {
            var bits = bytes[i];
            for (var j = 7; j >= 0; j--) {
                var bit = (bits >> j) & 1;
                value = (value << 1) + bit;
                count += 1;
                
                if (count === bitsPerDigit) {
                    text += characters[value];
                    value = 0;
                    count = 0;
                }
            }
        }
        
        if (count > 0) {
            text += characters[value << (bitsPerDigit - count)];  // pad with zeros
        }
        
        return text;
    };

    decodeBase = function (base, text) {
        if (typeof base !== "number" || base <= 1 || 1024 < base) {
            throw new Error(`decodeBase: expected a number between 2 and 1024 (inclusive) as first argument`);
        }
        if (typeof text !== "string") {
            throw new Error(`decodeBase: expected a string as second argument`);
        }
        
        var bitsPerDigit = Math.ceil(Math.log(base) / Math.log(2));
        var bytes = new Uint8Array(Math.floor(bitsPerDigit * text.length / 8));
        var index = 0;
        var value = 0;
        var count = 0;
        
        for (var i = 0; i < text.length; i++) {
            var character = text.charAt(i);
            var bits = characters.indexOf(character);
            if (bits < 0) {
                throw new Error(`Found an invalid character: ${character}`);
            }
            
            for (var j = bitsPerDigit - 1; j >= 0; j--) {
                var bit = (bits >> j) & 1;
                value = (value << 1) + bit;
                count += 1;
                
                if (count === 8) {
                    bytes[index] = value;
                    index += 1;
                    value = 0;
                    count = 0;
                }
            }
        }
        
        return bytes;
    };
})();
