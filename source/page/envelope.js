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
	 * @param {Number} time
	 */	
	findPoint(time) {
		console.log("time: ", time);
		let attack = this.attack;
		let decay = this.decay;
		let sustain = decay.func(decay.length);
		console.log("sustain: ", sustain);

		let f = (t) => {
			if (t < 0) attack.func(0);
			else if (t < attack.length) attack.func(t);
			else if (t < decay.length) decay.func(t);
			else sustain;
		};


		console.log("f(time): ", f(time));
		return f(time);
	}

	/**
	 * @param {Number} point - The point of release on the envelope curve.
	 * @returns {Array<Number>} - The release curve with respect to the
	 * release point.
	 */
	computeRelease(point) {
		/* Load necessary variables. */
		let decay = this.decay.values;
		let release = this.release;
		let releasePoints = release.values;
		console.log("release:", release, "points:", releasePoints);

		/* Set sustain to decay endpoint. */
		let sustain = decay[decay.length - 1];

		/* Set point of origin to release endpoint. */
		let origo = releasePoints[releasePoints.length - 1];
		
		/* Compute values in terms of the origin. */
		point -= origo;
		sustain -= origo;
		let rise = releasePoints[0] - origo;
		let offset = sustain - point;
		let scaling = (rise != 0) ? (1 + offset / rise) : 1;

		/* Scale the release function. */
		let points = [];
		for (let i = 0; i < releasePoints.length; i++) {
			points[i] = scaling * (releasePoints[i] - origo);
		}

		return points;
	}
}
