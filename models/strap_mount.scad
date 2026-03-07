// =============================================================================
// GymRollerBag — Strap Mount (D-Ring Hardware)
// =============================================================================
// The D-ring attachment assembly that threads through the boss hole on
// each end cap, anchoring the backpack strap webbing.
//
// Assembly:
//   1. Thread cross-bar through the boss hole on the end cap
//   2. Press retention collars onto each end of bar
//   3. Loop 38mm nylon webbing through the D-ring
//   4. Connect webbing to adjustable shoulder strap buckles
//
// Print settings: ABS (high temperature resistance near gym equipment),
// 50% infill, 4 perimeters — this component takes the highest load.
//
// Hardware spec: Can also be manufactured in anodized aluminum (recommended
// for production units). The 3D-printed version is for prototyping/fitting.
// =============================================================================

include <_constants.scad>

STANDALONE = true;

// Bar total length: webbing width + collar space on each side
BAR_LENGTH   = D_RING_WIDTH + 20;   // 58mm total
BAR_DIAMETER = 6;
COLLAR_DIA   = 11;
COLLAR_H     = 5;
D_RING_R_OUT = 20;   // outer radius of D-ring frame
D_RING_R_IN  = 14;   // inner radius — must pass 38mm webbing through flat side
D_RING_THICK = 5;    // extrusion thickness of D-ring

// --- Retention Collar ---
// Press-fit onto each end of the cross-bar to prevent it pulling
// through the boss hole. Snap-fit or adhesive bonded in production.
module retention_collar() {
    difference() {
        cylinder(h=COLLAR_H, d=COLLAR_DIA, $fn=24);
        translate([0, 0, -1])
            cylinder(h=COLLAR_H + 2, d=BAR_DIAMETER + 0.3, $fn=20);
    }
}

// --- D-Ring Frame ---
// A D-shaped ring: a partial annulus with a flat chord on one side.
// The flat side is against the end cap; webbing loops through the open arc.
// Inner clearance must accommodate 38mm wide × ~5mm thick webbing.
module d_ring_frame() {
    linear_extrude(height=D_RING_THICK, convexity=4)
    difference() {
        // Outer circle of D
        circle(r=D_RING_R_OUT, $fn=64);
        // Inner void
        circle(r=D_RING_R_IN, $fn=64);
        // Flat chord cut — removes left half to form the D shape
        // The flat back aligns with the roller axis
        translate([-D_RING_R_OUT - 1, -D_RING_R_OUT - 1, 0])
            square(D_RING_R_OUT + 1 + 2, D_RING_R_OUT * 2 + 2);
    }
}

// --- Full Strap Mount Assembly ---
module strap_mount() {
    // Cross-bar (runs through boss hole perpendicular to roller axis)
    cylinder(h=BAR_LENGTH, d=BAR_DIAMETER, center=true, $fn=20);

    // Retention collar — left end
    translate([0, 0, -(BAR_LENGTH / 2)])
        mirror([0, 0, 1])
            retention_collar();

    // Retention collar — right end
    translate([0, 0, BAR_LENGTH / 2 - COLLAR_H])
        retention_collar();

    // D-ring attached at center of bar, perpendicular (arc faces outward)
    translate([0, 0, 0])
        rotate([0, 90, 0])
            translate([0, -D_RING_THICK / 2, 0])
                rotate([90, 0, 0])
                    d_ring_frame();
}

if (STANDALONE) strap_mount();
