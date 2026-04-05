import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { colors } from "../data/theme";
import { scheduleInactivityReminder } from "../data/notifications";

export default function RootLayout() {
  useEffect(() => {
    // Schedule notification reminders on app launch (native only)
    if (Platform.OS !== "web") {
      scheduleInactivityReminder();
    }
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="exercise/[id]"
          options={{
            presentation: "modal",
            headerTitle: "Exercise",
            headerStyle: { backgroundColor: colors.card },
          }}
        />
        <Stack.Screen
          name="train/[path]"
          options={{ headerTitle: "Milestones" }}
        />
      </Stack>
    </>
  );
}
