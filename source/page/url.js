function saveSettings(){
let origin = window.location.origin + window.location.pathname;
origin+="?";
origin+="func1=";
origin+=document.getElementById("functionInput").value+ "&";
origin+="max=";
origin+=document.getElementById("maxXInput").value + "&";

if(document.getElementById("normalizeCheckbox").checked) origin+="normalise";
else origin+="!normalise";


    var labels = ["funcAtt", "funcDec", "funcRel", "lengthAtt", "lengthDec", "lengthRel", "norm", "cosnt"];
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

document.getElementById("functionInput").value = urlParams.get('func1');
document.getElementById("maxXInput").value= urlParams.get("max");
document.getElementById("normalizeCheckbox").checked=urlParams.get("normalizeCheckbox")

var labels = ['funcAtt', 'funcDec', 'funcRel', 'lengthAtt', 'lengthDec', 'lengthRel', 'norm', 'cosnt'];
for(let i = 0; i<pitch.length; i++){
    amplitude[i] = urlParams.get('a' + labels[i]);
    pitch[i] = urlParams.get('p' + labels[i]);
    timbre[i] = urlParams.get('t' + labels[i]);
}

submitFunction();
chosenEnvelope(1);
chosenEnvelope(2);
chosenEnvelope(3);