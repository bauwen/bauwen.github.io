var synth = new Tone.PolySynth(8).toMaster()

MidiConvert.load("audio/song.mid", function(midi) {

  // make sure you set the tempo before you schedule the events
  console.log(midi.tracks.length);
  Tone.Transport.bpm.value = midi.header.bpm

  for (var i = 0; i < midi.tracks.length; i++) {
      // pass in the note events from one of the tracks as the second argument to Tone.Part 
      var midiPart = new Tone.Part(function(time, note) {

        //use the events to play the synth
        synth.triggerAttackRelease(note.name, note.duration, time, note.velocity)

      }, midi.tracks[i].notes).start()
  }

  // start the transport to hear the events
  Tone.Transport.start()
});
