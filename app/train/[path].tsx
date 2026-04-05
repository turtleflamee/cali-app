import { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { exercises, PathName } from "../../data/exercises";
import {
  getProfile,
  toggleMilestone,
  markExerciseComplete,
  UserProfile,
} from "../../data/storage";
import { getMilestones } from "../../data/milestones";
import { colors, pathColors } from "../../data/theme";

export default function MilestoneScreen() {
  const { path } = useLocalSearchParams<{ path: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const reload = useCallback(() => {
    getProfile().then(setProfile);
  }, []);

  useFocusEffect(reload);

  if (!profile || !path) return <View style={styles.container} />;

  const pathName = path as PathName;
  const assessedLevel = profile.assessedLevels[pathName];
  // Find the next exercise to work on (easiest one above assessed level)
  const currentExercise = exercises
    .filter((e) => e.path === pathName && e.difficulty > assessedLevel)
    .sort((a, b) => a.difficulty - b.difficulty)[0] ?? null;

  if (!currentExercise) {
    return (
      <>
        <Stack.Screen options={{ headerTitle: "Complete!" }} />
        <View style={[styles.container, styles.center]}>
          <Text style={styles.completeEmoji}>🏆</Text>
          <Text style={styles.completeText}>Path Complete!</Text>
        </View>
      </>
    );
  }

  const milestones = getMilestones(currentExercise.id);
  const completedMs = new Set(profile.completedMilestones);
  const completedCount = milestones.filter((m) => completedMs.has(m.id)).length;
  const allDone = completedCount === milestones.length && milestones.length > 0;
  const pathColor = pathColors[pathName];

  // Find the first uncompleted milestone (the "next" one)
  const nextMilestoneId = milestones.find((m) => !completedMs.has(m.id))?.id;

  const handleToggle = async (milestoneId: string) => {
    await toggleMilestone(milestoneId);
    reload();
  };

  const handleMaster = () => {
    Alert.alert(
      "Mark as Mastered",
      `You've completed all milestones for ${currentExercise.name}! Mark it as mastered?`,
      [
        { text: "Not yet", style: "cancel" },
        {
          text: "Mastered!",
          onPress: async () => {
            await markExerciseComplete(currentExercise.id);
            reload();
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: currentExercise.name,
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 24 },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.levelBadge, { backgroundColor: pathColor }]}>
              <Text style={styles.levelText}>Difficulty {currentExercise.difficulty}/100</Text>
            </View>
            <Text style={styles.progressFraction}>
              {completedCount}/{milestones.length} milestones
            </Text>
          </View>

          <Text style={styles.exerciseName}>{currentExercise.name}</Text>

          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0}%` as any,
                  backgroundColor: pathColor,
                },
              ]}
            />
          </View>

          {/* Milestone timeline */}
          <View style={styles.timeline}>
            {milestones.map((milestone, i) => {
              const isDone = completedMs.has(milestone.id);
              const isNext = milestone.id === nextMilestoneId;
              const isLast = i === milestones.length - 1;

              return (
                <View key={milestone.id} style={styles.milestoneRow}>
                  {/* Vertical line */}
                  <View style={styles.lineColumn}>
                    {i > 0 && (
                      <View
                        style={[
                          styles.lineSegment,
                          {
                            backgroundColor: isDone || isNext
                              ? pathColor
                              : colors.locked,
                          },
                        ]}
                      />
                    )}
                    {/* Circle node */}
                    <TouchableOpacity
                      style={[
                        styles.circleNode,
                        isDone && {
                          backgroundColor: colors.success,
                          borderColor: colors.success,
                        },
                        isNext &&
                          !isDone && {
                            backgroundColor: pathColor,
                            borderColor: pathColor,
                          },
                        !isDone &&
                          !isNext && {
                            backgroundColor: "transparent",
                            borderColor: colors.locked,
                          },
                      ]}
                      onPress={() => handleToggle(milestone.id)}
                      activeOpacity={0.6}
                    >
                      {isDone && (
                        <Text style={styles.checkIcon}>✓</Text>
                      )}
                      {isLast && !isDone && (
                        <Text style={styles.starIcon}>★</Text>
                      )}
                    </TouchableOpacity>
                    {/* Line below (except last) */}
                    {!isLast && (
                      <View
                        style={[
                          styles.lineSegment,
                          {
                            backgroundColor: isDone
                              ? pathColor
                              : colors.locked,
                          },
                        ]}
                      />
                    )}
                  </View>

                  {/* Milestone content */}
                  <TouchableOpacity
                    style={[
                      styles.milestoneContent,
                      isDone && styles.milestoneContentDone,
                      isNext && !isDone && styles.milestoneContentNext,
                    ]}
                    onPress={() => handleToggle(milestone.id)}
                    activeOpacity={0.6}
                  >
                    {milestone.isPrerequisite && (
                      <Text style={styles.prereqLabel}>from previous</Text>
                    )}
                    <Text
                      style={[
                        styles.milestoneDesc,
                        isDone && styles.milestoneDescDone,
                      ]}
                    >
                      {milestone.description}
                    </Text>
                    <Text style={styles.milestoneMetric}>
                      {milestone.metric}
                    </Text>
                    {isLast && (
                      <Text style={styles.masteredLabel}>MASTERED</Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* Master button */}
          {allDone && (
            <TouchableOpacity
              style={[styles.masterBtn, { backgroundColor: pathColor }]}
              onPress={handleMaster}
              activeOpacity={0.8}
            >
              <Text style={styles.masterBtnText}>
                Mark {currentExercise.name} as Mastered
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { justifyContent: "center", alignItems: "center" },
  content: { padding: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  levelText: { color: colors.text, fontSize: 14, fontWeight: "700" },
  progressFraction: { color: colors.textDim, fontSize: 14, fontWeight: "600" },
  exerciseName: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 16,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.locked,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 28,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  completeEmoji: { fontSize: 48, marginBottom: 12 },
  completeText: { fontSize: 24, fontWeight: "800", color: colors.success },
  // Timeline
  timeline: {},
  milestoneRow: {
    flexDirection: "row",
    minHeight: 70,
  },
  lineColumn: {
    width: 36,
    alignItems: "center",
  },
  lineSegment: {
    width: 3,
    flex: 1,
  },
  circleNode: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  checkIcon: { color: colors.text, fontSize: 14, fontWeight: "800" },
  starIcon: { color: colors.breaking, fontSize: 12 },
  milestoneContent: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 8,
  },
  milestoneContentDone: {
    opacity: 0.6,
  },
  milestoneContentNext: {
    borderWidth: 1,
    borderColor: colors.cardLight,
  },
  prereqLabel: {
    fontSize: 10,
    color: colors.textDim,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  milestoneDesc: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  milestoneDescDone: {
    textDecorationLine: "line-through",
    color: colors.textDim,
  },
  milestoneMetric: {
    fontSize: 13,
    color: colors.textDim,
    fontWeight: "500",
  },
  masteredLabel: {
    fontSize: 10,
    color: colors.breaking,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 4,
  },
  masterBtn: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 20,
  },
  masterBtnText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
});
