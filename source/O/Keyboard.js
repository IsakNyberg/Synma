class Keyboard extends InputSource {
	#offset = 0;
	#keys = [];
	/**
	 * @param {EventTarget} eventTarget
	 * @param {Synth} destination
	 * @param {Array<String>} keys
	 */
	constructor(eventTarget, destination, keys, controls) {
		super(callback, destination, eventTarget);
		for (const key of keys) this.addKey(key);
		this.#controls = controls;
		this.listen('keydown', (e) => Keyboard.press(this, e));
		this.listen('keyup', (e) => Keyboard.release(this, e));
	}
	/**W
	* @returns {Array<String>}
	*/
	get keys() {
		return this.#keys;
	}
	/**
	 * @returns {Number}
	 */
	get offset() {
		return this.#offset;
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
	octaveDown() {
		if (0 <= this.offset) this.#offset--;
	}
	octaveUp() {
		if (this.offset < 10) this.#offset++;
	}
	/**
	 * @param {Keyboard} object
	 * @param {KeyboardEvent} event
	 */
	static press(object, event) {
		let synth = object.destination;
		let key = event.code;
		switch (key) {
			case 'ArrowLeft':
				synth.octaveDown();
				break;
			case 'ArrowRight':
				synth.octaveUp();
				break;
			default: {
				let index = object.getIndex(key);
				if (index != -1) synth.startNote(index);
			}
		}
	}
	/**
	 * @param {Keyboard} object
	 * @param {KeyboardEvent} event
	 */
	static release(object, event) {
		let synth = object.destination;
		let key = event.code;
		let index = object.getIndex(key);
		if (index != -1) synth.stopNote(index);
	}
}
