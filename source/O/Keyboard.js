class Keyboard extends InputSource {
	#keys = [];
	/**
	 * @param {EventTarget} eventTarget
	 * @param {Array<String>} keys
	 */
	constructor(eventTarget, keys) {
		let callback = (event) => Keyboard.#listen(this, event);
		super(callback, eventTarget);
		for (const key of keys) this.addKey(key);
		this.eventTarget.addEventListener('keydown', this.callback);
		this.eventTarget.addEventListener('keyup', this.callback);
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
	static #listen(object, event) {
		/**
		 * @type {Keyboard} object
		 */
		let synth = object.destination;
		let key = event.code;
		let index = object.getIndex(key);
		if (index == -1) return;
		let state = event.type == 'keydown';
		let value = new InputValue(index, state);
		object.setValue(index, value);
		console.log(value);

		/* temp */
		let offset = 64;
		index += offset;
		if (state) synth.startNote(index);
		else synth.stopNote(index);
	}
}
