import { Exercise, exercises, PathName } from "./exercises";
import { UserProfile } from "./storage";

export interface WorkoutItem {
  name: string;
  reps: string;
  estimatedMinutes: number;
  fromExercise: Exercise; // the exercise this progression leads to
}

export interface Workout {
  items: WorkoutItem[];
  totalMinutes: number;
  paths: PathName[];
}

// Estimate time for a progression drill based on its reps string
function estimateProgressionTime(reps: string): number {
  // "3x15" -> ~4 min (3 sets of 15 reps + rest)
  // "3x20s" -> ~3 min (3 sets of 20s holds + rest)
  // "10 attempts" -> ~5 min
  // "3x5 each" -> ~5 min (bilateral)

  const lower = reps.toLowerCase();

  if (lower.includes("attempts")) {
    const num = parseInt(lower) || 10;
    return Math.ceil(num / 2); // ~30s per attempt
  }

  const setsMatch = lower.match(/(\d+)x(\d+)/);
  if (setsMatch) {
    const sets = parseInt(setsMatch[1]);
    const repsOrSecs = parseInt(setsMatch[2]);
    const isHold = lower.includes("s");
    const isBilateral = lower.includes("each");

    let timePerSet: number;
    if (isHold) {
      timePerSet = repsOrSecs / 60 + 0.5; // hold time + rest
    } else {
      timePerSet = (repsOrSecs * 3) / 60 + 0.75; // ~3s per rep + rest
    }

    let total = sets * timePerSet;
    if (isBilateral) total *= 1.5; // extra time for each side
    return Math.max(2, Math.ceil(total));
  }

  return 3; // default
}

export function generateWorkout(
  profile: UserProfile,
  selectedPaths: PathName[],
  targetMinutes: number
): Workout {
  // For each selected path, find exercises at and just above the user's difficulty threshold
  // and pull their progressions for training.
  const items: WorkoutItem[] = [];

  for (const path of selectedPaths) {
    const assessedLevel = profile.assessedLevels[path];
    const pathExercises = exercises
      .filter((e) => e.path === path)
      .sort((a, b) => a.difficulty - b.difficulty);

    // Get the next exercise to work toward (easiest one above assessed level)
    const nextExercise = pathExercises.find((e) => e.difficulty > assessedLevel);
    // Get the hardest unlocked exercise for maintenance
    const currentExercise = pathExercises
      .filter((e) => e.difficulty <= assessedLevel)
      .sort((a, b) => b.difficulty - a.difficulty)[0] ?? null;

    // Prioritize progressions from the next exercise (what you're training for)
    const targetExercises: Exercise[] = [];
    if (nextExercise) targetExercises.push(nextExercise);
    if (currentExercise) targetExercises.push(currentExercise);

    for (const ex of targetExercises) {
      for (const prog of ex.progressions) {
        items.push({
          name: prog.name,
          reps: prog.reps,
          estimatedMinutes: estimateProgressionTime(prog.reps),
          fromExercise: ex,
        });
      }
    }
  }

  if (items.length === 0) {
    return { items: [], totalMinutes: 0, paths: selectedPaths };
  }

  // Build the workout by round-robin picking from each path, staying under time
  const byPath: Record<string, WorkoutItem[]> = {};
  for (const path of selectedPaths) {
    byPath[path] = items.filter((item) => item.fromExercise.path === path);
  }

  const workout: WorkoutItem[] = [];
  let remaining = targetMinutes;
  let pathIndex = 0;
  const pathList = selectedPaths.filter((p) => (byPath[p]?.length ?? 0) > 0);
  const usedNames = new Set<string>();
  let stuckCount = 0;

  while (remaining > 0 && stuckCount < pathList.length) {
    const path = pathList[pathIndex % pathList.length];
    const pathItems = byPath[path];

    const next = pathItems.find((item) => !usedNames.has(item.name));

    if (next && next.estimatedMinutes <= remaining) {
      workout.push(next);
      usedNames.add(next.name);
      remaining -= next.estimatedMinutes;
      stuckCount = 0;
    } else {
      stuckCount++;
    }

    pathIndex++;
  }

  const totalMinutes = workout.reduce((sum, w) => sum + w.estimatedMinutes, 0);

  return { items: workout, totalMinutes, paths: selectedPaths };
}
