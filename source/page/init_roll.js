/**
 * @type {Array<Synth>}
 */
var synths;
var rollIsInitialized = false; 
var activeSynth;
var piano;
/**
 * @type {MidiKeybaord}
 */
var midiKeyboard;
function initRoll(snts, midi) {
    synths = snts;
    midiKeyboard = midi;
    if(synths.length < 1) {
        alert("No synths to roll.");
        return;
    }
    activeSynth = synths[0];
    document.getElementById("drop").innerHTML="Synth #"+0;
    onclickFuns = []
    document.getElementById("dropcnt").innerHTML=""; // Säkert inte bästa sätt att ta bort noder med listeners.
    for (let i = 0; i < synths.length; i++) {
        let name = "Synth #"+i;
        let a = document.createElement("a");
        a.innerHTML=name;
        onclickFuns[i] = () => {
            document.getElementById("drop").innerHTML=name;
            activeSynth = synths[i];
            piano.setSynth(activeSynth);
            midiKeyboard.setSynth(activeSynth);
            midiKeyboard.setPiano(piano);
        };
        a.onclick = onclickFuns[i];
        document.getElementById("dropcnt").appendChild(a);
    }
    var piano = new Piano(activeSynth,false);
    midiKeyboard.setSynth(activeSynth);
    midiKeyboard.setPiano(piano);
    rollIsInitialized = true;
}


//window.onload = init_synt();
/**
 * Program start. Init. the synth.
 */
  //var synth;
/*function init_synt(){
	//let origin = window.location.search;
	//const urlParams = new URLSearchParams(origin);
	if(urlParams.has('func1')){
        synth = new Synth(loadURL(urlParams),document.getElementById('waveformGraph'),document.getElementById('envelopeGraph'));
	}
	else{
		synth = new Synth([],document.getElementById('waveformGraph'),document.getElementById('envelopeGraph'));
	}
    //dropdownClick(synth);
    //addEventSynthListeners(synth);
	const midiKeybaord = new MidiKeybaord(synth, synth.piano);
}*/
