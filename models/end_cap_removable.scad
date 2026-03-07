// =============================================================================
// GymRollerBag — Removable End Cap (Access / Zipper End)
// =============================================================================
// The twist-lock access cap at the top of the roller.
// Unscrew to open the storage compartment and pack your gear.
//
// Print settings: ABS or PETG, 30% gyroid infill, 3 perimeters.
// Thread engagement requires good layer adhesion — print slowly.
//
// Features:
//   - Internal helical thread engages roller body external thread
//   - Zipper channel ring on outer face (recessed annular trough)
//   - Zipper pull tab clearance notch
//   - Knurled outer edge for grip while twisting
//   - Strap boss on outer face (same as fixed cap)
// =============================================================================

include <_constants.scad>

STANDALONE = true;

// --- Zipper Channel Ring ---
// An annular groove on the outer (top) face of the cap disk where
// the YKK #10 Aquaguard zipper tape sits when the cap is in place.
// The zipper runs radially around the circumference of the cap face.
module zipper_channel() {
    channel_radius  = OUTER_DIAMETER / 2 - 12;  // inset from rim
    channel_width   = 9;
    channel_depth   = 5;

    // Annular trough = difference of two coaxial cylinders
    difference() {
        cylinder(h=channel_depth, d=(channel_radius + channel_width / 2) * 2, $fn=$fn);
        translate([0, 0, -1])
            cylinder(h=channel_depth + 2, d=(channel_radius - channel_width / 2) * 2, $fn=$fn);
    }
}

// --- Zipper Pull Notch ---
// A rectangular clearance slot at the 12 o'clock position so the
// zipper pull sits flush when the cap is closed.
module zipper_pull_notch() {
    translate([-5, OUTER_DIAMETER / 2 - 14, 0])
        cube([10, 14, 6]);
}

// --- Knurled Grip Ring ---
// Vertical ridges around the outer cylindrical surface of the cap
// for finger grip while twisting to open/close.
module knurl_ring(n_ridges=36) {
    ridge_w = 2.5;
    ridge_h = CAP_HEIGHT;
    r       = OUTER_DIAMETER / 2;

    for (i = [0 : 360 / n_ridges : 360 - 1])
        rotate([0, 0, i])
            translate([r - 1, -ridge_w / 2, 0])
                cube([ridge_w, ridge_w, ridge_h]);
}

// --- Removable End Cap ---
module end_cap_removable() {
    difference() {
        union() {
            // Outer disk
            cylinder(h=CAP_HEIGHT, d=OUTER_DIAMETER, $fn=$fn);

            // Inner threaded plug — undersized by tolerance
            cylinder(
                h  = CAP_HEIGHT + CAP_PLUG_EXTRA,
                d  = INNER_DIAMETER - FIT_TOLERANCE,
                $fn = $fn
            );

            // Knurled grip ridges on outer edge
            knurl_ring();

            // Strap boss on outer face
            translate([0, 0, CAP_HEIGHT])
                strap_boss();
        }

        // Internal thread — cut into the plug
        // Positioned to engage body's external thread when cap is twisted on
        translate([0, 0, 0])
            thread_helix(
                diameter = INNER_DIAMETER - FIT_TOLERANCE,
                pitch    = THREAD_PITCH,
                length   = CAP_HEIGHT + CAP_PLUG_EXTRA,
                external = false
            );

        // Zipper channel on top face of the disk
        translate([0, 0, CAP_HEIGHT - 5])
            zipper_channel();

        // Zipper pull tab clearance notch
        translate([0, 0, CAP_HEIGHT - 6])
            zipper_pull_notch();
    }
}

if (STANDALONE) end_cap_removable();
