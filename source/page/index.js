var audioContext = null;
var wfArray = [];
//const wf = new WaveForm();
const parser = new MathParser("t");
var isNormalized;

/* GET input value, attach id to input field. If input field = input do ".value"; else if div do ".innerHTML"*/ 
function getFunctionDiv() {
	return document.getElementById("functionInput");
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
	console.info(isNormalized);
	functionGraph = drawGraph(ctx, fn, numPoints, maxX, isNormalized, 'rgb(0, 0, 0, 1)');
}

/* Manage start and stop of sound */
function startNote(note){
	if (audioContext == null) {
		audioContext = new AudioContext({sampleRate: 44100});
	}
	const wf = new WaveForm(audioContext);
	wfArray[note] = wf;
	if (!playing[noteToKeyIndex(note)]) {
		playing[noteToKeyIndex(note)] = true;
		setKeyColor(note, "darkgrey");
		var input = document.getElementById("functionInput");
		if(input != document.activeElement){
			console.log(note + " startades");
			var fn = getParsedFunction();
			wf.genBufferFromNote(fn, note);
			if (isNormalized) {
				wf.normalizeBuffer();
				console.info("normalizing buffer");
			}
			wf.fadeOutEnd(2000);
			wf.playBuffer();
		}
	}
}

function stopNote(note){
	playing[noteToKeyIndex(note)] = false;
	console.log(note + " stoppades");
	wfArray[note].stopBuffer();
}

/* Handles mouse clicks */
function mouseUp(note){
	setKeyColor(note, "lightgrey")
	stopNote(note);
}

function mouseDown(note){
	startNote(note)
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
		playing[noteToKeyIndex(note)] = false;

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
	if (note == undefined || getFunctionDiv() == document.activeElement)
		return;
	startNote(note);
}

