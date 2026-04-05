import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PathName, Exercise, getExercisesByPath } from "../../data/exercises";
import { saveProfile } from "../../data/storage";
import { colors, pathColors, pathIcons } from "../../data/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDER_WIDTH = SCREEN_WIDTH - 80;
const NOTCH_COUNT = 5;
const NOTCH_SPACING = SLIDER_WIDTH / (NOTCH_COUNT - 1);

// 5 notches mapping to difficulty thresholds
const DIFFICULTY_THRESHOLDS = [20, 40, 60, 80, 100];

const paths: PathName[] = ["push", "pull", "core", "legs", "skills", "rings", "breakdance", "flexibility"];
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

function findClosestExercise(
  pathExercises: Exercise[],
  targetDifficulty: number
): Exercise | null {
  if (pathExercises.length === 0) return null;
  return pathExercises.reduce((prev, curr) =>
    Math.abs(curr.difficulty - targetDifficulty) <
    Math.abs(prev.difficulty - targetDifficulty)
      ? curr
      : prev
  );
}

export default function Assessment() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [selectedNotch, setSelectedNotch] = useState(1); // 1-5 notch index
  const [levels, setLevels] = useState<Record<PathName, number>>({
    push: 20,
    pull: 20,
    core: 20,
    legs: 20,
    skills: 20,
    rings: 20,
    breakdance: 20,
    flexibility: 20,
  });

  const currentPath = paths[currentPathIndex];
  const pathColor = pathColors[currentPath];
  const pathExercises = getExercisesByPath(currentPath);
  const currentThreshold = DIFFICULTY_THRESHOLDS[selectedNotch - 1];
  const displayExercise = findClosestExercise(pathExercises, currentThreshold);

  const sliderX = new Animated.Value((selectedNotch - 1) * NOTCH_SPACING);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (_, gestureState) => {
      const newX = Math.max(
        0,
        Math.min(SLIDER_WIDTH, (selectedNotch - 1) * NOTCH_SPACING + gestureState.dx)
      );
      sliderX.setValue(newX);
    },
    onPanResponderRelease: (_, gestureState) => {
      const rawX = (selectedNotch - 1) * NOTCH_SPACING + gestureState.dx;
      const snappedIndex = Math.round(
        Math.max(0, Math.min(SLIDER_WIDTH, rawX)) / NOTCH_SPACING
      );
      const newNotch = snappedIndex + 1;
      setSelectedNotch(newNotch);
      Animated.spring(sliderX, {
        toValue: snappedIndex * NOTCH_SPACING,
        useNativeDriver: false,
        friction: 7,
      }).start();
    },
  });

  const handleConfirm = async () => {
    const difficultyValue = DIFFICULTY_THRESHOLDS[selectedNotch - 1];
    const newLevels = { ...levels, [currentPath]: difficultyValue };
    setLevels(newLevels);

    if (currentPathIndex < paths.length - 1) {
      setCurrentPathIndex(currentPathIndex + 1);
      setSelectedNotch(1);
    } else {
      await saveProfile({
        goal: "both",
        assessedLevels: {
          push: newLevels.push,
          pull: newLevels.pull,
          core: newLevels.core,
          legs: newLevels.legs,
          skills: newLevels.skills,
          rings: newLevels.rings,
          breakdance: newLevels.breakdance,
          flexibility: newLevels.flexibility,
        },
        completedExercises: [],
        completedMilestones: [],
        streak: 0,
        lastTrainedDate: null,
      });
      router.replace("/(tabs)/timeline");
    }
  };

  const handleTapNotch = (notch: number) => {
    setSelectedNotch(notch);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.pathBadge}>
          {pathIcons[currentPath]} {pathLabels[currentPath]}
        </Text>
        <Text style={styles.step}>
          {currentPathIndex + 1} / {paths.length}
        </Text>
      </View>

      <Text style={styles.title}>What's your level?</Text>
      <Text style={styles.subtitle}>
        Slide to your level — we'll show you the exercise
      </Text>

      {/* Exercise display */}
      <View style={styles.exerciseCard}>
        {displayExercise ? (
          <>
            <View
              style={[styles.exerciseLevelBadge, { backgroundColor: pathColor }]}
            >
              <Text style={styles.exerciseLevelText}>
                Difficulty {displayExercise.difficulty}/100
              </Text>
            </View>
            <Text style={styles.exerciseName}>{displayExercise.name}</Text>
            <Text style={styles.exerciseDesc}>{displayExercise.description}</Text>
          </>
        ) : (
          <Text style={styles.exerciseDesc}>No exercises in this path yet</Text>
        )}
      </View>

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <View
            style={[
              styles.sliderFill,
              {
                width: `${((selectedNotch - 1) / (NOTCH_COUNT - 1)) * 100}%` as any,
                backgroundColor: pathColor,
              },
            ]}
          />
        </View>

        {[1, 2, 3, 4, 5].map((notch) => {
          const threshold = DIFFICULTY_THRESHOLDS[notch - 1];
          const rangeStart = notch === 1 ? 0 : DIFFICULTY_THRESHOLDS[notch - 2];
          return (
            <TouchableOpacity
              key={notch}
              style={[
                styles.notch,
                {
                  left: (notch - 1) * NOTCH_SPACING - 20,
                },
              ]}
              onPress={() => handleTapNotch(notch)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.notchDot,
                  {
                    backgroundColor:
                      notch <= selectedNotch ? pathColor : colors.locked,
                    width: notch === selectedNotch ? 24 : 14,
                    height: notch === selectedNotch ? 24 : 14,
                    borderRadius: notch === selectedNotch ? 12 : 7,
                  },
                ]}
              />
              <Text
                style={[
                  styles.notchLabel,
                  notch === selectedNotch && { color: colors.text, fontWeight: "800" },
                ]}
              >
                {rangeStart}-{threshold}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: pathColor }]}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentPathIndex < paths.length - 1
              ? "Next"
              : "Start training"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  pathBadge: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  step: {
    fontSize: 14,
    color: colors.textDim,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textDim,
    marginBottom: 24,
  },
  exerciseCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    justifyContent: "center",
  },
  exerciseLevelBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 16,
  },
  exerciseLevelText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  exerciseName: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },
  exerciseDesc: {
    fontSize: 15,
    color: colors.textDim,
    lineHeight: 22,
  },
  sliderContainer: {
    height: 80,
    marginTop: 24,
    marginHorizontal: 16,
    position: "relative",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: colors.locked,
    borderRadius: 3,
    position: "absolute",
    left: 0,
    right: 0,
    top: 19,
  },
  sliderFill: {
    height: "100%",
    borderRadius: 3,
  },
  notch: {
    position: "absolute",
    top: 0,
    width: 40,
    alignItems: "center",
  },
  notchDot: {
    marginBottom: 6,
  },
  notchLabel: {
    fontSize: 11,
    color: colors.textDim,
    fontWeight: "600",
  },
  buttons: {
    marginTop: 16,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
});
