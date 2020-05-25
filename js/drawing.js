let width = 2000;
let height = 2000;
let diagWidth = 100;
let diagHeight = 100;

let time = 0;
let CANVAS, scenes =[], sceneLength=1, sceneCounter=0;


let dftX=[];
let dftY=[];

let signalsX=[];
let signalsY=[];

let plot=[];

let dt=0;

function setup() {
  width = max(width,windowWidth);
  height = max(height,windowHeight);

  CANVAS= createCanvas(width,height);
  CANVAS.parent('canvas-container');

  // Create scenes to be repeated one after another
  scenes.push({signals: textPath("Dear Pia, my love ..."), skip:1, isScaleRequired: false});
  scenes.push({signals: textPath("Happy anniversary..."), skip:1, isScaleRequired: false});
  scenes.push({signals: textPath("Here you go ..."), skip:1, isScaleRequired: false});
  scenes.push({signals: leePia, skip:2, isScaleRequired: true, scale:[1200, 300]});

  sceneLength = scenes.length;
  sceneCounter = 0;
   
  // extract signals from scenes and create Fourier transforms
  populateSignals(scenes[sceneCounter]);

}

/**
 * Function to draw frames on canvas
 */
function draw() {
  // background to black
  background(0);

  // position for top-middle and bottom-left epicycles center
  let bottom = createVector(diagWidth, diagHeight*3);
  let top = createVector(diagWidth*3, diagHeight);
  
  // draw epicycles
  let plotVectorX = drawEpiCycle(top.x, top.y, dftX , 0);
  let plotVectorY = drawEpiCycle(bottom.x, bottom.y, dftY , HALF_PI);

  //extract x from top one and y from bottom one
  plot.unshift(createVector(plotVectorX.x, plotVectorY.y));

  push()
    // shift the origin to where the diagram need to be made.
    translate(top.x, bottom.y)

    //draw the diagram based on x from top epicycle and y from bottom epicycle
    beginShape();
      noFill();
      strokeWeight(0.75);
      colorMode(HSB, 100);
      stroke('yellow');
      for (let i=0; i < plot.length; i++){
        vertex(plot[i].x,plot[i].y);
      }
    endShape();

    //connecting lines from epicycle to diagram for visualization
    push()
      stroke("magenta");
      strokeWeight(0.5);
      line(plotVectorY.x-(top.x - bottom.x), plotVectorY.y, plot[0].x , plot[0].y);
      line(plotVectorX.x, plotVectorX.y-(bottom.y - top.y), plot[0].x , plot[0].y);
    pop()
  pop()

  //incrementing time by delta
  time += dt;

  // if the time has completed 2Pi, then switch to next scene
  if(time >= TWO_PI){
    //clear diagram and reset time.
    plot=[];
    time=0;

    //pick next scene
    sceneCounter+=1;
    sceneCounter = sceneCounter % sceneLength;

    // do fourier transform of next scene signals
    populateSignals(scenes[sceneCounter]);
  }
}

/**
 * Draws epicycles
 * 
 * @param {number} posX X-axis position to place initial center of epicycle
 * @param {number} posY Y-axis position to place initial center of epicycle
 * @param {array} transformedSignal Array of Fourier Transformation of each signals in array
 * @param {number} offset Rotation needed on epicycle.
 */
function drawEpiCycle(posX, posY, transformedSignal, offset){
  let centerX = 0;
  let centerY = 0;
  let x=0, y=0;

  // for each transformed signal
  for (let i=0; i < transformedSignal.length; i++){
    push()
      translate(posX, posY);
      
      centerX = x;
      centerY = y;

      stroke(255, 50);
      strokeWeight(1);
      noFill();

      // amplitude
      let amp = transformedSignal[i].amp;

      // phase
      let phase = transformedSignal[i].phase;

      // frequency
      let freq = transformedSignal[i].freq;
      
      //draw circle with radius as amplitude
      ellipse(centerX, centerY, 2 * amp);

      // angle calculation
      let phi =(freq * time) + (phase + offset);
      x += amp * cos(phi);
      y += amp * sin(phi);

      //connect from center of circle to point on the circle which forms the center of next circle
      push()
        stroke('yellow');
        line(centerX, centerY, x, y);
        strokeWeight(2);
        point(x,y);
      pop();

    pop();
  }

  //return the position of point on last epiCycle circle (at the top most tip of entire chain of circles)
  return createVector(x,y);
}

// Runs before setup and loads the font file.
function preload(){
  // font = loadFont("./font/neon.ttf");
  font = loadFont("../font/arial.ttf");
}

// Coverts text written to path of outline
function textPath(msg){
  textFont(font, 75);
  fill('yellow');
  let p = font.textToPoints(msg, 100,100);
  return p;
}

// Extract signals for a scene and do Fourier Transformation
function populateSignals(drawing){
  signalsX=[];
  signalsY=[];
  
  let {signals, skip, isScaleRequired, scale} = drawing;

  // Loop to extract signals
  for(let i=0; i<signals.length; i+=skip){
    let sig=signals[i];

    let x = sig.x
    let y = sig.y;

    if(isScaleRequired){
      x = map(x,0,scale[0], 0, scale[1]);
      y = map(y,0,scale[0], 0, scale[1]);
    }

    signalsY.push(y);
    signalsX.push(x);
  }

  let sortBy = (a,b) => b.amp - a.amp;

  // Fourier Transformation on x signals
  dftX = transform(signalsX);
  dftX.sort(sortBy);

  // Fourier Transformation on y signals
  dftY = transform(signalsY);
  dftY.sort(sortBy);

  // caculate time increment
  dt =(TWO_PI/signalsX.length);
}