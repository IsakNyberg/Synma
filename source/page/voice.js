class Voice {
	#destination;
	#envelopes;
	#filter;
	#gain; // volume before processing
	#note;
	#source;
	#volume; // volume after processing

	/**
	 * @param {AudioContext} context
	 * @param {Map<Envelope>} envelopes
	 * @param {Note} note
	 * @param {AudioBuffer} buffer
	 */
	constructor(buffer, context, envelopes, note) {
		let destination = context.destination;
		let filter = context.createBiquadFilter();
		let gain = context.createGain();
		let pitch = note.frequency;
		let source = context.createBufferSource();
		let volume = context.createGain();

		this.#destination = destination;
		this.#envelopes = envelopes;
		this.#filter = filter;
		this.#gain = gain;
		this.#note = note;
		this.#source = source;
		this.#volume = volume;

		this.buffer = buffer;
		this.pitch = pitch;

		//console.log("Don't forget to reconnect the audio nodes in the voice constructor!");
		this.#connect([source, gain,/* filter, volume, */destination]);

		//this.applyEnvelopes(envelopes);
	}

	/**
	 * @returns {AudioParam}
	 */
	get detune() {
		return this.#source.detune;
	}

	/**
	 * @returns {String}
	 */
	get filter() {
		return this.#filter.type;
	}

	/**
	 * @returns {AudioParam}
	 */
	get filterFrequency() {
		return this.#filter.frequency;
	}

	/**
	 * @returns {AudioParam}
	 */
	get gain() {
		return this.#gain.gain;
	}

	/**
	 * @returns {AudioParam}
	 */
	get volume() {
		return this.#volume.gain;
	}

	/**
	 * @returns {Number}
	 */
	get pitch() {
		return this.#note.frequency;
	}

	/**
	 * @param {AudioBuffer} buffer
	 */
	set buffer(buffer) {
		this.#source.buffer = buffer;
	}

	/**
	 * @param {Number} cents
	 */
	set detune(cents) {
		this.#source.detune.value = cents;
	}

	/**
	 * @param {String} type
	 */
	set filter(type) {
		this.#filter.type = type;
	}

	/**
	 * @param {Number} value
	 */
	set gain(value) {
		this.#gain.gain.value = value;
	}

	/**
	 * @param {Number} value
	 */
	set volume(value) {
		this.#volume.gain.value = value;
	}

	/**
	 * @param {Number} hertz
	 */
	set pitch(hertz) {
		this.#note.pitch = hertz;
		this.#source.playbackRate.value = this.#computePlaybackRate(hertz);
	}

	/**
	 * @param {String} type
	 * @param {Restriction} restriction
	 * @param {Number} time - to start, in seconds, in the same time coordinate
	 * system as its audio context.
	*/
	applyEnvelope(type, restriction, time) {
		if (time != Infinity && time != undefined) {
			let values = restriction.values;
			let parameter = this.getParameter(type);
			let step = restriction.length / values.length;

			for (const value of values) {
				parameter.setValueAtTime(value, time);
				time += step;
			}
		}
	}

	/**
	 * @param {Map<Envelope>} envelopes
	 */
	applyEnvelopes(envelopes) {
		let time = this.#source.context.currentTime;

		let note = this.#note;
		let start = time + note.start;
		let duration = note.duration;

		for (const type in envelopes) {
			let envelope = envelopes[type];
			let attack = envelope.attack;
			let decay = envelope.decay;
			let release = envelope.release;
			let restriction = [attack, decay, release];
			let time = [start, start + attack.length, start + duration];

			for (let i = 0; i < restriction.length; i++) {
				this.applyEnvelope(type, restriction[i], time[i]);
			}
		}
	}

	/**
	 * @param {Number} hertz
	 * @returns {Number}
	 */
	#computePlaybackRate(hertz) {
		let source = this.#source;
		let samples = source.buffer.length;
		let sampleRate = source.context.sampleRate;

		return hertz * samples / sampleRate;
	}

	/**
	 * @param {Array<AudioNode>} path
	 */
	#connect(path) {
		path.reduce((a, b) => a.connect(b));
	}

	/**
	 * @param {String} type
	 * @returns {AudioParam}
	 */
	getParameter(type) {
		switch (type) {
			case 'filter': return this.filterFrequency;
			case 'pitch': return this.detune;
			case 'volume': return this.#volume.gain;
			default: return undefined;
		}
	}

	start() {
		let note = this.#note;
		let source = this.#source;

		let context = source.context;
		let duration = note.duration;
		let release = this.#envelopes['volume'].release.length;
		
		source.loop = true;

		let time = context.currentTime;
		let when = time + note.start;

		if (duration === (Infinity || undefined)) source.start(when);
		else source.start(when, 0, duration + release);
	}

	stop() {
		let envelopes = this.#envelopes;
		let source = this.#source;

		let context = source.context;
		let time = context.currentTime;

		for (const type in envelopes) {
			let envelope = envelopes[type];
			let parameter = this.getParameter(type);

			parameter.cancelScheduledValues(time);
			this.applyEnvelope(type, envelope.release, time);
		}

		let release = envelopes['volume'].release.length;

		source.stop(time/* + release*/);
	}
}
