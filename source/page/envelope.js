class Envelope {
	#parameters = {
		'attack': null,
		'decay': null,
		'release': null
	};

	/**
	 * @param {Restriction} attack
	 * @param {Restriction} decay
	 * @param {Restriction} release
	 */
	constructor(attack, decay, release) {
		this.attack = attack;
		this.decay = decay;
		this.release = release;
	}

	/**
	 * @returns {Restriction}
	 */
	get attack() {
		return this.#parameters['attack'];
	}

	/**
	 * @returns {Restriction}
	 */
	get decay() {
		return this.#parameters['decay'];
	}

	/**
	 * @returns {Restriction}
	 */
	get release() {
		return this.#parameters['release'];
	}

	/**
	 * @param {Restriction} restriction
	 */
	set attack(restriction) {
		this.#parameters['attack'] = restriction;
	}

	/**
	 * @param {Restriction} restriction
	 */
	set decay(restriction) {
		this.#parameters['decay'] = restriction;
	}

	/**
	 * @param {Restriction} restriction
	 */
	set release(restriction) {
		this.#parameters['release'] = restriction;
	}
}
