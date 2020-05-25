let width = 2000;
let height = 2000;
let diagWidth = 100;
let diagHeight = 100;

let time = 0, CANVAS;


let dftX=[];
let dftY=[];

let signalsX=[];
let signalsY=[];

let plot=[];

let dt=0;

let font, writePath;

let MESSAGE = "Fourier was Genius...";

function preload(){
  // font = loadFont("../font/neon.ttf");
  font = loadFont("../font/arial.ttf");
}

function configChange(){
  MESSAGE = document.querySelector("#textMessage").value;
   convertTextToSignals();
}


function textPath(msg){
  textFont(font, 75);
  fill('red');
  let p = font.textToPoints(msg, 100,100);
  return p;
}

function convertTextToSignals(){

  signalsY=[];
  signalsX=[];
  plot=[];
  dftY=[];
  dftX=[];

  document.querySelector("#textMessage").value = MESSAGE;
  writePath = textPath(MESSAGE);

  for(let a=0; a<writePath.length;a+=1){
    let x = writePath[a]['x']
    let y = writePath[a]['y']
    signalsY.push(y);
    signalsX.push(x);
  }
  
  let sortBy = (a,b) => b.amp - a.amp;

  dftX = transform(signalsX);
  dftX.sort(sortBy);

  dftY = transform(signalsY);
  dftY.sort(sortBy);

  dt =(TWO_PI/signalsX.length);
  
  time=0;
}

function setup() {
  width = max(width, windowWidth);
  height = max(height, windowHeight);

  CANVAS = createCanvas(width,height);
  CANVAS.parent('canvas-container');

  convertTextToSignals();
}

function draw() {
  background(0);

  let bottom = createVector(diagWidth, diagHeight*3);
  let top = createVector(diagWidth*2, diagHeight);
  
  let plotVectorX = drawEpiCycle(top.x, top.y, dftX , 0);
  let plotVectorY = drawEpiCycle(bottom.x, bottom.y, dftY , HALF_PI);

  plot.unshift(createVector(plotVectorX.x, plotVectorY.y));

  push()
    translate(top.x, bottom.y)

    beginShape();
      noFill();
      strokeWeight(1);
      stroke('green');
      for (let i=0; i < plot.length; i++){
        vertex(plot[i].x,plot[i].y);
      }
    endShape();


    push()
      stroke("magenta");
      strokeWeight(0.5);
      line(plotVectorY.x-(top.x - bottom.x), plotVectorY.y, plot[0].x , plot[0].y);
      line(plotVectorX.x, plotVectorX.y-(bottom.y - top.y), plot[0].x , plot[0].y);
    pop()
  pop()

  time += dt;

  if(time >= TWO_PI){
    plot=[];
    time=0;
  }

}

function drawEpiCycle(posX, posY, transformedSignal, offset){
  let centerX = 0;
  let centerY = 0;
  let x=0, y=0;

  for (let i=0; i < transformedSignal.length; i++){
    push()
      translate(posX, posY);
      
      centerX = x;
      centerY = y;

      stroke(255, 50);
      strokeWeight(1);
      noFill();

      let amp = transformedSignal[i].amp;
      let phase = transformedSignal[i].phase;
      let freq = transformedSignal[i].freq;
      
      ellipse(centerX, centerY, 2 * amp);

      let phi =(freq * time) + (phase + offset);
      x += amp * cos(phi);
      y += amp * sin(phi);

      push()
        stroke('yellow');
        line(centerX, centerY, x, y);
        strokeWeight(2);
        point(x,y);
      pop();

    pop();
  }

  return createVector(x,y);
}