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
	return document.getElementById("env-timenput");
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

var amplitude = ["t", "1", "1-t", 1, 1, 1, true, true];
var pitch = ["1-t", "0", "t", 1, 1, 1, true, true];
var timbre = ["1/2", "1/2", "1/2", 1, 1, 1, true, true];

var functionGraph = null;
document.getElementById("functionButton").onclick = submitFunction;
function submitFunction() {
	if(!pianoSpawned){
		createPiano();
		pianoSpawned = !pianoSpawned;
		
		// sksapa envelope!!! :)
		createEnvelope([parser.parse(amplitude[0]),parser.parse(amplitude[1]),parser.parse(amplitude[2])],amplitude[3],amplitude[4],amplitude[5],"Amplitude");
		//createEnvelope(parser.parse(pitch[0]),parser.parse(pitch[1]),parser.parse(pitch[2]),pitch[3],pitch[4],pitch[5],"Pitch");
		//createEnvelope(parser.parse(timbre[0]),parser.parse(timbre[1]),parser.parse(timbre[2]),timbre[3],timbre[4],timbre[5],"Timbre");

	}
	var ctx = document.getElementById('waveformGraph');
	var fn = getParsedFunction();
	var numPoints = 100;
	var maxX = 6.2831853072;
	if (functionGraph) {
		functionGraph.destroy();
	}
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
		const wf = new WaveForm(audioContext, baseBuffer);
		wfArray[note] = wf;		
		ampEnvelope.apply_attack(wf.bufferGain);
		ampEnvelope.apply_decay(wf.bufferGain);
		playing[noteToKeyIndex(note)] = true;
		setKeyColor(note, "darkgrey");
		var input = document.getElementById("functionInput");
		if(input != document.activeElement){
			
			var fn = getParsedFunction();
			if (isNormalized) {
				wf.normalizeBuffer();
			}
			let freq = noteFreq[note[1]][note[0]];
			wf.playBuffer(freq);
		}
	}
}

function stopNote(note){
	// everything must be in the if statement
	if (playing[noteToKeyIndex(note)]) {
		playing[noteToKeyIndex(note)] = false;
		ampEnvelope.apply_release(wfArray[note].bufferGain);
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


function pressedKey(pressedKey){
	switch(pressedKey.keyCode) {
		case 90: //z
			if(position > 1 && pianoSpawned){
				removeMarkers(position);
				placeMarkers(--position);
			}
			break;
		case 88: //x
			if(position < 7 && pianoSpawned){
				removeMarkers(position);
				placeMarkers(++position);
			}
			break;  
		default:

	}
	var note = keyCodeToNote(pressedKey.keyCode);
	if (note == undefined || getFunctionDiv() == document.activeElement || getFunction2Div() == document.activeElement || getLengthDiv()  == document.activeElement || !pianoSpawned)
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
		case "Timbre":
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
    var currentLength = parseInt(document.getElementById("env-timeInput").value);
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
	switch(chosenEnvelope){
		case "Amplitude":
			chosen = amplitude;
			break;
		case "Pitch":
			chosen = pitch;
			break;
		case "Timbre":
			chosen = timbre;
			break;
		default:
			return;
	}
	var ctx = document.getElementById('envelopeGraph');
	if (envelopeGraph) {
		envelopeGraph.destroy();
	}	
	var functions = [parser.parse(chosen[0]), parser.parse(chosen[1]), parser.parse(chosen[2])];
	var limits = [chosen[3], chosen[3] + chosen[4], chosen[3] + chosen[4] + chosen[5]];
	// drawEnvelope(ctx, [(x)=>Math.pow(x, 2), (x)=>-1*x, (x)=>-1*Math.pow(x, 2)], 100, [10, 20, 30], true, true, ['#0f0','#ff3','#f00'])
	envelopeGraph = drawEnvelope(ctx, functions, 100, limits,  chosen[6], chosen[7], ['#0a0','#aa0','#a00']);
	createEnvelope(functions,chosen[3],chosen[4],chosen[5],chosenEnvelope);
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
		case "Timbre":
			timbreEnvelope = new TimbreEnvelope(functions[0],functions[1],functions[2],100,c1,c2,c3,audioContext);
			break;
		default:
			return;
	}
}