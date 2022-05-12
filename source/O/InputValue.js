class InputValue {
	#index;
	#state; // true = on | false = off
	/**
	 * @param {Number} index
	 * @param {Boolean} state
	 */
	constructor(index, state) {
		this.index = index;
		this.state = state;
	}
	/**
	 * @returns {Number}
	 */
	get index() {
		return this.#index;
	}
	/**
	 * @returns {Boolean}
	 */
	get state() {
		return this.#state;
	}
	/**
	 * @param {Number} index
	 */
	set index(index) {
		this.#index = index;
	}
	/**
	 * @param {Boolean} state
	 */
	set state(state) {
		this.#state = state;
	}
}
