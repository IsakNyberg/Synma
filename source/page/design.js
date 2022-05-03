var blackCodes = [50, 51, "x", 53, 54, 55, "x"]
var whiteCodes = [81, 87, 69, 82, 84, 89, 85];
var whiteLabels = ["C", "D", "E", "F", "G", "A", "B"];
var whiteKeys = ["q", "w", "e", "r", "t", "y", "u"];
var blackKeys = ["2", "3", "e", "5", "6", "7", "u"];
var keyIndex = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var whiteCounter = 5;
var serieCounter = 0;


var pianoSpawned = false;

// [c#, 4]
function setKeyColor(note, color) {
	if(note[0].includes("#")){
		document.getElementById(note[0].charAt(0) + note[1] + "#").style.backgroundColor = color;
	} else {
		var id = note[0] + note[1];
		document.getElementById(id).style.backgroundColor = color;
		var potentialLeft = document.getElementById(id+"L");
		var potentialRight = document.getElementById(id+"R");
		if(potentialLeft != null) 
		potentialLeft.style.backgroundColor = color;
		if(potentialRight != null) 
		potentialRight.style.backgroundColor = color;
	}
}

function resetKeyColor(note) {
	if(note[0].includes("#")){
		document.getElementById(note[0].charAt(0) + note[1] + "#").style.backgroundColor = "black";
	} else {
		var id = note[0] + note[1];
		document.getElementById(id).style.backgroundColor = "white";
		var potentialLeft = document.getElementById(id+"L");
		var potentialRight = document.getElementById(id+"R");
		if(potentialLeft != null) 
		potentialLeft.style.backgroundColor = "white";
		if(potentialRight != null) 
		potentialRight.style.backgroundColor = "white";
	}
}


/* Creating keys and their event listeners */
function addEventListeners(key, extra){
	var id = key[0] + key[1] + extra;
	if(extra == "#")
		key = [key[0] + extra, key[1]];
	document.getElementById(id).onmousedown = function() {
		mouseDown(key);
	};
	document.getElementById(id).onmouseup = function() {
		mouseUp(key);
	};
	document.getElementById(id).onmouseenter = function() {
	  setKeyColor(key, "lightgrey");
	};
	document.getElementById(id).onmouseleave = function() {
		resetKeyColor(key);
	};
}

function addTripleEventListeners(key1, key2){
	key1 = [key1[0].charAt(0), key1[1]];
	addEventListeners(key1, "#");
	addEventListeners(key1, "R");
	addEventListeners(key2, "L");
}
function white(){
	document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"white\" id=\"" + whiteLabels[whiteCounter] + serieCounter + "\"></div>");
	var temp = [whiteLabels[whiteCounter], serieCounter];
	addEventListeners(temp, "");
}

function both(){
	if(whiteCounter == 6){
		whiteCounter = 0;
		document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"both\"><div class=\"black\" id=\"" + whiteLabels[6]  + serieCounter + "#" + "\"></div><div class=\"leftWhite\" id=\"" + whiteLabels[6]  + serieCounter + "R" + "\"></div><div class=\"rightWhite\" id=\"" +  whiteLabels[0]  + ++serieCounter + "L" + "\"></div></div>");
		var temp = [whiteLabels[6]  + "#", (serieCounter - 1)]
		var temp2 = [whiteLabels[0], serieCounter];
		addTripleEventListeners(temp, temp2);
	}
	else {
		document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"both\"><div class=\"black\" id=\"" + whiteLabels[whiteCounter]  + serieCounter + "#" + "\"></div><div class=\"leftWhite\" id=\"" + whiteLabels[whiteCounter]  + serieCounter + "R" + "\"></div><div class=\"rightWhite\" id=\"" + whiteLabels[++whiteCounter] + serieCounter + "L" + "\"></div></div>");
		var temp = [whiteLabels[whiteCounter - 1] + "#", serieCounter];
		var temp2 = [whiteLabels[whiteCounter], serieCounter];
		addTripleEventListeners(temp, temp2);
		
	} 
}

function doubleWhite(){
	if(whiteCounter == 6){
		document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"white borderRight\" id=\"" + whiteLabels[whiteCounter++] + serieCounter + "\"></div><div class=\"white borderLeft\" id=\"" + whiteLabels[0] + (++serieCounter) + "\"></div>");
		var temp = [whiteLabels[whiteCounter - 1], (serieCounter - 1)];
		addEventListeners(temp, "");
		whiteCounter = 0;
		var temp1 = [whiteLabels[0], serieCounter];
		addEventListeners(temp1, "");
	}
	else {
		document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"white borderRight\" id=\"" + whiteLabels[whiteCounter++] + serieCounter + "\"></div><div class=\"white borderLeft\" id=\"" + whiteLabels[whiteCounter] + serieCounter + "\"></div>");
		var temp = [whiteLabels[whiteCounter - 1], serieCounter];
		addEventListeners(temp, "");
		var temp1 = [whiteLabels[whiteCounter], serieCounter];
		addEventListeners(temp1, "");
	}
}

function coveredWhite (id) {
	document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"coveredWhite\" id=\"" + whiteLabels[whiteCounter] + serieCounter + "\"></div>");  
	var temp = [whiteLabels[whiteCounter], serieCounter];
	addEventListeners(temp, "");
}

/* Functions to create piano with correct layout and it's eventlistners */   
var timer;
function createPiano(){
	createWithNbrOfOctaves(6); 
	startAnimation(0);
}

var buildAnimation = [];
function createWithNbrOfOctaves(nbr){
	buildAnimation.push(white);
	buildAnimation.push(both);
	buildAnimation.push(doubleWhite);
	buildAnimation.push(both);
	buildAnimation.push(coveredWhite);
	buildAnimation.push(both);
	buildAnimation.push(doubleWhite);
	buildAnimation.push(both);
	buildAnimation.push(coveredWhite);
	buildAnimation.push(both);
	for(var i=0; i<nbr; i++){
		buildAnimation.push(coveredWhite);
		buildAnimation.push(both);
		buildAnimation.push(doubleWhite);
		buildAnimation.push(both);
		buildAnimation.push(coveredWhite);
		buildAnimation.push(both);
		buildAnimation.push(doubleWhite);
		buildAnimation.push(both);
		buildAnimation.push(coveredWhite);
		buildAnimation.push(both);
	}
	buildAnimation.push(coveredWhite);
	buildAnimation.push(both);
	buildAnimation.push(doubleWhite);
}

function startAnimation(i){
	if(i >= buildAnimation.length){
		placeMarkers(position);
		return;
	}
	buildAnimation[i]();
	i += 1;
	setTimeout(()=>{startAnimation(i)}, 20);
}



/* Letters on keys */
var position = 1;
function placeMarkers(x){
	for(var i=0; i<whiteLabels.length; i++){
		var div = document.createElement("div");
		document.getElementById(whiteLabels[i] + x).innerHTML = "<div class=\"blackText\">" + whiteKeys[i] + "</div>";
		if(i != 2 && i != 6)
			document.getElementById(whiteLabels[i] + x + "#").innerHTML = "<div class=\"whiteText\">" + blackKeys[i] + "</div>";
	}
}
function removeMarkers(x){
	for(var i=0; i<whiteLabels.length; i++){
		document.getElementById(whiteLabels[i] + x).innerHTML = "";
		if(i != 2 && i != 6)
			document.getElementById(whiteLabels[i] + x + "#").innerHTML = "";
	}
}


function chosenTimezone(chosen){
    var text;
    switch(chosen){
        case 1:
            text = "Attack"
            break;
        case 2:
            text = "Decay"
            break;
        case 3:
            text = "Release";
            break;
        default:
    }
    document.getElementById("chosenTimezone").innerHTML = text;
}

function chosenEnvelope(chosen){
    var text;
    switch(chosen){
        case 1:
            text = "Timbre"
            break;
        case 2:
            text = "Pitch"
            break;
        case 3:
            text = "Amplitude";
            break;
        default:
    }
    document.getElementById("chosenEnvelope").innerHTML = text;
	//Here call for update to choose correct graph
}

//Set default
chosenTimezone(1);
chosenEnvelope(1);