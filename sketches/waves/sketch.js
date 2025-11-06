function setup() {
  createCanvas(800, 800);
}

function draw() {
  background(0);

  // let glowColor = color(76, 25, 27);
  // glow(glowColor, 15);

  // settings for the points
  strokeWeight(1.5);

  // Set the noise level and scale.
  let noiseLevel = 400;
  let noiseScale = 0.002;

  // draw points in one horizontal line in the middle of the canvas
  for (let x = 0; x <= width; x += 2) {
    // Scale the input coordinates.
    let nx = noiseScale * x;
    let nt = noiseScale * frameCount;

    // Compute the noise value.
    let y = noiseLevel * noise(nx, nt);
    let y2 = noiseLevel * noise(nx, nt);

    stroke(76, 25, 27);
    for (let i = 0; i < 100; i += 5) {
      point(x, y + i);
    }

    stroke(255);
    for (let i = 0; i < 100; i += 5) {
      point(x, y2 + i);
    }
  }
}

function glow(glowColor, blurriness) {
  // This seems to be extremely inefficient, but it works.

  // // drawingContext is the equivalent of calling canvas.getContext('2d'); or canvas.getContext('webgl')
  // // Then you have exposed all the HTML canvas methods and properties, like shadowBlur and shadowColor
  drawingContext.shadowColor = glowColor;
  drawingContext.shadowBlur = blurriness;
}
