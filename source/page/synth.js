let noteFreq = initFreqs();
class Synth {
	#audioContext = null;
	#masterVolume;
	#maxVolume = 1;
	#waveFunction;
	#envFunctions = {
		"amplitude" : {
			"attack" : [()=>1,"1",0.1], "decay" : [()=>1,"1",0.1], "release" : [()=>1/2,"1/2",0.1]
		}, "pitch" : {
			"attack" : [()=>0,"0",0.1], "decay" : [()=>0,"0",0.1], "release" : [()=>0,"0",0.1]
		}, "filter" : {
			"attack" : [()=>1/2,"1/2",0.1], "decay" : [()=>1/2,"1/2",0.1], "release" : [()=>1/2,"1/2",0.1]
		}
	};
	#releaseLen;
	#ampEnvelope;
	#envSamples = 100;
	#pitchEnvelope;
	#filterEnvelope;
	#baseNote;
	#waveforms;
	#maxX;
	piano;
	#waveParser;
	#envelopeParser;
	activeKeys;
	#envelopeGraph=false;
	#waveGraph = false;
	#record = null;
	#recordResult = [];
	#graphIsNormalized = false;
	#envIsNormalized = {"amplitude" : [false,false], "pitch" : [false,false], "filter" : [false,false]};
	#activeEnvelopes = [true,true,true];
	constructor(){
		this.#waveforms = [];
		this.activeKeys = new Array(60);
		for (var i = 0; i < this.activeKeys.length; ++i) { this.activeKeys[i] = false; }
		this.#waveParser = new MathParser("x");
		this.#envelopeParser = new MathParser("t");
		this.#addEventListeners();
		this.#createPiano();  
	}

	/**
	 * Set the base soundwave according to a math-expression
	 * @param {String} expr 
	 */
	#setWave(){
		document.activeElement.blur();
		this.#audioContext = new AudioContext(); 
		this.#masterVolume = this.#audioContext.createGain();
		this.#waveFunction = this.#waveParser.parse(document.getElementById("functionInput").value);
		this.#graphIsNormalized = document.getElementById("normalizeCheckbox").checked;
		this.#maxX = parseFloat(document.getElementById("maxXInput").value);
		this.#createEnvelopes();
		this.#createBase();
		this.#createWaveforms();
		this.#graphWave();
		this.piano.slideInPiano();
	}
	//***********************************************************************************************************************
	/**
	 * Creates a base-note whose playback-rate will be altered to create notes of different frequencies.
	 */
	#createBase(){
		let resolution = this.#audioContext.sampleRate / noteFreq[0];
		this.#baseNote = WaveForm.computeBase(this.#audioContext, this.#waveFunction, this.#maxX, resolution);
	}
	/**
	 * Create WaveForm instances for all possible notes on a standard midi-controller.
	 */
	#createWaveforms(){ 
		this.#waveforms = [];
		for (let i = 0; i < 128; i++) {
			this.#waveforms.push(new WaveForm(this.#audioContext,this.#baseNote, this.#masterVolume));
		}
	}
	/**
	 * Get and the input:ed function for the currently specified envelope-type and timezone.
	 */

	#getEnvelopes(){
		document.activeElement.blur();
		let envelopString = document.getElementById("chosenEnvelope").innerHTML.toLowerCase();
		let envelopMaxT = document.getElementById("chosenTimezone").innerHTML.toLowerCase();
		let fnString = document.getElementById("env-functionInput").value;
		let timeString = document.getElementById("env-timeInput").value;
		let parsedMaxT = parseFloat(timeString);
		this.#envFunctions[envelopString][envelopMaxT] = [this.#envelopeParser.parse(fnString),fnString, parsedMaxT];
		this.#envIsNormalized[envelopString][0] = document.getElementById("normalizeEnvelope").checked;
		this.#envIsNormalized[envelopString][1] = document.getElementById("continuousCheckbox").checked;
		this.#createEnvelopes();
		this.#graphEnvelope(envelopString);
	}
	/**
	 * Creates envelope instances from the currently (class property) specified envelopes.
	 */
	#createEnvelopes(){
		this.#releaseLen = this.#envFunctions["amplitude"]["release"][2];
		this.#ampEnvelope = new AmpEnvelope(
			this.#envFunctions["amplitude"]["attack"][0],
			this.#envFunctions["amplitude"]["decay"][0],
			this.#envFunctions["amplitude"]["release"][0],
			this.#envSamples,
			this.#envFunctions["amplitude"]["attack"][2],
			this.#envFunctions["amplitude"]["decay"][2],
			this.#envFunctions["amplitude"]["release"][2],
			this.#audioContext,
			this.#envIsNormalized["amplitude"][0],
			this.#envIsNormalized["amplitude"][1]
		);
		this.#pitchEnvelope = new PitchEnvelope(
			this.#envFunctions["pitch"]["attack"][0],
			this.#envFunctions["pitch"]["decay"][0],
			this.#envFunctions["pitch"]["release"][0],
			this.#envSamples,
			this.#envFunctions["pitch"]["attack"][2],
			this.#envFunctions["pitch"]["decay"][2],
			this.#envFunctions["pitch"]["release"][2],
			this.#audioContext,
			this.#envIsNormalized["pitch"][0],
			this.#envIsNormalized["pitch"][1]
		);
		this.#filterEnvelope = new FilterEnvelope(
			this.#envFunctions["filter"]["attack"][0],
			this.#envFunctions["filter"]["decay"][0],
			this.#envFunctions["filter"]["release"][0],
			this.#envSamples,
			this.#envFunctions["filter"]["attack"][2],
			this.#envFunctions["filter"]["decay"][2],
			this.#envFunctions["filter"]["release"][2],
			this.#audioContext,
			this.#envIsNormalized["filter"][0],
			this.#envIsNormalized["filter"][1]
		);
		
	}

	/**
	 * Creates an instance of the Piano class
	 */
	#createPiano(){
		this.piano = new Piano(this);
	}
	#dropdownClick(){
		var currentType = document.getElementById("chosenEnvelope").innerHTML.toLowerCase();
		var currentTime = document.getElementById("chosenTimezone").innerHTML.toLowerCase();
		document.getElementById("env-functionInput").value = this.#envFunctions[currentType][currentTime][1];
		document.getElementById("env-timeInput").value = this.#envFunctions[currentType][currentTime][2];
		this.#graphEnvelope(currentType);
	}
	/**
	 * Adds event-listeners for submiting functions to the synth.
	 */
	#addEventListeners(){
		document.getElementById("recordButton").onclick = () => this.#recorder();
		document.getElementById("playButton").onclick = () => this.#player();
		document.getElementById("functionButton").onclick = () => this.#setWave();
		document.getElementById("env-functionButton").onclick = () => this.#getEnvelopes();
		document.getElementById("volume").oninput = () => this.#setMasterVolume(document.getElementById("volume").value);
		document.querySelectorAll(".dropdownOption").forEach(
			(element)=> {element.addEventListener("click", ()=> this.#dropdownClick())}
		);
		document.getElementById("midiUpload").addEventListener("change", ()=>{
			this.playMidi(URL.createObjectURL(document.getElementById("midiUpload").files[0]))
		}, false);
	}
	/**
	 * Applies all the envelopes (attack and decay) on the specified waveform.
	 * @param {WaveForm} wf 
	 */
	#applyEnvelopesAD(wf){
		if(this.#activeEnvelopes[0]){
			this.#ampEnvelope.apply_attack(wf.bufferGain);
			this.#ampEnvelope.apply_decay(wf.bufferGain);
		}
		if(this.#activeEnvelopes[1])
		{
			this.#pitchEnvelope.apply_attack(wf.masterSource);
			this.#pitchEnvelope.apply_decay(wf.masterSource);
		}
		if(this.#activeEnvelopes[2]){
			this.#filterEnvelope.apply_attack(wf.bufferBiquadFilter);
			this.#filterEnvelope.apply_decay(wf.bufferBiquadFilter);
		}
	}
	/**
	 * Applied all envelopes release on specified waveform.
	 * @param {WaveForm} wf 
	 */
	#applyEnvelopesR(wf){
		if(this.#activeEnvelopes[0])
			this.#ampEnvelope.apply_release(wf.bufferGain);
		if(this.#activeEnvelopes[1])
			this.#pitchEnvelope.apply_release(wf.masterSource);
		if(this.#activeEnvelopes[2])
			this.#filterEnvelope.apply_release(wf.bufferBiquadFilter);
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
		if(this.#record != null){
			this.#record.startedIndex(keyIndex, this.#audioContext.currentTime)
		}
		this.activeKeys[keyIndex] = true;
		let wf = this.#waveforms[keyIndex];
		if (wf === undefined) return;
		this.#activeEnvelopes = [
			document.getElementById("applyAmplitude").checked,
			document.getElementById("applyPitch").checked,
			document.getElementById("applyFilter").checked
		];
		if(this.#graphIsNormalized) wf.normalizeBuffer();
		wf.createMasterSource(noteFreq[keyIndex]);
		this.#applyEnvelopesAD(wf);
		wf.playBuffer();
	}
	playNoteTimeDuration(keyIndex, time, duration) {
		let wf = this.#waveforms[keyIndex];
		let freq = noteFreq[keyIndex];
		setTimeout(()=>this.piano.setKeyColor(keyIndex, "#cf1518"), time*1000);
		setTimeout(()=>this.piano.resetKeyColor(keyIndex), (time+duration)*1000);
		wf.playBufferAt(freq, time, duration);
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
	playNoteTimeDuration(keyIndex, time, duration) {
		let wf = this.#waveforms[keyIndex];
		wf.createMasterSource(noteFreq[keyIndex]);
		let freq = noteFreq[keyIndex];
		setTimeout(()=>this.piano.setKeyColor(keyIndex, "#cf1518"), time*1000);
		setTimeout(()=>this.piano.resetKeyColor(keyIndex), (time+duration)*1000);
		
		wf.playBufferAt(time, duration);
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
		if(this.#record != null){
			this.#record.stoppedIndex(keyIndex, this.#audioContext.currentTime)
		}
		this.activeKeys[keyIndex] = false;
		this.#applyEnvelopesR(this.#waveforms[keyIndex]);
		if (this.#activeEnvelopes[0]) {
			this.#waveforms[keyIndex].stopBuffer(this.#releaseLen);
		}else {
			this.#waveforms[keyIndex].stopBuffer(0);
		}
		
	}
	/**
	 * Sets the master volume (all audionodes leads to masterGain)
	 * @param {Number} vol 
	 * @returns 
	 */
	#setMasterVolume(vol){
		document.activeElement.blur();
		if(this.#masterVolume == undefined) return;
		this.#masterVolume.gain.value = Math.min(Math.abs(vol)/100,Math.abs(this.#maxVolume));
		console.log("Set master volume to: " + Math.min(Math.abs(vol)/100,Math.abs(this.#maxVolume)));
	}
	/**
	 * Graphs the current wave function in the html canvas element with id "waveformGraph".
	 */
	#graphWave(){
		var ctx = document.getElementById('waveformGraph');
		if (this.#waveGraph) this.#waveGraph.destroy();
		this.#waveGraph = drawGraph(ctx, this.#waveFunction, 100, this.#maxX, this.#graphIsNormalized, 'rgb(0, 0, 0, 1)');
	}
	/**
	 * Graphs the current envelope of specified type in the html canvas element with id "envelopeGraph".
	 * @param {String} type 
	 */
	#graphEnvelope(type){
		var ctx = document.getElementById('envelopeGraph');
		if (this.#envelopeGraph) this.#envelopeGraph.destroy();
		let funs = [this.#envFunctions[type]["attack"][0], this.#envFunctions[type]["decay"][0], this.#envFunctions[type]["release"][0]];
		let times = [
			this.#envFunctions[type]["attack"][2], 
			this.#envFunctions[type]["attack"][2] + this.#envFunctions[type]["decay"][2], 
			this.#envFunctions[type]["attack"][2] + this.#envFunctions[type]["decay"][2] + this.#envFunctions[type]["release"][2]
		]
		this.#envelopeGraph = drawEnvelope(ctx, funs, 100, times, this.#envIsNormalized[type][0], this.#envIsNormalized[type][1], ['#830','#d93','#387']);
	}
	#recorder(){
		if(document.getElementById("recordButton").value == "Record" && document.getElementById("playButton").value != "Playing"){
			this.#record = new record();
			this.#record.startRec(this.#audioContext.currentTime);
			document.getElementById("recordButton").value = "Stop";
			document.getElementById("playButton").style.display	= "none";
			document.getElementById("downloadButton").style.display	= "none";
		}
		else if(document.getElementById("recordButton").value == "Stop"){
			this.#recordResult = this.#record.stopRec();
			document.getElementById("recordButton").value = "Record";
			document.getElementById("playButton").value = "Play";
			document.getElementById("playButton").style.display	= "block";
			this.#record.createDownloadFile(this.#recordResult, "Beatiful_song.synth");
			document.getElementById("downloadButton").style.display	= "block";
		}
		document.activeElement.blur();
	}
	#player(){
		if(document.getElementById("playButton").value == "Play again" || document.getElementById("playButton").value == "Play"){
			var playTime = 0;
			this.#recordResult.forEach(element => {
				this.playNoteTimeDuration(element[0], element[1], element[2]);
				playTime = Math.max(playTime, element[1] + element[2])
			});
			document.getElementById("playButton").value = "Playing";
			document.activeElement.blur();
			setTimeout(() => {document.getElementById("playButton").value = "Play again";}, playTime*1000);
		}
	}

}
window.onload = bootstrap_synt();
/**
 * Program start. Init. the synth.
 */
function bootstrap_synt(){
	const synth = new Synth();
	const midiKeybaord = new MidiKeybaord(synth, synth.piano);
	loadURL();
}
