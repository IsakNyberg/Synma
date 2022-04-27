
/**
 * @class WaveForm - it's used to create a waveform from the inputed function by sampling the points and then we can play the buffer.
*/
class WaveForm {
	constructor() {
		this.audioContext = new AudioContext({sampleRate: 44100});
		this.samplingBuffer = this.audioContext.createBuffer(
			1, 
			this.audioContext.sampleRate, 
			this.audioContext.sampleRate
		)
		this.masterSource = null;
		this.masterSourceStartTime = 0;
		this.channelData = this.samplingBuffer.getChannelData(0);
		this.primaryGainControl = this.audioContext.createGain();
		this.analyser = this.audioContext.createAnalyser();
		this.analyser.fftSize = 2048;
		this.noteFreq=this.initFreqs();
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
		var bufferLength = this.audioContext.sampleRate / freq;
		var step = period / bufferLength;
		var buffer = new Float32Array(bufferLength);
		var x = 0;
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
		var max = 0;
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
		var start = this.samplingBuffer.length - numSamples;
		var ratio = 1;
		var step = 1/numSamples;
		for (let i = start; i < this.samplingBuffer.length; i++) {
			this.channelData[i] *= ratio;
			ratio -= step; 
		}
	}

	/*
	fadeOutFrom(index, numSamples) {
		var ratio = 1;
		var step = 1/numSamples;
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
		var bufferGain = this.audioContext.createGain();
		bufferGain.gain.setValueAtTime(1.0, 0);
		//bufferGain.gain.exponentialRampToValueAtTime(0., this.audioContext.currentTime + 1)
		bufferGain.connect(bufferGain)
		
		this.masterSource = this.audioContext.createBufferSource();
		this.masterSource.buffer = this.samplingBuffer;
		this.masterSource.connect(this.analyser);
		this.analyser.connect(this.primaryGainControl);
		this.masterSource.start();
		this.masterSourceStartTime = this.audioContext.currentTime;
		this.primaryGainControl.connect(this.audioContext.destination);
	}
	/*
	stopBuffer() {
		var masterSourceRef = this.masterSource;
		var duration = this.audioContext.currentTime - this.masterSourceStartTime;
		var currentIndex = duration * this.audioContext.sampleRate;
		var fadeDuration = 100;
		var index = (fadeDuration/1000) * this.audioContext.sampleRate;
		this.fadeOutFrom(currentIndex, index);
		console.log(index, (currentIndex), duration);
		var stop_fn = (source) => {
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

	/**
	 * this function will create the the structure that holds all of the octaves and the piano
	 * keys and their corresponding frequency 
	 * @returns {Structure}
	 */
	initFreqs(){
		let noteFreq = [];
		for (let i=0; i< 9; i++) {
			noteFreq[i] = [];
		}
		noteFreq[0]["A"] = 27.500000000000000;
		noteFreq[0]["A#"] = 29.135235094880619;
		noteFreq[0]["B"] = 30.867706328507756;
		noteFreq[1]["C"] = 32.703195662574829;
		noteFreq[1]["C#"] = 34.647828872109012;
		noteFreq[1]["D"] = 36.708095989675945;
		noteFreq[1]["D#"] = 38.890872965260113;
		noteFreq[1]["E"] = 41.203444614108741;
		noteFreq[1]["F"] = 43.653528929125485;
		noteFreq[1]["F#"] = 46.249302838954299;
		noteFreq[1]["G"] = 48.999429497718661;
		noteFreq[1]["G#"] = 51.913087197493142;
		noteFreq[1]["A"] = 55.000000000000000;
		noteFreq[1]["A#"] = 58.270470189761239;
		noteFreq[1]["B"] = 61.735412657015513;
		noteFreq[2]["C"] = 65.406391325149658;
		noteFreq[2]["C#"] = 69.295657744218024;
		noteFreq[2]["D"] = 73.416191979351890;
		noteFreq[2]["D#"] = 77.781745930520227;
		noteFreq[2]["E"] = 82.406889228217482;
		noteFreq[2]["F"] = 87.307057858250971;
		noteFreq[2]["F#"] = 92.498605677908599;
		noteFreq[2]["G"] = 97.998858995437323;
		noteFreq[2]["G#"] = 103.826174394986284;
		noteFreq[2]["A"] = 110.000000000000000;
		noteFreq[2]["A#"] = 116.540940379522479;
		noteFreq[2]["B"] = 123.470825314031027;
		noteFreq[3]["C"] = 130.812782650299317;
		noteFreq[3]["C#"] = 138.591315488436048;
		noteFreq[3]["D"] = 146.832383958703780;
		noteFreq[3]["D#"] = 155.563491861040455;
		noteFreq[3]["E"] = 164.813778456434964;
		noteFreq[3]["F"] = 174.614115716501942;
		noteFreq[3]["F#"] = 184.997211355817199;
		noteFreq[3]["G"] = 195.997717990874647;
		noteFreq[3]["G#"] = 207.652348789972569;
		noteFreq[3]["A"] = 220.000000000000000;
		noteFreq[3]["A#"] = 233.081880759044958;
		noteFreq[3]["B"] = 246.941650628062055;
		noteFreq[4]["C"] = 261.625565300598634;
		noteFreq[4]["C#"] = 277.182630976872096;
		noteFreq[4]["D"] = 293.664767917407560;
		noteFreq[4]["D#"] = 311.126983722080910;
		noteFreq[4]["E"] = 329.627556912869929;
		noteFreq[4]["F"] = 349.228231433003884;
		noteFreq[4]["F#"] = 369.994422711634398;
		noteFreq[4]["G"] = 391.995435981749294;
		noteFreq[4]["G#"] = 415.304697579945138;
		noteFreq[4]["A"] = 440.000000000000000;
		noteFreq[4]["A#"] = 466.163761518089916;
		noteFreq[4]["B"] = 493.883301256124111;
		noteFreq[5]["C"] = 523.251130601197269;
		noteFreq[5]["C#"] = 554.365261953744192;
		noteFreq[5]["D"] = 587.329535834815120;
		noteFreq[5]["D#"] = 622.253967444161821;
		noteFreq[5]["E"] = 659.255113825739859;
		noteFreq[5]["F"] = 698.456462866007768;
		noteFreq[5]["F#"] = 739.988845423268797;
		noteFreq[5]["G"] = 783.990871963498588;
		noteFreq[5]["G#"] = 830.609395159890277;
		noteFreq[5]["A"] = 880.000000000000000;
		noteFreq[5]["A#"] = 932.327523036179832;
		noteFreq[5]["B"] = 987.766602512248223;
		noteFreq[6]["C"] = 1046.502261202394538;
		noteFreq[6]["C#"] = 1108.730523907488384;
		noteFreq[6]["D"] = 1174.659071669630241;
		noteFreq[6]["D#"] = 1244.507934888323642;
		noteFreq[6]["E"] = 1318.510227651479718;
		noteFreq[6]["F"] = 1396.912925732015537;
		noteFreq[6]["F#"] = 1479.977690846537595;
		noteFreq[6]["G"] = 1567.981743926997176;
		noteFreq[6]["G#"] = 1661.218790319780554;
		noteFreq[6]["A"] = 1760.000000000000000;
		noteFreq[6]["A#"] = 1864.655046072359665;
		noteFreq[6]["B"] = 1975.533205024496447;
		noteFreq[7]["C"] = 2093.004522404789077;
		noteFreq[7]["C#"] = 2217.461047814976769;
		noteFreq[7]["D"] = 2349.318143339260482;
		noteFreq[7]["D#"] = 2489.015869776647285;
		noteFreq[7]["E"] = 2637.020455302959437;
		noteFreq[7]["F"] = 2793.825851464031075;
		noteFreq[7]["F#"] = 2959.955381693075191;
		noteFreq[7]["G"] = 3135.963487853994352;
		noteFreq[7]["G#"] = 3322.437580639561108;
		noteFreq[7]["A"] = 3520.000000000000000;
		noteFreq[7]["A#"] = 3729.310092144719331;
		noteFreq[7]["B"] = 3951.066410048992894;
		noteFreq[8]["C"] = 4186.009044809578154;
		return noteFreq;
	}
}