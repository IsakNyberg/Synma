class WaveForm {
	constructor(analyser) {
		this.audioContext = new AudioContext({sampleRate: 44100});
		this.samplingBuffer = this.audioContext.createBuffer(
			1, 
			this.audioContext.sampleRate, 
			this.audioContext.sampleRate
		)
		this.channelData = this.samplingBuffer.getChannelData(0);
		this.primaryGainControl = this.audioContext.createGain();
		this.analyser = this.audioContext.createAnalyser();
		this.analyser.fftSize = 2048;
	}

	setGain(volume) {
		this.primaryGainControl.gain.setValueAtTime(volume, 0);
	}

	getBuffer() {
		return this.channelData;
	}

	fillBuffer(periodBuffer) {
		for (let i = 0; i < this.samplingBuffer.length; i++) {
			this.channelData[i] = periodBuffer[i % periodBuffer.length];
		}
	}

	generateBuffer(fn, samplesPerPeriod, period){
		var buffer = new Float32Array(samplesPerPeriod);
		var step = period/samplesPerPeriod;
		var t = 0;
		for (let i = 0; i < samplesPerPeriod; i++) {
			buffer[i] = fn(t);
			t += step;
		}
		this.fillBuffer(buffer);
	}

	normalizeBuffer() {
		var max = 0;
		for (let i = 0; i < this.samplingBuffer.length; i++) {
			max = Math.max(max, Math.abs(this.channelData[i]));
		}
		for (let i = 0; i < this.samplingBuffer.length; i++) {
			this.channelData[i] /= max;
		}
	}

	playBuffer() {
		const bufferSource = this.audioContext.createBufferSource();
		bufferSource.buffer = this.samplingBuffer;
		bufferSource.connect(this.analyser);
		this.analyser.connect(this.primaryGainControl);
		bufferSource.start();
		
		this.primaryGainControl.connect(this.audioContext.destination);
	}
}
