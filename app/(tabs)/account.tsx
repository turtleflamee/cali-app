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
import { getProfile, resetProfile, getStreakInfo, UserProfile } from "../../data/storage";
import { exercises, PathName } from "../../data/exercises";
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

export default function AccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getProfile().then(setProfile);
      setConfirmReset(false);
    }, [])
  );

  const completedCount = profile?.completedExercises.length ?? 0;
  const totalExercises = exercises.length;

  const handleReset = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    // Second tap — actually reset
    await resetProfile();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16 },
        ]}
      >
        <Text style={styles.pageTitle}>Account</Text>

        {/* Streak */}
        {profile && (() => {
          const { streak, trainedToday, daysSinceLastTrain } = getStreakInfo(profile);
          return (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Streak</Text>
              <View style={styles.streakRow}>
                <Text style={styles.streakEmoji}>
                  {streak >= 7 ? "🔥" : streak >= 3 ? "⚡" : "💪"}
                </Text>
                <View>
                  <Text style={styles.bigStat}>{streak} day{streak !== 1 ? "s" : ""}</Text>
                  <Text style={styles.statLabel}>
                    {trainedToday
                      ? "Trained today — nice!"
                      : daysSinceLastTrain === 1
                        ? "Train today to keep your streak!"
                        : daysSinceLastTrain && daysSinceLastTrain > 1
                          ? `${daysSinceLastTrain} days since last session`
                          : "Start training to build a streak"}
                  </Text>
                </View>
              </View>
            </View>
          );
        })()}

        {/* Progress overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress</Text>
          <Text style={styles.bigStat}>
            {completedCount}/{totalExercises}
          </Text>
          <Text style={styles.statLabel}>exercises completed</Text>
        </View>

        {/* Per-path levels */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Levels</Text>
          {paths.map((path) => {
            const difficultyThreshold = profile?.assessedLevels[path] ?? 20;
            // Convert difficulty threshold to a 1-5 display level
            const displayLevel = Math.min(5, Math.max(1, Math.round(difficultyThreshold / 20)));
            const pathCompleted = exercises.filter(
              (e) =>
                e.path === path &&
                profile?.completedExercises.includes(e.id)
            ).length;
            const pathTotal = exercises.filter(
              (e) => e.path === path
            ).length;

            return (
              <View key={path} style={styles.pathRow}>
                <Text style={styles.pathIcon}>{pathIcons[path]}</Text>
                <View style={styles.pathInfo}>
                  <Text style={styles.pathName}>{pathLabels[path]}</Text>
                  <Text style={styles.pathMeta}>
                    Level {displayLevel} ({difficultyThreshold}/100) · {pathCompleted}/{pathTotal}{" "}
                    done
                  </Text>
                </View>
                <View style={styles.levelDots}>
                  {[1, 2, 3, 4, 5].map((l) => (
                    <View
                      key={l}
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            l <= displayLevel ? pathColors[path] : colors.locked,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        {/* Reset */}
        <TouchableOpacity
          style={[styles.resetBtn, confirmReset && styles.resetBtnConfirm]}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={[styles.resetBtnText, confirmReset && styles.resetBtnTextConfirm]}>
            {confirmReset ? "Tap again to confirm reset" : "Reset Progress"}
          </Text>
        </TouchableOpacity>
        {confirmReset && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setConfirmReset(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 40 },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textDim,
    marginBottom: 12,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakEmoji: {
    fontSize: 40,
    marginRight: 14,
  },
  bigStat: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textDim,
    marginTop: 2,
  },
  pathRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardLight,
  },
  pathIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  pathInfo: {
    flex: 1,
  },
  pathName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  pathMeta: {
    fontSize: 13,
    color: colors.textDim,
    marginTop: 2,
  },
  levelDots: {
    flexDirection: "row",
    gap: 5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  resetBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#663333",
    alignItems: "center",
  },
  resetBtnText: {
    color: "#FF6666",
    fontSize: 15,
    fontWeight: "600",
  },
  resetBtnConfirm: {
    backgroundColor: "#661111",
    borderColor: "#FF3333",
  },
  resetBtnTextConfirm: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  cancelBtn: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  cancelBtnText: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: "600",
  },
});
