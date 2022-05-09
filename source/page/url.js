function saveSettings(){
let origin = window.location.pathname;
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

    navigator.clipboard.writeText(window.location.origin + toURLSafe(origin));
}

function toURLSafe(url){
    if(url.includes("+")){
        return url.replaceAll("+", "plus");
    }
    return url;
}
function fromURLSafe(url){
    if(url.includes("plus")){
        return url.replaceAll("plus", "+");
    }
    return url;
}

let origin = window.location.search;
const urlParams = new URLSearchParams(origin);
console.log(fromURLSafe(origin));
if(urlParams.has('func1')){
    document.getElementById("functionInput").value = fromURLSafe(urlParams.get('func1'));
    document.getElementById("maxXInput").value= urlParams.get("max");
    var normalizeCheckbox;
    if(urlParams.get("normalise") == '')
        normalizeCheckbox = true;
    else 
        normalizeCheckbox = false;
    document.getElementById("normalizeCheckbox").checked = normalizeCheckbox;

    var labels = ['funcAtt', 'funcDec', 'funcRel', 'lengthAtt', 'lengthDec', 'lengthRel', 'norm', 'cont'];
    for(let i = 0; i<pitch.length - 2; i++){
        amplitude[i] = fromURLSafe(urlParams.get('a' + labels[i]));
        pitch[i] = fromURLSafe(urlParams.get('p' + labels[i]));
        timbre[i] = fromURLSafe(urlParams.get('t' + labels[i]));
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

    submitFunction();
    chosenEnvelope(1);
    chosenEnvelope(2);
    chosenEnvelope(3);

}