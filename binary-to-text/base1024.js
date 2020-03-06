// API:
// encodeBase1024(byteArray) -> string
// decodeBase1024(string) -> byteArray

var encodeBase1024;
var decodeBase1024;

(function () {
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ÆÐØÞßæðøþĐđĦħıĸŁłŊŋŒœŦŧƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƢƣƤƥƦƧƨƩƪƫƬƭƮƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǝǤǥǶǷȜȝȠȡȢȣȤȥȴȵȶȷȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯͰͱͲͳͶͷͻͼͽͿΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρςστυφχψωϏϗϘϙϚϛϜϝϞϟϠϡϢϣϤϥϦϧϨϩϪϫϬϭϮϯϳϷϸϺϻϼϽϾϿЂЄЅІЈЉЊЋЏАБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзиклмнопрстуфхцчшщъыьэюяђєѕіјљњћџѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѸѹѺѻѼѽѾѿҀҁҊҋҌҍҎҏҐґҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥҦҧҨҩҪҫҬҭҮүҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿӀӃӄӅӆӇӈӉӊӋӌӍӎӏӔӕӘәӠӡӨөӶӷӺӻӼӽӾӿԀԁԂԃԄԅԆԇԈԉԊԋԌԍԎԏԐԑԒԓԔԕԖԗԘԙԚԛԜԝԞԟԠԡԢԣԤԥԦԧԨԩԪԫԬԭԮԯԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖաբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցւփքօֆऄअआइईउऊऋऌऍऎएऐऑऒओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलळवशषसहऽॐॠॡ०१२३४५६७८९ॲॳॴॵॶॷॸॹॺॻॼॽॾॿঀঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহঽৎৠৡ০১২৩৪৫৬৭৮৯ৰৱ৴৵৶৷৸৹ਅਆਇਈਉਊਏਐਓਔਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਵਸਹੜ੦੧੨੩੪੫੬੭੮੯ੲੳੴઅઆઇઈઉઊઋઌઍએઐઑઓઔકખગઘઙચછજઝઞટઠડઢણતથદધનપફબભમયરલળવશષસહઽૐૠૡ૦૧૨૩૪૫૬૭૮૯ଅଆଇଈଉଊଋଌଏଐଓଔକଖଗଘଙଚଛଜଝଞଟଠଡଢଣତଥଦଧନପଫବଭମଯରଲଳଵଶଷସହଽୟୠୡ୦୧୨୩୪୫୬୭୮";
    var paddingCharacters = "=$&*";
    
    encodeBase1024 = function (bytes) {
        if (!(bytes instanceof Uint8Array)) {
            if (!Array.isArray(bytes)) {
                throw new Error(`encodeBase: expected an array as argument`);
            }
            bytes = new Uint8Array(bytes);
        }
        
        var text = "";
        var value = 0;
        var count = 0;
        
        for (var i = 0; i < bytes.length; i++) {
            var bits = bytes[i];
            for (var j = 7; j >= 0; j--) {
                var bit = (bits >> j) & 1;
                value = (value << 1) + bit;
                count += 1;
                
                if (count === 10) {
                    text += characters[value];
                    value = 0;
                    count = 0;
                }
            }
        }
        
        // special cases
        if (count > 0) {
            if (count <= 2) {
                text += paddingCharacters[value << (2 - count)];  // use padding characters
            } else {
                text += characters[value << (10 - count)];  // pad with zeros
            }
        }
        
        return text;
    };

    decodeBase1024 = function (text) {
        if (typeof text !== "string") {
            throw new Error(`decodeBase: expected a string as argument`);
        }
        
        var padding = paddingCharacters.indexOf(text.charAt(text.length - 1));
        var padded = padding >= 0;
        var bytes = new Uint8Array(Math.floor(10 * text.length / 8) - (padded ? 1 : 0));
        var index = 0;
        var value = 0;
        var count = 0;
        
        for (var i = 0; i < text.length; i++) {
            if (padded && i === text.length - 1) {
                for (var j = 1; j >= 0; j--) {
                    var bit = (padding >> j) & 1;
                    value = (value << 1) + bit;
                    count += 1;
                    
                    if (count === 8) {
                        bytes[index] = value;
                        index += 1;
                        value = 0;
                        count = 0;
                        break;
                    }
                }
                continue;
            }
            
            var character = text.charAt(i);
            var bits = characters.indexOf(character);
            if (bits < 0) {
                throw new Error(`Found an invalid character: ${character}`);
            }
            
            for (var j = 9; j >= 0; j--) {
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
