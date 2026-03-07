// =============================================================================
// GymRollerBag — Full Assembly
// =============================================================================
// Combines all components into a complete product visualization.
// Use this file to:
//   - Review overall proportions and part fit
//   - Generate hero renders for the website / marketing
//   - Verify thread and socket engagement between parts
//
// EXPLODED view: Set EXPLODED = true to space parts apart for documentation.
// ASSEMBLED view: Set EXPLODED = false for production-accurate positioning.
//
// Render tips:
//   - Press F5 for fast preview (CSG approximation)
//   - Press F6 for full render before export
//   - Set $fn = 32 for development; $fn = 128 for final export
// =============================================================================

// Override STANDALONE before including component files
// so they define their modules without auto-rendering.
STANDALONE = false;

include <_constants.scad>
include <roller_body.scad>
include <end_cap_fixed.scad>
include <end_cap_removable.scad>
include <strap_mount.scad>

// --- Assembly Mode ---
EXPLODED = false;   // Set to true for exploded documentation view
EXPLODE_GAP = 60;  // mm gap between parts in exploded view

function explode(dist) = EXPLODED ? dist : 0;

// --- Strap Mount Positioning ---
// Both mounts attach to the outer side of each end cap boss.
// Rotated 90° so bar axis aligns with cap boss hole (X direction).
// Positioned at cap center height, offset outward from roller edge.
module placed_strap_mount(y_pos) {
    translate([OUTER_DIAMETER / 2 + 10, 0, y_pos])
        rotate([0, 90, 90])
            strap_mount();
}

// --- Full Assembly ---
module full_assembly() {
    // --- Fixed End Cap (bottom) ---
    // At z = 0, below the roller body
    translate([0, 0, -(CAP_HEIGHT + explode(EXPLODE_GAP))])
        end_cap_fixed();

    // --- Roller Body ---
    // Starts at z = 0
    roller_body();

    // --- Removable End Cap (top) ---
    // Sits on top of body, twisted onto external thread
    translate([0, 0, BODY_LENGTH + explode(EXPLODE_GAP)])
        end_cap_removable();

    // --- Strap Mounts (one at each end) ---
    // Positioned at mid-height of each end cap

    // Bottom strap mount (at fixed cap)
    placed_strap_mount(-(CAP_HEIGHT / 2 + explode(EXPLODE_GAP)));

    // Top strap mount (at removable cap)
    placed_strap_mount(BODY_LENGTH + CAP_HEIGHT / 2 + explode(EXPLODE_GAP));
}

// --- Render ---
full_assembly();

// =============================================================================
// Bill of Materials (comment block for reference)
// =============================================================================
// Printable components (ABS/PETG, 30% infill unless noted):
//   - end_cap_fixed.scad     × 1  (press-fit into body, glued)
//   - end_cap_removable.scad × 1  (twist-lock onto body threads)
//   - strap_mount.scad       × 2  (50% infill, 4 perimeters)
//
// Manufactured / sourced components:
//   - EVA foam outer shell   × 1  152mm OD, 457mm length, die-cut
//   - ABS inner liner tube   × 1  127mm OD, 3mm wall, 457mm length
//   - 210D nylon ripstop bag × 1  drawstring closure, 120mm dia × 440mm
//   - YKK #10 Aquaguard zip  × 1  600mm length
//   - 38mm nylon webbing     × 2  1500mm each (shoulder straps)
//   - ITW side-release buckle× 2  38mm series
//   - Anodized aluminum D-ring×2  38mm inner width
//   - M5 × 16mm screw + nut  × 4  to secure strap mounts to caps
// =============================================================================
