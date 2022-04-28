
var wf = new WaveForm();
var parser = new MathParser("t");

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

/*
function startNote(note){
    //Insert management for starting a note
    console.log(note + " startades");
}
function stopNote(note){
    //Insert management for stopping a note
    console.log(note + " stoppades");
}*/

function testIt(){
	document.getElementById("functionInput").focus = true;
}

function testNot(){
	document.getElementById("functionInput").focus = false;
}

document.getElementById("functionInput").addEventListener("input", testInput);
var currentlyEditing = false;
function testInput(){
	currentlyEditing = true;
}

/* Manage start and stop of sound */
function startNote(note){
	var input = document.getElementById("functionInput");
	if(input != document.activeElement){
		console.log(note + " startades");
		var fn = getParsedFunction();
		//console.log(note, fn);
		wf.genBufferFromNote(fn, note);
		wf.normalizeBuffer();
		wf.fadeOutEnd(2000);
		wf.playBuffer();
	}
}

function stopNote(note){
	//console.log(note + " stoppades");
	//wf.stopBuffer();
	//console.log("end1", wf.masterSource.getChannelDate);
	//console.log("end2", wf.audioContext.getOutputTimestamp());
}

//createPiano();
//placeMarkers(position);
