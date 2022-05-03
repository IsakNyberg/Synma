var audioContext = null;
var wfArray = [];
var mouseClickKey = -1;
var playing = new Array(128);       //Booleans to manage sound playing
for(var i=0; i<playing.length; i++) {
	playing[i] = false;
}
//const wf = new WaveForm();
const parser = new MathParser("t");
var isNormalized;

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

var functionGraph = null;
document.getElementById("functionButton").onclick = submitFunction;
function submitFunction() {
	if(!pianoSpawned){
		createPiano();
		pianoSpawned = !pianoSpawned;
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
}

/* Manage start and stop of sound */
function startNote(note){
	if (!playing[noteToKeyIndex(note)]) {
		if (audioContext == null) {
			audioContext = new AudioContext({sampleRate: 44100});
		}
		const wf = new WaveForm(audioContext);
		wfArray[note] = wf;		
		playing[noteToKeyIndex(note)] = true;
		setKeyColor(note, "darkgrey");
		var input = document.getElementById("functionInput");
		if(input != document.activeElement){
			console.log(note + " startades");
			var fn = getParsedFunction();
			wf.genBufferFromNote(fn, note);
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
		console.log(note + " stoppades");
		wfArray[note].stopBuffer();
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

var amplitude = ["t", "1", "1-t", 10, 10, 10, true, true];
var pitch = ["1-t", "0", "t", 10, 10, 30, true, true];
var timbre = ["1/2", "1/2", "1/2", 10, 20, 30, true, true];
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
	envelopeGraph = drawEnvelope(ctx, functions, 1000, limits,  chosen[6], chosen[7], 'rgb(0, 0, 0, 1)');
}