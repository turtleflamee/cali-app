import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { hasOnboarded } from "../data/storage";

export default function Index() {
  const [checked, setChecked] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    hasOnboarded().then((val) => {
      setOnboarded(val);
      setChecked(true);
    });
  }, []);

  if (!checked) return null;

  if (onboarded) {
    return <Redirect href="/(tabs)/timeline" />;
  }

  return <Redirect href="/onboarding" />;
}
