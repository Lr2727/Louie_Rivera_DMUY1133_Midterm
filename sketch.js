// Main variables and settings
let time = 0; // Global time variable
let loopDuration = 60; // Duration of the entire loop in seconds
let elements = []; // Array to store visual elements
let numElements = 800; // Number of visual elements (reduced from 1000 for performance)
let camRadius = 800; // Radius of the camera's orbital path

function setup() {
  // Set up the canvas with full window size and WEBGL renderer for 3D
  createCanvas(windowWidth, windowHeight, WEBGL);
  noCursor(); // Hide the cursor for a cleaner look
  colorMode(HSB, 360, 100, 100); // Use HSB color mode for smooth color transitions

  // Initialize visual elements
  for (let i = 0; i < numElements; i++) {
    elements.push(new VisualElement(i)); // Create a new VisualElement and add it to the array
  }
}

function draw() {
  // Clear the background and update the global time
  background(0); // Black background
  time += deltaTime * 0.001; // Increment time based on frame rate for consistent animation speed

  // Calculate normalized loop time (from 0 to 1)
  let t = (time % loopDuration) / loopDuration; // Loop time normalized to [0,1]
  let smoothT = t * t * (3 - 2 * t); // Smoothstep function for smoother transitions

  // Calculate camera position for an orbital movement around the origin
  let camX = camRadius * cos(time * 0.04); // X position of the camera
  let camY = camRadius * sin(time * 0.03) + sin(time * 0.1) * 200; // Y position with slight vertical movement
  let camZ = camRadius * sin(time * 0.04); // Z position of the camera
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0); // Set the camera position and orientation

  // Begin drawing the scene
  push(); // Start a new drawing context

  // Morphing parameter that cycles from 0 to 1
  let morph = smoothT; // Used to control the morphing between patterns

  // Update and display all visual elements
  for (let element of elements) {
    element.update(morph); // Update the element's position and color based on morph
    element.display(morph); // Display the element
  }

  pop(); // Restore the previous drawing context
}

//////////////////////////////
// VisualElement Class

class VisualElement {
  constructor(index) {
    this.index = index; // Unique index for each element
    this.position = createVector(); // Position vector
    this.size = random(3, 10); // Random size between 3 and 10
    this.baseColor = color(random(360), 80, 100); // Random base color with full saturation and brightness

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
    let u = this.index / numElements; // Normalized index between 0 and 1

    // Total number of patterns available
    let totalPatterns = this.patterns.length;

    // Calculate phase and indices for current and next patterns
    let phase = morph * totalPatterns; // Phase progresses from 0 to totalPatterns
    let index = floor(phase) % totalPatterns; // Current pattern index
    let nextIndex = (index + 1) % totalPatterns; // Next pattern index (wraps around)
    let blend = phase - floor(phase); // Blend factor between current and next pattern

    // Blending factors for current and next patterns
    let blendCurrent = 1 - blend; // Decreases from 1 to 0
    let blendNext = blend; // Increases from 0 to 1

    // Get positions from current and next patterns
    let posCurrent = this.patterns[index](u); // Position from current pattern
    let posNext = this.patterns[nextIndex](u); // Position from next pattern

    // Interpolate positions to smoothly transition between patterns
    let x = posCurrent.x * blendCurrent + posNext.x * blendNext;
    let y = posCurrent.y * blendCurrent + posNext.y * blendNext;
    let z = posCurrent.z * blendCurrent + posNext.z * blendNext;

    this.position = createVector(x, y, z); // Update position

    // Update color based on morphing progress
    let hue1 = hue(this.baseColor); // Base hue
    let hue2 = (hue1 + 180) % 360; // Complementary hue
    let currentHue = lerp(hue1, hue2, (morph * totalPatterns) % 1); // Interpolate between hues
    this.color = color(currentHue, 80, 100); // Update color
  }

  display(morph) {
    push(); // Start a new drawing context
    translate(this.position.x, this.position.y, this.position.z); // Move to the element's position
    fill(this.color); // Set fill color
    noStroke(); // Disable stroke

    // Morph between sizes for dynamic appearance
    let size1 = this.size; // Original size
    let size2 = this.size * 2; // Larger size
    let currentSize = lerp(
      size1,
      size2,
      sin(time + this.index) * 0.5 + 0.5 // Oscillate size over time
    );

    // Rotate elements for visual interest
    rotateX(time * 0.4 + this.index); // Rotate around X-axis
    rotateY(time * 0.25 + this.index); // Rotate around Y-axis

    // Alternate between drawing a sphere and a box
    if ((floor(morph * 2) % 2) === 0) {
      sphere(currentSize); // Draw sphere
    } else {
      box(currentSize); // Draw box
    }

    pop(); // Restore the previous drawing context
  }

  // Pattern functions defining different shapes

  patternSphere(u) {
    // Position on a sphere using spherical coordinates
    let phi = acos(1 - 2 * u); // Polar angle
    let theta = sqrt(numElements * PI) * phi; // Azimuthal angle for uniform distribution

    let r = 200; // Radius of the sphere
    let x = r * sin(phi) * cos(theta); // Cartesian coordinates
    let y = r * sin(phi) * sin(theta);
    let z = r * cos(phi);

    return createVector(x, y, z); // Return position vector
  }

  patternTorus(u) {
    // Position on a torus (doughnut shape)
    let theta = u * TWO_PI * 10 + time * 0.2; // Angle around the torus
    let phi = u * TWO_PI * 5; // Angle of the cross-section

    let r1 = 150; // Major radius (distance from center of the tube to center of the torus)
    let r2 = 50; // Minor radius (radius of the tube)
    let x = (r1 + r2 * cos(phi)) * cos(theta); // Cartesian coordinates
    let y = (r1 + r2 * cos(phi)) * sin(theta);
    let z = r2 * sin(phi);

    return createVector(x, y, z); // Return position vector
  }

  patternSpiral(u) {
    // Position in a spiral shape
    let angle = u * TWO_PI * 10 + time * 0.5; // Angle progressing along the spiral
    let radius = u * 400; // Radius increases with u

    let x = radius * cos(angle); // Cartesian coordinates
    let y = radius * sin(angle);
    let z = u * 400 - 200; // Z-position changes with u to create a 3D spiral

    return createVector(x, y, z); // Return position vector
  }

  patternWave(u) {
    // Position in a wave pattern
    let x = (u - 0.5) * 800; // X-position spans from -400 to 400
    let y = 100 * sin((u * 10 + time) * TWO_PI); // Wave motion in Y-axis
    let z = 100 * cos((u * 10 + time) * TWO_PI); // Wave motion in Z-axis

    return createVector(x, y, z); // Return position vector
  }
}

//////////////////////////////
// Handle Window Resize

function windowResized() {
  // Adjust the canvas size when the window is resized
  resizeCanvas(windowWidth, windowHeight);
}
