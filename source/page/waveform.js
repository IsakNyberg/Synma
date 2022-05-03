

/**
 * @class WaveForm - it's used to create a waveform from the inputed function by sampling the points and then we can play the buffer.
*/
class WaveForm{
	constructor(audioContext) {
		this.audioContext = audioContext;
		this.samplingBuffer = null;
		this.masterSource = null;
		this.bufferGain = null;
		this.channelData = null;
		this.primaryGainControl = this.audioContext.createGain();
		this.analyser = this.audioContext.createAnalyser();
		this.analyser.fftSize = 2048;
		this.noteFreq= initFreqs();
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
	
	/**
	 * will fill the buffer completely with periodBuffer
	 * @param {Float32Array} periodBuffer - this buffer contain the sampling points but 
	 * it's only one period long, the period depends on what we have specified
	 */
	fillBuffer(periodBuffer) {
		for (let i = 0; i < this.samplingBuffer.length; i++) {
			this.channelData[i] = periodBuffer[i % periodBuffer.length];
		}
	}
	
	/**
	 * will create the complete buffer using the function and key to decide what frequency 
	 * the function will be created at
	 * ! NOTE: the period used currently is predefined to 2π
	 * @param {Function} fn - the funciton to be sampled
	 * @param {String} key - the piano key 
	 */
	genBufferFromNote(fn, key){
		this.generateBuffer(fn,this.noteFreq[key[1]][key[0]],2*Math.PI)
	}	
	
	/**
	 * thus function will create the periodBuffer depending on the params below and will then
	 * fill out the whole buffer
	 * @param {Function} fn 
	 * @param {Number} freq 
	 * @param {Number} period 
	 */
	generateBuffer(fn, freq, period) {
		let bufferLength = this.audioContext.sampleRate / freq;
		let buffer = new Float32Array(bufferLength);
		this.samplingBuffer = this.audioContext.createBuffer(
			1, 
			buffer.length * 25,
			this.audioContext.sampleRate,
		);
			
		let step = period / bufferLength;
		let x = 0;
		for (let t = 0; t < bufferLength; t++) {
			buffer[t] = fn(x);
			x += step;
		}
		this.fillBuffer(buffer);
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
	 * Fades out the last part of the buffer 
	 * @param {Number} numSamples 
	 */
	fadeOutEnd(numSamples) {
		let start = this.samplingBuffer.length - numSamples;
		let ratio = 1;
		let step = 1/numSamples;
		for (let i = start; i < this.samplingBuffer.length; i++) {
			this.channelData[i] *= ratio;
			ratio -= step;
		}
	}

	/*
	fadeOutFrom(index, numSamples) {
		let ratio = 1;
		let step = 1/numSamples;
		for (let i = index; i < index + numSamples; i++) {
			this.channelData[i] *= ratio;
			ratio -= step;
		}
		for (let i = index + numSamples; i < this.audioContext.sampleRate; i++) {
			this.channelData[i] = 0;
		}
	}*/
	
	
	/**
	 * this function will play the buffer we have created
	 */
	playBuffer() {
		this.bufferGain = this.audioContext.createGain();
		this.bufferGain.gain.setValueAtTime(0.1, 0);

		this.masterSource = this.audioContext.createBufferSource();
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
	/*
	stopBuffer() {
		let masterSourceRef = this.masterSource;
		let duration = this.audioContext.currentTime - this.masterSourceStartTime;
		let currentIndex = duration * this.audioContext.sampleRate;
		let fadeDuration = 100;
		let index = (fadeDuration/1000) * this.audioContext.sampleRate;
		this.fadeOutFrom(currentIndex, index);
		console.log(index, (currentIndex), duration);
		let stop_fn = (source) => {
			console.log(source);
			if (source != null) {
				source.stop();
				console.log("stoped audio1");
			}
			console.log("stoped audio2");
		};
		//console.log(this.getBuffer());
		console.log("stoped audio0");
		setTimeout(function() {stop_fn(masterSourceRef)}, fadeDuration);
	}*/
}