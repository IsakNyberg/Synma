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
 * Number of synths currently active. If this is zero, only the initial synth is active.
 */
var noOfSynths = 0;

var rollActive = false;


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
	if(synths[index] == undefined || activeSynth == synths[index]) return;
	iframe.document.body.focus();
	iframe.document.replaceChild(documents[index], iframe.document.documentElement); // change the whole DOM tree of the iframe document
	if(activeSynth!=null) activeSynth.togglePiano();
	activeSynth = synths[index];
	activeSynth.togglePiano();
	activeSynth.graphWave();
	activeSynth.graphEnvelope(iframe.document.getElementById("chosenEnvelope").innerHTML.toLowerCase());
}

function switchToRoll() {
	if(activeSynth!=null) activeSynth.togglePiano();
	rollActive = true;
	activeSynth.togglePiano();
	document.getElementById("main").style.visibility = "hidden";
	document.getElementById("roll").style.visibility = "visible";
	document.getElementById("roll").contentWindow.initRoll(synths);
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
	activeSynth = synths[noOfSynths];
	//activeSynth.graphWave();
	//activeSynth.graphEnvelope(iframe.document.getElementById("chosenEnvelope").innerHTML.toLowerCase());
	let s = document.createElement("div");
	s.className="choice";
	s.id="synth"+(noOfSynths);
	s.innerHTML = "Synth #" + noOfSynths;
	document.getElementById("choices").appendChild(s);
	updateEventListeners(noOfSynths);
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
	
	updateEventListeners(0);
}
document.getElementById("destroySynth").onclick = destroySynth;
document.getElementById("newSynth").onclick = createSynth;
document.getElementById("displayRoll").onclick = switchToRoll;



