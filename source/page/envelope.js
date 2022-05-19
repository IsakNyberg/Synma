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

	/**
	 * @param {Number} point - The point of release on the envelope curve.
	 */
	computeRelease(point) {
		let decay = this.decay.values;
		let sustain = decay[decay.length - 1];
		let release = this.release.values;
		let start = release[0];
		let end = release[release.length - 1];
		let rise = end - start;
		let run = this.release.length;
		let slope = 
		
		let ratio = ;
		let offset = end - ratio;
	}
}
