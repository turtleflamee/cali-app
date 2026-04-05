import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { hasOnboarded, saveProfile, getProfile } from "../data/storage";

export default function Index() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const onboarded = await hasOnboarded();
      if (!onboarded) {
        // Skip onboarding — create fresh profile assuming they can't do anything
        await saveProfile({
          goal: "both",
          assessedLevels: {
            push: 0, pull: 0, core: 0, legs: 0,
            skills: 0, rings: 0, breakdance: 0, flexibility: 0,
          },
          completedExercises: [],
          completedMilestones: [],
          streak: 0,
          lastTrainedDate: null,
        });
      }
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return <Redirect href="/(tabs)/timeline" />;
}
