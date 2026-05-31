# Creative Experiments

This repository serves as a collection of creative coding experiments, primarily utilizing the p5.js library. It's a space for exploring interactive art, generative design, and various visual and auditory programming concepts.

## Structure

- `sketches/`: Contains individual p5.js projects, each in its own subdirectory.
- `assets/`: Stores resources such as images, data, and sounds used across different sketches.
- `libraries/`: Includes necessary JavaScript libraries like p5.js and p5.sound.js.

## Running Sketches Locally

Each sketch is a self-contained HTML file. Because some sketches load images from the `assets/` folder, they need to be served over HTTP rather than opened directly in a browser.

The easiest options:

- **VS Code**: Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, then right-click any `index.html` and select "Open with Live Server".
- **Terminal**: Run `npx live-server` from the project root, then navigate to `sketches/<sketch-name>/index.html` in your browser.

Feel free to explore the different sketches and experiment with the code!