var noteFreq = initFreqs();

function precomputeNote(audioContext, fn, note, maxX) {
	let periodBufferLength = audioContext.sampleRate / noteFreq[note[0]][note[1]];
	let periodBuffer= new Float32Array(periodBufferLength);
	let samplingBuffer = audioContext.createBuffer(
		1, 
		periodBuffer.length * 25,
		audioContext.sampleRate,
	);
	// small buffer (periodbuffer)
	let step = maxX / periodBufferLength;
	let x = 0;
	for (let t = 0; t < periodBufferLength; t++) {
		periodBuffer[t] = fn(x);
		x += step;
	}
	// fill big buffer
	let channelData = samplingBuffer.getChannelData(0);
	for (let i = 0; i < samplingBuffer.length; i++) {
		channelData[i] = periodBuffer[i % periodBuffer.length];
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
	precomputes[0]["A"]		= precomputeNote(audioContext, fn, [0, "A"]	, maxX);
	precomputes[0]["A#"]	= precomputeNote(audioContext, fn, [0, "A#"], maxX);
	precomputes[0]["B"]		= precomputeNote(audioContext, fn, [0, "B"]	, maxX);
	precomputes[1]["C"]		= precomputeNote(audioContext, fn, [1, "C"]	, maxX);
	precomputes[1]["C#"]	= precomputeNote(audioContext, fn, [1, "C#"], maxX);
	precomputes[1]["D"]		= precomputeNote(audioContext, fn, [1, "D"]	, maxX);
	precomputes[1]["D#"]	= precomputeNote(audioContext, fn, [1, "D#"], maxX);
	precomputes[1]["E"]		= precomputeNote(audioContext, fn, [1, "E"]	, maxX);
	precomputes[1]["F"]		= precomputeNote(audioContext, fn, [1, "F"]	, maxX);
	precomputes[1]["F#"]	= precomputeNote(audioContext, fn, [1, "F#"], maxX);
	precomputes[1]["G"]		= precomputeNote(audioContext, fn, [1, "G"]	, maxX);
	precomputes[1]["G#"]	= precomputeNote(audioContext, fn, [1, "G#"], maxX);
	precomputes[1]["A"]		= precomputeNote(audioContext, fn, [1, "A"]	, maxX);
	precomputes[1]["A#"]	= precomputeNote(audioContext, fn, [1, "A#"], maxX);
	precomputes[1]["B"]		= precomputeNote(audioContext, fn, [1, "B"]	, maxX);
	precomputes[2]["C"]		= precomputeNote(audioContext, fn, [2, "C"]	, maxX);
	precomputes[2]["C#"]	= precomputeNote(audioContext, fn, [2, "C#"], maxX);
	precomputes[2]["D"]		= precomputeNote(audioContext, fn, [2, "D"]	, maxX);
	precomputes[2]["D#"]	= precomputeNote(audioContext, fn, [2, "D#"], maxX);
	precomputes[2]["E"]		= precomputeNote(audioContext, fn, [2, "E"]	, maxX);
	precomputes[2]["F"]		= precomputeNote(audioContext, fn, [2, "F"]	, maxX);
	precomputes[2]["F#"]	= precomputeNote(audioContext, fn, [2, "F#"], maxX);
	precomputes[2]["G"]		= precomputeNote(audioContext, fn, [2, "G"]	, maxX);
	precomputes[2]["G#"]	= precomputeNote(audioContext, fn, [2, "G#"], maxX);
	precomputes[2]["A"]		= precomputeNote(audioContext, fn, [2, "A"]	, maxX);
	precomputes[2]["A#"]	= precomputeNote(audioContext, fn, [2, "A#"], maxX);
	precomputes[2]["B"]		= precomputeNote(audioContext, fn, [2, "B"]	, maxX);
	precomputes[3]["C"]		= precomputeNote(audioContext, fn, [3, "C"]	, maxX);
	precomputes[3]["C#"]	= precomputeNote(audioContext, fn, [3, "C#"], maxX);
	precomputes[3]["D"]		= precomputeNote(audioContext, fn, [3, "D"]	, maxX);
	precomputes[3]["D#"]	= precomputeNote(audioContext, fn, [3, "D#"], maxX);
	precomputes[3]["E"]		= precomputeNote(audioContext, fn, [3, "E"]	, maxX);
	precomputes[3]["F"]		= precomputeNote(audioContext, fn, [3, "F"]	, maxX);
	precomputes[3]["F#"]	= precomputeNote(audioContext, fn, [3, "F#"], maxX);
	precomputes[3]["G"]		= precomputeNote(audioContext, fn, [3, "G"]	, maxX);
	precomputes[3]["G#"]	= precomputeNote(audioContext, fn, [3, "G#"], maxX);
	precomputes[3]["A"]		= precomputeNote(audioContext, fn, [3, "A"]	, maxX);
	precomputes[3]["A#"]	= precomputeNote(audioContext, fn, [3, "A#"], maxX);
	precomputes[3]["B"]		= precomputeNote(audioContext, fn, [3, "B"]	, maxX);
	precomputes[4]["C"]		= precomputeNote(audioContext, fn, [4, "C"]	, maxX);
	precomputes[4]["C#"]	= precomputeNote(audioContext, fn, [4, "C#"], maxX);
	precomputes[4]["D"]		= precomputeNote(audioContext, fn, [4, "D"]	, maxX);
	precomputes[4]["D#"]	= precomputeNote(audioContext, fn, [4, "D#"], maxX);
	precomputes[4]["E"]		= precomputeNote(audioContext, fn, [4, "E"]	, maxX);
	precomputes[4]["F"]		= precomputeNote(audioContext, fn, [4, "F"]	, maxX);
	precomputes[4]["F#"]	= precomputeNote(audioContext, fn, [4, "F#"], maxX);
	precomputes[4]["G"]		= precomputeNote(audioContext, fn, [4, "G"]	, maxX);
	precomputes[4]["G#"]	= precomputeNote(audioContext, fn, [4, "G#"], maxX);
	precomputes[4]["A"]		= precomputeNote(audioContext, fn, [4, "A"]	, maxX);
	precomputes[4]["A#"]	= precomputeNote(audioContext, fn, [4, "A#"], maxX);
	precomputes[4]["B"]		= precomputeNote(audioContext, fn, [4, "B"]	, maxX);
	precomputes[5]["C"]		= precomputeNote(audioContext, fn, [5, "C"]	, maxX);
	precomputes[5]["C#"]	= precomputeNote(audioContext, fn, [5, "C#"], maxX);
	precomputes[5]["D"]		= precomputeNote(audioContext, fn, [5, "D"]	, maxX);
	precomputes[5]["D#"]	= precomputeNote(audioContext, fn, [5, "D#"], maxX);
	precomputes[5]["E"]		= precomputeNote(audioContext, fn, [5, "E"]	, maxX);
	precomputes[5]["F"]		= precomputeNote(audioContext, fn, [5, "F"]	, maxX);
	precomputes[5]["F#"]	= precomputeNote(audioContext, fn, [5, "F#"], maxX);
	precomputes[5]["G"]		= precomputeNote(audioContext, fn, [5, "G"]	, maxX);
	precomputes[5]["G#"]	= precomputeNote(audioContext, fn, [5, "G#"], maxX);
	precomputes[5]["A"]		= precomputeNote(audioContext, fn, [5, "A"]	, maxX);
	precomputes[5]["A#"]	= precomputeNote(audioContext, fn, [5, "A#"], maxX);
	precomputes[5]["B"]		= precomputeNote(audioContext, fn, [5, "B"]	, maxX);
	precomputes[6]["C"]		= precomputeNote(audioContext, fn, [6, "C"]	, maxX);
	precomputes[6]["C#"]	= precomputeNote(audioContext, fn, [6, "C#"], maxX);
	precomputes[6]["D"]		= precomputeNote(audioContext, fn, [6, "D"]	, maxX);
	precomputes[6]["D#"]	= precomputeNote(audioContext, fn, [6, "D#"], maxX);
	precomputes[6]["E"]		= precomputeNote(audioContext, fn, [6, "E"]	, maxX);
	precomputes[6]["F"]		= precomputeNote(audioContext, fn, [6, "F"]	, maxX);
	precomputes[6]["F#"]	= precomputeNote(audioContext, fn, [6, "F#"], maxX);
	precomputes[6]["G"]		= precomputeNote(audioContext, fn, [6, "G"]	, maxX);
	precomputes[6]["G#"]	= precomputeNote(audioContext, fn, [6, "G#"], maxX);
	precomputes[6]["A"]		= precomputeNote(audioContext, fn, [6, "A"]	, maxX);
	precomputes[6]["A#"]	= precomputeNote(audioContext, fn, [6, "A#"], maxX);
	precomputes[6]["B"]		= precomputeNote(audioContext, fn, [6, "B"]	, maxX);
	precomputes[7]["C"]		= precomputeNote(audioContext, fn, [7, "C"]	, maxX);
	precomputes[7]["C#"]	= precomputeNote(audioContext, fn, [7, "C#"], maxX);
	precomputes[7]["D"]		= precomputeNote(audioContext, fn, [7, "D"]	, maxX);
	precomputes[7]["D#"]	= precomputeNote(audioContext, fn, [7, "D#"], maxX);
	precomputes[7]["E"]		= precomputeNote(audioContext, fn, [7, "E"]	, maxX);
	precomputes[7]["F"]		= precomputeNote(audioContext, fn, [7, "F"]	, maxX);
	precomputes[7]["F#"]	= precomputeNote(audioContext, fn, [7, "F#"], maxX);
	precomputes[7]["G"]		= precomputeNote(audioContext, fn, [7, "G"]	, maxX);
	precomputes[7]["G#"]	= precomputeNote(audioContext, fn, [7, "G#"], maxX);
	precomputes[7]["A"]		= precomputeNote(audioContext, fn, [7, "A"]	, maxX);
	precomputes[7]["A#"]	= precomputeNote(audioContext, fn, [7, "A#"], maxX);
	precomputes[7]["B"]		= precomputeNote(audioContext, fn, [7, "B"]	, maxX);
	precomputes[8]["C"]		= precomputeNote(audioContext, fn, [8, "C"]	, maxX);
	return precomputes;
}

