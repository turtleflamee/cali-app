import { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { exercises, PathName } from "../../data/exercises";
import { getProfile, UserProfile } from "../../data/storage";
import { getVisibleExercises } from "../../data/unlock-tree";
import { getExerciseMilestoneProgress, getMilestones } from "../../data/milestones";
import { colors, pathColors, pathIcons } from "../../data/theme";

const pathLabels: Record<PathName, string> = {
  push: "Push",
  pull: "Pull",
  core: "Core",
  legs: "Legs",
  skills: "Skills",
  rings: "Rings",
  breakdance: "Breakdance",
  flexibility: "Flexibility",
};

const paths: PathName[] = ["push", "pull", "core", "legs", "skills", "rings", "breakdance", "flexibility"];

export default function TrainScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      getProfile().then(setProfile);
    }, [])
  );

  if (!profile) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16 },
        ]}
      >
        <Text style={styles.pageTitle}>Train</Text>
        <Text style={styles.subtitle}>
          Tap a path to see your milestone progression
        </Text>

        {paths.map((path) => {
          // Find next exercise: visible on this path but not completed
          const visibleSet = getVisibleExercises(profile.completedExercises);
          const completedSet = new Set(profile.completedExercises);
          const nextExercise = exercises
            .filter((e) => e.path === path && visibleSet.has(e.id) && !completedSet.has(e.id))
            .sort((a, b) => a.difficulty - b.difficulty)[0] ?? null;
          const pathColor = pathColors[path];

          if (!nextExercise) {
            // Past all exercises in this path
            return (
              <View
                key={path}
                style={[styles.pathCard, { borderColor: colors.success }]}
              >
                <Text style={styles.pathIcon}>{pathIcons[path]}</Text>
                <View style={styles.pathInfo}>
                  <Text style={styles.pathName}>{pathLabels[path]}</Text>
                  <Text style={[styles.pathStatus, { color: colors.success }]}>
                    Path Complete!
                  </Text>
                </View>
              </View>
            );
          }

          const milestones = getMilestones(nextExercise.id);
          const hasMilestones = milestones.length > 0;
          const progress = hasMilestones
            ? getExerciseMilestoneProgress(
                nextExercise.id,
                profile.completedMilestones
              )
            : null;

          return (
            <TouchableOpacity
              key={path}
              style={[styles.pathCard, { borderColor: pathColor }]}
              onPress={() => {
                if (hasMilestones) {
                  router.push(`/train/${path}`);
                }
              }}
              activeOpacity={hasMilestones ? 0.7 : 1}
            >
              <Text style={styles.pathIcon}>{pathIcons[path]}</Text>
              <View style={styles.pathInfo}>
                <Text style={styles.pathName}>{pathLabels[path]}</Text>
                <Text style={styles.exerciseName}>
                  {nextExercise.name}
                </Text>
                {hasMilestones && progress ? (
                  <>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${(progress.completed / progress.total) * 100}%` as any,
                            backgroundColor: pathColor,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {progress.completed}/{progress.total} milestones
                    </Text>
                  </>
                ) : (
                  <Text style={styles.noMilestones}>
                    Milestones coming soon
                  </Text>
                )}
              </View>
              {hasMilestones && (
                <Text style={styles.arrow}>›</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 40 },
  pageTitle: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 15, color: colors.textDim, marginBottom: 24 },
  pathCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
  },
  pathIcon: { fontSize: 28, marginRight: 14 },
  pathInfo: { flex: 1 },
  pathName: { fontSize: 13, fontWeight: "600", color: colors.textDim, marginBottom: 2 },
  exerciseName: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 8 },
  pathStatus: { fontSize: 16, fontWeight: "700" },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.locked,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: { fontSize: 12, color: colors.textDim },
  noMilestones: { fontSize: 13, color: colors.textDim, fontStyle: "italic" },
  arrow: { fontSize: 24, color: colors.textDim, marginLeft: 8 },
});
