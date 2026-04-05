import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../data/theme";

// Web fallback — VisionCamera doesn't work on web
if (Platform.OS === "web") {
  // Export a simple placeholder
}

export default function CameraScreen() {
  const insets = useSafeAreaInsets();

  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Camera Mode</Text>
        <Text style={styles.statusText}>
          Camera mode requires a phone.{"\n"}Open this app on your device to use the camera.
        </Text>
      </View>
    );
  }

  // On native, render the real camera component
  return <NativeCamera />;
}

// Separate component that only renders on native — safe to import VisionCamera here
function NativeCamera() {
  // Lazy require to avoid web crash
  const { Camera: VCamera, useCameraDevice, useCameraPermission } = require("react-native-vision-camera");

  const insets = useSafeAreaInsets();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [facing, setFacing] = useState<"back" | "front">("front");
  const actualDevice = useCameraDevice(facing);
  const [isActive, setIsActive] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [position, setPosition] = useState<"up" | "down">("up");
  const wentDown = useRef(false);
  const timerRef = useRef<any>(null);
  const [elapsed, setElapsed] = useState(0);

  // Request permission on mount
  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  // Activate camera when tab is focused
  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => {
        setIsActive(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }, [])
  );

  const startSession = () => {
    setRepCount(0);
    setPosition("up");
    setElapsed(0);
    setShowSummary(false);
    setIsRunning(true);
    wentDown.current = false;
    timerRef.current = setInterval(() => setElapsed((t: number) => t + 1), 1000);
  };

  const stopSession = () => {
    setIsRunning(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setShowSummary(true);
  };

  const handleTap = () => {
    if (!isRunning) return;
    if (position === "up") { setPosition("down"); wentDown.current = true; }
    else { setPosition("up"); if (wentDown.current) { setRepCount((c: number) => c + 1); wentDown.current = false; } }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (!hasPermission) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Camera Access Needed</Text>
        <Text style={styles.statusText}>We need camera access to track your exercises.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={async () => { const r = await requestPermission(); if (!r) Linking.openSettings(); }} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!actualDevice) {
    return (<View style={[styles.container, styles.center]}><Text style={styles.statusText}>No camera found</Text></View>);
  }

  if (showSummary) {
    const repsPerMin = elapsed > 0 ? ((repCount / elapsed) * 60).toFixed(1) : "0";
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.summaryEmoji}>{repCount >= 20 ? "🔥" : repCount >= 10 ? "💪" : "👊"}</Text>
        <Text style={styles.summaryTitle}>Session Complete</Text>
        <View style={styles.summaryCard}><Text style={styles.summaryBig}>{repCount}</Text><Text style={styles.summaryLabel}>push-ups</Text></View>
        <View style={styles.summaryRow}>
          <View style={styles.summarySmallCard}><Text style={styles.summaryStat}>{formatTime(elapsed)}</Text><Text style={styles.summaryLabel}>time</Text></View>
          <View style={styles.summarySmallCard}><Text style={styles.summaryStat}>{repsPerMin}</Text><Text style={styles.summaryLabel}>reps/min</Text></View>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowSummary(false)} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>Go Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VCamera style={styles.camera} device={actualDevice} isActive={isActive} photo={false} video={false} />
      {isRunning && (
        <TouchableOpacity style={styles.tapZone} onPress={handleTap} activeOpacity={1}>
          <Text style={styles.tapHint}>Tap each time you go {position === "up" ? "down" : "up"}</Text>
        </TouchableOpacity>
      )}
      <View style={[styles.topOverlay, { paddingTop: insets.top + 8 }]} pointerEvents="none">
        <View style={styles.repCounter}><Text style={styles.repNumber}>{repCount}</Text><Text style={styles.repLabel}>reps</Text></View>
        <View style={styles.infoBadge}>
          {isRunning ? (<><View style={[styles.positionDot, { backgroundColor: position === "down" ? colors.primary : colors.success }]} /><Text style={styles.infoText}>{position.toUpperCase()} · {formatTime(elapsed)}</Text></>) : (<Text style={styles.infoText}>Ready</Text>)}
        </View>
      </View>
      <View style={[styles.bottomOverlay, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.scoreBox} onPress={() => setFacing(f => f === "back" ? "front" : "back")} activeOpacity={0.7}>
          <Text style={styles.scoreNumber}>🔄</Text><Text style={styles.scoreLabel}>flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainBtn, isRunning && styles.mainBtnStop]} onPress={isRunning ? stopSession : startSession} activeOpacity={0.8}>
          <Text style={styles.mainBtnText}>{isRunning ? "Stop" : "Start"}</Text>
        </TouchableOpacity>
        <View style={styles.scoreBox}><Text style={styles.scoreNumber}>{isRunning ? formatTime(elapsed) : "—"}</Text><Text style={styles.scoreLabel}>time</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { justifyContent: "center", alignItems: "center", padding: 32 },
  camera: { flex: 1 },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: 12 },
  statusText: { fontSize: 16, color: colors.textDim, textAlign: "center", lineHeight: 24, marginBottom: 24 },
  tapZone: { position: "absolute", top: "20%", bottom: "25%", left: 0, right: 0, justifyContent: "center", alignItems: "center" },
  tapHint: { color: "rgba(255,255,255,0.5)", fontSize: 15, fontWeight: "600", backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  topOverlay: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20 },
  repCounter: { backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 10, alignItems: "center" },
  repNumber: { fontSize: 48, fontWeight: "900", color: colors.text },
  repLabel: { fontSize: 14, color: colors.textDim, fontWeight: "600" },
  infoBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  positionDot: { width: 8, height: 8, borderRadius: 4 },
  infoText: { color: colors.text, fontSize: 13, fontWeight: "600" },
  bottomOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 },
  scoreBox: { backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, alignItems: "center", minWidth: 60 },
  scoreNumber: { color: colors.text, fontSize: 18, fontWeight: "800" },
  scoreLabel: { color: colors.textDim, fontSize: 11, fontWeight: "600" },
  mainBtn: { backgroundColor: colors.success, borderRadius: 30, width: 80, height: 80, justifyContent: "center", alignItems: "center", shadowColor: colors.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
  mainBtnStop: { backgroundColor: colors.primary, shadowColor: colors.primary },
  mainBtnText: { color: colors.text, fontSize: 16, fontWeight: "800" },
  primaryBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 32, alignItems: "center" },
  primaryBtnText: { color: colors.text, fontSize: 18, fontWeight: "700" },
  summaryEmoji: { fontSize: 48, marginBottom: 16 },
  summaryTitle: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 24 },
  summaryCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, alignItems: "center", marginBottom: 12, width: "100%" },
  summaryBig: { fontSize: 48, fontWeight: "900", color: colors.text },
  summaryLabel: { fontSize: 14, color: colors.textDim, fontWeight: "600", marginTop: 4 },
  summaryRow: { flexDirection: "row", gap: 12, marginBottom: 24, width: "100%" },
  summarySmallCard: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 16, alignItems: "center" },
  summaryStat: { fontSize: 24, fontWeight: "800", color: colors.text },
});
