function saveSettings(){
let origin = window.location.origin + window.location.pathname;
origin+="?";
origin+="func1=";
origin+=document.getElementById("functionInput").value+ "&";
origin+="max=";
origin+=document.getElementById("maxXInput").value + "&";

if(document.getElementById("normalizeCheckbox").checked) origin+="normalise";
else origin+="!normalise";


    var labels = ["funcAtt", "funcDec", "funcRel", "lengthAtt", "lengthDec", "lengthRel", "norm", "cont"];
    for(let i = 0; i<pitch.length - 2; i++){
        origin += "&a" + labels[i] + "=" + amplitude[i];
        origin += "&p" + labels[i] + "=" + pitch[i];
        origin += "&t" + labels[i] + "=" + timbre[i]; 
    }
    for(let i = 6; i<pitch.length; i++){
        origin += "&";
        if(!amplitude[i]) origin += "!";
        origin += "a" + labels[i];
        origin += "&";
        if(!pitch[i]) origin += "!";
        origin += "p" + labels[i];
        origin += "&";
        if(!timbre[i]) origin += "!";
        origin += "t" + labels[i]; 
    }
    navigator.clipboard.writeText(origin);
}


let origin = window.location.search;
const urlParams = new URLSearchParams(origin);

if(urlParams.has('func1')){
    document.getElementById("functionInput").value = urlParams.get('func1');
    document.getElementById("maxXInput").value= urlParams.get("max");
    document.getElementById("normalizeCheckbox").checked=urlParams.get("normalizeCheckbox")

    var labels = ['funcAtt', 'funcDec', 'funcRel', 'lengthAtt', 'lengthDec', 'lengthRel', 'norm', 'cont'];
    for(let i = 0; i<pitch.length - 2; i++){
        amplitude[i] = urlParams.get('a' + labels[i]);
        pitch[i] = urlParams.get('p' + labels[i]);
        timbre[i] = urlParams.get('t' + labels[i]);
    }
    for(let i = 3; i<6; i++){
        amplitude[i] = parseFloat(amplitude[i]);
        pitch[i] = parseFloat(pitch[i]);
        timbre[i] =parseFloat(timbre[i]);
    }
    
    for(let i = 6; i<pitch.length; i++){
        if(urlParams.get('a' + labels[i]) == '') amplitude[i] = true;
        else amplitude[i] = false;
        if(urlParams.get('p' + labels[i]) == '') pitch[i] = true;
        else pitch[i] = false;
        if(urlParams.get('t' + labels[i]) == '') timbre[i] = true;
        else timbre[i] = false;
    }
    console.log("fixat");

    submitFunction();
    chosenEnvelope(1);
    chosenEnvelope(2);
    chosenEnvelope(3);

}