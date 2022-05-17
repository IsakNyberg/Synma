class Voice {
	#destination;
	#envelopes;
	#filter;
	#gain; // volume before processing
	#note;
	#parameters;
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
		this.#parameters = {
			'filter': this.filterFrequency,
			'pitch': this.detune,
			'volume': this.gain
		};
		this.pitch = pitch;

		/**
		 * A new source (AudioBufferSourceNode) must be connected to this chain,
		 * for every start.
		 */
		this.#connect([gain, filter, volume, destination]);

		//this.applyEnvelopes(envelopes);
	}

	/**
	 * @returns {AudioBufferSourceNode}
	 */
	get buffer() {
		return this.#source.buffer;
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
	 * @returns {Note}
	 */
	get note() {
		return this.#note;
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
	 * @param {Note} note
	 */
	set note(note) {
		this.#note = note;
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
	 * @param {Map<Envelope>} envelopes
	 */
	#applyEnvelopes(envelopes) {
		let context = this.#destination.context;
		let note = this.#note;

		let time = context.currentTime;
		let start = time + note.start;
		let duration = time + note.duration;

		for (const type in envelopes) {
			let envelope = envelopes[type];
			let parameter = this.parameter(type);
			envelope.applyEnvelope(parameter, start, duration);
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
	 * @returns {AudioBufferSourceNode}
	 */
	#createSource() {
		return this.#destination.context.createBufferSource();
	}

	/**
	 * @param {String} type
	 * @returns {AudioParam}
	 */
	parameter(type) {
		return this.#parameters[type];
	}

	#reset() {
		let buffer = this.buffer;
		let context = this.#destination.context;
		let note = this.#note;
		let pitch = note.pitch;

		this.#source = context.createBufferSource();

		this.buffer = buffer;
		this.pitch = pitch;
	}

	start() {
		let note = this.#note;
		let destination = this.#destination;
		let envelopes = this.#envelopes;
		let source = this.#source;
		
		let context = destination.context;
		let duration = note.duration;
		let releaseTime = this.#envelopes['volume'].releaseLen;

		let time = context.currentTime;
		let when = time + note.start;

		source.loop = true;
		this.#applyEnvelopes(envelopes);
		this.#connect([source, destination]);

		if (duration === (Infinity || undefined)) source.start(when);
		else source.start(when, 0, duration + releaseTime);
	}

	stop() {
		let envelopes = this.#envelopes;
		let note = this.#note;
		let source = this.#source;

		let context = source.context;
		let time = context.currentTime;
		let start = time + note.start;
		let duration = envelopes['volume'].releaseLen;

		for (const type in envelopes) {
			let envelope = envelopes[type];
			let parameter = this.parameter(type);

			parameter.cancelScheduledValues(time);
			envelope.applyEnvelope(parameter, start, duration);
		}

		source.stop(time + duration);
		this.#reset();
	}
}
