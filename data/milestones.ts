import { Milestone } from "./exercises";

export const milestonesByExercise: Record<string, Milestone[]> = {
  "handstand-hold": [
    { id: "handstand-hold-m1", description: "Prerequisite: 3x12 Diamond Push-ups", metric: "3x12", isPrerequisite: true },
    { id: "handstand-hold-m2", description: "3x3 Wall Walks to full height", metric: "3x3" },
    { id: "handstand-hold-m3", description: "3x20s Pike Hold on box (shoulders overhead)", metric: "3x20s" },
    { id: "handstand-hold-m4", description: "3x15s Chest-to-Wall Handstand Hold", metric: "3x15s" },
    { id: "handstand-hold-m5", description: "30s Chest-to-Wall Handstand Hold", metric: "1x30s" },
    { id: "handstand-hold-m6", description: "5 Kick-up to Wall entries (back-to-wall)", metric: "5 entries" },
    { id: "handstand-hold-m7", description: "3x10s Back-to-Wall Handstand Hold", metric: "3x10s" },
    { id: "handstand-hold-m8", description: "5s Freestanding Handstand", metric: "5s hold" },
    { id: "handstand-hold-m9", description: "10s Freestanding Handstand", metric: "10s hold" },
  ],
};

export function getMilestones(exerciseId: string): Milestone[] {
  return milestonesByExercise[exerciseId] ?? [];
}

export function getExerciseMilestoneProgress(
  exerciseId: string,
  completedMilestones: string[]
): { completed: number; total: number } {
  const milestones = getMilestones(exerciseId);
  if (milestones.length === 0) return { completed: 0, total: 0 };
  const completed = milestones.filter((m) =>
    completedMilestones.includes(m.id)
  ).length;
  return { completed, total: milestones.length };
}
