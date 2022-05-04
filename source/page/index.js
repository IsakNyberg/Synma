var audioContext = null;
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
function getParsedFunction() {
	return parser.parse(getFunction());
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
		playing[noteToKeyIndex(note)] = true;
		setKeyColor(note, "darkgrey");
		var input = document.getElementById("functionInput");
		if(input != document.activeElement){
			console.log(note + " startades");
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
    var currentLength = document.getElementById("env-timeInput").value;
    console.log(currentLength + currentEnvelope + currentTimezone); // These values to be used to update correct part of the graph when submitted
}
