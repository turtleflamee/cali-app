// Push-up detection using body keypoints
// Uses shoulder, elbow, wrist, hip, knee, ankle positions

export interface Keypoint {
  x: number;
  y: number;
  score?: number;
  name?: string;
}

export interface PushupState {
  position: "up" | "down" | "unknown";
  repCount: number;
  formFeedback: string;
  formScore: number; // 0-100
  isTracking: boolean;
}

// Calculate angle between three points (in degrees)
function angleBetween(a: Keypoint, b: Keypoint, c: Keypoint): number {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x * ab.x + ab.y * ab.y);
  const magCB = Math.sqrt(cb.x * cb.x + cb.y * cb.y);
  if (magAB === 0 || magCB === 0) return 0;
  const cosAngle = Math.max(-1, Math.min(1, dot / (magAB * magCB)));
  return (Math.acos(cosAngle) * 180) / Math.PI;
}

// Get a named keypoint from the array
function getKp(
  keypoints: Keypoint[],
  name: string
): Keypoint | null {
  const kp = keypoints.find((k) => k.name === name);
  if (!kp || (kp.score !== undefined && kp.score < 0.3)) return null;
  return kp;
}

const ELBOW_DOWN_THRESHOLD = 110; // elbow angle when "down"
const ELBOW_UP_THRESHOLD = 150; // elbow angle when "up"

export function createPushupTracker() {
  let state: PushupState = {
    position: "unknown",
    repCount: 0,
    formFeedback: "Get into push-up position",
    formScore: 100,
    isTracking: false,
  };

  let lastPosition: "up" | "down" | "unknown" = "unknown";
  let wentDown = false;
  let formScores: number[] = [];

  function reset() {
    state = {
      position: "unknown",
      repCount: 0,
      formFeedback: "Get into push-up position",
      formScore: 100,
      isTracking: false,
    };
    lastPosition = "unknown";
    wentDown = false;
    formScores = [];
  }

  function processKeypoints(keypoints: Keypoint[]): PushupState {
    // Get required keypoints (use either left or right side)
    const lShoulder = getKp(keypoints, "left_shoulder");
    const rShoulder = getKp(keypoints, "right_shoulder");
    const lElbow = getKp(keypoints, "left_elbow");
    const rElbow = getKp(keypoints, "right_elbow");
    const lWrist = getKp(keypoints, "left_wrist");
    const rWrist = getKp(keypoints, "right_wrist");
    const lHip = getKp(keypoints, "left_hip");
    const rHip = getKp(keypoints, "right_hip");
    const lAnkle = getKp(keypoints, "left_ankle");
    const rAnkle = getKp(keypoints, "right_ankle");

    // Use whichever side has better detection
    const shoulder = lShoulder || rShoulder;
    const elbow = lElbow || rElbow;
    const wrist = lWrist || rWrist;
    const hip = lHip || rHip;
    const ankle = lAnkle || rAnkle;

    if (!shoulder || !elbow || !wrist) {
      state.formFeedback = "Can't see your body — adjust camera";
      state.isTracking = false;
      return { ...state };
    }

    state.isTracking = true;

    // Calculate elbow angle (shoulder-elbow-wrist)
    const elbowAngle = angleBetween(shoulder, elbow, wrist);

    // Determine position
    let currentPosition: "up" | "down" | "unknown" = "unknown";
    if (elbowAngle > ELBOW_UP_THRESHOLD) {
      currentPosition = "up";
    } else if (elbowAngle < ELBOW_DOWN_THRESHOLD) {
      currentPosition = "down";
    } else {
      currentPosition = lastPosition !== "unknown" ? lastPosition : "unknown";
    }

    // Count reps: must go DOWN then UP
    if (currentPosition === "down" && lastPosition !== "down") {
      wentDown = true;
    }
    if (currentPosition === "up" && wentDown) {
      state.repCount++;
      wentDown = false;
    }

    lastPosition = currentPosition;
    state.position = currentPosition;

    // Form checking
    let feedback = "Good form!";
    let thisFormScore = 100;

    if (hip && shoulder && ankle) {
      // Check body alignment: shoulder-hip-ankle should be roughly straight
      const bodyAngle = angleBetween(shoulder, hip, ankle);
      if (bodyAngle < 150) {
        // Hips are sagging or piking
        if (hip.y > shoulder.y + 30) {
          feedback = "Keep your hips up — don't sag";
          thisFormScore -= 30;
        } else {
          feedback = "Keep your body in a straight line";
          thisFormScore -= 20;
        }
      }
    }

    if (currentPosition === "down" && elbowAngle > 120) {
      feedback = "Go deeper — chest closer to floor";
      thisFormScore -= 15;
    }

    formScores.push(Math.max(0, thisFormScore));
    state.formFeedback = feedback;
    state.formScore = Math.round(
      formScores.reduce((a, b) => a + b, 0) / formScores.length
    );

    return { ...state };
  }

  return { processKeypoints, reset, getState: () => ({ ...state }) };
}
