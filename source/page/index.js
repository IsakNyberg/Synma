// Gets the window object for the iframe "main"
var iframe = document.getElementById('main').contentWindow;
var documents = [ // Not really documents but a copy of the absolute top node of the original iframe document DOM.
	iframe.document.documentElement,
	iframe.document.documentElement.cloneNode(true),
	iframe.document.documentElement.cloneNode(true)
];
var synths = [null,null,null]; // to contain references to the different synths
var activeSynth = null; // currently active synth
synthIsInited = [false,false,false]; // currently initialized synths
document.getElementById("f1").onclick = () => { // "Synth #1 is clicked"
	iframe.document.body.focus();
	activeSynth.togglePiano();
	console.log("click f1!");
	iframe.document.replaceChild(documents[0], iframe.document.documentElement); // change the whole DOM tree of the iframe document
	activeSynth = synths[0];
	if(activeSynth == null){
		synths[0] = iframe.init_synt();
		activeSynth = synths[0];
	}else{
		activeSynth.togglePiano();
		activeSynth.graphWave();
		activeSynth.graphEnvelope(iframe.document.getElementById("chosenEnvelope").innerHTML.toLowerCase());
	}
}
document.getElementById("f2").onclick = () => { // "Synth #2 is clicked"
	iframe.document.body.focus();
	activeSynth.togglePiano();
	console.log("click f2!");
	iframe.document.replaceChild(documents[1], iframe.document.documentElement); // change the whole DOM tree of the iframe document
	activeSynth = synths[1];
	if(activeSynth == null){
		synths[1] = iframe.init_synt();
		activeSynth = synths[1];
	}else{
		activeSynth.togglePiano();
		activeSynth.graphWave();
		activeSynth.graphEnvelope(iframe.document.getElementById("chosenEnvelope").innerHTML.toLowerCase());
	}
}
document.getElementById("f3").onclick = () => { // "Synth #3 is clicked"
	iframe.document.body.focus();
	activeSynth.togglePiano();
	console.log("click f3!");
	iframe.document.replaceChild(documents[2], iframe.document.documentElement); // change the whole DOM tree of the iframe document
	activeSynth = synths[2];
	if(activeSynth == null){
		synths[2] = iframe.init_synt();
		activeSynth = synths[2];
	}else{
		activeSynth.togglePiano();
		activeSynth.graphWave();
		activeSynth.graphEnvelope(iframe.document.getElementById("chosenEnvelope").innerHTML.toLowerCase());
	}
}
window.onload = () => {
	synths[0] = iframe.init_synt();
	activeSynth = synths[0]
}

