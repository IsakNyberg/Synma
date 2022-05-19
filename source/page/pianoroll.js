const canvas = document.getElementById('myCanvas');
const c = canvas.getContext('2d');
//const play = document.getElementById("play");
let cancel = null;

let isDrawing = false;
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

class Rectangle{
	constructor(x,y,color,x1,y1){
		this.x = x;
		this.y = y;
		this.color = color;
		this.x1 = x1;
		this.y1 = y1;
	}

	resetX(){
		this.x = 0;
	}

	iterateX(){
		this.x += 20;
	}

	getColor(){
		return this.color;
	}

	getX(){
		return this.x;
	}

	getY(){
		return this.y;
	}

	setColor(c){
		this.color = c;
	}

	getX1(){
		return this.x1;
	}

	getY1(){
		return this.y1;
	}

	getIndex(){
		return this.index;
	}

	draw(){
		c.beginPath();
		c.rect(this.x, this.y, this.x1, this.y1);
		c.fillStyle = this.color;
		c.fill()
	}

	update(){
		this.draw();
		//update1();
	}

	update1(move){
	 this.x1 += move;
	}

	setX1(length){   
		this.x1 = length;
	}

	
}

const Rectangles = [];
const Rectangles1 = [];
//const Rectangles2 = [];
const smallRectangles = [];
const timeline = [new Rectangle(
	0,
	0,
	'red',
	1,
	2560,
	)
];
let x = 0;
let y = 0;
let y1=0;
var colors = ["lightgrey", "darkgrey", "lightgrey", "lightgrey", "darkgrey", "lightgrey", "darkgrey", "lightgrey", "lightgrey", "darkgrey", "lightgrey", "darkgrey"];
for(let a= 0; a<128;a++){
	for(let i=0; i<40;i++){
		Rectangles.push(new Rectangle(
			x,
			y,
			colors[a%12],
			20,
			20,
		));

		if(i!=0){
		Rectangles1.push(new Rectangle(
			x,
			y,
			'black',
			1,
			20,
			));
		}

		Rectangles1.push(new Rectangle(
			x,
			y,
			'black',
			20,
			1,
		));
			x+=20;
	}
	x=0;
	y+=20;
};



function cancel_animation() {
	cancelAnimationFrame(cancel);
	return;
};

function animate(){
	cancel =requestAnimationFrame(animate);
	c.clearRect(0,0,canvas.width,canvas.height);
	Rectangles.forEach((Rectangle)=>{
		Rectangle.update();
	});
	Rectangles1.forEach((Rectangle)=>{
		Rectangle.update();
	});

	
	smallRectangles.forEach((Rectangleq)=>{
		Rectangleq.update();
	});


	timeline.forEach((Rectangle)=>{
		Rectangle.update();
	})
	
}
	

play.addEventListener("click", function() {
	createPianoRollFile();
});

animate(); //Must be done to create tiles/blocks
function movePiano(){
	canvasen = document.getElementById("myCanvas").getBoundingClientRect();
	yOffset = canvasen["y"];
	xOffset = canvasen["x"];
}

let lastchanse=0;
let last=0;
document.getElementById("myCanvas").addEventListener('mousedown', e => {
	mouseX = Math.floor(((e.clientX- xOffset + window.scrollX))/20);
	mouseY = Math.floor(((e.clientY - yOffset + window.scrollY) /*- 15*/)/20) * 40;

	currentX=e.clientX;
	currentY=e.clientY;
	isDrawing = true; 
});

document.getElementById("myCanvas").addEventListener('mousemove', event => {
	let value = 0;
	if (isDrawing === true) {
		let xT =Rectangles[mouseX+mouseY].getX();
		let yT=Rectangles[mouseX+mouseY].getY();
		value = event.clientX - currentX;

		smallRectangles.forEach((Rectangle,index)=>{	
			if((Rectangle.getX()===xT) && Rectangle.getY()===yT && Rectangle.getX1()>=3){	
				Rectangle.update1(value);
			};
			currentX=event.clientX;
			currentY=event.clientY;
		});
	}
});

document.getElementById("myCanvas").addEventListener('mouseup', e => {
	if (isDrawing === true) {		
		mouseX = 0;
		mouseY = 0;
		snap();
		isDrawing = false;
	}
});

var canvasen = document.getElementById("myCanvas").getBoundingClientRect();
var yOffset = canvasen["y"];
var xOffset = canvasen["x"];

document.getElementById("myCanvas").addEventListener('dblclick', (event)=>{
	let xT = Math.floor(((event.clientX- xOffset + window.scrollX))/20);
	let yT = Math.floor(((event.clientY - yOffset + window.scrollY))/20) * 40;
	let xS = Rectangles[xT+yT].getX();
	let yS = Rectangles[xT+yT].getY();
	smallRectangles.push(new Rectangle(
		xS,
		yS,
		randomColor(yS),
		20,
		20,
		(xS*yS)
	));
});

function randomColor(y){
	color = ["red", "blue", "yellow", "black", "orange", "purple"];
	return color[(y/20)%6];
	//return color[Math.floor(Math.random() * 6)];
};

function snap(){
	let height=0;
	smallRectangles.forEach((Rectangle)=>{
		if(Rectangle.getX1()%20!=0){
			height=(Rectangle.getX1()%20) + (Math.floor((Rectangle.getX1()/20)))*20 +20-(Rectangle.getX1()%20);
	 		Rectangle.setX1(height);
		}
		Rectangle.update();
	});
}

var timelineID;
var timelineID2;
var timelineID3;
function createPianoRollFile(){
	var newFile = [];
	smallRectangles.forEach((Rectangle)=>{
		newFile.push([((Rectangle.getY()/20)-127)*(-1), Rectangle.getX()/80, Rectangle.getX1()/80]);
	});
	
	/* Works to create downloadable file!!

	var filename = prompt("Choose file name", "Beautiful_song");
	var a = document.getElementById("download");
	var file = new Blob([JSON.stringify(newFile)], {type: 'application/json'});
	a.href = URL.createObjectURL(file);
	a.download = filename + ".synth";
	
	*/
	
	clearInterval(timelineID);
	clearInterval(timelineID2);
	clearInterval(timelineID3);
	timeline[0].resetX();
	newFile.forEach(note => {
		activeSynth.playNoteTimeDuration(note[0], note[1], note[2]);
	})
	timelineID = setInterval(moveTimeline, 250);
}
function moveTimeline(){
	timeline[0].iterateX();
}
