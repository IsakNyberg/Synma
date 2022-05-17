class record{
	#startedIndexs = [];
	#stoppedIndexs = [];
	#startTime = 0;
	#result = [];
	
	constructor(){
		this.#startedIndexs = [];
		this.#stoppedIndexs = [];
		this.#result = [];
		this.#startTime = 0;
	}
	startRec(startTime){
		this.#startTime = startTime;
	}
	stopRec(){
		return this.#convert();
	}
	startedIndex(index, time){
		this.#startedIndexs.push([index, time]);
	}
	stoppedIndex(index, time){
		this.#stoppedIndexs.push([index, time]);
	}
	#convert(){
		var recording = [];
		var i = 0;
		while(this.#stoppedIndexs.length > 0){
				var k;
				for(let j=0; j<this.#stoppedIndexs.length; j++){
						if(this.#stoppedIndexs[j][0] == this.#startedIndexs[i][0]){
								k = j;
								j = this.#stoppedIndexs.length;
						}
				}
				recording.push([this.#startedIndexs[i][0], this.#startedIndexs[i][1] - this.#startTime, this.#stoppedIndexs[k][1] - this.#startedIndexs[i][1]]);
				this.#startedIndexs.splice(i, 1);
				this.#stoppedIndexs.splice(k, 1)
				i = 0;
		}
		return recording;
	}

	createDownloadFile(array, name) {
		var a = document.getElementById("download");
		var file = new Blob([JSON.stringify(array)], {type: 'application/json'});
		a.href = URL.createObjectURL(file);
		a.download = name;
	}
}