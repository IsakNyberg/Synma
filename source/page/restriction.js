class Restriction {
	#func;
	#max;
	#min;
	#subdivision = 2048;
	#values = [];

	/**
	 * @param {function} func
	 * @param {Number} max
	 * @param {Number} min
	 */
	constructor(func, max, min) {
		this.func = func;
		this.max = max;
		this.min = min;
	}

	/**
	 * @returns {function}
	 */
	get func() {
		return this.#func;
	}

	/**
	 * @returns {Number}
	 */
	get length() {
		return Math.abs(this.max - this.min);
	}

	/**
	 * @returns {Number}
	 */
	get max() {
		return this.#max;
	}

	/**
	 * @returns {Number}
	 */
	get min() {
		return this.#min;
	}

	/**
	 * @returns {Number}
	 */
	get subdivision() {
		return this.#subdivision;
	}

	/**
	 * @returns {Array<Number>}
	 */
	get values() {
		return this.getValues(this.#subdivision);
	}

	/**
	 * @param {function} func
	 */
	set func(func) {
		this.#func = func;
		this.#values = [];
	}

	/**
	 * @param {Number} value
	 */
	set max(value) {
		this.#max = value;
		this.#values = [];
	}

	/**
	 * @param {Number} value
	 */
	set min(value) {
		this.#min = value;
		this.#values = [];
	}

	/**
	 * @param {Number} value
	 */
	set subdivision(value) {
		if (1 <= value) this.#subdivision = Math.floor(value);
	}

	/**
	 * Issue: Does not update cached values when changing properties.
	 * @param {Number} subdivision
	 * @returns {Array<Number>}
	 */
	getValues(subdivision) {
		let values = this.#values;
		if (values.length != subdivision) {
			values = [];
			if (0 < subdivision) {
				let func = this.#func;
				let step = this.length / subdivision;
				let x = this.#min;
				
				for (let i = 0; i < subdivision; i++) {
					values[i] = func(x);
					x += step;
				}
			}
			this.#values = values;
		}
		return values;
	}
}
