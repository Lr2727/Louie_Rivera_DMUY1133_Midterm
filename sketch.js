// Main variables
let time = 0;
let loopDuration = 60; // Duration of the entire loop in seconds
let elements = []; // Array to store visual elements
let numElements = 800; // Reduced from 1000 to 800 for performance optimization
let camRadius = 800; // Distance of the camera from the center

function setup() {
  // Setup canvas and color mode
  createCanvas(windowWidth, windowHeight, WEBGL);
  noCursor();
  colorMode(HSB, 360, 100, 100);

  // Initialize visual elements
  // Each element will be an instance of VisualElement
  for (let i = 0; i < numElements; i++) {
    elements.push(new VisualElement(i));
  }
}

function draw() {
  // Clear background and update time
  background(0);
  time += deltaTime * 0.001; // Time in seconds
  // deltaTime ensures consistent animation speed across different devices

  // Calculate normalized loop time
  let t = (time % loopDuration) / loopDuration;
  let smoothT = t * t * (3 - 2 * t); // Smoothstep function for smoother transitions

  // Calculate camera position for an orbital movement
  let camX = camRadius * cos(time * 0.04);
  let camY = camRadius * sin(time * 0.03) + sin(time * 0.1) * 200;
  let camZ = camRadius * sin(time * 0.04);
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Begin drawing transformations
  push();

  // Morphing parameter that cycles from 0 to 1
  let morph = smoothT;

  // Update and display all elements
  for (let element of elements) {
    element.update(morph);
    element.display(morph);
  }

  // End drawing transformations
  pop();
}

//////////////////////////////
// VisualElement Class

class VisualElement {
  constructor(index) {
    this.index = index;
    this.position = createVector();
    this.size = random(3, 10); // Random size for variety
    this.baseColor = color(random(360), 80, 100); // Random base color

    // Store pattern functions in an array for easy access
    this.patterns = [
      this.patternSphere.bind(this),
      this.patternTorus.bind(this),
      this.patternSpiral.bind(this),
      this.patternWave.bind(this),
    ];
  }

  update(morph) {
    // Calculate a unique parameter for each element
    let u = this.index / numElements;

    // Total number of patterns
    let totalPatterns = this.patterns.length;

    // Calculate phase and indices for current and next patterns
    let phase = morph * totalPatterns;
    let index = floor(phase) % totalPatterns;
    let nextIndex = (index + 1) % totalPatterns;
    let blend = phase - floor(phase);

    // Blending factors for current and next patterns
    let blendCurrent = 1 - blend;
    let blendNext = blend;

    // Get positions from patterns
    let posCurrent = this.patterns[index](u);
    let posNext = this.patterns[nextIndex](u);

    // Interpolate positions to smoothly transition between patterns
    let x = posCurrent.x * blendCurrent + posNext.x * blendNext;
    let y = posCurrent.y * blendCurrent + posNext.y * blendNext;
    let z = posCurrent.z * blendCurrent + posNext.z * blendNext;

    this.position = createVector(x, y, z);

    // Update color based on morph
    let hue1 = hue(this.baseColor);
    let hue2 = (hue1 + 180) % 360; // Complementary color
    let currentHue = lerp(hue1, hue2, (morph * totalPatterns) % 1);
    this.color = color(currentHue, 80, 100);
  }

  display(morph) {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    fill(this.color);
    noStroke();

    // Morph between sizes
    let size1 = this.size;
    let size2 = this.size * 2;
    let currentSize = lerp(
      size1,
      size2,
      sin(time + this.index) * 0.5 + 0.5
    );

    // Rotate elements for visual interest
    rotateX(time * 0.4 + this.index);
    rotateY(time * 0.25 + this.index);

    // Alternate between drawing a sphere and a box
    if ((floor(morph * 2) % 2) === 0) {
      sphere(currentSize);
    } else {
      box(currentSize);
    }

    pop();
  }

  // Pattern functions

  patternSphere(u) {
    // Position on a sphere using spherical coordinates
    let phi = acos(1 - 2 * u);
    let theta = sqrt(numElements * PI) * phi;

    let r = 200; // Radius of the sphere
    let x = r * sin(phi) * cos(theta);
    let y = r * sin(phi) * sin(theta);
    let z = r * cos(phi);

    return createVector(x, y, z);
  }

  patternTorus(u) {
    // Position on a torus
    let theta = u * TWO_PI * 10 + time * 0.2;
    let phi = u * TWO_PI * 5;

    let r1 = 150; // Major radius
    let r2 = 50;  // Minor radius
    let x = (r1 + r2 * cos(phi)) * cos(theta);
    let y = (r1 + r2 * cos(phi)) * sin(theta);
    let z = r2 * sin(phi);

    return createVector(x, y, z);
  }

  patternSpiral(u) {
    // Position in a spiral
    let angle = u * TWO_PI * 10 + time * 0.5;
    let radius = u * 400;

    let x = radius * cos(angle);
    let y = radius * sin(angle);
    let z = u * 400 - 200;

    return createVector(x, y, z);
  }

  patternWave(u) {
    // Position in a wave pattern
    let x = (u - 0.5) * 800;
    let y = 100 * sin((u * 10 + time) * 2 * PI);
    let z = 100 * cos((u * 10 + time) * 2 * PI);

    return createVector(x, y, z);
  }
}

//////////////////////////////
// Handle Window Resize

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
