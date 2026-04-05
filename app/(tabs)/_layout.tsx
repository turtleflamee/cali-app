import { Tabs, useRouter } from "expo-router";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../data/theme";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.card,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 12),
          height: 65 + Math.max(insets.bottom, 12),
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="timeline"
        options={{
          title: "Timeline",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>◎</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="train"
        options={{
          title: "Train",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>▲</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
          tabBarIcon: () => (
            <View style={tabStyles.plusBtn}>
              <Text style={tabStyles.plusText}>+</Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>📷</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          headerTitle: "Account",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>⚙</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  plusBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  plusText: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
    marginTop: -2,
  },
});
