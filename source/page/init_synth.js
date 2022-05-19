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
	  return synth;
  }
  function addMainEventListeners() {
	  document.addEventListener().onclick = () => {
		  documents.push(DOMImplementation.createHTMLDocument("PLACEHOLDER"))
	  };
  }
  function addEventSynthListeners(synth){
	  document.getElementById("saveSettings").onclick = () => synth.saveSettings();
	  document.getElementById("recordButton").onclick = () => {
		let recordButtonElement = document.getElementById("recordButton");
		let playButtonElement = document.getElementById("playButton");
		let downloadButtonElement = document.getElementById("downloadButton");
		synth.recorder(recordButtonElement,playButtonElement,downloadButtonElement);
	  };
	  document.getElementById("playButton").onclick = () => {
		  let playButtonElement = document.getElementById("playButton");
		  synth.player(playButtonElement);
	  };
	  document.getElementById("functionButton").onclick = () => {
		  let fnString = document.getElementById("functionInput").value;
		  let normalized = document.getElementById("normalizeCheckbox").checked;
		  let maxXInput = document.getElementById("maxXInput").value;
		  synth.setWave(fnString,normalized,maxXInput);
	  };
	  document.getElementById("env-functionButton").onclick = () =>{ 
		  let envelopString = document.getElementById("chosenEnvelope").innerHTML.toLowerCase();
		  let envelopMaxT = document.getElementById("chosenTimezone").innerHTML.toLowerCase();
		  let fnString = document.getElementById("env-functionInput").value;
		  let timeString = document.getElementById("env-timeInput").value;
		  let normalized = document.getElementById("normalizeEnvelope").checked;
		  let continuous = document.getElementById("continuousCheckbox").checked;
		  synth.setEnvelopes(envelopString,envelopMaxT,fnString,timeString, normalized, continuous);
	  };
	  document.getElementById("applyAmplitude").onclick = (clicked) => {
		  synth.activeEnvelopes[0]=document.getElementById("applyAmplitude").checked;
	  } 
	  document.getElementById("applyPitch").onclick = (clicked) => {
		  synth.activeEnvelopes[1]=document.getElementById("applyPitch").checked;
	  } 
	  document.getElementById("applyFilter").onclick = (clicked) => {
		  synth.activeEnvelopes[2]=document.getElementById("applyFilter").checked;
	  } 
	  document.getElementById("volume").oninput = () => synth.setMasterVolume(document.getElementById("volume").value);
	  document.querySelectorAll(".dropdownOption").forEach(
		  (element)=> {element.addEventListener("click", ()=> dropdownClick(synth))}
	  );
	  document.getElementById("midiUpload").addEventListener("change", ()=>{
		  synth.playFile(document.getElementById("midiUpload").files[0]);
	  }, false);
  }
  function dropdownClick(synth){
	  var currentType = document.getElementById("chosenEnvelope").innerHTML.toLowerCase();
	  var currentTime = document.getElementById("chosenTimezone").innerHTML.toLowerCase();
	  document.getElementById("env-functionInput").value = synth.envFunctions[currentType][currentTime][1];
	  document.getElementById("env-timeInput").value = synth.envFunctions[currentType][currentTime][2];
	  document.getElementById("normalizeEnvelope").checked = synth.envIsNormalized[currentType][0];
	  document.getElementById("continuousCheckbox").checked = synth.envIsNormalized[currentType][1];
	  synth.graphEnvelope(currentType);
  }
  