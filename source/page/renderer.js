class Renderer {
	#buffer;
	#context;
	#envelopes;
	#voices = {};

	/**
	 * @param {AudioContext} context
	 * @param {Map<String, Envelopes>} envelopes
	 * @param {Waveform} waveform
	 */
	constructor(context, envelopes, waveform) {
		this.#context = context;
		this.#envelopes = envelopes;

		this.buffer = waveform;
	}

	/**
	 * @returns {AudioBuffer}
	 */
	get buffer() {
		return this.#buffer;
	}

	/**
	 * @returns {Number}
	 */
	get channels() {
		return this.#context.destination.channelCount;
	}

	/**
	 * @returns {AudioContext}
	 */
	get context() {
		return this.#context;
	}

	/**
	 * @returns {Map<String, Envelope>}
	 */
	get envelopes() {
		return this.#envelopes;
	}

	/**
	 * @returns {Number}
	 */
	get sampleRate() {
		return this.#context.sampleRate;
	}

	/**
	 * @param {AudioContext} context
	 */
	set context(context) {
		this.#context = context;
	}

	/**
	 * @param {Map<String, Envelope>} envelopes
	 */
	set envelopes(envelopes) {
		this.#envelopes = envelopes;
	}

	/**
	 * @param {Waveform} waveform
	 */
	set buffer(waveform) {
		this.#buffer = this.#writeBuffer(waveform.values);
	}

	/**
	 * @param {Note} note
	 */
	release(note) {
		let voice = this.#voices[note];

		if (voice != undefined) {
			voice.stop();
			this.#voices[note] = undefined;
		}
	}

	/**
	 * @param {Note} note
	 */
	render(note) {
		let buffer = this.#buffer;
		let context = this.#context;
		let envelopes = this.#envelopes;

		let voice = new Voice(buffer, context, envelopes, note);

		voice.gain = 0.1;
		voice.start();
		this.#voices[note] = voice;
	}

	/**
	 * @param {Array<Number>} waveform
	 * @returns {AudioBuffer}
	 */
	#writeBuffer(waveform) {
		let context = this.context;
		let channels = this.channels;
		let sampleRate = this.sampleRate;

		let samples = waveform.length;
		let buffer = context.createBuffer(channels, samples, sampleRate);

		for (let channel = 0; channel < channels; channel++) {
			let data = buffer.getChannelData(channel);

			for (let i = 0; i < data.length; i++) data[i] = waveform[i];
		}

		return buffer;
	}
}
