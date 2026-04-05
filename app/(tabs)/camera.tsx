import { useState, useRef, useCallback } from "react";
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

// Dimensions available if needed for skeleton scaling

const SKELETON_LINES: [string, string][] = [
  ["leftShoulder", "rightShoulder"],
  ["leftShoulder", "leftElbow"],
  ["leftElbow", "leftWrist"],
  ["rightShoulder", "rightElbow"],
  ["rightElbow", "rightWrist"],
  ["leftShoulder", "leftHip"],
  ["rightShoulder", "rightHip"],
  ["leftHip", "rightHip"],
  ["leftHip", "leftKnee"],
  ["leftKnee", "leftAnkle"],
  ["rightHip", "rightKnee"],
  ["rightKnee", "rightAnkle"],
];

function angleBetween(
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number }
): number {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
  const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);
  if (magAB === 0 || magCB === 0) return 0;
  return (Math.acos(Math.max(-1, Math.min(1, dot / (magAB * magCB)))) * 180) / Math.PI;
}

function parsePose(pose: any): Record<string, { x: number; y: number }> | null {
  if (!pose) return null;
  const points: Record<string, { x: number; y: number }> = {};
  const mapping: Record<string, string> = {
    leftShoulderX: "leftShoulder", rightShoulderX: "rightShoulder",
    leftElbowX: "leftElbow", rightElbowX: "rightElbow",
    leftWristX: "leftWrist", rightWristX: "rightWrist",
    leftHipX: "leftHip", rightHipX: "rightHip",
    leftKneeX: "leftKnee", rightKneeX: "rightKnee",
    leftAnkleX: "leftAnkle", rightAnkleX: "rightAnkle",
    noseX: "nose",
  };
  for (const [key, name] of Object.entries(mapping)) {
    const val = pose[key];
    if (val && typeof val.x === "number" && typeof val.y === "number") {
      points[name] = { x: val.x, y: val.y };
    }
  }
  return Object.keys(points).length > 5 ? points : null;
}

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Camera Mode</Text>
        <Text style={styles.statusText}>Camera requires a phone.</Text>
      </View>
    );
  }
  return <NativeCamera />;
}

function NativeCamera() {
  const insets = useSafeAreaInsets();

  // Try to load pose detection camera, fall back to regular camera
  let PoseCamera: any = null;
  let VCamera: any = null;
  let useCameraDevice: any = null;
  let useCameraPermission: any = null;
  let hasPoseDetection = false;

  try {
    const vc = require("react-native-vision-camera");
    VCamera = vc.Camera;
    useCameraDevice = vc.useCameraDevice;
    useCameraPermission = vc.useCameraPermission;
  } catch {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.statusText}>Camera not available.</Text>
      </View>
    );
  }

  try {
    const poseModule = require("@scottjgilroy/react-native-vision-camera-v4-pose-detection");
    PoseCamera = poseModule.Camera;
    hasPoseDetection = true;
  } catch {
    // Pose detection not available — use regular camera with tap-to-count
  }

  const { hasPermission, requestPermission } = useCameraPermission();
  const [facing, setFacing] = useState<"back" | "front">("front");
  const actualDevice = useCameraDevice(facing);
  const [isActive, setIsActive] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [points, setPoints] = useState<Record<string, { x: number; y: number }> | null>(null);
  const [repCount, setRepCount] = useState(0);
  const [position, setPosition] = useState<"up" | "down">("up");
  const [feedback, setFeedback] = useState("Get into position");
  const wentDown = useRef(false);
  const timerRef = useRef<any>(null);
  const [elapsed, setElapsed] = useState(0);

  if (!hasPermission) { requestPermission(); }

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => {
        setIsActive(false);
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      };
    }, [])
  );

  const handlePose = useCallback((pose: any) => {
    const parsed = parsePose(pose);
    setPoints(parsed);
    if (!isRunning || !parsed) return;

    const shoulder = parsed.leftShoulder || parsed.rightShoulder;
    const elbow = parsed.leftElbow || parsed.rightElbow;
    const wrist = parsed.leftWrist || parsed.rightWrist;
    const hip = parsed.leftHip || parsed.rightHip;
    if (!shoulder || !elbow || !wrist) { setFeedback("Show your full body"); return; }

    const elbowAngle = angleBetween(shoulder, elbow, wrist);
    let newPos: "up" | "down" = elbowAngle < 110 ? "down" : elbowAngle > 150 ? "up" : position;
    if (newPos === position && elbowAngle >= 110 && elbowAngle <= 150) return;

    if (newPos === "down" && position !== "down") wentDown.current = true;
    if (newPos === "up" && wentDown.current) { setRepCount(c => c + 1); wentDown.current = false; }
    setPosition(newPos);

    if (hip && shoulder) {
      const ankle = parsed.leftAnkle || parsed.rightAnkle || { x: hip.x, y: hip.y + 100 };
      const bodyAngle = angleBetween(shoulder, hip, ankle);
      setFeedback(bodyAngle < 150 ? "Keep your body straight!" : newPos === "down" && elbowAngle > 120 ? "Go deeper!" : "Good form!");
    } else {
      setFeedback(newPos === "down" ? "Down!" : "Up!");
    }
  }, [isRunning, position]);

  const handleTap = () => {
    if (!isRunning) return;
    if (position === "up") { setPosition("down"); wentDown.current = true; }
    else { setPosition("up"); if (wentDown.current) { setRepCount(c => c + 1); wentDown.current = false; } }
  };

  const startSession = () => {
    setRepCount(0); setPosition("up"); setElapsed(0); setShowSummary(false); setIsRunning(true);
    setFeedback("Start pushing!"); wentDown.current = false;
    timerRef.current = setInterval(() => setElapsed(t => t + 1), 1000);
  };

  const stopSession = () => {
    setIsRunning(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setShowSummary(true);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (!actualDevice) return <View style={[styles.container, styles.center]}><Text style={styles.statusText}>No camera found</Text></View>;
  if (!hasPermission) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Camera Access Needed</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={async () => { const r = await requestPermission(); if (!r) Linking.openSettings(); }}>
          <Text style={styles.primaryBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
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
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setShowSummary(false)}><Text style={styles.primaryBtnText}>Go Again</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera — use PoseCamera if available, otherwise regular */}
      {hasPoseDetection && PoseCamera ? (
        <PoseCamera
          style={styles.camera}
          device={actualDevice}
          isActive={isActive}
          callback={handlePose}
          options={{ mode: "stream", performanceMode: "min" }}
        />
      ) : (
        <VCamera style={styles.camera} device={actualDevice} isActive={isActive} photo={false} video={false} />
      )}

      {/* Skeleton overlay — only when pose detection is working */}
      {hasPoseDetection && points && (
        <View style={styles.skeletonOverlay} pointerEvents="none">
          {Object.values(points).map((pt, i) => (
            <View key={`dot-${i}`} style={[styles.keypointDot, { left: pt.x - 5, top: pt.y - 5 }]} />
          ))}
          {SKELETON_LINES.map(([a, b], i) => {
            const pa = points[a]; const pb = points[b];
            if (!pa || !pb) return null;
            const dx = pb.x - pa.x; const dy = pb.y - pa.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            return <View key={`skel-${i}`} style={[styles.skeletonLine, { left: pa.x, top: pa.y - 1.5, width: length, transform: [{ rotate: `${angle}deg` }] }]} />;
          })}
        </View>
      )}

      {/* Tap zone for manual counting (when no pose detection) */}
      {!hasPoseDetection && isRunning && (
        <TouchableOpacity style={styles.tapZone} onPress={handleTap} activeOpacity={1}>
          <Text style={styles.tapHint}>Tap each time you go {position === "up" ? "down" : "up"}</Text>
        </TouchableOpacity>
      )}

      {/* Top overlay */}
      <View style={[styles.topOverlay, { paddingTop: insets.top + 8 }]} pointerEvents="none">
        <View style={styles.repCounter}><Text style={styles.repNumber}>{repCount}</Text><Text style={styles.repLabel}>reps</Text></View>
        <View style={styles.infoBadge}>
          <View style={[styles.statusDot, { backgroundColor: position === "down" ? colors.primary : colors.success }]} />
          <Text style={styles.infoText}>{!isRunning ? "Ready" : `${position.toUpperCase()} · ${formatTime(elapsed)}`}</Text>
        </View>
      </View>

      {/* Feedback */}
      {isRunning && hasPoseDetection && (
        <View style={styles.feedbackBanner}><Text style={styles.feedbackText}>{feedback}</Text></View>
      )}

      {/* Mode indicator */}
      {!hasPoseDetection && !isRunning && (
        <View style={styles.feedbackBanner}><Text style={styles.feedbackText}>Tap mode — skeleton needs new build</Text></View>
      )}

      {/* Bottom controls */}
      <View style={[styles.bottomOverlay, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.scoreBox} onPress={() => setFacing(f => f === "back" ? "front" : "back")} activeOpacity={0.7}>
          <Text style={styles.scoreNumber}>🔄</Text><Text style={styles.scoreLabel}>flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainBtn, isRunning && styles.mainBtnStop]} onPress={isRunning ? stopSession : startSession}>
          <Text style={styles.mainBtnText}>{isRunning ? "Stop" : "Start"}</Text>
        </TouchableOpacity>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreNumber}>{isRunning ? `${repCount}` : "—"}</Text>
          <Text style={styles.scoreLabel}>reps</Text>
        </View>
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
  skeletonOverlay: { ...StyleSheet.absoluteFillObject },
  keypointDot: { position: "absolute", width: 10, height: 10, borderRadius: 5, backgroundColor: "#00FF88" },
  skeletonLine: { position: "absolute", height: 3, backgroundColor: "rgba(0, 255, 136, 0.7)", borderRadius: 1.5, transformOrigin: "left center" },
  tapZone: { position: "absolute", top: "20%", bottom: "25%", left: 0, right: 0, justifyContent: "center", alignItems: "center" },
  tapHint: { color: "rgba(255,255,255,0.5)", fontSize: 15, fontWeight: "600", backgroundColor: "rgba(0,0,0,0.3)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  topOverlay: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20 },
  repCounter: { backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 10, alignItems: "center" },
  repNumber: { fontSize: 48, fontWeight: "900", color: colors.text },
  repLabel: { fontSize: 14, color: colors.textDim, fontWeight: "600" },
  infoBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  infoText: { color: colors.text, fontSize: 13, fontWeight: "600" },
  feedbackBanner: { position: "absolute", top: "40%", left: 20, right: 20, backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16, alignItems: "center" },
  feedbackText: { color: colors.text, fontSize: 17, fontWeight: "700", textAlign: "center" },
  bottomOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 },
  scoreBox: { backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, alignItems: "center", minWidth: 60 },
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
