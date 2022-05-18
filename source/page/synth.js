class Synth {
	#context = null;
	#envelopeParser = null;
	#envelopes = {
		'filter': new Envelope(
			new Restriction((t) => 10_000 * 10 * t, 0.1, 0),
			new Restriction((t) => 10_000, 0.001, 0),
			new Restriction((t) => 10_000 * (1 - 10 * t), 0.1, 0)
		),
		'pitch': new Envelope(
			new Restriction((t) => 0, 0.001, 0),
			new Restriction((t) => 0, 0.001, 0),
			new Restriction((t) => 0, 0.001, 0)
		),
		'volume': new Envelope(
			new Restriction((t) => 10 * t, 0.1, 0),
			new Restriction((t) => 1, 0.001, 0),
			new Restriction((t) => 1 - 10 * t, 0.1, 0)
		)
	};
	#parser = null;
	#piano = null;
	#renderer = null;
	#waveform = new Waveform(new Restriction((x) => x, 1, 0));
	#waveformParser = null;

	/**
	 * @param {AudioContext} context
	 * @param {Map<String, Envelope>} envelopes
	 * @param {Waveform} waveform
	 */
	constructor(context/*, envelopes, waveform*/) {
		//this.envelopes = envelopes;
		//this.waveform = waveform;

		this.#envelopeParser = new MathParser('t');
		this.#piano = new Piano(this);
		this.#renderer = new Renderer(context, this.envelopes, this.waveform);
		this.#waveformParser = new MathParser('x');
	}

	/**
	 * @returns {AudioContext}
	 */
	get context() {
		return this.#context;
	}

	/**
	 * @returns {Map<String, Envelopes>}
	 */
	get envelopes() {
		return this.#envelopes;
	}

	/**
	 * @returns {Piano}
	 */
	get piano() {
		return this.#piano;
	}

	/**
	 * @returns {Waveform}
	 */
	get waveform() {
		return this.#waveform;
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
		for (const type in envelopes) {
			let envelope = envelopes[type];

			if (this.#envelopes[type] != undefined) {
				this.#envelopes[type] = envelope;
			}
		}
	}

	/**
	 * @param {Waveform} waveform
	 */
	set waveform(waveform) {
		this.#waveform = waveform;
	}

	/**
	 * @param {File} file 
	 */
	playFile(file) {
		let renderer = this.#renderer;
		let fileSplit = file.name.split(".")
		let fileExtension = fileSplit[fileSplit.length-1];
		if (fileExtension === "mid") {
			renderer.renderMIDI(URL.createObjectURL(file));
		} /*else if (fileExtension === "synth") {
				const reader = new FileReader();
				reader.addEventListener("load", () => {
					let parsed = JSON.parse(reader.result);
					this.recordResult = parsed;
					let playButtonElement = document.getElementById("playButton");
					this.player(playButtonElement);
				}, false);
				reader.readAsText(file);
		}*/ else alert("Invalid file extention: " + fileExtension);
	}

	/**
	 * @param {Note} note
	 */
	playNote(note) {
		this.#renderer.render(note);
	}

	/**
	 * @param {Envelope} envelope
	 * @param {String} type
	 */
	setEnvelope(envelope, type) {
		if (this.envelopes[type] != undefined) {
			this.#envelopes[type] = envelope;
		}
	}

	/**
	 * @param {Note} note
	 */
	stopNote(note) {
		this.#renderer.release(note);
	}
}
