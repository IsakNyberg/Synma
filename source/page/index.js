var iframe = document.getElementById('main').contentWindow;
var documents = [
    iframe.document.documentElement,
    iframe.document.documentElement.cloneNode(true),
    iframe.document.documentElement.cloneNode(true)
];
var synths = [null,null,null];
synthIsInited = [false,false,false];
document.getElementById("f1").onclick = ()=>{
    console.log("click f1!");
    iframe.document.replaceChild(documents[0], iframe.document.documentElement);
    //if (synths[0].envelopeGraph) synths[0].envelopeGraph.destroy();
    synths[0].graphWave();
}
document.getElementById("f2").onclick = ()=>{
    console.log("click f2!");
    iframe.document.replaceChild(documents[1], iframe.document.documentElement);
    synths[1] = synths[1] == null ? iframe.init_synt() : synths[1];
    //if (synths[1].envelopeGraph) synths[1].envelopeGraph.destroy();
    synths[0].graphWave();
}
document.getElementById("f3").onclick = ()=>{
    console.log("click f3!");
    iframe.document.replaceChild(documents[2], iframe.document.documentElement);
    synths[2] = synths[2] == null ? iframe.init_synt() : synths[2];
    //if (synths[2].envelopeGraph) synths[2].envelopeGraph.destroy();
    synths[0].graphWave();
    
}
window.onload = ()=> synths[0] = iframe.init_synt();

