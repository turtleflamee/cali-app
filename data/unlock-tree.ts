// The unlock tree defines which exercises become visible when you complete an exercise.
// Max 3 unlocks per exercise. This creates a branching web that reveals gradually.
// Exercises not listed here unlock their next exercise in the sub-path chain automatically.

export const unlockTree: Record<string, string[]> = {
  // === GATEWAYS (from START) — always visible ===
  // START unlocks the 3 gateways
  __start__: ["flex_gateway", "core_pk_1", "bboy_fr_1"],

  // === FLEXIBILITY BRANCH ===
  // Toe Touch → 3 measurable flexibility goals
  flex_gateway: ["flex_pk_3", "flex_hi_2", "flex_sh_4"],
  // Standing Pike Palms Flat → deeper pike + splits entry
  flex_pk_3: ["flex_pk_4", "flex_fs_1"],
  // Deep Squat Hold → frog stretch + straddle
  flex_hi_2: ["flex_hi_3", "flex_sp_3"],
  // Shoulder Dislocates → german hang + wrist work
  flex_sh_4: ["flex_sh_5", "flex_wr_3"],
  // German Hang → skin the cat + back lever prep
  flex_sh_5: ["flex_sh_6"],
  // Skin the Cat → bridge work
  flex_sh_6: ["flex_sh_7", "flex_sp_4"],
  // Frog Stretch → pancake + middle split path
  flex_hi_3: ["flex_hi_4"],
  flex_hi_4: ["flex_hi_5"],
  flex_hi_5: ["flex_hi_6", "flex_pk_5"],
  flex_hi_6: ["flex_hi_7"],
  flex_hi_7: ["flex_hi_8"],
  // Pike progression
  flex_pk_4: ["flex_pk_5"],
  flex_pk_5: ["flex_pk_6"],
  flex_pk_6: ["flex_pk_7"],
  // Front split path
  flex_fs_1: ["flex_fs_2"],
  flex_fs_2: ["flex_fs_3"],
  flex_fs_3: ["flex_fs_4"],
  flex_fs_4: ["flex_fs_5"],
  flex_fs_5: ["flex_fs_6"],
  flex_fs_6: ["flex_fs_7"],
  // Spine
  flex_sp_3: ["flex_sp_4"],
  flex_sp_4: ["flex_sp_5"],
  flex_sp_5: ["flex_sp_6"],
  flex_sp_6: ["flex_sp_7"],
  flex_sp_7: ["flex_sp_8"],
  // Bridge
  flex_sh_7: ["flex_sh_8"],
  // Wrists
  flex_wr_3: ["flex_wr_4"],
  flex_wr_4: ["flex_wr_5"],
  flex_wr_5: ["flex_wr_6"],
  flex_wr_6: ["flex_wr_7"],

  // === STRENGTH BRANCH ===
  // Forearm Plank → Push-up, Dead Hang, Squat
  core_pk_1: ["push_pu_3", "pull_pu_1", "legs_sq_1"],
  // Push-up → Diamond Push-up, Bench Dip, Pike Push-up (also unlocks deeper core)
  push_pu_3: ["push_pu_4", "push_di_1", "push_sp_1"],
  // Diamond Push-up → Archer Push-up + Frog Stand (planche entry)
  push_pu_4: ["push_pu_5", "skills_pl_1"],
  push_pu_5: ["push_pu_6"],
  push_pu_6: ["push_pu_7"],
  // Dips chain
  push_di_1: ["push_di_2"],
  push_di_2: ["push_di_3", "skills_hf_1"],  // Dips unlock Human Flag path
  push_di_3: ["push_di_4"],
  push_di_4: ["push_di_5"],
  push_di_5: ["push_di_6"],
  // Shoulder press chain
  push_sp_1: ["push_sp_2"],
  push_sp_2: ["push_sp_3"],
  push_sp_3: ["push_sp_4"],
  push_sp_4: ["push_sp_5", "push_sp_6"],
  push_sp_5: ["push_sp_7"],
  // Dead Hang → Negative Pull-up, Incline Row, Core progression
  pull_pu_1: ["pull_pu_2", "pull_ro_1", "core_pk_2"],
  // Pull-up chain
  pull_pu_2: ["pull_pu_3"],
  pull_pu_3: ["pull_pu_4", "skills_fl_1", "pull_tr_1"],  // Pull-up unlocks Front Lever + Explosive Pull-ups
  pull_pu_4: ["pull_pu_5"],
  pull_pu_5: ["pull_pu_6"],
  pull_pu_6: ["pull_pu_7"],
  pull_pu_7: ["pull_pu_8"],
  pull_pu_8: ["pull_pu_9"],
  // Row chain
  pull_ro_1: ["pull_ro_2"],
  pull_ro_2: ["pull_ro_3"],
  pull_ro_3: ["pull_ro_4"],
  // Transition chain
  pull_tr_1: ["pull_tr_2"],
  pull_tr_2: ["pull_tr_3"],
  pull_tr_3: ["pull_tr_4"],
  // Core continues from plank gateway
  // Plank → RKC Plank + Lying Leg Raise + Tuck L-Sit
  core_pk_2: ["core_pk_3", "core_lr_1", "core_sh_1"],
  // Leg raises
  core_lr_1: ["core_lr_2"],
  core_lr_2: ["core_lr_3"],
  core_lr_3: ["core_lr_4"],
  core_lr_4: ["core_lr_5"],
  core_lr_5: ["core_lr_6"],
  core_lr_6: ["core_lr_7"],
  // Plank progression (continues from RKC Plank which is unlocked by Dead Hang)
  core_pk_3: ["core_pk_4"],
  core_pk_4: ["core_pk_5"],
  core_pk_5: ["core_pk_6"],
  // Static holds
  core_sh_1: ["core_sh_2"],
  core_sh_2: ["core_sh_3"],
  core_sh_3: ["core_sh_4"],
  core_sh_4: ["core_sh_5"],
  core_sh_5: ["core_sh_6"],
  // Squat → Bulgarian Split, Jump Squat, Bodyweight RDL
  legs_sq_1: ["legs_sq_2", "legs_sq_3", "legs_hi_1"],
  legs_sq_2: ["legs_sq_4"],
  legs_sq_3: ["legs_sq_4"],
  legs_sq_4: ["legs_sq_5"],
  legs_sq_5: ["legs_sq_6"],
  legs_sq_6: ["legs_sq_7"],
  legs_sq_7: ["legs_sq_8"],
  // Hinge chain
  legs_hi_1: ["legs_hi_2"],
  legs_hi_2: ["legs_hi_3"],
  legs_hi_3: ["legs_hi_4"],

  // === SPECIAL BRANCH ===
  // Baby Freeze → Backspin, Chair Freeze, Ring Support
  bboy_fr_1: ["bboy_pm_1", "bboy_fr_2", "rings_1"],
  // Backspin → Shoulder Roll, Toprock entry, Footwork entry
  bboy_pm_1: ["bboy_pm_2", "bboy_tr_1", "bboy_fw_1"],
  bboy_pm_2: ["bboy_pm_3"],
  bboy_pm_3: ["bboy_pm_4"],
  bboy_pm_4: ["bboy_pm_5", "bboy_pm_7"],
  bboy_pm_5: ["bboy_pm_6"],
  bboy_pm_6: ["bboy_pm_8"],
  bboy_pm_7: ["bboy_pm_9"],
  bboy_pm_8: ["bboy_pm_9"],
  bboy_pm_9: ["bboy_pm_10"],
  // Freeze chain
  bboy_fr_2: ["bboy_fr_3"],
  bboy_fr_3: ["bboy_fr_4"],
  bboy_fr_4: ["bboy_fr_5"],
  bboy_fr_5: ["bboy_fr_6"],
  bboy_fr_6: ["bboy_fr_7"],
  bboy_fr_7: ["bboy_fr_8"],
  bboy_fr_8: ["bboy_fr_9"],
  bboy_fr_9: ["bboy_fr_10"],
  // Toprock chain
  bboy_tr_1: ["bboy_tr_2"],
  bboy_tr_2: ["bboy_tr_3"],
  bboy_tr_3: ["bboy_tr_4"],
  bboy_tr_4: ["bboy_tr_5"],
  bboy_tr_5: ["bboy_tr_6"],
  bboy_tr_6: ["bboy_tr_7"],
  // Footwork chain
  bboy_fw_1: ["bboy_fw_2"],
  bboy_fw_2: ["bboy_fw_3"],
  bboy_fw_3: ["bboy_fw_4"],
  bboy_fw_4: ["bboy_fw_5"],
  bboy_fw_5: ["bboy_fw_6"],
  bboy_fw_6: ["bboy_fw_7"],
  bboy_fw_7: ["bboy_fw_8"],
  // Rings chain
  rings_1: ["rings_2"],
  rings_2: ["rings_3"],
  rings_3: ["rings_4"],
  rings_4: ["rings_5"],
  rings_5: ["rings_6"],
  rings_6: ["rings_7"],
  rings_7: ["rings_8"],
  // Skills — planche
  skills_pl_1: ["skills_pl_2"],
  skills_pl_2: ["skills_pl_3"],
  skills_pl_3: ["skills_pl_4"],
  skills_pl_4: ["skills_pl_5"],
  skills_pl_5: ["skills_pl_6"],
  skills_pl_6: ["skills_pl_7"],
  // Skills — front lever (unlocked from Pull-up)
  skills_fl_1: ["skills_fl_2"],
  skills_fl_2: ["skills_fl_3"],
  skills_fl_3: ["skills_fl_4"],
  skills_fl_4: ["skills_fl_5"],
  // Skills — human flag
  skills_hf_1: ["skills_hf_2"],
  skills_hf_2: ["skills_hf_3"],
  skills_hf_3: ["skills_hf_4"],
};

// Get which exercises are unlocked by completing a given exercise
export function getUnlocks(exerciseId: string): string[] {
  return unlockTree[exerciseId] ?? [];
}

// Build the full set of visible exercise IDs given completed exercises
export function getVisibleExercises(completedExercises: string[]): Set<string> {
  const visible = new Set<string>();
  const completed = new Set(completedExercises);

  // Gateways are always visible
  const gateways = unlockTree["__start__"] ?? [];
  for (const gw of gateways) {
    visible.add(gw);
  }

  // Walk the unlock tree: for each completed exercise, its unlocks become visible
  for (const exId of completed) {
    visible.add(exId); // completed exercises are always visible
    const unlocks = unlockTree[exId];
    if (unlocks) {
      for (const uid of unlocks) {
        visible.add(uid);
      }
    }
  }

  return visible;
}
