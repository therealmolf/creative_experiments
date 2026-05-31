# Sherman Granite — Process Notes

Reference: `~/Desktop/sherman_granite.jpg`

## Iterations

### v1 — Uniform Worley + ochre palette
Worley cells with gradient lighting in warm yellows. Looked like rounded mounds, not rock.

### v2–v3 — Flat colors, larger/smaller cells, light grey palette
Removed the lighting gradient. Texture improved but the grey was too uniform and read as concrete, not granite.

### v4 — Three-mineral palette (feldspar/biotite/quartz)
Introduced the right idea — granite is a mixture of minerals — but with purely random per-cell assignment. Came out as confetti.

### v5 — Noise-driven clustering
Used Perlin noise to bias mineral selection per cell. Clustering was too strong; the canvas split into big monochromatic blobs.

### v6 — Two-scale Worley + softened clustering
Added variable cell size via two Worley layers blended by noise. Better, but still fundamentally wrong: Worley produces geometric cells with hard boundaries, but granite has soft, fuzzy regional structure.

## What I learned by actually studying the image

After really looking at the reference, here's what makes Sherman Granite **Sherman Granite**:

**Color (I had it wrong):**
- Feldspar comes in **two co-occurring flavors**: brownish-yellow tan AND dusty pink. They appear intermixed within the same regions, not segregated. Per-grain random choice rather than separate clusters.
- Region transitions are **rough/abrupt**, not smooth blob borders. Need higher-persistence fBm plus a contrast curve to keep edges from blurring.
- Dark areas are **warm near-black**, not cool charcoal.
- A significant portion of the surface is **cool light grey** (quartz/plagioclase) — I had skipped this entirely.

**Structure (the bigger fix):**
- Pink regions are **large irregular blobs** with fuzzy, eroded edges — not cells.
- Dark biotite forms **connected river-like veins** snaking between the pink masses.
- Each region contains **embedded specks of other minerals** — pink areas have dark flecks, dark areas have light flecks. Granite is fractal.
- Crystal scale varies naturally — tiny grains and larger phenocrysts coexist.

**Why Worley alone fails:**
Worley cells are too geometric and too uniform in size. Granite composition is organic, not cellular. Worley is the right tool for **grain structure**, but the wrong tool for **mineral region layout**.

## Three-layer approach (current)

1. **Composition field** — multi-octave Perlin (fBm) at low frequency. Continuous value that decides whether a region tends pink, dark, or grey. Soft fuzzy boundaries by construction.

2. **Vein field** — ridge noise (`1 - abs(noise*2 - 1)`) at slightly higher frequency. Where this peaks, push the color toward biotite regardless of composition. Creates the snaking dark vein networks.

3. **Grain layer** — fine Worley (~4–5px cells). Each grain's color is picked by **independent existence checks per mineral**, not one shared probability budget. We ask in order: "is this biotite?" (driven by vein + dark composition fields), "is this quartz?" (driven by its own field), and default to feldspar (with its own pink-vs-yellow sub-field). This matches how minerals actually crystallize — each based on its own conditions — and gives more authentic intermixing than a single weighted choice.

Mid-frequency Perlin adds a small per-pixel brightness modulation. Light domain warp breaks up the grain regularity. No lighting overlay — fully matte.

## Update: Iterative domain warping (current)

Reference: https://st4yho.me/domain-warping-an-interactive-introduction/

A single-pass warp wasn't enough — the texture still felt grid-locked. The article describes **iterative domain warping with falloff**: apply the warp multiple times, each pass with reduced amplitude, accumulating organic distortion:

```
scale = 1
for i in 0..numWarps:
    x += scale * f(x, y)
    y += scale * g(x, y)
    scale *= falloff
```

Two big changes from this:

1. The warp is applied to pixel coordinates before the **grain lookup** — grain boundaries no longer sit on a regular lattice, so the Worley regularity disappears.
2. The warp is also applied to **noise sampling** when assigning grain colors at setup — so the composition field (where pink/dark/grey regions are) itself bends and flows, instead of being a clean Perlin blob pattern.

Current params: 3 warp iterations, base displacement 75px, falloff 0.55. Max possible displacement ≈ 75 + 41 + 23 ≈ 139px, so the grain pattern can flow significantly across the canvas.

## Update: Interactive parameter controls

All meaningful parameters are now exposed as sliders below the canvas — iterating no longer requires editing constants and reloading. Exposed: warp iterations, displacement, falloff, scale; composition scale; vein scale; region contrast; grain density (cols/rows); seed. A "Regenerate" button triggers a full rebuild with a "Rendering…" indicator that paints before the main render blocks the UI thread.

## Update: Broader feldspar palette + focused biotite

Two color tuning passes after observing the rendered result:

- **Brown range widened.** Feldspar's red channel range expanded from 190–220 to 120–225, and the green/red and blue/red ratios broadened. This puts the full spectrum on the canvas — deep umbers, mid browns, golden tans, and pale buff — instead of just the narrow tan band the previous range gave.

- **Biotite thresholded.** Previously biotite probability had a non-zero baseline from the dark-composition field, which sprayed random black flecks across feldspar regions. Both the vein and dark-zone fields now have thresholds (0.55 and 0.5 respectively) — below them, biotite probability is zero. Biotite now concentrates where it should: in the actual vein networks and the genuinely dark composition zones.
