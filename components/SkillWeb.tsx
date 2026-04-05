import { useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
  Alert,
  Animated,
} from "react-native";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
// SVG removed — using View-based lines to avoid Android bitmap crash
import { useRouter } from "expo-router";
import {
  exercises,
  Exercise,
  PathName,
  SubPath,
  pathSubPaths,
  getExercisesBySubPath,
  progressionEdges,
  crossLinks,
  Category,
  categoryPaths,
  getCategory,
  gatewayExercises,
} from "../data/exercises";
import { UserProfile } from "../data/storage";
import { colors, pathColors, pathDarkColors } from "../data/theme";
import { getVisibleExercises, unlockTree } from "../data/unlock-tree";
import {
  checkpoints,
  getCheckpointsForEdge,
  getYouTubeSearchUrl,
  Checkpoint,
} from "../data/checkpoints";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const CANVAS_W = 2000;
const CANVAS_H = 2000;
const CX = CANVAS_W / 2;
const CY = CANVAS_H / 2;

const SUB_BRANCH_SPREAD = 18; // degrees between sub-branches

const CATEGORY_ANGLES: Record<Category, number> = {
  flexibility: 90,
  strength: 210,
  special: 330,
};
const CATEGORY_SPREAD = 100; // degrees per category

type VisState = "completed" | "current" | "hidden";

// Node sizes by type
const NODE_SIZES = {
  regular: { w: 80, h: 48 },
  final: { w: 90, h: 52 },
  convergence: { w: 100, h: 56 },
  start: { w: 70, h: 70 },
};

interface NodePos {
  x: number;
  y: number;
  exercise?: Exercise;
  isStart?: boolean;
}

// Compute depth of each exercise in the unlock tree (BFS from START)
function computeDepths(): Map<string, number> {
  const depths = new Map<string, number>();
  const queue: { id: string; depth: number }[] = [{ id: "__start__", depth: 0 }];
  depths.set("__start__", 0);

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    const children = unlockTree[id] ?? [];
    for (const childId of children) {
      if (!depths.has(childId)) {
        depths.set(childId, depth + 1);
        queue.push({ id: childId, depth: depth + 1 });
      }
    }
  }
  return depths;
}

const exerciseDepths = computeDepths();

// Build node positions by walking the unlock tree
// Each node fans out ±15° from its parent when there are multiple children
function buildNodePositions(): Map<string, NodePos> {
  const positions = new Map<string, NodePos>();
  positions.set("__start__", { x: CX, y: CY, isStart: true });

  const STEP_DIST = 150; // px per depth level
  const FAN_ANGLE = 15; // degrees offset for each sibling

  // Store each node's angle so children can inherit/offset from it
  const nodeAngles = new Map<string, number>();

  // Assign base angles for the 3 gateways
  const gatewayAngles: Record<string, number> = {
    flex_gateway: CATEGORY_ANGLES.flexibility,
    core_pk_1: CATEGORY_ANGLES.strength,
    bboy_fr_1: CATEGORY_ANGLES.special,
  };

  // BFS through unlock tree, positioning each node relative to its parent
  const queue: { id: string; parentAngle: number }[] = [];

  // Start with the 3 gateways
  const startChildren = unlockTree["__start__"] ?? [];
  for (const childId of startChildren) {
    const angle = gatewayAngles[childId] ?? 0;
    nodeAngles.set(childId, angle);
    queue.push({ id: childId, parentAngle: angle });
  }

  // Find exercise by id helper
  const exById = new Map(exercises.map(e => [e.id, e]));

  while (queue.length > 0) {
    const { id, parentAngle } = queue.shift()!;
    const depth = exerciseDepths.get(id) ?? 1;
    const dist = depth * STEP_DIST;
    const angle = nodeAngles.get(id) ?? parentAngle;
    const angleRad = (angle * Math.PI) / 180;

    const ex = exById.get(id);
    if (ex && !positions.has(id)) {
      positions.set(id, {
        x: CX + Math.cos(angleRad) * dist,
        y: CY - Math.sin(angleRad) * dist,
        exercise: ex,
      });
    }

    // Position children: fan them ±FAN_ANGLE from this node's angle
    const children = unlockTree[id] ?? [];
    const childCount = children.length;

    for (let ci = 0; ci < childCount; ci++) {
      const childId = children[ci];
      if (nodeAngles.has(childId)) continue; // already positioned

      let childAngle: number;
      if (childCount === 1) {
        // Single child: same angle as parent
        childAngle = angle;
      } else {
        // Multiple children: fan out ±FAN_ANGLE from parent
        const offset = (ci - (childCount - 1) / 2) * FAN_ANGLE;
        childAngle = angle + offset;
      }

      nodeAngles.set(childId, childAngle);
      queue.push({ id: childId, parentAngle: childAngle });
    }
  }

  // Also position exercises that are in the data but NOT in the unlock tree
  // (they'll be hidden, but need positions for the grey dots)
  for (const ex of exercises) {
    if (!positions.has(ex.id)) {
      // Find which sub-path it's on and place it far out
      const cat = getCategory(ex.path);
      const catAngle = CATEGORY_ANGLES[cat];
      const catAngleRad = (catAngle * Math.PI) / 180;
      const depth = exerciseDepths.get(ex.id) ?? 10;
      const dist = depth * STEP_DIST;
      // Add a small random-ish offset based on id hash to prevent stacking
      const hash = ex.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const offsetAngle = ((hash % 60) - 30);
      const finalRad = ((catAngle + offsetAngle) * Math.PI) / 180;
      positions.set(ex.id, {
        x: CX + Math.cos(finalRad) * dist,
        y: CY - Math.sin(finalRad) * dist,
        exercise: ex,
      });
    }
  }

  return positions;
}

const nodePositions = buildNodePositions();

// Compute visibility states for all exercises given a profile
function computeVisibility(profile: UserProfile): Map<string, VisState> {
  const vis = new Map<string, VisState>();
  const completedSet = new Set(profile.completedExercises);
  const visibleSet = getVisibleExercises(profile.completedExercises);

  for (const [id] of nodePositions) {
    if (id === "__start__") continue;
    if (completedSet.has(id)) {
      vis.set(id, "completed");
    } else if (visibleSet.has(id)) {
      vis.set(id, "current");
    } else {
      vis.set(id, "hidden");
    }
  }

  return vis;
}

// Get the final exercise name for a sub-path (highest difficulty)
function getFinalExerciseName(subPath: SubPath): string {
  const exs = getExercisesBySubPath(subPath).sort(
    (a, b) => b.difficulty - a.difficulty
  );
  return exs.length > 0 ? exs[0].name : "Unknown";
}

// Build progression edge lines (only to visible nodes)
function buildProgressionLines(
  visMap: Map<string, VisState>
): { x1: number; y1: number; x2: number; y2: number; color: string }[] {
  const lines: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
  const isVisible = (id: string) => {
    const s = visMap.get(id);
    return s === "completed" || s === "current";
  };

  // Connect start node to gateway exercises
  const categories: Category[] = ["flexibility", "strength", "special"];
  for (const cat of categories) {
    const gw = gatewayExercises[cat];
    if (isVisible(gw)) {
      const gwPos = nodePositions.get(gw);
      if (gwPos) {
        const paths = categoryPaths[cat];
        // Use color from the first path in the category
        lines.push({
          x1: CX,
          y1: CY,
          x2: gwPos.x,
          y2: gwPos.y,
          color: pathColors[paths[0]],
        });
      }
    }
  }

  // Connect gateway to first exercise in each sub-path of its category
  for (const cat of categories) {
    const gwId = gatewayExercises[cat];
    const gwPos = nodePositions.get(gwId);
    if (!gwPos || !isVisible(gwId)) continue;

    for (const p of categoryPaths[cat]) {
      for (const sp of pathSubPaths[p]) {
        const subExercises = getExercisesBySubPath(sp).sort(
          (a, b) => a.difficulty - b.difficulty
        );
        // Find first exercise that is NOT the gateway itself
        const first = subExercises.find(
          (e) => e.id !== gwId && isVisible(e.id)
        );
        if (first) {
          const firstPos = nodePositions.get(first.id);
          if (firstPos) {
            lines.push({
              x1: gwPos.x,
              y1: gwPos.y,
              x2: firstPos.x,
              y2: firstPos.y,
              color: pathColors[first.path],
            });
          }
        }
      }
    }
  }

  // Progression edges — only if both endpoints visible
  for (const edge of progressionEdges) {
    if (!isVisible(edge.fromId) || !isVisible(edge.toId)) continue;
    const from = nodePositions.get(edge.fromId);
    const to = nodePositions.get(edge.toId);
    if (from && to && from.exercise) {
      lines.push({
        x1: from.x,
        y1: from.y,
        x2: to.x,
        y2: to.y,
        color: pathColors[from.exercise.path],
      });
    }
  }

  return lines;
}

function buildCrossLinkLines(
  visMap: Map<string, VisState>
): { x1: number; y1: number; x2: number; y2: number }[] {
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const isVisible = (id: string) => {
    const s = visMap.get(id);
    return s === "completed" || s === "current";
  };

  for (const link of crossLinks) {
    if (!isVisible(link.fromId) || !isVisible(link.toId)) continue;
    const from = nodePositions.get(link.fromId);
    const to = nodePositions.get(link.toId);
    if (from && to) {
      lines.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y });
    }
  }

  return lines;
}

// Build checkpoint positions along progression edges
interface CheckpointPos {
  x: number;
  y: number;
  checkpoint: Checkpoint;
  color: string;
}

function buildCheckpointPositions(
  visMap: Map<string, VisState>
): CheckpointPos[] {
  const result: CheckpointPos[] = [];
  const isVisible = (id: string) => {
    const s = visMap.get(id);
    return s === "completed" || s === "current";
  };

  for (const edge of progressionEdges) {
    if (!isVisible(edge.fromId) || !isVisible(edge.toId)) continue;
    const from = nodePositions.get(edge.fromId);
    const to = nodePositions.get(edge.toId);
    if (!from || !to || !from.exercise) continue;

    const edgeCheckpoints = getCheckpointsForEdge(edge.fromId, edge.toId);
    const color = pathColors[from.exercise.path];

    for (const cp of edgeCheckpoints) {
      const t = cp.position === 1 ? 1 / 3 : 2 / 3;
      result.push({
        x: from.x + (to.x - from.x) * t,
        y: from.y + (to.y - from.y) * t,
        checkpoint: cp,
        color,
      });
    }
  }

  return result;
}

interface Props {
  profile: UserProfile;
}

export default function SkillWeb({ profile }: Props) {
  const router = useRouter();

  // Use Animated values for smooth native-thread panning
  const translateX = useRef(new Animated.Value(-(CX - SCREEN_W / 2))).current;
  const translateY = useRef(new Animated.Value(-(CY - SCREEN_H / 2 - 50))).current;
  const scaleAnim = useRef(new Animated.Value(0.35)).current;

  const offsetRef = useRef({ x: -(CX - SCREEN_W / 2), y: -(CY - SCREEN_H / 2 - 50) });
  const scaleRef = useRef(0.35);
  const savedOffset = useRef({ x: offsetRef.current.x, y: offsetRef.current.y });
  const savedScale = useRef(0.35);
  const isDragging = useRef(false);

  // Scale is only needed for node sizing / checkpoint visibility — update sparingly
  const [scaleState, setScaleState] = useState(0.35);
  const scale = scaleState;

  const panGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    .onStart(() => {
      savedOffset.current = { x: offsetRef.current.x, y: offsetRef.current.y };
      isDragging.current = false;
    })
    .onUpdate((e) => {
      isDragging.current = true;
      const newX = savedOffset.current.x + e.translationX;
      const newY = savedOffset.current.y + e.translationY;
      offsetRef.current = { x: newX, y: newY };
      translateX.setValue(newX);
      translateY.setValue(newY);
    })
    .onEnd(() => {
      setTimeout(() => { isDragging.current = false; }, 100);
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.current = scaleRef.current;
    })
    .onUpdate((e) => {
      const newScale = Math.max(0.2, Math.min(5, savedScale.current * e.scale));
      scaleRef.current = newScale;
      scaleAnim.setValue(newScale);
    })
    .onEnd(() => {
      // Only trigger React re-render on pinch END (for checkpoint visibility etc)
      setScaleState(scaleRef.current);
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  // Compute visibility for all exercises
  const visMap = computeVisibility(profile);

  // Build lines and checkpoints based on visibility
  const progressionLines = buildProgressionLines(visMap);
  const crossLinkLines = buildCrossLinkLines(visMap);
  const checkpointPos = buildCheckpointPositions(visMap);

  const allNodes = Array.from(nodePositions.values());

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.canvas,
              {
                transform: [
                  { translateX: translateX },
                  { translateY: translateY },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            {/* Connection lines — rendered as rotated Views (no SVG bitmap) */}
            {progressionLines.map((line, i) => {
              const dx = line.x2 - line.x1;
              const dy = line.y2 - line.y1;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              return (
                <View
                  key={`line-${i}`}
                  style={{
                    position: "absolute",
                    left: line.x1,
                    top: line.y1 - 1.5,
                    width: length,
                    height: 3,
                    backgroundColor: line.color,
                    opacity: 0.8,
                    borderRadius: 1.5,
                    transform: [{ rotate: `${angle}deg` }],
                    transformOrigin: "left center",
                  }}
                />
              );
            })}
            {/* Cross-links — dashed effect with dotted views */}
            {crossLinkLines.map((line, i) => {
              const dx = line.x2 - line.x1;
              const dy = line.y2 - line.y1;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              return (
                <View
                  key={`cross-${i}`}
                  style={{
                    position: "absolute",
                    left: line.x1,
                    top: line.y1 - 1,
                    width: length,
                    height: 2,
                    backgroundColor: "#AAAADD",
                    opacity: 0.4,
                    borderRadius: 1,
                    transform: [{ rotate: `${angle}deg` }],
                    transformOrigin: "left center",
                  }}
                />
              );
            })}

            {/* Exercise nodes */}
            {allNodes.map((node) => {
              const nodeScale = Math.min(1, 0.75 / scale + 0.25);

              if (node.isStart) {
                const size = NODE_SIZES.start;
                return (
                  <View
                    key="start"
                    style={[
                      styles.startNode,
                      {
                        left: node.x - size.w / 2,
                        top: node.y - size.h / 2,
                        width: size.w,
                        height: size.h,
                        borderRadius: size.w / 2,
                        transform: [{ scale: nodeScale }],
                      },
                    ]}
                  >
                    <Text style={styles.startText}>START</Text>
                  </View>
                );
              }

              const ex = node.exercise!;
              const vis = visMap.get(ex.id) ?? "hidden";
              const pathColor = pathColors[ex.path];
              const darkColor = pathDarkColors[ex.path];

              // HIDDEN: tiny grey dot
              if (vis === "hidden") {
                return (
                  <TouchableOpacity
                    key={ex.id}
                    style={[
                      styles.hiddenDot,
                      {
                        left: node.x - 4,
                        top: node.y - 4,
                        transform: [{ scale: nodeScale }],
                      },
                    ]}
                    onPress={() => {
                      if (!isDragging.current) {
                        Alert.alert(
                          "Locked Path",
                          `This path leads to: ${getFinalExerciseName(ex.subPath)}`
                        );
                      }
                    }}
                    activeOpacity={0.7}
                  />
                );
              }

              const nodeType = ex.nodeType;
              const size = NODE_SIZES[nodeType] || NODE_SIZES.regular;
              const isCompleted = vis === "completed";
              const isCurrent = vis === "current";

              const nodeBg = isCompleted ? pathColor : colors.cardLight;

              const nodeBorderColor = isCompleted
                ? pathColor
                : "#FFFFFF";

              const borderWidth =
                nodeType === "final" ? 2.5 : nodeType === "convergence" ? 2 : 1.5;

              return (
                <TouchableOpacity
                  key={ex.id}
                  style={[
                    styles.exerciseNode,
                    {
                      left: node.x - size.w / 2,
                      top: node.y - size.h / 2,
                      width: size.w,
                      height: size.h,
                      backgroundColor: nodeBg,
                      borderColor: nodeBorderColor,
                      borderWidth,
                      opacity: 1,
                      transform: [{ scale: nodeScale }],
                    },
                    nodeType === "convergence" && {
                      borderWidth: 2,
                      shadowColor: nodeBorderColor,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 4,
                      elevation: 6,
                    },
                    isCurrent && {
                      shadowColor: "#FFFFFF",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.6,
                      shadowRadius: 10,
                      elevation: 8,
                    },
                    isCompleted && {
                      shadowColor: pathColor,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 8,
                      elevation: 6,
                    },
                  ]}
                  onPress={() => {
                    if (!isDragging.current) router.push(`/exercise/${ex.id}`);
                  }}
                  activeOpacity={0.7}
                >
                  {/* Convergence double border overlay */}
                  {nodeType === "convergence" && (
                    <View
                      style={[
                        styles.convergenceOverlay,
                        { borderColor: nodeBorderColor },
                      ]}
                      pointerEvents="none"
                    />
                  )}
                  <Text
                    style={styles.nodeName}
                    numberOfLines={3}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {ex.name}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* Checkpoint nodes -- visible when zoomed in */}
            {scale >= 1.5 &&
              checkpointPos.map((cp, i) => {
                const cpScale = Math.min(1, 0.75 / scale + 0.25);
                const showLabel = scale >= 2.0;
                const size = 16;

                return (
                  <View
                    key={`cp-${i}`}
                    style={[
                      styles.checkpointContainer,
                      {
                        left: cp.x - (showLabel ? 50 : size / 2),
                        top: cp.y - (showLabel ? 20 : size / 2),
                        transform: [{ scale: cpScale }],
                      },
                    ]}
                  >
                    {showLabel ? (
                      <TouchableOpacity
                        style={[
                          styles.checkpointCard,
                          { borderColor: cp.color + "99" },
                        ]}
                        onPress={() =>
                          Linking.openURL(getYouTubeSearchUrl(cp.checkpoint.name))
                        }
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.checkpointDot,
                            { backgroundColor: cp.color + "99" },
                          ]}
                        />
                        <View style={styles.checkpointInfo}>
                          <Text style={styles.checkpointName} numberOfLines={1}>
                            {cp.checkpoint.name}
                          </Text>
                          <Text style={styles.checkpointMetric}>
                            {cp.checkpoint.metric}
                          </Text>
                        </View>
                        <Text style={[styles.checkpointYt, { color: cp.color }]}>
                          &#x25B6;
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={[
                          styles.checkpointDotOnly,
                          { backgroundColor: cp.color + "99" },
                        ]}
                      />
                    )}
                  </View>
                );
              })}
          </Animated.View>

          {/* Zoom controls */}
          <View style={styles.zoomControls}>
            <TouchableOpacity
              style={styles.zoomBtn}
              onPress={() => {
                const s = Math.min(5, scaleRef.current + 0.15);
                scaleRef.current = s;
                scaleAnim.setValue(s);
                setScaleState(s);
              }}
            >
              <Text style={styles.zoomText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.zoomBtn}
              onPress={() => {
                const s = Math.max(0.2, scaleRef.current - 0.15);
                scaleRef.current = s;
                scaleAnim.setValue(s);
                setScaleState(s);
              }}
            >
              <Text style={styles.zoomText}>&#x2212;</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080E1E",
    overflow: "hidden",
  },
  canvas: {
    width: CANVAS_W,
    height: CANVAS_H,
    position: "absolute",
    backgroundColor: "#0B1222",
  },
  startNode: {
    position: "absolute",
    backgroundColor: "#FF4D6A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FF8FA3",
    shadowColor: "#FF4D6A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15,
  },
  startText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
  },
  exerciseNode: {
    position: "absolute",
    borderRadius: 14,
    borderWidth: 2.5,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  hiddenDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#555555",
    opacity: 0.2,
  },
  convergenceOverlay: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  nodeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nodeDiffBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
  },
  nodeDiffText: {
    color: colors.text,
    fontSize: 7,
    fontWeight: "900",
  },
  nodeCheck: {
    fontSize: 10,
    color: colors.success,
  },
  nodeCurrent: {
    fontSize: 8,
    color: "#FFFFFF",
  },
  nodeName: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
    lineHeight: 12,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  zoomControls: {
    position: "absolute",
    bottom: 30,
    right: 20,
    gap: 8,
  },
  zoomBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1A1F35",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2A3050",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  zoomText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  checkpointContainer: {
    position: "absolute",
  },
  checkpointDotOnly: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  checkpointCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 4,
    width: 100,
  },
  checkpointDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  checkpointInfo: {
    flex: 1,
  },
  checkpointName: {
    color: colors.text,
    fontSize: 6,
    fontWeight: "600",
    lineHeight: 8,
  },
  checkpointMetric: {
    color: colors.textDim,
    fontSize: 5,
    lineHeight: 7,
  },
  checkpointYt: {
    fontSize: 10,
    fontWeight: "700",
  },
});
