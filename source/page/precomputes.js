// THIS FILE IS NOT USED; JUST HERE ;)

var noteFreq = initFreqs();
var mult = 27.5;

function precomputeNote(audioContext, baseBuffer, note) {
	let freq = noteFreq[note[0]][note[1]];
	let samplingBuffer = audioContext.createBuffer(
		1, 
		Math.ceil(mult * baseBuffer.length / freq),
		audioContext.sampleRate,
	);
	// fill big buffer
	let channelData = samplingBuffer.getChannelData(0);
	let step = freq / mult;
	let t = 0

	for (let i = 0; i < samplingBuffer.length; i++) {
		channelData[i] = baseBuffer[Math.ceil(t)];
		t += step;
	}


	return samplingBuffer;
}

function getPrecompute(precompute, note) {
	return precompute[note[1]][note[0]];
}

function precomputeAllNotes(audioContext, fn, maxX) {
	var precomputes = [];
	for (let i = 0; i< 9; i++) {
		precomputes[i] = [];
	}
	var baseBuffer = computeBase(audioContext, fn, maxX);
	
	precomputes[0]["A"]		= precomputeNote(audioContext, baseBuffer, [0, "A"]	);
	precomputes[0]["A"]		= precomputeNote(audioContext, baseBuffer, [0, "A"]	);
	precomputes[0]["A"]		= precomputeNote(audioContext, baseBuffer, [0, "A"]	);
	precomputes[0]["A#"]	= precomputeNote(audioContext, baseBuffer, [0, "A#"]);
	precomputes[0]["B"]		= precomputeNote(audioContext, baseBuffer, [0, "B"]	);
	precomputes[1]["C"]		= precomputeNote(audioContext, baseBuffer, [1, "C"]	);
	precomputes[1]["C#"]	= precomputeNote(audioContext, baseBuffer, [1, "C#"]);
	precomputes[1]["D"]		= precomputeNote(audioContext, baseBuffer, [1, "D"]	);
	precomputes[1]["D#"]	= precomputeNote(audioContext, baseBuffer, [1, "D#"]);
	precomputes[1]["E"]		= precomputeNote(audioContext, baseBuffer, [1, "E"]	);
	precomputes[1]["F"]		= precomputeNote(audioContext, baseBuffer, [1, "F"]	);
	precomputes[1]["F#"]	= precomputeNote(audioContext, baseBuffer, [1, "F#"]);
	precomputes[1]["G"]		= precomputeNote(audioContext, baseBuffer, [1, "G"]	);
	precomputes[1]["G#"]	= precomputeNote(audioContext, baseBuffer, [1, "G#"]);
	precomputes[1]["A"]		= precomputeNote(audioContext, baseBuffer, [1, "A"]	);
	precomputes[1]["A#"]	= precomputeNote(audioContext, baseBuffer, [1, "A#"]);
	precomputes[1]["B"]		= precomputeNote(audioContext, baseBuffer, [1, "B"]	);
	precomputes[2]["C"]		= precomputeNote(audioContext, baseBuffer, [2, "C"]	);
	precomputes[2]["C#"]	= precomputeNote(audioContext, baseBuffer, [2, "C#"]);
	precomputes[2]["D"]		= precomputeNote(audioContext, baseBuffer, [2, "D"]	);
	precomputes[2]["D#"]	= precomputeNote(audioContext, baseBuffer, [2, "D#"]);
	precomputes[2]["E"]		= precomputeNote(audioContext, baseBuffer, [2, "E"]	);
	precomputes[2]["F"]		= precomputeNote(audioContext, baseBuffer, [2, "F"]	);
	precomputes[2]["F#"]	= precomputeNote(audioContext, baseBuffer, [2, "F#"]);
	precomputes[2]["G"]		= precomputeNote(audioContext, baseBuffer, [2, "G"]	);
	precomputes[2]["G#"]	= precomputeNote(audioContext, baseBuffer, [2, "G#"]);
	precomputes[2]["A"]		= precomputeNote(audioContext, baseBuffer, [2, "A"]	);
	precomputes[2]["A#"]	= precomputeNote(audioContext, baseBuffer, [2, "A#"]);
	precomputes[2]["B"]		= precomputeNote(audioContext, baseBuffer, [2, "B"]	);
	precomputes[3]["C"]		= precomputeNote(audioContext, baseBuffer, [3, "C"]	);
	precomputes[3]["C#"]	= precomputeNote(audioContext, baseBuffer, [3, "C#"]);
	precomputes[3]["D"]		= precomputeNote(audioContext, baseBuffer, [3, "D"]	);
	precomputes[3]["D#"]	= precomputeNote(audioContext, baseBuffer, [3, "D#"]);
	precomputes[3]["E"]		= precomputeNote(audioContext, baseBuffer, [3, "E"]	);
	precomputes[3]["F"]		= precomputeNote(audioContext, baseBuffer, [3, "F"]	);
	precomputes[3]["F#"]	= precomputeNote(audioContext, baseBuffer, [3, "F#"]);
	precomputes[3]["G"]		= precomputeNote(audioContext, baseBuffer, [3, "G"]	);
	precomputes[3]["G#"]	= precomputeNote(audioContext, baseBuffer, [3, "G#"]);
	precomputes[3]["A"]		= precomputeNote(audioContext, baseBuffer, [3, "A"]	);
	precomputes[3]["A#"]	= precomputeNote(audioContext, baseBuffer, [3, "A#"]);
	precomputes[3]["B"]		= precomputeNote(audioContext, baseBuffer, [3, "B"]	);
	precomputes[4]["C"]		= precomputeNote(audioContext, baseBuffer, [4, "C"]	);
	precomputes[4]["C#"]	= precomputeNote(audioContext, baseBuffer, [4, "C#"]);
	precomputes[4]["D"]		= precomputeNote(audioContext, baseBuffer, [4, "D"]	);
	precomputes[4]["D#"]	= precomputeNote(audioContext, baseBuffer, [4, "D#"]);
	precomputes[4]["E"]		= precomputeNote(audioContext, baseBuffer, [4, "E"]	);
	precomputes[4]["F"]		= precomputeNote(audioContext, baseBuffer, [4, "F"]	);
	precomputes[4]["F#"]	= precomputeNote(audioContext, baseBuffer, [4, "F#"]);
	precomputes[4]["G"]		= precomputeNote(audioContext, baseBuffer, [4, "G"]	);
	precomputes[4]["G#"]	= precomputeNote(audioContext, baseBuffer, [4, "G#"]);
	precomputes[4]["A"]		= precomputeNote(audioContext, baseBuffer, [4, "A"]	);
	precomputes[4]["A#"]	= precomputeNote(audioContext, baseBuffer, [4, "A#"]);
	precomputes[4]["B"]		= precomputeNote(audioContext, baseBuffer, [4, "B"]	);
	precomputes[5]["C"]		= precomputeNote(audioContext, baseBuffer, [5, "C"]	);
	precomputes[5]["C#"]	= precomputeNote(audioContext, baseBuffer, [5, "C#"]);
	precomputes[5]["D"]		= precomputeNote(audioContext, baseBuffer, [5, "D"]	);
	precomputes[5]["D#"]	= precomputeNote(audioContext, baseBuffer, [5, "D#"]);
	precomputes[5]["E"]		= precomputeNote(audioContext, baseBuffer, [5, "E"]	);
	precomputes[5]["F"]		= precomputeNote(audioContext, baseBuffer, [5, "F"]	);
	precomputes[5]["F#"]	= precomputeNote(audioContext, baseBuffer, [5, "F#"]);
	precomputes[5]["G"]		= precomputeNote(audioContext, baseBuffer, [5, "G"]	);
	precomputes[5]["G#"]	= precomputeNote(audioContext, baseBuffer, [5, "G#"]);
	precomputes[5]["A"]		= precomputeNote(audioContext, baseBuffer, [5, "A"]	);
	precomputes[5]["A#"]	= precomputeNote(audioContext, baseBuffer, [5, "A#"]);
	precomputes[5]["B"]		= precomputeNote(audioContext, baseBuffer, [5, "B"]	);
	precomputes[6]["C"]		= precomputeNote(audioContext, baseBuffer, [6, "C"]	);
	precomputes[6]["C#"]	= precomputeNote(audioContext, baseBuffer, [6, "C#"]);
	precomputes[6]["D"]		= precomputeNote(audioContext, baseBuffer, [6, "D"]	);
	precomputes[6]["D#"]	= precomputeNote(audioContext, baseBuffer, [6, "D#"]);
	precomputes[6]["E"]		= precomputeNote(audioContext, baseBuffer, [6, "E"]	);
	precomputes[6]["F"]		= precomputeNote(audioContext, baseBuffer, [6, "F"]	);
	precomputes[6]["F#"]	= precomputeNote(audioContext, baseBuffer, [6, "F#"]);
	precomputes[6]["G"]		= precomputeNote(audioContext, baseBuffer, [6, "G"]	);
	precomputes[6]["G#"]	= precomputeNote(audioContext, baseBuffer, [6, "G#"]);
	precomputes[6]["A"]		= precomputeNote(audioContext, baseBuffer, [6, "A"]	);
	precomputes[6]["A#"]	= precomputeNote(audioContext, baseBuffer, [6, "A#"]);
	precomputes[6]["B"]		= precomputeNote(audioContext, baseBuffer, [6, "B"]	);
	precomputes[7]["C"]		= precomputeNote(audioContext, baseBuffer, [7, "C"]	);
	precomputes[7]["C#"]	= precomputeNote(audioContext, baseBuffer, [7, "C#"]);
	precomputes[7]["D"]		= precomputeNote(audioContext, baseBuffer, [7, "D"]	);
	precomputes[7]["D#"]	= precomputeNote(audioContext, baseBuffer, [7, "D#"]);
	precomputes[7]["E"]		= precomputeNote(audioContext, baseBuffer, [7, "E"]	);
	precomputes[7]["F"]		= precomputeNote(audioContext, baseBuffer, [7, "F"]	);
	precomputes[7]["F#"]	= precomputeNote(audioContext, baseBuffer, [7, "F#"]);
	precomputes[7]["G"]		= precomputeNote(audioContext, baseBuffer, [7, "G"]	);
	precomputes[7]["G#"]	= precomputeNote(audioContext, baseBuffer, [7, "G#"]);
	precomputes[7]["A"]		= precomputeNote(audioContext, baseBuffer, [7, "A"]	);
	precomputes[7]["A#"]	= precomputeNote(audioContext, baseBuffer, [7, "A#"]);
	precomputes[7]["B"]		= precomputeNote(audioContext, baseBuffer, [7, "B"]	);
	precomputes[8]["C"]		= precomputeNote(audioContext, baseBuffer, [8, "C"]	);
	return precomputes;
}

