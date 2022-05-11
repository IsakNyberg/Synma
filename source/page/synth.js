let noteFreq = initFreqs();
class Synth {
	#audioContext = null;
	#masterVolume;
	#maxVolume = 1;
	#waveFunction;
	#unparsedEnvFun;
	#envFunctions = {
		"amplitude" : {
			"attack" : [()=>1,"1",0.1], "decay" : [()=>1,"1",0.1], "release" : [()=>1/2,"1/2",0.1]
		}, "pitch" : {
			"attack" : [()=>0,"0",0.1], "decay" : [()=>0,"0",0.1], "release" : [()=>0,"0",0.1]
		}, "timbre" : {
			"attack" : [()=>1/2,"1/2",0.1], "decay" : [()=>1/2,"1/2",0.1], "release" : [()=>1/2,"1/2",0.1]
		}
	};
	#releaseLen;
	#ampEnvelope;
	#envSamples = 100;
	#pitchEnvelope;
	#timbreEnvelope;
	#baseNote;
	#waveforms;
	#maxX;
	piano;
	#waveParser;
	#envelopeParser;
	activeKeys;
	#envelopeGraph=false;
	#waveGraph = false;
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
		this.#audioContext = new AudioContext(); // flytta? 
		this.#masterVolume = this.#audioContext.createGain();
		this.#waveFunction = this.#waveParser.parse(document.getElementById("functionInput").value);
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
		this.#createEnvelopes();
		this.#graphEnvelope(envelopString);
	}
	/**
	 * Creates envelope instances from the currently (class property) specified envelopes.
	 */
	#createEnvelopes(){
		this.#unparsedEnvFun = []
		this.#releaseLen = this.#envFunctions["amplitude"]["release"][2];
		this.#ampEnvelope = new AmpEnvelope(
			this.#envFunctions["amplitude"]["attack"][0],
			this.#envFunctions["amplitude"]["decay"][0],
			this.#envFunctions["amplitude"]["release"][0],
			this.#envSamples,
			this.#envFunctions["amplitude"]["attack"][2],
			this.#envFunctions["amplitude"]["decay"][2],
			this.#envFunctions["amplitude"]["release"][2],
			this.#audioContext
		);
		this.#pitchEnvelope = new PitchEnvelope(
			this.#envFunctions["pitch"]["attack"][0],
			this.#envFunctions["pitch"]["decay"][0],
			this.#envFunctions["pitch"]["release"][0],
			this.#envSamples,
			this.#envFunctions["pitch"]["attack"][2],
			this.#envFunctions["pitch"]["decay"][2],
			this.#envFunctions["pitch"]["release"][2],
			this.#audioContext
		);
		this.#timbreEnvelope = new TimbreEnvelope(
			this.#envFunctions["timbre"]["attack"][0],
			this.#envFunctions["timbre"]["decay"][0],
			this.#envFunctions["timbre"]["release"][0],
			this.#envSamples,
			this.#envFunctions["timbre"]["attack"][2],
			this.#envFunctions["timbre"]["decay"][2],
			this.#envFunctions["timbre"]["release"][2],
			this.#audioContext
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
	#apply_envelopes(wf){
		this.#ampEnvelope.apply_attack(wf.bufferGain);
		this.#ampEnvelope.apply_decay(wf.bufferGain);
		console.log(this.#ampEnvelope);
		//this.#pitchEnvelope.apply_attack(wf.masterSource);
		//this.#pitchEnvelope.apply_decay(wf.masterSource);
		//this.#timbreEnvelope.apply_attack(wf.biquadFilter);
		//this.#timbreEnvelope.apply_decay(wf.biquadFilter);
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
		this.activeKeys[keyIndex] = true;
		let wf = this.#waveforms[keyIndex];
		if (wf === undefined) {
			console.log("click on submit function. :)");
			alert("Before you play a key it is important that you submit a function. you cannot play unless you do this so make sure that a funciton is submitted. this is done by wiriting a funciton into the function field and then pressing the submit button in order to sumbite the funcito wichih si neccesary for playing keys beacause if you dont submite the function does not calucatee the value and the sound does not play. therefore subbmitting is very important.");
			return;
		}
		this.#apply_envelopes(wf);
		let freq = noteFreq[keyIndex];
		wf.playBuffer(freq);
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
	/**
	 * Stop playing the specified note (midi key-index).
	 * @param {Number} keyIndex 
	 * @returns {void}
	 */
	stopNote(keyIndex){
		if (!this.activeKeys[keyIndex]) {
			return;
		}
		this.activeKeys[keyIndex] = false;
		this.#ampEnvelope.apply_release(this.#waveforms[keyIndex].bufferGain);
		this.#waveforms[keyIndex].stopBuffer(this.#releaseLen);
	}
	#setMasterVolume(vol){
		document.activeElement.blur();
		if(this.#masterVolume == undefined)
			return;
		this.#masterVolume.gain.value = Math.min(Math.abs(vol)/10,Math.abs(this.#maxVolume));
		console.log("Set master volume to: " + Math.min(Math.abs(vol)/10,Math.abs(this.#maxVolume)));
	}
	#graphWave(){
		var ctx = document.getElementById('waveformGraph');
		if (this.#waveGraph)
			this.#waveGraph.destroy();
		this.#waveGraph = drawGraph(ctx, this.#waveFunction, 100, this.#maxX, false, 'rgb(0, 0, 0, 1)');
	}
	#graphEnvelope(type){
		var ctx = document.getElementById('envelopeGraph');
		if (this.#envelopeGraph)
			this.#envelopeGraph.destroy();
		let funs = [this.#envFunctions[type]["attack"][0], this.#envFunctions[type]["decay"][0], this.#envFunctions[type]["release"][0]];
		let times = [
			this.#envFunctions[type]["attack"][2], 
			this.#envFunctions[type]["attack"][2] + this.#envFunctions[type]["decay"][2], 
			this.#envFunctions[type]["attack"][2] + this.#envFunctions[type]["decay"][2] + this.#envFunctions[type]["release"][2]
		]
		this.#envelopeGraph = drawEnvelope(ctx, funs, 100, times, false, false, ['#830','#d93','#387']);
		
	}

}
window.onload = bootstrap_synt();
/**
 * Program start. Init. the synth.
 */
function bootstrap_synt(){
	const synth = new Synth();
	const midiKeybaord = new MidiKeybaord(synth, synth.piano);
}
