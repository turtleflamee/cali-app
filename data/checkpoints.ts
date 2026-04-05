export interface Checkpoint {
  name: string;
  metric: string;
  fromId: string;
  toId: string;
  position: 1 | 2;
}

export const checkpoints: Checkpoint[] = [
  // ============================================================
  // PUSH - Pushups
  // ============================================================
  // Wall Push-up -> Incline Push-up
  { name: "Eccentric Wall PU 5s", metric: "1 rep", fromId: "push_pu_1", toId: "push_pu_2", position: 1 },
  { name: "Low Wall Push-up", metric: "1 rep", fromId: "push_pu_1", toId: "push_pu_2", position: 2 },
  // Incline Push-up -> Regular Push-up
  { name: "Low Incline PU (knee high)", metric: "1 rep", fromId: "push_pu_2", toId: "push_pu_3", position: 1 },
  { name: "Kneeling Push-up", metric: "1 rep", fromId: "push_pu_2", toId: "push_pu_3", position: 2 },
  // Regular Push-up -> Diamond Push-up
  { name: "Narrow Grip Push-up", metric: "1 rep", fromId: "push_pu_3", toId: "push_pu_4", position: 1 },
  { name: "Close Grip Plank Hold", metric: "15s hold", fromId: "push_pu_3", toId: "push_pu_4", position: 2 },
  // Diamond Push-up -> Archer Push-up
  { name: "Wide Push-up", metric: "1 rep", fromId: "push_pu_4", toId: "push_pu_5", position: 1 },
  { name: "Staggered Hand Push-up", metric: "1 rep", fromId: "push_pu_4", toId: "push_pu_5", position: 2 },
  // Archer Push-up -> Pseudo Planche PU
  { name: "Decline Push-up", metric: "1 rep", fromId: "push_pu_5", toId: "push_pu_6", position: 1 },
  { name: "Planche Lean Hold", metric: "10s hold", fromId: "push_pu_5", toId: "push_pu_6", position: 2 },
  // Pseudo Planche PU -> One-Arm Push-up
  { name: "Typewriter Push-up", metric: "1 rep", fromId: "push_pu_6", toId: "push_pu_7", position: 1 },
  { name: "Elevated One-Arm PU", metric: "1 rep", fromId: "push_pu_6", toId: "push_pu_7", position: 2 },

  // ============================================================
  // PUSH - Dips
  // ============================================================
  // Bench Dip -> Parallel Bar Dip
  { name: "Feet-Elevated Bench Dip", metric: "1 rep", fromId: "push_di_1", toId: "push_di_2", position: 1 },
  { name: "Bar Support Hold", metric: "15s hold", fromId: "push_di_1", toId: "push_di_2", position: 2 },
  // Parallel Bar Dip -> Ring Dip
  { name: "Ring Support Hold", metric: "15s hold", fromId: "push_di_2", toId: "push_di_3", position: 1 },
  { name: "Eccentric Ring Dip 5s", metric: "1 rep", fromId: "push_di_2", toId: "push_di_3", position: 2 },
  // Ring Dip -> Korean Dip
  { name: "Skin the Cat (partial)", metric: "1 rep", fromId: "push_di_3", toId: "push_di_4", position: 1 },
  { name: "German Hang Entry", metric: "5s hold", fromId: "push_di_3", toId: "push_di_4", position: 2 },
  // Korean Dip -> Weighted Ring Dip
  { name: "Ring Dip Pause Reps", metric: "1 rep", fromId: "push_di_4", toId: "push_di_5", position: 1 },
  { name: "Weighted Parallel Dip", metric: "1 rep", fromId: "push_di_4", toId: "push_di_5", position: 2 },
  // Weighted Ring Dip -> Impossible Dip
  { name: "Deep Korean Dip", metric: "1 rep", fromId: "push_di_5", toId: "push_di_6", position: 1 },
  { name: "Bar Transition Drill", metric: "1 rep", fromId: "push_di_5", toId: "push_di_6", position: 2 },

  // ============================================================
  // PUSH - Shoulder Press
  // ============================================================
  // Pike Push-up -> Elevated Pike PU
  { name: "Box Pike PU (low box)", metric: "1 rep", fromId: "push_sp_1", toId: "push_sp_2", position: 1 },
  { name: "Pike Hold Shoulder Taps", metric: "1 rep", fromId: "push_sp_1", toId: "push_sp_2", position: 2 },
  // Elevated Pike PU -> Wall HSPU
  { name: "Wall Walk to Handstand", metric: "1 rep", fromId: "push_sp_2", toId: "push_sp_3", position: 1 },
  { name: "Eccentric Wall HSPU 5s", metric: "1 rep", fromId: "push_sp_2", toId: "push_sp_3", position: 2 },
  // Wall HSPU -> Freestanding Handstand
  { name: "Toe Taps Off Wall", metric: "1 rep", fromId: "push_sp_3", toId: "push_sp_4", position: 1 },
  { name: "Floating Toe Taps", metric: "5s hold", fromId: "push_sp_3", toId: "push_sp_4", position: 2 },
  // Freestanding Handstand -> Freestanding HSPU
  { name: "HS Shoulder Shrugs", metric: "1 rep", fromId: "push_sp_4", toId: "push_sp_5", position: 1 },
  { name: "Partial Freestanding HSPU", metric: "1 rep", fromId: "push_sp_4", toId: "push_sp_5", position: 2 },
  // Freestanding Handstand -> One-Arm Handstand
  { name: "HS Weight Shifts", metric: "5s hold", fromId: "push_sp_4", toId: "push_sp_6", position: 1 },
  { name: "One-Finger Assist HS", metric: "5s hold", fromId: "push_sp_4", toId: "push_sp_6", position: 2 },
  // Freestanding HSPU -> 90 Degree Push-up
  { name: "Elevated HSPU (deficit)", metric: "1 rep", fromId: "push_sp_5", toId: "push_sp_7", position: 1 },
  { name: "90-Degree Hold Attempt", metric: "5s hold", fromId: "push_sp_5", toId: "push_sp_7", position: 2 },

  // ============================================================
  // PULL - Pullups
  // ============================================================
  // Dead Hang -> Negative Pull-up
  { name: "Flexed-Arm Hang", metric: "10s hold", fromId: "pull_pu_1", toId: "pull_pu_2", position: 1 },
  { name: "Scapular Pull-up", metric: "1 rep", fromId: "pull_pu_1", toId: "pull_pu_2", position: 2 },
  // Negative Pull-up -> Pull-up
  { name: "Band-Assisted Pull-up", metric: "1 rep", fromId: "pull_pu_2", toId: "pull_pu_3", position: 1 },
  { name: "Jump to Chin-Over Hold", metric: "5s hold", fromId: "pull_pu_2", toId: "pull_pu_3", position: 2 },
  // Pull-up -> L-Sit Pull-up
  { name: "Hanging Knee Raise PU", metric: "1 rep", fromId: "pull_pu_3", toId: "pull_pu_4", position: 1 },
  { name: "L-Hang Hold", metric: "10s hold", fromId: "pull_pu_3", toId: "pull_pu_4", position: 2 },
  // L-Sit Pull-up -> Archer Pull-up
  { name: "Wide Grip Pull-up", metric: "1 rep", fromId: "pull_pu_4", toId: "pull_pu_5", position: 1 },
  { name: "Typewriter Pull-up", metric: "1 rep", fromId: "pull_pu_4", toId: "pull_pu_5", position: 2 },
  // Archer Pull-up -> Uneven Pull-up
  { name: "Towel Grip Pull-up", metric: "1 rep", fromId: "pull_pu_5", toId: "pull_pu_6", position: 1 },
  { name: "Offset Grip Pull-up", metric: "1 rep", fromId: "pull_pu_5", toId: "pull_pu_6", position: 2 },
  // Uneven Pull-up -> Assisted OA Pull-up
  { name: "Pulley-Assist OAP", metric: "1 rep", fromId: "pull_pu_6", toId: "pull_pu_7", position: 1 },
  { name: "Finger-Assist Pull-up", metric: "1 rep", fromId: "pull_pu_6", toId: "pull_pu_7", position: 2 },
  // Assisted OA Pull-up -> One-Arm Pull-up
  { name: "Eccentric OA Pull-up 5s", metric: "1 rep", fromId: "pull_pu_7", toId: "pull_pu_8", position: 1 },
  { name: "OAP from Flexed Arm", metric: "1 rep", fromId: "pull_pu_7", toId: "pull_pu_8", position: 2 },

  // ============================================================
  // PULL - Rows
  // ============================================================
  // Incline Row -> Horizontal Row
  { name: "Feet-Elevated Row", metric: "1 rep", fromId: "pull_ro_1", toId: "pull_ro_2", position: 1 },
  { name: "Paused Horizontal Row", metric: "1 rep", fromId: "pull_ro_1", toId: "pull_ro_2", position: 2 },
  // Horizontal Row -> Archer Row
  { name: "Wide Grip Row", metric: "1 rep", fromId: "pull_ro_2", toId: "pull_ro_3", position: 1 },
  { name: "Staggered Hand Row", metric: "1 rep", fromId: "pull_ro_2", toId: "pull_ro_3", position: 2 },
  // Archer Row -> Front Lever Row Tuck
  { name: "Tuck Front Lever Hold", metric: "10s hold", fromId: "pull_ro_3", toId: "pull_ro_4", position: 1 },
  { name: "Tuck FL Row Attempt", metric: "1 rep", fromId: "pull_ro_3", toId: "pull_ro_4", position: 2 },

  // ============================================================
  // PULL - Transitions
  // ============================================================
  // Explosive Pull-up -> Kipping Muscle-up
  { name: "Chest-to-Bar Pull-up", metric: "1 rep", fromId: "pull_tr_1", toId: "pull_tr_2", position: 1 },
  { name: "Kipping Swing Drill", metric: "1 rep", fromId: "pull_tr_1", toId: "pull_tr_2", position: 2 },
  // Kipping Muscle-up -> Strict Muscle-up
  { name: "Slow Kip Muscle-up", metric: "1 rep", fromId: "pull_tr_2", toId: "pull_tr_3", position: 1 },
  { name: "Deep Chest-to-Bar PU", metric: "1 rep", fromId: "pull_tr_2", toId: "pull_tr_3", position: 2 },
  // Strict Muscle-up -> Hefesto
  { name: "German Hang Pullout", metric: "1 rep", fromId: "pull_tr_3", toId: "pull_tr_4", position: 1 },
  { name: "Reverse Muscle-up Eccentric", metric: "1 rep", fromId: "pull_tr_3", toId: "pull_tr_4", position: 2 },

  // ============================================================
  // CORE - Planks
  // ============================================================
  // Forearm Plank -> RKC Plank
  { name: "Plank Shoulder Taps", metric: "1 rep", fromId: "core_pk_1", toId: "core_pk_2", position: 1 },
  { name: "Max Tension Plank 10s", metric: "10s hold", fromId: "core_pk_1", toId: "core_pk_2", position: 2 },
  // RKC Plank -> Plank Walk-out
  { name: "Plank Arm Reaches", metric: "1 rep", fromId: "core_pk_2", toId: "core_pk_3", position: 1 },
  { name: "Extended Plank Hold", metric: "10s hold", fromId: "core_pk_2", toId: "core_pk_3", position: 2 },
  // Plank Walk-out -> Ab Wheel Rollout
  { name: "Kneeling Rollout (short)", metric: "1 rep", fromId: "core_pk_3", toId: "core_pk_4", position: 1 },
  { name: "Swiss Ball Rollout", metric: "1 rep", fromId: "core_pk_3", toId: "core_pk_4", position: 2 },
  // Ab Wheel Rollout -> Body Saw Plank
  { name: "Standing Rollout (partial)", metric: "1 rep", fromId: "core_pk_4", toId: "core_pk_5", position: 1 },
  { name: "Slider Plank Saw", metric: "1 rep", fromId: "core_pk_4", toId: "core_pk_5", position: 2 },
  // Body Saw Plank -> Dragon Flag
  { name: "Tuck Dragon Flag", metric: "1 rep", fromId: "core_pk_5", toId: "core_pk_6", position: 1 },
  { name: "Eccentric Dragon Flag 5s", metric: "1 rep", fromId: "core_pk_5", toId: "core_pk_6", position: 2 },

  // ============================================================
  // CORE - Leg Raises
  // ============================================================
  // Lying Leg Raise -> Hanging Knee Raise
  { name: "Dead Hang Hold", metric: "15s hold", fromId: "core_lr_1", toId: "core_lr_2", position: 1 },
  { name: "Captain's Chair Knee Raise", metric: "1 rep", fromId: "core_lr_1", toId: "core_lr_2", position: 2 },
  // Hanging Knee Raise -> Hanging Leg Raise
  { name: "Hanging Knee to Chest", metric: "1 rep", fromId: "core_lr_2", toId: "core_lr_3", position: 1 },
  { name: "Eccentric Leg Lower 5s", metric: "1 rep", fromId: "core_lr_2", toId: "core_lr_3", position: 2 },
  // Hanging Leg Raise -> Toes-to-Bar
  { name: "Kipping Toe Touch", metric: "1 rep", fromId: "core_lr_3", toId: "core_lr_4", position: 1 },
  { name: "Strict Toes Near Bar", metric: "1 rep", fromId: "core_lr_3", toId: "core_lr_4", position: 2 },
  // Toes-to-Bar -> Windshield Wipers
  { name: "Toes-to-Bar Side Tap", metric: "1 rep", fromId: "core_lr_4", toId: "core_lr_5", position: 1 },
  { name: "Bent-Knee Wipers", metric: "1 rep", fromId: "core_lr_4", toId: "core_lr_5", position: 2 },
  // Windshield Wipers -> Coffee Grinder
  { name: "Floor Coffee Grinder", metric: "1 rep", fromId: "core_lr_5", toId: "core_lr_6", position: 1 },
  { name: "Plank Leg Circle", metric: "1 rep", fromId: "core_lr_5", toId: "core_lr_6", position: 2 },
  // Coffee Grinder -> Windmill
  { name: "Backward Roll to Stall", metric: "1 rep", fromId: "core_lr_6", toId: "core_lr_7", position: 1 },
  { name: "Shoulder Roll Drill", metric: "1 rep", fromId: "core_lr_6", toId: "core_lr_7", position: 2 },

  // ============================================================
  // CORE - Static Holds
  // ============================================================
  // Tuck L-Sit -> L-Sit
  { name: "One-Leg L-Sit Extend", metric: "5s hold", fromId: "core_sh_1", toId: "core_sh_2", position: 1 },
  { name: "L-Sit Eccentric Lower", metric: "1 rep", fromId: "core_sh_1", toId: "core_sh_2", position: 2 },
  // L-Sit -> V-Sit
  { name: "L-Sit Leg Pulses", metric: "1 rep", fromId: "core_sh_2", toId: "core_sh_3", position: 1 },
  { name: "Tuck V-Sit Hold", metric: "5s hold", fromId: "core_sh_2", toId: "core_sh_3", position: 2 },
  // V-Sit -> Straddle V-Sit
  { name: "V-Sit Straddle Open", metric: "1 rep", fromId: "core_sh_3", toId: "core_sh_4", position: 1 },
  { name: "Straddle V-Sit Attempt", metric: "5s hold", fromId: "core_sh_3", toId: "core_sh_4", position: 2 },
  // Straddle V-Sit -> High V-Sit
  { name: "V-Sit Hip Lift Pulses", metric: "1 rep", fromId: "core_sh_4", toId: "core_sh_5", position: 1 },
  { name: "Elevated V-Sit Hold", metric: "5s hold", fromId: "core_sh_4", toId: "core_sh_5", position: 2 },
  // High V-Sit -> Manna
  { name: "Rear Compression Drill", metric: "1 rep", fromId: "core_sh_5", toId: "core_sh_6", position: 1 },
  { name: "Manna Tuck Attempt", metric: "5s hold", fromId: "core_sh_5", toId: "core_sh_6", position: 2 },

  // ============================================================
  // LEGS - Squats
  // ============================================================
  // Bodyweight Squat -> Bulgarian Split Squat
  { name: "Reverse Lunge", metric: "1 rep", fromId: "legs_sq_1", toId: "legs_sq_2", position: 1 },
  { name: "Bench Step-up", metric: "1 rep", fromId: "legs_sq_1", toId: "legs_sq_2", position: 2 },
  // Bulgarian Split Squat -> Weighted Step-up
  { name: "High Box Step-up", metric: "1 rep", fromId: "legs_sq_2", toId: "legs_sq_3", position: 1 },
  { name: "Deficit BSS", metric: "1 rep", fromId: "legs_sq_2", toId: "legs_sq_3", position: 2 },
  // Weighted Step-up -> Pistol Squat
  { name: "Assisted Pistol (hold post)", metric: "1 rep", fromId: "legs_sq_3", toId: "legs_sq_4", position: 1 },
  { name: "Box Pistol Squat", metric: "1 rep", fromId: "legs_sq_3", toId: "legs_sq_4", position: 2 },
  // Pistol Squat -> Shrimp Squat
  { name: "Beginner Shrimp (hand hold)", metric: "1 rep", fromId: "legs_sq_4", toId: "legs_sq_5", position: 1 },
  { name: "Eccentric Shrimp 5s", metric: "1 rep", fromId: "legs_sq_4", toId: "legs_sq_5", position: 2 },
  // Shrimp Squat -> Kick-through
  { name: "Cossack Squat", metric: "1 rep", fromId: "legs_sq_5", toId: "legs_sq_6", position: 1 },
  { name: "Low Kick-through Drill", metric: "1 rep", fromId: "legs_sq_5", toId: "legs_sq_6", position: 2 },
  // Kick-through -> Coin Drop
  { name: "Deep Shrimp to Stand", metric: "1 rep", fromId: "legs_sq_6", toId: "legs_sq_7", position: 1 },
  { name: "Single-Leg Drop Catch", metric: "1 rep", fromId: "legs_sq_6", toId: "legs_sq_7", position: 2 },
  // Coin Drop -> Flare
  { name: "Deep Squat Leg Sweep", metric: "1 rep", fromId: "legs_sq_7", toId: "legs_sq_8", position: 1 },
  { name: "Supported Flare Kick", metric: "1 rep", fromId: "legs_sq_7", toId: "legs_sq_8", position: 2 },

  // ============================================================
  // LEGS - Hinges
  // ============================================================
  // Bodyweight RDL -> Single-Leg RDL
  { name: "Staggered Stance RDL", metric: "1 rep", fromId: "legs_hi_1", toId: "legs_hi_2", position: 1 },
  { name: "Kickstand RDL", metric: "1 rep", fromId: "legs_hi_1", toId: "legs_hi_2", position: 2 },
  // Single-Leg RDL -> Negative Nordic Curl
  { name: "Nordic Curl Setup Hold", metric: "10s hold", fromId: "legs_hi_2", toId: "legs_hi_3", position: 1 },
  { name: "Band-Assist Nordic Curl", metric: "1 rep", fromId: "legs_hi_2", toId: "legs_hi_3", position: 2 },
  // Negative Nordic Curl -> Nordic Curl
  { name: "Partial Nordic Concentric", metric: "1 rep", fromId: "legs_hi_3", toId: "legs_hi_4", position: 1 },
  { name: "Nordic Curl Catch & Push", metric: "1 rep", fromId: "legs_hi_3", toId: "legs_hi_4", position: 2 },

  // ============================================================
  // SKILLS - Planche
  // ============================================================
  // Frog Stand -> Planche Lean
  { name: "Frog Stand Leg Extensions", metric: "1 rep", fromId: "skills_pl_1", toId: "skills_pl_2", position: 1 },
  { name: "Mild Planche Lean Hold", metric: "10s hold", fromId: "skills_pl_1", toId: "skills_pl_2", position: 2 },
  // Planche Lean -> Advanced Tuck Planche
  { name: "Banded Tuck Planche", metric: "5s hold", fromId: "skills_pl_2", toId: "skills_pl_3", position: 1 },
  { name: "Elevated Tuck Planche", metric: "5s hold", fromId: "skills_pl_2", toId: "skills_pl_3", position: 2 },
  // Advanced Tuck Planche -> Tuck Planche
  { name: "Tuck Planche Leans", metric: "5s hold", fromId: "skills_pl_3", toId: "skills_pl_4", position: 1 },
  { name: "Open Tuck Planche", metric: "5s hold", fromId: "skills_pl_3", toId: "skills_pl_4", position: 2 },
  // Tuck Planche -> Half-Lay Planche
  { name: "One-Leg Tuck Extend", metric: "5s hold", fromId: "skills_pl_4", toId: "skills_pl_5", position: 1 },
  { name: "Banded Half-Lay Planche", metric: "5s hold", fromId: "skills_pl_4", toId: "skills_pl_5", position: 2 },
  // Half-Lay Planche -> Straddle Planche
  { name: "Straddle PL Lean (feet down)", metric: "5s hold", fromId: "skills_pl_5", toId: "skills_pl_6", position: 1 },
  { name: "Banded Straddle Planche", metric: "5s hold", fromId: "skills_pl_5", toId: "skills_pl_6", position: 2 },
  // Straddle Planche -> Full Planche
  { name: "Straddle to Close Planche", metric: "5s hold", fromId: "skills_pl_6", toId: "skills_pl_7", position: 1 },
  { name: "Banded Full Planche", metric: "5s hold", fromId: "skills_pl_6", toId: "skills_pl_7", position: 2 },

  // ============================================================
  // SKILLS - Front Lever
  // ============================================================
  // Tuck Front Lever -> Adv. Tuck Front Lever
  { name: "Tuck FL Pulls", metric: "1 rep", fromId: "skills_fl_1", toId: "skills_fl_2", position: 1 },
  { name: "Open Tuck FL Hold", metric: "5s hold", fromId: "skills_fl_1", toId: "skills_fl_2", position: 2 },
  // Adv. Tuck Front Lever -> Half-Lay Front Lever
  { name: "One-Leg FL Extend", metric: "5s hold", fromId: "skills_fl_2", toId: "skills_fl_3", position: 1 },
  { name: "Banded Half-Lay FL", metric: "5s hold", fromId: "skills_fl_2", toId: "skills_fl_3", position: 2 },
  // Half-Lay Front Lever -> Straddle Front Lever
  { name: "Half-Lay FL Pulls", metric: "1 rep", fromId: "skills_fl_3", toId: "skills_fl_4", position: 1 },
  { name: "Straddle FL Eccentric 5s", metric: "1 rep", fromId: "skills_fl_3", toId: "skills_fl_4", position: 2 },
  // Straddle Front Lever -> Full Front Lever
  { name: "Straddle FL Pulls", metric: "1 rep", fromId: "skills_fl_4", toId: "skills_fl_5", position: 1 },
  { name: "Full FL Eccentric 5s", metric: "1 rep", fromId: "skills_fl_4", toId: "skills_fl_5", position: 2 },

  // ============================================================
  // SKILLS - Human Flag
  // ============================================================
  // Vertical Flag -> Tuck Flag
  { name: "Flag Kick to Vertical", metric: "1 rep", fromId: "skills_hf_1", toId: "skills_hf_2", position: 1 },
  { name: "Tuck Flag Eccentric 5s", metric: "1 rep", fromId: "skills_hf_1", toId: "skills_hf_2", position: 2 },
  // Tuck Flag -> Straddle Flag
  { name: "One-Leg Flag Extend", metric: "5s hold", fromId: "skills_hf_2", toId: "skills_hf_3", position: 1 },
  { name: "Straddle Flag Eccentric 5s", metric: "1 rep", fromId: "skills_hf_2", toId: "skills_hf_3", position: 2 },
  // Straddle Flag -> Full Human Flag
  { name: "Straddle Flag Close Legs", metric: "5s hold", fromId: "skills_hf_3", toId: "skills_hf_4", position: 1 },
  { name: "Full Flag Eccentric 5s", metric: "1 rep", fromId: "skills_hf_3", toId: "skills_hf_4", position: 2 },

  // ============================================================
  // RINGS
  // ============================================================
  // Ring Support Hold -> Ring Dips RTO
  { name: "Rings Turned-Out Hold", metric: "10s hold", fromId: "rings_1", toId: "rings_2", position: 1 },
  { name: "Eccentric Ring Dip RTO", metric: "1 rep", fromId: "rings_1", toId: "rings_2", position: 2 },
  // Ring Dips RTO -> Back Lever
  { name: "German Hang on Rings", metric: "10s hold", fromId: "rings_2", toId: "rings_3", position: 1 },
  { name: "Tuck Back Lever Hold", metric: "10s hold", fromId: "rings_2", toId: "rings_3", position: 2 },
  // Back Lever -> Ring Muscle-up
  { name: "High Pull to Chest", metric: "1 rep", fromId: "rings_3", toId: "rings_4", position: 1 },
  { name: "False Grip Hang", metric: "10s hold", fromId: "rings_3", toId: "rings_4", position: 2 },
  // Ring Muscle-up -> Cross Pull
  { name: "Wide Ring Pull", metric: "1 rep", fromId: "rings_4", toId: "rings_5", position: 1 },
  { name: "Cross Pull Eccentric 5s", metric: "1 rep", fromId: "rings_4", toId: "rings_5", position: 2 },
  // Cross Pull -> Iron Cross
  { name: "Band-Assist Iron Cross", metric: "5s hold", fromId: "rings_5", toId: "rings_6", position: 1 },
  { name: "Iron Cross Eccentric 5s", metric: "1 rep", fromId: "rings_5", toId: "rings_6", position: 2 },
  // Iron Cross -> Maltese
  { name: "Iron Cross to Lean Fwd", metric: "1 rep", fromId: "rings_6", toId: "rings_7", position: 1 },
  { name: "Banded Maltese Hold", metric: "5s hold", fromId: "rings_6", toId: "rings_7", position: 2 },
  // Maltese -> Victorian Cross
  { name: "Maltese to Lean Back", metric: "1 rep", fromId: "rings_7", toId: "rings_8", position: 1 },
  { name: "Banded Victorian Hold", metric: "5s hold", fromId: "rings_7", toId: "rings_8", position: 2 },

  // ============================================================
  // BREAKDANCE - Toprock
  // ============================================================
  // Bounce / Rock -> Indian Step
  { name: "Bounce with Arm Swing", metric: "1 rep", fromId: "bboy_tr_1", toId: "bboy_tr_2", position: 1 },
  { name: "Slow Indian Step Drill", metric: "1 rep", fromId: "bboy_tr_1", toId: "bboy_tr_2", position: 2 },
  // Indian Step -> Cross Step
  { name: "Indian Step with Arms", metric: "1 rep", fromId: "bboy_tr_2", toId: "bboy_tr_3", position: 1 },
  { name: "Cross Step Walk-Through", metric: "1 rep", fromId: "bboy_tr_2", toId: "bboy_tr_3", position: 2 },
  // Cross Step -> Kick Step Out/Over
  { name: "Cross Step with Kick", metric: "1 rep", fromId: "bboy_tr_3", toId: "bboy_tr_4", position: 1 },
  { name: "Kick Over Drill (slow)", metric: "1 rep", fromId: "bboy_tr_3", toId: "bboy_tr_4", position: 2 },
  // Kick Step Out/Over -> Salsa/Power Step
  { name: "Salsa Step Isolation", metric: "1 rep", fromId: "bboy_tr_4", toId: "bboy_tr_5", position: 1 },
  { name: "Power Step Basic Rhythm", metric: "1 rep", fromId: "bboy_tr_4", toId: "bboy_tr_5", position: 2 },
  // Salsa/Power Step -> Float/Glide Steps
  { name: "Moon Walk Drill", metric: "1 rep", fromId: "bboy_tr_5", toId: "bboy_tr_6", position: 1 },
  { name: "Glide Step Isolation", metric: "1 rep", fromId: "bboy_tr_5", toId: "bboy_tr_6", position: 2 },
  // Float/Glide Steps -> Advanced Toprock Combos
  { name: "3-Move Toprock Combo", metric: "1 rep", fromId: "bboy_tr_6", toId: "bboy_tr_7", position: 1 },
  { name: "Freestyle Toprock 8-Count", metric: "1 rep", fromId: "bboy_tr_6", toId: "bboy_tr_7", position: 2 },

  // ============================================================
  // BREAKDANCE - Footwork
  // ============================================================
  // Coffee Grinder -> 6-Step
  { name: "Squat Leg Sweep", metric: "1 rep", fromId: "bboy_fw_1", toId: "bboy_fw_2", position: 1 },
  { name: "6-Step Walk-Through", metric: "1 rep", fromId: "bboy_fw_1", toId: "bboy_fw_2", position: 2 },
  // 6-Step -> 3-Step
  { name: "6-Step Fast Drill", metric: "1 rep", fromId: "bboy_fw_2", toId: "bboy_fw_3", position: 1 },
  { name: "3-Step Walk-Through", metric: "1 rep", fromId: "bboy_fw_2", toId: "bboy_fw_3", position: 2 },
  // 3-Step -> CCs / Zulu Spins
  { name: "Seated Spin Drill", metric: "1 rep", fromId: "bboy_fw_3", toId: "bboy_fw_4", position: 1 },
  { name: "CC Kick Pattern Slow", metric: "1 rep", fromId: "bboy_fw_3", toId: "bboy_fw_4", position: 2 },
  // CCs / Zulu Spins -> Kick-outs / Switches
  { name: "Zulu to Kick-out Entry", metric: "1 rep", fromId: "bboy_fw_4", toId: "bboy_fw_5", position: 1 },
  { name: "Switch Kick Drill", metric: "1 rep", fromId: "bboy_fw_4", toId: "bboy_fw_5", position: 2 },
  // Kick-outs / Switches -> Threading / Hooks
  { name: "Leg Thread Under Drill", metric: "1 rep", fromId: "bboy_fw_5", toId: "bboy_fw_6", position: 1 },
  { name: "Hook Step Isolation", metric: "1 rep", fromId: "bboy_fw_5", toId: "bboy_fw_6", position: 2 },
  // Threading / Hooks -> 1-Step / No-Hand Footwork
  { name: "1-Step Pattern Drill", metric: "1 rep", fromId: "bboy_fw_6", toId: "bboy_fw_7", position: 1 },
  { name: "No-Hand Sweep Drill", metric: "1 rep", fromId: "bboy_fw_6", toId: "bboy_fw_7", position: 2 },
  // 1-Step / No-Hand Footwork -> Advanced Footwork Combos
  { name: "4-Move Footwork Combo", metric: "1 rep", fromId: "bboy_fw_7", toId: "bboy_fw_8", position: 1 },
  { name: "Freestyle Footwork 8-Count", metric: "1 rep", fromId: "bboy_fw_7", toId: "bboy_fw_8", position: 2 },

  // ============================================================
  // BREAKDANCE - Freezes
  // ============================================================
  // Baby Freeze -> Chair Freeze
  { name: "Headstand Tripod Hold", metric: "10s hold", fromId: "bboy_fr_1", toId: "bboy_fr_2", position: 1 },
  { name: "Chair Entry Drill", metric: "1 rep", fromId: "bboy_fr_1", toId: "bboy_fr_2", position: 2 },
  // Chair Freeze -> Turtle Freeze
  { name: "Elbow Stab Balance", metric: "5s hold", fromId: "bboy_fr_2", toId: "bboy_fr_3", position: 1 },
  { name: "Turtle Float Attempt", metric: "5s hold", fromId: "bboy_fr_2", toId: "bboy_fr_3", position: 2 },
  // Turtle Freeze -> Elbow Freeze
  { name: "One-Arm Turtle Lean", metric: "5s hold", fromId: "bboy_fr_3", toId: "bboy_fr_4", position: 1 },
  { name: "Elbow Stab Kick-up", metric: "1 rep", fromId: "bboy_fr_3", toId: "bboy_fr_4", position: 2 },
  // Elbow Freeze -> Headstand Freeze
  { name: "Tripod to Headstand", metric: "1 rep", fromId: "bboy_fr_4", toId: "bboy_fr_5", position: 1 },
  { name: "Headstand Kick-up Drill", metric: "1 rep", fromId: "bboy_fr_4", toId: "bboy_fr_5", position: 2 },
  // Headstand Freeze -> Airchair
  { name: "Side Stab Entry Drill", metric: "1 rep", fromId: "bboy_fr_5", toId: "bboy_fr_6", position: 1 },
  { name: "Airchair Lean Hold", metric: "5s hold", fromId: "bboy_fr_5", toId: "bboy_fr_6", position: 2 },
  // Airchair -> Hollowback Freeze
  { name: "Airchair Back Arch", metric: "5s hold", fromId: "bboy_fr_6", toId: "bboy_fr_7", position: 1 },
  { name: "Hollowback Entry Drill", metric: "1 rep", fromId: "bboy_fr_6", toId: "bboy_fr_7", position: 2 },
  // Hollowback Freeze -> One-Hand Freeze (Nike)
  { name: "One-Arm Freeze Lean", metric: "5s hold", fromId: "bboy_fr_7", toId: "bboy_fr_8", position: 1 },
  { name: "Nike Entry Kick-up", metric: "1 rep", fromId: "bboy_fr_7", toId: "bboy_fr_8", position: 2 },
  // One-Hand Freeze (Nike) -> Airchair Spin
  { name: "Airchair Pivot Drill", metric: "1 rep", fromId: "bboy_fr_8", toId: "bboy_fr_9", position: 1 },
  { name: "Chair Spin Half Turn", metric: "1 rep", fromId: "bboy_fr_8", toId: "bboy_fr_9", position: 2 },
  // Airchair Spin -> Flag Freeze
  { name: "Side Flag Entry Drill", metric: "1 rep", fromId: "bboy_fr_9", toId: "bboy_fr_10", position: 1 },
  { name: "Flag Freeze Kick-up", metric: "5s hold", fromId: "bboy_fr_9", toId: "bboy_fr_10", position: 2 },

  // ============================================================
  // BREAKDANCE - Power Moves
  // ============================================================
  // Backspin -> Shoulder Roll
  { name: "Backspin to Shoulder", metric: "1 rep", fromId: "bboy_pm_1", toId: "bboy_pm_2", position: 1 },
  { name: "Shoulder Roll Entry", metric: "1 rep", fromId: "bboy_pm_1", toId: "bboy_pm_2", position: 2 },
  // Shoulder Roll -> Swipe
  { name: "Bridge Kick-Over Drill", metric: "1 rep", fromId: "bboy_pm_2", toId: "bboy_pm_3", position: 1 },
  { name: "Swipe Half Rotation", metric: "1 rep", fromId: "bboy_pm_2", toId: "bboy_pm_3", position: 2 },
  // Swipe -> Windmill
  { name: "Windmill Stall Position", metric: "5s hold", fromId: "bboy_pm_3", toId: "bboy_pm_4", position: 1 },
  { name: "Windmill Collapse Drill", metric: "1 rep", fromId: "bboy_pm_3", toId: "bboy_pm_4", position: 2 },
  // Windmill -> Halo
  { name: "Headslide Drill", metric: "1 rep", fromId: "bboy_pm_4", toId: "bboy_pm_5", position: 1 },
  { name: "Halo Half Turn", metric: "1 rep", fromId: "bboy_pm_4", toId: "bboy_pm_5", position: 2 },
  // Halo -> Headspin
  { name: "Headspin Tripod Tap", metric: "1 rep", fromId: "bboy_pm_5", toId: "bboy_pm_6", position: 1 },
  { name: "Headspin Hand Push", metric: "1 rep", fromId: "bboy_pm_5", toId: "bboy_pm_6", position: 2 },
  // Windmill -> Flare (special branch)
  { name: "Wide Leg Windmill", metric: "1 rep", fromId: "bboy_pm_4", toId: "bboy_pm_7", position: 1 },
  { name: "V-Kick Flare Entry", metric: "1 rep", fromId: "bboy_pm_4", toId: "bboy_pm_7", position: 2 },
  // Headspin -> 1990 (One-Hand Spin)
  { name: "One-Hand Headspin Tap", metric: "1 rep", fromId: "bboy_pm_6", toId: "bboy_pm_8", position: 1 },
  { name: "1990 Kick-up Drill", metric: "1 rep", fromId: "bboy_pm_6", toId: "bboy_pm_8", position: 2 },
  // Flare -> Airflare
  { name: "Flare to Handstand", metric: "1 rep", fromId: "bboy_pm_7", toId: "bboy_pm_9", position: 1 },
  { name: "Airflare Kick Drill", metric: "1 rep", fromId: "bboy_pm_7", toId: "bboy_pm_9", position: 2 },
  // 1990 -> Airflare
  { name: "1990 to Freeze Exit", metric: "1 rep", fromId: "bboy_pm_8", toId: "bboy_pm_9", position: 1 },
  { name: "Airflare Entry from 1990", metric: "1 rep", fromId: "bboy_pm_8", toId: "bboy_pm_9", position: 2 },
  // Airflare -> Airflare to 1990
  { name: "Airflare Continuous x2", metric: "1 rep", fromId: "bboy_pm_9", toId: "bboy_pm_10", position: 1 },
  { name: "Airflare 1990 Catch", metric: "1 rep", fromId: "bboy_pm_9", toId: "bboy_pm_10", position: 2 },

  // ============================================================
  // FLEXIBILITY - Shoulders
  // ============================================================
  // Wall Slide -> Puppy Pose
  { name: "Wall Angel", metric: "1 rep", fromId: "flex_sh_1", toId: "flex_sh_2", position: 1 },
  { name: "Kneeling Shoulder Stretch", metric: "10s hold", fromId: "flex_sh_1", toId: "flex_sh_2", position: 2 },
  // Puppy Pose -> Passive Hang 60s
  { name: "Active Hang 15s", metric: "15s hold", fromId: "flex_sh_2", toId: "flex_sh_3", position: 1 },
  { name: "Dead Hang 30s", metric: "1 rep", fromId: "flex_sh_2", toId: "flex_sh_3", position: 2 },
  // Passive Hang 60s -> Shoulder Dislocates
  { name: "Band Pull-Aparts", metric: "1 rep", fromId: "flex_sh_3", toId: "flex_sh_4", position: 1 },
  { name: "Wide Grip Dislocates", metric: "1 rep", fromId: "flex_sh_3", toId: "flex_sh_4", position: 2 },
  // Shoulder Dislocates -> German Hang Hold
  { name: "Skin the Cat (partial)", metric: "1 rep", fromId: "flex_sh_4", toId: "flex_sh_5", position: 1 },
  { name: "Assisted German Hang", metric: "5s hold", fromId: "flex_sh_4", toId: "flex_sh_5", position: 2 },
  // German Hang Hold -> Skin the Cat
  { name: "German Hang to Tuck", metric: "1 rep", fromId: "flex_sh_5", toId: "flex_sh_6", position: 1 },
  { name: "Slow Skin the Cat Entry", metric: "1 rep", fromId: "flex_sh_5", toId: "flex_sh_6", position: 2 },
  // Skin the Cat -> Bridge Straight Arms
  { name: "Floor Bridge Hold", metric: "10s hold", fromId: "flex_sh_6", toId: "flex_sh_7", position: 1 },
  { name: "Wall Walk to Bridge", metric: "1 rep", fromId: "flex_sh_6", toId: "flex_sh_7", position: 2 },
  // Bridge Straight Arms -> Full Back Bridge (open)
  { name: "Bridge Shoulder Pushes", metric: "1 rep", fromId: "flex_sh_7", toId: "flex_sh_8", position: 1 },
  { name: "Open Shoulder Bridge Hold", metric: "10s hold", fromId: "flex_sh_7", toId: "flex_sh_8", position: 2 },

  // ============================================================
  // FLEXIBILITY - Wrists
  // ============================================================
  // Wrist Circles -> Prayer Stretch
  { name: "Wrist Flexion Hold", metric: "10s hold", fromId: "flex_wr_1", toId: "flex_wr_2", position: 1 },
  { name: "Prayer Stretch Mild", metric: "10s hold", fromId: "flex_wr_1", toId: "flex_wr_2", position: 2 },
  // Prayer Stretch -> Floor Wrist Stretches
  { name: "Kneeling Wrist Rocks", metric: "1 rep", fromId: "flex_wr_2", toId: "flex_wr_3", position: 1 },
  { name: "Fingers-Back Floor Hold", metric: "10s hold", fromId: "flex_wr_2", toId: "flex_wr_3", position: 2 },
  // Floor Wrist Stretches -> Reverse Wrist Stretch
  { name: "Back-of-Hand Push-up", metric: "1 rep", fromId: "flex_wr_3", toId: "flex_wr_4", position: 1 },
  { name: "Reverse Wrist Lean", metric: "10s hold", fromId: "flex_wr_3", toId: "flex_wr_4", position: 2 },
  // Reverse Wrist Stretch -> Wrist PU Position Hold
  { name: "Wrist PU Position Lean", metric: "5s hold", fromId: "flex_wr_4", toId: "flex_wr_5", position: 1 },
  { name: "Loaded Wrist Extension", metric: "10s hold", fromId: "flex_wr_4", toId: "flex_wr_5", position: 2 },
  // Wrist PU Position Hold -> Planche-Lean Wrist Hold
  { name: "Light Planche Wrist Lean", metric: "5s hold", fromId: "flex_wr_5", toId: "flex_wr_6", position: 1 },
  { name: "Wrist Rotation Under Load", metric: "1 rep", fromId: "flex_wr_5", toId: "flex_wr_6", position: 2 },
  // Planche-Lean Wrist Hold -> HS Wrist Comfort
  { name: "Wall HS Wrist Shifts", metric: "1 rep", fromId: "flex_wr_6", toId: "flex_wr_7", position: 1 },
  { name: "HS Wrist Balance Drill", metric: "5s hold", fromId: "flex_wr_6", toId: "flex_wr_7", position: 2 },

  // ============================================================
  // FLEXIBILITY - Pike
  // ============================================================
  // Standing Forward Fold -> Seated Pike (past toes)
  { name: "Seated Pike Hold (mild)", metric: "15s hold", fromId: "flex_pk_1", toId: "flex_pk_2", position: 1 },
  { name: "Seated Toe Touch Reach", metric: "1 rep", fromId: "flex_pk_1", toId: "flex_pk_2", position: 2 },
  // Seated Pike (past toes) -> Standing Pike (palms flat)
  { name: "Ragdoll Hang", metric: "15s hold", fromId: "flex_pk_2", toId: "flex_pk_3", position: 1 },
  { name: "Pike Pulse Stretch", metric: "1 rep", fromId: "flex_pk_2", toId: "flex_pk_3", position: 2 },
  // Standing Pike (palms flat) -> Active Compression
  { name: "Seated Pike Pull-In", metric: "1 rep", fromId: "flex_pk_3", toId: "flex_pk_4", position: 1 },
  { name: "Standing Leg Lift Hold", metric: "5s hold", fromId: "flex_pk_3", toId: "flex_pk_4", position: 2 },
  // Active Compression -> Chest-to-Knees Pike
  { name: "PNF Pike Stretch", metric: "1 rep", fromId: "flex_pk_4", toId: "flex_pk_5", position: 1 },
  { name: "Nose-to-Knees Attempt", metric: "5s hold", fromId: "flex_pk_4", toId: "flex_pk_5", position: 2 },
  // Chest-to-Knees Pike -> Active Pike Compression
  { name: "Active Pike Leg Pulses", metric: "1 rep", fromId: "flex_pk_5", toId: "flex_pk_6", position: 1 },
  { name: "Pike Compression Hold", metric: "5s hold", fromId: "flex_pk_5", toId: "flex_pk_6", position: 2 },
  // Active Pike Compression -> Full Compression
  { name: "Compression Lift-Off Drill", metric: "1 rep", fromId: "flex_pk_6", toId: "flex_pk_7", position: 1 },
  { name: "V-Sit Compression Hold", metric: "5s hold", fromId: "flex_pk_6", toId: "flex_pk_7", position: 2 },

  // ============================================================
  // FLEXIBILITY - Hips
  // ============================================================
  // Butterfly Stretch -> Deep Squat Hold 60s
  { name: "Goblet Squat Hold", metric: "15s hold", fromId: "flex_hi_1", toId: "flex_hi_2", position: 1 },
  { name: "Assisted Deep Squat", metric: "15s hold", fromId: "flex_hi_1", toId: "flex_hi_2", position: 2 },
  // Deep Squat Hold 60s -> Frog Stretch
  { name: "Wide Knee Squat Hold", metric: "15s hold", fromId: "flex_hi_2", toId: "flex_hi_3", position: 1 },
  { name: "Kneeling Groin Stretch", metric: "15s hold", fromId: "flex_hi_2", toId: "flex_hi_3", position: 2 },
  // Frog Stretch -> Seated Straddle (halfway)
  { name: "Seated Straddle Mild", metric: "15s hold", fromId: "flex_hi_3", toId: "flex_hi_4", position: 1 },
  { name: "Standing Wide Fold", metric: "15s hold", fromId: "flex_hi_3", toId: "flex_hi_4", position: 2 },
  // Seated Straddle (halfway) -> Pancake (chest to floor)
  { name: "PNF Straddle Stretch", metric: "1 rep", fromId: "flex_hi_4", toId: "flex_hi_5", position: 1 },
  { name: "Elevated Pancake Attempt", metric: "15s hold", fromId: "flex_hi_4", toId: "flex_hi_5", position: 2 },
  // Pancake (chest to floor) -> Elevated Pancake
  { name: "Pancake on Yoga Block", metric: "15s hold", fromId: "flex_hi_5", toId: "flex_hi_6", position: 1 },
  { name: "Active Pancake Compress", metric: "1 rep", fromId: "flex_hi_5", toId: "flex_hi_6", position: 2 },
  // Elevated Pancake -> Half Middle Split 150+
  { name: "Wall Middle Split Slide", metric: "1 rep", fromId: "flex_hi_6", toId: "flex_hi_7", position: 1 },
  { name: "Progressive Split Slide", metric: "1 rep", fromId: "flex_hi_6", toId: "flex_hi_7", position: 2 },
  // Half Middle Split 150+ -> Full Middle Split
  { name: "PNF Middle Split", metric: "1 rep", fromId: "flex_hi_7", toId: "flex_hi_8", position: 1 },
  { name: "Gravity Split (wall assist)", metric: "1 rep", fromId: "flex_hi_7", toId: "flex_hi_8", position: 2 },

  // ============================================================
  // FLEXIBILITY - Spine
  // ============================================================
  // Cat-Cow -> Cobra Stretch
  { name: "Prone Press-Up (low)", metric: "1 rep", fromId: "flex_sp_1", toId: "flex_sp_2", position: 1 },
  { name: "Sphinx Pose Hold", metric: "10s hold", fromId: "flex_sp_1", toId: "flex_sp_2", position: 2 },
  // Cobra Stretch -> Camel Pose
  { name: "Kneeling Back Bend", metric: "1 rep", fromId: "flex_sp_2", toId: "flex_sp_3", position: 1 },
  { name: "Camel Hands on Low Back", metric: "10s hold", fromId: "flex_sp_2", toId: "flex_sp_3", position: 2 },
  // Camel Pose -> Wall Bridge
  { name: "Supine Hip Bridge", metric: "1 rep", fromId: "flex_sp_3", toId: "flex_sp_4", position: 1 },
  { name: "Wall Walk-Down (partial)", metric: "1 rep", fromId: "flex_sp_3", toId: "flex_sp_4", position: 2 },
  // Wall Bridge -> Full Back Bridge
  { name: "Bridge from Floor Attempt", metric: "1 rep", fromId: "flex_sp_4", toId: "flex_sp_5", position: 1 },
  { name: "Elevated Bridge (hands up)", metric: "10s hold", fromId: "flex_sp_4", toId: "flex_sp_5", position: 2 },
  // Full Back Bridge -> Bridge Push-up
  { name: "Bridge Rock Drill", metric: "1 rep", fromId: "flex_sp_5", toId: "flex_sp_6", position: 1 },
  { name: "Eccentric Bridge Lower 5s", metric: "1 rep", fromId: "flex_sp_5", toId: "flex_sp_6", position: 2 },
  // Bridge Push-up -> Scorpion Stretch
  { name: "Lying Spinal Twist", metric: "10s hold", fromId: "flex_sp_6", toId: "flex_sp_7", position: 1 },
  { name: "Prone Scorpion Kick", metric: "1 rep", fromId: "flex_sp_6", toId: "flex_sp_7", position: 2 },
  // Scorpion Stretch -> Chest Stand
  { name: "Bridge Feet Walk to Head", metric: "1 rep", fromId: "flex_sp_7", toId: "flex_sp_8", position: 1 },
  { name: "Wall-Assist Chest Stand", metric: "5s hold", fromId: "flex_sp_7", toId: "flex_sp_8", position: 2 },

  // ============================================================
  // FLEXIBILITY - Front Split
  // ============================================================
  // Half-Kneeling Hip Flexor -> Low Lunge
  { name: "Deep Lunge Pulse", metric: "1 rep", fromId: "flex_fs_1", toId: "flex_fs_2", position: 1 },
  { name: "Couch Stretch (mild)", metric: "10s hold", fromId: "flex_fs_1", toId: "flex_fs_2", position: 2 },
  // Low Lunge -> Elevated Pigeon Pose
  { name: "Floor Pigeon Pose", metric: "15s hold", fromId: "flex_fs_2", toId: "flex_fs_3", position: 1 },
  { name: "90/90 Hip Stretch", metric: "15s hold", fromId: "flex_fs_2", toId: "flex_fs_3", position: 2 },
  // Elevated Pigeon Pose -> Half Split
  { name: "Kneeling Hamstring Stretch", metric: "15s hold", fromId: "flex_fs_3", toId: "flex_fs_4", position: 1 },
  { name: "Low Lunge to Half Split", metric: "1 rep", fromId: "flex_fs_3", toId: "flex_fs_4", position: 2 },
  // Half Split -> Supported Front Split
  { name: "PNF Hamstring Stretch", metric: "1 rep", fromId: "flex_fs_4", toId: "flex_fs_5", position: 1 },
  { name: "Split Slide with Blocks", metric: "1 rep", fromId: "flex_fs_4", toId: "flex_fs_5", position: 2 },
  // Supported Front Split -> Full Front Split
  { name: "Low Block Split Hold", metric: "15s hold", fromId: "flex_fs_5", toId: "flex_fs_6", position: 1 },
  { name: "PNF Front Split", metric: "1 rep", fromId: "flex_fs_5", toId: "flex_fs_6", position: 2 },
  // Full Front Split -> Oversplit
  { name: "Split with Front on Block", metric: "15s hold", fromId: "flex_fs_6", toId: "flex_fs_7", position: 1 },
  { name: "PNF Oversplit Stretch", metric: "1 rep", fromId: "flex_fs_6", toId: "flex_fs_7", position: 2 },
];

export function getCheckpointsForEdge(fromId: string, toId: string): Checkpoint[] {
  return checkpoints.filter(c => c.fromId === fromId && c.toId === toId).sort((a, b) => a.position - b.position);
}

export function getYouTubeSearchUrl(name: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " tutorial calisthenics")}`;
}
