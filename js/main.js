let width = 0;
let height = 0;
let diagWidth = width / 5;
let diagHeight = 200;
let noOfCircles = 2;
let skip = 1;

let time = 0, CANVAS;

ySignal = [];

function configChange(){
  
  noOfCircles = parseInt(document.querySelector("#noOfCircles").value);
  skip = parseInt(document.querySelector("#skip").value);

  document.querySelector("#noOfCirclesValue").innerText = document.querySelector("#noOfCircles").value;
  document.querySelector("#skipValue").innerText = document.querySelector("#skip").value;


  ySignal = [];
  for (let c=1; c <= noOfCircles; c+=skip){
    ySignal[c]=[];
  }
  time = 0; 
  FRAME_RATE=60;
  resizeCanvasSize();
  redraw();
}

function resizeCanvasSize(){
  width = windowWidth;

  diagWidth = width / 4;
  diagHeight = width/10 * (4 / (1 * PI));

  height = (diagHeight * noOfCircles * 2);
  resizeCanvas(max(width,2000),max(height,2000)+500);
}

function setup() {
  width = windowWidth;

  diagWidth = width / 4;
  diagHeight = width/10 * (4 / (1 * PI));

  height = (diagHeight * noOfCircles * 2);

  CANVAS = createCanvas(max(width,2000),max(height,2000)+500);
  CANVAS.parent('canvas-container');

  for (let c=1; c <= noOfCircles; c+=skip){
    ySignal[c]=[];
  }
}

function draw() {
  background(0);


  for (let c=1; c <= noOfCircles; c+=skip){
    let h = skip==1? (diagHeight*c*1.75) : (75 + (diagHeight*c*2/skip));
    textSize(28);
    fill('blue');
    text(c,10,h-diagHeight)
    drawEpiCycle(c, diagWidth, h, c*2+1);
  }
  
  time += 0.05;
}

function drawEpiCycle(idx, posX, posY, maxFreq){
  let centerX = 0;
  let centerY = 0;
  let x=0, y=0;
  for (let freq=1; freq < maxFreq; freq+=2){
    push()
      translate(posX, posY);

      stroke(255, 100);
      strokeWeight(1);
      noFill();
      let radius = (diagHeight/2) * (4 / (freq * PI));
      ellipse(centerX, centerY, radius*2);

      push();
        stroke('yellow');
        x += radius * cos(freq * time);
        y += radius * sin(freq * time);
        line(centerX, centerY, x, y);

        strokeWeight(5);
        point(x,y);
      pop();

      centerX = x;
      centerY = y;
    pop();
  }
  ySignal[idx].unshift(y)

    push();
      translate(posX, posY);
      stroke('green');
      strokeWeight(2);
      noFill();
      beginShape();
      for (let i=0; i < ySignal[idx].length; i++){
        vertex(i+200,ySignal[idx][i]);
      }
      line(x, y, 200, ySignal[idx][0]);
      endShape();
    pop();

  if(ySignal[idx].length> width/4){
    ySignal[idx].pop();
  }
}