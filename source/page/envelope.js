
/**
 * Takes a number of samples from a number interval using a function.
 * @param {Number} n - Number interval.
 * @param {Number} samples - Number of samples in interval.
 * @param {Function} fn - Funtction to sample.
 * @returns {Array} Function samples
 */
 function soundBufferFromFunc(n,samples,fn){
    var arr = new Array(samples);
    step = n/samples;
    let i,j = 0;
    for (i = 0; i < n; i += step) {
        arr[j++] = fn(i)/10;
    }
    return arr;
}
class Envelope {
    constructor(attack,decay,release,noOfSamples,attackLen,decayLen,releaseLen,audioCtx){
        this.attackLen = attackLen;
        this.decayLen = decayLen;
        this.releaseLen = releaseLen;
        this.attackBuffer = soundBufferFromFunc(attackLen,noOfSamples,attack);
        this.decayBuffer = soundBufferFromFunc(decayLen,noOfSamples,decay);
        this.releaseBuffer = soundBufferFromFunc(releaseLen,noOfSamples,release);
        this.audioCtx = audioCtx;
    }  

}
class PitchEnvelope extends Envelope {
    #initialPlaybackRate;
    constructor(attack,decay,release,noOfSamples,attackLen,decayLen,releaseLen,audioCtx){
        super(attack,decay,release,noOfSamples,attackLen,decayLen,releaseLen,audioCtx);
        this.#initialPlaybackRate = 1;
    }
    /**
     * Sets value of the playback rates according to values of curve. distributes assignments evenly across duration
     * @param {Array<Number>} curve 
     * @param {AudioBufferSourceNode} source 
     * @param {Number} startTime 
     * @param {Number} stopTime 
     */
    #setValueCurveAtTime(curve,source,startTime,duration){
        let deltaTime = duration/curve.length;
        for (let i = 0; i < curve.length; i++) {
            console.log(this.#initialPlaybackRate * curve[i]);
            source.playbackRate.setValueAtTime(this.#initialPlaybackRate + curve[i] * 10,startTime + i*deltaTime);
        }
    }
    /**
     * Applies the gain-values of the attackBuffer, which is created from the attack function.
     * @param {AudioBufferSourceNode} source
     */
     apply_attack(source){
        this.#initialPlaybackRate = source.playbackRate.value;
        console.log(this.#initialPlaybackRate);
        this.#setValueCurveAtTime(this.attackBuffer,source,this.audioCtx.currentTime,this.attackLen);
    }
    /**
     * Applies the gain-values of the decayBuffer, which is created from the decay function.
     * @param {AudioBufferSourceNode} source 
     */
    apply_decay(source){
        let timeOffset = this.attackLen;
        this.#setValueCurveAtTime(this.decayBuffer,source,this.audioCtx.currentTime+timeOffset,this.decayLen);
    }
    /**
     * Applies the gain-values of the releaseBuffer, which is created from the release function.
     * @param {AudioBufferSourceNode} source
     */
    apply_release(source){
        source.playbackRate.cancelScheduledValues(this.audioCtx.currentTime);
        this.#setValueCurveAtTime(this.releaseBuffer,source,this.audioCtx.currentTime,this.releaseLen);
    }
}
class TimbreEnvelope extends Envelope {
    constructor(attack,decay,release,noOfSamples,attackLen,decayLen,releaseLen,audioCtx){
        super(attack,decay,release,noOfSamples,attackLen,decayLen,releaseLen,audioCtx);
    }
    /**
    * Alternative to node.setValueCurveAtTime because node.setValueCurveAtTime does not work when node.cancelScheduledValues is used.
    * @param {Array<Number>} curve 
    * @param {BiquadFilterNode} filter 
    * @param {Number} startTime 
    * @param {Number} stopTime 
    */
    #setValueCurveAtTime(curve,filter,startTime,stopTime){
        let deltaTime = stopTime/curve.length;
        for (let i = 0; i < curve.length; i++) {
            filter.frequency.setValueAtTime(10 * curve[i], startTime + i * deltaTime);       
        }
    }
    /**
     * Applies the gain-values of the attackBuffer, which is created from the attack function.
     * @param {BiquadFilterNode} filter
     */
    apply_attack(filter){
        //console.log(this.audioCtx);
        this.#setValueCurveAtTime(this.attackBuffer,filter,this.audioCtx.currentTime,this.attackLen);
    }
    /**
     * Applies the gain-values of the decayBuffer, which is created from the decay function.
     * @param {BiquadFilterNode} filter 
     */
    apply_decay(filter){
        let timeOffset = this.attackLen;
        this.#setValueCurveAtTime(this.decayBuffer,filter,this.audioCtx.currentTime+timeOffset,this.decayLen);
    }
    /**
     * Applies the gain-values of the releaseBuffer, which is created from the release function.
     * @param {BiquadFilterNode} filter
     */
    apply_release(filter){
        filter.frequency.cancelScheduledValues(this.audioCtx.currentTime);
        this.#setValueCurveAtTime(this.releaseBuffer,filter,this.audioCtx.currentTime,this.releaseLen);
    }
}
/**
 * @class An exension of the Envelope class which creates an Amplitude Envelope object. Contains functions for applying attack, decay and release.
 */
class AmpEnvelope extends Envelope {
    constructor(attack,decay,release,noOfSamples,attackLen,decayLen,releaseLen,audioCtx){
        super(attack,decay,release,noOfSamples,attackLen,decayLen,releaseLen,audioCtx);
    }
    /**
    * Alternative to node.setValueCurveAtTime because node.setValueCurveAtTime does not work when node.cancelScheduledValues is used.
    * @param {Array<Number>} curve 
    * @param {GainNode} gain 
    * @param {Number} startTime 
    * @param {Number} stopTime 
    */
    #setValueCurveAtTime(curve,gain,startTime,stopTime){
        let deltaTime = stopTime/curve.length;
        for (let i = 0; i < curve.length; i++) {
            gain.gain.setValueAtTime(curve[i],startTime + i*deltaTime);
        }

    }
    /**
     * Applies the gain-values of the attackBuffer, which is created from the attack function.
     * @param {GainNode} gain 
     */
    apply_attack(gain){
        this.#setValueCurveAtTime(this.attackBuffer,gain,this.audioCtx.currentTime,this.attackLen);
        
    }
    /**
     * Applies the gain-values of the decayBuffer, which is created from the decay function.
     * @param {GainNode} gain 
     */
    apply_decay(gain){
        let timeOffset = this.attackLen;
        this.#setValueCurveAtTime(this.decayBuffer,gain,this.audioCtx.currentTime+timeOffset,this.decayLen);
    }
    /**
     * Applies the gain-values of the releaseBuffer, which is created from the release function.
     * @param {GainNode} gain
     */
    apply_release(gain){
        gain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.#setValueCurveAtTime(this.releaseBuffer,gain,this.audioCtx.currentTime,this.releaseLen);
    }
}
