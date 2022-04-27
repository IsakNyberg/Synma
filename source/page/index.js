
var wf = new WaveForm();
var parser = new MathParser("t");

/* GET input value, attach id to input field. If input field = input do ".value"; else if div do ".innerHTML"*/ 
function getFunction() {
    return document.getElementById("functionInput").value;
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

/* Manage start and stop of sound */
function startNote(note){
	console.log(note + " startades");
	var str_fn = getFunction();
	var fn = parser.parse(str_fn);
	//console.log(note, fn);
	wf.genBufferFromNote(fn, note);
	//wf.normalizeBuffer();
	wf.fadeOutEnd(2000);
	wf.playBuffer();
}

function stopNote(note){
	console.log(note + " stoppades");
	//wf.stopBuffer();
	//console.log("end1", wf.masterSource.getChannelDate);
	//console.log("end2", wf.audioContext.getOutputTimestamp());
}

//createPiano();
//placeMarkers(position);
