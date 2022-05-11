/**
 * @class WaveForm - it's used to create a waveform from the inputed function by sampling the points and then we can play the buffer.
*/

class WaveForm{
	constructor(audioContext, samplingBuffer, masterVolume) {
		this.audioContext = audioContext;
		this.samplingBuffer = samplingBuffer;
		this.masterSource = null;
		this.bufferGain = this.audioContext.createGain();
		this.channelData = this.samplingBuffer.getChannelData(0);
		this.primaryGainControl = masterVolume;
		this.bufferBiquadFilter = this.audioContext.createBiquadFilter();
	}

	/**
	 * This function will set the volume for primary gain control.
	 * @param {number} volume - take the volume to be set 
	 */
	setGain(volume) {
		this.primaryGainControl.gain.setValueAtTime(volume, 0);
	}
	
	/**
	 * Getter for buffer.
	 * @returns {Float32Array} - the buffer with sample points
	 */
	getBuffer() {
		return this.channelData;
	}
	
	/**
	 * @param {AudioContext} audioContext The main audio context.
	 * @param {function} fn The waveform function.
	 * @param {Number} maxX the maxX for the function .
	 * @param {Number} resolution the number of samples of the base waveform .
	 * @returns {AudioBuffer} The buffer of the base waveform.
	 */
	static computeBase(audioContext, fn, maxX, resolution) {
		let baseFrequencyLength = resolution;
		let samplingBuffer = audioContext.createBuffer(
			1,
			baseFrequencyLength,
			audioContext.sampleRate
		);
		let channelData = samplingBuffer.getChannelData(0);
		let step = maxX / baseFrequencyLength;
		let x = 0;
		for (let t = 0; t < baseFrequencyLength; t++) {
			channelData[t] = fn(x);
			x += step;
		}
		return samplingBuffer;
	}
	
	/**
	 * Normalize according to the peak amplitude of the buffer.
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
	 * Creates the sourceBuffer. Seperate function from playBuffer(), so that pitch envelopes can be applied
	 * before the source is scrapped.
	 * @param {Number} freq 
	 */
	createMasterSource(freq){
		this.masterSource = this.audioContext.createBufferSource();
		this.masterSource.playbackRate.value =
			freq * this.samplingBuffer.length / this.audioContext.sampleRate;
		this.bufferGain.gain.cancelScheduledValues(this.audioContext.currentTime);
		this.masterSource.playbackRate.cancelScheduledValues(this.audioContext.currentTime);
		this.bufferBiquadFilter.frequency.cancelScheduledValues(this.audioContext.currentTime);
		this.bufferGain.gain.value = 1.0;
		this.bufferBiquadFilter.frequency.value = 22000; // for a lowpass this ~should~ neutralize the biquad.
	}

	/**
	 * Play the waveform 
	 */
	playBuffer() {
		this.playBufferAt(0, 0);
	}

	/**
	* Plays buffer with a start time and a dration
	*/
	playBufferAt(start, duration) {
		this.masterSource.loop = true;
		this.masterSource.buffer = this.samplingBuffer;
		this.masterSource.connect(this.bufferBiquadFilter);
		this.bufferBiquadFilter.type = 'lowpass';
		this.bufferBiquadFilter.Q.value = 1;
		this.bufferBiquadFilter.connect(this.bufferGain);
		this.bufferGain.connect(this.primaryGainControl);
		this.primaryGainControl.connect(this.audioContext.destination);
		this.masterSource.start(this.audioContext.currentTime + start);
		if (duration > 0) {
			this.masterSource.stop(this.audioContext.currentTime + start + duration);
		}
	}
	

	/**
	 * Stop the waveform.
	 *  @param {Number} releaseLen The length of the release in units of time.
	 */
	stopBuffer(releaseLen) {
		this.masterSource.stop(this.audioContext.currentTime + releaseLen);
	}
}
