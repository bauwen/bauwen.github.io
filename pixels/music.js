var synth = new Tone.FMSynth().toMaster()

//schedule a series of notes to play as soon as the page loads

var t = "8n";
var s = t;

for (var i = 0; i < 15; i++) {
    synth.triggerAttackRelease('C4', '4n', s); s += " + " + t;
    synth.triggerAttackRelease('E4', '8n', s); s += " + " + t;
    synth.triggerAttackRelease('G4', '16n', s); s += " + " + t;
    synth.triggerAttackRelease('B4', '16n', s); s += " + " + t;
    synth.triggerAttackRelease('G4', '16', s); s += " + " + t;
    synth.triggerAttackRelease('E4', '2n', s); s += " + " + t;
}