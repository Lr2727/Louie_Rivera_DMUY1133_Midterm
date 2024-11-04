let time = 0;
let sceneDuration = 800;
let totalScenes = 7;
let scene = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noCursor();
}

function draw() {
  background(0);
  time++;

  // scene transitions
  let totalTime = sceneDuration * totalScenes;
  let progress = (time % totalTime) / totalTime;
  let sceneProgress = (time % sceneDuration) / sceneDuration;
  scene = floor((time % totalTime) / sceneDuration);

  // Global camera movement
  let camZ = lerp(-500, 500, progress);

  //global transformations for camera movement
  push();
  translate(0, 0, camZ);

  // Call the current and next scenes for overlap
  if (scene === 0) {
    sceneOne(sceneProgress);
  } else if (scene === 1) {
    sceneTwo(sceneProgress);
  } else if (scene === 2) {
    sceneThree(sceneProgress);
  } else if (scene === 3) {
    sceneFour(sceneProgress);
  } else if (scene === 4) {
    sceneFive(sceneProgress);
  } else if (scene === 5) {
    sceneSix(sceneProgress);
  } else if (scene === 6) {
    sceneSeven(sceneProgress);
  }
  pop();
}

//////////////////////////////
// Scene 1: Hypnotic Waveform Tunnel

function sceneOne(progress) {
  push();
  let tunnelDepth = 2000;
  let num = 50;
  for (let i = 0; i < num; i++) {
    let size = map(i, 0, num, 200, 20);
    let z = map(i, 0, num, -tunnelDepth, 200);
    push();
    translate(0, 0, z + progress * tunnelDepth); // Move forward through the tunnel
    rotateZ(time * 0.01 + i);
    noFill();
    stroke(lerpColor(color('#ff0080'), color('#00ffff'), i / num));
    strokeWeight(2);
    torus(size, size * 0.2, 24, 16);
    pop();
  }

  // Transition to bright light at the end of the tunnel
  if (progress > 0.8) {
    let lightProgress = map(progress, 0.8, 1, 0, 1);
    push();
    translate(0, 0, 200 + lightProgress * 500);
    noStroke();
    fill(255, 255 * lightProgress);
    sphere(100 * lightProgress);
    pop();
  }
  pop();
}

//////////////////////////////
// Scene 2: Light Transforms into Flower Bloom

function sceneTwo(progress) {
  push();
  // Use the light from Scene 1 as the center of the bloom
  translate(0, 0, -200); // Align with the end position of the tunnel
  rotateY(time * 0.01);
  rotateX(time * 0.008);
  let num = 200;
  for (let i = 0; i < num; i++) {
    push();
    let phi = acos(-1 + (2 * i) / num);
    let theta = sqrt(num * PI) * phi;
    let r = width * 0.4 * progress;
    let x = r * cos(theta) * sin(phi);
    let y = r * sin(theta) * sin(phi);
    let z = r * cos(phi);
    translate(x, y, z);
    noStroke();
    fill(lerpColor(color('#00ff00'), color('#ff00ff'), sin(time * 0.01 + i) * 0.5 + 0.5));
    sphere(5);
    pop();
  }
  pop();
}

//////////////////////////////
// Scene 3: Flower into Spiral Galaxy

function sceneThree(progress) {
  push();
  // Start from the last position of Scene 2
  rotateZ(time * 0.01);
  let num = 1000;
  for (let i = 0; i < num; i++) {
    let angle = i * 0.1 + time * 0.02;
    let radius = i * 0.5 * progress + 200; // Start from the size of the bloom
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = sin(angle * 0.5 + time * 0.02) * 100;
    push();
    translate(x, y, z);
    rotateY(angle);
    noStroke();
    fill(lerpColor(color('#ffff00'), color('#00ffff'), i / num));
    box(5, 5, 20);
    pop();
  }
  pop();
}

//////////////////////////////
// Scene 4: Spiral Galaxy into Lissajous Figures

function sceneFour(progress) {
  push();
  rotateY(time * 0.005);
  rotateX(time * 0.003);
  let num = 500;
  let a = 5;
  let b = 4;
  let c = 3;
  let scale = 200 + progress * 200; // Expand scale over time
  for (let i = 0; i < num; i++) {
    let t = map(i, 0, num, 0, TWO_PI);
    let x = sin(a * t + time * 0.01) * scale;
    let y = sin(b * t + time * 0.012) * scale;
    let z = sin(c * t + time * 0.014) * scale;
    push();
    translate(x, y, z);
    noStroke();
    fill(lerpColor(color('#ff0000'), color('#0000ff'), i / num));
    sphere(3);
    pop();
  }
  pop();
}

//////////////////////////////
// Scene 5: Infinite Looping Mobius Landscape

function sceneFive(progress) {
  push();
  
  // Set up global rotation to create a sense of floating
  rotateY(time * 0.002);
  rotateX(time * 0.001);

  let loops = 10; // Number of loops to create
  let segments = 100; // Number of segments in each loop

  for (let i = 0; i < loops; i++) {
    let loopProgress = map(i, 0, loops, 0, 1);
    let loopRadius = lerp(100, 300, loopProgress); // Radius of each loop
    let heightVariation = sin(time * 0.01 + i) * 50; // Height variation for organic motion

    for (let j = 0; j < segments; j++) {
      let angle = map(j, 0, segments, 0, TWO_PI);
      let x = cos(angle) * loopRadius;
      let y = sin(angle) * loopRadius + heightVariation;
      let z = sin(angle * 2 + time * 0.005) * 100; // Vary z-axis for a Mobius-like effect

      // Translate and draw the segment
      push();
      translate(x, y, z);
      rotateY(angle * 0.5 + time * 0.002);
      rotateX(angle * 0.3 + time * 0.003);

      //morphing pattern
      let colorShift = sin(time * 0.01 + j) * 0.5 + 0.5;
      noStroke();
      fill(lerpColor(color('#ffffff'), color('#ff00ff'), colorShift));
      
      // Draw morphing shapes
      box(10, 10, 30);
      pop();
    }
  }

  // Transition, gradually fade out the loops
  if (progress > 0.8) {
    let fadeProgress = map(progress, 0.8, 1, 0, 1);
    push();
    translate(0, 0, -500 * fadeProgress);
    fill(255, 255 * (1 - fadeProgress));
    sphere(200 * fadeProgress);
    pop();
  }

  pop();
}

//////////////////////////////
// Scene 6: Disintegration into Digital Particles

function sceneSix(progress) {
  push();
  
  // Start with parts of Scene 5
  rotateY(time * 0.003);
  rotateX(time * 0.002);
  
  let numParticles = 1000;
  for (let i = 0; i < numParticles; i++) {
    let angle = map(i, 0, numParticles, 0, TWO_PI);
    let radius = width * 0.4 * (1 - progress); // Shrink the particles towards a central point
    let heightVariation = cos(angle * 5 + time * 0.01) * 100 * (1 - progress);

    let x = cos(angle + time * 0.001) * radius;
    let y = sin(angle + time * 0.001) * radius + heightVariation;
    let z = sin(angle * 2 + time * 0.005) * radius;

    push();
    translate(x, y, z);
    rotateZ(angle + time * 0.002);
    
    // Create particles
    let colorShift = sin(time * 0.01 + i) * 0.5 + 0.5;
    noStroke();
    fill(lerpColor(color('#ff00ff'), color('#00ff00'), colorShift));
    box(5);
    pop();
  }
  
  // as progress nears 1, create a central point of convergence
  if (progress > 0.9) {
    let convergenceProgress = map(progress, 0.9, 1, 0, 1);
    push();
    translate(0, 0, -500 * (1 - convergenceProgress));
    noStroke();
    fill(255, 255 * convergenceProgress);
    sphere(50 * convergenceProgress);
    pop();
  }

  pop();
}

//////////////////////////////
// Scene 7: Reform into Waveform Tunnel

function sceneSeven(progress) {
  push();

  // Start with the central point from Scene 6
  translate(0, 0, -200 + progress * 1000); // Move forward through the new tunnel

  let numTorus = 50;
  for (let i = 0; i < numTorus; i++) {
    let size = map(i, 0, numTorus, 20, 200); // Expand the size of each torus over time
    let z = map(i, 0, numTorus, -1000, 0);
    let rotationSpeed = map(progress, 0, 1, 0.01, 0.02);

    push();
    translate(0, 0, z + progress * 1000);
    rotateZ(time * rotationSpeed + i);

    // Create the tunnel with smooth color transitions back to Scene 1 colors
    noFill();
    stroke(lerpColor(color('#00ffff'), color('#ff0080'), i / numTorus));
    strokeWeight(2);
    torus(size, size * 0.2, 24, 16);
    pop();
  }

  // Transition element: bright light at the end indicates a loop-back
  if (progress > 0.8) {
    let lightProgress = map(progress, 0.8, 1, 0, 1);
    push();
    translate(0, 0, 200 + lightProgress * 500);
    noStroke();
    fill(255, 255 * lightProgress);
    sphere(100 * lightProgress);
    pop();
  }

  pop();
}
