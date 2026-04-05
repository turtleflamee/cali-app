import { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getProfile, UserProfile } from "../../data/storage";
import { colors } from "../../data/theme";
import SkillWeb from "../../components/SkillWeb";

export default function TimelineScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      getProfile().then(setProfile);
    }, [])
  );

  if (!profile) return <View style={styles.container} />;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SkillWeb profile={profile} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
