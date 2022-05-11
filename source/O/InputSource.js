class InputSource {
	#callback;
	#destination;
	#eventTarget;
	#values = [];
	/**
	 * @param {Function} callback
	 * @param {EventTarget} eventTarget
	 */
	constructor(callback, eventTarget) {
		this.callback = callback;
		this.eventTarget = eventTarget;
	}
	/**
	 * @returns {Function}
	 */
	 get callback() {
		return this.#callback;
	}
	/**
	 * @returns {Synth}
	 */
	get destination() {
		return this.#destination;
	}
	/**
	 * @returns {EventTarget}
	 */
	get eventTarget() {
		return this.#eventTarget;
	}
	/**
	 * @returns {Array<Input>}
	 */
	get values() {
		return this.#values;
	}
	/**
	 * @param {Function} callback
	 */
	set callback(callback) {
		this.#callback = callback;
	}
	/**
	 * @param {Synth} destination
	 */
	set destination(destination) {
		this.#destination = destination;
	}
	/**
	 * @param {EventTarget} eventTarget
	 */
	set eventTarget(eventTarget) {
		this.#eventTarget = eventTarget;
	}
	/**
	 * @param {Synth} destination
	 */
	connect(destination) {
		//destination.addInput(this);
		this.destination = destination;
	}
	/**
	 * @param {Number} index
	 * @param {Input} value
	 */
	setValue(index, value) {
		this.#values[index] = value;
	}
}
