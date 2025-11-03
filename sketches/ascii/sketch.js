let img;
let size;
let asciiChar = "@B%8&WM#*/|-,^`.";

function preload() {
  img = loadImage("../../assets/images/Zhongshan.png");
}

function setup() {
  // Resize image
  img.resize(img.width / 20, img.height / 20);
  // Check if the image has been resized
  print(img.width, img.height);
  createCanvas(600, 600);

  size = width / img.width;

  noLoop();
}

function draw() {
  background(220);
  // make font size smaller
  // image(img, 0, 0);
  textSize(6);

  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      let pixelVal = img.get(i, j);
      let greenVal = green(pixelVal);
      print(greenVal);
      let asciiIndex = floor(map(greenVal, 0, 255, 0, asciiChar.length));

      let x = i * size;
      let y = j * size;

      // Fille color based on lerp between light green and dark green
      let c1 = color(17, 59, 6); // Pakistan Green
      let c2 = color(221, 190, 168); // Desert Sand
      let interColor = lerpColor(c1, c2, map(greenVal, 0, 255, 0, 1));
      fill(interColor);

      let asciiVal = asciiChar.charAt(asciiIndex);
      text(asciiVal, x, y);
    }
  }
}
