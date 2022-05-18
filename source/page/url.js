/**
 * Receives current settings and generates a long URL with all settings configured
 * @param {Array} presets 
 * @param {Array} norms 
 */
function saveSettings(presets, norms){
	let origin = window.location.pathname;
	origin += "?";
	origin += "func1=";
	origin += document.getElementById("functionInput").value+ "&";
	origin += "max=";
	origin += document.getElementById("maxXInput").value + "&";
	if(document.getElementById("normalizeCheckbox").checked) {
		origin += "normalise";
	}
	else {
		origin += "!normalise";
	}
	var adr = ["attack", "decay", "release"];
	var labels = ["funcAtt", "funcDec", "funcRel", "lengthAtt", "lengthDec", "lengthRel", "norm", "cont"];
	var labelcounter;
	for(let i = 0; i < 3; i++){
		labelcounter = i;
		for(let j=1; j<3; j++){
			origin += "&a" + labels[labelcounter] + "=" + presets["amplitude"][adr[i]][j];
			origin += "&t" + labels[labelcounter] + "=" + presets["filter"][adr[i]][j];
			origin += "&p" + labels[labelcounter] + "=" + presets["pitch"][adr[i]][j];
			labelcounter += 3;
		}
	}
	var j = 0;
	for(let i = 6; i<8; i++){
		origin += "&";
		if(!norms["amplitude"][j]) origin += "!";
		origin += "a" + labels[i];
		origin += "&";
		if(!norms["pitch"][j]) origin += "!";
		origin += "p" + labels[i];
		origin += "&";
		if(!norms["filter"][j++]) origin += "!";
		origin += "t" + labels[i]; 
	}
	var divs = ["applyAmplitude", "applyFilter", "applyPitch"];
	var apply = ["appA", "appF", "appP"];
	for(let i = 0; i<apply.length; i++){
	if(document.getElementById(divs[i]).checked) origin +=  "&" + apply[i];
	else origin +=  "&" + "!" + apply[i];
	}
	navigator.clipboard.writeText(window.location.origin + toURLSafe(origin));
}
/**
 * Translates an URL with settings to one with URL safe chars
 * @param {String} url 
 * @returns 
 */
function toURLSafe(url){
	if(url.includes("+")){
		return url.replaceAll("+", "plus");
	}
	return url;
}
/**
 * Translates an safe URL to a string with the correct chars
 * @param {String} url 
 * @returns 
 */
function fromURLSafe(url){
	if(url.includes("plus")){
		return url.replaceAll("plus", "+");
	}
	return url;
}
/**
 * Recieves an interface containing values loaded from the URL 
 * @param {URLSearchParams} urlParams 
 * @returns Three arrays containg each envelopes' settings in an array
 */
function loadURL(urlParams) {
	if(indexPage){
		document.getElementById("functionInput").value = fromURLSafe(urlParams.get('func1'));
		document.getElementById("maxXInput").value= urlParams.get("max");
	}
	var normalizeCheckbox;
	var amplitude = new Array(8);
	var pitch = new Array(8);
	var filter = new Array(8);
	normalizeCheckbox = urlParams.get("normalise") == '' ? true: false;
	//if(urlParams.get("normalise") == '')
	//	normalizeCheckbox = true;
	//else 
	//	normalizeCheckbox = false;
	if(indexPage){
		document.getElementById("normalizeCheckbox").checked = normalizeCheckbox;
	}

	var labels = ['funcAtt', 'funcDec', 'funcRel', 'lengthAtt', 'lengthDec', 'lengthRel', 'norm', 'cont'];
	for(let i = 0; i<pitch.length - 2; i++){
		amplitude[i] = fromURLSafe(urlParams.get('a' + labels[i]));
		pitch[i] = fromURLSafe(urlParams.get('p' + labels[i]));
		filter[i] = fromURLSafe(urlParams.get('t' + labels[i]));
	}
	for(let i = 3; i<6; i++){
		amplitude[i] = parseFloat(amplitude[i]);
		pitch[i] = parseFloat(pitch[i]);
		filter[i] = parseFloat(filter[i]);
	}
	
	for(let i = 6; i<pitch.length; i++){
		if(urlParams.get('a' + labels[i]) == ''){
		 amplitude[i] = true;
		}
		else {
			amplitude[i] = false;
		}
		if(urlParams.get('p' + labels[i]) == '') {
			pitch[i] = true;
		}
		else {
			pitch[i] = false;
		}
		if(urlParams.get('t' + labels[i]) == '') {
			filter[i] = true;
		}
		else {
			filter[i] = false;
		}
	}
	
	var divs = ["applyAmplitude", "applyFilter", "applyPitch"];
	var apply = ["appA", "appF", "appP"];
	for(let i = 0; i<apply.length; i++){
		if(indexPage){
			if(urlParams.get(apply[i]) == '') {
				document.getElementById(divs[i]).checked = true;
			}
			else {
				document.getElementById(divs[i]).checked = false;
			}
		}
	}
	return [fromURLSafe(urlParams.get('func1')),urlParams.get("max"),normalizeCheckbox,[amplitude, filter, pitch]];
}
