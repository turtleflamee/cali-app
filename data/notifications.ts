import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// Schedule a reminder notification for 2 days from now
// Cancels any existing reminder first, then reschedules
export async function scheduleInactivityReminder(): Promise<void> {
  // Cancel existing reminders
  await Notifications.cancelAllScheduledNotificationsAsync();

  const hasPermission = await requestPermissions();
  if (!hasPermission) return;

  // Schedule for 48 hours from now
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Don't break your streak! 💪",
      body: "You haven't trained in 2 days. Jump back in — even 10 minutes helps.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 48 * 60 * 60,
    },
  });

  // Also schedule a gentler one for 5 days
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "We miss you 🔥",
      body: "Your progress is waiting. Open the app and pick up where you left off.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5 * 24 * 60 * 60,
    },
  });
}
