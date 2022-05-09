let noteFreq = initFreqs();
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
        this.freq=noteFreq[note[1]][note[0]];
        }
    }
    keys=[];
    #synth;
    #clickedKey = null;
    playing=[];
    #markersPosition = 1;

    #htmlDiv="<div id=\"piano\" style=\"position:absolute; left:-100%; top:20%\"></div>"
    constructor(synth){
        this.#synth = synth;
        this.#noOfOctaves=synth.noOfOctaves;
        this.keys = this.#createKeys();
        console.log(this.keys);
        this.#spawnPiano();
        this.#addEventListeners();
    }
    // Keys **********************************************************************************************************************
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
        }
        res.push(new this.#key(["C",0],"<div class=\"white borderLeft\" id=\"" + "C" +0+ "\"></div>"));
        return res;
    }
    // ***************************************************************************************************************************
    // HTML **********************************************************************************************************************
    #spawnPiano(){
        document.getElementById("piano-container").insertAdjacentHTML("beforeend",this.#htmlDiv);
        let pianoDiv = document.getElementById("piano");
        for (let i = 0; i < this.keys.length; i++) {
            pianoDiv.insertAdjacentHTML("beforeend",this.keys[i].htmlDiv);
        }
        this.#placeMarkers(this.#markersPosition);
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
    // ***************************************************************************************************************************

    //USER INPUT *****************************************************************************************************************
    #addEventListeners(){
        for (let i = 0; i < this.keys.length; i++) {    
            if(this.keys[i].note[0].includes("#")){
                this.#addEventListener(this.keys[i].note,"#");
                this.#addEventListener(this.keys[i].note,"R");
                this.#addEventListener(this.keys[i+1].note,"L");
            }else{
                this.#addEventListener(this.keys[i].note,"");
            }
        }
        document.addEventListener('keydown', this.#pressedKey);
        document.addEventListener('keyup', this.#releasedKey);
    }
    #addEventListener(note,extra){
        var id = note[0].substring(0,1) + note[1] + extra;
        document.getElementById(id).onmousedown = ()=> this.#mouseDown(note);
    	document.getElementById(id).onmouseup = ()=> this.#mouseUp(note);
	    document.getElementById(id).onmouseenter = ()=> this.setKeyColor(note, "lightgrey");
	    document.getElementById(id).onmouseleave = ()=> this.#resetKeyColor(note);
    }
    #mouseDown(note){
        this.#clickedKey = note;
        this.#synth.startNote(note)
    }
    #mouseUp(note){
        this.setKeyColor(note, "lightgrey")
        this.#synth.stopNote(this.#clickedKey);
    }
    #releasedKey(pressedKey){
        var note = this.#keyCodeToNote(pressedKey.keyCode);
        if (note == undefined) {
            return;
        }
        if(playing[noteToKeyIndex(note)]){
            this.#resetKeyColor(note);
            this.#synth.stopNote(note);
        }
    }
    #turnOffAndReset(){
        for(var i=0; i<playing.length; i++) {
            if (playing[i]){
                this.#resetKeyColor(keyIndexToNote(i));
                this.#synth.stopNote(keyIndexToNote(i));
            }
        }
    }
    getFunctionDiv() {
        return document.getElementById("functionInput");
    }
    getFunction2Div() {
        return document.getElementById("env-functionInput");
    }
    getLengthDiv() {
        return document.getElementById("env-timeInput");
    }
    getMaxXDiv() {
        return document.getElementById("maxXInput");
    }
    #pressedKey(pressedKey){
        if(!(getMaxXDiv() == document.activeElement || getFunctionDiv() == document.activeElement || getFunction2Div() == document.activeElement || getLengthDiv()  == document.activeElement)){
            this.#removeMarkers(this.#markersPosition);
            if(pressedKey.keyCode == 90)
                this.#placeMarkers(--this.#markersPosition);
            if(pressedKey.keyCode == 88)
                this.#placeMarkers(++this.#markersPosition);
            this.#turnOffAndReset();
        }
        var note = this.#keyCodeToNote(pressedKey.keyCode);
        if (note == undefined || getMaxXDiv() == document.activeElement || getFunctionDiv() == document.activeElement || getFunction2Div() == document.activeElement || getLengthDiv()  == document.activeElement || !pianoSpawned)
            return;
        startNote(note);
    }
    setKeyColor(note, color) {
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
    #keyCodeToNote(keyCode){
        if(whiteCodes.indexOf(keyCode) != -1){
            return [whiteLabels[whiteCodes.indexOf(keyCode)], position];
        }
        else if(blackCodes.indexOf(keyCode) != -1){
            return [whiteLabels[blackCodes.indexOf(keyCode)] + "#", position];
        }
    }
    #placeMarkers(x){
        for(var i=0; i<this.#whiteLabels.length; i++){
            var div = document.createElement("div");
            document.getElementById(this.#whiteLabels[i] + x).innerHTML = "<div class=\"blackText\">" + this.#whiteKeys[i] + "</div>";
            if(i != 2 && i != 6)
                document.getElementById(this.#whiteLabels[i] + x + "#").innerHTML = "<div class=\"whiteText\">" + this.#blackKeys[i] + "</div>";
        }
    }
    #removeMarkers(x){
        for(var i=0; i<this.#whiteLabels.length; i++){
            document.getElementById(this.#whiteLabels[i] + x).innerHTML = "";
            if(i != 2 && i != 6)
                document.getElementById(this.#whiteLabels[i] + x + "#").innerHTML = "";
        }
    }
    // ***************************************************************************************************************************
    
    

}


class Synth {
    #audioContext = null;
    #masterVolume = null;
    #waveFunction;
    #envFunctions={
        "amplitude" : {
            "attack" : [()=>1,0.1], "decay" : [()=>1,0.1], "release" : [()=>1,0.1]
        }, "pitch" : {
            "attack" : [()=>0,0.1], "decay" : [()=>0,0.1], "release" : [()=>0,0.1]
        }, "timbre" : {
            "attack" : [()=>0.5,0.1], "decay" : [()=>0.5,0.1], "release" : [()=>0.5,0.1]
        }
    };
    #releaseLen;
    #ampEnvelope;
    #envSamples=100;
    #pitchEnvelope;
    #timbreEnvelope;
    #baseNote;
    #waveforms;
    #maxX;
    noOfOctaves=7;
    #pianoSpawned = false;
    #piano;
    #amplitude = ["t", "1", "1-t", 1, 1, 1, true, true];
    #pitch = ["1-t", "0", "t", 1, 1, 1, true, true];
    #timbre = ["1/2", "1/2", "1/2", 1, 1, 1, true, true];
    #waveParser;
    #envelopeParser;
    constructor(){
        this.#waveforms = [];
        this.#waveParser = new MathParser("t");
        this.#envelopeParser = new MathParser("t");
        this.#addEventListeners();
        this.#createPiano();
        
    }

    /**
     * Set the base soundwave according to a math-expression
     * @param {String} expr 
     */
    #setWave(){
        this.#audioContext = new AudioContext();
        this.#masterVolume = this.#audioContext.createGain()
        this.#waveFunction = this.#waveParser.parse(document.getElementById("functionInput").value);
        this.#maxX=parseFloat(document.getElementById("maxXInput").value);
        this.#createEnvelopes();
        this.#createBase();
        this.#createWaveforms();
    }
    //***********************************************************************************************************************
    #createBase(){
        this.#baseNote = WaveForm.computeBase(this.#audioContext, this.#waveFunction, this.#maxX, 4410);
    }
    #createWaveforms(){
        for (let i = 0; i < this.noOfOctaves*12 + 4; i++) {
            this.#waveforms.push(new WaveForm(this.#audioContext,this.#baseNote,this.#piano.keys[i].freq));
        }
    }
    //***********************************************************************************************************************
    #getEnvelopes(){
        this.#envFunctions[
            document.getElementById("chosenEnvelope").innerHTML.toLowerCase()
        ][
            document.getElementById("chosenTimezone").innerHTML.toLowerCase()
        ] = [this.#waveParser.parse(document.getElementById("env-function").value),parseFloat(document.getElementById("env-timeInput").value)];
    }
    #createEnvelopes(){
        this.#releaseLen = this.#envFunctions["amplitude"]["release"][1];
        this.#ampEnvelope = new AmpEnvelope(
            this.#envFunctions["amplitude"]["attack"][0],
            this.#envFunctions["amplitude"]["decay"][0],
            this.#envFunctions["amplitude"]["release"][0],
            this.#envSamples,
            this.#envFunctions["amplitude"]["attack"][1],
            this.#envFunctions["amplitude"]["decay"][1],
            this.#envFunctions["amplitude"]["release"][1],
            this.#audioContext
        );
        this.#pitchEnvelope = new PitchEnvelope(
            this.#envFunctions["pitch"]["attack"][0],
            this.#envFunctions["pitch"]["decay"][0],
            this.#envFunctions["pitch"]["release"][0],
            this.#envSamples,
            this.#envFunctions["pitch"]["attack"][1],
            this.#envFunctions["pitch"]["decay"][1],
            this.#envFunctions["pitch"]["release"][1],
            this.#audioContext
        );
        this.#timbreEnvelope = new TimbreEnvelope(
            this.#envFunctions["timbre"]["attack"][0],
            this.#envFunctions["timbre"]["decay"][0],
            this.#envFunctions["timbre"]["release"][0],
            this.#envSamples,
            this.#envFunctions["timbre"]["attack"][1],
            this.#envFunctions["timbre"]["decay"][1],
            this.#envFunctions["timbre"]["release"][1],
            this.#audioContext
        );
    }
    //***********************************************************************************************************************
    #createPiano(){
        this.#piano = new Piano(this);
    }
    //***********************************************************************************************************************
    #addEventListeners(){
        document.getElementById("functionButton").onclick = ()=>this.#setWave();
        document.getElementById("env-functionButton").onclick = ()=>this.#getEnvelopes();
    }
    //***********************************************************************************************************************
    startNote(note){
        if (this.#piano.playing[note])
            return;
        const wf = new WaveForm(this.#audioContext, this.#baseNote);
        this.#waveforms[note] = wf;		
        this.#ampEnvelope.apply_attack(wf.bufferGain);
        this.#ampEnvelope.apply_decay(wf.bufferGain);
        this.#piano.playing[note] = true;
        this.#piano.setKeyColor(note, "darkgrey");
        var input = document.getElementById("functionInput");
        if(input != document.activeElement){
            //if (isNormalized) {
            //    wf.normalizeBuffer();
            //}
            let freq = noteFreq[note[1]][note[0]];
            wf.playBuffer(freq);
        }
        
    }
    stopNote(note){
        if (!this.#piano.playing[note]) 
            return;
        this.#piano.playing[note] = false;
        this.#ampEnvelope.apply_release(this.#waveforms[note].bufferGain);
        this.#waveforms[note].stopBuffer(this.#releaseLen);
    }
    setMasterVolume(){

    }

}
window.onload = bootstrap_synt();

function bootstrap_synt(){
    const synth = new Synth();
}