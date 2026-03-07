// =============================================================================
// GymRollerBag — Shared Constants & Modules
// =============================================================================
// All dimensional constants in millimeters (mm).
// All component files must: include <_constants.scad>
//
// Rendering tip: Change $fn to 32 for fast development previews,
// set to 128 for final STL export.
// =============================================================================

// --- Dimensional Constants ---
OUTER_DIAMETER  = 152;    // EVA foam shell outer diameter (6 inches)
INNER_DIAMETER  = 127;    // Inner storage cavity diameter (5 inches)
WALL_THICKNESS  = 12.7;   // Foam wall thickness (0.5 inches)
BODY_LENGTH     = 457;    // Roller body length (18 inches)
CAP_HEIGHT      = 25;     // Depth of each end cap
CAP_PLUG_EXTRA  = 8;      // How far the cap plug extends into the body
THREAD_PITCH    = 3;      // Helical thread pitch for removable cap
THREAD_DEPTH    = 1.5;    // Thread profile depth (radial)
GROOVE_DEPTH    = 3;      // Surface texture groove depth
GROOVE_WIDTH    = 5;      // Surface texture groove width
GROOVE_SPACING  = 20;     // Axial distance between grooves
D_RING_WIDTH    = 38;     // D-ring inner width (matches 38mm webbing)
BOSS_DIAMETER   = 20;     // Strap boss outer diameter
BOSS_HEIGHT     = 10;     // Strap boss height above cap face
BOSS_HOLE_DIA   = 7;      // Through-hole for D-ring bar
FIT_TOLERANCE   = 0.4;    // Press-fit clearance (subtract from plug OD)

// --- Render Quality ---
// Comment out one line depending on mode:
$fn = 32;   // Development (fast preview)
// $fn = 128;  // Production (smooth STL export)

// =============================================================================
// Shared Module: strap_boss()
// A raised cylindrical boss on a cap face with a horizontal bar hole
// for threading the D-ring cross-bar through.
// Centered at [0,0,0] — caller must translate to correct position.
// =============================================================================
module strap_boss() {
    difference() {
        // Boss cylinder
        cylinder(h=BOSS_HEIGHT, d=BOSS_DIAMETER, $fn=32);

        // Horizontal through-hole for D-ring bar
        translate([0, -(BOSS_DIAMETER), BOSS_HEIGHT / 2])
            rotate([-90, 0, 0])
                cylinder(h=BOSS_DIAMETER * 2, d=BOSS_HOLE_DIA, $fn=24);
    }
}

// =============================================================================
// Shared Module: thread_helix(diameter, pitch, length, external)
// Generates a helical thread profile using twisted extrusion.
// external=true  → external thread (used on roller body end)
// external=false → internal thread (used inside removable cap plug)
// =============================================================================
module thread_helix(diameter, pitch, length, external=true) {
    turns = length / pitch;
    total_angle = turns * 360;
    r = diameter / 2;

    // Triangle tooth profile
    tooth_h = THREAD_DEPTH;
    tooth_w = pitch * 0.6;

    sign = external ? 1 : -1;

    linear_extrude(
        height    = length,
        twist     = -total_angle,
        slices    = turns * 24,
        $fn       = 48
    )
    // Thread tooth positioned at the thread radius
    translate([r + sign * (tooth_h / 2), 0, 0])
        polygon([
            [-tooth_h / 2, -tooth_w / 2],
            [ tooth_h / 2,  0           ],
            [-tooth_h / 2,  tooth_w / 2 ]
        ]);
}
