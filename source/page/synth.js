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
	/**
	 * Constructs the class and loads saved settings if such exist
	 * @param {Array<>} envelopePresets 
	 */
  constructor(envelopePresets){
		this.#waveParser = new MathParser("x");
		this.#envelopeParser = new MathParser("t");
		this.#waveforms = [];
		this.activeKeys = new Array(60);
		for (var i = 0; i < this.activeKeys.length; ++i) { this.activeKeys[i] = false; }
		this.#addEventListeners();
		this.#createPiano();  
		if(envelopePresets.length > 0){
			var types = ["amplitude", "filter", "pitch"];
			var adr = ["attack", "decay", "release"];
			for(let i=0; i<3; i++){
				for(let j=0; j<3; j++){
					this.#envFunctions[types[i]][adr[j]][0] = this.#envelopeParser.parse(envelopePresets[i][0+j]);
					this.#envFunctions[types[i]][adr[j]][1] = envelopePresets[i][0+j]
					this.#envFunctions[types[i]][adr[j]][2] = envelopePresets[i][3+j]
				}
				this.#envIsNormalized[types[i]] = [envelopePresets[i][6], envelopePresets[i][7]]
			}
			this.#setWave();
			this.#createEnvelopes();
			this.#dropdownClick();
		}
		this.#dropdownClick();
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
		document.getElementById("normalizeEnvelope").checked = this.#envIsNormalized[currentType][0];
		document.getElementById("continuousCheckbox").checked = this.#envIsNormalized[currentType][1];
		this.#graphEnvelope(currentType);
	}
	/**
	 * Adds event-listeners for submiting functions to the synth.
	 */
	#addEventListeners(){
		document.getElementById("saveSettings").onclick = () => this.#saveSettings();
		document.getElementById("recordButton").onclick = () => this.#recorder();
		document.getElementById("playButton").onclick = () => this.#player();
		document.getElementById("functionButton").onclick = () => this.#setWave();
		document.getElementById("env-functionButton").onclick = () => this.#getEnvelopes();
		document.getElementById("volume").oninput = () => this.#setMasterVolume(document.getElementById("volume").value);
		document.querySelectorAll(".dropdownOption").forEach(
			(element)=> {element.addEventListener("click", ()=> this.#dropdownClick())}
		);
		document.getElementById("midiUpload").addEventListener("change", ()=>{
			this.playFile(document.getElementById("midiUpload").files[0]);
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
	/**
	 * Recieves a keystroke and it's properties to then queue it in the buffer
	 * @param {Int} keyIndex 
	 * @param {Float} time 
	 * @param {Float} duration 
	 */
	playNoteTimeDuration(keyIndex, time, duration) {
		let wf = this.#waveforms[keyIndex];
		let freq = noteFreq[keyIndex];
		setTimeout(()=>this.piano.setKeyColor(keyIndex, "#cf1518"), time*1000);
		setTimeout(()=>this.piano.resetKeyColor(keyIndex), (time+duration)*1000);
		wf.playBufferAt(freq, time, duration);
	}
	playFile(file) {
		let fileSplit = file.name.split(".")
		let fileExtentaiton = fileSplit[fileSplit.length-1];
		if (fileExtentaiton === "mid") {
			this.#playMidi(URL.createObjectURL(file))
		} else if (fileExtentaiton === "synth") {
				const reader = new FileReader();
				reader.addEventListener("load", () => {
					 let parsed = JSON.parse(reader.result);
					this.#recordResult = parsed;
					this.#player();
				}, false);
				reader.readAsText(file);
		} else {
			alert("Invalid file extention: " + fileExtentaiton);
		}
	}
	async #playMidi(url) {
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
	/**
	 * Responds to record button and starts or stops a recording of the strokes
	 */
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
			document.getElementById("playButton").style.display	= "inline";
			this.#record.createDownloadFile(this.#recordResult, "Beatiful_song.synth");
			document.getElementById("downloadButton").style.display	= "inline";
		}
		document.activeElement.blur();
	}
	/**
	 * Responds to play button and starts the recorded strokes
	 */
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
	/**
	 * Calls function in URL.js with the current settings as arguments
	 */
	#saveSettings(){
		saveSettings(this.#envFunctions, this.#envIsNormalized);
	}

}
window.onload = bootstrap_synt();
/**
 * Program start. Init. the synth.
 */
function bootstrap_synt(){
  var synth;
	let origin = window.location.search;
	const urlParams = new URLSearchParams(origin);
	if(urlParams.has('func1')){
    synth = new Synth(loadURL(urlParams));
	}
	else{
		synth = new Synth([]);
	}
	const midiKeybaord = new MidiKeybaord(synth, synth.piano);
}
