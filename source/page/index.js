// Gets the window object for the iframe "main"
var iframe = document.getElementById('main').contentWindow;
const base = iframe.document.documentElement.cloneNode(true);
var documents = [ // Not really documents but a copy of the absolute top node of the original iframe document DOM.
	iframe.document.documentElement
];
/**
 * @type {Array<Synth>}
 */
var synths = []; // to contain references to the different synths
/**
 * @type {Synth}
 */
var activeSynth = null; // currently active synth
var noOfSynths = 0;


// Switch active synth.
function switchSynth(index) {
	if(synths[index] == undefined || activeSynth == synths[index]) return;
	iframe.document.body.focus();
	iframe.document.replaceChild(documents[index], iframe.document.documentElement); // change the whole DOM tree of the iframe document
	activeSynth.togglePiano();
	activeSynth = synths[index];
	activeSynth.togglePiano();
	activeSynth.graphWave();
	activeSynth.graphEnvelope(iframe.document.getElementById("chosenEnvelope").innerHTML.toLowerCase());
}
// Create a new synth.
function createSynth() {
	documents[++noOfSynths] = base.cloneNode(true);

	iframe.document.body.focus();
	iframe.document.replaceChild(documents[noOfSynths], iframe.document.documentElement); // change the whole DOM tree of the iframe document
	activeSynth.togglePiano();
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
// Add new eventlistener
function updateEventListeners(index) {
	document.getElementById("synth"+index).onclick = () => switchSynth(index);
}
// Eventlisteners
window.onload = () => {
	synths[0] = iframe.init_synt();
	activeSynth = synths[0];
	updateEventListeners(0);
}

document.getElementById("newSynth").onclick = createSynth;
document.getElementById("newRoll").onclick = () =>{
	alert("Not yet implemented");
}



