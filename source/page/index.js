var ampEnvelope = new AmpEnvelope(
	//standardvärden
);
var pitchEnvelope = new PitchEnvelope(
	//standardvärden
);
var timbreEnvelope = new TimbreEnvelope(
	//standardvärden
);
var releaseLen=0;

var audioContext = new AudioContext({sampleRate: 44100});
var wfArray = [];
var baseBuffer = null;
var mouseClickKey = -1;
var playing = new Array(128);       //Booleans to manage sound playing
for(var i=0; i<playing.length; i++) {
	playing[i] = false;
}
//const wf = new WaveForm();
const parser = new MathParser("t");
var isNormalized;
var noteFreq = initFreqs();

/* GET input value, attach id to input field. If input field = input do ".value"; else if div do ".innerHTML"*/ 
function getFunctionDiv() {
	return document.getElementById("functionInput");
}
function getFunction2Div() {
	return document.getElementById("env-functionInput");
}
function getLengthDiv() {
	return document.getElementById("env-timeInput");
}
function getMaxXDiv() {
	return document.getElementById("maxXInput");
}
function getFunction() {
	return document.getElementById("functionInput").value;
}
function getEnvelope() {
	return document.getElementById("env-functionInput").value;
}
function getParsedFunction() {
	return parser.parse(getFunction());
}
function getParsedEnvelope() {
	return parser.parse(getEnvelope());
}


function getMaxX() {
	return document.getElementById("maxXInput").value;
}

function getLength() {
	return document.getElementById("lengthInput").value;
}

function keyCodeToNote(keyCode){
	if(whiteCodes.indexOf(keyCode) != -1){
		return [whiteLabels[whiteCodes.indexOf(keyCode)], position];
	}
	else if(blackCodes.indexOf(keyCode) != -1){
		return [whiteLabels[blackCodes.indexOf(keyCode)] + "#", position];
	}
}
function noteToKeyCode(note){
	if (note[0].includes("#")) { // black or white
		return blackCodes[whiteLabels.indexOf(note[0].charAt(0))];
	} else {
		return whiteCodes[whiteLabels.indexOf(note[0])];
	}
}
function noteToKeyIndex(note) {
	return 3 + 12*(note[1]-1) + keyIndex.indexOf(note[0]);
}
function keyIndexToNote(index) {
		var key, octave;
		if(index < 3){
				key = index + 9;
				octave = 0;
		}
		else {
				key = (index - 3) % 12;
				octave = Math.floor((index) / 12) + 1;
				if(index%12<3)
						octave--;
		}
		return[keyIndex[key], octave];
}

var amplitude = ["1", "1", "1", 0.1, 0.1, 0.1, false, false];
var pitch = ["0", "0", "0", 1, 1, 1, false, false];
var timbre = ["1", "1", "1", 1, 1, 1, false, false];

var functionGraph = null;
document.getElementById("functionButton").onclick = submitFunction;
function submitFunction() {
	if(!pianoSpawned){
		createPiano();
		pianoSpawned = !pianoSpawned;
		
		// sksapa envelope!!! :)
		createEnvelope([parser.parse(amplitude[0]),parser.parse(amplitude[1]),parser.parse(amplitude[2])],amplitude[3],amplitude[4],amplitude[5],"Amplitude");
		createEnvelope([parser.parse(timbre[0]),parser.parse(timbre[1]),parser.parse(timbre[2])],timbre[3],timbre[4],timbre[5],"Filter");
		createEnvelope([parser.parse(pitch[0]),parser.parse(pitch[1]),parser.parse(pitch[2])],pitch[3],pitch[4],pitch[5],"Pitch");
	}
	var ctx = document.getElementById('waveformGraph');
	var fn = getParsedFunction();
	var numPoints = 100;
	var maxX = getMaxX();
	if (maxX == 0) { maxX = 6.2831853072; }
	if (functionGraph) { functionGraph.destroy(); }
	isNormalized = document.getElementById("normalizeCheckbox").checked;
	functionGraph = drawGraph(ctx, fn, numPoints, maxX, isNormalized, 'rgb(0, 0, 0, 1)');
	
	// precompute the soud buffers
	if (audioContext == null) {
		audioContext = new AudioContext({sampleRate: 44100});
	}
	//alert("Precomputing notes");
	//console.time("precompute");
	baseBuffer = WaveForm.computeBase(audioContext, fn, maxX, 4410);
	//console.timeEnd("precompute");
	//alert("Done");
}

/* Manage start and stop of sound */
function startNote(note){
	if (!playing[noteToKeyIndex(note)]) {
		//console.log(baseBuffer);
		const wf = new WaveForm(audioContext, baseBuffer, noteFreq[note[1]][note[0]]);
		wfArray[note] = wf;		
		let applyAmplitude = document.getElementById("applyAmplitude").checked;
		let applyPitch = document.getElementById("applyPitch").checked;
		let applyTimbre = document.getElementById("applyTimbre").checked;
		if (applyAmplitude) {
			ampEnvelope.apply_attack(wf.bufferGain);
			ampEnvelope.apply_decay(wf.bufferGain);
		}
		if (applyPitch) {
			pitchEnvelope.apply_attack(wf.masterSource);
			pitchEnvelope.apply_decay(wf.masterSource);
		}
		if (applyTimbre) {
			timbreEnvelope.apply_attack(wf.bufferBiquadFilter);
			timbreEnvelope.apply_decay(wf.bufferBiquadFilter);
		}
		playing[noteToKeyIndex(note)] = true;
		setKeyColor(note, "darkgrey");
		var input = document.getElementById("functionInput");
		if(input != document.activeElement){
			//var fn = getParsedFunction();
			if (isNormalized) {
				wf.normalizeBuffer();
			}
			wf.playBuffer();
		}
	}
}

function stopNote(note){
	// everything must be in the if statement
	if (playing[noteToKeyIndex(note)]) {
		playing[noteToKeyIndex(note)] = false;
		console.log("stopppades: ", note);
		let applyAmplitude = document.getElementById("applyAmplitude").checked;
		let applyPitch = document.getElementById("applyPitch").checked;
		let applyTimbre = document.getElementById("applyTimbre").checked;
		if (applyAmplitude) ampEnvelope.apply_release(wfArray[note].bufferGain);
		if (applyPitch) pitchEnvelope.apply_release(wfArray[note].masterSource);
		if (applyTimbre) timbreEnvelope.apply_release(wfArray[note].bufferBiquadFilter);
		wfArray[note].stopBuffer(releaseLen);
	}
}

/* Handles mouse clicks */
function mouseDown(note){
	mouseClickKey = note;
	startNote(note)
}
function mouseUp(note){
	setKeyColor(note, "lightgrey")
	stopNote(mouseClickKey);
}


/* Key handler */ 
document.addEventListener('keydown', pressedKey);
document.addEventListener('keyup', releasedKey);
function releasedKey(pressedKey){
	var note = keyCodeToNote(pressedKey.keyCode);
	if (note == undefined) {
		return;
	}
	if(playing[noteToKeyIndex(note)]){
		resetKeyColor(note);
		stopNote(note);
	}
}

function turnOffAndReset(){
		for(var i=0; i<playing.length; i++) {
				if (playing[i]){
						resetKeyColor(keyIndexToNote(i));
						stopNote(keyIndexToNote(i));
				}
		}
}

function pressedKey(pressedKey){
	switch(pressedKey.keyCode) {
		case 90: //z
			if(position > 1 && pianoSpawned){
								if(!(getMaxXDiv() == document.activeElement || getFunctionDiv() == document.activeElement || getFunction2Div() == document.activeElement || getLengthDiv()  == document.activeElement)){
										removeMarkers(position);
										placeMarkers(--position);
										turnOffAndReset();                    
								}

			}
			break;
		case 88: //x
			if(position < 7 && pianoSpawned){
								if(!(getMaxXDiv() == document.activeElement || getFunctionDiv() == document.activeElement || getFunction2Div() == document.activeElement || getLengthDiv()  == document.activeElement)){                
						removeMarkers(position);
						placeMarkers(++position);
										turnOffAndReset();
								}
			}
			break;  
		default:

	}
	var note = keyCodeToNote(pressedKey.keyCode);
	if (note == undefined || getMaxXDiv() == document.activeElement || getFunctionDiv() == document.activeElement || getFunction2Div() == document.activeElement || getLengthDiv()  == document.activeElement || !pianoSpawned)
		return;
	startNote(note);
}


document.getElementById("env-functionButton").addEventListener("click", submitEnvelope);
function submitEnvelope(){
		var currentEnvelope = document.getElementById("chosenEnvelope").innerHTML;
		var currentTimezone = document.getElementById("chosenTimezone").innerHTML;
	var interval, chosenFunction;
	var chosen;
	switch(currentEnvelope){
		case "Amplitude":
			chosen = amplitude;
			break;
		case "Pitch":
			chosen = pitch;
			break;
		case "Filter":
			chosen = timbre;
			break;
		default:
			return;
	}
	switch(currentTimezone){
		case "Attack":
			interval = 3;
			chosenFunction = 0;
			break;
		case "Decay":
			interval = 4;
			chosenFunction = 1;
			break;
		case "Release":
			interval = 5;
			chosenFunction = 2;
			break;
		default:
			return;
	}
		var currentLength = parseFloat(document.getElementById("env-timeInput").value);
	chosen[interval] = currentLength;
	chosen[chosenFunction] = getEnvelope();
	var isNormalized = document.getElementById("normalizeEnvelope").checked;
	var isContinuous = document.getElementById("continuousCheckbox").checked;
	chosen[6] = isNormalized;
	chosen[7] = isContinuous;
	graphEnvelope(currentEnvelope);
	
}
//flyttade uppåt ^
//var amplitude = ["t", "1", "1-t", 10, 10, 10, true, true];
//var pitch = ["1-t", "0", "t", 10, 10, 30, true, true];
//var timbre = ["1/2", "1/2", "1/2", 10, 20, 30, true, true];
var envelopeGraph = null;

function graphEnvelope(chosenEnvelope){
	var chosen;
    var yLimits;
	switch(chosenEnvelope){
		case "Amplitude":
			chosen = amplitude;
            yLimits = [0, 1]
			break;
		case "Pitch":
			chosen = pitch;
			break;
		case "Filter":
			chosen = timbre;
            yLimits = [0, 1]
			break;
		default:
			return;
	}
	var ctx = document.getElementById('envelopeGraph');
	if (envelopeGraph) {
		envelopeGraph.destroy();
	}	
	var newFunctions =  [parser.parse(chosen[0]), parser.parse(chosen[1]), parser.parse(chosen[2])];
	if(chosen[6] || chosen[7])
		newFunctions = getNormalizedAndOrContinuousFunctions(newFunctions, 100, chosen[3], chosen[4], chosen[5], chosen[6], chosen[7])
	var limits = [chosen[3], chosen[3] + chosen[4], chosen[3] + chosen[4] + chosen[5]];
    
	if(chosen[6] || chosen[7])
        newFunctions = getNormalizedAndOrContinuousFunctions(newFunctions, 100, chosen[3], chosen[4], chosen[5], chosen[6], chosen[7])

    if(chosen == pitch)
        yLimits = getYLimits(newFunctions, 100, chosen[3], chosen[4], chosen[5]);
    console.log(yLimits);

	// drawEnvelope(ctx, [fn1, fn2, fn3], samples, [max1, max2, max3], cont, normal, ['#0f0','#ff3','#f00'])
	// Yo Lukas my man går det bra o fixa lite y-intervals funktioner
	envelopeGraph = drawEnvelope(ctx, newFunctions, 100, limits, [chosen[6], chosen[7]], ['#830','#d93','#387'], yLimits);
	createEnvelope(newFunctions,chosen[3],chosen[4],chosen[5],chosenEnvelope);
    console.log("test");
}

function getYLimits(functions, steps, maxX1, maxX2, maxX3){
    var max = 1;
    var min = 0;
	var step = (maxX1 + maxX2 + maxX3) / steps;
    console.log("step: " + step)
	for (let i = 0; i < maxX1; i += step) {
		max = Math.max(max, functions[0](i));
		min = Math.min(min, functions[0](i));
	}
	for (let i = 0; i < maxX2; i += step) {
		max = Math.max(max, functions[1](i));
		min = Math.min(min, functions[1](i));
	}
	for (let i = 0; i <= maxX3; i += step) {
		max = Math.max(max, functions[2](i));
		min = Math.min(min, functions[2](i));
        console.log("min: " + min + "max: " + max)
	}
    return [min, max];
}

/**
 * 
 * @param {Array<Function>} functions 
 * @param {Number} maxX1 
 * @param {Number} maxX2 
 * @param {Number} maxX3 
 * @param {Boolean} normalize 
 * @param {Boolean} continuous 
 */
 function getNormalizedAndOrContinuousFunctions(functions, steps, maxX1, maxX2, maxX3, normalize, continuous){
	var offset1 = 0;
	var offset2 = 0;

	if(continuous) {
		offset1 = functions[0](maxX1) - functions[1](0);
		offset2 = functions[1](maxX2) + offset1 - functions[2](0);

		let temp1 = functions[1];
		let temp2 = functions[2];
		functions[1] = (x) => (temp1(x) + offset1);
		functions[2] = (x) => (temp2(x) + offset2);
	}
	if(normalize){
		var max = 0;
		var step = (maxX1 + maxX2 + maxX3) / steps;
		for (let i = 0; i < maxX1; i += step) {
			max = Math.max(max, Math.abs(functions[0](i)));
		}
		for (let i = 0; i < maxX2; i += step) {
			max = Math.max(max, Math.abs(functions[1](i)));
		}
		for (let i = 0; i <= maxX3; i += step) {
			max = Math.max(max, Math.abs(functions[2](i)));
		}
		let temp1 = functions[0];
		let temp2 = functions[1];
		let temp3 = functions[2];
		functions[0] = (x) => (temp1(x) / max);
		functions[1] = (x) => (temp2(x) / max);
		functions[2] = (x) => (temp3(x) / max);
	} 

	return functions;
}

function createEnvelope(functions,c1,c2,c3,chosenEnvelope) {
	
	switch(chosenEnvelope){
		case "Amplitude":
			releaseLen=c3;
			ampEnvelope = new AmpEnvelope(functions[0],functions[1],functions[2],100,c1,c2,c3,audioContext);
			break;
		case "Pitch":
			pitchEnvelope = new PitchEnvelope(functions[0],functions[1],functions[2],100,c1,c2,c3,audioContext);
			break;
		case "Filter":
			timbreEnvelope = new TimbreEnvelope(functions[0],functions[1],functions[2],100,c1,c2,c3,audioContext);
			break;
		default:
			return;
	}
}