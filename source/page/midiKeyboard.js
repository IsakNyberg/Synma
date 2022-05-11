class MidiKeybaord {

	#synth;
	#piano;

	constructor(synth, piano) {
		this.#synth = synth;
		this.#piano = piano;
		this.setup();
	}

	#failure (msg) {
		console.error('No access to your midi devices. - ', msg);
	}

	#successNAssignKeys(midi) {
		//checking that we have excatly one midi connected
		if (midi.inputs.size == 1) {
			// this is an iterator object
			var inputs = midi.inputs.values();
			for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
				// each time there is a midi message call the onMIDIMessage function
				input.value.onmidimessage = (arg) => onMIDIMessage(arg, this.#synth, this.#piano);
			}
		}
	}


	#checkMidiAccess() {
		if (navigator.requestMIDIAccess) {
			console.info('This browser supports WebMIDI!');
			return true;
		} else {
			console.error('WebMIDI is not supported in this browser.' );
			//alert('WebMIDI is not supported in this browser.');
			return false;
		}
	}

	setup() {
		let hasMidiAccess = this.#checkMidiAccess();
		// this is done this way becuase otherwise this is undefined in these functions
		var fn1 = (midi) => this.#successNAssignKeys(midi);
		var fn2 = (msg) => this.#failure(msg);
		if (hasMidiAccess) {
			navigator.requestMIDIAccess().then(fn1, fn2);
		} 
	}

}

function onMIDIMessage (message, synth, piano) {
	if ((message.data[0] === 144 || message.data[0] === 153) && message.data[2] > 0) {
		let index = message.data[1];
		piano.setKeyColor(index, "darkgrey");
		synth.startNote(index);
	}

	 // piano key is released
	if ((message.data[0] === 128 || message.data[0] === 153) ||  message.data[2] === 0) {
		let index = message.data[1];
		piano.resetKeyColor(index);
		synth.stopNote(index);
	}
}
