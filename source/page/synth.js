class Key{
    note;
    htmlDiv;
    constructor(note,htmlDiv){
        this.note=note;
        this.htmlDiv=htmlDiv;
    }
}

class Piano{
    #whiteLabels = ["C", "D", "E", "F", "G", "A", "B"];
    #whiteKeys = ["q", "w", "e", "r", "t", "y", "u"];
    #blackKeys = ["2", "3", "e", "5", "6", "7", "u"];
    #keyIndex = ["C", "C", "D", "D", "E", "F", "F", "G", "G", "A", "A", "B"];
    #noOfOctaves;
    #key = class {
        note;
        htmlDiv;
        constructor(note,htmlDiv){
        this.note=note;
        this.htmlDiv=htmlDiv;
    }
    }
    #keys=[];
    #htmlDiv="<div id=\"piano\" style=\"position:absolute; left:-100%; top:20%\"></div>"
    constructor(noOfOctaves){
        this.#noOfOctaves=noOfOctaves;
        this.#keys = this.#createKeys();
        console.log(this.#keys);
        this.#spawnPiano();
        this.#addEventListeners();
    }

    #spawnPiano(){
        document.getElementById("piano-container").insertAdjacentHTML("beforeend",this.#htmlDiv);
        let pianoDiv = document.getElementById("piano");
        for (let i = 0; i < this.#keys.length; i++) {
            pianoDiv.insertAdjacentHTML("beforeend",this.#keys[i].htmlDiv);
        }

    }
    slideInPiano(){
        this.#slideInDiv(document.getElementById("piano"));
    }
    #slideInDiv(div){
	    var stopPosition = 0;
	    if (parseInt(div.style.left) < stopPosition )
	    {
	    	div.style.left = parseInt(div.style.left) + 2 + "%";
	    	setTimeout(()=> this.#slideInDiv(div), 8);
    	}
    }
    #mouseDown(note){
        mouseClickKey = note;
        startNote(note)
    }
    #mouseUp(note){
        setKeyColor(note, "lightgrey")
        stopNote(mouseClickKey);
    }
    #setKeyColor(note, color) {
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
    #resetKeyColor(note) {
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
    #addEventListeners(){
        for (let i = 0; i < this.#keys.length; i++) {    
            if(this.#keys[i].note[0].includes("#")){
                this.#addEventListener(this.#keys[i].note,"#");
                this.#addEventListener(this.#keys[i].note,"R");
                this.#addEventListener(this.#keys[i+1].note,"L");
            }else{
                this.#addEventListener(this.#keys[i].note,"");
            }
        }
    }
    #addEventListener(note,extra){
        var id = note[0].substring(0,1) + note[1] + extra;
        document.getElementById(id).onmousedown = ()=> this.#mouseDown(note);
    	document.getElementById(id).onmouseup = ()=> this.#mouseUp(note);
	    document.getElementById(id).onmouseenter = ()=> this.#setKeyColor(note, "lightgrey");
	    document.getElementById(id).onmouseleave = ()=> this.#resetKeyColor(note);
    }
    #createKeys(){
        let bothIndex = [1,3,6,8,10];
        let wbrIndex = [4,11];
        let wblIndex = [0,5];
        let cwIndex = [2,7,9];
        var res = [];
        res.push(new this.#key(["A",0],"<div class=\"white\" id=\"" + "A" +0+ "\"></div>"));
        res.push(new this.#key(["A#",0],"<div class=\"both\"><div class=\"black\" id=\"" + "A"  +0+ "#" + "\"></div><div class=\"leftWhite\" id=\"" + "A"  +0+ "R" + "\"></div><div class=\"rightWhite\" id=\"" + "B"  +0+ "L" + "\"></div></div>"));
        res.push(new this.#key(["B",0],"<div class=\"white borderRight\" id=\"" + "B" +0+ "\"></div>"));
        for (let octave = 1; octave <= this.#noOfOctaves; octave++) {
            for (let j = 0; j < this.#keyIndex.length; j++) {
                if(bothIndex.includes(j))
                    res.push(new this.#key([this.#keyIndex[j]+"#",octave],"<div class=\"both\"><div class=\"black\" id=\"" + this.#keyIndex[j]  +octave+ "#" + "\"></div><div class=\"leftWhite\" id=\"" + this.#keyIndex[j]  +octave+ "R" + "\"></div><div class=\"rightWhite\" id=\"" + this.#keyIndex[j+1]  +octave+ "L" + "\"></div></div>"));
                if(wbrIndex.includes(j))
                    res.push(new this.#key([this.#keyIndex[j],octave],"<div class=\"white borderRight\" id=\"" + this.#keyIndex[j] +octave+ "\"></div>"));    
                if(wblIndex.includes(j))
                    res.push(new this.#key([this.#keyIndex[j],octave],"<div class=\"white borderLeft\" id=\"" + this.#keyIndex[j] +octave+ "\"></div>"));    
                if(cwIndex.includes(j))
                    res.push(new this.#key([this.#keyIndex[j],octave],"<div class=\"coveredWhite\" id=\"" + this.#keyIndex[j] +octave+ "\"></div>"));
            }
            res.push(new this.#key(["C",0],"<div class=\"white borderLeft\" id=\"" + "C" +0+ "\"></div>"));
        }
        return res;
    }
    placeMarkers(x){
        for(var i=0; i<this.#whiteLabels.length; i++){
            var div = document.createElement("div");
            document.getElementById(this.#whiteLabels[i] + x).innerHTML = "<div class=\"blackText\">" + this.#whiteKeys[i] + "</div>";
            if(i != 2 && i != 6)
                document.getElementById(this.#whiteLabels[i] + x + "#").innerHTML = "<div class=\"whiteText\">" + this.#blackKeys[i] + "</div>";
        }
    }
    removeMarkers(x){
        for(var i=0; i<this.#whiteLabels.length; i++){
            document.getElementById(this.#whiteLabels[i] + x).innerHTML = "";
            if(i != 2 && i != 6)
                document.getElementById(this.#whiteLabels[i] + x + "#").innerHTML = "";
        }
    }

}


class Synth {
    #waveFunction;
    #pianoSpawned = false;
    #piano;
    #amplitude = ["t", "1", "1-t", 1, 1, 1, true, true];
    #pitch = ["1-t", "0", "t", 1, 1, 1, true, true];
    #timbre = ["1/2", "1/2", "1/2", 1, 1, 1, true, true];
    #waveParser;
    #envelopeParser;
    constructor(){
        this.#waveParser = new MathParser("x");
        this.#envelopeParser = new MathParser("t");
    }
    /**
     * Set the base soundwave according to a math-expression
     * @param {String} expr 
     */
    setWave(expr){
        this.#waveFunction = this.#waveParser.parse(expr);
    }
    createPiano(){
        this.#piano = new Piano(noOfOctaves);
    }
    #keyCodeToNote(keyCode){}
    #noteToKeyCode(note){}
    #noteToKeyIndex(note){}
    #getWaveFunction(){}
    #getEnvelopeFunction(){}
    #getEnvelopeTime(){}
    #getMaxX(){}
    #parse(){}

}
//document.onload() = bootstrap_synt();

function bootstrap_synt(){
    const synth = new Synth();
}