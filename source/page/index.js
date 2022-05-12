var documents = [document];
window.onload = init_synt();
/**
 * Program start. Init. the synth.
 */
function init_synt(){
  var synth;
	let origin = window.location.search;
	const urlParams = new URLSearchParams(origin);
	synth = urlParams.has('func1') ?
        new Synth(loadURL(urlParams),document.getElementById('waveformGraph'),document.getElementById('envelopeGraph')):
        new Synth([],document.getElementById('waveformGraph'),document.getElementById('envelopeGraph'));
    dropdownClick(synth);
    addEventSynthListeners(synth);
	const midiKeybaord = new MidiKeybaord(synth, synth.piano);
}
function addMainEventListeners() {
    document.addEventListener().onclick = () => {
        documents.push(DOMImplementation.createHTMLDocument("PLACEHOLDER"))
    };
}
function addEventSynthListeners(synth, doc){
    doc.getElementById("saveSettings").onclick = () => synth.saveSettings();
    doc.getElementById("recordButton").onclick = () => {
        let recordButtonElement = doc.getElementById("recordButton");
        let playButtonElement = doc.getElementById("playButton");
        let downloadButtonElement = doc.getElementById("downloadButton");
        synth.recorder(recordButtonElement,playButtonElement,downloadButtonElement);
    };
    doc.getElementById("playButton").onclick = () => {
        let playButtonElement = doc.getElementById("playButton");
        synth.player(playButtonElement);
    };
    doc.getElementById("functionButton").onclick = () => {
        let fnString = doc.getElementById("functionInput").value;
        let normalized = doc.getElementById("normalizeCheckbox").checked;
        let maxXInput = doc.getElementById("maxXInput").value;
        synth.setWave(fnString,normalized,maxXInput);
    };
    doc.getElementById("env-functionButton").onclick = () =>{ 
        let envelopString = doc.getElementById("chosenEnvelope").innerHTML.toLowerCase();
		let envelopMaxT = doc.getElementById("chosenTimezone").innerHTML.toLowerCase();
		let fnString = doc.getElementById("env-functionInput").value;
		let timeString = doc.getElementById("env-timeInput").value;
        let normalized = doc.getElementById("normalizeEnvelope").checked;
        let continuous = doc.getElementById("continuousCheckbox").checked;
        synth.setEnvelopes(envelopString,envelopMaxT,fnString,timeString, normalized, continuous);
    };
    doc.getElementById("applyAmplitude").onclick = (clicked) => {
        synth.activeEnvelopes[0]=doc.getElementById("applyAmplitude").checked;
    } 
    doc.getElementById("applyPitch").onclick = (clicked) => {
        synth.activeEnvelopes[1]=doc.getElementById("applyPitch").checked;
    } 
    doc.getElementById("applyFilter").onclick = (clicked) => {
        synth.activeEnvelopes[2]=doc.getElementById("applyFilter").checked;
    } 
    doc.getElementById("volume").oninput = () => synth.setMasterVolume(doc.getElementById("volume").value);
    doc.querySelectorAll(".dropdownOption").forEach(
        (element)=> {element.addEventListener("click", ()=> dropdownClick(synth))}
    );
    doc.getElementById("midiUpload").addEventListener("change", ()=>{
        synth.playFile(doc.getElementById("midiUpload").files[0]);
    }, false);
}
function dropdownClick(synth){
    var currentType = doc.getElementById("chosenEnvelope").innerHTML.toLowerCase();
    var currentTime = doc.getElementById("chosenTimezone").innerHTML.toLowerCase();
    doc.getElementById("env-functionInput").value = synth.envFunctions[currentType][currentTime][1];
    doc.getElementById("env-timeInput").value = synth.envFunctions[currentType][currentTime][2];
    doc.getElementById("normalizeEnvelope").checked = synth.envIsNormalized[currentType][0];
    doc.getElementById("continuousCheckbox").checked = synth.envIsNormalized[currentType][1];
    synth.graphEnvelope(currentType);
}
