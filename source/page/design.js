var blackCodes = [50, 51, "x", 53, 54, 55, "x"]
var whiteCodes = [81, 87, 69, 82, 84, 89, 85];
var whiteLabels = ["C", "D", "E", "F", "G", "A", "B"];
var whiteKeys = ["q", "w", "e", "r", "t", "y", "u"];
var blackKeys = ["2", "3", "e", "5", "6", "7", "u"];
var whiteCounter = 5; 
var serieCounter = 0;

var playing = new Array(128);       //Booleans to manage sound playing
for(var i=0; i<playing.length; i++)
    playing[i] = false;

var pianoSpawned = false;
document.getElementById("functionButton").onclick = function() {
    if(!pianoSpawned){
        createPiano();
        pianoSpawned = !pianoSpawned;
    }
};

/* Creating keys and their event listeners */
function addEventListeners(key, extra){
    var id = key[0] + key[1] + extra;
    if(extra == "#")
        key = [key[0] + extra, key[1]];
    document.getElementById(id).onmousedown = function() {
        mouseDown(key)
    };
    document.getElementById(id).onmouseup = function() {
      mouseUp(key)
    };
    document.getElementById(id).onmouseenter = function() {
      mouseEnter(key)
    };
    document.getElementById(id).onmouseleave = function() {
      mouseLeave(key)
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
    console.log("körs")
    var commands = createWithNbrOfOctaves(3); 
	timer = setInterval(startAnimation, 20);
}

function startAnimation(){
    console.log("tick " + i);
    result[i++]();
    if(i == result.length){
        clearInterval(timer);
        placeMarkers(position);
    }
}

var result = [];
var i = 0;
function createWithNbrOfOctaves(nbr){
    result.push(white);    result.push(both);    result.push(doubleWhite);    result.push(both);    result.push(coveredWhite);    result.push(both);    result.push(doubleWhite);    result.push(both);    result.push(coveredWhite);    result.push(both);
    for(var i=0; i<nbr; i++){
        result.push(coveredWhite); result.push(both); result.push(doubleWhite); result.push(both); result.push(coveredWhite); result.push(both); result.push(doubleWhite); result.push(both); result.push(coveredWhite); result.push(both);
    }
    result.push(coveredWhite);   result.push(both);     result.push(doubleWhite);
}


/* Handles mouse clicks and hover */
function mouseEnter(key){
    if(key[0].includes("#")){
        document.getElementById(key[0].charAt(0) + key[1] + "#").style.backgroundColor = "lightgrey";
    }
    else{
        var id = key[0] + key[1];
        document.getElementById(id).style.backgroundColor = "lightgrey";
        var potentialLeft = document.getElementById(id+"L");
        var potentialRight = document.getElementById(id+"R");
        if(potentialLeft != null) 
            document.getElementById(id+"L").style.backgroundColor = "lightgrey";
        if(potentialRight != null) 
            document.getElementById(id+"R").style.backgroundColor = "lightgrey";
    }
}

function mouseLeave(key){
    if(key[0].includes("#")){
        document.getElementById(key[0].charAt(0) + key[1] + "#").style.backgroundColor = "black";
    }
    else{
        var id = key[0] + key[1];
        document.getElementById(id).style.backgroundColor = "white";
        var potentialLeft = document.getElementById(id+"L");
        var potentialRight = document.getElementById(id+"R");
        if(potentialLeft != null) 
            document.getElementById(id+"L").style.backgroundColor = "white";
        if(potentialRight != null) 
            document.getElementById(id+"R").style.backgroundColor = "white";
    }
}

function mouseUp(key){
    if(key[0].includes("#")){
        document.getElementById(key[0].charAt(0) + key[1] + "#").style.backgroundColor = "lightgrey";
    }
    else{
        var id = key[0] + key[1];
        document.getElementById(id).style.backgroundColor = "lightgrey";
        var potentialLeft = document.getElementById(id+"L");
        var potentialRight = document.getElementById(id+"R");
        if(potentialLeft != null) 
            document.getElementById(id+"L").style.backgroundColor = "lightgrey";
        if(potentialRight != null) 
            document.getElementById(id+"R").style.backgroundColor = "lightgrey";
    }
    stopNote(key);
}

function mouseDown(key){
    if(key[0].includes("#")){
        document.getElementById(key[0].charAt(0) + key[1] + "#").style.backgroundColor = "grey";
    }
    else{
        var id = key[0] + key[1];
        document.getElementById(id).style.backgroundColor = "grey";
        var potentialLeft = document.getElementById(id+"L");
        var potentialRight = document.getElementById(id+"R");
        if(potentialLeft != null) 
            document.getElementById(id+"L").style.backgroundColor = "grey";
        if(potentialRight != null) 
            document.getElementById(id+"R").style.backgroundColor = "grey";
    }

    startNote(key);



    //Do not touch below

}

/* Key handler */ 
document.addEventListener('keydown', pressedKey);
document.addEventListener('keyup', releasedKey);
function releasedKey(pressedKey){
    var note = keyCodeToTone(pressedKey.keyCode);
    if (note == undefined)
        return;
    
    if(playing[pressedKey.keyCode]){
        playing[pressedKey.keyCode] = false;
        if(note[0].includes("#")){
            document.getElementById(note[0].charAt(0) + note[1] + "#").style.backgroundColor = "black";
        }
        else{
            var id = note[0] + note[1];
            document.getElementById(id).style.backgroundColor = "white";
            var potentialLeft = document.getElementById(id+"L");
            var potentialRight = document.getElementById(id+"R");
            if(potentialLeft != null) 
                document.getElementById(id+"L").style.backgroundColor = "white";
            if(potentialRight != null) 
                document.getElementById(id+"R").style.backgroundColor = "white";
        }

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
            if(position < 4 && pianoSpawned){
                removeMarkers(position);
                placeMarkers(++position);
            }
            break;        
        default:
    }
    var note = keyCodeToTone(pressedKey.keyCode);
    if (note == undefined)
        return;

    if(!playing[pressedKey.keyCode]){
        playing[pressedKey.keyCode] = true;
        if(note[0].includes("#")){
            document.getElementById(note[0].charAt(0) + note[1] + "#").style.backgroundColor = "grey";
        }
        else{
            var id = note[0] + note[1];
            document.getElementById(id).style.backgroundColor = "grey";
            var potentialLeft = document.getElementById(id+"L");
            var potentialRight = document.getElementById(id+"R");
            if(potentialLeft != null) 
                document.getElementById(id+"L").style.backgroundColor = "grey";
            if(potentialRight != null) 
                document.getElementById(id+"R").style.backgroundColor = "grey";
        }

        startNote(note);
    }
}
function keyCodeToTone(keyCode){
    if(whiteCodes.indexOf(keyCode) != -1){
        return [whiteLabels[whiteCodes.indexOf(keyCode)], position]; //Tryckt (vit)tangent på pianot med tangentbordet
    }
    else if(blackCodes.indexOf(keyCode) != -1){
        return [whiteLabels[blackCodes.indexOf(keyCode)] + "#", position]; //Tryckt (svart)tangent på pianot med tangentbordet
    }
}



/* Letters on keys */
var position = 1;
function placeMarkers(x){
    for(var i=0; i<whiteLabels.length; i++){
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
