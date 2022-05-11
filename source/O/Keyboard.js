class Keyboard extends InputSource {
	#keys = [];
	/**
	 * @param {EventTarget} eventTarget
	 * @param {Array<String>} keys
	 */
	constructor(eventTarget, keys) {
		super(Keyboard.#listen, eventTarget);
		for (const key of keys) this.addKey(key);
		this.eventTarget.addEventListener('keydown', Keyboard.#listen);
		this.eventTarget.addEventListener('keyup', Keyboard.#listen);
		this.eventTarget.object = this;
	}
	/**
	* @returns {Array<String>}
	*/
	get keys() {
		return this.#keys;
	}
	/**
	 * @param {String} key
	 */
	addKey(key) {
		this.keys.push(key);
	}
	/**
	 * @param {String} key
	 */
	getIndex(key) {
		return this.keys.indexOf(key);
	}
	/**
	 * @param {KeyboardEvent} event
	 */
	static #listen(event) {
		/**
		 * @type {Keyboard} object
		 */
		let object = event.currentTarget.object;
		let synth = object.destination;
		let key = event.code;
		let index = object.getIndex(key);
		if (index == -1) return;
		let state = event.type == 'keydown';
		let strength = 1;
		let value = new Input(index, state, strength);
		object.setValue(index, value);
		console.log(value);

		/* temp */
		let offset = 64;
		index += offset;
		if (state) synth.startNote(index);
		else synth.stopNote(index);
	}
}
