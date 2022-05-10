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
	#graphIsNormalized = false;
	#envIsNormalized = {"amplitude" : [false,false], "pitch" : [false,false], "timbre" : [false,false]};
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
		this.#audioContext = new AudioContext(); // flytta? 
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
		this.#baseNote = WaveForm.computeBase(this.#audioContext, this.#waveFunction, this.#maxX, 4410);
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
		this.#timbreEnvelope = new TimbreEnvelope(
			this.#envFunctions["timbre"]["attack"][0],
			this.#envFunctions["timbre"]["decay"][0],
			this.#envFunctions["timbre"]["release"][0],
			this.#envSamples,
			this.#envFunctions["timbre"]["attack"][2],
			this.#envFunctions["timbre"]["decay"][2],
			this.#envFunctions["timbre"]["release"][2],
			this.#audioContext,
			this.#envIsNormalized["timbre"][0],
			this.#envIsNormalized["timbre"][1]
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
		document.querySelectorAll(".dropdownOption").forEach((element)=> {
			element.addEventListener("click", ()=> this.#dropdownClick())
		});

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
			this.#timbreEnvelope.apply_attack(wf.bufferBiquadFilter);
			this.#timbreEnvelope.apply_decay(wf.bufferBiquadFilter);
		}
	}
	#applyEnvelopesR(wf){
		if(this.#activeEnvelopes[0])
			this.#ampEnvelope.apply_release(wf.bufferGain);
		if(this.#activeEnvelopes[1])
			this.#pitchEnvelope.apply_release(wf.masterSource);
		if(this.#activeEnvelopes[2])
			this.#timbreEnvelope.apply_release(wf.bufferBiquadFilter);
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
		this.#activeEnvelopes = [
			document.getElementById("applyAmplitude").checked,
			document.getElementById("applyPitch").checked,
			document.getElementById("applyTimbre").checked
		];
		if(this.#graphIsNormalized)
			wf.normalizeBuffer();
		let freq = noteFreq[keyIndex];
		wf.createMasterSource(freq);
		this.#applyEnvelopesAD(wf);
		
		wf.playBuffer();
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
		this.#applyEnvelopesR(this.#waveforms[keyIndex]);
		if (this.#activeEnvelopes[0]) {
			this.#waveforms[keyIndex].stopBuffer(this.#releaseLen);
		}else {
			this.#waveforms[keyIndex].stopBuffer(0);
		}
		
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
		this.#waveGraph = drawGraph(ctx, this.#waveFunction, 100, this.#maxX, this.#graphIsNormalized, 'rgb(0, 0, 0, 1)');
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
		this.#envelopeGraph = drawEnvelope(ctx, funs, 100, times, this.#envIsNormalized[type][0], this.#envIsNormalized[type][1], ['#830','#d93','#387']);
		
	}

}
window.onload = bootstrap_synt();
/**
 * Program start. Init. the synth.
 */
function bootstrap_synt(){
	const synth = new Synth();
	const midi = new Midi(synth, synth.piano);
}
