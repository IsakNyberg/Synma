/**
 * @class WaveForm - it's used to create a waveform from the inputed function by sampling the points and then we can play the buffer.
*/
class WaveForm{
	constructor(audioContext, samplingBuffer) {
		this.audioContext = audioContext;
		this.samplingBuffer = samplingBuffer;
		this.masterSource = null;
		this.bufferGain = null;
		this.channelData = this.samplingBuffer.getChannelData(0);
		this.primaryGainControl = this.audioContext.createGain();
		//this.analyser = this.audioContext.createAnalyser();
		//this.analyser.fftSize = 2048;
	}
	/**
	 * this function will set the volume for primary gain controll
	 * @param {number} volume - take the volume to be set 
	 */
	setGain(volume) {
		this.primaryGainControl.gain.setValueAtTime(volume, 0);
	}

	/**
	 * Getter for buffer
	 * @returns {Float32Array} - the buffer with sample points
	 */
	getBuffer() {
		return this.channelData;
	}

	static computeBase(audioContext, fn, maxX, resolution) {
		// let baseFrequencyLength = this.audioContext.sampleRate / mult;
		let baseFrequencyLength = resolution;
		let samplingBuffer = audioContext.createBuffer(
			1, 
			baseFrequencyLength,
			audioContext.sampleRate,
		);
		let channelData = samplingBuffer.getChannelData(0);
		//console.time("precompute");
		let step = maxX / baseFrequencyLength;
		let x = 0;
		for (let t = 0; t < baseFrequencyLength; t++) {
			channelData[t] = fn(x);
			x += step;
		}
		//console.timeEnd("precompute");

		return samplingBuffer;
	}
	
	
	/**
	 * we will find the max valye in our buffer and then divide all the values by it to normalize 
	 * the values of the sampling in buffer
	 */
	normalizeBuffer() {
		let max = 0;
		for (let i = 0; i < this.samplingBuffer.length; i++) {
			max = Math.max(max, Math.abs(this.channelData[i]));
		}
		for (let i = 0; i < this.samplingBuffer.length; i++) {
			this.channelData[i] /= max;
		}
	}	
	
	/**
	 * this function will play the buffer we have created
	 */
	playBuffer(freq) {
		
		this.bufferGain = this.audioContext.createGain();
		this.bufferGain.gain.setValueAtTime(0.1, 0);
		
		//console.log(1111111, freq);
		this.masterSource = this.audioContext.createBufferSource();
		this.masterSource.playbackRate.value = freq * this.samplingBuffer.length / this.audioContext.sampleRate;
		this.masterSource.loop = true;
		this.masterSource.buffer = this.samplingBuffer;
		this.masterSource.connect(this.bufferGain);
		this.bufferGain.connect(this.primaryGainControl);
		//this.masterSource.connect(this.analyser);  if an analyser is needed
		//this.analyser.connect(this.primaryGainControl);
		
		this.primaryGainControl.connect(this.audioContext.destination);
		this.masterSource.start();
		this.masterSourceStartTime = this.audioContext.currentTime;
		this.primaryGainControl.connect(this.audioContext.destination);

	}
	
	stopBuffer() {
		this.masterSource.loop = false;		
		this.bufferGain.gain.linearRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
	}
}
