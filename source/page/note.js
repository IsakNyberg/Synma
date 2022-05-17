class Note {
	#duration = Infinity;
	#frequency = 440.00;
	#start = 0;

	/**
	 * @param {Number} frequency
	 * @param {Number} duration
	 * @param {Number} start
	 */
	constructor(frequency, duration, start) {
		this.duration = duration;
		this.frequency = frequency;
		this.start = start;
	}

	/**
	 * @returns {Number}
	 */
	get duration() {
		return this.#duration;
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
	 * @param {Number} seconds
	 */
	 set duration(seconds) {
		if (seconds != undefined) this.#duration = seconds;
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
}
