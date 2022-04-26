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
var whiteCounter = 0; 
var serieCounter = 0;

function white(){
    document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"white\" id=\"" + whiteLabels[whiteCounter] + serieCounter + "\"></div>");
    var temp = [whiteLabels[whiteCounter], serieCounter];
    document.getElementById(whiteLabels[whiteCounter] + serieCounter).addEventListener("click", function() {
        pressedKey(temp)
      });
}

function both(){
    if(whiteCounter == 6){
        whiteCounter = 0;
        document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"both\"><div class=\"black\" id=\"" + whiteLabels[6]  + serieCounter + "#" + "\"></div><div class=\"leftWhite\" id=\"" + whiteLabels[6]  + serieCounter + "R" + "\"></div><div class=\"rightWhite\" id=\"" +  whiteLabels[0]  + ++serieCounter + "L" + "\"></div></div>");
        var temp = [whiteLabels[6]  + "#", (serieCounter - 1)]
        document.getElementById(whiteLabels[6] + (serieCounter - 1) + "#").addEventListener("click", function() {
            pressedKey(temp)
        });
        var temp1 = [whiteLabels[6], (serieCounter - 1)];
        document.getElementById(whiteLabels[6] + (serieCounter - 1) + "R").addEventListener("click", function() {
            pressedKey(temp1)
        });
        var temp2 = [whiteLabels[0], serieCounter];
        document.getElementById(whiteLabels[0] + serieCounter + "L").addEventListener("click", function() {
            pressedKey(temp2)
        });
    }
    else {
        document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"both\"><div class=\"black\" id=\"" + whiteLabels[whiteCounter]  + serieCounter + "#" + "\"></div><div class=\"leftWhite\" id=\"" + whiteLabels[whiteCounter]  + serieCounter + "R" + "\"></div><div class=\"rightWhite\" id=\"" + whiteLabels[++whiteCounter] + serieCounter + "L" + "\"></div></div>");
        var temp = [whiteLabels[whiteCounter - 1] + "#", serieCounter];
        document.getElementById(whiteLabels[whiteCounter - 1]  + serieCounter + "#").addEventListener("click", function() {
            pressedKey(temp)
        });
        var temp1 = [whiteLabels[whiteCounter - 1], serieCounter];
        document.getElementById(whiteLabels[whiteCounter - 1] + serieCounter + "R").addEventListener("click", function() {
            pressedKey(temp1)
        });
        var temp2 = [whiteLabels[whiteCounter], serieCounter];
        document.getElementById(whiteLabels[whiteCounter]  + serieCounter + "L").addEventListener("click", function() {
            pressedKey(temp2)
        });
    } 
}

function doubleWhite(){
    if(whiteCounter == 6){
        document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"white borderRight\" id=\"" + whiteLabels[whiteCounter++] + serieCounter + "\"></div><div class=\"white borderLeft\" id=\"" + whiteLabels[0] + (++serieCounter) + "\"></div>");
        var temp = [whiteLabels[whiteCounter - 1], (serieCounter - 1)];
        document.getElementById(whiteLabels[whiteCounter - 1]  + (serieCounter - 1)).addEventListener("click", function() {
            pressedKey(temp)
        });
        whiteCounter = 0;
        var temp1 = [whiteLabels[0], serieCounter];
        document.getElementById(whiteLabels[0]  + serieCounter).addEventListener("click", function() {
            pressedKey(temp1)
        });
    }
    else {
        document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"white borderRight\" id=\"" + whiteLabels[whiteCounter++] + serieCounter + "\"></div><div class=\"white borderLeft\" id=\"" + whiteLabels[whiteCounter] + serieCounter + "\"></div>");
        var temp = [whiteLabels[whiteCounter - 1], serieCounter];
        document.getElementById(whiteLabels[whiteCounter - 1]  + serieCounter).addEventListener("click", function() {
            pressedKey(temp)
        });
        var temp1 = [whiteLabels[whiteCounter], serieCounter];
        document.getElementById(whiteLabels[whiteCounter]  + serieCounter).addEventListener("click", function() {
            pressedKey(temp1)
        });
    }
}

function coveredWhite (id) {
    document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"coveredWhite\" id=\"" + whiteLabels[whiteCounter] + serieCounter + "\"></div>");  
    var temp = [whiteLabels[whiteCounter], serieCounter];
    document.getElementById(whiteLabels[whiteCounter]  + serieCounter).addEventListener("click", function() {
        pressedKey(temp)
    });
}
function createPiano(){
    white();
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

    coveredWhite();both();white();
}

function pressedKey(key){
    console.log(key); //Tryckt tangent på pianot med musen
    
    //Do not touch below

}

/* KEY handler */ 
document.addEventListener('keydown', lastPressedButton);
function lastPressedButton(pressedButton){
    switch(pressedButton.keyCode) {
        case 90: //z
            if(position > 0){
                removeMarkers(position);
                placeMarkers(--position);
                
            }
            break;
        case 88: //x
            if(position < 3){
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
var position = 0;
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
