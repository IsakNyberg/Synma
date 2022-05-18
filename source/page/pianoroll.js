const canvas = document.getElementById('myCanvas');
const c = canvas.getContext('2d');
const play = document.getElementById("play");
let cancel = null;
//  canvas.width= innerWidth;
//  canvas.height=innerHeight;

let isDrawing = false;
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

//let testX=0;
//let testY=0;

class Rectangle{
	constructor(x,y,color,x1,y1){
		this.x = x;
		this.y = y;
		this.color = color;
		this.x1 = x1;
		this.y1 = y1;
		//this.index;
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

	setX1(xxxxxxxx){
		this.x1 = xxxxxxxx;
	}

	check(x1000,y1000){
		if(x1000 >= this.x && x1000 <= (this.x + 19) && y1000 >= this.y && y1000 <= (this.y+19))
			return true;
	}

	increaseIndex()
	{
		let bbb = this.getX1()/20;
		return bbb;
	}
}

const Rectangles = [];
const Rectangles1 = [];
const Rectangles2 = [];
const smallRectangles = [];
let redRectangles = [];
let x = 0;
let y = 0;
let y1=0;
for(let a= 0; a<5;a++){
	for(let i=0; i<5;i++){
		Rectangles.push(new Rectangle(
			x,
			y,
		 'gray',
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
	redRectangles=[];
	smallRectangles.forEach((Rectangleq)=>{
		Rectangleq.update();
	});
	redRectangles.forEach((Rectangle)=>{
		Rectangle.update();
	})
}
	
play.addEventListener("click", function() {
	animate();
	movePiano();
});

function movePiano(){
	document.getElementById("piano").style.transform = "rotate(-90deg)";
	document.getElementById("piano").style.display = "block";
	document.getElementById("piano").style.position = "absolute";
	document.getElementById("piano").style.left = "-42.5%";
	document.getElementById("piano").style.top = "0";
	document.getElementById("piano").style.position = "absolute";
	document.getElementById("piano").style.left = "-42.5%";
	//document.getElementById("piano").style.top = "1000px";
	//document.getElementById("myCanvas").style.position = "absolute";
	//document.getElementById("myCanvas").style.left = "15%";
	//document.getElementById("myCanvas").style.top = "69.6%";
	//document.getElementById("myCanvas").style.position = "absolute";
	//document.getElementById("myCanvas").style.left = "15%";
	//document.getElementById("myCanvas").style.top = "69.6%";

	var elements = document.getElementsByClassName("both");
	var whites = document.getElementsByClassName("white");
	var blacks = document.getElementsByClassName("black");
	var covereds = document.getElementsByClassName("coveredWhite");
	var rights = document.getElementsByClassName("borderRight");
	var lefts = document.getElementsByClassName("borderLeft");

	console.log(whites)
	for(var i=0; i<elements.length; i++) { 
		elements[i].style.width = "20px";
	}
	for(var i=0; i<blacks.length; i++) { 
		blacks[i].style.width = "20px";
	}
	for(var i=0; i<covereds.length; i++) { 
		covereds[i].style.width = "20px";
	}
	for(var i=0; i<whites.length; i++) { 
		whites[i].style.width = "19px";
	}
	for(var i=0; i<lefts.length; i++) { 
		lefts[i].style.width = "19px";
	}
	for(var i=0; i<rights.length; i++) { 
		rights[i].style.width = "19px";
	}
	/*
	elements.forEach(element => {
		element.style.width = "20px";
	});
	whites.forEach(element => {
		element.style.width = "19px";
	});
	covereds.forEach(element => {
		element.style.width = "20px";
	});*/

	//document.getElementsByClassName("both").style.width = "20px";
	//document.getElementsByClassName("white").style.width = "19px";
	//document.getElementsByClassName("coveredWhite").style.width = "20px";

	canvasen = document.getElementById("myCanvas").getBoundingClientRect();
	yOffset = canvasen["y"];
	xOffset = canvasen["x"];
}

let lastchanse=0;
let last=0;
document.getElementById("myCanvas").addEventListener('mousedown', e => {
	console.log(e.clientX, e.clientY);
	console.log("söker:", ((e.clientX)-10 + window.scrollX), ((e.clientY)-18 + window.scrollY))

	mouseX = Math.floor(((event.clientX- xOffset + window.scrollX))/20);
	mouseY = Math.floor(((event.clientY - yOffset + window.scrollY) - 15)/20) * 5;
	currentX=e.clientX;
	currentY=e.clientY;
	isDrawing = true; 
});

document.getElementById("myCanvas").addEventListener('mousemove', event => {
	let value = 0;
	if (isDrawing === true) {
		let xT =Rectangles[mouseX+mouseY].getX();
		let yT=Rectangles[mouseX+mouseY].getY();
	
		if(event.clientX>currentX) {value=1;}
		else value=-1;

		let counter =0;
		smallRectangles.forEach((Rectangle,index)=>{	
			if((Rectangle.getX()===xT) && Rectangle.getY()===yT && Rectangle.getX1()>=3){	
				console.log(lastchanse);
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
console.log(xOffset, yOffset);

document.getElementById("myCanvas").addEventListener('dblclick', (event)=>{
	let xT = Math.floor(((event.clientX- xOffset + window.scrollX))/20);
	let yT = Math.floor(((event.clientY - yOffset + window.scrollY) - 34)/20) * 5;
	let xS = Rectangles[xT+yT].getX();
	let yS = Rectangles[xT+yT].getY();
	smallRectangles.push(new Rectangle(
		xS,
		yS,
		randomColor(),
		20,
		20,
		(xS*yS)
	));
});

function randomColor(){
	color = ["red", "blue", "yellow", "black", "orange", "purple"];
	return color[Math.floor(Math.random() * 6)];
};

function snap(){
	let height=0;
	smallRectangles.forEach((Rectangle)=>{
		if(Rectangle.getX1()%20!=0){
			height=(Rectangle.getX1()%20) + (Math.floor((Rectangle.getX1()/20)))*20 +20-(Rectangle.getX1()%20);
	 		console.log(height);
	 		Rectangle.setX1(height);
		}
		//console.log(Rectangle);
		Rectangle.update();
	});
}

function createPianoRollFile(){
	var newFile = [];
	smallRectangles.forEach((Rectangle)=>{
		newFile.push([Rectangle.getY()/20, Rectangle.getX()/20, Rectangle.getX1()/20]);
	});
	var filename = prompt("Choose file name", "Beautiful_song");
	var a = document.getElementById("download");
	var file = new Blob([JSON.stringify(newFile)], {type: 'application/json'});
	a.href = URL.createObjectURL(file);
	a.download = filename + ".synth";
}
