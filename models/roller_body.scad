// =============================================================================
// GymRollerBag — Roller Body
// =============================================================================
// The main structural cylinder — 18" long, 6" outer diameter.
// Hollow interior provides ~3L of storage space.
//
// Features:
//   - Hollow bore for clothing storage
//   - Circumferential surface grooves for muscle therapy grip/texture
//   - Fixed-end socket: slightly enlarged bore for press-fit end cap
//   - Removable-end threads: external helical thread for twist-lock cap
//
// NOTE: The EVA foam outer shell is a manufacturing component (die-cut
// and bonded from sheet stock). This model represents the full outer
// geometry for dimensional reference and for sizing the inner ABS liner.
// The inner liner dimensions match INNER_DIAMETER exactly.
// =============================================================================

include <_constants.scad>

// STANDALONE guard — set to false in assembly.scad before including
STANDALONE = true;

// --- Surface Groove Module ---
// A circumferential groove cut into the outer cylinder surface.
// Rendered as a torus subtraction at height z along the body axis.
module surface_groove(z_pos) {
    translate([0, 0, z_pos])
        rotate_extrude($fn=$fn)
            translate([OUTER_DIAMETER / 2 - GROOVE_DEPTH / 2, 0, 0])
                circle(d=GROOVE_WIDTH, $fn=16);
}

// --- Fixed-End Cap Socket ---
// A slightly enlarged bore at the bottom (z=0 end) that accepts the
// press-fit plug of the fixed end cap.
module fixed_end_socket() {
    translate([0, 0, -1])
        cylinder(
            h  = CAP_HEIGHT + 1,
            d  = INNER_DIAMETER + FIT_TOLERANCE * 2,
            $fn = $fn
        );
}

// --- Removable-End Thread Socket ---
// External helical thread at the top (z=BODY_LENGTH end) that engages
// with the internal thread on the removable cap.
module removable_end_thread() {
    translate([0, 0, BODY_LENGTH - CAP_HEIGHT])
        thread_helix(
            diameter = INNER_DIAMETER,
            pitch    = THREAD_PITCH,
            length   = CAP_HEIGHT,
            external = true
        );
}

// --- Main Roller Body ---
module roller_body() {
    difference() {
        // Outer shell — the full solid cylinder
        cylinder(h=BODY_LENGTH, d=OUTER_DIAMETER, $fn=$fn);

        // Inner bore — subtracted to create hollow interior
        // +2mm oversize to prevent zero-thickness face artifacts
        translate([0, 0, -1])
            cylinder(h=BODY_LENGTH + 2, d=INNER_DIAMETER, $fn=$fn);

        // Surface grooves — spaced evenly along body length
        // First groove starts one spacing in from each end
        for (z = [GROOVE_SPACING : GROOVE_SPACING : BODY_LENGTH - GROOVE_SPACING])
            surface_groove(z);

        // Fixed-end socket at z=0 (bottom)
        fixed_end_socket();
    }

    // External thread at the removable-cap end (added, not subtracted)
    removable_end_thread();
}

// Render when run standalone
if (STANDALONE) roller_body();
