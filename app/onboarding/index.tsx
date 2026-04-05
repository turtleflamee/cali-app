import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../data/theme";

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>💪🔥🦵</Text>
        <Text style={styles.title}>Ready to start?</Text>
        <Text style={styles.subtitle}>
          Let's figure out your level. We'll check three areas — shoulders,
          core, and legs — so we can start you at the right spot.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/onboarding/assessment")}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Let's go</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 17,
    color: colors.textDim,
    lineHeight: 26,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
  },
});
