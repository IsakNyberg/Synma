/**
 * @class MidiKeybaord - it's used to create the connection to the midi keyboard and set funcionallity when pressing the keys on the keyboard 
*/
class MidiKeybaord {

	#synth;
	#piano;

	constructor(synth, piano) {
		this.#synth = synth;
		this.#piano = piano;
		this.setup();
	}

	/**
	 * this function will incase a connection could not be established with midi keyboard will log the error
	 * @param {String} msg 
	 */
	#failure (msg) {
		console.error('No access to your midi devices. - ', msg);
	}

	/**
	 * this function will be run when we have a established to the connection with the midi keyboard and set our custom funciton to be run when we press a key 
	 * @param {MIDIAccess} midi 
	 */
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

	/**
	 * this funciton will check if the webbrowser support the web midi api
	 * @returns {Boolean}
	 */
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

	/**
	 * setup function check access and establish a midi conneciton if possible 
	 */
	setup() {
		let hasMidiAccess = this.#checkMidiAccess();
		// this is done this way becuase otherwise this is undefined in these functions
		var fn1 = (midi) => this.#successNAssignKeys(midi);
		var fn2 = (msg) => this.#failure(msg);
		//console.log(this.#synth, this.#piano);
		if (hasMidiAccess) {
			navigator.requestMIDIAccess().then(fn1, fn2);
		} 
	}
	
	setSynth(synth){
		console.log(synth);
		this.#synth = synth;		
	}
	

	setPiano(piano) {
		console.log(piano);
		this.#piano = piano;
	}

}

/**
 * this function will be run on each key on the midi keyboard and here we call the code to play the 
 * correct node and set the piano key color
 * @param {Array} message 
 * @param {Synth} synth 
 * @param {Piano} piano 
 */
function onMIDIMessage (message, synth, piano) {
	
	if ((message.data[0] === 144 || message.data[0] === 153) && message.data[2] > 0) {
		let index = message.data[1];
		//console.log(index);
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
