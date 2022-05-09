class Midi {

	synth;
	piano;

	constructor(synth, piano) {
		this.synth = synth;
		this.piano = piano;
	 
		this.setup();
		console.log(this.synth);
		console.log(this.piano);
	}

	#failure (msg) {
		console.error('No access to your midi devices. - ', msg);
	}

	#successNAssignKeys(midi) {
		//checking that we have excatly one midi connected
		if (midi.inputs.size == 1) {
			console.log('Got midi!', midi);
			console.log(this.synth);
			// this is an iterator object
			var inputs = midi.inputs.values();
			//console.log(inputs.next());
			//console.log(this.synth);

			for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
				// each time there is a midi message call the onMIDIMessage function
				//console.log(this.synth);
				input.value.onmidimessage = (arg) => onMIDIMessage(arg, this.synth, this.piano);
				
			}
		}
	}


	#checkMidiAccess() {
		if (navigator.requestMIDIAccess) {
			console.log('This browser supports WebMIDI!');
			return true;
		} else {
			console.log('WebMIDI is not supported in this browser.' );
			//alert('WebMIDI is not supported in this browser.');
			return false;
		}
	}

	setup() {
		let hasMidiAccess = this.#checkMidiAccess();
		if (hasMidiAccess) {
			navigator.requestMIDIAccess().then(this.#successNAssignKeys, this.#failure);
		} 
	}

}

function onMIDIMessage (message, synth, piano) {
	console.log("synth inside onMIDIMessage: " + synth);
	if ((message.data[0] === 144 || message.data[0] === 153) && message.data[2] > 0) {
		let index = message.data[1];
		console.log("pressed following key index: " + index);
		//console.log()
		//piano.setKeyColor(index, "darkgrey");
		//synth.startNote(index);
		//this.#piano.setKeyColor(keyIndexToNote(message.data[1] + 3), "darkgrey");
		//this.#synth.startNote(keyIndexToNote(message.data[1] + 3));
	}

	 // piano key is released
	if ((message.data[0] === 128 || message.data[0] === 153) ||  message.data[2] === 0) {
		let index = message.data[1];
		console.log("released following key index: " + index);
		//piano.resetKeyColor(index);
		//synth.stopNote(index);
		//this.#piano.resetKeyColor(keyIndexToNote(message.data[1] + 3));
		//this.#synth.stopNote(keyIndexToNote(message.data[1] + 3));
	}
}

//const midi = new Midi();
//midi.setupMidi();
