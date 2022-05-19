class Piano{
	static #PIANO_PARENT_DIV_ID = "piano-container";
	static #PIANO_DIV_ID = "piano";
	static #PIANO_INIT_STYLE = "position:absolute;left:-100%;bot:20%";
	static #PIANO_DIV='<div id="'+this.#PIANO_DIV_ID+'" style='+this.#PIANO_INIT_STYLE+'></div>'; // parent div for the keys.
	static #SHARPS_AND_FLATS_COLOR = "black";
	static #NATURAL_NOTES_COLOR = "white";
	static #HOOVER_COLOR = "lightgrey";
	static #PRESS_COLOR = "darkgrey";
	static #AUTO_PRESS_COLOR = "red";
	
	
	
	static #blackIndecies = [ // Key indecies that are "black" in the range 0-127
		1,3,6,8,10,13,15,18,20,22,25,27,30,32,34,37,39,42,44,46,49,51,54,56,58,
		61,63,66,68,70,73,75,78,80,82,85,87,90,92,94,97,99,102,104,106,109,111,
		114,116,118,121,123,126
	];
	static #keyMarkers = ["q", "2", "w", "3", "e", "r", "5", "t", "6", "y", "7", "u"]; // Key markers mapping keyboard to piano keyboard
	static #keyCodes = [81,50,87,51,69,82,53,84,54,89,55,85]; // the keycodes to the above key-markers
	static #key = class { // key-class
		note;       //note in MIDI-index notation
		htmlDiv;    //the html-div of the key.
		constructor(note,htmlDiv){
			this.note = note;
			this.htmlDiv = htmlDiv;
		}
	}

	#callPressedKey;
	#callReleasedKey;

	#noOfOctaves; // number of octaves to include in the piano
	keys = []; // Colection of all the key objects in the piano
	#synth; // reference to the synth
	#clickedKey = null; // currently clicked key.
	#markersPosition = 1; // the octave to map to the computer keyboard
	#indexPage;
	constructor(synth, indexPage){
		this.#indexPage = indexPage;
		this.#synth = synth;
		this.#noOfOctaves = 9;
		this.keys = this.#createKeys();
		this.#spawnPiano();
		this.addEventListeners();
	}
	setSynth(synth){
		this.#synth = synth;
	}
	// Keys *******************************************************************
	/**
	 * Creates html div for a piano key of a certain type and with a certain id
	 * @param {Number} type 
	 * @param {Number} id 
	 * @returns HTMLElement
	 */
	 #createKeyDiv(type, id) {
		let bothIndex = [1, 3, 6, 8, 10];
		let wbrIndex = [4, 11];
		let wblIndex = [0, 5];
		let cwIndex = [2, 7, 9];
		type %= 12;
		if (bothIndex.includes(type)) {
			var both = document.createElement("Div");
			both.className = "both";
			var black = document.createElement("Div");
			black.id = id.toString();
			black.className = "black";
			both.appendChild(black);
			var lw = document.createElement("Div");
			if(this.#indexPage){
			  lw.id = (id-1).toString() + "R";
			}
			else{
				lw.id = (id+1).toString() + "L"; 
			}
			lw.className = "leftWhite";
			both.appendChild(lw);
			var rw = document.createElement("Div");
			if(this.#indexPage){
				rw.id = (id+1).toString() + "L";
			}
			else{
			rw.id = (id-1).toString() + "R";		
			}
			rw.className = "rightWhite";
			both.appendChild(rw);
			return both;
		} else if (wbrIndex.includes(type)) {
			var borderRight = document.createElement("Div");
			borderRight.className = "white borderRight";
			borderRight.id = id.toString();
			return borderRight;
		} else if (wblIndex.includes(type)) {
			var borderLeft = document.createElement("Div");
			borderLeft.className = "white borderLeft";
			borderLeft.id = id.toString();
			return borderLeft;
		} else if (cwIndex.includes(type)) {
			var coveredWhite = document.createElement("Div");
			coveredWhite.className = "coveredWhite";
			coveredWhite.id = id.toString();
			return coveredWhite;
		}
		console.error("Invalid id (not good :O })");
	}
	/**
	 * Creates an array of all the key-objects which the piano will contain. 
	 * @returns {Array<Key>}
	 */
	 #createKeys(){
		var res = [];
		if(this.#indexPage){
			for (let octave = 0; octave <= this.#noOfOctaves; octave++) {
				for (let j = 0; j < 12; j++) {
					let id = 12*octave + j;
					res.push(new Piano.#key(id, this.#createKeyDiv(j, id)));
				}
			}

			for (let j = 0; j <= 7; j++) {
				let lastOctave = 10;
				let id = 12 * lastOctave + j;
				res.push(new Piano.#key(id , this.#createKeyDiv(j, id)));
			}
		}
		else{
			for (let j = 7; j >= 0; j--) {
				let lastOctave = 10;
				let id = 12 * lastOctave + j;
				res.push(new Piano.#key(id , this.#createKeyDiv(j, id)));
			}
	
			for (let octave = this.#noOfOctaves; octave >= 0; octave--) {
				for (let j = 11; j >=0; j--) {
					let id = 12*octave + j;
					res.push(new Piano.#key(id, this.#createKeyDiv(j, id)));
				}
			}
		}
		
		return res;
	}
	// ************************************************************************
	// HTML *****************************************************************************************
	/**
	 * Creates a html piano-div and inserts all the keys' html.
	 */
	#spawnPiano(){
		if(this.#indexPage){
			document.getElementById(Piano.#PIANO_PARENT_DIV_ID).insertAdjacentHTML("beforeend", Piano.#PIANO_DIV);
		}
		else {
			document.getElementById(Piano.#PIANO_PARENT_DIV_ID).insertAdjacentHTML("beforeend", '<div id="'+ Piano.#PIANO_DIV_ID +'"></div>');
		}
		let pianoDiv = document.getElementById(Piano.#PIANO_DIV_ID);
		for (let i = 0; i < this.keys.length; i++) {
			pianoDiv.appendChild(this.keys[i].htmlDiv);
		}
		if(this.#indexPage){
			this.#placeMarkers(this.#markersPosition);
		}
	}
	/**
	 * Animation for sliding in the piano-div.
	 */
	slideInPiano(){
		this.#slideInDiv(document.getElementById(Piano.#PIANO_DIV_ID));
	}
	/**
	 * Slides in a div-element into window.
	 * @param {HTMLElement} div 
	 */
	#slideInDiv(div){
		var stopPosition = 0;
		if (parseInt(div.style.left) < stopPosition ) {
			div.style.left = parseInt(div.style.left) + 2 + "%";
			setTimeout(()=> this.#slideInDiv(div), 8);
		}
	}
	// ***************************************************************************************************************************

	//USER INPUT *****************************************************************************************************************
	/**
	 * Adds the event-listeners required by the piano.
	 */
	addEventListeners(){
		for (let keyIndex = 0; keyIndex < this.keys.length; keyIndex++) {
			let divs = this.#getKeyDivsFromKeyIndex(keyIndex);
			for (let j = 0; j < divs.length; j++) {
				divs[j].onmousedown = () => this.#mouseDown(keyIndex);
				divs[j].onmouseup = () => this.#mouseUp(keyIndex);
				divs[j].onmouseenter = () => this.setKeyColor(keyIndex, Piano.#HOOVER_COLOR);
				divs[j].onmouseleave = () => this.resetKeyColor(keyIndex);
			}
		}
		this.#callPressedKey = (keyCode) => this.#pressedKey(keyCode);
		this.#callReleasedKey = (keyCode) => this.#releasedKey(keyCode);
		document.addEventListener('keydown', this.#callPressedKey);
		document.addEventListener('keyup', this.#callReleasedKey);
	}
	removeEventListeners() {
		var old_element = document.getElementById(Piano.#PIANO_DIV_ID);
		var new_element = old_element.cloneNode(true);
		old_element.parentNode.replaceChild(new_element, old_element);
		document.removeEventListener('keydown', this.#callPressedKey);
		document.removeEventListener('keyup', this.#callReleasedKey);
	}

	/**
	 * Onclick
	 * @param {Number} id 
	 */
	#mouseDown(keyIndex){
		this.#clickedKey = keyIndex;
		this.setKeyColor(keyIndex, Piano.#PRESS_COLOR);
		this.#synth.startNote(keyIndex);
	}
	/**
	 * Onclick release
	 * @param {Number} keyIndex 
	 */
	#mouseUp(keyIndex){
		this.setKeyColor(keyIndex, Piano.#HOOVER_COLOR)
		this.#synth.stopNote(this.#clickedKey);
	}
	/**
	 * Gets the corresponding html-divs to the specified keyIndex 
	 * @param {Number} keyIndex 
	 * @returns {Array<HTMLElement>} 
	 */
	#getKeyDivsFromKeyIndex(keyIndex) {
		var key = document.getElementById(keyIndex);
		var potentialLeft = document.getElementById(keyIndex+"L");
		var potentialRight = document.getElementById(keyIndex+"R");
		var res = [key];
		if (potentialLeft != undefined) {
			res.push(potentialLeft);
		}
		if (potentialRight != undefined) {
			res.push(potentialRight);
		} 
		return res;
	}
	/**
	 * Onkeypress
	 * @param {KeyboardEvent} pressedKey 
	 * @returns {void}
	 */
	#pressedKey(pressedKey){
		if(!(document.activeElement.tagName === "BODY")) { //Requires that other events in the program blurs activeElement.
			return;
		}
		if(pressedKey.keyCode == 90){
			this.#removeMarkers(this.#markersPosition);
			this.#markersPosition = Math.max(--this.#markersPosition, 0);
			this.#placeMarkers(this.#markersPosition);
			this.#turnOffAndReset();
			return;
		}
		if(pressedKey.keyCode == 88){
			this.#removeMarkers(this.#markersPosition);
			this.#markersPosition = Math.min(++this.#markersPosition, this.#noOfOctaves);
			this.#placeMarkers(this.#markersPosition);
			this.#turnOffAndReset();
			return;
		}

		var keyIndex = this.#keyCodeToNote(pressedKey.keyCode);
		if (keyIndex === undefined) {
			return;
		}
		this.setKeyColor(keyIndex, Piano.#PRESS_COLOR);
		this.#synth.startNote(keyIndex);
	}
	/**
	 * Onkeyrelease
	 * @param {KeyboardEvent} pressedKey 
	 * @returns {void}
	 */
	#releasedKey(pressedKey){
		if(!(document.activeElement.tagName === "BODY"))
			return;
		var keyIndex = this.#keyCodeToNote(pressedKey.keyCode);
		if (keyIndex == undefined) {
			return;
		}
		this.#synth.stopNote(keyIndex);
		this.resetKeyColor(keyIndex);
	}
	/**
	 * Forces a mock-release on all pressed keys.
	 */
	#turnOffAndReset(){
		for(var i = 0; i< this.keys.length; i++) {
			this.resetKeyColor(i);
			this.#synth.stopNote(i);
		}
	}
	/**
	 * Sets the color of the key with the specied index
	 * @param {Number} index 
	 * @param {String} color 
	 */
	setKeyColor(index, color) {
		var divs = this.#getKeyDivsFromKeyIndex(index);
		for (let i = 0; i < divs.length; i++) {
			divs[i].style.backgroundColor = color;
		}
	}
	/**
	 * Resets the keycolor (called when the key is released) to either white or black depending on index.
	 * @param {Number} index - keyIndex
	 */
	resetKeyColor(index) {
		if(Piano.#blackIndecies.includes(index)){
			document.getElementById(index).style.backgroundColor = Piano.#SHARPS_AND_FLATS_COLOR;
		} else {
			var divs = this.#getKeyDivsFromKeyIndex(index);
			for (let i = 0; i < divs.length; i++) {
				divs[i].style.backgroundColor = Piano.#NATURAL_NOTES_COLOR;
			}
		}
	}
	/**
	 * returns the equivalent keyindex on the synt given a keycode for a computer key.
	 * @param {Number} keyCode - The keycode for pressed key on the computer keyboard (ascii)
	 * @returns 
	 */
	#keyCodeToNote(keyCode){
		if(Piano.#keyCodes.includes(keyCode))
			return this.#markersPosition*12 + Piano.#keyCodes.indexOf(keyCode);
	}
	/**
	 * Marks and maps the keys in the octave to computer keys qwerty(white), 23567 (black).
	 * @param {Number} x - - The octave to be marked and mapped to the computer keyboard 
	 */
	#placeMarkers(x){
		if(this.#indexPage){
			for(var i = 0; i < Piano.#keyMarkers.length; i++){
				let keyIndex = 12*x+i;
				if(!(Piano.#blackIndecies.includes(keyIndex)))
					document.getElementById(keyIndex).innerHTML = "<div class=\"blackText\">" + Piano.#keyMarkers[i] + "</div>";
				else
					document.getElementById(keyIndex).innerHTML = "<div class=\"whiteText\">" + Piano.#keyMarkers[i] + "</div>";
			}
		}
	}
	/**
	 * 
	 * @param {Number} x - The octave to be unmarked and unmapped from the computer keyboard 
	 */
	#removeMarkers(x){
		if(this.#indexPage){
			for(var i = 0; i < Piano.#keyMarkers.length; i++) 
				document.getElementById(12*x+i).innerHTML = "";
		}
	}
	// ***************************************************************************************************************************
}
