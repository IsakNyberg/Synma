let noteFreq = initFreqs();
class Synth {
	static serial = 0;
	serial;
	audioContext = null;
	masterVolume;
	maxVolume = 1;
	waveFunction;
	envFunctions = {
		"amplitude" : {
			"attack" : [()=>1,"1",0.1], "decay" : [()=>1,"1",0.1], "release" : [()=>1/2,"1/2",0.1]
		}, "pitch" : {
			"attack" : [()=>0,"0",0.1], "decay" : [()=>0,"0",0.1], "release" : [()=>0,"0",0.1]
		}, "filter" : {
			"attack" : [()=>1/2,"1/2",0.1], "decay" : [()=>1/2,"1/2",0.1], "release" : [()=>1/2,"1/2",0.1]
		}
	};
	releaseLen;
	ampEnvelope;
	envSamples = 100;
	pitchEnvelope;
	filterEnvelope;
	baseNote;
	waveforms;
	maxX;
	piano;
	waveParser;
	envelopeParser;
	activeKeys;
	envelopeGraph=false;
	waveGraph = false;
	record = null;
	recordResult = [];
	graphIsNormalized = false;
	envIsNormalized = {"amplitude" : [false,false], "pitch" : [false,false], "filter" : [false,false]};
	activeEnvelopes = [true,true,true];
	pianoIsActive = false;
  	constructor(urlPresets,waveGraphCanvas,envelopeGraphCanvas){
		this.serial = ++Synth.serial;
		this.waveGraphCanvas = waveGraphCanvas;
		this.envelopeGraphCanvas = envelopeGraphCanvas;
		this.waveParser = new MathParser("x");
		this.envelopeParser = new MathParser("t");
		this.waveforms = [];
		this.activeKeys = new Array(60);
		for (var i = 0; i < this.activeKeys.length; ++i) { this.activeKeys[i] = false; }
		this.createPiano();  
		if(urlPresets[3] != undefined && urlPresets[3].length > 0){
			var types = ["amplitude", "filter", "pitch"];
			var adr = ["attack", "decay", "release"];
			for(let i=0; i<3; i++){
				for(let j=0; j<3; j++){
					this.envFunctions[types[i]][adr[j]][0] = this.envelopeParser.parse(urlPresets[3][i][0+j]);
					this.envFunctions[types[i]][adr[j]][1] = urlPresets[3][i][0+j]
					this.envFunctions[types[i]][adr[j]][2] = urlPresets[3][i][3+j]
				}
				this.envIsNormalized[types[i]] = [urlPresets[3][i][6], urlPresets[3][i][7]]
			}
			this.setWave(urlPresets[0],urlPresets[2],urlPresets[1]);
			this.createEnvelopes();
			//this.dropdownClick();
		}
		//this.dropdownClick();
	}

	togglePiano(){
		if(this.pianoIsActive)
			this.piano.removeEventListeners();
		else
			this.piano.addEventListeners();
		this.pianoIsActive = !this.pianoIsActive;
	}

	/**
	 * Set the base soundwave according to a math-expression
	 * @param {String} expr 
	 */
	setWave(fnString,normalized,maxXInput){
		document.activeElement.blur();
		this.audioContext = new AudioContext(); 
		this.masterVolume = this.audioContext.createGain();
		this.waveFunction = this.waveParser.parse(fnString);
		this.graphIsNormalized = normalized;
		let value = this.waveParser.parse(maxXInput);
		this.maxX = value(0);
		this.createEnvelopes();
		this.createBase();
		this.createWaveforms();
		this.graphWave();
		this.piano.slideInPiano();
		
	}
	//***********************************************************************************************************************
	/**
	 * Creates a base-note whose playback-rate will be altered to create notes of different frequencies.
	 */
	createBase(){
		let resolution = this.audioContext.sampleRate / noteFreq[0];
		this.baseNote = WaveForm.computeBase(this.audioContext, this.waveFunction, this.maxX, resolution);
	}
	/**
	 * Create WaveForm instances for all possible notes on a standard midi-controller.
	 */
	createWaveforms(){ 
		this.waveforms = [];
		for (let i = 0; i < 128; i++) {
			this.waveforms.push(new WaveForm(this.audioContext,this.baseNote, this.masterVolume));
		}
	}
	/**
	 * Get and the input:ed function for the currently specified envelope-type and timezone.
	 */
	setEnvelopes(envelopString, envelopMaxT,fnString, timeString, normalized, continuous){
		document.activeElement.blur();
		let parsedMaxT = parseFloat(timeString);
		this.envFunctions[envelopString][envelopMaxT] = [this.envelopeParser.parse(fnString),fnString, parsedMaxT];
		this.envIsNormalized[envelopString][0] = normalized;
		this.envIsNormalized[envelopString][1] = continuous;
		this.createEnvelopes();
		this.graphEnvelope(envelopString);
	}
	/**
	 * Creates envelope instances from the currently (class property) specified envelopes.
	 */
	createEnvelopes(){
		this.releaseLen = this.envFunctions["amplitude"]["release"][2];
		this.ampEnvelope = new AmpEnvelope(
			this.envFunctions["amplitude"]["attack"][0],
			this.envFunctions["amplitude"]["decay"][0],
			this.envFunctions["amplitude"]["release"][0],
			this.envSamples,
			this.envFunctions["amplitude"]["attack"][2],
			this.envFunctions["amplitude"]["decay"][2],
			this.envFunctions["amplitude"]["release"][2],
			this.audioContext,
			this.envIsNormalized["amplitude"][0],
			this.envIsNormalized["amplitude"][1]
		);
		this.pitchEnvelope = new PitchEnvelope(
			this.envFunctions["pitch"]["attack"][0],
			this.envFunctions["pitch"]["decay"][0],
			this.envFunctions["pitch"]["release"][0],
			this.envSamples,
			this.envFunctions["pitch"]["attack"][2],
			this.envFunctions["pitch"]["decay"][2],
			this.envFunctions["pitch"]["release"][2],
			this.audioContext,
			this.envIsNormalized["pitch"][0],
			this.envIsNormalized["pitch"][1]
		);
		this.filterEnvelope = new FilterEnvelope(
			this.envFunctions["filter"]["attack"][0],
			this.envFunctions["filter"]["decay"][0],
			this.envFunctions["filter"]["release"][0],
			this.envSamples,
			this.envFunctions["filter"]["attack"][2],
			this.envFunctions["filter"]["decay"][2],
			this.envFunctions["filter"]["release"][2],
			this.audioContext,
			this.envIsNormalized["filter"][0],
			this.envIsNormalized["filter"][1]
		);
		
	}

	/**
	 * Creates an instance of the Piano class
	 */
	createPiano(){
		this.piano = new Piano(this,true);
		this.pianoIsActive = true;
	}
	/**
	 * Applies all the envelopes (attack and decay) on the specified waveform.
	 * @param {WaveForm} wf 
	 */
	applyEnvelopesAD(wf){		
		if(this.activeEnvelopes[0]){
			this.ampEnvelope.apply_attack(wf.bufferGain);
			this.ampEnvelope.apply_decay(wf.bufferGain);
		}
		if(this.activeEnvelopes[1])
		{
			this.pitchEnvelope.apply_attack(wf.masterSource);
			this.pitchEnvelope.apply_decay(wf.masterSource);
		}
		if(this.activeEnvelopes[2]){
			this.filterEnvelope.apply_attack(wf.bufferBiquadFilter);
			this.filterEnvelope.apply_decay(wf.bufferBiquadFilter);
		}
	}
	/**
	 * Applied all envelopes release on specified waveform.
	 * @param {WaveForm} wf 
	 */
	applyEnvelopesR(wf){
		if(this.activeEnvelopes[0])
			this.ampEnvelope.apply_release(wf.bufferGain);
		if(this.activeEnvelopes[1])
			this.pitchEnvelope.apply_release(wf.masterSource);
		if(this.activeEnvelopes[2])
			this.filterEnvelope.apply_release(wf.bufferBiquadFilter);
	}
	/**
	 * Start playing the specified note (midi key-index).
	 * @param {Number} keyIndex 
	 * @returns {void}
	 */
	startNote(keyIndex){
		if (this.activeKeys[keyIndex]) {
			return;
		}
		if(this.record != null){
			this.record.startedIndex(keyIndex, this.audioContext.currentTime)
		}
		this.activeKeys[keyIndex] = true;
		let wf = this.waveforms[keyIndex];
		if (wf === undefined) return;
		if(this.graphIsNormalized) wf.normalizeBuffer();
		wf.createMasterSource(noteFreq[keyIndex]);
		this.applyEnvelopesAD(wf);
		wf.playBuffer();
	}
	
	/**
	 * Recieves a keystroke and it's properties to then queue it in the buffer
	 * @param {Int} keyIndex 
	 * @param {Float} time 
	 * @param {Float} duration 
	 */
	/*
	playNoteTimeDuration(keyIndex, time, duration) {
		let wf = this.waveforms[keyIndex];
		let freq = noteFreq[keyIndex];
		setTimeout(()=>this.piano.setKeyColor(keyIndex, "#cf1518"), time*1000);
		setTimeout(()=>this.piano.resetKeyColor(keyIndex), (time+duration)*1000);
		wf.playBufferAt(freq, time, duration);
	}*/
	playFile(file) {
		let fileSplit = file.name.split(".")
		let fileExtentaiton = fileSplit[fileSplit.length-1];
		if (fileExtentaiton === "mid") {
			this.playMidi(URL.createObjectURL(file))
		} else if (fileExtentaiton === "synth") {
				const reader = new FileReader();
				reader.addEventListener("load", () => {
					let parsed = JSON.parse(reader.result);
					this.recordResult = parsed;
					let playButtonElement = document.getElementById("playButton");
					this.player(playButtonElement);
				}, false);
				reader.readAsText(file);
		} else {
			alert("Invalid file extention: " + fileExtentaiton);
		}
	}
	async playMidi(url) {
		const midi = await Midi.fromUrl(url);
		midi.tracks.forEach(track => {
			const notes = track.notes;
			notes.forEach(note => {
				this.playNoteTimeDuration(note.midi, note.time, note.duration);
			})
		})
	}
	/**
	 * Recieves a keystroke and it's properties to then queue it in the buffer
	 * @param {Int} keyIndex 
	 * @param {Float} time 
	 * @param {Float} duration 
	 */
	playNoteTimeDuration(keyIndex, time, duration) {
		let wf = this.waveforms[keyIndex];
		wf.createMasterSource(noteFreq[keyIndex]);
		setTimeout(()=> {
			this.startNote(keyIndex);
			this.piano.setKeyColor(keyIndex, "#cf1518")
		}, time*1000);
		setTimeout(()=> {
			this.stopNote(keyIndex);
			this.piano.resetKeyColor(keyIndex)
		}, (time+duration)*1000);
		//wf.playBufferAt(time, duration);
	}
	/**
	 * Stop playing the specified note (midi key-index).
	 * @param {Number} keyIndex 
	 * @returns {void}
	 */
	stopNote(keyIndex){
		if (!this.activeKeys[keyIndex]) {
			return;
		}
		if(this.record != null){
			this.record.stoppedIndex(keyIndex, this.audioContext.currentTime)
		}
		this.activeKeys[keyIndex] = false;
		this.applyEnvelopesR(this.waveforms[keyIndex]);
		if (this.activeEnvelopes[0]) {
			this.waveforms[keyIndex].stopBuffer(this.releaseLen);
		}else {
			this.waveforms[keyIndex].stopBuffer(0);
		}
		
	}
	/**
	 * Sets the master volume (all audionodes leads to masterGain)
	 * @param {Number} vol 
	 * @returns 
	 */
	setMasterVolume(vol){
		document.activeElement.blur();
		if(this.masterVolume == undefined) return;
		this.masterVolume.gain.value = Math.min(Math.abs(vol)/100,Math.abs(this.maxVolume));
	}
	/**
	 * Graphs the current wave function in the html canvas element with id "waveformGraph".
	 */
	graphWave(){
		if (this.waveGraph) this.waveGraph.destroy();
		this.waveGraph = drawGraph(this.waveGraphCanvas, this.waveFunction, 100, this.maxX, this.graphIsNormalized, '#aa1129');
	}
	/**
	 * Graphs the current envelope of specified type in the html canvas element with id "envelopeGraph".
	 * @param {String} type 
	 */
	graphEnvelope(type){
		if (this.envelopeGraph) this.envelopeGraph.destroy();
		let funs = [this.envFunctions[type]["attack"][0], this.envFunctions[type]["decay"][0], this.envFunctions[type]["release"][0]];
		let times = [
			this.envFunctions[type]["attack"][2], 
			this.envFunctions[type]["attack"][2] + this.envFunctions[type]["decay"][2], 
			this.envFunctions[type]["attack"][2] + this.envFunctions[type]["decay"][2] + this.envFunctions[type]["release"][2]
		]
		var yLimits = [0, 1];
		if(type == "pitch"){
			yLimits = [];
		}
		
		this.envelopeGraph = drawEnvelope(this.envelopeGraphCanvas, funs, 100, times, [this.envIsNormalized[type][0], this.envIsNormalized[type][1]], ['#830','#d93','#387'],yLimits);
	}
	recorder(recordButtonElement, playButtonElement, downloadButtonElement){
		if(recordButtonElement.value == "Record" && playButtonElement.value != "Playing"){
			this.record = new record();
			this.record.startRec(this.audioContext.currentTime);
			recordButtonElement.value = "Stop";
			playButtonElement.style.display	= "none";
			downloadButtonElement.style.display	= "none";
		}
		else if(recordButtonElement.value == "Stop"){
			this.recordResult = this.record.stopRec();
			recordButtonElement.value = "Record";
			playButtonElement.value = "Play";
			playButtonElement.style.display	= "inline";
			this.record.createDownloadFile(this.recordResult, "Beatiful_song.synth");
			downloadButtonElement.style.display	= "inline";
		}
		document.activeElement.blur();
	}
	player(playButtonElement){
		if(playButtonElement.value == "Play again" || playButtonElement.value == "Play"){
			var playTime = 0;
			this.recordResult.forEach(element => {
				this.playNoteTimeDuration(element[0], element[1], element[2]);
				playTime = Math.max(playTime, element[1] + element[2])
			});
			playButtonElement.value = "Playing";
			document.activeElement.blur();
			setTimeout(() => {playButtonElement.value = "Play again";}, playTime*1000);
		}
	}
	/**
	 * Calls function in URL.js with the current settings as arguments
	 */
	saveSettings(){
		saveSettings(this.envFunctions, this.envIsNormalized);
	}

}
