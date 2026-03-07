# GymRollerBag

**The foam roller that carries your whole gym.**

A hybrid fitness tool: full-size EVA foam roller + waterproof gym bag + detachable backpack straps — all in one 18" × 6" cylinder.

---

## What's in this repo

```
MoveToTheMax/
├── models/              OpenSCAD 3D CAD files (printable components)
│   ├── _constants.scad  Shared dimensions & modules (include first)
│   ├── roller_body.scad Main hollow cylinder with surface grooves
│   ├── end_cap_fixed.scad    Sealed bottom end cap (press-fit)
│   ├── end_cap_removable.scad Twist-lock access cap (threaded + zipper channel)
│   ├── strap_mount.scad D-ring hardware assembly
│   └── assembly.scad    Full product assembly view
├── website/             Product landing page (open index.html in browser)
│   ├── index.html
│   ├── css/styles.css
│   └── js/
│       ├── viewer3d.js  Three.js interactive 3D viewer
│       └── app.js       Page interactivity
├── materials.md         Full bill of materials & sourcing guide
└── README.md
```

---

## Product Specs

| Spec | Value |
|---|---|
| Length | 18" / 457mm |
| Diameter | 6" / 152mm |
| Storage capacity | ~3 liters |
| Wall thickness | 0.5" / 12.7mm |
| Outer material | EVA foam, 45 Shore A |
| Strap width | 38mm nylon webbing |
| Zipper | YKK #10 Aquaguard |

---

## Rendering the 3D Models

Requires [OpenSCAD](https://openscad.org/downloads.html) (free, open source).

**Open a single component:**
```bash
openscad models/roller_body.scad
```

**Export to STL for 3D printing:**
```bash
# End caps (printable)
openscad -o roller_body.stl models/roller_body.scad
openscad -o end_cap_fixed.stl models/end_cap_fixed.scad
openscad -o end_cap_removable.stl models/end_cap_removable.scad
openscad -o strap_mount.stl models/strap_mount.scad

# Full assembly (visual reference — not for printing as one piece)
openscad -o assembly.stl models/assembly.scad
```

**Render quality:**
- In `models/_constants.scad`, change `$fn = 32` (fast preview) to `$fn = 128` (smooth export) before generating final STL files.

**Exploded view:**
In `models/assembly.scad`, set `EXPLODED = true` and re-render for a documentation-style parts diagram.

---

## Running the Website

No build step, no server required:

```bash
open website/index.html       # macOS
xdg-open website/index.html   # Linux
start website/index.html      # Windows
```

Or drag `website/index.html` into any modern browser.

The Three.js 3D viewer loads from CDN — an internet connection is required for the first load. Once cached, it works offline.

**Browser support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## 3D Printing Guide

**Printable parts:** end caps + strap mounts (the EVA foam body is manufactured, not printed)

| Part | Material | Infill | Notes |
|---|---|---|---|
| Fixed end cap | ABS or PETG | 30% | Press-fit into body; glued in place |
| Removable end cap | ABS | 30% | Threaded; ABS preferred for thread durability |
| Strap mount × 2 | ABS | 50% | Load-bearing — do not reduce infill |

**Recommended slicers:** PrusaSlicer, Bambu Studio, Cura

---

## Bill of Materials

See [materials.md](materials.md) for the complete sourcing guide, costs, and material properties.

**Quick summary:**
- EVA foam shell: custom die-cut, 152mm OD × 457mm
- ABS inner liner: standard 127mm OD tube
- YKK #10 Aquaguard zipper
- 38mm nylon webbing + anodized aluminum hardware
- Estimated DIY prototype cost: **$54–76**
- Target MSRP: **$79**

---

## License

Product design and website © MoveToTheMax. All rights reserved.

OpenSCAD model files are provided for personal prototyping and evaluation only.
