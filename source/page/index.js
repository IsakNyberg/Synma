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


var whiteLabels = ["A", "B", "C", "D", "E", "F", "G"];
var whiteCounter = 0; 
var serieCounter = "0";

function white(){
    document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"white\" id=\"" + whiteLabels[whiteCounter] + serieCounter + "\"></div>");
    var temp = whiteLabels[whiteCounter] + serieCounter;
    document.getElementById(whiteLabels[whiteCounter] + serieCounter).addEventListener("click", function() {
        pressedKey(temp)
      });
}

function both(){
    if(whiteCounter == 6){
        whiteCounter = 0;
        document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"both\"><div class=\"black\" id=\"" + whiteLabels[6]  + serieCounter + "#" + "\"></div><div class=\"leftWhite\" id=\"" + whiteLabels[6]  + serieCounter + "R" + "\"></div><div class=\"rightWhite\" id=\"" +  whiteLabels[0]  + ++serieCounter + "L" + "\"></div></div>");
        var temp = whiteLabels[6] + (serieCounter - 1) + "#"
        document.getElementById(whiteLabels[6] + (serieCounter - 1) + "#").addEventListener("click", function() {
            pressedKey(temp)
        });
        var temp1 = whiteLabels[6] + (serieCounter - 1);
        document.getElementById(whiteLabels[6] + (serieCounter - 1) + "R").addEventListener("click", function() {
            pressedKey(temp1)
        });
        var temp2 = whiteLabels[0] + serieCounter;
        document.getElementById(whiteLabels[0] + serieCounter + "L").addEventListener("click", function() {
            pressedKey(temp2)
        });
    }
    else {
        document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"both\"><div class=\"black\" id=\"" + whiteLabels[whiteCounter]  + serieCounter + "#" + "\"></div><div class=\"leftWhite\" id=\"" + whiteLabels[whiteCounter]  + serieCounter + "R" + "\"></div><div class=\"rightWhite\" id=\"" + whiteLabels[++whiteCounter] + serieCounter + "L" + "\"></div></div>");
        var temp = whiteLabels[whiteCounter - 1]  + serieCounter + "#";
        document.getElementById(whiteLabels[whiteCounter - 1]  + serieCounter + "#").addEventListener("click", function() {
            pressedKey(temp)
        });
        var temp1 = whiteLabels[whiteCounter - 1] + serieCounter;
        document.getElementById(whiteLabels[whiteCounter - 1] + serieCounter + "R").addEventListener("click", function() {
            pressedKey(temp1)
        });
        var temp2 = whiteLabels[whiteCounter] + serieCounter;
        document.getElementById(whiteLabels[whiteCounter]  + serieCounter + "L").addEventListener("click", function() {
            pressedKey(temp2)
        });
    } 
}

function doubleWhite(){
    document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"white borderRight\" id=\"" + whiteLabels[whiteCounter++] + serieCounter + "\"></div><div class=\"white borderLeft\" id=\"" + whiteLabels[whiteCounter] + serieCounter + "\"></div>");
    var temp = whiteLabels[whiteCounter - 1] + serieCounter;
    document.getElementById(whiteLabels[whiteCounter - 1]  + serieCounter).addEventListener("click", function() {
        pressedKey(temp)
    });
    var temp1 = whiteLabels[whiteCounter] + serieCounter;
    document.getElementById(whiteLabels[whiteCounter]  + serieCounter).addEventListener("click", function() {
        pressedKey(temp1)
    });
}

function coveredWhite (id) {
    document.getElementById("piano").insertAdjacentHTML("beforeend", "<div class=\"coveredWhite\" id=\"" + whiteLabels[whiteCounter] + serieCounter + "\"></div>");  
    var temp = whiteLabels[whiteCounter] + serieCounter;
    document.getElementById(whiteLabels[whiteCounter]  + serieCounter).addEventListener("click", function() {
        pressedKey(temp)
    });
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
}


function pressedKey(key){
    console.log(key  + " pressed");
    //alert(key);
}

createPiano();