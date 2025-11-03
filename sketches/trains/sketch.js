let img;
let pxCol;

function preload() {
  // Load any assets here if needed
  img = loadImage("../../assets/images/Maps.png");
}

function setup() {
  createCanvas(800, 800);
  noLoop();
}

function draw() {
  // background(212, 192, 160);
  background(255);

  image(img);
  img.resize(800, 800);

  noStroke();

  //Pixelation Loop
  for (var recY = 0; recY < height; recY += 40) {
    for (var recX = 0; recX < width; recX += 10) {
      pxCol = img.get(recX, recY);
      fill(pxCol);
      rect(recX, recY, 15, 10);
    }
  }

  // Add brown coffee grain layer
  // for (let i = 0; i < 10000; i++) {
  //   let x = random(width);
  //   let y = random(height);
  //   stroke(101, 67, 33, 100); // Brown color with some transparency
  //   point(x, y);
  // }
}
