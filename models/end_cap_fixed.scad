// =============================================================================
// GymRollerBag — Fixed End Cap
// =============================================================================
// The sealed, non-removable end cap. Glued or press-fit into the
// fixed-end socket of the roller body.
//
// Print settings: ABS or PETG, 30% gyroid infill, 3 perimeters.
//
// Features:
//   - Outer disk flush with roller OD
//   - Inner plug with press-fit tolerance for body socket
//   - Strap boss on outer face for D-ring bar attachment
//   - Lightening pockets to reduce material usage
// =============================================================================

include <_constants.scad>

STANDALONE = true;

// --- Lightening Pocket ---
// Four symmetric cylindrical voids inside the cap disk to save material
// while maintaining structural integrity.
module lightening_pocket() {
    pocket_r  = (OUTER_DIAMETER / 4) - 6;
    pocket_d  = 14;
    pocket_h  = CAP_HEIGHT - 6;  // leave 6mm floor

    for (angle = [0, 90, 180, 270])
        rotate([0, 0, angle])
            translate([pocket_r, 0, 3])
                cylinder(h=pocket_h, d=pocket_d, $fn=20);
}

// --- Fixed End Cap ---
module end_cap_fixed() {
    difference() {
        union() {
            // Outer disk — flush with roller outer diameter
            cylinder(h=CAP_HEIGHT, d=OUTER_DIAMETER, $fn=$fn);

            // Inner plug — extends into body socket
            // Slightly undersized by FIT_TOLERANCE for press fit
            cylinder(
                h  = CAP_HEIGHT + CAP_PLUG_EXTRA,
                d  = INNER_DIAMETER - FIT_TOLERANCE,
                $fn = $fn
            );

            // Strap boss on outer face (top surface)
            translate([0, 0, CAP_HEIGHT])
                strap_boss();
        }

        // Lightening pockets — cut into the disk (not the plug)
        lightening_pocket();
    }
}

if (STANDALONE) end_cap_fixed();
