/**
 * Takes a number of samples from a number interval using a function.
 * @param {Number} n - Number interval.
 * @param {Number} samples - Number of samples in interval.
 * @param {Function} fn - Funtction to sample.
 * @returns {Array} Function samples
 */
 function soundBufferFromFunc(n,samples,fn,offset){
	var arr = new Array(samples);
	step = n/samples;
	let i, j = 0;
	for (i = 0; i < n; i += step) {
		arr[j++] = offset + fn(i)/10;
	}
	return arr;
}
	
class Envelope {
	#initialValue;	
	constructor(attack,decay,release,noOfSamples,attackLen,decayLen,releaseLen,audioCtx,normalized,continuos){
		this.attackLen = attackLen;
		this.decayLen = decayLen;
		this.releaseLen = releaseLen;
		this.attackBuffer = soundBufferFromFunc(attackLen,noOfSamples,attack,0);
		let offset = continuos ? this.attackBuffer[this.attackBuffer.length-1] : 0;
		this.decayBuffer = soundBufferFromFunc(decayLen,noOfSamples,decay,offset);
		offset = continuos ? this.decayBuffer[this.decayBuffer.length-1] : 0;
		this.releaseBuffer = soundBufferFromFunc(releaseLen,noOfSamples,release,offset);
		this.audioCtx = audioCtx;
		if(normalized)
			this.#normalizeEnv();
		this.#initialValue = 0;
	}
	/**
	 * Normalize according to the peak amplitude of the buffer.
	 */
	#normalizeEnv() {
		[this.attackBuffer,this.decayBuffer,this.releaseBuffer].forEach(function(x){
			let max = 0;
			for (let i = 0; i < x.length; i++) {
				max = Math.max(max, Math.abs(x[i]));
			}
			for (let i = 0; i < x.length; i++) {
				x[i] /= max;
			}
		})	
	}
	
	/**
	 * 
	 * @param {Array<Number>} curve
	 * @param {AudioParam} parameter
	 * @param {Number} startTime
	 * @param {Number} duration - of the sound
	 */
	#setValueCurveAtTime(curve,parameter,startTime,duration){
		if (startTime != Infinity) {
			let time = startTime;
			let step = duration/curve.length;
			for (let i = 0; i < curve.length; i++) {
				parameter.setValueAtTime(curve[i],time);
				time += step;
			}
		}
	}
	/**
	 *
	 * @param {AudioParam} parameter
	 * @param {Number} startTime
	 * @param {Number} duration
	 */
	applyEnvelope(parameter, startTime, duration){
		let adr = [this.attackBuffer, this.decayBuffer, this.releaseBuffer];
		let times = [startTime, startTime + this.attackLen, duration];
		let durations = [this.attackLen, this.decayLen, this.releaseLen];
		//console.log(adr[0][0]);
		for (let i = 0; i < adr.length; i++) {
			this.#setValueCurveAtTime(adr[i], parameter, times[i], durations[i]);
		}
	}
	/**
	 * Applies the gain-values of the attackBuffer, which is created from the attack function.
	 * @param {AudioParam} parameter
	 * @param {Number} currentTime
	 */
	 apply_attack(parameter, currentTime){
		this.#initialValue = parameter.value;
		this.#setValueCurveAtTime(this.attackBuffer,parameter,currentTime,this.attackLen);
	}
	/**
	 * Applies the gain-values of the decayBuffer, which is created from the decay function.
	 * @param {AudioParam} parameter
	 * @param {Number} currentTime 
	 */
	apply_decay(parameter, currentTime){
		parameter.cancelScheduledValues();
		let timeOffset = this.attackLen;
		this.#setValueCurveAtTime(this.decayBuffer,parameter,currentTime+timeOffset,this.decayLen);
	}
	/**
	 * Applies the gain-values of the releaseBuffer, which is created from the release function.
	 * @param {AudioParam} parameter
	 * @param {Number} currentTime
	 */
	apply_release(parameter,currentTime){
		parameter.cancelScheduledValues(currentTime);
		this.#setValueCurveAtTime(this.releaseBuffer,parameter,currentTime,this.releaseLen);
	}
}
