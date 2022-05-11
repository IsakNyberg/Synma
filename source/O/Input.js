class Input {
	#index;
	#state; // true = on | false = off
	#strength;
	/**
	 * @param {Number} index
	 * @param {Boolean} state
	 * @param {Number} strength
	 */
	constructor(index, state, strength) {
		this.index = index;
		this.state = state;
		this.strength = strength;
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
	 * @returns {Number}
	 */
	get strength() {
		return this.#strength;
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
	/**
	 * @param {Number} strength
	 */
	set strength(strength) {
		this.#strength = strength;
	}
}
