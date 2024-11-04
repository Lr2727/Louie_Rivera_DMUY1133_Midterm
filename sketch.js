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
  
    // Interpolate positions
    let x = posCurrent.x * blendCurrent + posNext.x * blendNext;
    let y = posCurrent.y * blendCurrent + posNext.y * blendNext;
    let z = posCurrent.z * blendCurrent + posNext.z * blendNext;
  
    this.position = createVector(x, y, z);
  
    // Update color based on morph
    let hue1 = hue(this.baseColor);
    let hue2 = (hue1 + 180) % 360;
    let currentHue = lerp(hue1, hue2, (morph * totalPatterns) % 1);
    this.color = color(currentHue, 80, 100);
  }
  