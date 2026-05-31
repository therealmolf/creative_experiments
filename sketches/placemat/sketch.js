// Sherman Granite — parametric controls
// Worley grains + iterative domain warp.
// Domain warp technique: https://st4yho.me/domain-warping-an-interactive-introduction/

let params = {
  numWarps: 3,
  warpBase: 75,
  warpFalloff: 0.55,
  warpScale: 0.0035,
  compositionScale: 0.0024,
  veinScale: 0.005,
  contrast: 1.6,
  grainCols: 220,
  grainRows: 150,
  seed: 21,
};

let ui = {};
let status;
let grainPts;
let grainColors;

function setup() {
  createCanvas(1296, 864);
  pixelDensity(1);
  noLoop();

  buildUI();
  regenerate();
}

function buildUI() {
  let panel = createDiv("")
    .style("padding", "10px 14px")
    .style("font-family", "monospace")
    .style("font-size", "12px")
    .style("background", "#1a1a1a")
    .style("color", "#ddd")
    .style("max-width", "560px");

  ui.numWarps         = addSlider(panel, "Warp iterations",   1,      6,     params.numWarps,         1);
  ui.warpBase         = addSlider(panel, "Warp displacement", 0,      250,   params.warpBase,         1);
  ui.warpFalloff      = addSlider(panel, "Warp falloff",      0,      1,     params.warpFalloff,      0.01);
  ui.warpScale        = addSlider(panel, "Warp scale",        0.0005, 0.02,  params.warpScale,        0.0005);
  ui.compositionScale = addSlider(panel, "Composition scale", 0.0005, 0.01,  params.compositionScale, 0.0001);
  ui.veinScale        = addSlider(panel, "Vein scale",        0.001,  0.02,  params.veinScale,        0.0005);
  ui.contrast         = addSlider(panel, "Region contrast",   1,      3,     params.contrast,         0.05);
  ui.grainCols        = addSlider(panel, "Grain cols",        40,     400,   params.grainCols,        10);
  ui.grainRows        = addSlider(panel, "Grain rows",        30,     300,   params.grainRows,        10);
  ui.seed             = addSlider(panel, "Seed",              0,      200,   params.seed,             1);

  let btn = createButton("Regenerate")
    .parent(panel)
    .style("margin-top", "10px")
    .style("padding", "6px 16px")
    .style("background", "#444")
    .style("color", "#fff")
    .style("border", "1px solid #666")
    .style("cursor", "pointer");

  btn.mousePressed(() => {
    syncParams();
    showStatus("Rendering…");
    // Defer render so the status message paints first
    setTimeout(() => {
      regenerate();
      showStatus("");
    }, 30);
  });

  status = createDiv("")
    .parent(panel)
    .style("margin-top", "8px")
    .style("color", "#9c9");
}

function addSlider(parent, label, min, max, val, step) {
  let row = createDiv("")
    .parent(parent)
    .style("display", "flex")
    .style("align-items", "center")
    .style("gap", "10px")
    .style("margin", "3px 0");
  createDiv(label).parent(row).style("width", "160px");
  let slider = createSlider(min, max, val, step).parent(row).style("width", "240px");
  let display = createDiv(val).parent(row).style("width", "80px").style("color", "#9cf");
  slider.input(() => display.html(slider.value()));
  return slider;
}

function syncParams() {
  params.numWarps         = ui.numWarps.value();
  params.warpBase         = ui.warpBase.value();
  params.warpFalloff      = ui.warpFalloff.value();
  params.warpScale        = ui.warpScale.value();
  params.compositionScale = ui.compositionScale.value();
  params.veinScale        = ui.veinScale.value();
  params.contrast         = ui.contrast.value();
  params.grainCols        = ui.grainCols.value();
  params.grainRows        = ui.grainRows.value();
  params.seed             = ui.seed.value();
}

function showStatus(msg) {
  if (status) status.html(msg);
}

function regenerate() {
  randomSeed(params.seed);
  noiseSeed(params.seed);
  [grainPts, grainColors] = buildGrains();
  render();
}

// Iterative domain warp with falloff
function warp(x, y) {
  let scale = 1;
  for (let i = 0; i < params.numWarps; i++) {
    let nx = noise(x * params.warpScale + i * 17.1, y * params.warpScale + i * 17.1);
    let ny = noise(x * params.warpScale + i * 31.7 + 5.3, y * params.warpScale + i * 31.7 + 5.3);
    x += scale * (nx * 2 - 1) * params.warpBase;
    y += scale * (ny * 2 - 1) * params.warpBase;
    scale *= params.warpFalloff;
  }
  return [x, y];
}

function fbm(x, y, scale, octaves, persistence) {
  let val = 0, amp = 1, freq = scale, total = 0;
  for (let i = 0; i < octaves; i++) {
    val += noise(x * freq, y * freq) * amp;
    total += amp;
    amp *= persistence;
    freq *= 2;
  }
  let n = val / total;
  return constrain((n - 0.5) * params.contrast + 0.5, 0, 1);
}

function ridge(x, y, scale, offset) {
  let n = noise(x * scale + offset, y * scale + offset);
  return 1 - abs(n * 2 - 1);
}

function buildGrains() {
  let pts = [], colors = [];
  let cw = width / params.grainCols;
  let ch = height / params.grainRows;

  for (let row = 0; row < params.grainRows; row++) {
    for (let col = 0; col < params.grainCols; col++) {
      let px = (col + random(0.15, 0.85)) * cw;
      let py = (row + random(0.15, 0.85)) * ch;
      pts.push([px, py]);

      let [wx, wy] = warp(px, py);
      colors.push(pickGrainColor(wx, wy));
    }
  }
  return [pts, colors];
}

function pickGrainColor(x, y) {
  let vein = ridge(x, y, params.veinScale, 500);
  let darkZone = 1 - fbm(x, y, params.compositionScale, 5, 0.65);
  // Threshold both fields so biotite stays in vein networks + truly dark zones,
  // instead of scattering as random black flecks across feldspar regions.
  let biotiteProb = max(0, (vein - 0.55) * 1.4) + max(0, (darkZone - 0.5) * 0.7);
  if (random() < biotiteProb) return biotite();

  let quartzField = noise(x * 0.008 + 700, y * 0.008 + 700);
  let quartzProb = max(0.04, (quartzField - 0.6) * 0.4);
  if (random() < quartzProb) return quartz();

  let hueField = noise(x * 0.003 + 250, y * 0.003 + 250);
  let pinkChance = hueField * 0.6 + 0.2;
  if (random() < pinkChance) return pinkFeldspar();
  return yellowFeldspar();
}

// Brown/tan feldspar — wide range from deep umber to pale buff
function yellowFeldspar() {
  let r = random(120, 225);
  return [r, r * random(0.62, 0.82), r * random(0.36, 0.58)];
}

function pinkFeldspar() {
  let r = random(200, 228);
  return [r, r * random(0.6, 0.7), r * random(0.55, 0.65)];
}

function biotite() {
  let v = random(32, 72);
  return [v, v * random(0.86, 0.95), v * random(0.78, 0.9)];
}

function quartz() {
  let v = random(150, 188);
  return [v, v * random(0.96, 1.0), v * random(0.92, 0.98)];
}

function worleyIdx(x, y) {
  let cw = width / params.grainCols;
  let ch = height / params.grainRows;
  let gc = floor(x / cw);
  let gr = floor(y / ch);
  let minD = 1e9, minIdx = 0;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      let nc = gc + dc, nr = gr + dr;
      if (nc < 0 || nc >= params.grainCols || nr < 0 || nr >= params.grainRows) continue;
      let idx = nr * params.grainCols + nc;
      let pt = grainPts[idx];
      let dx = x - pt[0], dy = y - pt[1];
      let d = sqrt(dx * dx + dy * dy);
      if (d < minD) { minD = d; minIdx = idx; }
    }
  }
  return minIdx;
}

function render() {
  loadPixels();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let i = y * width + x;

      let [wx, wy] = warp(x, y);
      wx = constrain(wx, 0.5, width - 0.5);
      wy = constrain(wy, 0.5, height - 0.5);

      let idx = worleyIdx(wx, wy);
      let [cr, cg, cb] = grainColors[idx];

      let pi = i * 4;
      pixels[pi]     = cr;
      pixels[pi + 1] = cg;
      pixels[pi + 2] = cb;
      pixels[pi + 3] = 255;
    }
  }

  updatePixels();
}

function draw() {}
