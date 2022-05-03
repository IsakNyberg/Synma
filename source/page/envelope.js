class Envelope {
    constructor(attack,decay,release,noOfSamples,attackLen,decayLen,releaseLen,audioCtx){
        this.attackLen=attackLen;
        this.decayLen=decayLen;
        this.releaseLen=releaseLen;
        this.attackBuffer = soundBufferFromFunc(attackLen,noOfSamples,attack);
        console.log(this.attackBuffer);
        this.decayBuffer = soundBufferFromFunc(decayLen,noOfSamples,decay);
        console.log(this.decayBuffer);
        this.releaseBuffer = soundBufferFromFunc(releaseLen,noOfSamples,release);
        console.log(this.releaseBuffer);
        this.sustain = this.decayBuffer[this.decayBuffer.length-1];
        this.audioCtx=audioCtx;
    }
    /**
    * 
    * @param {Array<Number>} curve 
    * @param {GainNode} gain 
    * @param {Number} startTime 
    * @param {Number} stopTime 
    */
    
}
class AmpEnvelope extends Envelope {
    constructor(attack,decay,release,noOfSamples,attackLen,decayLen,releaseLen,audioCtx){
        super(attack,decay,release,noOfSamples,attackLen,decayLen,releaseLen,audioCtx);
    }
    #setValueCurveAtTime(curve,gain,startTime,stopTime){
        let deltaTime=(stopTime-startTime)/curve.length;
        for (let i = 0; i < curve.length; i++) {
            gain.gain.setValueAtTime(curve[i],startTime + i*deltaTime);
        }
    }
    /**
     * 
     * @param {GainNode} gain 
     * @param {Number} startTime 
     */
    #cancelValueCurve(gain,startTime){
        let maxTime = this.attackLen + this.decayLen;
        let minTime = maxTime - this.audioCtx.currentTime;
        
        
    }
    /**
     * 
     * @param {GainNode} gain 
     */
    apply_attack(gain){
        gain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        console.log("Applying attack!\n"+this.attackBuffer);
        this.#setValueCurveAtTime(this.attackBuffer,gain,this.audioCtx.currentTime,this.attackLen);
        //gain.gain.setValueCurveAtTime(this.attackBuffer,this.audioCtx.currentTime,this.attackLen);
        
    }
    /**
     * 
     * @param {GainNode} gain 
     */
    apply_decay(gain){
        let timeOffset = this.attackLen;
        console.log("Applying decay!\n"+this.decayBuffer);
        this.#setValueCurveAtTime(this.decayBuffer,gain,this.audioCtx.currentTime+timeOffset,this.decayLen);
        //gain.gain.setValueCurveAtTime(this.decayBuffer,this.audioCtx.currentTime+timeOffset,this.decayLen);
    }
    /**
     * 
     * @param {GainNode} gain 
     */
    apply_sustain(gain){
        gain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        console.log("Applying sustain!");
        gain.gain.value =this.sustain;
    }
    /**
     * 
     * @param {GainNode} gain 
     */
    apply_release(gain){
        gain.gain.cancelScheduledValues(this.audioCtx.currentTime);

        console.log("Applying release!\n"+this.releaseBuffer);
        this.#setValueCurveAtTime(this.releaseBuffer,gain,this.audioCtx.currentTime,this.releaseLen);
        //gain.gain.setValueCurveAtTime(this.releaseBuffer,this.audioCtx.currentTime+0.01,this.releaseLen);
    }
}

/**
 * Takes a number of samples from a number interval using a function.
 * @param {Number} n - Number interval.
 * @param {Number} samples - Number of samples in interval.
 * @param {Function} fn - Funtction to sample.
 * @returns {Array} Function samples
 */
function soundBufferFromFunc(n,samples,fn){
    var arr=new Array(samples);
    step = n/samples;
    let i,j = 0;
    for (i = 0; i < n; i=i+step) {
        arr[j++]=fn(i);
    }
    return arr;
}
function apply_envelope(attackBuffer,decayBuffer,releaseBuffer){
    startTime=audioContext.currentTime;
	audioCtx.primaryGainControl.gain.setValueCurveAtTime([0,0.2,0.4,0.6,0.8,1],startTime,startTime+1);
	audioCtx.primaryGainControl.gain.setValueCurveAtTime([1,1,1,1,1,1],startTime+1,startTime+2);
}
