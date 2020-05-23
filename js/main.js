let width = 0;
let height = 0;

let time = 0;

ySignal = [];

function setup() {
  width = windowWidth;
  height = windowHeight;
  createCanvas(width,height);
}

function draw() {
  background(0);

  translate(width/4, height/2)
  stroke(255, 100);
  strokeWeight(1);
  noFill();
  let radius = width/10;
  ellipse(0, 0, radius*2);

  push()
    stroke('yellow');
    strokeWeight(2);
    let x = radius * cos(time);
    let y = radius * sin(time);
    ellipse(x,y,radius*0.1);
  
    line(0, 0, x, y);
    strokeWeight(0.5);
    line(x, y, 200, y);

  pop()

  ySignal.unshift(y)

  push()
    stroke('green');
    strokeWeight(2);
    beginShape();
    for (let i=0; i < ySignal.length; i++){
      point(i+200,ySignal[i]);
    }
    endShape();
  pop()

  if(ySignal.length> width/4){
    ySignal.pop();
  }
  time += 0.05;
}