---
name: spawn-sketch
description: Scaffold a new p5.js sketch in this repo. Use this whenever the user wants to create a new sketch, experiment, or creative coding project. Trigger on phrases like "new sketch", "create a sketch", "add an experiment", "spawn a sketch", or any request to start a new p5.js piece.
---

# Spawn Sketch

First, create and switch to a new git branch named after the sketch:

```bash
git checkout -b sketch/<name>
```

Then create a new sketch under `sketches/<name>/` with these four files:

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Sketch</title>

    <link rel="stylesheet" type="text/css" href="style.css">

    <script src="../../libraries/p5.min.js"></script>
    <script src="../../libraries/p5.sound.min.js"></script>
  </head>

  <body>
    <script src="sketch.js"></script>
  </body>
</html>
```

## style.css

```css
html, body {
  margin: 0;
  padding: 0;
}

canvas {
  display: block;
}
```

## jsconfig.json

```json
{
  "compilerOptions": {
    "target": "es6"
  },
  "include": [
    "*.js",
    "**/*.js",
    "/Users/miko/.vscode/extensions/samplavigne.p5-vscode-1.2.16/p5types/global.d.ts"
  ]
}
```

## sketch.js

Start with a minimal working sketch. If the user described what the sketch should do, write a first draft of the logic. Otherwise use this blank template:

```js
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
}
```

## After creating the files

Tell the user the sketch is ready and remind them to open it via a local server:
- VS Code: right-click `index.html` → "Open with Live Server"
- Terminal: `npx live-server` from the project root, then navigate to `sketches/<name>/index.html`
