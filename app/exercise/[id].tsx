import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getExerciseById, getVideoSearchUrl, getExercisesBySubPath, exercises, gatewayExercises, getCategory, categoryPaths, pathSubPaths } from "../../data/exercises";
import { getProfile, markExerciseComplete, UserProfile } from "../../data/storage";
import { getUnlocks } from "../../data/unlock-tree";
import { colors, pathColors } from "../../data/theme";

let ConfettiCannon: any = null;
try { ConfettiCannon = require("react-native-confetti-cannon"); } catch {}

const { width: WIN_W, height: WIN_H } = Dimensions.get("window");

export default function ExerciseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const exercise = getExerciseById(id);
  const [completed, setCompleted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p);
      if (p?.completedExercises.includes(id)) {
        setCompleted(true);
      }
    });
  }, [id]);

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Exercise not found</Text>
      </View>
    );
  }

  const pathColor = pathColors[exercise.path];

  // Determine if unlocked: gateway exercises always unlocked, first in sub-path unlocked if gateway done,
  // or if previous exercise in sub-path chain is completed
  const isUnlocked = (): boolean => {
    if (!profile) return false;
    const isGateway = Object.values(gatewayExercises).includes(exercise.id);
    if (isGateway) return true;
    // First exercise in sub-path: unlocked if gateway is completed
    const subExercises = getExercisesBySubPath(exercise.subPath);
    if (subExercises.length > 0 && subExercises[0].id === exercise.id) {
      const cat = getCategory(exercise.path);
      const gwId = gatewayExercises[cat];
      return profile.completedExercises.includes(gwId);
    }
    // Otherwise: unlocked if difficulty check passes OR previous in sub-path is completed
    if (exercise.difficulty <= profile.assessedLevels[exercise.path]) return true;
    // Check if the exercise right before this one in the sub-path is completed
    const idx = subExercises.findIndex(e => e.id === exercise.id);
    if (idx > 0 && profile.completedExercises.includes(subExercises[idx - 1].id)) return true;
    return false;
  };
  const unlocked = isUnlocked();

  const [showCelebration, setShowCelebration] = useState(false);
  const [unlockedExercises, setUnlockedExercises] = useState<string[]>([]);
  const confettiRef = useRef<any>(null);
  const router = useRouter();
  const celebrationScale = useRef(new Animated.Value(0)).current;

  const handleComplete = async () => {
    // Get what this exercise unlocks BEFORE marking complete
    const unlocks = getUnlocks(exercise.id);
    const unlockedNames = unlocks
      .map(id => exercises.find(e => e.id === id))
      .filter(Boolean)
      .map(e => e!.name);

    await markExerciseComplete(exercise.id);
    setCompleted(true);
    setUnlockedExercises(unlockedNames);
    setShowCelebration(true);

    // Animate celebration
    Animated.spring(celebrationScale, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();

    // Fire confetti
    setTimeout(() => confettiRef.current?.start(), 200);
  };

  if (showCelebration) {
    return (
      <>
        <Stack.Screen options={{ headerTitle: "Completed!" }} />
        <View style={[styles.container, styles.celebrationContainer]}>
          {ConfettiCannon && (
            <ConfettiCannon
              ref={confettiRef}
              count={80}
              origin={{ x: WIN_W / 2, y: -20 }}
              autoStart={true}
              fadeOut={true}
              fallSpeed={2500}
              colors={[pathColor, "#FFD700", "#00C851", "#FFFFFF", "#FF69B4"]}
            />
          )}
          <Animated.View style={[styles.celebrationContent, { transform: [{ scale: celebrationScale }] }]}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.celebrationTitle}>Exercise Mastered!</Text>
            <Text style={styles.celebrationExName}>{exercise.name}</Text>

            {unlockedExercises.length > 0 && (
              <View style={styles.unlockedSection}>
                <Text style={styles.unlockedTitle}>New paths unlocked:</Text>
                {unlockedExercises.map((name, i) => (
                  <View key={i} style={[styles.unlockedItem, { borderLeftColor: pathColor }]}>
                    <Text style={styles.unlockedIcon}>🔓</Text>
                    <Text style={styles.unlockedName}>{name}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[styles.celebrationBtn, { backgroundColor: pathColor }]}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.celebrationBtnText}>Back to Web</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: exercise.name }} />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 24 },
          ]}
        >
          <View style={styles.header}>
            <View
              style={[styles.levelBadge, { backgroundColor: pathColor }]}
            >
              <Text style={styles.levelText}>Difficulty: {exercise.difficulty}/100</Text>
            </View>
            {!unlocked && (
              <View style={styles.lockedBadge}>
                <Text style={styles.lockedText}>🔒 Locked</Text>
              </View>
            )}
          </View>

          <Text style={styles.name}>{exercise.name}</Text>
          <Text style={styles.pathLabel}>
            {exercise.path.charAt(0).toUpperCase() + exercise.path.slice(1)}{" "}
            Path
          </Text>

          {/* Video tutorial button */}
          <TouchableOpacity
            style={styles.videoBtn}
            onPress={() => Linking.openURL(getVideoSearchUrl(exercise))}
            activeOpacity={0.7}
          >
            <Text style={styles.videoBtnIcon}>▶</Text>
            <Text style={styles.videoBtnText}>Watch Tutorials</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{exercise.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Form Cues</Text>
            {exercise.formCues.map((cue, i) => (
              <View key={i} style={styles.cueRow}>
                <View
                  style={[styles.cueDot, { backgroundColor: pathColor }]}
                />
                <Text style={styles.cueText}>{cue}</Text>
              </View>
            ))}
          </View>

          {/* Progressions — how to get here */}
          {exercise.progressions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How to Get Here</Text>
              <Text style={styles.sectionSubtitle}>
                Training drills to build up to this exercise
              </Text>
              {exercise.progressions.map((prog, i) => (
                <View key={i} style={styles.progressionRow}>
                  <View
                    style={[
                      styles.progressionNumber,
                      { backgroundColor: pathColor },
                    ]}
                  >
                    <Text style={styles.progressionNumberText}>
                      {i + 1}
                    </Text>
                  </View>
                  <View style={styles.progressionInfo}>
                    <Text style={styles.progressionName}>{prog.name}</Text>
                    <Text style={styles.progressionReps}>{prog.reps}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.progVideoBtn}
                    onPress={() => {
                      const q = encodeURIComponent(
                        `${prog.name} tutorial calisthenics`
                      );
                      Linking.openURL(
                        `https://www.youtube.com/results?search_query=${q}`
                      );
                    }}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.progVideoBtnText}>▶</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Complete button — only show if unlocked */}
          {unlocked && (
            <TouchableOpacity
              style={[
                styles.completeButton,
                completed && styles.completedButton,
              ]}
              onPress={handleComplete}
              disabled={completed}
              activeOpacity={0.8}
            >
              <Text style={styles.completeButtonText}>
                {completed ? "✓ Completed" : "Mark as Completed"}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  levelBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  levelText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  lockedBadge: {
    backgroundColor: "rgba(51,51,85,0.5)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  lockedText: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: "700",
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  pathLabel: {
    fontSize: 15,
    color: colors.textDim,
    marginBottom: 28,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textDim,
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
    color: colors.textDim,
    lineHeight: 24,
    marginTop: 8,
  },
  cueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    marginRight: 12,
  },
  cueText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    flex: 1,
  },
  // Progressions
  progressionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
  },
  progressionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  progressionNumberText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  progressionInfo: {
    flex: 1,
  },
  progressionName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  progressionReps: {
    color: colors.textDim,
    fontSize: 13,
    marginTop: 2,
  },
  progVideoBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(233,69,96,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  progVideoBtnText: {
    color: "#E94560",
    fontSize: 12,
  },
  videoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#E94560",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 24,
  },
  videoBtnIcon: {
    color: "#E94560",
    fontSize: 16,
  },
  videoBtnText: {
    color: "#E94560",
    fontSize: 15,
    fontWeight: "700",
  },
  completeButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  completedButton: {
    backgroundColor: colors.success,
  },
  completeButtonText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  errorText: {
    color: colors.textDim,
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
  // Celebration styles
  celebrationContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  celebrationContent: {
    alignItems: "center",
    width: "100%",
  },
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 8,
  },
  celebrationExName: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textDim,
    marginBottom: 32,
  },
  unlockedSection: {
    width: "100%",
    marginBottom: 32,
  },
  unlockedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  unlockedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 14,
    marginBottom: 8,
    gap: 10,
  },
  unlockedIcon: {
    fontSize: 18,
  },
  unlockedName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  celebrationBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  celebrationBtnText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
});
