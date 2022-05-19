/**
 * @type {Array<Synth>}
 */
var synths;
var activeSynth;
function initRoll(snts) {
    synths = snts;
    for (let i = 0; i < synths.length; i++) {
        let name = "Synth #"+i;
        let a = document.createElement("a");
        a.innerHTML=name;
        a.onclick = () => {
            document.getElementById("drop").innerHTML=name;
            activeSynth = synths[i];
        };
        document.getElementById("dropcnt").appendChild(a);
    }
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
