class InputSource {
	#callback;
	#destination;
	#eventTarget;
	/**
	 * @param {Function} callback
	 * @param {Synth} destination
	 * @param {EventTarget} eventTarget
	 */
	constructor(callback, destination, eventTarget) {
		this.callback = callback;
		this.destination = destination;
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
	 * @param {String} type
	 */
	listen(type, callback) {
		this.eventTarget.addEventListener(type, callback);
	}
}
