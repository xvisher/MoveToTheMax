# GymRollerBag — Bill of Materials & Sourcing Guide

Complete materials list for one (1) production unit.

---

## Printable Components (3D Printed)

| Component | File | Material | Infill | Perimeters | Print Time (est.) | Notes |
|---|---|---|---|---|---|---|
| Fixed end cap | `models/end_cap_fixed.scad` | PETG or ABS | 30% gyroid | 3 | ~4h | Press-fit + glued; no thread engagement |
| Removable end cap | `models/end_cap_removable.scad` | ABS | 30% gyroid | 4 | ~6h | Threaded; ABS gives better creep resistance for threads |
| Strap mount × 2 | `models/strap_mount.scad` | ABS | 50% | 4 | ~3h each | Load-bearing; higher infill required |

**Why ABS over PLA?**
ABS maintains structural integrity in hot cars (up to ~80°C vs PLA's ~60°C) and has better long-term creep resistance for threaded connections under load.

**Print orientation:**
- End caps: flat face down, plug pointing up
- Strap mounts: D-ring plane vertical (bar horizontal)

**Post-processing:**
- Thread surfaces: sand lightly with 220 grit for smooth engagement
- All parts: acetone smoothing (ABS only) for professional surface finish

---

## Manufactured / Sourced Components

### Core Structure

| Component | Spec | Qty | Source category | Est. Unit Cost |
|---|---|---|---|---|
| EVA foam outer shell | 152mm OD × 457mm L, 45 Shore A, black | 1 | Foam fabricator (die-cut + adhesive bond) | $18–22 |
| ABS inner liner tube | 127mm OD, 3mm wall, 457mm L | 1 | Industrial plastics supplier | $8–12 |
| Waterproof nylon bag liner | 210D nylon ripstop, 122mm dia × 445mm, drawstring top | 1 | Custom sew or modified dry bag | $6–10 |

### Fastening & Access

| Component | Spec | Qty | Source category | Est. Unit Cost |
|---|---|---|---|---|
| YKK #10 Aquaguard zipper | Water-resistant coil, 60cm, black | 1 | YKK distributor / fabric supplier | $4–6 |
| Thread-lock adhesive | Loctite 243 or equivalent (medium strength) | — | Hardware store | $0.50/unit |

### Strap System

| Component | Spec | Qty | Source category | Est. Unit Cost |
|---|---|---|---|---|
| Nylon webbing | 38mm wide, black, 1500mm length | 2 | Outdoor fabric supplier | $2–3 each |
| ITW side-release buckle | 38mm series, anodized black | 2 | Buckle-Guy, Strapworks, etc. | $1–2 each |
| Strap length adjuster | 38mm tri-glide slider | 2 | Outdoor fabric supplier | $0.50 each |
| Anodized aluminum D-ring | 38mm inner width, 3mm wire | 2 | Hardware / rigging supplier | $2–3 each |
| D-ring cross-bar | Stainless 6mm rod, 58mm length (or see strap_mount.scad) | 2 | Hardware store | $0.50 each |

### Adhesives & Fasteners

| Component | Spec | Qty | Purpose |
|---|---|---|---|
| Contact cement | EVA foam compatible (DAP Weldwood or Barge) | 1 tube | Bond EVA foam to ABS liner |
| M5 × 16mm hex bolt + nut | Stainless | 4 | Optional mechanical strap boss attachment |
| EVA foam adhesive tape | Double-sided, 3mm, 25mm wide | 1 roll | Seam bonding |

---

## Total Bill of Materials Cost (1 unit)

| Category | Est. Cost |
|---|---|
| 3D printed parts (filament) | $4–6 |
| Core structure | $32–44 |
| Fastening & access | $5–7 |
| Strap system | $10–14 |
| Adhesives & fasteners | $3–5 |
| **Total (DIY / prototype)** | **$54–76** |
| **Target MSRP** | **$79** |
| **Production unit cost (100+ qty)** | **~$28–35** (injection-molded caps, bulk foam) |

---

## Material Properties Reference

### EVA Foam (Ethylene Vinyl Acetate) — 45 Shore A
- **Density:** ~65 kg/m³
- **Compression set:** < 5% after 72h
- **Temperature range:** -50°C to +70°C
- **Water absorption:** < 0.5%
- **Bonding:** Contact cement, hot melt EVA

### ABS (Acrylonitrile Butadiene Styrene)
- **Heat deflection temperature:** 80–95°C (vs. PLA 50–65°C)
- **Tensile strength:** ~40 MPa
- **Elongation at break:** 5–8%
- **Impact resistance:** Excellent (better than PLA)
- **Acetone smoothable:** Yes — surface finish comparable to injection molding

### 210D Nylon Ripstop
- **Denier:** 210 (medium weight — good balance of durability and packability)
- **Weave:** Ripstop grid prevents tear propagation
- **Water resistance:** DWR coating (durable water repellent)
- **Seam sealing:** Heat-weld or seam tape for waterproof interior

### YKK #10 Aquaguard Zipper
- **Pull type:** #10 (heavy duty) vs standard #5
- **Water resistance:** Water-resistant coil construction (not waterproof — pair with sealed seams)
- **Temperature range:** -40°C to +100°C
- **Pull force:** ~8–12N (easy to operate with gloves)

---

## Version Notes

- v1.0 (prototype): 3D-printed end caps, sourced foam roller modified to hollow
- v2.0 (small batch): Custom die-cut EVA foam + ABS liner fabricated
- v3.0 (production): Injection-molded end caps, full custom tooling
