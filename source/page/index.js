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

/* Manage start and stop of sound */
function startNote(note){
    //Insert management for starting a note
    console.log(note + " startades");
}
function stopNote(note){
    //Insert management for stopping a note
    console.log(note + " stoppades");
}

//createPiano();
//placeMarkers(position);
