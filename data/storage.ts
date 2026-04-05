import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { milestonesByExercise } from "./milestones";

// Lazy import to avoid circular deps and web crashes
async function resetNotificationTimer() {
  if (Platform.OS === "web") return;
  try {
    const { scheduleInactivityReminder } = await import("./notifications");
    await scheduleInactivityReminder();
  } catch {}
}

export interface UserProfile {
  goal: "strength" | "breaking" | "both";
  assessedLevels: {
    push: number;
    pull: number;
    core: number;
    legs: number;
    skills: number;
    rings: number;
    breakdance: number;
    flexibility: number;
  };
  completedExercises: string[];
  completedMilestones: string[];
  streak: number;
  lastTrainedDate: string | null; // ISO date string "2026-04-04"
}

const PROFILE_KEY = "user_profile";
const ONBOARDED_KEY = "has_onboarded";

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  await AsyncStorage.setItem(ONBOARDED_KEY, "true");
}

export async function getProfile(): Promise<UserProfile | null> {
  const data = await AsyncStorage.getItem(PROFILE_KEY);
  if (!data) return null;

  const profile: UserProfile = JSON.parse(data);

  // Migrate old profiles
  if (!profile.completedMilestones) profile.completedMilestones = [];
  if (profile.streak === undefined) profile.streak = 0;
  if (profile.lastTrainedDate === undefined) profile.lastTrainedDate = null;

  return profile;
}

export async function hasOnboarded(): Promise<boolean> {
  const val = await AsyncStorage.getItem(ONBOARDED_KEY);
  return val === "true";
}

export async function markExerciseComplete(
  exerciseId: string
): Promise<void> {
  const profile = await getProfile();
  if (!profile) return;

  if (!profile.completedExercises.includes(exerciseId)) {
    profile.completedExercises.push(exerciseId);
  }

  // Auto-complete all milestones for this exercise
  const ms = milestonesByExercise[exerciseId];
  if (ms) {
    for (const m of ms) {
      if (!profile.completedMilestones.includes(m.id)) {
        profile.completedMilestones.push(m.id);
      }
    }
  }

  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  resetNotificationTimer();
}

export async function toggleMilestone(milestoneId: string): Promise<void> {
  const profile = await getProfile();
  if (!profile) return;

  const index = profile.completedMilestones.indexOf(milestoneId);
  if (index === -1) {
    profile.completedMilestones.push(milestoneId);
    // Completing a milestone counts as training
    const today = getTodayStr();
    if (profile.lastTrainedDate !== today) {
      if (profile.lastTrainedDate) {
        const gap = daysBetween(profile.lastTrainedDate, today);
        profile.streak = gap === 1 ? (profile.streak || 0) + 1 : 1;
      } else {
        profile.streak = 1;
      }
      profile.lastTrainedDate = today;
    }
  } else {
    profile.completedMilestones.splice(index, 1);
  }

  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  resetNotificationTimer();
}

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86400000;
  return Math.floor(
    (new Date(b).getTime() - new Date(a).getTime()) / msPerDay
  );
}

export async function recordTraining(): Promise<void> {
  const profile = await getProfile();
  if (!profile) return;

  const today = getTodayStr();

  if (profile.lastTrainedDate === today) {
    // Already recorded today
    return;
  }

  if (profile.lastTrainedDate) {
    const gap = daysBetween(profile.lastTrainedDate, today);
    if (gap === 1) {
      // Consecutive day — extend streak
      profile.streak = (profile.streak || 0) + 1;
    } else if (gap > 1) {
      // Missed a day — reset streak
      profile.streak = 1;
    }
  } else {
    // First ever training
    profile.streak = 1;
  }

  profile.lastTrainedDate = today;
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getStreakInfo(profile: UserProfile): {
  streak: number;
  trainedToday: boolean;
  daysSinceLastTrain: number | null;
} {
  const today = getTodayStr();
  const trainedToday = profile.lastTrainedDate === today;
  const daysSince = profile.lastTrainedDate
    ? daysBetween(profile.lastTrainedDate, today)
    : null;

  // If they haven't trained today and gap > 1, streak is broken
  let streak = profile.streak || 0;
  if (!trainedToday && daysSince !== null && daysSince > 1) {
    streak = 0;
  }

  return { streak, trainedToday, daysSinceLastTrain: daysSince };
}

export async function resetProfile(): Promise<void> {
  await AsyncStorage.clear();
}
