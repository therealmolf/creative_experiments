let img;
const GRID_SIZE = 5;
const CELL_SIZE = 160;

function preload() {
  img = loadImage("../../assets/images/flowy_amber_glass_textures_mixed.png");
}

function setup() {
  createCanvas(GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
  noLoop();
}

function draw() {
  background(220);

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      push();
      translate(i * CELL_SIZE + CELL_SIZE / 2, j * CELL_SIZE + CELL_SIZE / 2);

      // Random rotation
      const angle = random([0, 90, 180, 270]);
      rotate(radians(angle));

      // Random reflection
      const reflectX = random([-1, 1]);
      const reflectY = random([-1, 1]);
      scale(reflectX, reflectY);

      // Random square snapshot from the image
      const snapshotSize = int(random(50, 150));
      const sx = int(random(0, img.width - snapshotSize));
      const sy = int(random(0, img.height - snapshotSize));

      image(
        img,
        -CELL_SIZE / 2,
        -CELL_SIZE / 2,
        CELL_SIZE,
        CELL_SIZE,
        sx,
        sy,
        snapshotSize,
        snapshotSize
      );

      pop();
    }
  }
}
