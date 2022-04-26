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

var blackCodes = [50, 51, "x", 53, 54, 55, "x"]
var whiteCodes = [81, 87, 69, 82, 84, 89, 85];
var whiteLabels = ["C", "D", "E", "F", "G", "A", "B"];
var whiteKeys = ["q", "w", "e", "r", "t", "y", "u"];
var blackKeys = ["2", "3", "e", "5", "6", "7", "u"];
var whiteCounter = 5; 
var serieCounter = 0;

function white(){
    document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"white\" id=\"" + whiteLabels[whiteCounter] + serieCounter + "\"></div>");
    var temp = [whiteLabels[whiteCounter], serieCounter];
    document.getElementById(whiteLabels[whiteCounter] + serieCounter).onmousedown = function() {
        pressedKey(temp)
    };
    document.getElementById(whiteLabels[whiteCounter] + serieCounter).onmouseup = function() {
      releasedKey(temp)
    };
    document.getElementById(whiteLabels[whiteCounter] + serieCounter).onmouseenter = function() {
      enteredKey(temp)
    };
    document.getElementById(whiteLabels[whiteCounter] + serieCounter).onmouseleave = function() {
      leftKey(temp)
    };
}

function both(){
    if(whiteCounter == 6){
        whiteCounter = 0;
        document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"both\"><div class=\"black\" id=\"" + whiteLabels[6]  + serieCounter + "#" + "\"></div><div class=\"leftWhite\" id=\"" + whiteLabels[6]  + serieCounter + "R" + "\"></div><div class=\"rightWhite\" id=\"" +  whiteLabels[0]  + ++serieCounter + "L" + "\"></div></div>");
        var temp = [whiteLabels[6]  + "#", (serieCounter - 1)]
        document.getElementById(whiteLabels[6] + (serieCounter - 1) + "#").onmousedown = function() {
            pressedKey(temp)
        };
        document.getElementById(whiteLabels[6] + (serieCounter - 1) + "#").onmouseup = function() {
            releasedKey(temp)
        };
        document.getElementById(whiteLabels[6] + (serieCounter - 1) + "#").onmouseenter = function() {
            enteredKey(temp)
        };
        document.getElementById(whiteLabels[6] + (serieCounter - 1) + "#").onmouseleave = function() {
            leftKey(temp)
        };
        var temp1 = [whiteLabels[6], (serieCounter - 1)];
        document.getElementById(whiteLabels[6] + (serieCounter - 1) + "R").onmousedown = function() {
            pressedKey(temp1)
        };
        document.getElementById(whiteLabels[6] + (serieCounter - 1) + "R").onmouseup = function() {
            releasedKey(temp1)
        };
        document.getElementById(whiteLabels[6] + (serieCounter - 1) + "R").onmouseenter = function() {
            enteredKey(temp1)
        };
        document.getElementById(whiteLabels[6] + (serieCounter - 1) + "R").onmouseleave = function() {
            leftKey(temp1)
        };
        var temp2 = [whiteLabels[0], serieCounter];
        document.getElementById(whiteLabels[0] + serieCounter + "L").onmousedown = function() {
            pressedKey(temp2)
        };
        document.getElementById(whiteLabels[0] + serieCounter + "L").onmouseup = function() {
            releasedKey(temp2)
        };
        document.getElementById(whiteLabels[0] + serieCounter + "L").onmouseenter = function() {
            enteredKey(temp2)
        };
        document.getElementById(whiteLabels[0] + serieCounter + "L").onmouseleave = function() {
            leftKey(temp2)
        };
    }
    else {
        document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"both\"><div class=\"black\" id=\"" + whiteLabels[whiteCounter]  + serieCounter + "#" + "\"></div><div class=\"leftWhite\" id=\"" + whiteLabels[whiteCounter]  + serieCounter + "R" + "\"></div><div class=\"rightWhite\" id=\"" + whiteLabels[++whiteCounter] + serieCounter + "L" + "\"></div></div>");
        var temp = [whiteLabels[whiteCounter - 1] + "#", serieCounter];
        document.getElementById(whiteLabels[whiteCounter - 1]  + serieCounter + "#").onmousedown = function() {
            pressedKey(temp)
        };
        document.getElementById(whiteLabels[whiteCounter - 1]  + serieCounter + "#").onmouseup = function() {
            releasedKey(temp)
        };
        document.getElementById(whiteLabels[whiteCounter - 1]  + serieCounter + "#").onmouseenter = function() {
            enteredKey(temp)
        };
        document.getElementById(whiteLabels[whiteCounter - 1]  + serieCounter + "#").onmouseleave = function() {
            leftKey(temp)
        };
        var temp1 = [whiteLabels[whiteCounter - 1], serieCounter];
        document.getElementById(whiteLabels[whiteCounter - 1] + serieCounter + "R").onmousedown = function() {
            pressedKey(temp1)
        };
        document.getElementById(whiteLabels[whiteCounter - 1] + serieCounter + "R").onmouseup = function() {
            releasedKey(temp1)
        };
        document.getElementById(whiteLabels[whiteCounter - 1] + serieCounter + "R").onmouseenter = function() {
            enteredKey(temp1)
        };
        document.getElementById(whiteLabels[whiteCounter - 1] + serieCounter + "R").onmouseleave = function() {
            leftKey(temp1)
        };
        var temp2 = [whiteLabels[whiteCounter], serieCounter];
        document.getElementById(whiteLabels[whiteCounter]  + serieCounter + "L").onmousedown = function() {
            pressedKey(temp2)
        };
        document.getElementById(whiteLabels[whiteCounter]  + serieCounter + "L").onmouseup = function() {
            releasedKey(temp2)
        };
        document.getElementById(whiteLabels[whiteCounter]  + serieCounter + "L").onmouseenter = function() {
            enteredKey(temp2)
        };
        document.getElementById(whiteLabels[whiteCounter]  + serieCounter + "L").onmouseleave = function() {
            leftKey(temp2)
        };
    } 
}

function doubleWhite(){
    if(whiteCounter == 6){
        document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"white borderRight\" id=\"" + whiteLabels[whiteCounter++] + serieCounter + "\"></div><div class=\"white borderLeft\" id=\"" + whiteLabels[0] + (++serieCounter) + "\"></div>");
        var temp = [whiteLabels[whiteCounter - 1], (serieCounter - 1)];
        document.getElementById(whiteLabels[whiteCounter - 1]  + (serieCounter - 1)).onmousedown = function() {
            pressedKey(temp)
        };
        document.getElementById(whiteLabels[whiteCounter - 1]  + (serieCounter - 1)).onmouseup = function() {
            releasedKey(temp)
        };
        document.getElementById(whiteLabels[whiteCounter - 1]  + (serieCounter - 1)).onmouseenter = function() {
            enteredKey(temp)
        };
        document.getElementById(whiteLabels[whiteCounter - 1]  + (serieCounter - 1)).onmouseleave = function() {
            leftKey(temp)
        };
        whiteCounter = 0;
        var temp1 = [whiteLabels[0], serieCounter];
        document.getElementById(whiteLabels[0]  + serieCounter).onmousedown = function() {
            pressedKey(temp1)
        };
        document.getElementById(whiteLabels[0]  + serieCounter).onmouseup = function() {
            releasedKey(temp1)
        };
        document.getElementById(whiteLabels[0]  + serieCounter).onmouseenter = function() {
            enteredKey(temp1)
        };
        document.getElementById(whiteLabels[0]  + serieCounter).onmouseleave = function() {
            leftKey(temp1)
        };
    }
    else {
        document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"white borderRight\" id=\"" + whiteLabels[whiteCounter++] + serieCounter + "\"></div><div class=\"white borderLeft\" id=\"" + whiteLabels[whiteCounter] + serieCounter + "\"></div>");
        var temp = [whiteLabels[whiteCounter - 1], serieCounter];
        document.getElementById(whiteLabels[whiteCounter - 1]  + serieCounter).onmousedown = function() {
            pressedKey(temp)
        };
        document.getElementById(whiteLabels[whiteCounter - 1]  + serieCounter).onmouseup = function() {
            releasedKey(temp)
        };
        document.getElementById(whiteLabels[whiteCounter - 1]  + serieCounter).onmouseenter = function() {
            enteredKey(temp)
        };
        document.getElementById(whiteLabels[whiteCounter - 1]  + serieCounter).onmouseleave = function() {
            leftKey(temp)
        };
        var temp1 = [whiteLabels[whiteCounter], serieCounter];
        document.getElementById(whiteLabels[whiteCounter]  + serieCounter).onmousedown = function() {
            pressedKey(temp1)
        };
        document.getElementById(whiteLabels[whiteCounter]  + serieCounter).onmouseup = function() {
            releasedKey(temp1)
        };
        document.getElementById(whiteLabels[whiteCounter]  + serieCounter).onmouseenter = function() {
            enteredKey(temp1)
        };
        document.getElementById(whiteLabels[whiteCounter]  + serieCounter).onmouseleave = function() {
            leftKey(temp1)
        };
    }
}

function coveredWhite (id) {
    document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"coveredWhite\" id=\"" + whiteLabels[whiteCounter] + serieCounter + "\"></div>");  
    var temp = [whiteLabels[whiteCounter], serieCounter];
    document.getElementById(whiteLabels[whiteCounter]  + serieCounter).onmousedown =  function() {
        pressedKey(temp)
    };
    document.getElementById(whiteLabels[whiteCounter]  + serieCounter).onmouseup =  function() {
        releasedKey(temp)
    };
    document.getElementById(whiteLabels[whiteCounter]  + serieCounter).onmouseenter =  function() {
        enteredKey(temp)
    };
    document.getElementById(whiteLabels[whiteCounter]  + serieCounter).onmouseleave =  function() {
        leftKey(temp)
    };
}
function createPiano(){
    white();
    both();
    doubleWhite();
    both();
    coveredWhite();
    both();
    doubleWhite();
    both();
    coveredWhite();
    both();

    coveredWhite(); both(); doubleWhite(); both(); coveredWhite(); both(); doubleWhite(); both(); coveredWhite(); both();
    coveredWhite(); both(); doubleWhite(); both(); coveredWhite(); both(); doubleWhite(); both(); coveredWhite(); both();
    coveredWhite(); both(); doubleWhite(); both(); coveredWhite(); both(); doubleWhite(); both(); coveredWhite(); both();

    coveredWhite();both();doubleWhite();
}

function enteredKey(key){
    if(key[0].includes("#")){
        console.log(key[0].charAt(0) + key[1] + "#")
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


function leftKey(key){
    if(key[0].includes("#")){
        console.log(key[0].charAt(0) + key[1] + "#")
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

function releasedKey(key){
    if(key[0].includes("#")){
        console.log(key[0].charAt(0) + key[1] + "#")
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

function pressedKey(key){
    if(key[0].includes("#")){
        console.log(key[0].charAt(0) + key[1] + "#")
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
    console.log(key); //Tryckt tangent på pianot med musen
    



    //Do not touch below

}

/* KEY handler */ 
document.addEventListener('keydown', lastPressedButton);
document.addEventListener('keyup', releasedButton);
function releasedButton(pressedButton){
    var note = keyCodeToTone(pressedButton.keyCode);
    if (note == undefined)
        return;

    if(note[0].includes("#")){
        console.log(note[0].charAt(0) + note[1] + "#")
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
}
function lastPressedButton(pressedButton){
    switch(pressedButton.keyCode) {
        case 90: //z
            if(position > 1){
                removeMarkers(position);
                placeMarkers(--position);
                
            }
            break;
        case 88: //x
            if(position < 4){
                removeMarkers(position);
                placeMarkers(++position);
            }
            break;        
        default:
          // code block
    }

    var note = keyCodeToTone(pressedButton.keyCode);
    if (note == undefined)
        return;

    if(note[0].includes("#")){
        console.log(note[0].charAt(0) + note[1] + "#")
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
    console.log(note);//Tryckt tangent på pianot med tangentbordet
}
function keyCodeToTone(keyCode){
    if(whiteCodes.indexOf(keyCode) != -1){
        return [whiteLabels[whiteCodes.indexOf(keyCode)], position]; //Tryckt (vit)tangent på pianot med tangentbordet
    }
    else if(blackCodes.indexOf(keyCode) != -1){
        return [whiteLabels[blackCodes.indexOf(keyCode)] + "#", position]; //Tryckt (svart)tangent på pianot med tangentbordet
    }
}

/* TEXT on keys */
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
createPiano();
placeMarkers(position);
