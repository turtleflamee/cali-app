import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../data/theme";

const { width: WIN_W, height: WIN_H } = Dimensions.get("window");

// Skeleton connections for drawing
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

// Angle between 3 points
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

// Parse pose data into simple {x,y} points
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

  // Lazy imports for native modules
  let PoseCamera: any = null;
  let useCameraDevice: any = null;
  let useCameraPermission: any = null;
  try {
    const poseModule = require("@scottjgilroy/react-native-vision-camera-v4-pose-detection");
    PoseCamera = poseModule.Camera;
    const vc = require("react-native-vision-camera");
    useCameraDevice = vc.useCameraDevice;
    useCameraPermission = vc.useCameraPermission;
  } catch (e) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.title}>Camera Mode</Text>
        <Text style={styles.statusText}>Pose detection not available. Rebuild with EAS.</Text>
      </View>
    );
  }

  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isActive, setIsActive] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [points, setPoints] = useState<Record<string, { x: number; y: number }> | null>(null);
  const [repCount, setRepCount] = useState(0);
  const [position, setPosition] = useState<"up" | "down" | "unknown">("unknown");
  const [feedback, setFeedback] = useState("Get into push-up position");
  const wentDown = useRef(false);
  const timerRef = useRef<any>(null);
  const [elapsed, setElapsed] = useState(0);

  // Request permission
  if (!hasPermission) {
    requestPermission();
  }

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
    if (!isRunning) {
      const parsed = parsePose(pose);
      setPoints(parsed);
      return;
    }

    const parsed = parsePose(pose);
    setPoints(parsed);
    if (!parsed) {
      setFeedback("Can't see you — adjust camera");
      return;
    }

    // Use best available shoulder/elbow/wrist
    const shoulder = parsed.leftShoulder || parsed.rightShoulder;
    const elbow = parsed.leftElbow || parsed.rightElbow;
    const wrist = parsed.leftWrist || parsed.rightWrist;
    const hip = parsed.leftHip || parsed.rightHip;

    if (!shoulder || !elbow || !wrist) {
      setFeedback("Show your full body");
      return;
    }

    // Elbow angle
    const elbowAngle = angleBetween(shoulder, elbow, wrist);

    let newPos: "up" | "down" = "up";
    if (elbowAngle < 110) {
      newPos = "down";
    } else if (elbowAngle > 150) {
      newPos = "up";
    } else {
      return; // in transition, don't update
    }

    // Count reps
    if (newPos === "down" && position !== "down") {
      wentDown.current = true;
    }
    if (newPos === "up" && wentDown.current) {
      setRepCount(c => c + 1);
      wentDown.current = false;
    }

    setPosition(newPos);

    // Form feedback
    if (hip && shoulder) {
      const bodyAngle = angleBetween(
        shoulder,
        hip,
        parsed.leftAnkle || parsed.rightAnkle || { x: hip.x, y: hip.y + 100 }
      );
      if (bodyAngle < 150) {
        setFeedback("Keep your body straight!");
      } else if (newPos === "down" && elbowAngle > 120) {
        setFeedback("Go deeper — chest to floor");
      } else {
        setFeedback("Good form!");
      }
    } else {
      setFeedback(newPos === "down" ? "Down!" : "Up!");
    }
  }, [isRunning, position]);

  const startSession = () => {
    setRepCount(0);
    setPosition("unknown");
    setElapsed(0);
    setShowSummary(false);
    setIsRunning(true);
    setFeedback("Start pushing!");
    wentDown.current = false;
    timerRef.current = setInterval(() => setElapsed(t => t + 1), 1000);
  };

  const stopSession = () => {
    setIsRunning(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setShowSummary(true);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (!device) {
    return (<View style={[styles.container, styles.center]}><Text style={styles.statusText}>No camera found</Text></View>);
  }

  if (!hasPermission) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Camera Access Needed</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}><Text style={styles.primaryBtnText}>Grant Permission</Text></TouchableOpacity>
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
      {PoseCamera && (
        <PoseCamera
          style={styles.camera}
          device={device}
          isActive={isActive}
          callback={handlePose}
          options={{ mode: "stream", performanceMode: "min" }}
        />
      )}

      {/* Skeleton overlay */}
      {points && (
        <View style={styles.skeletonOverlay} pointerEvents="none">
          {/* Keypoint dots */}
          {Object.values(points).map((pt, i) => (
            <View
              key={`dot-${i}`}
              style={[styles.keypointDot, { left: pt.x - 5, top: pt.y - 5 }]}
            />
          ))}
          {/* Skeleton lines */}
          {SKELETON_LINES.map(([a, b], i) => {
            const pa = points[a];
            const pb = points[b];
            if (!pa || !pb) return null;
            const dx = pb.x - pa.x;
            const dy = pb.y - pa.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            return (
              <View
                key={`skel-${i}`}
                style={[
                  styles.skeletonLine,
                  {
                    left: pa.x,
                    top: pa.y - 1.5,
                    width: length,
                    transform: [{ rotate: `${angle}deg` }],
                  },
                ]}
              />
            );
          })}
        </View>
      )}

      {/* Top overlay */}
      <View style={[styles.topOverlay, { paddingTop: insets.top + 8 }]} pointerEvents="none">
        <View style={styles.repCounter}>
          <Text style={styles.repNumber}>{repCount}</Text>
          <Text style={styles.repLabel}>reps</Text>
        </View>
        <View style={styles.infoBadge}>
          <View style={[styles.statusDot, { backgroundColor: position === "down" ? colors.primary : position === "up" ? colors.success : colors.textDim }]} />
          <Text style={styles.infoText}>
            {!isRunning ? "Ready" : `${position.toUpperCase()} · ${formatTime(elapsed)}`}
          </Text>
        </View>
      </View>

      {/* Feedback */}
      {isRunning && (
        <View style={styles.feedbackBanner}>
          <Text style={styles.feedbackText}>{feedback}</Text>
        </View>
      )}

      {/* Bottom controls */}
      <View style={[styles.bottomOverlay, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreNumber}>{isRunning ? formatTime(elapsed) : "—"}</Text>
          <Text style={styles.scoreLabel}>time</Text>
        </View>
        <TouchableOpacity
          style={[styles.mainBtn, isRunning && styles.mainBtnStop]}
          onPress={isRunning ? stopSession : startSession}
        >
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
  // Skeleton
  skeletonOverlay: { ...StyleSheet.absoluteFillObject },
  keypointDot: {
    position: "absolute", width: 10, height: 10, borderRadius: 5,
    backgroundColor: "#00FF88",
    shadowColor: "#00FF88", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 4,
  },
  skeletonLine: {
    position: "absolute", height: 3, backgroundColor: "rgba(0, 255, 136, 0.7)",
    borderRadius: 1.5, transformOrigin: "left center",
  },
  // Top overlay
  topOverlay: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20 },
  repCounter: { backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 10, alignItems: "center" },
  repNumber: { fontSize: 48, fontWeight: "900", color: colors.text },
  repLabel: { fontSize: 14, color: colors.textDim, fontWeight: "600" },
  infoBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  infoText: { color: colors.text, fontSize: 13, fontWeight: "600" },
  // Feedback
  feedbackBanner: { position: "absolute", top: "40%", left: 20, right: 20, backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 14, paddingVertical: 12, paddingHorizontal: 16, alignItems: "center" },
  feedbackText: { color: colors.text, fontSize: 17, fontWeight: "700", textAlign: "center" },
  // Bottom
  bottomOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20 },
  scoreBox: { backgroundColor: "rgba(0,0,0,0.7)", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, alignItems: "center", minWidth: 60 },
  scoreNumber: { color: colors.text, fontSize: 18, fontWeight: "800" },
  scoreLabel: { color: colors.textDim, fontSize: 11, fontWeight: "600" },
  mainBtn: { backgroundColor: colors.success, borderRadius: 30, width: 80, height: 80, justifyContent: "center", alignItems: "center", shadowColor: colors.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
  mainBtnStop: { backgroundColor: colors.primary, shadowColor: colors.primary },
  mainBtnText: { color: colors.text, fontSize: 16, fontWeight: "800" },
  primaryBtn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 32, alignItems: "center" },
  primaryBtnText: { color: colors.text, fontSize: 18, fontWeight: "700" },
  // Summary
  summaryEmoji: { fontSize: 48, marginBottom: 16 },
  summaryTitle: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 24 },
  summaryCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20, alignItems: "center", marginBottom: 12, width: "100%" },
  summaryBig: { fontSize: 48, fontWeight: "900", color: colors.text },
  summaryLabel: { fontSize: 14, color: colors.textDim, fontWeight: "600", marginTop: 4 },
  summaryRow: { flexDirection: "row", gap: 12, marginBottom: 24, width: "100%" },
  summarySmallCard: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: 16, alignItems: "center" },
  summaryStat: { fontSize: 24, fontWeight: "800", color: colors.text },
});
