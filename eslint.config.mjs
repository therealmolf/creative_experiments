import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        background: "readonly",
        createCanvas: "readonly",
        draw: "readonly",
        ellipse: "readonly",
        fill: "readonly",
        height: "readonly",
        image: "readonly",
        line: "readonly",
        loadImage: "readonly",
        loadSound: "readonly",
        mount: "readonly",
        noFill: "readonly",
        noStroke: "readonly",
        noTint: "readonly",
        p5: "readonly",
        pop: "readonly",
        push: "readonly",
        rect: "readonly",
        rotate: "readonly",
        setup: "readonly",
        soundFormats: "readonly",
        stroke: "readonly",
        text: "readonly",
        textAlign: "readonly",
        textSize: "readonly",
        tint: "readonly",
        translate: "readonly",
        width: "readonly",
      },
    },
  },
  {
    files: ["sketches/**/*.{js,mjs,cjs,ts,mts,cts}"],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off"
    }
  },
]);
