import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PathName } from "../../data/exercises";
import { getProfile, UserProfile } from "../../data/storage";
import { generateWorkout, Workout } from "../../data/workout";
import { colors, pathColors, pathIcons } from "../../data/theme";

const timeOptions = [10, 15, 20, 30, 45];

const pathOptions: { key: PathName; label: string }[] = [
  { key: "push", label: "Push" },
  { key: "pull", label: "Pull" },
  { key: "core", label: "Core" },
  { key: "legs", label: "Legs" },
  { key: "skills", label: "Skills" },
  { key: "rings", label: "Rings" },
  { key: "breakdance", label: "Bboy" },
  { key: "flexibility", label: "Flex" },
];

export default function WorkoutTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedPaths, setSelectedPaths] = useState<PathName[]>([
    "push",
    "pull",
    "core",
    "legs",
    "skills",
    "rings",
    "breakdance",
    "flexibility",
  ]);
  const [targetMinutes, setTargetMinutes] = useState(20);
  const [workout, setWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  const togglePath = (path: PathName) => {
    setSelectedPaths((prev) => {
      if (prev.includes(path)) {
        if (prev.length === 1) return prev;
        return prev.filter((p) => p !== path);
      }
      return [...prev, path];
    });
    setWorkout(null);
  };

  const handleGenerate = () => {
    if (!profile) return;
    const w = generateWorkout(profile, selectedPaths, targetMinutes);
    setWorkout(w);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16 },
        ]}
      >
        <Text style={styles.pageTitle}>Create Workout</Text>

        <Text style={styles.sectionTitle}>Choose your focus</Text>
        <View style={styles.pathRow}>
          {pathOptions.map((p) => {
            const selected = selectedPaths.includes(p.key);
            return (
              <TouchableOpacity
                key={p.key}
                style={[
                  styles.pathChip,
                  selected && {
                    backgroundColor: pathColors[p.key],
                    borderColor: pathColors[p.key],
                  },
                ]}
                onPress={() => togglePath(p.key)}
                activeOpacity={0.7}
              >
                <Text style={styles.pathChipIcon}>{pathIcons[p.key]}</Text>
                <Text
                  style={[
                    styles.pathChipText,
                    selected && { color: colors.text },
                  ]}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>How long?</Text>
        <View style={styles.timeRow}>
          {timeOptions.map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.timeChip,
                targetMinutes === t && styles.timeChipSelected,
              ]}
              onPress={() => {
                setTargetMinutes(t);
                setWorkout(null);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.timeChipText,
                  targetMinutes === t && styles.timeChipTextSelected,
                ]}
              >
                {t} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.generateBtn}
          onPress={handleGenerate}
          activeOpacity={0.8}
        >
          <Text style={styles.generateBtnText}>
            {workout ? "Regenerate" : "Generate Workout"}
          </Text>
        </TouchableOpacity>

        {workout && (
          <View style={styles.workoutResult}>
            {workout.items.length === 0 ? (
              <Text style={styles.emptyText}>
                No exercises available at your level for the selected
                paths. Try selecting different paths.
              </Text>
            ) : (
              <>
                <View style={styles.workoutHeader}>
                  <Text style={styles.workoutTitle}>Your Workout</Text>
                  <Text style={styles.workoutTime}>
                    ~{workout.totalMinutes} min
                  </Text>
                </View>

                {workout.items.map((item, i) => {
                  const pathColor = pathColors[item.fromExercise.path];
                  return (
                    <TouchableOpacity
                      key={`${item.name}-${i}`}
                      style={styles.workoutCard}
                      onPress={() =>
                        router.push(`/exercise/${item.fromExercise.id}`)
                      }
                      activeOpacity={0.7}
                    >
                      <View style={styles.workoutCardLeft}>
                        <View
                          style={[
                            styles.workoutNumber,
                            { backgroundColor: pathColor },
                          ]}
                        >
                          <Text style={styles.workoutNumberText}>
                            {i + 1}
                          </Text>
                        </View>
                        <View style={styles.workoutCardInfo}>
                          <Text style={styles.workoutCardName}>
                            {item.name}
                          </Text>
                          <Text style={styles.workoutCardMeta}>
                            {pathIcons[item.fromExercise.path]} Training
                            for: {item.fromExercise.name}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.workoutCardRight}>
                        <Text style={styles.workoutCardReps}>
                          {item.reps}
                        </Text>
                        <Text style={styles.workoutCardTime}>
                          ~{item.estimatedMinutes}m
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 40 },
  pageTitle: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: 12, marginTop: 8 },
  pathRow: { flexDirection: "row", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  pathChip: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 12, borderWidth: 2, borderColor: colors.cardLight, backgroundColor: colors.card, minWidth: 70 },
  pathChipIcon: { fontSize: 16 },
  pathChipText: { fontSize: 12, fontWeight: "700", color: colors.textDim },
  timeRow: { flexDirection: "row", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  timeChip: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, borderWidth: 2, borderColor: colors.cardLight, backgroundColor: colors.card },
  timeChipSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  timeChipText: { fontSize: 15, fontWeight: "700", color: colors.textDim },
  timeChipTextSelected: { color: colors.text },
  generateBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginBottom: 24 },
  generateBtnText: { color: colors.text, fontSize: 18, fontWeight: "700" },
  workoutResult: { marginTop: 8 },
  emptyText: { color: colors.textDim, fontSize: 15, textAlign: "center", lineHeight: 22 },
  workoutHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  workoutTitle: { fontSize: 20, fontWeight: "800", color: colors.text },
  workoutTime: { fontSize: 16, fontWeight: "700", color: colors.primary },
  workoutCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.card, borderRadius: 14, padding: 14, marginBottom: 10 },
  workoutCardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  workoutNumber: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: 12 },
  workoutNumberText: { color: colors.text, fontSize: 14, fontWeight: "800" },
  workoutCardInfo: { flex: 1 },
  workoutCardName: { color: colors.text, fontSize: 15, fontWeight: "700" },
  workoutCardMeta: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  workoutCardRight: { alignItems: "flex-end", marginLeft: 8 },
  workoutCardReps: { color: colors.text, fontSize: 13, fontWeight: "600" },
  workoutCardTime: { color: colors.textDim, fontSize: 11, marginTop: 2 },
});
