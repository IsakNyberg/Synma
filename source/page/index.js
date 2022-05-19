//const rollFrame = document.getElementById('roll').contentWindow;
//var roll = rollFrame.documentElement;
/**
 * Window object for the iframe "main"
 * @type {Window}
 */
const iframe = document.getElementById('main').contentWindow;
/**
 * Root node of unchanged synt.html DOM.
 * @type {Node}
 */
const base = iframe.document.documentElement.cloneNode(true);
/**
 * Top node of each corresponding synth DOM.
 * @type {Array<Node>}
 */
var documents = [ 
	iframe.document.documentElement
];
/**
 * @type {Array<Synth>}
 */
var synths = []; // to contain references to the different synths
/**
 * The currently active and displayed Synth.
 * @type {Synth}
 */
var activeSynth = null; // currently active synth
/**
 * Ref to the midi live input handler.
 * @type {MidiKeybaord}
 */
var midiKeyboard = null;
/**
 * Number of synths currently active. If this is zero, only the initial synth is active.
 */
var noOfSynths = 0;

var rollActive = false;


function setStyleClicked(index) {
	document.getElementById("synth"+index).style.backgroundColor  = "initial";
	document.getElementById("synth"+index).style.backgroundPositionX = 0;
	document.getElementById("synth"+index).style.backgroundPositionY = 0;
	document.getElementById("synth"+index).style.color = "#cf1518";
}
function setStyleUnClicked(index) {
	document.getElementById("synth"+index).style.background  = "#cf1518";
	document.getElementById("synth"+index).style.backgroundPositionX = undefined;
	document.getElementById("synth"+index).style.backgroundPositionY = undefined;
	document.getElementById("synth"+index).style.color = "#FFFFFF";
}

/**
 * Switch active synth.
 * @param {Number} index 
 * @returns {void}
 */
function switchSynth(index) {
	if(rollActive){
		document.getElementById("roll").style.visibility = "hidden";
		document.getElementById("main").style.visibility = "visible";
	}
	setStyleClicked(index);
	setStyleUnClicked(synths.indexOf(activeSynth));
	if(synths[index] == undefined || activeSynth == synths[index]) return;
	iframe.document.body.focus();
	iframe.document.replaceChild(documents[index], iframe.document.documentElement); // change the whole DOM tree of the iframe document
	if(activeSynth!=null) activeSynth.togglePiano();
	activeSynth = synths[index];	
	activeSynth.togglePiano();
	midiKeyboard.setSynth(activeSynth);
	midiKeyboard.setPiano(activeSynth.piano);
	console.log("Set synth no " + activeSynth.serial + " as the midisynth.");
	activeSynth.graphWave();
	activeSynth.graphEnvelope(iframe.document.getElementById("chosenEnvelope").innerHTML.toLowerCase());
}

function switchToRoll() {
	if(activeSynth!=null) {
		activeSynth.togglePiano();
		setStyleUnClicked(synths.indexOf(activeSynth));
	}
	rollActive = true;
	activeSynth.togglePiano();
	document.getElementById("main").style.visibility = "hidden";
	document.getElementById("roll").style.visibility = "visible";
	document.getElementById("roll").contentWindow.initRoll(synths,midiKeyboard);
}

/**
 * Creates a new synth object and a corresponding DOM-structure. Also sets the newly created synth as active.
 */
function createSynth() {
	activeSynth.togglePiano();
	documents[++noOfSynths] = base.cloneNode(true);
	iframe.document.body.focus();
	iframe.document.replaceChild(documents[noOfSynths], iframe.document.documentElement); // change the whole DOM tree of the iframe document
	synths[noOfSynths] = iframe.init_synt();
	if(activeSynth != null) setStyleUnClicked(synths.indexOf(activeSynth));
	activeSynth = synths[noOfSynths];
	midiKeyboard.setSynth(activeSynth);
	midiKeyboard.setPiano(activeSynth.piano);
	console.log("Set synth no " + activeSynth.serial + " as the midisynth.");
	//activeSynth.graphWave();
	//activeSynth.graphEnvelope(iframe.document.getElementById("chosenEnvelope").innerHTML.toLowerCase());
	let s = document.createElement("div");
	s.className="choice";
	s.id="synth"+(noOfSynths);
	s.innerHTML = "Synth #" + noOfSynths;
	document.getElementById("choices").appendChild(s);
	updateEventListeners(noOfSynths);
	
	setStyleClicked(noOfSynths);
}
function resetIDs(remIndex){
	for (let i = remIndex+1; i < noOfSynths; i++) {
		document.getElementById("synth"+i).id = "synth"+(i-1)
	}
}
function destroySynth() {
	if(noOfSynths == 0){
		alert("Need atleast one active synth");
		return;
	}
	let i = synths.indexOf(activeSynth);
	synths[i] = null;
	documents[i] = null;
	activeSynth = null;
	document.getElementById("synth"+i).remove();
	noOfSynths--;
	switchSynth(0);
}
/**
 * Creates an eventlistener for switching to a newly created synth with serial number = index.
 * @param {Number} index 
 */
function updateEventListeners(index) {
	document.getElementById("synth"+index).onclick = () => switchSynth(index);
}
// On window load - create starter synth.
window.onload = () => {
	synths[0] = iframe.init_synt();
	activeSynth = synths[0];
	midiKeyboard = new MidiKeybaord(activeSynth, activeSynth.piano);
	updateEventListeners(0);
}
document.getElementById("destroySynth").onclick = destroySynth;
document.getElementById("newSynth").onclick = createSynth;
document.getElementById("displayRoll").onclick = switchToRoll;



