class Renderer {
	#buffer;
	#context;
	#envelopes;
	#voices = new Map();
	#record;
	#recordResult;

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
		let voice = this.#voices.get(note);

		if(this.#record != null){
			this.#record.stop(note, this.#context.currentTime)
		}
		
		if (voice != undefined) {
			voice.stop();
			this.#voices[note] = undefined;
		}

		//console.log("Releasin' ", voice);
	}
	
	/**
	 * @param {URL} url 
	 */
	async renderMIDI(url) {
		const midi = await Midi.fromUrl(url);
		midi.tracks.forEach(track => {
			const notes = track.notes;
			notes.forEach(note => {
				this.render(new Note(
					noteFreq[note.midi],
					note.duration,
					note.time));
			})
		})
	}

	recorder(recordButtonElement, playButtonElement, downloadButtonElement){
		if(recordButtonElement.value == "Record" && playButtonElement.value != "Playing"){
			this.#record = new record();
			this.#record.startRec(this.#context.currentTime);
			recordButtonElement.value = "Stop";
			playButtonElement.style.display	= "none";
			downloadButtonElement.style.display	= "none";
		}
		else if(recordButtonElement.value == "Stop"){
			this.#recordResult = this.#record.stopRec();
			recordButtonElement.value = "Record";
			playButtonElement.value = "Play";
			playButtonElement.style.display	= "inline";
			this.#record.createDownloadFile(this.#recordResult, "Beatiful_song.synth");
			this.#record = null;
			downloadButtonElement.style.display	= "inline";
		}
		document.activeElement.blur();
	}

	player(playButtonElement){
		if(playButtonElement.value == "Play again" || playButtonElement.value == "Play"){
			var playTime = 0;
			this.#recordResult.forEach(element => {
				console.log(element[0], element[2], element[1])
				let note = new Note(element[0], element[1], 0, element[2])
				//note.start += this.context.currentTime;
				//console.log(note.recordTime);
				
				note.start = note.recordTime;
				console.log("Rendering: ", note);
				this.render(note);
				playTime = Math.max(playTime, element[1] + element[2])
			});
			playButtonElement.value = "Playing";
			document.activeElement.blur();
			setTimeout(() => {playButtonElement.value = "Play again";}, playTime*1000);
		}
	}

	/**x
	 * @param {Note} note
	 */
	render(note) {
		let buffer = this.#buffer;
		let context = this.#context;
		let envelopes = this.#envelopes;

		let currentTime = context.currentTime;

		if (this.#record != null) this.#record.start(note, currentTime);
		
		//note.time += currentTime;
		let voice = new Voice(buffer, context, envelopes, note);
		
		voice.gain = 0.1;
		voice.start();
		if (note.duration === Infinity) this.#voices.set(note, voice);
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
