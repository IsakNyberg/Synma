const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const play = document.getElementById("play");
let cancel= null;


//  canvas.width= innerWidth;
//  canvas.height=innerHeight;

let isDrawing = false;
let mouseX = 0;
let mouseY = 0;
let currentX=0;
let currentY=0;

//let testX=0;
//let testY=0;


class Rectangle{
  constructor(x,y,color,x1,y1){
    this.x=x;
    this.y=y;
    this.color=color;
    this.x1=x1;
    this.y1=y1;
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
      this.color=c;
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
      c.rect(this.x,this.y,this.x1,this.y1);
      c.fillStyle=this.color;
      c.fill()

    }

    update(){
      this.draw();
      //update1();
    }

    update1(move){
     this.x1+=move;
    }

    setX1(xxxxxxxx){
      this.x1=xxxxxxxx;
    }

    check(x1000,y1000){
    if(x1000>=this.x && x1000<=(this.x+19) && y1000>=this.y && y1000<=(this.y+19))
    return true;
    }

    increaseIndex()
    {
      let bbb = this.getX1()/20;
      return bbb;
    }

  }




  const Rectangles =[];
  const Rectangles1 =[];
  const Rectangles2 =[];
  const smallRectangles = [];
  let redRectangles=[];

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

     //y+=20;
     //x++;

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


//let i=0;
  function animate(){

    cancel =requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    Rectangles.forEach((Rectangle)=>{
      //console.log(Rectangle.getX());
      // i++;
    //   if(Rectangles[Rectangles.length-1].getX()<-500){
    //   cancel_animation();
    // }

      Rectangle.update();});

      Rectangles1.forEach((Rectangle)=>{


        Rectangle.update();
    });

  //   Rectangles2.forEach((Rectangle)=>{


  //     Rectangle.update();
  // });

  redRectangles=[];

  smallRectangles.forEach((Rectangleq)=>{

    // console.log(Rectangleq.getIndex());
    //Rectangleq.getX1()/20
  //   redRectangles.push(new Rectangle(
  //     (Rectangleq.getX()+Rectangleq.getX1()-1),
  //     (Rectangleq.getY()+Rectangleq.getY1()-1),
  //    "red",
  //    1,
  //    1,
  //    (Rectangleq.getX()*Rectangleq.getY())))
  // //console.log(Rectangle);

    Rectangleq.update();


});


redRectangles.forEach((Rectangle)=>{
  Rectangle.update();


})




  }


  play.addEventListener("click", function() {
    animate();



  });

  let lastchanse=0;
  let last=0;

  window.addEventListener('mousedown', e => {
    mouseX = Math.floor(((e.clientX)-10)/20);
    mouseY = Math.floor(((e.clientY)-10)/20) * 5 ;
    currentX=e.clientX;
    currentY=e.clientY;
    isDrawing = true;

   
  });

  window.addEventListener('mousemove', e => {
    let value = 0;
    if (isDrawing === true) {
       let xT =Rectangles[mouseX+mouseY].getX();
       let yT=Rectangles[mouseX+mouseY].getY();
      //  //let testX=Math.floor((Rectangles[mouseX+mouseY].getX1())/20)+mouseX+mouseY;
      //  //console.log(" not wojfhgchjorehitöurl  " +Math.floor((Rectangles[mouseX+mouseY].getX1())/20))
      //  //if((testX-(mouseX+mouseY))!=1){
      //  testX=testX-1;
      //  //};
      //  console.log("mouse  "+ (mouseX + mouseY));
      //  console.log("test   "+testX);
      //   xT =Rectangles[testX].getX();
      //   yT=Rectangles[testX].getY();
       if(e.clientX>currentX) {value=1;}
       else value=-1;

       let counter =0;
       smallRectangles.forEach((Rectangle,index)=>{
       
        //console.log(Rectangle.getX1()/20)

          if((Rectangle.getX()===xT) && Rectangle.getY()===yT && Rectangle.getX1()>=3){
            
             console.log(lastchanse);
             Rectangle.update1(value);
          };
          // if(Rectangle.check((currentX+10),(currentY+10))){
          // Rectangle.update1(value);
          // }

        // if(Rectangle.getX1()==3)
        // Rectangle.update1(1);

        // if(Rectangle.getX1()==0)
        // smallRectangles.splice(index, 1);

        // currentX=e.clientX;
        // currentY=e.clientY;
        currentX=e.clientX;
        currentY=e.clientY;

      });

     

       //smallRectangles[xT+yT].update1(1);
      //x = e.offsetX;
      //y = e.offsetY;
    }
  });

  window.addEventListener('mouseup', e => {
    if (isDrawing === true) {
      //drawLine(context, x, y, e.offsetX, e.offsetY);
      mouseX = 0;
      mouseY = 0;
      snap();
      isDrawing = false;
    }
  });





   window.addEventListener('dblclick', (event)=>{

      let xT = Math.floor(((event.clientX)-10)/20);
      let yT=Math.floor(((event.clientY)-10)/20) * 5 ;


     // Rectangles[xT+yT].setColor("blue");



    let xS =  Rectangles[xT+yT].getX();
    let yS = Rectangles[xT+yT].getY();
     smallRectangles.push(new Rectangle(
      xS,
      yS,
     randomColor(),
     20,
     20,
     (xS*yS)




     ));







     //smallRectangles[smallRectangles.length-1].setSquare();

   });

  function randomColor(){
   color = ["red", "blue", "yellow", "black", "orange", "purple"];
   return color[Math.floor(Math.random() * 6)];
  };


  function snap(){
    let height=0;
    smallRectangles.forEach((Rectangle)=>{
      if(Rectangle.getX1()%20!=0){
     height=(Rectangle.getX1()%20) + (Math.floor((Rectangle.getX1()/20)))*20 +20-(Rectangle.getX1()%20) ;
     console.log(height);
     Rectangle.setX1(height);}


      //console.log(Rectangle);
        Rectangle.update();

    });
  }
