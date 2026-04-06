export type PathName = "push" | "pull" | "core" | "legs" | "skills" | "rings" | "breakdance" | "flexibility";

export type SubPath =
  | "pushups" | "dips" | "shoulder-press"
  | "pullups" | "rows" | "transitions"
  | "planks" | "leg-raises" | "static-holds"
  | "squats" | "hinges"
  | "planche" | "front-lever" | "human-flag"
  | "rings"
  | "toprock" | "footwork" | "freezes" | "power-moves"
  | "flex-shoulders" | "flex-wrists" | "flex-pike" | "flex-hips" | "flex-spine" | "flex-front-split";

export type NodeType = "regular" | "final" | "convergence" | "start";

export interface Progression {
  name: string;
  reps: string;
}

export interface Milestone {
  id: string;
  description: string;
  metric: string;
  isPrerequisite?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  path: PathName;
  subPath: SubPath;
  difficulty: number;
  nodeType: NodeType;
  description: string;
  formCues: string[];
  progressions: Progression[];
  estimatedMinutes: number;
}

export interface CrossLink {
  fromId: string;
  toId: string;
  reason: string;
}

export interface ProgressionEdge {
  fromId: string;
  toId: string;
}

// Helper to compute estimatedMinutes from difficulty
function mins(diff: number): number {
  if (diff < 20) return 4;
  if (diff < 40) return 6;
  if (diff < 60) return 8;
  if (diff < 80) return 10;
  return 12;
}

// 3 top-level categories that branch from START
export type Category = "flexibility" | "strength" | "special";

export const categoryPaths: Record<Category, PathName[]> = {
  flexibility: ["flexibility"],
  strength: ["push", "pull", "core", "legs"],
  special: ["skills", "rings", "breakdance"],
};

export const categoryLabels: Record<Category, string> = {
  flexibility: "Flexibility",
  strength: "Strength",
  special: "Special",
};

export const categoryColors: Record<Category, string> = {
  flexibility: "#97C459",
  strength: "#85B7EB",
  special: "#ED93B1",
};

// Gateway exercise IDs — the first exercise on each main branch
export const gatewayExercises: Record<Category, string> = {
  flexibility: "flex_gateway",
  strength: "core_pk_1",
  special: "bboy_fr_1",
};

// Map each path to its category
export function getCategory(path: PathName): Category {
  if (categoryPaths.flexibility.includes(path)) return "flexibility";
  if (categoryPaths.strength.includes(path)) return "strength";
  return "special";
}

export const exercises: Exercise[] = [
  // ============================================================
  // GATEWAY: Flexibility
  // ============================================================
  { id: "flex_gateway", name: "Toe Touch", path: "flexibility", subPath: "flex-pike", difficulty: 3, nodeType: "regular", description: "Stand and reach down to touch your toes — the first step to flexibility.", formCues: ["Keep legs straight", "Relax and breathe into it"], progressions: [
    { name: "Standing Ragdoll Hang", reps: "15s hold" },
    { name: "Seated Hamstring Stretch", reps: "15s hold" },
    { name: "Calf Stretch", reps: "15s hold" },
    { name: "Standing Reach (fingertips to shins)", reps: "1 rep" },
    { name: "Forward Fold with Bent Knees", reps: "1 rep" },
  ], estimatedMinutes: 4 },

  // ============================================================
  // PATH 1: PUSH
  // ============================================================
  // Sub-branch: pushups
  { id: "push_pu_1", name: "Wall Push-up", path: "push", subPath: "pushups", difficulty: 5, nodeType: "regular", description: "Push-up performed against a wall to build foundational pressing strength.", formCues: ["Keep body straight", "Elbows at 45 degrees"], progressions: [
    { name: "Wall Lean Hold", reps: "15s hold" },
    { name: "Scapular Wall Slide", reps: "1 rep" },
    { name: "Eccentric Wall Push-up (5s down)", reps: "1 rep" },
    { name: "Wall Plank (arms extended)", reps: "1 rep" },
    { name: "Kneeling Push-up", reps: "1 rep" },
  ], estimatedMinutes: mins(5) },

  { id: "push_pu_2", name: "Incline Push-up", path: "push", subPath: "pushups", difficulty: 10, nodeType: "regular", description: "Push-up on an elevated surface to progressively increase load.", formCues: ["Protract shoulders at top", "Lower chest to surface"], progressions: [
    { name: "High Incline Plank Hold", reps: "20s hold" },
    { name: "Eccentric Incline Push-up (5s down)", reps: "1 rep" },
    { name: "Scapular Push-up (protraction drill)", reps: "1 rep" },
    { name: "Kneeling Push-up", reps: "1 rep" },
    { name: "Incline Push-up with Pause at Bottom", reps: "1 rep" },
  ], estimatedMinutes: mins(10) },

  { id: "push_pu_3", name: "Regular Push-up", path: "push", subPath: "pushups", difficulty: 18, nodeType: "regular", description: "The classic push-up on the floor with full range of motion.", formCues: ["Core tight throughout", "Chest touches floor"], progressions: [
    { name: "Plank Hold", reps: "30s hold" },
    { name: "Eccentric Push-up (5s down)", reps: "1 rep" },
    { name: "Kneeling Push-up", reps: "1 rep" },
    { name: "Scapular Push-up", reps: "1 rep" },
    { name: "Low Incline Push-up", reps: "1 rep" },
    { name: "Hindu Push-up", reps: "1 rep" },
  ], estimatedMinutes: mins(18) },

  { id: "push_pu_4", name: "Diamond Push-up", path: "push", subPath: "pushups", difficulty: 25, nodeType: "regular", description: "Hands together under chest to emphasize triceps.", formCues: ["Index fingers and thumbs touch", "Elbows stay close to body"], progressions: [
    { name: "Tricep Bench Dip", reps: "1 rep" },
    { name: "Close-Grip Plank Hold", reps: "20s hold" },
    { name: "Eccentric Diamond Push-up (5s down)", reps: "1 rep" },
    { name: "Kneeling Diamond Push-up", reps: "1 rep" },
    { name: "Close-Grip Push-up (elbows tight)", reps: "1 rep" },
  ], estimatedMinutes: mins(25) },

  { id: "push_pu_5", name: "Archer Push-up", path: "push", subPath: "pushups", difficulty: 40, nodeType: "regular", description: "One arm does most of the work while the other assists laterally.", formCues: ["Extend assist arm fully", "Keep hips level"], progressions: [
    { name: "Wide Push-up", reps: "1 rep" },
    { name: "Typewriter Push-up", reps: "1 rep" },
    { name: "Archer Push-up Eccentric (5s down)", reps: "1 rep" },
    { name: "Single-Arm Plank Hold", reps: "15s hold" },
    { name: "Staggered Hand Push-up", reps: "1 rep" },
    { name: "Ring Push-up", reps: "1 rep" },
  ], estimatedMinutes: mins(40) },

  { id: "push_pu_6", name: "Pseudo Planche Push-up", path: "push", subPath: "pushups", difficulty: 55, nodeType: "regular", description: "Push-up with hands rotated back near hips to load shoulders heavily.", formCues: ["Lean forward past hands", "Protract hard at top"], progressions: [
    { name: "Planche Lean Hold", reps: "20s hold" },
    { name: "Eccentric Pseudo Planche PU (5s down)", reps: "1 rep" },
    { name: "Decline Push-up", reps: "1 rep" },
    { name: "Ring Turned-Out Push-up", reps: "1 rep" },
    { name: "Scapular Protraction Press", reps: "1 rep" },
    { name: "Weighted Push-up", reps: "1 rep" },
  ], estimatedMinutes: mins(55) },

  { id: "push_pu_7", name: "One-Arm Push-up", path: "push", subPath: "pushups", difficulty: 68, nodeType: "final", description: "Full push-up using a single arm with minimal rotation.", formCues: ["Wider stance for balance", "Fight rotation at hips"], progressions: [
    { name: "Archer Push-up", reps: "1 rep" },
    { name: "One-Arm Push-up Eccentric (5s down)", reps: "1 rep" },
    { name: "One-Arm Elevated Push-up (hand on bench)", reps: "1 rep" },
    { name: "Single-Arm Plank Hold", reps: "20s hold" },
    { name: "Lever Push-up (hand on ball)", reps: "1 rep" },
    { name: "Typewriter Push-up", reps: "1 rep" },
    { name: "Self-Assisted One-Arm PU (finger tips)", reps: "1 rep" },
  ], estimatedMinutes: mins(68) },

  // Sub-branch: dips
  { id: "push_di_1", name: "Bench Dip", path: "push", subPath: "dips", difficulty: 8, nodeType: "regular", description: "Dip using a bench behind you to build tricep and shoulder pressing strength.", formCues: ["Keep back close to bench", "Lower to 90 degrees"], progressions: [
    { name: "Bench Dip Top Support Hold", reps: "15s hold" },
    { name: "Eccentric Bench Dip (5s down)", reps: "1 rep" },
    { name: "Tricep Push-up", reps: "1 rep" },
    { name: "Bench Dip Bottom Pause", reps: "1 rep" },
    { name: "Seated Tricep Press", reps: "1 rep" },
  ], estimatedMinutes: mins(8) },

  { id: "push_di_2", name: "Parallel Bar Dip", path: "push", subPath: "dips", difficulty: 22, nodeType: "regular", description: "Dip on parallel bars through full range of motion.", formCues: ["Slight forward lean", "Shoulders below elbows at bottom"], progressions: [
    { name: "Bar Support Hold", reps: "20s hold" },
    { name: "Eccentric Parallel Dip (5s down)", reps: "1 rep" },
    { name: "Band-Assisted Dip", reps: "1 rep" },
    { name: "Scapular Dip (depress/elevate)", reps: "1 rep" },
    { name: "Bench Dip Feet Elevated", reps: "1 rep" },
    { name: "Dip Bottom Pause", reps: "1 rep" },
  ], estimatedMinutes: mins(22) },

  { id: "push_di_3", name: "Ring Dip", path: "push", subPath: "dips", difficulty: 38, nodeType: "regular", description: "Dip on gymnastic rings requiring stabilization.", formCues: ["Turn rings out at top", "Control the descent"], progressions: [
    { name: "Ring Support Hold (RTO)", reps: "20s hold" },
    { name: "Eccentric Ring Dip (5s down)", reps: "1 rep" },
    { name: "Parallel Bar Dip (deep ROM)", reps: "1 rep" },
    { name: "Band-Assisted Ring Dip", reps: "1 rep" },
    { name: "Ring Push-up", reps: "1 rep" },
    { name: "Ring Dip Bottom Pause", reps: "1 rep" },
  ], estimatedMinutes: mins(38) },

  { id: "push_di_4", name: "Korean Dip", path: "push", subPath: "dips", difficulty: 55, nodeType: "regular", description: "Dip with hands behind the body on a bar for extreme shoulder extension.", formCues: ["Lean forward away from bar", "Go as deep as mobility allows"], progressions: [
    { name: "German Hang Hold", reps: "15s hold" },
    { name: "Korean Dip Eccentric (5s down)", reps: "1 rep" },
    { name: "Skin the Cat (full ROM)", reps: "1 rep" },
    { name: "Reverse Grip Dip on Bars", reps: "1 rep" },
    { name: "Shoulder Dislocates (narrow grip)", reps: "1 rep" },
    { name: "Behind-Back Support Hold", reps: "1 rep" },
  ], estimatedMinutes: mins(55) },

  { id: "push_di_5", name: "Weighted Ring Dip", path: "push", subPath: "dips", difficulty: 65, nodeType: "regular", description: "Ring dip with added weight for advanced pressing strength.", formCues: ["Maintain ring turnout", "Full ROM with control"], progressions: [
    { name: "Ring Dip (full ROM)", reps: "1 rep" },
    { name: "Ring Dip with Tempo (3s down / 3s up)", reps: "1 rep" },
    { name: "Eccentric Weighted Ring Dip (5s down)", reps: "1 rep" },
    { name: "Weighted Parallel Bar Dip +20kg", reps: "1 rep" },
    { name: "Ring Support Hold +10kg", reps: "15s hold" },
    { name: "Bulgarian Ring Dip", reps: "1 rep" },
  ], estimatedMinutes: mins(65) },

  { id: "push_di_6", name: "Impossible Dip", path: "push", subPath: "dips", difficulty: 78, nodeType: "final", description: "A dip that transitions behind the bar requiring extreme shoulder flexibility and strength.", formCues: ["Slow controlled descent behind bar", "Strong push back over"], progressions: [
    { name: "Korean Dip (deep ROM)", reps: "1 rep" },
    { name: "Impossible Dip Eccentric (8s down)", reps: "1 rep" },
    { name: "Skin the Cat to German Hang", reps: "1 rep" },
    { name: "Behind-Bar Shoulder Extension Hold", reps: "10s hold" },
    { name: "Weighted Korean Dip +10kg", reps: "1 rep" },
    { name: "Back Lever Negative to German Hang", reps: "1 rep" },
    { name: "Bar Transition Drill (over/under)", reps: "1 rep" },
  ], estimatedMinutes: mins(78) },

  // Sub-branch: shoulder-press
  { id: "push_sp_1", name: "Pike Push-up", path: "push", subPath: "shoulder-press", difficulty: 15, nodeType: "regular", description: "Push-up in a pike position to load the shoulders vertically.", formCues: ["Hips high, head between arms", "Touch head to floor"], progressions: [
    { name: "Downward Dog Hold", reps: "20s hold" },
    { name: "Eccentric Pike Push-up (5s down)", reps: "1 rep" },
    { name: "Decline Push-up", reps: "1 rep" },
    { name: "Band-Resisted Overhead Press", reps: "1 rep" },
    { name: "Wall Walk-Up (partial)", reps: "1 rep" },
  ], estimatedMinutes: mins(15) },

  { id: "push_sp_2", name: "Elevated Pike Push-up", path: "push", subPath: "shoulder-press", difficulty: 25, nodeType: "regular", description: "Pike push-up with feet elevated to increase shoulder load.", formCues: ["Feet on box or bench", "Vertical torso at bottom"], progressions: [
    { name: "Elevated Pike Hold (feet on box)", reps: "20s hold" },
    { name: "Eccentric Elevated Pike PU (5s down)", reps: "1 rep" },
    { name: "Pike Push-up (floor)", reps: "1 rep" },
    { name: "Shoulder Tap in Pike Position", reps: "1 rep" },
    { name: "Decline Push-up (deep ROM)", reps: "1 rep" },
  ], estimatedMinutes: mins(25) },

  { id: "push_sp_3", name: "Wall Handstand Push-up", path: "push", subPath: "shoulder-press", difficulty: 42, nodeType: "regular", description: "Handstand push-up against a wall for supported overhead pressing.", formCues: ["Head touches floor between hands", "Lock out fully at top"], progressions: [
    { name: "Wall Handstand Hold", reps: "30s hold" },
    { name: "Eccentric Wall HSPU (5s down)", reps: "1 rep" },
    { name: "Elevated Pike PU (high box)", reps: "1 rep" },
    { name: "Wall Walk-Up to Handstand", reps: "1 rep" },
    { name: "Shoulder Shrug in Handstand", reps: "1 rep" },
    { name: "Pike Handstand Push-up (head to floor)", reps: "1 rep" },
  ], estimatedMinutes: mins(42) },

  { id: "push_sp_4", name: "Freestanding Handstand", path: "push", subPath: "shoulder-press", difficulty: 55, nodeType: "regular", description: "Balance in a freestanding handstand with stacked joints.", formCues: ["Squeeze glutes and point toes", "Use fingertip corrections"], progressions: [
    { name: "Chest-to-Wall Handstand Hold", reps: "30s hold" },
    { name: "Freestanding Kick-Up (catch and hold)", reps: "1 rep" },
    { name: "Heel Pull from Wall", reps: "1 rep" },
    { name: "Handstand Shoulder Taps on Wall", reps: "1 rep" },
    { name: "Tuck Handstand (knees to chest)", reps: "1 rep" },
    { name: "Handstand Wall Walk-Up (belly to wall)", reps: "1 rep" },
  ], estimatedMinutes: mins(55) },

  { id: "push_sp_5", name: "Freestanding Handstand Push-up", path: "push", subPath: "shoulder-press", difficulty: 75, nodeType: "final", description: "Handstand push-up without wall support requiring balance and pressing strength.", formCues: ["Controlled descent", "Press straight up without drift"], progressions: [
    { name: "Freestanding Handstand Hold", reps: "20s hold" },
    { name: "Wall HSPU (full ROM)", reps: "1 rep" },
    { name: "Freestanding HS Eccentric (5s lower to headstand)", reps: "1 rep" },
    { name: "Wall HSPU Deficit (hands on parallettes)", reps: "1 rep" },
    { name: "Headstand Press to Handstand", reps: "1 rep" },
    { name: "Freestanding Half-HSPU (mid-range)", reps: "1 rep" },
  ], estimatedMinutes: mins(75) },

  { id: "push_sp_6", name: "One-Arm Handstand", path: "push", subPath: "shoulder-press", difficulty: 85, nodeType: "final", description: "Balance on one arm in a handstand — the pinnacle of hand-balancing.", formCues: ["Shift weight gradually", "Use shoulder and finger corrections"], progressions: [
    { name: "Freestanding Handstand Hold", reps: "30s hold" },
    { name: "Handstand Weight Shift (finger lift)", reps: "1 rep" },
    { name: "Two-Finger Assist OAHS", reps: "1 rep" },
    { name: "Wall One-Arm Handstand Drill", reps: "1 rep" },
    { name: "Straddle One-Arm HS Attempt", reps: "1 rep" },
    { name: "Handstand Hip Shift Drill", reps: "1 rep" },
    { name: "Flag Hold from Handstand (lateral shift)", reps: "1 rep" },
  ], estimatedMinutes: mins(85) },

  { id: "push_sp_7", name: "90 Degree Push-up", path: "push", subPath: "shoulder-press", difficulty: 95, nodeType: "convergence", description: "From planche position, press to handstand and back — requires both planche and HS strength.", formCues: ["Lean forward into planche", "Press vertically without kipping"], progressions: [
    { name: "Straddle Planche Hold", reps: "5s hold" },
    { name: "Freestanding Handstand Push-up", reps: "1 rep" },
    { name: "Tuck 90-Degree Press (planche to HS)", reps: "1 rep" },
    { name: "Straddle Press to Handstand", reps: "1 rep" },
    { name: "Planche Lean to Headstand Press", reps: "1 rep" },
    { name: "Eccentric 90-Degree Lower (HS to planche, 5s)", reps: "1 rep" },
    { name: "Bent-Arm Straddle Planche Press", reps: "1 rep" },
    { name: "Advanced Tuck 90-Degree Push-up", reps: "1 rep" },
  ], estimatedMinutes: mins(95) },

  // ============================================================
  // PATH 2: PULL
  // ============================================================
  // Sub-branch: pullups
  { id: "pull_pu_1", name: "Dead Hang", path: "pull", subPath: "pullups", difficulty: 3, nodeType: "regular", description: "Hang from a bar with straight arms to build grip and shoulder health.", formCues: ["Relax into full hang", "Shoulders away from ears slightly"], progressions: [
    { name: "Assisted Hang (feet on floor)", reps: "15s hold" },
    { name: "Finger Squeeze on Thick Bar", reps: "1 rep" },
    { name: "Towel Grip Hold", reps: "1 rep" },
    { name: "Scapular Pull (from hang)", reps: "1 rep" },
    { name: "Wrist Curl with Light Load", reps: "1 rep" },
  ], estimatedMinutes: mins(3) },

  { id: "pull_pu_2", name: "Negative Pull-up", path: "pull", subPath: "pullups", difficulty: 12, nodeType: "regular", description: "Slow controlled descent from chin-over-bar to build pull-up strength.", formCues: ["5-second descent", "Control all the way to dead hang"], progressions: [
    { name: "Dead Hang", reps: "30s hold" },
    { name: "Flexed-Arm Hang (chin over bar)", reps: "1 rep" },
    { name: "Band-Assisted Pull-up", reps: "1 rep" },
    { name: "Scapular Pull-up", reps: "1 rep" },
    { name: "Eccentric Pull-up (10s down)", reps: "1 rep" },
  ], estimatedMinutes: mins(12) },

  { id: "pull_pu_3", name: "Pull-up", path: "pull", subPath: "pullups", difficulty: 22, nodeType: "regular", description: "Pull chin over bar from a dead hang using overhand grip.", formCues: ["Initiate with scapula retraction", "Chin clears bar"], progressions: [
    { name: "Negative Pull-up (5s down)", reps: "1 rep" },
    { name: "Flexed-Arm Hang (chin over bar)", reps: "20s hold" },
    { name: "Band-Assisted Pull-up", reps: "1 rep" },
    { name: "Scapular Pull-up", reps: "1 rep" },
    { name: "Horizontal Row", reps: "1 rep" },
    { name: "Chin-up (supinated grip)", reps: "1 rep" },
  ], estimatedMinutes: mins(22) },

  { id: "pull_pu_4", name: "L-Sit Pull-up", path: "pull", subPath: "pullups", difficulty: 35, nodeType: "regular", description: "Pull-up while holding legs in an L-sit position for added core demand.", formCues: ["Lock legs at 90 degrees", "No kipping"], progressions: [
    { name: "Pull-up (strict)", reps: "1 rep" },
    { name: "Hanging L-Sit Hold", reps: "15s hold" },
    { name: "L-Hang Scapular Pull", reps: "1 rep" },
    { name: "Eccentric L-Sit Pull-up (5s down)", reps: "1 rep" },
    { name: "Chin-up with Knee Raise", reps: "1 rep" },
  ], estimatedMinutes: mins(35) },

  { id: "pull_pu_5", name: "Archer Pull-up", path: "pull", subPath: "pullups", difficulty: 50, nodeType: "regular", description: "Wide-grip pull-up where one arm does the bulk of the pulling.", formCues: ["Assist arm stays straight", "Pull to one side"], progressions: [
    { name: "Wide-Grip Pull-up", reps: "1 rep" },
    { name: "Typewriter Pull-up", reps: "1 rep" },
    { name: "Archer Pull-up Eccentric (5s down)", reps: "1 rep" },
    { name: "Single-Arm Flexed Hang", reps: "10s hold" },
    { name: "One-Arm Scapular Pull", reps: "1 rep" },
    { name: "Weighted Pull-up +10kg", reps: "1 rep" },
  ], estimatedMinutes: mins(50) },

  { id: "pull_pu_6", name: "Uneven Pull-up", path: "pull", subPath: "pullups", difficulty: 62, nodeType: "regular", description: "One hand grips a towel or lower point to create uneven loading.", formCues: ["Low hand grips towel", "Focus on top arm pulling"], progressions: [
    { name: "Archer Pull-up", reps: "1 rep" },
    { name: "Towel-Grip Pull-up (both hands)", reps: "1 rep" },
    { name: "Uneven Pull-up Eccentric (5s down)", reps: "1 rep" },
    { name: "Single-Arm Flexed Hang", reps: "15s hold" },
    { name: "Weighted Pull-up +15kg", reps: "1 rep" },
    { name: "One-Arm Scapular Pull", reps: "1 rep" },
  ], estimatedMinutes: mins(62) },

  { id: "pull_pu_7", name: "Assisted One-Arm Pull-up", path: "pull", subPath: "pullups", difficulty: 75, nodeType: "regular", description: "One-arm pull-up with minimal assistance from the other hand.", formCues: ["Use finger assist only", "Full ROM each rep"], progressions: [
    { name: "Uneven Pull-up (low towel grip)", reps: "1 rep" },
    { name: "One-Arm Negative (5s down)", reps: "1 rep" },
    { name: "One-Arm Flexed Hang", reps: "15s hold" },
    { name: "Band-Assisted One-Arm Pull-up", reps: "1 rep" },
    { name: "Weighted Pull-up +25kg", reps: "1 rep" },
    { name: "One-Arm Partial (bottom third only)", reps: "1 rep" },
  ], estimatedMinutes: mins(75) },

  { id: "pull_pu_8", name: "One-Arm Pull-up", path: "pull", subPath: "pullups", difficulty: 85, nodeType: "final", description: "Complete pull-up using a single arm — elite pulling strength.", formCues: ["Dead hang start", "Minimal body rotation"], progressions: [
    { name: "Assisted OA Pull-up (finger assist)", reps: "1 rep" },
    { name: "One-Arm Eccentric (8s down)", reps: "1 rep" },
    { name: "One-Arm Lock-Off Hold (top)", reps: "10s hold" },
    { name: "Weighted Pull-up +35kg", reps: "1 rep" },
    { name: "One-Arm Dead Hang", reps: "1 rep" },
    { name: "One-Arm Bottom-Range Partial", reps: "1 rep" },
    { name: "Band-Assisted OA Pull-up (light band)", reps: "1 rep" },
  ], estimatedMinutes: mins(85) },

  { id: "pull_pu_9", name: "Front Lever Pull-up", path: "pull", subPath: "pullups", difficulty: 90, nodeType: "convergence", description: "Pull-up performed from a front lever hold — requires lever and pull strength.", formCues: ["Maintain horizontal body", "Pull to hips"], progressions: [
    { name: "Full Front Lever Hold", reps: "5s hold" },
    { name: "Tuck Front Lever Row", reps: "1 rep" },
    { name: "Straddle Front Lever Row", reps: "1 rep" },
    { name: "Front Lever Pull-up Eccentric (5s down)", reps: "1 rep" },
    { name: "Ice Cream Maker", reps: "1 rep" },
    { name: "Weighted Pull-up +30kg", reps: "1 rep" },
    { name: "Full Front Lever Row", reps: "1 rep" },
  ], estimatedMinutes: mins(90) },

  // Sub-branch: rows
  { id: "pull_ro_1", name: "Incline Row", path: "pull", subPath: "rows", difficulty: 8, nodeType: "regular", description: "Row at an incline angle using a bar or rings.", formCues: ["Body stays straight", "Pull chest to bar"], progressions: [
    { name: "Scapular Retraction Hold (standing)", reps: "10s hold" },
    { name: "Band Pull-Apart", reps: "1 rep" },
    { name: "Steep Incline Row (high bar)", reps: "1 rep" },
    { name: "Eccentric Incline Row (5s down)", reps: "1 rep" },
    { name: "Ring Row (feet close to anchor)", reps: "1 rep" },
  ], estimatedMinutes: mins(8) },

  { id: "pull_ro_2", name: "Horizontal Row", path: "pull", subPath: "rows", difficulty: 15, nodeType: "regular", description: "Row with body horizontal under a bar for full bodyweight load.", formCues: ["Squeeze shoulder blades", "Chest to bar each rep"], progressions: [
    { name: "Incline Row (45-degree)", reps: "1 rep" },
    { name: "Horizontal Row Eccentric (5s down)", reps: "1 rep" },
    { name: "Horizontal Row Top Hold", reps: "10s hold" },
    { name: "Feet-Elevated Incline Row", reps: "1 rep" },
    { name: "Scapular Row (retract only)", reps: "1 rep" },
  ], estimatedMinutes: mins(15) },

  { id: "pull_ro_3", name: "Archer Row", path: "pull", subPath: "rows", difficulty: 30, nodeType: "regular", description: "Row with one arm pulling while the other extends to the side.", formCues: ["Extend assist arm fully", "Rotate minimally"], progressions: [
    { name: "Horizontal Row (chest to bar)", reps: "1 rep" },
    { name: "Staggered Hand Row", reps: "1 rep" },
    { name: "Archer Row Eccentric (5s down)", reps: "1 rep" },
    { name: "Single-Arm Ring Row (assisted)", reps: "1 rep" },
    { name: "Archer Row Top Isometric", reps: "5s hold" },
    { name: "Wide-Grip Horizontal Row", reps: "1 rep" },
  ], estimatedMinutes: mins(30) },

  { id: "pull_ro_4", name: "Front Lever Row Tuck", path: "pull", subPath: "rows", difficulty: 45, nodeType: "final", description: "Row from a tuck front lever position to build front lever pulling.", formCues: ["Hold tuck lever between reps", "Pull hips to bar"], progressions: [
    { name: "Tuck Front Lever Hold", reps: "15s hold" },
    { name: "Tuck FL Row Eccentric (5s down)", reps: "1 rep" },
    { name: "Archer Row", reps: "1 rep" },
    { name: "Tuck Front Lever Ice Cream Maker", reps: "1 rep" },
    { name: "Inverted Row Feet Elevated", reps: "1 rep" },
    { name: "Straight-Arm Lat Pulldown", reps: "1 rep" },
  ], estimatedMinutes: mins(45) },

  // Sub-branch: transitions
  { id: "pull_tr_1", name: "Explosive Pull-up", path: "pull", subPath: "transitions", difficulty: 30, nodeType: "regular", description: "Pull-up with maximum power to get chest above bar.", formCues: ["Pull fast and high", "Hips drive upward"], progressions: [
    { name: "Pull-up (strict)", reps: "1 rep" },
    { name: "Chest-to-Bar Pull-up", reps: "1 rep" },
    { name: "Clapping Pull-up Attempt (low bar)", reps: "1 rep" },
    { name: "Weighted Pull-up +10kg", reps: "1 rep" },
    { name: "High Pull (waist to bar)", reps: "1 rep" },
  ], estimatedMinutes: mins(30) },

  { id: "pull_tr_2", name: "Kipping Muscle-up", path: "pull", subPath: "transitions", difficulty: 42, nodeType: "regular", description: "Muscle-up using a kip to transition from pull to push above the bar.", formCues: ["Strong kip swing", "Fast transition at top"], progressions: [
    { name: "Explosive Pull-up (chest to bar)", reps: "1 rep" },
    { name: "Straight Bar Dip", reps: "1 rep" },
    { name: "Kip Swing (beat swing)", reps: "1 rep" },
    { name: "Baby Muscle-up (low bar)", reps: "1 rep" },
    { name: "Negative Muscle-up (slow descent from top)", reps: "1 rep" },
    { name: "Wrist Turnover Drill on Low Bar", reps: "1 rep" },
  ], estimatedMinutes: mins(42) },

  { id: "pull_tr_3", name: "Strict Muscle-up", path: "pull", subPath: "transitions", difficulty: 62, nodeType: "final", description: "Muscle-up from dead hang with no kip — pure pulling and transition strength.", formCues: ["Deep pull past chest", "Fast wrist turnover"], progressions: [
    { name: "High Pull-up (belly to bar)", reps: "1 rep" },
    { name: "Negative Muscle-up (8s descent)", reps: "1 rep" },
    { name: "False Grip Dead Hang", reps: "20s hold" },
    { name: "Straight Bar Dip", reps: "1 rep" },
    { name: "Weighted Pull-up +15kg", reps: "1 rep" },
    { name: "Muscle-up Transition Drill (jumping)", reps: "1 rep" },
  ], estimatedMinutes: mins(62) },

  { id: "pull_tr_4", name: "Hefesto", path: "pull", subPath: "transitions", difficulty: 82, nodeType: "final", description: "Reverse muscle-up from behind the bar requiring extreme shoulder extension.", formCues: ["Slow negative first", "Shoulders must be mobile"], progressions: [
    { name: "German Hang Hold on Bar", reps: "15s hold" },
    { name: "Hefesto Eccentric (8s descent)", reps: "1 rep" },
    { name: "Skin the Cat (full ROM)", reps: "1 rep" },
    { name: "Korean Dip", reps: "1 rep" },
    { name: "Back Lever Negative", reps: "1 rep" },
    { name: "Reverse Grip Pull-up", reps: "1 rep" },
    { name: "Shoulder Extension Pullover", reps: "1 rep" },
  ], estimatedMinutes: mins(82) },

  // ============================================================
  // PATH 3: CORE
  // ============================================================
  // Sub-branch: planks
  { id: "core_pk_1", name: "Forearm Plank", path: "core", subPath: "planks", difficulty: 5, nodeType: "regular", description: "Hold a plank on forearms with a straight body line.", formCues: ["Squeeze glutes", "No sagging hips"], progressions: [
    { name: "Kneeling Forearm Plank", reps: "15s hold" },
    { name: "Glute Bridge", reps: "1 rep" },
    { name: "Dead Bug (contralateral)", reps: "1 rep" },
    { name: "Bird Dog", reps: "1 rep" },
    { name: "Hollow Body Hold (bent knees)", reps: "1 rep" },
  ], estimatedMinutes: mins(5) },

  { id: "core_pk_2", name: "Hard Plank", path: "core", subPath: "planks", difficulty: 12, nodeType: "regular", description: "Maximum tension plank contracting every muscle for short holds.", formCues: ["Pull elbows toward toes", "Brace like a punch is coming"], progressions: [
    { name: "Forearm Plank", reps: "30s hold" },
    { name: "Hollow Body Hold", reps: "1 rep" },
    { name: "Posterior Pelvic Tilt Drill (standing)", reps: "1 rep" },
    { name: "Side Plank (each side)", reps: "1 rep" },
    { name: "Pallof Press (anti-rotation)", reps: "1 rep" },
  ], estimatedMinutes: mins(12) },

  { id: "core_pk_3", name: "Inchworm", path: "core", subPath: "planks", difficulty: 20, nodeType: "regular", description: "Walk hands forward from plank to extend the lever and increase core demand.", formCues: ["Walk out as far as possible", "Keep hips level"], progressions: [
    { name: "High Plank Hold", reps: "30s hold" },
    { name: "Extended Plank (arms overhead)", reps: "1 rep" },
    { name: "Inchworm Walk-out", reps: "1 rep" },
    { name: "Stability Ball Rollout (kneeling)", reps: "1 rep" },
    { name: "Hand Walk-out from Knees", reps: "1 rep" },
  ], estimatedMinutes: mins(20) },

  { id: "core_pk_4", name: "Ab Wheel Rollout", path: "core", subPath: "planks", difficulty: 35, nodeType: "regular", description: "Roll an ab wheel forward and back for intense anti-extension core work.", formCues: ["Posterior pelvic tilt throughout", "Pull back with lats"], progressions: [
    { name: "Plank Walk-out (full extension)", reps: "1 rep" },
    { name: "Kneeling Ab Wheel Partial Rollout", reps: "1 rep" },
    { name: "Eccentric Ab Wheel (roll out only, 5s)", reps: "1 rep" },
    { name: "Stability Ball Rollout", reps: "1 rep" },
    { name: "Band-Resisted Hollow Body Hold", reps: "15s hold" },
    { name: "Straight-Arm Lat Pulldown", reps: "1 rep" },
  ], estimatedMinutes: mins(35) },

  { id: "core_pk_5", name: "Body Saw Plank", path: "core", subPath: "planks", difficulty: 48, nodeType: "regular", description: "Forearm plank rocking forward and back with feet on sliders.", formCues: ["Rock from shoulders", "Maintain rigid body"], progressions: [
    { name: "Ab Wheel Rollout (kneeling, full ROM)", reps: "1 rep" },
    { name: "Forearm Plank Feet-Elevated", reps: "20s hold" },
    { name: "Slider Plank Forward Reach", reps: "1 rep" },
    { name: "RKC Plank (max tension)", reps: "1 rep" },
    { name: "Body Saw Eccentric (one direction only)", reps: "1 rep" },
  ], estimatedMinutes: mins(48) },

  { id: "core_pk_6", name: "Dragon Flag", path: "core", subPath: "planks", difficulty: 65, nodeType: "final", description: "Lower and raise your entire body as a rigid lever from a bench.", formCues: ["Grip bench behind head", "No bend at hips"], progressions: [
    { name: "Tuck Dragon Flag", reps: "1 rep" },
    { name: "Single-Leg Dragon Flag", reps: "1 rep" },
    { name: "Eccentric Dragon Flag (8s lower)", reps: "1 rep" },
    { name: "Dragon Flag Bottom Isometric", reps: "5s hold" },
    { name: "Standing Ab Wheel Rollout", reps: "1 rep" },
    { name: "Hollow Body Rock", reps: "1 rep" },
    { name: "Hanging Straight-Leg Raise", reps: "1 rep" },
  ], estimatedMinutes: mins(65) },

  // Sub-branch: leg-raises
  { id: "core_lr_1", name: "Lying Leg Raise", path: "core", subPath: "leg-raises", difficulty: 8, nodeType: "regular", description: "Raise legs from lying position to 90 degrees for lower ab activation.", formCues: ["Press lower back into floor", "Slow descent"], progressions: [
    { name: "Lying Bent-Knee Raise", reps: "1 rep" },
    { name: "Reverse Crunch", reps: "1 rep" },
    { name: "Dead Bug (alternating)", reps: "1 rep" },
    { name: "Eccentric Leg Lower (5s down, straight legs)", reps: "1 rep" },
    { name: "Hollow Body Hold", reps: "15s hold" },
  ], estimatedMinutes: mins(8) },

  { id: "core_lr_2", name: "Hanging Knee Raise", path: "core", subPath: "leg-raises", difficulty: 18, nodeType: "regular", description: "Hang from a bar and raise knees to chest.", formCues: ["No swinging", "Curl pelvis up"], progressions: [
    { name: "Dead Hang", reps: "30s hold" },
    { name: "Lying Leg Raise", reps: "1 rep" },
    { name: "Captain's Chair Knee Raise", reps: "1 rep" },
    { name: "Hanging Knee Raise Eccentric (5s lower)", reps: "1 rep" },
    { name: "Hanging Pelvic Tilt", reps: "1 rep" },
  ], estimatedMinutes: mins(18) },

  { id: "core_lr_3", name: "Hanging Leg Raise", path: "core", subPath: "leg-raises", difficulty: 32, nodeType: "regular", description: "Hang from a bar and raise straight legs to 90 degrees.", formCues: ["Keep legs straight", "Control the negative"], progressions: [
    { name: "Hanging Knee Raise", reps: "1 rep" },
    { name: "Lying Straight-Leg Raise", reps: "1 rep" },
    { name: "Hanging Leg Raise Eccentric (5s lower)", reps: "1 rep" },
    { name: "Hanging L-Hold", reps: "10s hold" },
    { name: "Active Pike Compression (seated)", reps: "1 rep" },
  ], estimatedMinutes: mins(32) },

  { id: "core_lr_4", name: "Toes-to-Bar", path: "core", subPath: "leg-raises", difficulty: 42, nodeType: "regular", description: "Hang and touch toes to the bar with straight legs.", formCues: ["Toes make contact", "Slow controlled descent"], progressions: [
    { name: "Hanging Leg Raise (to 90 degrees)", reps: "1 rep" },
    { name: "Toes-to-Bar Eccentric (5s lower from top)", reps: "1 rep" },
    { name: "Hanging Leg Raise Past Horizontal", reps: "1 rep" },
    { name: "Active Pike Compression (floor)", reps: "1 rep" },
    { name: "Kipping Toes-to-Bar", reps: "1 rep" },
    { name: "L-Hang Hold", reps: "15s hold" },
  ], estimatedMinutes: mins(42) },

  { id: "core_lr_5", name: "Windshield Wipers", path: "core", subPath: "leg-raises", difficulty: 58, nodeType: "regular", description: "Hanging with legs raised, rotate side to side like a windshield wiper.", formCues: ["Legs stay straight", "Full ROM side to side"], progressions: [
    { name: "Toes-to-Bar", reps: "1 rep" },
    { name: "Lying Windshield Wipers", reps: "1 rep" },
    { name: "Hanging Oblique Knee Raise", reps: "1 rep" },
    { name: "Windshield Wiper Eccentric (5s per side)", reps: "1 rep" },
    { name: "Hanging L-Hold with Rotation", reps: "1 rep" },
    { name: "Pallof Press Isometric", reps: "10s hold" },
  ], estimatedMinutes: mins(58) },

  { id: "core_lr_6", name: "Coffee Grinder", path: "core", subPath: "leg-raises", difficulty: 70, nodeType: "regular", description: "Circular hanging leg movement requiring rotational core strength.", formCues: ["Full circles", "Maintain straight legs"], progressions: [
    { name: "Windshield Wipers (full ROM)", reps: "1 rep" },
    { name: "Toes-to-Bar (controlled)", reps: "1 rep" },
    { name: "Hanging Half-Circle (L to R)", reps: "1 rep" },
    { name: "Hanging Knee Circle", reps: "1 rep" },
    { name: "Eccentric Hanging Leg Circle (slow)", reps: "1 rep" },
    { name: "Anti-Rotation Dead Hang Hold", reps: "15s hold" },
  ], estimatedMinutes: mins(70) },

  { id: "core_lr_7", name: "Windmill", path: "core", subPath: "leg-raises", difficulty: 85, nodeType: "convergence", description: "Calisthenics windmill — rotational full-body core exercise bridging core and power moves.", formCues: ["Full rotation with control", "Engage entire posterior chain"], progressions: [
    { name: "Hanging Coffee Grinder (full circles)", reps: "1 rep" },
    { name: "Floor Windmill (bodyweight)", reps: "1 rep" },
    { name: "Turkish Get-Up", reps: "1 rep" },
    { name: "Rotational Plank Hold", reps: "10s hold" },
    { name: "Windmill Eccentric (slow rotation)", reps: "1 rep" },
    { name: "Side Plank Hip Rotation", reps: "1 rep" },
    { name: "Hanging Full-Circle Leg Raise", reps: "1 rep" },
  ], estimatedMinutes: mins(85) },

  // Sub-branch: static-holds
  { id: "core_sh_1", name: "Tuck L-Sit", path: "core", subPath: "static-holds", difficulty: 22, nodeType: "regular", description: "Hold body off the floor with knees tucked to chest.", formCues: ["Push floor away", "Knees to chest"], progressions: [
    { name: "Seated Knee Raise (hands beside hips)", reps: "1 rep" },
    { name: "Support Hold on Parallettes", reps: "15s hold" },
    { name: "Shoulder Depression Press", reps: "1 rep" },
    { name: "Hanging Knee Tuck", reps: "1 rep" },
    { name: "Plank to Tuck Jump", reps: "1 rep" },
  ], estimatedMinutes: mins(22) },

  { id: "core_sh_2", name: "L-Sit", path: "core", subPath: "static-holds", difficulty: 35, nodeType: "regular", description: "Hold body off the floor with legs straight at 90 degrees.", formCues: ["Lock knees", "Depress shoulders fully"], progressions: [
    { name: "Tuck L-Sit Hold", reps: "15s hold" },
    { name: "Single-Leg L-Sit (alternate)", reps: "1 rep" },
    { name: "Seated Leg Lift (hands on floor)", reps: "1 rep" },
    { name: "Shoulder Depression Press", reps: "1 rep" },
    { name: "Active Pike Compression", reps: "1 rep" },
    { name: "Hanging L-Sit", reps: "1 rep" },
  ], estimatedMinutes: mins(35) },

  { id: "core_sh_3", name: "V-Sit", path: "core", subPath: "static-holds", difficulty: 58, nodeType: "regular", description: "Hold legs above horizontal in a V shape with straight arms.", formCues: ["Legs above 90 degrees", "Point toes"], progressions: [
    { name: "L-Sit Hold", reps: "15s hold" },
    { name: "Tuck V-Sit (knees high)", reps: "1 rep" },
    { name: "Seated Leg Lift Above Horizontal", reps: "1 rep" },
    { name: "V-Sit Eccentric Lower (5s to L-sit)", reps: "1 rep" },
    { name: "Active Compression (legs high)", reps: "1 rep" },
    { name: "Hip Flexor Lift-Off Drill", reps: "1 rep" },
  ], estimatedMinutes: mins(58) },

  { id: "core_sh_4", name: "Straddle V-Sit", path: "core", subPath: "static-holds", difficulty: 70, nodeType: "regular", description: "V-sit with legs straddled wide for a different compression angle.", formCues: ["Wide straddle", "Lift legs as high as possible"], progressions: [
    { name: "V-Sit Hold", reps: "10s hold" },
    { name: "Straddle L-Sit", reps: "1 rep" },
    { name: "Straddle Compression Drill (floor)", reps: "1 rep" },
    { name: "Straddle Leg Lift (hands on floor)", reps: "1 rep" },
    { name: "Pancake Stretch Active Compression", reps: "1 rep" },
  ], estimatedMinutes: mins(70) },

  { id: "core_sh_5", name: "High V-Sit", path: "core", subPath: "static-holds", difficulty: 82, nodeType: "regular", description: "V-sit with legs raised close to vertical requiring extreme compression.", formCues: ["Legs near vertical", "Lean torso forward for balance"], progressions: [
    { name: "Straddle V-Sit Hold", reps: "10s hold" },
    { name: "Manna Tuck Attempt", reps: "1 rep" },
    { name: "High V Eccentric Lower (5s)", reps: "1 rep" },
    { name: "Active Compression to Vertical", reps: "1 rep" },
    { name: "Rear Support Leg Lift", reps: "1 rep" },
    { name: "Seated Pike Compression (chest to legs)", reps: "1 rep" },
  ], estimatedMinutes: mins(82) },

  { id: "core_sh_6", name: "Manna", path: "core", subPath: "static-holds", difficulty: 95, nodeType: "final", description: "Legs raised past vertical behind the body — the ultimate compression hold.", formCues: ["Hips fully extended", "Legs behind torso plane"], progressions: [
    { name: "High V-Sit Hold", reps: "8s hold" },
    { name: "Manna Tuck Hold", reps: "1 rep" },
    { name: "Manna Single-Leg Extension", reps: "1 rep" },
    { name: "Backward Wrist Lever Press", reps: "1 rep" },
    { name: "Full Compression (chest to legs)", reps: "1 rep" },
    { name: "Shoulder Extension Press (behind body)", reps: "1 rep" },
    { name: "Eccentric Manna Lower (5s)", reps: "1 rep" },
    { name: "Rear Support Leg Lift", reps: "1 rep" },
  ], estimatedMinutes: mins(95) },

  // ============================================================
  // PATH 4: LEGS
  // ============================================================
  // Sub-branch: squats
  { id: "legs_sq_1", name: "Bodyweight Squat", path: "legs", subPath: "squats", difficulty: 5, nodeType: "regular", description: "Standard bodyweight squat to parallel or below.", formCues: ["Knees track over toes", "Chest up"], progressions: [
    { name: "Wall Sit Hold", reps: "20s hold" },
    { name: "Assisted Squat (hold post)", reps: "1 rep" },
    { name: "Box Squat (sit to bench)", reps: "1 rep" },
    { name: "Eccentric Squat (5s down)", reps: "1 rep" },
    { name: "Glute Bridge", reps: "1 rep" },
  ], estimatedMinutes: mins(5) },

  { id: "legs_sq_2", name: "Bulgarian Split Squat", path: "legs", subPath: "squats", difficulty: 15, nodeType: "regular", description: "Single-leg squat with rear foot elevated on a bench.", formCues: ["Front shin vertical", "Full depth each rep"], progressions: [
    { name: "Bodyweight Squat (full ROM)", reps: "1 rep" },
    { name: "Static Lunge Hold", reps: "15s hold" },
    { name: "Reverse Lunge", reps: "1 rep" },
    { name: "Eccentric BSS (5s down)", reps: "1 rep" },
    { name: "Step-Up (low box)", reps: "1 rep" },
  ], estimatedMinutes: mins(15) },

  { id: "legs_sq_3", name: "Weighted Step-up", path: "legs", subPath: "squats", difficulty: 22, nodeType: "regular", description: "Step onto a box or bench with added weight for single-leg strength.", formCues: ["Drive through front heel", "No push-off from back foot"], progressions: [
    { name: "Bodyweight Step-up (high box)", reps: "1 rep" },
    { name: "Bulgarian Split Squat", reps: "1 rep" },
    { name: "Single-Leg Glute Bridge", reps: "1 rep" },
    { name: "Eccentric Step-Down (5s lower)", reps: "1 rep" },
    { name: "Step-up with Pause at Top", reps: "3s hold" },
  ], estimatedMinutes: mins(22) },

  { id: "legs_sq_4", name: "Pistol Squat", path: "legs", subPath: "squats", difficulty: 45, nodeType: "regular", description: "Full single-leg squat with the other leg extended in front.", formCues: ["Extend free leg forward", "Sit all the way down"], progressions: [
    { name: "Assisted Pistol (holding post)", reps: "1 rep" },
    { name: "Box Pistol Squat (sit to box)", reps: "1 rep" },
    { name: "Eccentric Pistol (5s down)", reps: "1 rep" },
    { name: "Pistol Bottom Isometric Hold", reps: "5s hold" },
    { name: "Bulgarian Split Squat (deep ROM)", reps: "1 rep" },
    { name: "Counterbalance Pistol (hold weight forward)", reps: "1 rep" },
  ], estimatedMinutes: mins(45) },

  { id: "legs_sq_5", name: "Shrimp Squat", path: "legs", subPath: "squats", difficulty: 52, nodeType: "regular", description: "Single-leg squat with rear leg held behind, knee touching floor.", formCues: ["Grab rear foot", "Knee touches floor"], progressions: [
    { name: "Pistol Squat", reps: "1 rep" },
    { name: "Assisted Shrimp (hand on wall)", reps: "1 rep" },
    { name: "Shrimp Squat Eccentric (5s down)", reps: "1 rep" },
    { name: "Rear-Foot-Elevated Lunge to Knee Tap", reps: "1 rep" },
    { name: "Shrimp Bottom Isometric", reps: "5s hold" },
  ], estimatedMinutes: mins(52) },

  { id: "legs_sq_6", name: "Kick-through", path: "legs", subPath: "squats", difficulty: 62, nodeType: "regular", description: "Dynamic rotational leg movement transitioning between squat and kick positions.", formCues: ["Rotate hips fully", "Light on supporting hand"], progressions: [
    { name: "Bear Crawl Hold", reps: "15s hold" },
    { name: "Beast to Crab Transition", reps: "1 rep" },
    { name: "Tabletop Hip Switch", reps: "1 rep" },
    { name: "Pistol Squat (each leg)", reps: "1 rep" },
    { name: "Slow Kick-Through (5s transition)", reps: "1 rep" },
    { name: "Crab Walk", reps: "1 rep" },
  ], estimatedMinutes: mins(62) },

  { id: "legs_sq_7", name: "Coin Drop", path: "legs", subPath: "squats", difficulty: 72, nodeType: "regular", description: "Drop into a deep single-leg squat position with control.", formCues: ["Controlled descent", "Explosive return"], progressions: [
    { name: "Pistol Squat (full ROM)", reps: "1 rep" },
    { name: "Depth Drop Landing (single leg)", reps: "1 rep" },
    { name: "Shrimp Squat", reps: "1 rep" },
    { name: "Eccentric Coin Drop (3s descent)", reps: "1 rep" },
    { name: "Single-Leg Box Jump", reps: "1 rep" },
    { name: "Coin Drop Bottom Catch Hold", reps: "3s hold" },
  ], estimatedMinutes: mins(72) },

  { id: "legs_sq_8", name: "Flare", path: "legs", subPath: "squats", difficulty: 88, nodeType: "convergence", description: "Flare motion requiring extreme hip mobility and leg strength — bridges calisthenics and bboy.", formCues: ["Wide straddle rotation", "Push through both arms"], progressions: [
    { name: "Middle Split Hold", reps: "30s hold" },
    { name: "Pancake Stretch (chest to floor)", reps: "1 rep" },
    { name: "Coffee Grinder (floor)", reps: "1 rep" },
    { name: "Straddle Support Press (on parallettes)", reps: "1 rep" },
    { name: "Flare Kick Drill (single rotation)", reps: "1 rep" },
    { name: "V-Sit to Straddle Press", reps: "1 rep" },
    { name: "Thomas Flair Hip Swing Drill", reps: "1 rep" },
  ], estimatedMinutes: mins(88) },

  // Sub-branch: hinges
  { id: "legs_hi_1", name: "Romanian Deadlift", path: "legs", subPath: "hinges", difficulty: 8, nodeType: "regular", description: "Hip hinge with bodyweight to learn the posterior chain movement pattern.", formCues: ["Push hips back", "Slight knee bend"], progressions: [
    { name: "Wall Hip Hinge Drill", reps: "1 rep" },
    { name: "Good Morning (bodyweight)", reps: "1 rep" },
    { name: "Glute Bridge Hold", reps: "15s hold" },
    { name: "Dowel Hip Hinge", reps: "1 rep" },
    { name: "Eccentric RDL (5s lower)", reps: "1 rep" },
  ], estimatedMinutes: mins(8) },

  { id: "legs_hi_2", name: "Single-Leg Romanian Deadlift", path: "legs", subPath: "hinges", difficulty: 20, nodeType: "regular", description: "Single-leg hip hinge for unilateral posterior chain strength and balance.", formCues: ["Back leg extends behind", "Hinge until torso horizontal"], progressions: [
    { name: "Bodyweight RDL (bilateral)", reps: "1 rep" },
    { name: "Kickstand RDL (offset stance)", reps: "1 rep" },
    { name: "Single-Leg Glute Bridge", reps: "1 rep" },
    { name: "Eccentric Single-Leg RDL (5s lower)", reps: "1 rep" },
    { name: "Single-Leg Balance Hold", reps: "15s hold" },
  ], estimatedMinutes: mins(20) },

  { id: "legs_hi_3", name: "Negative Nordic Hamstring Curl", path: "legs", subPath: "hinges", difficulty: 38, nodeType: "regular", description: "Slow eccentric descent of a Nordic curl to build hamstring strength.", formCues: ["Anchor feet securely", "Control the fall"], progressions: [
    { name: "Single-Leg Romanian Deadlift", reps: "1 rep" },
    { name: "Glute-Ham Raise (assisted)", reps: "1 rep" },
    { name: "Prone Hamstring Curl (band)", reps: "1 rep" },
    { name: "Short-Range Nordic Eccentric (top 30 degrees)", reps: "1 rep" },
    { name: "Nordic Curl Isometric (mid-range)", reps: "5s hold" },
    { name: "Slider Hamstring Curl", reps: "1 rep" },
  ], estimatedMinutes: mins(38) },

  { id: "legs_hi_4", name: "Nordic Hamstring Curl", path: "legs", subPath: "hinges", difficulty: 55, nodeType: "final", description: "Full Nordic curl with concentric and eccentric phases.", formCues: ["Hips extended throughout", "Pull back with hamstrings"], progressions: [
    { name: "Negative Nordic Curl (full ROM, 5s)", reps: "1 rep" },
    { name: "Band-Assisted Nordic Curl", reps: "1 rep" },
    { name: "Nordic Curl Bottom Catch (hand push-off)", reps: "1 rep" },
    { name: "Nordic Curl Mid-Range Isometric", reps: "8s hold" },
    { name: "Razor Curl (partial ROM concentric)", reps: "1 rep" },
    { name: "Slider Hamstring Curl (single leg)", reps: "1 rep" },
  ], estimatedMinutes: mins(55) },

  // ============================================================
  // PATH 5: SKILLS
  // ============================================================
  // Sub-branch: planche
  { id: "skills_pl_1", name: "Frog Stand", path: "skills", subPath: "planche", difficulty: 20, nodeType: "regular", description: "Balance with knees on elbows in a crouched arm balance.", formCues: ["Lean forward past hands", "Knees press into elbows"], progressions: [
    { name: "Crow Pose Lean (feet on floor)", reps: "10s hold" },
    { name: "Wrist Extension Stretch", reps: "1 rep" },
    { name: "Plank Shoulder Protraction", reps: "1 rep" },
    { name: "Elevated Push-up Plus (protraction)", reps: "1 rep" },
    { name: "Tripod Headstand", reps: "1 rep" },
  ], estimatedMinutes: mins(20) },

  { id: "skills_pl_2", name: "Planche Lean", path: "skills", subPath: "planche", difficulty: 28, nodeType: "regular", description: "Lean forward in push-up position to load shoulders for planche.", formCues: ["Protract shoulders", "Lean until shoulders pass wrists"], progressions: [
    { name: "Frog Stand Hold", reps: "20s hold" },
    { name: "Push-up Plus (full protraction)", reps: "1 rep" },
    { name: "Pseudo Planche Plank", reps: "1 rep" },
    { name: "Band-Resisted Shoulder Protraction", reps: "1 rep" },
    { name: "Ring Support Hold (turned out)", reps: "1 rep" },
  ], estimatedMinutes: mins(28) },

  { id: "skills_pl_3", name: "Advanced Tuck Planche", path: "skills", subPath: "planche", difficulty: 40, nodeType: "regular", description: "Hold a planche with knees tucked and back rounded.", formCues: ["Hips at shoulder height", "Push floor away hard"], progressions: [
    { name: "Planche Lean Hold (shoulders past wrists)", reps: "20s hold" },
    { name: "Tuck Planche on Parallettes (bent arms)", reps: "1 rep" },
    { name: "Pseudo Planche Push-up", reps: "1 rep" },
    { name: "Ring Shoulder Protraction Press", reps: "1 rep" },
    { name: "Eccentric Advanced Tuck Lower (5s from tuck HS)", reps: "1 rep" },
    { name: "Frog Stand to Lean Transition", reps: "1 rep" },
  ], estimatedMinutes: mins(40) },

  { id: "skills_pl_4", name: "Tuck Planche", path: "skills", subPath: "planche", difficulty: 52, nodeType: "regular", description: "Planche hold with knees pulled tight to chest, back flat.", formCues: ["Flat back", "Depress and protract shoulders"], progressions: [
    { name: "Advanced Tuck Planche Hold", reps: "10s hold" },
    { name: "Tuck Planche Eccentric (lower from tuck HS, 5s)", reps: "1 rep" },
    { name: "Band-Assisted Tuck Planche", reps: "1 rep" },
    { name: "Pseudo Planche Push-up (deep lean)", reps: "1 rep" },
    { name: "Straight-Arm Shoulder Press on Floor", reps: "1 rep" },
    { name: "Tuck Planche Push-up", reps: "1 rep" },
  ], estimatedMinutes: mins(52) },

  { id: "skills_pl_5", name: "Half-Lay Planche", path: "skills", subPath: "planche", difficulty: 65, nodeType: "regular", description: "Planche with legs partially extended — halfway between tuck and full.", formCues: ["Extend legs to 45 degrees", "Maintain shoulder protraction"], progressions: [
    { name: "Tuck Planche Hold", reps: "10s hold" },
    { name: "Single-Leg Tuck Planche Extension", reps: "1 rep" },
    { name: "Half-Lay Planche Eccentric (5s from tuck)", reps: "1 rep" },
    { name: "Band-Assisted Half-Lay Planche", reps: "1 rep" },
    { name: "Tuck Planche Push-up", reps: "1 rep" },
    { name: "Straight-Arm Press from L-Sit to Tuck", reps: "1 rep" },
  ], estimatedMinutes: mins(65) },

  { id: "skills_pl_6", name: "Straddle Planche", path: "skills", subPath: "planche", difficulty: 78, nodeType: "regular", description: "Planche hold with legs extended and straddled wide.", formCues: ["Wide straddle to reduce lever", "Hips at shoulder height"], progressions: [
    { name: "Half-Lay Planche Hold", reps: "8s hold" },
    { name: "Straddle Planche Eccentric (5s from straddle HS)", reps: "1 rep" },
    { name: "Band-Assisted Straddle Planche", reps: "1 rep" },
    { name: "Tuck Planche to Straddle Extension", reps: "1 rep" },
    { name: "Straddle Press Handstand (straight arms)", reps: "1 rep" },
    { name: "Maltese Lean on Floor (straddle)", reps: "1 rep" },
    { name: "Straddle Planche Push-up (tuck)", reps: "1 rep" },
  ], estimatedMinutes: mins(78) },

  { id: "skills_pl_7", name: "Full Planche", path: "skills", subPath: "planche", difficulty: 88, nodeType: "final", description: "Full planche with legs together and body horizontal — elite skill.", formCues: ["Legs together, toes pointed", "Entire body horizontal"], progressions: [
    { name: "Straddle Planche Hold", reps: "5s hold" },
    { name: "Full Planche Eccentric (5s from HS)", reps: "1 rep" },
    { name: "Straddle Planche to Legs-Together Attempt", reps: "1 rep" },
    { name: "Band-Assisted Full Planche", reps: "1 rep" },
    { name: "Straddle Planche Push-up", reps: "1 rep" },
    { name: "Full Planche Lean on Floor (max lean)", reps: "1 rep" },
    { name: "Planche on Rings (tuck)", reps: "1 rep" },
    { name: "Weighted Pseudo Planche Push-up", reps: "1 rep" },
  ], estimatedMinutes: mins(88) },

  // Sub-branch: front-lever
  { id: "skills_fl_1", name: "Tuck Front Lever", path: "skills", subPath: "front-lever", difficulty: 35, nodeType: "regular", description: "Front lever with knees tucked to chest.", formCues: ["Straight arms", "Hips at bar height"], progressions: [
    { name: "Inverted Hang (bar)", reps: "10s hold" },
    { name: "Tuck Front Lever Negative (5s from inverted)", reps: "1 rep" },
    { name: "Horizontal Row (chest to bar)", reps: "1 rep" },
    { name: "Scapular Depression in Hang", reps: "1 rep" },
    { name: "Straight-Arm Lat Pulldown", reps: "1 rep" },
  ], estimatedMinutes: mins(35) },

  { id: "skills_fl_2", name: "Advanced Tuck Front Lever", path: "skills", subPath: "front-lever", difficulty: 45, nodeType: "regular", description: "Front lever with knees tucked but back flattened.", formCues: ["Flat back", "Depress shoulders"], progressions: [
    { name: "Tuck Front Lever Hold", reps: "15s hold" },
    { name: "Adv. Tuck FL Eccentric (5s lower)", reps: "1 rep" },
    { name: "Tuck Front Lever Row", reps: "1 rep" },
    { name: "Lat Pullover (straight arms, floor)", reps: "1 rep" },
    { name: "Inverted Row Feet Elevated", reps: "1 rep" },
  ], estimatedMinutes: mins(45) },

  { id: "skills_fl_3", name: "Half-Lay Front Lever", path: "skills", subPath: "front-lever", difficulty: 58, nodeType: "regular", description: "Front lever with legs partially extended.", formCues: ["Extend legs to 45 degrees", "Squeeze lats hard"], progressions: [
    { name: "Adv. Tuck Front Lever Hold", reps: "12s hold" },
    { name: "Single-Leg Front Lever Extension", reps: "1 rep" },
    { name: "Half-Lay FL Eccentric (5s lower)", reps: "1 rep" },
    { name: "Adv. Tuck FL Row", reps: "1 rep" },
    { name: "Weighted Pull-up +15kg", reps: "1 rep" },
    { name: "Half-Lay FL Raise (from hang)", reps: "1 rep" },
  ], estimatedMinutes: mins(58) },

  { id: "skills_fl_4", name: "Straddle Front Lever", path: "skills", subPath: "front-lever", difficulty: 68, nodeType: "regular", description: "Front lever with legs straddled wide for reduced lever length.", formCues: ["Wide straddle", "Body horizontal"], progressions: [
    { name: "Half-Lay Front Lever Hold", reps: "8s hold" },
    { name: "Straddle FL Eccentric (5s lower from inverted)", reps: "1 rep" },
    { name: "Half-Lay FL Row", reps: "1 rep" },
    { name: "Straddle FL Raise from Hang", reps: "1 rep" },
    { name: "Band-Assisted Straddle FL", reps: "1 rep" },
    { name: "Weighted Pull-up +20kg", reps: "1 rep" },
  ], estimatedMinutes: mins(68) },

  { id: "skills_fl_5", name: "Full Front Lever", path: "skills", subPath: "front-lever", difficulty: 80, nodeType: "final", description: "Full front lever with legs together and body perfectly horizontal.", formCues: ["Legs together, toes pointed", "Lats and core fully engaged"], progressions: [
    { name: "Straddle Front Lever Hold", reps: "8s hold" },
    { name: "Full FL Eccentric (5s lower from inverted)", reps: "1 rep" },
    { name: "Straddle FL Row", reps: "1 rep" },
    { name: "Full FL Raise from Hang", reps: "1 rep" },
    { name: "Band-Assisted Full FL", reps: "1 rep" },
    { name: "Weighted Pull-up +25kg", reps: "1 rep" },
    { name: "Ice Cream Maker (straddle)", reps: "1 rep" },
  ], estimatedMinutes: mins(80) },

  // Sub-branch: human-flag
  { id: "skills_hf_1", name: "Vertical Flag", path: "skills", subPath: "human-flag", difficulty: 30, nodeType: "regular", description: "Hold body vertical on a pole as the first step toward a human flag.", formCues: ["Push-pull with arms", "Stack hips over shoulders"], progressions: [
    { name: "Side Plank Hold", reps: "20s hold" },
    { name: "Hanging Side Raise (knees tucked)", reps: "1 rep" },
    { name: "Pole Grip Strength Drill (push-pull)", reps: "1 rep" },
    { name: "Vertical Flag Eccentric (5s lower from top)", reps: "1 rep" },
    { name: "Lateral Shoulder Press (one arm)", reps: "1 rep" },
  ], estimatedMinutes: mins(30) },

  { id: "skills_hf_2", name: "Tuck Flag", path: "skills", subPath: "human-flag", difficulty: 45, nodeType: "regular", description: "Human flag with knees tucked to reduce the lever.", formCues: ["Push bottom arm, pull top arm", "Tuck knees tight"], progressions: [
    { name: "Vertical Flag Hold", reps: "15s hold" },
    { name: "Tuck Flag Eccentric (5s lower from vertical)", reps: "1 rep" },
    { name: "Side Plank Hip Dip", reps: "1 rep" },
    { name: "One-Arm Push / One-Arm Pull Combo", reps: "1 rep" },
    { name: "Tuck Flag Kick-Up Drill", reps: "1 rep" },
  ], estimatedMinutes: mins(45) },

  { id: "skills_hf_3", name: "Straddle Flag", path: "skills", subPath: "human-flag", difficulty: 58, nodeType: "regular", description: "Human flag with legs straddled for a moderate lever.", formCues: ["Wide straddle", "Keep body in one plane"], progressions: [
    { name: "Tuck Flag Hold", reps: "10s hold" },
    { name: "Straddle Flag Eccentric (5s lower)", reps: "1 rep" },
    { name: "Single-Leg Flag Extension", reps: "1 rep" },
    { name: "Side Plank Feet Elevated", reps: "1 rep" },
    { name: "Tuck Flag to Straddle Transition", reps: "1 rep" },
  ], estimatedMinutes: mins(58) },

  { id: "skills_hf_4", name: "Full Human Flag", path: "skills", subPath: "human-flag", difficulty: 75, nodeType: "final", description: "Full human flag with body horizontal and legs together.", formCues: ["Legs together, body horizontal", "Maximum push-pull tension"], progressions: [
    { name: "Straddle Flag Hold", reps: "8s hold" },
    { name: "Full Flag Eccentric (5s lower)", reps: "1 rep" },
    { name: "Straddle Flag to Full Extension Attempt", reps: "1 rep" },
    { name: "Band-Assisted Full Flag", reps: "1 rep" },
    { name: "Side Lever Row (bottom arm presses)", reps: "1 rep" },
    { name: "Weighted Side Plank (feet elevated)", reps: "1 rep" },
  ], estimatedMinutes: mins(75) },

  // ============================================================
  // PATH 6: RINGS
  // ============================================================
  { id: "rings_1", name: "Ring Support Hold", path: "rings", subPath: "rings", difficulty: 18, nodeType: "regular", description: "Hold a support position on rings with arms straight and rings turned out.", formCues: ["Turn rings out", "Depress shoulders"], progressions: [
    { name: "Parallel Bar Support Hold", reps: "20s hold" },
    { name: "Ring Dead Hang", reps: "1 rep" },
    { name: "Ring Partial Support (feet on floor)", reps: "1 rep" },
    { name: "Ring Support Eccentric (lower to hang, 5s)", reps: "1 rep" },
    { name: "Straight-Arm Shoulder Depression Press", reps: "1 rep" },
  ], estimatedMinutes: mins(18) },

  { id: "rings_2", name: "Ring Dips Turned Out", path: "rings", subPath: "rings", difficulty: 38, nodeType: "regular", description: "Ring dip maintaining rings-turned-out position throughout.", formCues: ["RTO at top and bottom", "Full depth"], progressions: [
    { name: "Ring Support Hold (RTO)", reps: "20s hold" },
    { name: "Ring Dip Eccentric RTO (5s down)", reps: "1 rep" },
    { name: "Ring Dip (standard)", reps: "1 rep" },
    { name: "Parallel Bar Weighted Dip +10kg", reps: "1 rep" },
    { name: "Ring Push-up (RTO)", reps: "1 rep" },
    { name: "Bulgarian Ring Dip", reps: "1 rep" },
  ], estimatedMinutes: mins(38) },

  { id: "rings_3", name: "Back Lever", path: "rings", subPath: "rings", difficulty: 48, nodeType: "regular", description: "Hold body horizontal face-down on rings with straight arms behind.", formCues: ["Straight arms", "Body horizontal"], progressions: [
    { name: "Skin the Cat (full ROM)", reps: "1 rep" },
    { name: "German Hang Hold (rings)", reps: "20s hold" },
    { name: "Tuck Back Lever Hold", reps: "1 rep" },
    { name: "Back Lever Eccentric (5s from inverted)", reps: "1 rep" },
    { name: "Single-Leg Back Lever Extension", reps: "1 rep" },
    { name: "Shoulder Extension Strength Pull", reps: "1 rep" },
  ], estimatedMinutes: mins(48) },

  { id: "rings_4", name: "Ring Muscle-up", path: "rings", subPath: "rings", difficulty: 58, nodeType: "regular", description: "Muscle-up on rings transitioning from hang to support.", formCues: ["False grip", "Deep pull then fast transition"], progressions: [
    { name: "False Grip Ring Hang", reps: "20s hold" },
    { name: "False Grip Ring Row", reps: "1 rep" },
    { name: "Ring Muscle-up Eccentric (8s descent)", reps: "1 rep" },
    { name: "Ring Dip (full ROM)", reps: "1 rep" },
    { name: "Deep Ring Pull-up (sternum to rings)", reps: "1 rep" },
    { name: "Transition Drill (jumping ring MU)", reps: "1 rep" },
  ], estimatedMinutes: mins(58) },

  { id: "rings_5", name: "Cross Pull", path: "rings", subPath: "rings", difficulty: 72, nodeType: "regular", description: "Pulling movement toward an iron cross position on rings.", formCues: ["Straight arms throughout", "Control the descent"], progressions: [
    { name: "Ring Fly (bent arm, controlled)", reps: "1 rep" },
    { name: "Cross Pull Eccentric with Band (5s)", reps: "1 rep" },
    { name: "Ring Support Wide Hold", reps: "10s hold" },
    { name: "Straight-Arm Ring Adduction", reps: "1 rep" },
    { name: "Cable Cross-Pull Drill", reps: "1 rep" },
    { name: "Ring Dip RTO Wide", reps: "1 rep" },
  ], estimatedMinutes: mins(72) },

  { id: "rings_6", name: "Iron Cross", path: "rings", subPath: "rings", difficulty: 85, nodeType: "final", description: "Hold body upright on rings with arms extended straight to the sides.", formCues: ["Straight arms, palms down", "Depress shoulders"], progressions: [
    { name: "Cross Pull (partial ROM)", reps: "1 rep" },
    { name: "Iron Cross Eccentric (8s descent from support)", reps: "1 rep" },
    { name: "Band-Assisted Iron Cross", reps: "5s hold" },
    { name: "Ring Fly Negative (straight arms)", reps: "1 rep" },
    { name: "Weighted Ring Dip +25kg", reps: "1 rep" },
    { name: "Straight-Arm Ring Adduction", reps: "1 rep" },
    { name: "Iron Cross Pull with Light Band", reps: "1 rep" },
  ], estimatedMinutes: mins(85) },

  { id: "rings_7", name: "Maltese", path: "rings", subPath: "rings", difficulty: 92, nodeType: "final", description: "Planche-like hold on rings with arms extended sideways — extreme difficulty.", formCues: ["Body horizontal", "Arms wide and straight"], progressions: [
    { name: "Iron Cross Hold", reps: "5s hold" },
    { name: "Maltese Eccentric (5s from support to horizontal)", reps: "1 rep" },
    { name: "Straddle Planche on Rings", reps: "1 rep" },
    { name: "Band-Assisted Maltese", reps: "1 rep" },
    { name: "Ring Fly to Horizontal (controlled)", reps: "1 rep" },
    { name: "Full Planche on Floor", reps: "1 rep" },
    { name: "Maltese Lean (feet on floor, rings wide)", reps: "1 rep" },
    { name: "Iron Cross to Maltese Transition Attempt", reps: "1 rep" },
  ], estimatedMinutes: mins(92) },

  { id: "rings_8", name: "Victorian Cross", path: "rings", subPath: "rings", difficulty: 97, nodeType: "final", description: "Inverted cross on rings with body inverted — the rarest rings skill.", formCues: ["Inverted body, arms wide", "Maximum shoulder strength"], progressions: [
    { name: "Iron Cross Hold", reps: "5s hold" },
    { name: "Inverted Hang on Rings (arms wide)", reps: "1 rep" },
    { name: "Victorian Cross Eccentric (5s lower from inverted)", reps: "1 rep" },
    { name: "Band-Assisted Victorian Cross", reps: "1 rep" },
    { name: "Maltese Hold", reps: "1 rep" },
    { name: "Inverted Ring Fly (partial ROM)", reps: "1 rep" },
    { name: "Reverse Cross Pull (from inverted)", reps: "1 rep" },
    { name: "Iron Cross to Invert Transition", reps: "1 rep" },
  ], estimatedMinutes: mins(97) },

  // ============================================================
  // PATH 7: BREAKDANCE
  // ============================================================
  // Sub-branch: toprock
  { id: "bboy_tr_1", name: "Bounce Rock", path: "breakdance", subPath: "toprock", difficulty: 3, nodeType: "regular", description: "Basic bounce rhythm that forms the foundation of all toprock.", formCues: ["Stay on beat", "Relaxed shoulders"], progressions: [
    { name: "Marching in Place (on beat)", reps: "1 rep" },
    { name: "Calf Raise Bounce Drill", reps: "1 rep" },
    { name: "Two-Step Side Rock", reps: "1 rep" },
    { name: "Arm Swing Coordination Drill", reps: "1 rep" },
    { name: "Weight Shift Rock (L to R)", reps: "1 rep" },
  ], estimatedMinutes: mins(3) },

  { id: "bboy_tr_2", name: "Indian Step", path: "breakdance", subPath: "toprock", difficulty: 8, nodeType: "regular", description: "Classic toprock step crossing one leg behind the other.", formCues: ["Cross behind, not in front", "Keep rhythm consistent"], progressions: [
    { name: "Bounce / Rock (on beat)", reps: "1 rep" },
    { name: "Cross-Behind Step (slow tempo)", reps: "1 rep" },
    { name: "Standing Cross-Leg Balance Hold", reps: "5s hold" },
    { name: "Hip Rotation Drill", reps: "1 rep" },
    { name: "Indian Step Arm Pattern", reps: "1 rep" },
  ], estimatedMinutes: mins(8) },

  { id: "bboy_tr_3", name: "Cross Step", path: "breakdance", subPath: "toprock", difficulty: 14, nodeType: "regular", description: "Toprock step crossing feet in front with upper body movement.", formCues: ["Cross in front", "Add arm styling"], progressions: [
    { name: "Indian Step (on beat)", reps: "1 rep" },
    { name: "Front Cross-Step Drill (slow)", reps: "1 rep" },
    { name: "Torso Rotation with Step", reps: "1 rep" },
    { name: "Cross Step Balance Pause", reps: "3s hold" },
    { name: "Cross Step with Arm Styling", reps: "1 rep" },
  ], estimatedMinutes: mins(14) },

  { id: "bboy_tr_4", name: "Kick Step Out/Over", path: "breakdance", subPath: "toprock", difficulty: 20, nodeType: "regular", description: "Toprock variation with kicks stepping out or over the supporting leg.", formCues: ["Sharp kicks", "Return to center each time"], progressions: [
    { name: "Cross Step (on beat)", reps: "1 rep" },
    { name: "Front Kick Drill (standing)", reps: "1 rep" },
    { name: "Side Kick Balance Hold", reps: "5s hold" },
    { name: "Step-Over Coordination Drill", reps: "1 rep" },
    { name: "Hip Flexor Kick Strength Lift", reps: "1 rep" },
  ], estimatedMinutes: mins(20) },

  { id: "bboy_tr_5", name: "Power Step", path: "breakdance", subPath: "toprock", difficulty: 28, nodeType: "regular", description: "Dynamic toprock step with salsa-inspired footwork and power.", formCues: ["Quick feet", "Drive from hips"], progressions: [
    { name: "Kick Step Out/Over (on beat)", reps: "1 rep" },
    { name: "Quick Feet Shuffle Drill", reps: "1 rep" },
    { name: "Lateral Hop Step", reps: "1 rep" },
    { name: "Calf Raise Power Bounce", reps: "1 rep" },
    { name: "Salsa Basic Step (slow)", reps: "1 rep" },
  ], estimatedMinutes: mins(28) },

  { id: "bboy_tr_6", name: "Glide Steps", path: "breakdance", subPath: "toprock", difficulty: 36, nodeType: "regular", description: "Smooth gliding toprock steps that create an illusion of floating.", formCues: ["Slide feet smoothly", "Stay light on toes"], progressions: [
    { name: "Salsa/Power Step (on beat)", reps: "1 rep" },
    { name: "Toe Slide Drill (smooth floor)", reps: "1 rep" },
    { name: "Moonwalk Step (basic)", reps: "1 rep" },
    { name: "Weight Transfer Glide Drill", reps: "1 rep" },
    { name: "Heel-Toe Roll Through", reps: "1 rep" },
    { name: "Single-Leg Float Balance", reps: "5s hold" },
  ], estimatedMinutes: mins(36) },

  { id: "bboy_tr_7", name: "Advanced Toprock Combos", path: "breakdance", subPath: "toprock", difficulty: 45, nodeType: "final", description: "Complex toprock combinations chaining multiple steps with personal style.", formCues: ["Flow between steps", "Express musicality"], progressions: [
    { name: "Float/Glide Steps (clean)", reps: "1 rep" },
    { name: "Indian Step to Cross Step Transition", reps: "1 rep" },
    { name: "Three-Step Combo (any mix)", reps: "1 rep" },
    { name: "Kick Step to Salsa Step Flow", reps: "1 rep" },
    { name: "Freestyle Toprock (30s continuous)", reps: "30s hold" },
    { name: "Direction Change Drill (4 directions)", reps: "1 rep" },
  ], estimatedMinutes: mins(45) },

  // Sub-branch: footwork
  { id: "bboy_fw_1", name: "Coffee Grinder", path: "breakdance", subPath: "footwork", difficulty: 10, nodeType: "regular", description: "Sweep one leg in a full circle while supporting on the other and one hand.", formCues: ["Keep sweep leg straight", "Lean into support hand"], progressions: [
    { name: "Squat Hold (low position)", reps: "15s hold" },
    { name: "Seated Leg Sweep (no hands)", reps: "1 rep" },
    { name: "Single-Arm Floor Support", reps: "1 rep" },
    { name: "Leg Circle Drill (seated, one leg)", reps: "1 rep" },
    { name: "Cossack Squat (lateral shift)", reps: "1 rep" },
  ], estimatedMinutes: mins(10) },

  { id: "bboy_fw_2", name: "6-Step", path: "breakdance", subPath: "footwork", difficulty: 18, nodeType: "regular", description: "The foundational six-count footwork pattern in breakdancing.", formCues: ["Memorize the 6 positions", "Stay low to ground"], progressions: [
    { name: "Coffee Grinder (both directions)", reps: "1 rep" },
    { name: "Bear Crawl Hold", reps: "15s hold" },
    { name: "Crab Walk (basic)", reps: "1 rep" },
    { name: "Step 1-2-3 Drill (half pattern)", reps: "1 rep" },
    { name: "Hand-Foot Switch Speed Drill", reps: "1 rep" },
  ], estimatedMinutes: mins(18) },

  { id: "bboy_fw_3", name: "3-Step", path: "breakdance", subPath: "footwork", difficulty: 24, nodeType: "regular", description: "Faster three-count footwork pattern for quicker transitions.", formCues: ["Speed and rhythm", "Clean hand-foot switches"], progressions: [
    { name: "6-Step (smooth, on beat)", reps: "1 rep" },
    { name: "Quick Foot Switch Drill", reps: "1 rep" },
    { name: "Low Squat Lateral Shift", reps: "1 rep" },
    { name: "3-Step Slow Motion Drill", reps: "1 rep" },
    { name: "Wrist Strength Hold (floor support)", reps: "10s hold" },
  ], estimatedMinutes: mins(24) },

  { id: "bboy_fw_4", name: "CC Spins", path: "breakdance", subPath: "footwork", difficulty: 30, nodeType: "regular", description: "Spinning footwork with legs extended creating a sweeping motion.", formCues: ["Wide sweep", "Momentum from hips"], progressions: [
    { name: "3-Step (fast and clean)", reps: "1 rep" },
    { name: "Coffee Grinder (fast rotation)", reps: "1 rep" },
    { name: "Seated Spin Drill (hands on floor)", reps: "1 rep" },
    { name: "Hip Rotational Power Drill", reps: "1 rep" },
    { name: "Extended Leg Sweep (low to ground)", reps: "1 rep" },
  ], estimatedMinutes: mins(30) },

  { id: "bboy_fw_5", name: "Kick-out Switches", path: "breakdance", subPath: "footwork", difficulty: 36, nodeType: "regular", description: "Quick leg extensions and switches while in footwork position.", formCues: ["Sharp kick extensions", "Quick switches"], progressions: [
    { name: "CCs / Zulu Spins (clean)", reps: "1 rep" },
    { name: "Low Squat Kick Extension", reps: "1 rep" },
    { name: "Plank Scissor Kick", reps: "1 rep" },
    { name: "Bear Crawl Kick-Out Drill", reps: "1 rep" },
    { name: "Single-Arm Support Kick Hold", reps: "5s hold" },
  ], estimatedMinutes: mins(36) },

  { id: "bboy_fw_6", name: "Threading Hooks", path: "breakdance", subPath: "footwork", difficulty: 44, nodeType: "regular", description: "Thread legs through arms or hook legs around arms during footwork.", formCues: ["Thread cleanly", "Maintain flow"], progressions: [
    { name: "Kick-outs / Switches (clean)", reps: "1 rep" },
    { name: "Seated Thread-Through Drill", reps: "1 rep" },
    { name: "Plank Thread-Through (slow)", reps: "1 rep" },
    { name: "Hook Sit Balance Hold", reps: "5s hold" },
    { name: "Hip Mobility Thread Drill", reps: "1 rep" },
    { name: "Single-Arm Elevated Thread", reps: "1 rep" },
  ], estimatedMinutes: mins(44) },

  { id: "bboy_fw_7", name: "1-Step / No-Hand Footwork", path: "breakdance", subPath: "footwork", difficulty: 55, nodeType: "regular", description: "Footwork performed with minimal or no hand contact with the floor.", formCues: ["Balance on legs only", "Core engaged"], progressions: [
    { name: "Threading / Hooks (clean flow)", reps: "1 rep" },
    { name: "Deep Squat Rotation (no hands)", reps: "1 rep" },
    { name: "Cossack Squat Flow", reps: "1 rep" },
    { name: "Single-Leg Low Balance Hold", reps: "10s hold" },
    { name: "Pistol Squat (for leg strength)", reps: "1 rep" },
    { name: "One-Step Slow Drill", reps: "1 rep" },
  ], estimatedMinutes: mins(55) },

  { id: "bboy_fw_8", name: "Advanced Footwork Combos", path: "breakdance", subPath: "footwork", difficulty: 65, nodeType: "final", description: "Complex footwork combinations blending multiple techniques with style.", formCues: ["Chain 3+ patterns", "Personal style"], progressions: [
    { name: "1-Step / No-Hand Footwork (clean)", reps: "1 rep" },
    { name: "6-Step to CC Transition", reps: "1 rep" },
    { name: "Threading to Kick-Out Flow", reps: "1 rep" },
    { name: "Footwork Direction Change Drill", reps: "1 rep" },
    { name: "Freestyle Footwork (30s continuous)", reps: "30s hold" },
    { name: "Three-Pattern Combo Drill", reps: "1 rep" },
  ], estimatedMinutes: mins(65) },

  // Sub-branch: freezes
  { id: "bboy_fr_1", name: "Baby Freeze", path: "breakdance", subPath: "freezes", difficulty: 15, nodeType: "regular", description: "Basic freeze balancing on head and hands with knees tucked.", formCues: ["Head and both hands on floor", "Tuck knees into elbows"], progressions: [
    { name: "Tripod Headstand Hold", reps: "10s hold" },
    { name: "Forearm Plank (strong core)", reps: "1 rep" },
    { name: "Crow Pose", reps: "1 rep" },
    { name: "Neck Strengthening Bridge", reps: "1 rep" },
    { name: "Baby Freeze Entry Drill (slow)", reps: "1 rep" },
  ], estimatedMinutes: mins(15) },

  { id: "bboy_fr_2", name: "Chair Freeze", path: "breakdance", subPath: "freezes", difficulty: 22, nodeType: "regular", description: "Freeze balanced on one arm with body in a chair-like shape.", formCues: ["Elbow digs into hip", "Stack weight over arm"], progressions: [
    { name: "Baby Freeze Hold", reps: "10s hold" },
    { name: "Single-Arm Plank", reps: "1 rep" },
    { name: "Elbow Stab Balance (both hands)", reps: "1 rep" },
    { name: "Wrist Conditioning (floor load)", reps: "1 rep" },
    { name: "Chair Freeze Entry Drill", reps: "1 rep" },
  ], estimatedMinutes: mins(22) },

  { id: "bboy_fr_3", name: "Turtle Freeze", path: "breakdance", subPath: "freezes", difficulty: 32, nodeType: "regular", description: "Balance on both hands with elbows in stomach, body horizontal.", formCues: ["Elbows in abs", "Lean forward to balance"], progressions: [
    { name: "Chair Freeze Hold", reps: "10s hold" },
    { name: "Frog Stand", reps: "1 rep" },
    { name: "Planche Lean (mild)", reps: "1 rep" },
    { name: "Turtle Freeze Entry (feet touching floor)", reps: "1 rep" },
    { name: "Turtle Spin Attempt (quarter turn)", reps: "1 rep" },
  ], estimatedMinutes: mins(32) },

  { id: "bboy_fr_4", name: "Elbow Freeze", path: "breakdance", subPath: "freezes", difficulty: 40, nodeType: "regular", description: "Freeze balanced on one elbow with body inverted or angled.", formCues: ["Elbow in hip crease", "Tight core"], progressions: [
    { name: "Turtle Freeze Hold", reps: "10s hold" },
    { name: "Single-Elbow Stab Balance", reps: "1 rep" },
    { name: "Chair Freeze (solid hold)", reps: "1 rep" },
    { name: "Headstand Kick-Up Drill", reps: "1 rep" },
    { name: "Elbow Freeze Entry from Footwork", reps: "1 rep" },
  ], estimatedMinutes: mins(40) },

  { id: "bboy_fr_5", name: "Headstand Freeze", path: "breakdance", subPath: "freezes", difficulty: 45, nodeType: "regular", description: "Freeze in a headstand position with stylized leg placement.", formCues: ["Tripod base", "Style the legs"], progressions: [
    { name: "Elbow Freeze Hold", reps: "8s hold" },
    { name: "Tripod Headstand", reps: "1 rep" },
    { name: "Headstand Leg Variation Drill", reps: "1 rep" },
    { name: "Neck Bridge Strengthener", reps: "1 rep" },
    { name: "Headstand Entry from Tuck", reps: "1 rep" },
  ], estimatedMinutes: mins(45) },

  { id: "bboy_fr_6", name: "Airchair", path: "breakdance", subPath: "freezes", difficulty: 55, nodeType: "regular", description: "One-arm freeze with body in a reclined chair position.", formCues: ["Stab arm into lower back", "Arch body back"], progressions: [
    { name: "Headstand Freeze (styled)", reps: "10s hold" },
    { name: "Elbow Stab Balance (hand on lower back)", reps: "1 rep" },
    { name: "Back Bridge", reps: "1 rep" },
    { name: "Single-Arm Support Press Drill", reps: "1 rep" },
    { name: "Airchair Entry from Floor", reps: "1 rep" },
    { name: "Wrist Extension Conditioning", reps: "1 rep" },
  ], estimatedMinutes: mins(55) },

  { id: "bboy_fr_7", name: "Hollowback Freeze", path: "breakdance", subPath: "freezes", difficulty: 65, nodeType: "regular", description: "Handstand freeze with an extreme back arch creating a hollowback shape.", formCues: ["Strong handstand first", "Arch through upper back"], progressions: [
    { name: "Airchair Hold", reps: "8s hold" },
    { name: "Wall Handstand", reps: "1 rep" },
    { name: "Bridge Push-up", reps: "1 rep" },
    { name: "Thoracic Extension Drill", reps: "1 rep" },
    { name: "Hollowback Entry from Wall HS", reps: "1 rep" },
    { name: "Camel Pose (deep backbend)", reps: "1 rep" },
  ], estimatedMinutes: mins(65) },

  { id: "bboy_fr_8", name: "One-Hand Freeze (Nike)", path: "breakdance", subPath: "freezes", difficulty: 75, nodeType: "regular", description: "Balance entire body on one hand in a stylized freeze position.", formCues: ["Stack weight over wrist", "Lock shoulder"], progressions: [
    { name: "Hollowback Freeze Hold", reps: "5s hold" },
    { name: "Freestanding Handstand (solid)", reps: "1 rep" },
    { name: "One-Arm Handstand Wall Drill", reps: "1 rep" },
    { name: "Single-Arm Elbow Freeze (stable)", reps: "1 rep" },
    { name: "Wrist Conditioning (full extension under load)", reps: "1 rep" },
    { name: "One-Hand Freeze Kick-Up Attempt", reps: "1 rep" },
  ], estimatedMinutes: mins(75) },

  { id: "bboy_fr_9", name: "Airchair Spin", path: "breakdance", subPath: "freezes", difficulty: 82, nodeType: "regular", description: "Spin on one arm while maintaining an airchair position.", formCues: ["Start from solid airchair", "Initiate spin with legs"], progressions: [
    { name: "Airchair Hold (solid)", reps: "10s hold" },
    { name: "One-Hand Freeze (Nike)", reps: "1 rep" },
    { name: "Airchair Weight Shift Drill", reps: "1 rep" },
    { name: "Spin Entry from Airchair (quarter turn)", reps: "1 rep" },
    { name: "Wrist Rotation Under Load Drill", reps: "1 rep" },
    { name: "Leg Momentum Swing Drill", reps: "1 rep" },
  ], estimatedMinutes: mins(82) },

  { id: "bboy_fr_10", name: "Flag Freeze", path: "breakdance", subPath: "freezes", difficulty: 88, nodeType: "final", description: "A freeze replicating a human flag position — extreme one-arm balance.", formCues: ["Push-pull arms", "Body horizontal"], progressions: [
    { name: "Airchair Spin (controlled)", reps: "1 rep" },
    { name: "Human Flag Hold (on pole)", reps: "5s hold" },
    { name: "One-Hand Freeze (Nike, solid)", reps: "1 rep" },
    { name: "Flag Freeze Eccentric (lower from vertical)", reps: "1 rep" },
    { name: "Side Plank on Hand (feet elevated)", reps: "1 rep" },
    { name: "Push-Pull Lateral Tension Drill", reps: "1 rep" },
    { name: "Flag Freeze Entry from Handstand", reps: "1 rep" },
  ], estimatedMinutes: mins(88) },

  // Sub-branch: power-moves
  { id: "bboy_pm_1", name: "Backspin", path: "breakdance", subPath: "power-moves", difficulty: 22, nodeType: "regular", description: "Spin on your upper back using momentum from legs.", formCues: ["Tuck to spin faster", "Whip legs for momentum"], progressions: [
    { name: "Back Roll (basic)", reps: "1 rep" },
    { name: "Shoulder Roll (both sides)", reps: "1 rep" },
    { name: "Lying Leg Whip Drill", reps: "1 rep" },
    { name: "Upper Back Balance Hold", reps: "5s hold" },
    { name: "Tuck Spin on Back (half rotation)", reps: "1 rep" },
  ], estimatedMinutes: mins(22) },

  { id: "bboy_pm_2", name: "Shoulder Roll", path: "breakdance", subPath: "power-moves", difficulty: 28, nodeType: "regular", description: "Roll across the shoulders to build comfort with inverted spinning.", formCues: ["Roll across upper back", "Tuck chin"], progressions: [
    { name: "Backspin (controlled)", reps: "1 rep" },
    { name: "Forward Roll to Stand", reps: "1 rep" },
    { name: "Neck Bridge Hold", reps: "10s hold" },
    { name: "Shoulder Roll Entry Drill", reps: "1 rep" },
    { name: "Inverted Shoulder Mobility Drill", reps: "1 rep" },
  ], estimatedMinutes: mins(28) },

  { id: "bboy_pm_3", name: "Swipe", path: "breakdance", subPath: "power-moves", difficulty: 42, nodeType: "regular", description: "Rotational power move jumping from hands to feet and back.", formCues: ["Kick legs over hard", "Land on both hands"], progressions: [
    { name: "Shoulder Roll (smooth both sides)", reps: "1 rep" },
    { name: "Macaco (back handspring one-arm)", reps: "1 rep" },
    { name: "Bridge Kick-Over Drill", reps: "1 rep" },
    { name: "Explosive Push-Off from Floor", reps: "1 rep" },
    { name: "Swipe Kick Drill (half rotation)", reps: "1 rep" },
    { name: "Rotational Hip Power Drill", reps: "1 rep" },
  ], estimatedMinutes: mins(42) },

  { id: "bboy_pm_4", name: "Windmill", path: "breakdance", subPath: "power-moves", difficulty: 55, nodeType: "regular", description: "Continuous rotation on upper back/shoulders with legs in a V shape.", formCues: ["Open legs wide", "Roll across upper back"], progressions: [
    { name: "Swipe (controlled)", reps: "1 rep" },
    { name: "Backspin (fast, multiple rotations)", reps: "1 rep" },
    { name: "Baby Windmill Drill (tuck legs)", reps: "1 rep" },
    { name: "Stab Entry to Back Roll", reps: "1 rep" },
    { name: "Leg Whip Open-Close Drill", reps: "1 rep" },
    { name: "Shoulder Roll Continuous (3 rolls)", reps: "1 rep" },
  ], estimatedMinutes: mins(55) },

  { id: "bboy_pm_5", name: "Halo", path: "breakdance", subPath: "power-moves", difficulty: 63, nodeType: "regular", description: "Head-based spinning move rolling around the crown of the head.", formCues: ["Roll around head perimeter", "Legs drive momentum"], progressions: [
    { name: "Windmill (3+ rotations)", reps: "1 rep" },
    { name: "Headstand Freeze (stable)", reps: "10s hold" },
    { name: "Head Roll Drill (crown of head)", reps: "1 rep" },
    { name: "Neck Bridge Rotation Drill", reps: "1 rep" },
    { name: "Halo Entry from Headstand", reps: "1 rep" },
    { name: "Leg Sweep Momentum Drill (inverted)", reps: "1 rep" },
  ], estimatedMinutes: mins(63) },

  { id: "bboy_pm_6", name: "Headspin", path: "breakdance", subPath: "power-moves", difficulty: 68, nodeType: "regular", description: "Spin on the crown of the head with body inverted.", formCues: ["Find balance point on head", "Tap hands to spin faster"], progressions: [
    { name: "Halo (clean rotations)", reps: "1 rep" },
    { name: "Headstand Hold (no hands)", reps: "5s hold" },
    { name: "Headstand Hand Tap Drill", reps: "1 rep" },
    { name: "Neck Strengthening Isometric", reps: "1 rep" },
    { name: "Headspin Entry from Headstand", reps: "1 rep" },
    { name: "Spin Acceleration Drill (hand taps)", reps: "1 rep" },
  ], estimatedMinutes: mins(68) },

  { id: "bboy_pm_7", name: "Flare", path: "breakdance", subPath: "power-moves", difficulty: 78, nodeType: "final", description: "Wide-legged circular swing on both arms — iconic power move.", formCues: ["Wide straddle throughout", "Alternate arm support"], progressions: [
    { name: "Windmill (5+ rotations)", reps: "1 rep" },
    { name: "Coffee Grinder (fast, both arms)", reps: "1 rep" },
    { name: "Thomas Flair Drill (one leg at a time)", reps: "1 rep" },
    { name: "Mushroom Spin on Floor (circles)", reps: "1 rep" },
    { name: "Straddle Press on Parallettes", reps: "1 rep" },
    { name: "Hip Swing Drill (wide V)", reps: "1 rep" },
    { name: "Single Flare Kick Attempt", reps: "1 rep" },
  ], estimatedMinutes: mins(78) },

  { id: "bboy_pm_8", name: "1990 (One-Hand Spin)", path: "breakdance", subPath: "power-moves", difficulty: 85, nodeType: "final", description: "Spin on one hand in a handstand position.", formCues: ["Solid one-arm HS first", "Initiate spin from core"], progressions: [
    { name: "Headspin (solid)", reps: "1 rep" },
    { name: "One-Arm Handstand Hold", reps: "5s hold" },
    { name: "Handstand Pirouette Drill", reps: "1 rep" },
    { name: "1990 Entry Drill (kick to one hand)", reps: "1 rep" },
    { name: "Wrist Rotation Under HS Load", reps: "1 rep" },
    { name: "Core Twist Drill in Handstand", reps: "1 rep" },
    { name: "One-Hand Spin Attempt (half turn)", reps: "1 rep" },
  ], estimatedMinutes: mins(85) },

  { id: "bboy_pm_9", name: "Air Flare", path: "breakdance", subPath: "power-moves", difficulty: 92, nodeType: "convergence", description: "Rotating through the air alternating hand support — the king of power moves.", formCues: ["Commit to the rotation", "Kick through hard"], progressions: [
    { name: "Flare (5+ rotations)", reps: "1 rep" },
    { name: "Handstand (solid)", reps: "20s hold" },
    { name: "Thomas Flair (high elevation)", reps: "1 rep" },
    { name: "Airflare Barrel Roll Drill", reps: "1 rep" },
    { name: "Explosive Handstand Hop", reps: "1 rep" },
    { name: "Planche Push Strength (for air time)", reps: "1 rep" },
    { name: "Airflare Single Rotation Attempt", reps: "1 rep" },
    { name: "Swipe to Airflare Entry Drill", reps: "1 rep" },
  ], estimatedMinutes: mins(92) },

  { id: "bboy_pm_10", name: "Air Flare to 1990", path: "breakdance", subPath: "power-moves", difficulty: 96, nodeType: "convergence", description: "Transition from airflare directly into a 1990 one-hand spin.", formCues: ["Clean airflare exit", "Catch into 1990 balance"], progressions: [
    { name: "Airflare (3+ rotations)", reps: "1 rep" },
    { name: "1990 (solid spins)", reps: "1 rep" },
    { name: "Airflare to Handstand Catch", reps: "1 rep" },
    { name: "One-Hand Catch Drill from Rotation", reps: "1 rep" },
    { name: "Airflare Deceleration Drill", reps: "1 rep" },
    { name: "1990 Entry from Momentum", reps: "1 rep" },
    { name: "Wrist Impact Conditioning", reps: "1 rep" },
    { name: "Airflare Exit to 1990 Attempt", reps: "1 rep" },
  ], estimatedMinutes: mins(96) },

  // ============================================================
  // PATH 8: FLEXIBILITY
  // ============================================================
  // Sub-branch: flex-shoulders
  { id: "flex_sh_1", name: "Wall Slide", path: "flexibility", subPath: "flex-shoulders", difficulty: 5, nodeType: "regular", description: "Slide arms up a wall to improve shoulder flexion range.", formCues: ["Back flat against wall", "Slide arms overhead"], progressions: [
    { name: "Arm Circle Warm-Up", reps: "1 rep" },
    { name: "Band Pull-Apart (light)", reps: "1 rep" },
    { name: "Shoulder Blade Squeeze Hold", reps: "10s hold" },
    { name: "Supine Arm Slide (lying down)", reps: "1 rep" },
    { name: "Wall Angel (partial ROM)", reps: "1 rep" },
  ], estimatedMinutes: mins(5) },

  { id: "flex_sh_2", name: "Puppy Pose", path: "flexibility", subPath: "flex-shoulders", difficulty: 12, nodeType: "regular", description: "Kneeling stretch with arms extended forward to open shoulders.", formCues: ["Hips over knees", "Chest sinks to floor"], progressions: [
    { name: "Wall Slide (full ROM)", reps: "1 rep" },
    { name: "Child's Pose Hold", reps: "20s hold" },
    { name: "Doorway Chest Stretch", reps: "1 rep" },
    { name: "Prone Arm Lift (floor)", reps: "1 rep" },
    { name: "Kneeling Lat Stretch", reps: "1 rep" },
  ], estimatedMinutes: mins(12) },

  { id: "flex_sh_3", name: "Passive Hang", path: "flexibility", subPath: "flex-shoulders", difficulty: 18, nodeType: "regular", description: "Hang from a bar fully relaxed for 60 seconds to decompress shoulders.", formCues: ["Relax completely", "Let gravity stretch"], progressions: [
    { name: "Puppy Pose Hold", reps: "30s hold" },
    { name: "Dead Hang (30s build-up)", reps: "1 rep" },
    { name: "Shoulder Flexion Wall Stretch", reps: "1 rep" },
    { name: "Grip Endurance Hold (thick bar)", reps: "1 rep" },
    { name: "Scapular Hang (relax and retract)", reps: "1 rep" },
  ], estimatedMinutes: mins(18) },

  { id: "flex_sh_4", name: "Shoulder Dislocates", path: "flexibility", subPath: "flex-shoulders", difficulty: 25, nodeType: "regular", description: "Pass a stick or band over and behind the head to improve shoulder ROM.", formCues: ["Straight arms throughout", "Narrow grip over time"], progressions: [
    { name: "Passive Hang (60s)", reps: "60s hold" },
    { name: "Band Dislocate (wide grip)", reps: "1 rep" },
    { name: "Dowel Pass-Over (extra wide)", reps: "1 rep" },
    { name: "Lying Shoulder Flexion (dowel overhead)", reps: "1 rep" },
    { name: "Wall Slide (overhead press pattern)", reps: "1 rep" },
  ], estimatedMinutes: mins(25) },

  { id: "flex_sh_5", name: "German Hang Hold", path: "flexibility", subPath: "flex-shoulders", difficulty: 42, nodeType: "regular", description: "Hang behind a bar with arms behind you for deep shoulder extension.", formCues: ["Start from skin-the-cat position", "Ease into stretch"], progressions: [
    { name: "Shoulder Dislocates (narrow grip)", reps: "1 rep" },
    { name: "Behind-Back Stick Lift", reps: "1 rep" },
    { name: "Ring German Hang (partial depth)", reps: "10s hold" },
    { name: "Rear Delt Stretch", reps: "1 rep" },
    { name: "Skin the Cat Partial (to 45 degrees)", reps: "1 rep" },
    { name: "Supine Shoulder Extension (floor, arms behind)", reps: "1 rep" },
  ], estimatedMinutes: mins(42) },

  { id: "flex_sh_6", name: "Skin the Cat", path: "flexibility", subPath: "flex-shoulders", difficulty: 55, nodeType: "regular", description: "Full rotation on rings or bar passing through German hang.", formCues: ["Controlled throughout", "Tuck or pike legs"], progressions: [
    { name: "German Hang Hold (full depth)", reps: "20s hold" },
    { name: "Tuck Skin the Cat (partial rotation)", reps: "1 rep" },
    { name: "Hanging Shoulder Extension Pull", reps: "1 rep" },
    { name: "Shoulder Dislocates (very narrow grip)", reps: "1 rep" },
    { name: "Inverted Hang on Rings", reps: "1 rep" },
  ], estimatedMinutes: mins(55) },

  { id: "flex_sh_7", name: "Bridge Straight Arms", path: "flexibility", subPath: "flex-shoulders", difficulty: 68, nodeType: "regular", description: "Full bridge with straight arms demonstrating open shoulders.", formCues: ["Push floor away", "Arms straight, shoulders open"], progressions: [
    { name: "Skin the Cat (full ROM)", reps: "1 rep" },
    { name: "Full Back Bridge (bent arms OK)", reps: "15s hold" },
    { name: "Wall Walk-Down to Bridge", reps: "1 rep" },
    { name: "Shoulder Opener (stick behind back, lift)", reps: "1 rep" },
    { name: "Bridge Shoulder Push Drill", reps: "1 rep" },
    { name: "Camel Pose (deep)", reps: "1 rep" },
  ], estimatedMinutes: mins(68) },

  { id: "flex_sh_8", name: "Full Back Bridge (open)", path: "flexibility", subPath: "flex-shoulders", difficulty: 78, nodeType: "final", description: "Full bridge with shoulders fully open and arms straight — shoulder flexibility mastery.", formCues: ["Shoulders past wrists", "Push hips high"], progressions: [
    { name: "Bridge Straight Arms Hold", reps: "20s hold" },
    { name: "Bridge Walk Closer to Hands (wall)", reps: "1 rep" },
    { name: "Elevated Bridge (hands on blocks)", reps: "1 rep" },
    { name: "Bridge Push-up (from floor)", reps: "1 rep" },
    { name: "Shoulder Flexion Overhead (arms past ears)", reps: "1 rep" },
    { name: "Bridge Rock Forward (shoulders past wrists)", reps: "1 rep" },
  ], estimatedMinutes: mins(78) },

  // Sub-branch: flex-wrists
  { id: "flex_wr_1", name: "Wrist Circles", path: "flexibility", subPath: "flex-wrists", difficulty: 3, nodeType: "regular", description: "Rotate wrists in circles to warm up and build basic wrist mobility.", formCues: ["Full range circles", "Both directions"], progressions: [
    { name: "Finger Spread and Squeeze", reps: "1 rep" },
    { name: "Wrist Flexion/Extension (no load)", reps: "1 rep" },
    { name: "Forearm Pronation/Supination", reps: "1 rep" },
    { name: "Fist Clench and Release", reps: "1 rep" },
    { name: "Wrist Figure-8 Motion", reps: "1 rep" },
  ], estimatedMinutes: mins(3) },

  { id: "flex_wr_2", name: "Prayer Stretch", path: "flexibility", subPath: "flex-wrists", difficulty: 8, nodeType: "regular", description: "Press palms together and lower hands to stretch wrist extensors.", formCues: ["Palms together", "Lower hands, keep contact"], progressions: [
    { name: "Wrist Circles (full ROM)", reps: "1 rep" },
    { name: "Fingers-Up Wall Press", reps: "10s hold" },
    { name: "Reverse Prayer Stretch", reps: "1 rep" },
    { name: "Wrist Flexor Stretch (arm extended)", reps: "1 rep" },
    { name: "Prayer Position Pulse", reps: "1 rep" },
  ], estimatedMinutes: mins(8) },

  { id: "flex_wr_3", name: "Floor Wrist Stretches", path: "flexibility", subPath: "flex-wrists", difficulty: 15, nodeType: "regular", description: "Stretch wrists in multiple directions on the floor with bodyweight.", formCues: ["Fingers forward, back, and out", "Lean gently into each"], progressions: [
    { name: "Prayer Stretch Hold", reps: "20s hold" },
    { name: "Tabletop Wrist Rock (forward)", reps: "1 rep" },
    { name: "Tabletop Wrist Rock (backward)", reps: "1 rep" },
    { name: "Side-to-Side Wrist Load Shift", reps: "1 rep" },
    { name: "Fingers-Backward Floor Press", reps: "1 rep" },
  ], estimatedMinutes: mins(15) },

  { id: "flex_wr_4", name: "Reverse Wrist Stretch", path: "flexibility", subPath: "flex-wrists", difficulty: 25, nodeType: "regular", description: "Stretch with backs of hands on the floor to build extension ROM.", formCues: ["Backs of hands flat", "Lean back gently"], progressions: [
    { name: "Floor Wrist Stretches (all directions)", reps: "1 rep" },
    { name: "Reverse Hand Push-Up Position Hold", reps: "10s hold" },
    { name: "Wrist Extensor Stretch (arm extended)", reps: "1 rep" },
    { name: "Gradual Reverse Wrist Load", reps: "1 rep" },
    { name: "Knuckle Push-Up (wrist alignment)", reps: "1 rep" },
  ], estimatedMinutes: mins(25) },

  { id: "flex_wr_5", name: "Wrist PU Position Hold", path: "flexibility", subPath: "flex-wrists", difficulty: 38, nodeType: "regular", description: "Hold a push-up position on fingertips or with wrists extended.", formCues: ["Full bodyweight on wrists", "Build up gradually"], progressions: [
    { name: "Reverse Wrist Stretch Hold", reps: "20s hold" },
    { name: "Kneeling Wrist Extension Hold", reps: "1 rep" },
    { name: "Fingertip Push-Up", reps: "1 rep" },
    { name: "Floor Wrist Stretch (full lean)", reps: "1 rep" },
    { name: "Push-Up Position Wrist Rotation", reps: "1 rep" },
  ], estimatedMinutes: mins(38) },

  { id: "flex_wr_6", name: "Planche-Lean Wrist Hold", path: "flexibility", subPath: "flex-wrists", difficulty: 52, nodeType: "regular", description: "Hold a planche lean position loading the wrists with forward lean.", formCues: ["Lean past hands", "Maintain straight wrists"], progressions: [
    { name: "Wrist PU Position Hold (solid)", reps: "20s hold" },
    { name: "Planche Lean on Parallettes", reps: "1 rep" },
    { name: "Progressive Forward Lean (incremental)", reps: "1 rep" },
    { name: "Wrist Extension Under Load Drill", reps: "1 rep" },
    { name: "Pseudo Planche Wrist Conditioning", reps: "1 rep" },
  ], estimatedMinutes: mins(52) },

  { id: "flex_wr_7", name: "Handstand Wrist Prep", path: "flexibility", subPath: "flex-wrists", difficulty: 65, nodeType: "final", description: "Comfortable handstand hold with full wrist extension under load.", formCues: ["Fingers spread wide", "No wrist pain at full extension"], progressions: [
    { name: "Planche-Lean Wrist Hold (solid)", reps: "15s hold" },
    { name: "Wall Handstand Wrist Hold", reps: "1 rep" },
    { name: "Fingertip Handstand Balance Drill", reps: "1 rep" },
    { name: "Wrist Push-Up (knees, extension ROM)", reps: "1 rep" },
    { name: "HS Entry with Wrist Focus (weight on fingers)", reps: "1 rep" },
    { name: "Loaded Wrist Extension (HS position, micro-shifts)", reps: "1 rep" },
  ], estimatedMinutes: mins(65) },

  // Sub-branch: flex-pike
  { id: "flex_pk_1", name: "Standing Forward Fold", path: "flexibility", subPath: "flex-pike", difficulty: 10, nodeType: "regular", description: "Stand and fold forward reaching toward toes to stretch hamstrings.", formCues: ["Bend from hips, not back", "Relax neck"], progressions: [
    { name: "Seated Hamstring Stretch (one leg)", reps: "20s hold" },
    { name: "Standing Toe Touch Attempt", reps: "1 rep" },
    { name: "Supine Leg Raise (passive, towel)", reps: "1 rep" },
    { name: "Calf Stretch (downward dog)", reps: "1 rep" },
    { name: "Hip Hinge Drill (hands on shins)", reps: "1 rep" },
  ], estimatedMinutes: mins(10) },

  { id: "flex_pk_2", name: "Seated Pike (past toes)", path: "flexibility", subPath: "flex-pike", difficulty: 18, nodeType: "regular", description: "Sit with legs straight and reach past toes.", formCues: ["Reach past toes", "Lead with chest"], progressions: [
    { name: "Standing Forward Fold (fingertips to floor)", reps: "15s hold" },
    { name: "Seated Reach to Ankles", reps: "1 rep" },
    { name: "Supine Hamstring Stretch (band)", reps: "1 rep" },
    { name: "Active Hamstring Contract-Relax", reps: "1 rep" },
    { name: "Seated Pike Pulse (gentle bouncing)", reps: "1 rep" },
  ], estimatedMinutes: mins(18) },

  { id: "flex_pk_3", name: "Standing Pike (palms flat)", path: "flexibility", subPath: "flex-pike", difficulty: 30, nodeType: "regular", description: "Forward fold with palms flat on the floor beside feet.", formCues: ["Palms flat on floor", "Straight legs"], progressions: [
    { name: "Seated Pike (past toes)", reps: "20s hold" },
    { name: "Standing Forward Fold (fingertips flat)", reps: "1 rep" },
    { name: "Elevated Forward Fold (hands on block)", reps: "1 rep" },
    { name: "Jefferson Curl (light, slow)", reps: "1 rep" },
    { name: "PNF Hamstring Stretch (contract-relax)", reps: "1 rep" },
  ], estimatedMinutes: mins(30) },

  { id: "flex_pk_4", name: "Active Pike Lift", path: "flexibility", subPath: "flex-pike", difficulty: 42, nodeType: "regular", description: "Actively pull torso toward legs using hip flexor strength.", formCues: ["Use hip flexors to pull", "Hold end range"], progressions: [
    { name: "Standing Pike (palms flat)", reps: "20s hold" },
    { name: "Seated Leg Lift (compression drill)", reps: "1 rep" },
    { name: "Supine Hip Flexor March", reps: "1 rep" },
    { name: "Active Toe Touch (no momentum)", reps: "1 rep" },
    { name: "Pike Compression Against Wall", reps: "1 rep" },
  ], estimatedMinutes: mins(42) },

  { id: "flex_pk_5", name: "Chest-to-Knees Pike", path: "flexibility", subPath: "flex-pike", difficulty: 55, nodeType: "regular", description: "Deep pike fold with chest resting on knees.", formCues: ["Chest contacts thighs", "Grab ankles or heels"], progressions: [
    { name: "Active Compression Hold", reps: "15s hold" },
    { name: "Seated Pike with Strap Pull", reps: "1 rep" },
    { name: "PNF Pike Stretch (contract-relax)", reps: "1 rep" },
    { name: "Jefferson Curl (full ROM, slow)", reps: "1 rep" },
    { name: "Standing Pike Fold (chest toward shins)", reps: "1 rep" },
  ], estimatedMinutes: mins(55) },

  { id: "flex_pk_6", name: "Active Pike Compression", path: "flexibility", subPath: "flex-pike", difficulty: 68, nodeType: "regular", description: "Actively compress into a pike using strength, not just passive flexibility.", formCues: ["Lift legs toward face", "No hand assistance"], progressions: [
    { name: "Chest-to-Knees Pike Hold", reps: "20s hold" },
    { name: "Seated Active Compression Lift", reps: "1 rep" },
    { name: "Lying Hip Flexor Lift (legs to face)", reps: "1 rep" },
    { name: "Compression Drill Against Wall (no hands)", reps: "1 rep" },
    { name: "L-Sit Hold (for hip flexor strength)", reps: "1 rep" },
    { name: "Active Pike Pulse (no momentum)", reps: "1 rep" },
  ], estimatedMinutes: mins(68) },

  { id: "flex_pk_7", name: "Full Pike Compression", path: "flexibility", subPath: "flex-pike", difficulty: 82, nodeType: "final", description: "Complete compression with chest flat on thighs and legs straight — needed for manna.", formCues: ["Zero gap between torso and legs", "Toes pointed"], progressions: [
    { name: "Active Pike Compression Hold", reps: "10s hold" },
    { name: "Full Compression Attempt (assisted pull)", reps: "1 rep" },
    { name: "V-Sit Hold (legs high)", reps: "1 rep" },
    { name: "PNF Pike with Partner", reps: "1 rep" },
    { name: "Compression Lift-Off (hands free)", reps: "1 rep" },
    { name: "Manna Tuck Prep (rear compression)", reps: "1 rep" },
  ], estimatedMinutes: mins(82) },

  // Sub-branch: flex-hips
  { id: "flex_hi_1", name: "Butterfly Stretch", path: "flexibility", subPath: "flex-hips", difficulty: 8, nodeType: "regular", description: "Sit with soles of feet together and press knees toward floor.", formCues: ["Soles together", "Press knees down gently"], progressions: [
    { name: "Seated Hip Circle (cross-legged)", reps: "1 rep" },
    { name: "Supine Knee Drop (both knees to side)", reps: "1 rep" },
    { name: "Seated Groin Stretch (wide knees)", reps: "15s hold" },
    { name: "Butterfly Flutter (gentle bounce)", reps: "1 rep" },
    { name: "Butterfly Forward Fold", reps: "1 rep" },
  ], estimatedMinutes: mins(8) },

  { id: "flex_hi_2", name: "Deep Squat Hold", path: "flexibility", subPath: "flex-hips", difficulty: 15, nodeType: "regular", description: "Hold the bottom of a deep squat for 60 seconds to open hips.", formCues: ["Heels on floor", "Push knees out with elbows"], progressions: [
    { name: "Butterfly Stretch Hold", reps: "30s hold" },
    { name: "Goblet Squat Hold (no weight)", reps: "1 rep" },
    { name: "Assisted Deep Squat (holding post)", reps: "1 rep" },
    { name: "Ankle Mobility Drill (knee over toe)", reps: "1 rep" },
    { name: "Hip Circle in Squat Position", reps: "1 rep" },
  ], estimatedMinutes: mins(15) },

  { id: "flex_hi_3", name: "Frog Stretch", path: "flexibility", subPath: "flex-hips", difficulty: 22, nodeType: "regular", description: "Kneeling stretch with knees wide apart to open inner hips.", formCues: ["Knees wide, hips sink", "Keep shins parallel"], progressions: [
    { name: "Deep Squat Hold", reps: "30s hold" },
    { name: "Butterfly Stretch (deep)", reps: "1 rep" },
    { name: "Kneeling Adductor Stretch (one leg out)", reps: "1 rep" },
    { name: "Frog Stretch Partial (hips high)", reps: "1 rep" },
    { name: "Supine Frog Stretch (gravity assisted)", reps: "1 rep" },
  ], estimatedMinutes: mins(22) },

  { id: "flex_hi_4", name: "Half Straddle", path: "flexibility", subPath: "flex-hips", difficulty: 32, nodeType: "regular", description: "Seated straddle fold reaching halfway to the floor.", formCues: ["Wide legs, fold forward", "Lead with chest"], progressions: [
    { name: "Frog Stretch Hold", reps: "30s hold" },
    { name: "Seated Straddle Side Reach", reps: "1 rep" },
    { name: "Standing Straddle Fold (wide stance)", reps: "1 rep" },
    { name: "PNF Adductor Stretch", reps: "1 rep" },
    { name: "Seated Straddle Rotation (side to center)", reps: "1 rep" },
  ], estimatedMinutes: mins(32) },

  { id: "flex_hi_5", name: "Full Pancake", path: "flexibility", subPath: "flex-hips", difficulty: 50, nodeType: "regular", description: "Seated straddle with chest flat on the floor.", formCues: ["Chest and belly on floor", "Walk hands forward"], progressions: [
    { name: "Seated Straddle (halfway down)", reps: "20s hold" },
    { name: "Elevated Pancake (sit on block)", reps: "1 rep" },
    { name: "PNF Pancake (contract-relax)", reps: "1 rep" },
    { name: "Straddle Forward Fold with Strap", reps: "1 rep" },
    { name: "Frog Stretch (deep, hips low)", reps: "1 rep" },
  ], estimatedMinutes: mins(50) },

  { id: "flex_hi_6", name: "Elevated Pancake", path: "flexibility", subPath: "flex-hips", difficulty: 62, nodeType: "regular", description: "Pancake stretch with hips elevated on a block for deeper range.", formCues: ["Sit on elevation", "Fold deeper than floor pancake"], progressions: [
    { name: "Full Pancake", reps: "30s hold" },
    { name: "Pancake on Yoga Block", reps: "1 rep" },
    { name: "Active Pancake Compression", reps: "1 rep" },
    { name: "PNF Elevated Pancake (contract-relax)", reps: "1 rep" },
    { name: "Straddle Wall Slide (legs on wall)", reps: "1 rep" },
  ], estimatedMinutes: mins(62) },

  { id: "flex_hi_7", name: "Wide Middle Split", path: "flexibility", subPath: "flex-hips", difficulty: 72, nodeType: "regular", description: "Middle split open to at least 150 degrees.", formCues: ["Slide feet wider gradually", "Support with hands"], progressions: [
    { name: "Elevated Pancake Hold", reps: "30s hold" },
    { name: "Wall Middle Split Slide", reps: "1 rep" },
    { name: "Standing Straddle Stretch (wide)", reps: "1 rep" },
    { name: "PNF Middle Split (contract-relax)", reps: "1 rep" },
    { name: "Horse Stance Isometric (wide)", reps: "1 rep" },
    { name: "Progressive Split Slide (blocks for support)", reps: "1 rep" },
  ], estimatedMinutes: mins(72) },

  { id: "flex_hi_8", name: "Full Middle Split", path: "flexibility", subPath: "flex-hips", difficulty: 88, nodeType: "final", description: "Full 180-degree middle split flat on the floor.", formCues: ["Hips square", "Both legs fully extended"], progressions: [
    { name: "Half Middle Split (150+ degrees)", reps: "30s hold" },
    { name: "Wall Middle Split (gravity assisted)", reps: "1 rep" },
    { name: "PNF Middle Split (contract-relax, near full)", reps: "1 rep" },
    { name: "Elevated Middle Split (slight elevation)", reps: "1 rep" },
    { name: "Active Middle Split Squeeze (adductors)", reps: "1 rep" },
    { name: "Pancake to Split Transition Drill", reps: "1 rep" },
    { name: "Isometric Split Hold (engage muscles at end range)", reps: "1 rep" },
  ], estimatedMinutes: mins(88) },

  // Sub-branch: flex-spine
  { id: "flex_sp_1", name: "Cat-Cow", path: "flexibility", subPath: "flex-spine", difficulty: 5, nodeType: "regular", description: "Alternate between arching and rounding the spine on all fours.", formCues: ["Full arch then full round", "Move with breath"], progressions: [
    { name: "Seated Spinal Twist", reps: "1 rep" },
    { name: "Pelvic Tilt (lying, anterior/posterior)", reps: "1 rep" },
    { name: "Thoracic Rotation (on all fours)", reps: "1 rep" },
    { name: "Child's Pose to Cobra Flow", reps: "1 rep" },
    { name: "Spinal Wave Drill (standing)", reps: "1 rep" },
  ], estimatedMinutes: mins(5) },

  { id: "flex_sp_2", name: "Cobra Stretch", path: "flexibility", subPath: "flex-spine", difficulty: 10, nodeType: "regular", description: "Lie face down and press chest up for a spinal extension stretch.", formCues: ["Hips stay on floor", "Press through hands"], progressions: [
    { name: "Cat-Cow (full ROM)", reps: "1 rep" },
    { name: "Prone Press-Up (low)", reps: "1 rep" },
    { name: "Sphinx Pose Hold", reps: "15s hold" },
    { name: "Lying Back Extension (no hands)", reps: "1 rep" },
    { name: "Seal Stretch (straight arms, mild)", reps: "1 rep" },
  ], estimatedMinutes: mins(10) },

  { id: "flex_sp_3", name: "Camel Pose", path: "flexibility", subPath: "flex-spine", difficulty: 22, nodeType: "regular", description: "Kneeling backbend reaching hands to heels.", formCues: ["Push hips forward", "Reach back to heels"], progressions: [
    { name: "Cobra Stretch (full ROM)", reps: "20s hold" },
    { name: "Kneeling Hip Flexor Stretch", reps: "1 rep" },
    { name: "Camel Pose with Hands on Lower Back", reps: "1 rep" },
    { name: "Thoracic Extension on Foam Roller", reps: "1 rep" },
    { name: "Kneeling Back Bend (hands on heels attempt)", reps: "1 rep" },
  ], estimatedMinutes: mins(22) },

  { id: "flex_sp_4", name: "Wall Bridge", path: "flexibility", subPath: "flex-spine", difficulty: 35, nodeType: "regular", description: "Bridge with feet on the wall to build toward a full bridge.", formCues: ["Walk hands closer to wall", "Push through shoulders"], progressions: [
    { name: "Camel Pose (full reach)", reps: "15s hold" },
    { name: "Supine Bridge (hips only)", reps: "1 rep" },
    { name: "Wall Walk-Down (hands walk down wall)", reps: "1 rep" },
    { name: "Shoulder Opener (overhead stretch)", reps: "1 rep" },
    { name: "Partial Bridge on Floor", reps: "1 rep" },
  ], estimatedMinutes: mins(35) },

  { id: "flex_sp_5", name: "Full Back Bridge", path: "flexibility", subPath: "flex-spine", difficulty: 48, nodeType: "regular", description: "Full bridge from the floor with arms and legs straight.", formCues: ["Push hips high", "Straighten arms fully"], progressions: [
    { name: "Wall Bridge Hold", reps: "20s hold" },
    { name: "Bridge from Floor Attempt", reps: "1 rep" },
    { name: "Elevated Bridge (hands on bench)", reps: "1 rep" },
    { name: "Camel Pose to Bridge Transition Drill", reps: "1 rep" },
    { name: "Shoulder Flexion Stretch (overhead, at wall)", reps: "1 rep" },
  ], estimatedMinutes: mins(48) },

  { id: "flex_sp_6", name: "Bridge Push-up", path: "flexibility", subPath: "flex-spine", difficulty: 60, nodeType: "regular", description: "Push up into a bridge and lower back down for reps.", formCues: ["Stand up through bridge", "Control the descent"], progressions: [
    { name: "Full Back Bridge Hold", reps: "20s hold" },
    { name: "Bridge Rock (shift weight forward/back)", reps: "1 rep" },
    { name: "Wall Walk-Up to Bridge", reps: "1 rep" },
    { name: "Eccentric Bridge Lower (5s to floor)", reps: "1 rep" },
    { name: "Bridge Shoulder Tap Drill", reps: "1 rep" },
  ], estimatedMinutes: mins(60) },

  { id: "flex_sp_7", name: "Scorpion Stretch", path: "flexibility", subPath: "flex-spine", difficulty: 75, nodeType: "regular", description: "Lie face down and reach one foot over toward the opposite shoulder.", formCues: ["Opposite foot toward shoulder", "Keep chest down"], progressions: [
    { name: "Bridge Push-up (smooth reps)", reps: "1 rep" },
    { name: "Full Bridge (deep arch)", reps: "20s hold" },
    { name: "Lying Spinal Twist (deep)", reps: "1 rep" },
    { name: "Prone Scorpion Kick (partial)", reps: "1 rep" },
    { name: "Hip Flexor Stretch with Quad Pull", reps: "1 rep" },
    { name: "Thoracic Rotation (loaded)", reps: "1 rep" },
  ], estimatedMinutes: mins(75) },

  { id: "flex_sp_8", name: "Chest Stand", path: "flexibility", subPath: "flex-spine", difficulty: 90, nodeType: "final", description: "Extreme backbend with chest on the floor and feet touching the head.", formCues: ["Feet reach toward head", "Chest rests on floor"], progressions: [
    { name: "Scorpion Stretch (deep ROM)", reps: "20s hold" },
    { name: "Bridge with Feet Walking to Head", reps: "1 rep" },
    { name: "Chin Stand Attempt (chest near floor)", reps: "1 rep" },
    { name: "Wall-Assisted Chest Stand", reps: "1 rep" },
    { name: "Deep Camel Pose (head to floor)", reps: "1 rep" },
    { name: "Seal Stretch (max extension)", reps: "1 rep" },
    { name: "Backbend from Standing (kick over attempt)", reps: "1 rep" },
  ], estimatedMinutes: mins(90) },

  // Sub-branch: flex-front-split
  { id: "flex_fs_1", name: "Kneeling Hip Flexor Stretch", path: "flexibility", subPath: "flex-front-split", difficulty: 8, nodeType: "regular", description: "Lunge stretch targeting the hip flexor of the rear leg.", formCues: ["Squeeze rear glute", "Push hips forward"], progressions: [
    { name: "Standing Quad Stretch", reps: "15s hold" },
    { name: "Couch Stretch (mild)", reps: "1 rep" },
    { name: "Kneeling Lunge (upright torso)", reps: "1 rep" },
    { name: "Supine Hip Flexor Stretch", reps: "1 rep" },
    { name: "Glute Activation Bridge", reps: "1 rep" },
  ], estimatedMinutes: mins(8) },

  { id: "flex_fs_2", name: "Low Lunge", path: "flexibility", subPath: "flex-front-split", difficulty: 15, nodeType: "regular", description: "Deep lunge with rear knee on the floor for hip flexor and hamstring stretch.", formCues: ["Sink hips low", "Square hips forward"], progressions: [
    { name: "Half-Kneeling Hip Flexor Stretch", reps: "20s hold" },
    { name: "Lunge to Hamstring Stretch Transition", reps: "1 rep" },
    { name: "Couch Stretch (deeper)", reps: "1 rep" },
    { name: "Low Lunge with Back Foot Elevated", reps: "1 rep" },
    { name: "PNF Hip Flexor (contract-relax)", reps: "1 rep" },
  ], estimatedMinutes: mins(15) },

  { id: "flex_fs_3", name: "Elevated Pigeon Pose", path: "flexibility", subPath: "flex-front-split", difficulty: 25, nodeType: "regular", description: "Pigeon pose with front leg on an elevated surface for deeper hip opening.", formCues: ["Front shin on bench", "Square hips"], progressions: [
    { name: "Low Lunge (deep)", reps: "20s hold" },
    { name: "Floor Pigeon Pose", reps: "1 rep" },
    { name: "Figure-4 Stretch (supine)", reps: "1 rep" },
    { name: "90/90 Hip Stretch", reps: "1 rep" },
    { name: "Elevated Pigeon Forward Fold", reps: "1 rep" },
  ], estimatedMinutes: mins(25) },

  { id: "flex_fs_4", name: "Half Split", path: "flexibility", subPath: "flex-front-split", difficulty: 38, nodeType: "regular", description: "Half split with rear knee on the floor, front leg extended.", formCues: ["Straighten front leg", "Fold over front leg"], progressions: [
    { name: "Elevated Pigeon Pose (deep)", reps: "20s hold" },
    { name: "Kneeling Hamstring Stretch", reps: "1 rep" },
    { name: "Standing Forward Fold (pike)", reps: "1 rep" },
    { name: "PNF Hamstring Stretch (contract-relax)", reps: "1 rep" },
    { name: "Low Lunge to Half Split Flow", reps: "1 rep" },
  ], estimatedMinutes: mins(38) },

  { id: "flex_fs_5", name: "Supported Front Split", path: "flexibility", subPath: "flex-front-split", difficulty: 52, nodeType: "regular", description: "Front split with hands on blocks for support.", formCues: ["Use blocks for support", "Slide into split gradually"], progressions: [
    { name: "Half Split (deep fold)", reps: "20s hold" },
    { name: "Low Lunge (hips very low)", reps: "1 rep" },
    { name: "PNF Split (contract-relax, blocks)", reps: "1 rep" },
    { name: "Split Slide with Socks (on smooth floor)", reps: "1 rep" },
    { name: "Couch Stretch (rear leg, deep)", reps: "1 rep" },
  ], estimatedMinutes: mins(52) },

  { id: "flex_fs_6", name: "Full Front Split", path: "flexibility", subPath: "flex-front-split", difficulty: 70, nodeType: "final", description: "Full front split flat on the floor with hips square.", formCues: ["Hips square", "Both legs fully extended"], progressions: [
    { name: "Supported Front Split (blocks low)", reps: "20s hold" },
    { name: "PNF Front Split (contract-relax)", reps: "1 rep" },
    { name: "Active Split Squeeze (engage muscles at end range)", reps: "1 rep" },
    { name: "Split Slide Eccentric (slow lower)", reps: "1 rep" },
    { name: "Elevated Rear Foot Split (couch stretch deep)", reps: "1 rep" },
    { name: "Isometric Split Hold (push into floor)", reps: "1 rep" },
  ], estimatedMinutes: mins(70) },

  { id: "flex_fs_7", name: "Oversplit", path: "flexibility", subPath: "flex-front-split", difficulty: 85, nodeType: "final", description: "Front split past 180 degrees with front foot elevated.", formCues: ["Front foot on elevation", "Ease in slowly"], progressions: [
    { name: "Full Front Split Hold", reps: "30s hold" },
    { name: "Front Split with Front Foot on Block", reps: "1 rep" },
    { name: "PNF Oversplit (contract-relax, elevated)", reps: "1 rep" },
    { name: "Rear Foot Elevated Split", reps: "1 rep" },
    { name: "Active Oversplit Compression", reps: "1 rep" },
    { name: "Isometric Oversplit Hold (engage at end range)", reps: "1 rep" },
    { name: "Oversplit with Both Feet Elevated", reps: "1 rep" },
  ], estimatedMinutes: mins(85) },
];

// ============================================================
// PROGRESSION EDGES (within sub-branches + special branches)
// ============================================================
export const progressionEdges: ProgressionEdge[] = [
  // Gateway edges — Strength gateway (Forearm Plank) connects to first exercise in each strength sub-path
  { fromId: "core_pk_1", toId: "push_pu_1" },
  { fromId: "core_pk_1", toId: "push_di_1" },
  { fromId: "core_pk_1", toId: "push_sp_1" },
  { fromId: "core_pk_1", toId: "pull_pu_1" },
  { fromId: "core_pk_1", toId: "pull_ro_1" },
  { fromId: "core_pk_1", toId: "pull_tr_1" },
  { fromId: "core_pk_1", toId: "core_lr_1" },
  { fromId: "core_pk_1", toId: "core_sh_1" },
  { fromId: "core_pk_1", toId: "legs_sq_1" },
  { fromId: "core_pk_1", toId: "legs_hi_1" },
  // Gateway edges — Special gateway (Baby Freeze) connects to first exercise in each special sub-path
  { fromId: "bboy_fr_1", toId: "skills_pl_1" },
  { fromId: "bboy_fr_1", toId: "skills_fl_1" },
  { fromId: "bboy_fr_1", toId: "skills_hf_1" },
  { fromId: "bboy_fr_1", toId: "rings_1" },
  { fromId: "bboy_fr_1", toId: "bboy_tr_1" },
  { fromId: "bboy_fr_1", toId: "bboy_fw_1" },
  { fromId: "bboy_fr_1", toId: "bboy_pm_1" },
  // Gateway edges — Flexibility gateway (Toe Touch) connects to first exercise in each flex sub-path
  { fromId: "flex_gateway", toId: "flex_sh_1" },
  { fromId: "flex_gateway", toId: "flex_wr_1" },
  { fromId: "flex_gateway", toId: "flex_pk_1" },
  { fromId: "flex_gateway", toId: "flex_hi_1" },
  { fromId: "flex_gateway", toId: "flex_sp_1" },
  { fromId: "flex_gateway", toId: "flex_fs_1" },
  // Push - pushups
  { fromId: "push_pu_1", toId: "push_pu_2" },
  { fromId: "push_pu_2", toId: "push_pu_3" },
  { fromId: "push_pu_3", toId: "push_pu_4" },
  { fromId: "push_pu_4", toId: "push_pu_5" },
  { fromId: "push_pu_5", toId: "push_pu_6" },
  { fromId: "push_pu_6", toId: "push_pu_7" },
  // Push - dips
  { fromId: "push_di_1", toId: "push_di_2" },
  { fromId: "push_di_2", toId: "push_di_3" },
  { fromId: "push_di_3", toId: "push_di_4" },
  { fromId: "push_di_4", toId: "push_di_5" },
  { fromId: "push_di_5", toId: "push_di_6" },
  // Push - shoulder-press
  { fromId: "push_sp_1", toId: "push_sp_2" },
  { fromId: "push_sp_2", toId: "push_sp_3" },
  { fromId: "push_sp_3", toId: "push_sp_4" },
  { fromId: "push_sp_4", toId: "push_sp_5" },
  { fromId: "push_sp_4", toId: "push_sp_6" },
  { fromId: "push_sp_5", toId: "push_sp_7" },

  // Pull - pullups
  { fromId: "pull_pu_1", toId: "pull_pu_2" },
  { fromId: "pull_pu_2", toId: "pull_pu_3" },
  { fromId: "pull_pu_3", toId: "pull_pu_4" },
  { fromId: "pull_pu_4", toId: "pull_pu_5" },
  { fromId: "pull_pu_5", toId: "pull_pu_6" },
  { fromId: "pull_pu_6", toId: "pull_pu_7" },
  { fromId: "pull_pu_7", toId: "pull_pu_8" },
  // Pull - rows
  { fromId: "pull_ro_1", toId: "pull_ro_2" },
  { fromId: "pull_ro_2", toId: "pull_ro_3" },
  { fromId: "pull_ro_3", toId: "pull_ro_4" },
  // Pull - transitions
  { fromId: "pull_tr_1", toId: "pull_tr_2" },
  { fromId: "pull_tr_2", toId: "pull_tr_3" },
  { fromId: "pull_tr_3", toId: "pull_tr_4" },

  // Core - planks
  { fromId: "core_pk_1", toId: "core_pk_2" },
  { fromId: "core_pk_2", toId: "core_pk_3" },
  { fromId: "core_pk_3", toId: "core_pk_4" },
  { fromId: "core_pk_4", toId: "core_pk_5" },
  { fromId: "core_pk_5", toId: "core_pk_6" },
  // Core - leg-raises
  { fromId: "core_lr_1", toId: "core_lr_2" },
  { fromId: "core_lr_2", toId: "core_lr_3" },
  { fromId: "core_lr_3", toId: "core_lr_4" },
  { fromId: "core_lr_4", toId: "core_lr_5" },
  { fromId: "core_lr_5", toId: "core_lr_6" },
  { fromId: "core_lr_6", toId: "core_lr_7" },
  // Core - static-holds
  { fromId: "core_sh_1", toId: "core_sh_2" },
  { fromId: "core_sh_2", toId: "core_sh_3" },
  { fromId: "core_sh_3", toId: "core_sh_4" },
  { fromId: "core_sh_4", toId: "core_sh_5" },
  { fromId: "core_sh_5", toId: "core_sh_6" },

  // Legs - squats
  { fromId: "legs_sq_1", toId: "legs_sq_2" },
  { fromId: "legs_sq_2", toId: "legs_sq_3" },
  { fromId: "legs_sq_3", toId: "legs_sq_4" },
  { fromId: "legs_sq_4", toId: "legs_sq_5" },
  { fromId: "legs_sq_5", toId: "legs_sq_6" },
  { fromId: "legs_sq_6", toId: "legs_sq_7" },
  { fromId: "legs_sq_7", toId: "legs_sq_8" },
  // Legs - hinges
  { fromId: "legs_hi_1", toId: "legs_hi_2" },
  { fromId: "legs_hi_2", toId: "legs_hi_3" },
  { fromId: "legs_hi_3", toId: "legs_hi_4" },

  // Skills - planche
  { fromId: "skills_pl_1", toId: "skills_pl_2" },
  { fromId: "skills_pl_2", toId: "skills_pl_3" },
  { fromId: "skills_pl_3", toId: "skills_pl_4" },
  { fromId: "skills_pl_4", toId: "skills_pl_5" },
  { fromId: "skills_pl_5", toId: "skills_pl_6" },
  { fromId: "skills_pl_6", toId: "skills_pl_7" },
  // Skills - front-lever
  { fromId: "skills_fl_1", toId: "skills_fl_2" },
  { fromId: "skills_fl_2", toId: "skills_fl_3" },
  { fromId: "skills_fl_3", toId: "skills_fl_4" },
  { fromId: "skills_fl_4", toId: "skills_fl_5" },
  // Skills - human-flag
  { fromId: "skills_hf_1", toId: "skills_hf_2" },
  { fromId: "skills_hf_2", toId: "skills_hf_3" },
  { fromId: "skills_hf_3", toId: "skills_hf_4" },

  // Rings
  { fromId: "rings_1", toId: "rings_2" },
  { fromId: "rings_2", toId: "rings_3" },
  { fromId: "rings_3", toId: "rings_4" },
  { fromId: "rings_4", toId: "rings_5" },
  { fromId: "rings_5", toId: "rings_6" },
  { fromId: "rings_6", toId: "rings_7" },
  { fromId: "rings_7", toId: "rings_8" },

  // Breakdance - toprock
  { fromId: "bboy_tr_1", toId: "bboy_tr_2" },
  { fromId: "bboy_tr_2", toId: "bboy_tr_3" },
  { fromId: "bboy_tr_3", toId: "bboy_tr_4" },
  { fromId: "bboy_tr_4", toId: "bboy_tr_5" },
  { fromId: "bboy_tr_5", toId: "bboy_tr_6" },
  { fromId: "bboy_tr_6", toId: "bboy_tr_7" },
  // Breakdance - footwork
  { fromId: "bboy_fw_1", toId: "bboy_fw_2" },
  { fromId: "bboy_fw_2", toId: "bboy_fw_3" },
  { fromId: "bboy_fw_3", toId: "bboy_fw_4" },
  { fromId: "bboy_fw_4", toId: "bboy_fw_5" },
  { fromId: "bboy_fw_5", toId: "bboy_fw_6" },
  { fromId: "bboy_fw_6", toId: "bboy_fw_7" },
  { fromId: "bboy_fw_7", toId: "bboy_fw_8" },
  // Breakdance - freezes
  { fromId: "bboy_fr_1", toId: "bboy_fr_2" },
  { fromId: "bboy_fr_2", toId: "bboy_fr_3" },
  { fromId: "bboy_fr_3", toId: "bboy_fr_4" },
  { fromId: "bboy_fr_4", toId: "bboy_fr_5" },
  { fromId: "bboy_fr_5", toId: "bboy_fr_6" },
  { fromId: "bboy_fr_6", toId: "bboy_fr_7" },
  { fromId: "bboy_fr_7", toId: "bboy_fr_8" },
  { fromId: "bboy_fr_8", toId: "bboy_fr_9" },
  { fromId: "bboy_fr_9", toId: "bboy_fr_10" },
  // Breakdance - power-moves
  { fromId: "bboy_pm_1", toId: "bboy_pm_2" },
  { fromId: "bboy_pm_2", toId: "bboy_pm_3" },
  { fromId: "bboy_pm_3", toId: "bboy_pm_4" },
  { fromId: "bboy_pm_4", toId: "bboy_pm_5" },
  { fromId: "bboy_pm_5", toId: "bboy_pm_6" },
  // Special branches within power-moves
  { fromId: "bboy_pm_4", toId: "bboy_pm_7" },
  { fromId: "bboy_pm_6", toId: "bboy_pm_8" },
  { fromId: "bboy_pm_7", toId: "bboy_pm_9" },
  { fromId: "bboy_pm_8", toId: "bboy_pm_9" },
  { fromId: "bboy_pm_9", toId: "bboy_pm_10" },

  // Flexibility - flex-shoulders
  { fromId: "flex_sh_1", toId: "flex_sh_2" },
  { fromId: "flex_sh_2", toId: "flex_sh_3" },
  { fromId: "flex_sh_3", toId: "flex_sh_4" },
  { fromId: "flex_sh_4", toId: "flex_sh_5" },
  { fromId: "flex_sh_5", toId: "flex_sh_6" },
  { fromId: "flex_sh_6", toId: "flex_sh_7" },
  { fromId: "flex_sh_7", toId: "flex_sh_8" },
  // Flexibility - flex-wrists
  { fromId: "flex_wr_1", toId: "flex_wr_2" },
  { fromId: "flex_wr_2", toId: "flex_wr_3" },
  { fromId: "flex_wr_3", toId: "flex_wr_4" },
  { fromId: "flex_wr_4", toId: "flex_wr_5" },
  { fromId: "flex_wr_5", toId: "flex_wr_6" },
  { fromId: "flex_wr_6", toId: "flex_wr_7" },
  // Flexibility - flex-pike
  { fromId: "flex_pk_1", toId: "flex_pk_2" },
  { fromId: "flex_pk_2", toId: "flex_pk_3" },
  { fromId: "flex_pk_3", toId: "flex_pk_4" },
  { fromId: "flex_pk_4", toId: "flex_pk_5" },
  { fromId: "flex_pk_5", toId: "flex_pk_6" },
  { fromId: "flex_pk_6", toId: "flex_pk_7" },
  // Flexibility - flex-hips
  { fromId: "flex_hi_1", toId: "flex_hi_2" },
  { fromId: "flex_hi_2", toId: "flex_hi_3" },
  { fromId: "flex_hi_3", toId: "flex_hi_4" },
  { fromId: "flex_hi_4", toId: "flex_hi_5" },
  { fromId: "flex_hi_5", toId: "flex_hi_6" },
  { fromId: "flex_hi_6", toId: "flex_hi_7" },
  { fromId: "flex_hi_7", toId: "flex_hi_8" },
  // Flexibility - flex-spine
  { fromId: "flex_sp_1", toId: "flex_sp_2" },
  { fromId: "flex_sp_2", toId: "flex_sp_3" },
  { fromId: "flex_sp_3", toId: "flex_sp_4" },
  { fromId: "flex_sp_4", toId: "flex_sp_5" },
  { fromId: "flex_sp_5", toId: "flex_sp_6" },
  { fromId: "flex_sp_6", toId: "flex_sp_7" },
  { fromId: "flex_sp_7", toId: "flex_sp_8" },
  // Flexibility - flex-front-split
  { fromId: "flex_fs_1", toId: "flex_fs_2" },
  { fromId: "flex_fs_2", toId: "flex_fs_3" },
  { fromId: "flex_fs_3", toId: "flex_fs_4" },
  { fromId: "flex_fs_4", toId: "flex_fs_5" },
  { fromId: "flex_fs_5", toId: "flex_fs_6" },
  { fromId: "flex_fs_6", toId: "flex_fs_7" },
];

// ============================================================
// CROSS-LINKS (between paths)
// ============================================================
export const crossLinks: CrossLink[] = [
  { fromId: "skills_pl_7", toId: "push_sp_7", reason: "Planche + HS = 90° PU" },
  { fromId: "skills_fl_5", toId: "pull_pu_9", reason: "FL hold + pull strength" },
  { fromId: "flex_sh_6", toId: "rings_3", reason: "Mobility prerequisite" },
  { fromId: "flex_sh_8", toId: "push_sp_4", reason: "Shoulder mobility for HS" },
  { fromId: "flex_wr_6", toId: "skills_pl_2", reason: "Wrist mobility prerequisite" },
  { fromId: "flex_wr_7", toId: "push_sp_4", reason: "Wrist mobility prerequisite" },
  { fromId: "flex_pk_6", toId: "core_sh_2", reason: "Compression for L-Sit" },
  { fromId: "flex_pk_7", toId: "core_sh_6", reason: "Compression for Manna" },
  { fromId: "flex_hi_5", toId: "skills_pl_6", reason: "Hip ROM for straddle planche" },
  { fromId: "flex_hi_5", toId: "skills_fl_4", reason: "Hip ROM for straddle FL" },
  { fromId: "flex_hi_8", toId: "legs_sq_8", reason: "Hip ROM for flare" },
  { fromId: "flex_sp_5", toId: "bboy_fr_7", reason: "Spine flex for hollowback" },
  { fromId: "flex_sp_5", toId: "core_lr_7", reason: "Spine flex for windmill" },
  { fromId: "flex_hi_5", toId: "core_lr_7", reason: "Hip ROM for windmill" },
  { fromId: "push_sp_4", toId: "bboy_pm_8", reason: "HS balance for 1990" },
  { fromId: "skills_pl_4", toId: "bboy_pm_9", reason: "Planche strength for airflare" },
  { fromId: "core_lr_7", toId: "bboy_pm_4", reason: "Core strength for power windmill" },
  { fromId: "skills_pl_2", toId: "bboy_fr_3", reason: "Similar push pattern for turtle freeze" },
  { fromId: "skills_hf_4", toId: "bboy_fr_10", reason: "Human flag → flag freeze" },
  { fromId: "bboy_fw_1", toId: "bboy_pm_7", reason: "Coffee grinder footwork for flare" },
];

export const subPathLabels: Record<SubPath, string> = {
  pushups: "Push-ups", dips: "Dips", "shoulder-press": "Shoulder Press",
  pullups: "Pull-ups", rows: "Rows", transitions: "Transitions",
  planks: "Planks", "leg-raises": "Leg Raises", "static-holds": "Static Holds",
  squats: "Squats", hinges: "Hinges",
  planche: "Planche", "front-lever": "Front Lever", "human-flag": "Human Flag",
  rings: "Rings",
  toprock: "Toprock", footwork: "Footwork", freezes: "Freezes", "power-moves": "Power Moves",
  "flex-shoulders": "Shoulders", "flex-wrists": "Wrists", "flex-pike": "Pike",
  "flex-hips": "Hips", "flex-spine": "Spine", "flex-front-split": "Front Split",
};

export const pathSubPaths: Record<PathName, SubPath[]> = {
  push: ["pushups", "dips", "shoulder-press"],
  pull: ["pullups", "rows", "transitions"],
  core: ["planks", "leg-raises", "static-holds"],
  legs: ["squats", "hinges"],
  skills: ["planche", "front-lever", "human-flag"],
  rings: ["rings"],
  breakdance: ["toprock", "footwork", "freezes", "power-moves"],
  flexibility: ["flex-shoulders", "flex-wrists", "flex-pike", "flex-hips", "flex-spine", "flex-front-split"],
};

export function getExercisesByPath(path: PathName): Exercise[] {
  return exercises.filter((e) => e.path === path).sort((a, b) => a.difficulty - b.difficulty);
}

export function getExercisesBySubPath(subPath: SubPath): Exercise[] {
  return exercises.filter((e) => e.subPath === subPath).sort((a, b) => a.difficulty - b.difficulty);
}

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function getVideoSearchUrl(exercise: Exercise): string {
  const query = encodeURIComponent(`${exercise.name} tutorial calisthenics how to`);
  return `https://www.youtube.com/results?search_query=${query}`;
}
