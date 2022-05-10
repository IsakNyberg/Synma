class Piano{
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
	#noOfOctaves; // number of octaves to include in the piano
	keys = []; // Colection of all the key objects in the piano
	#synth; // reference to the synth
	#clickedKey = null; // currently clicked key.
	#markersPosition = 1; // the octave to map to the computer keyboard
	#htmlDiv='<div id="piano" style="position:absolute;left:-100%;top:20%"></div>'; // parent div for the piano.
	constructor(synth){
		this.#synth = synth;
		this.#noOfOctaves = 9;
		this.keys = this.#createKeys();
		this.#spawnPiano();
		this.#addEventListeners();
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
			lw.id = (id-1).toString() + "R"; 
			lw.className = "leftWhite";
			both.appendChild(lw);
			var rw = document.createElement("Div");
			rw.id = (id+1).toString() + "L";
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
		console.log("Invalid id (not good :O })");
	}
	/**
	 * Creates an array of all the key-objects which the piano will contain. 
	 * @returns {Array<Key>}
	 */
	#createKeys(){
		var res = [];
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

		return res;
	}
	// ************************************************************************
	// HTML *****************************************************************************************
	/**
	 * Creates a html piano-div and inserts all the keys' html.
	 */
	#spawnPiano(){
		document.getElementById("piano-container").insertAdjacentHTML("beforeend", this.#htmlDiv);
		let pianoDiv = document.getElementById("piano");
		for (let i = 0; i < this.keys.length; i++) {
			pianoDiv.appendChild(this.keys[i].htmlDiv);
		}
		this.#placeMarkers(this.#markersPosition);
	}
	/**
	 * Animation for sliding in the piano-div.
	 */
	slideInPiano(){
		this.#slideInDiv(document.getElementById("piano"));
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
	#addEventListeners(){
		for (let keyIndex = 0; keyIndex < this.keys.length; keyIndex++) {
			let divs = this.#getKeyDivsFromKeyIndex(keyIndex);
			for (let j = 0; j < divs.length; j++) {
				divs[j].onmousedown = () => this.#mouseDown(keyIndex);
				divs[j].onmouseup = () => this.#mouseUp(keyIndex);
				divs[j].onmouseenter = () => this.setKeyColor(keyIndex, "lightgrey");
				divs[j].onmouseleave = () => this.resetKeyColor(keyIndex);
			}
		}
		document.addEventListener('keydown', (keyCode) => this.#pressedKey(keyCode));
		document.addEventListener('keyup', (keyCode) => this.#releasedKey(keyCode));
	}

	/**
	 * Onclick
	 * @param {Number} id 
	 */
	#mouseDown(keyIndex){
		this.#clickedKey = keyIndex;
		this.setKeyColor(keyIndex, "darkgrey");
		this.#synth.startNote(keyIndex);
	}
	/**
	 * Onclick release
	 * @param {Number} keyIndex 
	 */
	#mouseUp(keyIndex){
		this.setKeyColor(keyIndex, "lightgrey")
		this.#synth.stopNote(this.#clickedKey);
	}
	// activeElement moaste blur:as efter annan input.
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
		if(!(document.activeElement.tagName === "BODY")) {
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
		console.log(keyIndex);
		this.setKeyColor(keyIndex, "darkgrey");
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
	// todo make this private !?
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
	 * 
	 * @param {Number} index 
	 */
	resetKeyColor(index) {
		if(Piano.#blackIndecies.includes(index)){
			document.getElementById(index).style.backgroundColor = "black";
		} else {
			var divs = this.#getKeyDivsFromKeyIndex(index);
			for (let i = 0; i < divs.length; i++) {
				divs[i].style.backgroundColor = "white";
			}
		}
	}
	#keyCodeToNote(keyCode){
		if(Piano.#keyCodes.includes(keyCode))
			return this.#markersPosition*12 + Piano.#keyCodes.indexOf(keyCode);
	}
	#placeMarkers(x){
		for(var i = 0; i < Piano.#keyMarkers.length; i++){
			let keyIndex = 12*x+i;
			if(!(Piano.#blackIndecies.includes(keyIndex)))
				document.getElementById(keyIndex).innerHTML = "<div class=\"blackText\">" + Piano.#keyMarkers[i] + "</div>";
			else
				document.getElementById(keyIndex).innerHTML = "<div class=\"whiteText\">" + Piano.#keyMarkers[i] + "</div>";
		}
	}
	#removeMarkers(x){
		for(var i = 0; i < Piano.#keyMarkers.length; i++){
			document.getElementById(12*x+i).innerHTML = "";
		}
	}
	// ***************************************************************************************************************************
}
