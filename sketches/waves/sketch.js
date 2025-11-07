let images = [];
const imagePaths = [
  "../../assets/images/Maps.png",
  "../../assets/images/Zhongshan.png",
  "../../assets/images/editmake_the_growth_start_from_t.png",
  "../../assets/images/flowy_and_liquidlooking_amber_gl.png",
];

function preload() {
  for (let path of imagePaths) {
    images.push(loadImage(path));
  }
}

function setup() {
  createCanvas(800, 800);
}

function draw() {
  background(0);

  // settings for the points
  strokeWeight(1.5);

  // Set the noise level and scale.
  let noiseLevel = 550;
  let noiseScale = 0.11; // 0.0035, 0.2

  // draw moving, point-based horizontal lines on the canvas
  for (let x = 0; x <= width; x += 2) {
    // Scale the input coordinates.
    let nx = noiseScale * x;
    let nt = noiseScale * frameCount;

    // Compute the noise value.
    let y = noiseLevel * noise(nx, nt);

    stroke(93, 58, 0); // Sepia Brown
    for (let i = 0; i < 300; i += 5) {
      point(x, y + i);
    }

    // Compute the noise value for the second line.
    let y2 = noiseLevel * noise(nx + 10, nt + 10);

    // Draw the second line
    stroke(249, 137, 72); // atomic tangerine
    for (let i = 0; i < 100; i += 5) {
      point(x, y2 + i);
    }

    // Compute the noise value for the third line.
    let y3 = noiseLevel * noise(nx - 10, nt - 10);

    // Draw the third line
    stroke(249, 234, 154); // Flax
    for (let i = 0; i < 120; i += 5) {
      point(x, y3 + i);
    }

    // Compute the noise value for the third line.
    let y4 = noiseLevel * noise(nx - 10, nt - 10);

    // Draw the third line
    stroke(33, 39, 56); // Raisin black
    for (let i = 0; i < 250; i += 5) {
      point(x, y4 + i);
    }
  }

  // randomly cut and draw pieces from preloaded images
  for (let i = 0; i < 10; i++) {
    // draw 5 random pieces per frame
    let img = random(images);
    let sx = random(0, img.width - 50);
    let sy = random(0, img.height - 50);
    let sWidth = random(20, 100);
    let sHeight = random(20, 100);

    let imgCut = img.get(sx, sy, sWidth, sHeight);

    // Randomly apply a filter
    let r = random(1);
    if (r < 0.2) {
      imgCut.filter(GRAY);
    } else if (r < 0.4) {
      applySepia(imgCut);
    } else if (r < 0.6) {
      imgCut.filter(POSTERIZE, int(random(2, 3)));
    }

    let dx = random(0, width);
    let dy = random(0, height);
    let dWidth = sWidth * random(0.5, 2);
    let dHeight = sHeight * random(0.5, 2);

    tint(255, random(75, 255)); // Apply random opacity (20-60%)
    image(imgCut, dx, dy, dWidth, dHeight);
    noTint(); // Reset tint for subsequent drawings

    // Randomly add a red border
    if (random(1) < 0.3) {
      push(); // save current style settings
      // stroke(255, 0, 0);
      stroke(127, 42, 43); // Garnet
      strokeWeight(6); // thick border
      noFill();
      rect(dx, dy, dWidth, dHeight);
      pop(); // restore style settings
    }
  }
}

function applySepia(img) {
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];
    let tr = 0.393 * r + 0.769 * g + 0.189 * b;
    let tg = 0.349 * r + 0.686 * g + 0.168 * b;
    let tb = 0.272 * r + 0.534 * g + 0.131 * b;
    img.pixels[i] = tr;
    img.pixels[i + 1] = tg;
    img.pixels[i + 2] = tb;
  }
  img.updatePixels();
}

function glow(glowColor, blurriness) {
  // This seems to be extremely inefficient, but it works.

  // // drawingContext is the equivalent of calling canvas.getContext('2d'); or canvas.getContext('webgl')
  // // Then you have exposed all the HTML canvas methods and properties, like shadowBlur and shadowColor
  drawingContext.shadowColor = glowColor;
  drawingContext.shadowBlur = blurriness;
}
