class Restriction {
	#cacheFlag = true;
	#func;
	#max;
	#min;
	#subdivision = 1024;
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
		this.#setCacheFlag();
	}

	/**
	 * @param {Number} value
	 */
	set max(value) {
		this.#max = value;
		this.#setCacheFlag();
	}

	/**
	 * @param {Number} value
	 */
	set min(value) {
		this.#min = value;
		this.#setCacheFlag();
	}

	/**
	 * @param {Number} value
	 */
	set subdivision(value) {
		if (1 <= value) {
			this.#subdivision = Math.floor(value);
			this.#setCacheFlag();
		}
	}

	#clearCacheFlag() {
		this.#cacheFlag = false;
	}

	/**
	 * @param {Number} subdivision
	 * @returns {Array<Number>}
	 */
	getValues(subdivision) {
		let values = this.#values;

		if (this.#cacheFlag) {
			let func = this.func;
			let step = this.length / subdivision;
			let x = this.min;
			
			values = [];
			
			for (let i = 0; i < subdivision; i++) {
				values[i] = func(x);
				x += step;
			}
			
			this.#values = values;
			this.#clearCacheFlag();
		}

		return values;
	}

	#setCacheFlag() {
		this.#cacheFlag = true;
	}
}
