class Note {
	#frequency = 440.00;
	#start = 0;
	#duration = Infinity;

	/**
	 * @param {Number} frequency
	 * @param {Number} start
	 * @param {Number} duration
	 */
	constructor(frequency, start, duration) {
		this.frequency = frequency;
		this.start = start;
		this.duration = duration;
	}

	/**
	 * @returns {Number}
	 */
	get frequency() {
		return this.#frequency;
	}

	/**
	 * @returns {Number}
	 */
	get start() {
		return this.#start;
	}

	/**
	 * @returns {Number}
	 */
	get duration() {
		return this.#duration;
	}

	/**
	 * @param {Number} hertz
	 */
	set frequency(hertz) {
		if (hertz != undefined) this.#frequency = hertz;
	}

	/**
	 * @param {Number} seconds
	 */
	set start(seconds) {
		if (seconds != undefined) this.#start = seconds;
	}

	/**
	 * @param {Number} seconds
	 */
	set duration(seconds) {
		if (seconds != undefined) this.#duration = seconds;
	}
}
