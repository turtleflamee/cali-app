import { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
  Dimensions,
} from "react-native";

const { width: WIN_W, height: WIN_H } = Dimensions.get("window");
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../data/theme";

const SKELETON_LINES: [string, string][] = [
  ["leftShoulder", "rightShoulder"],
  ["leftShoulder", "leftElbow"], ["leftElbow", "leftWrist"],
  ["rightShoulder", "rightElbow"], ["rightElbow", "rightWrist"],
  ["leftShoulder", "leftHip"], ["rightShoulder", "rightHip"],
  ["leftHip", "rightHip"],
  ["leftHip", "leftKnee"], ["leftKnee", "leftAnkle"],
  ["rightHip", "rightKnee"], ["rightKnee", "rightAnkle"],
];

function angleBetween(a: {x:number,y:number}, b: {x:number,y:number}, c: {x:number,y:number}): number {
  const ab = {x:a.x-b.x, y:a.y-b.y};
  const cb = {x:c.x-b.x, y:c.y-b.y};
  const dot = ab.x*cb.x + ab.y*cb.y;
  const mag = Math.sqrt(ab.x*ab.x+ab.y*ab.y) * Math.sqrt(cb.x*cb.x+cb.y*cb.y);
  if (mag === 0) return 0;
  return (Math.acos(Math.max(-1,Math.min(1,dot/mag)))*180)/Math.PI;
}

type Points = Record<string, {x:number,y:number}>;

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  if (Platform.OS === "web") {
    return <View style={[styles.container,styles.center]}><Text style={styles.statusText}>Camera requires a phone.</Text></View>;
  }
  return <NativeCamera />;
}

function NativeCamera() {
  const insets = useSafeAreaInsets();

  // Load VisionCamera
  let VCamera: any, useCameraDevice: any, useCameraPermission: any, useFrameProcessor: any, VisionCameraProxy: any;
  let hasFrameProcessor = false;
  try {
    const vc = require("react-native-vision-camera");
    VCamera = vc.Camera;
    useCameraDevice = vc.useCameraDevice;
    useCameraPermission = vc.useCameraPermission;
    useFrameProcessor = vc.useFrameProcessor;
    VisionCameraProxy = vc.VisionCameraProxy;
    hasFrameProcessor = typeof useFrameProcessor === "function";
  } catch {
    return <View style={[styles.container,styles.center]}><Text style={styles.statusText}>Camera not available.</Text></View>;
  }

  // Try to init the ML Kit pose plugin
  let posePlugin: any = null;
  let poseError = "";
  try {
    posePlugin = VisionCameraProxy.initFrameProcessorPlugin("mlkitPose", {});
    if (!posePlugin) poseError = "Plugin 'mlkitPose' not found in registry";
  } catch (e: any) {
    poseError = e?.message || "Unknown error loading pose plugin";
  }
  const hasPose = posePlugin != null && hasFrameProcessor;
  if (!hasFrameProcessor) poseError = "useFrameProcessor not available";

  const { hasPermission, requestPermission } = useCameraPermission();
  const [facing, setFacing] = useState<"back"|"front">("front");
  const device = useCameraDevice(facing);
  const [isActive, setIsActive] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [points, setPoints] = useState<Points|null>(null);
  const [repCount, setRepCount] = useState(0);
  const [position, setPosition] = useState<"up"|"down">("up");
  const [feedback, setFeedback] = useState("Get into position");
  const [poseFrames, setPoseFrames] = useState(0);
  const [debugInfo, setDebugInfo] = useState("");
  const wentDown = useRef(false);
  const timerRef = useRef<any>(null);
  const [elapsed, setElapsed] = useState(0);

  if (!hasPermission) requestPermission();

  useFocusEffect(useCallback(() => {
    setIsActive(true);
    return () => { setIsActive(false); if (timerRef.current) clearInterval(timerRef.current); };
  }, []));

  // Pose processing (called from JS side via runOnJS or directly)
  const processPose = useCallback((pose: any) => {
    setPoseFrames(f => f + 1);
    if (!pose || typeof pose !== "object") { setDebugInfo("No pose data"); setPoints(null); return; }

    // Check for error from native
    if (pose._error) { setDebugInfo(`ERR: ${pose._error}`); setPoints(null); return; }

    // Get frame dimensions and landmark count from native
    const fw = pose._fw || 1;
    const fh = pose._fh || 1;
    const nativeCount = pose._count || 0;

    // Show all keys for debugging
    const allKeys = Object.keys(pose).filter(k => !k.startsWith("_")).join(",");
    if (!allKeys) { setDebugInfo(`ML Kit: ${nativeCount} native, no keys (${Math.round(fw)}x${Math.round(fh)})`); setPoints(null); return; }

    // Parse flat keys: "leftShoulder_x", "leftShoulder_y" → { leftShoulder: {x, y} }
    const pts: Points = {};
    const bodyParts = ["nose","leftShoulder","rightShoulder","leftElbow","rightElbow",
      "leftWrist","rightWrist","leftHip","rightHip","leftKnee","rightKnee","leftAnkle","rightAnkle"];

    for (const part of bodyParts) {
      const px = pose[part + "_x"];
      const py = pose[part + "_y"];
      if (typeof px === "number" && typeof py === "number") {
        pts[part] = {
          x: (px / fw) * WIN_W,
          y: (py / fh) * WIN_H,
        };
      }
    }
    const count = Object.keys(pts).length;
    if (count < 3) { setDebugInfo(`${count}/${nativeCount} pts (${Math.round(fw)}x${Math.round(fh)})`); setPoints(null); return; }
    setDebugInfo(`${count} pts OK (${Math.round(fw)}x${Math.round(fh)})`);
    setPoints(pts);

    if (!isRunning) return;
    const sh = pts.leftShoulder || pts.rightShoulder;
    const el = pts.leftElbow || pts.rightElbow;
    const wr = pts.leftWrist || pts.rightWrist;
    const hp = pts.leftHip || pts.rightHip;
    if (!sh || !el || !wr) { setFeedback("Show your full body"); return; }

    const angle = angleBetween(sh, el, wr);
    const newPos: "up"|"down" = angle < 110 ? "down" : angle > 150 ? "up" : position;
    if (newPos === "down" && position !== "down") wentDown.current = true;
    if (newPos === "up" && wentDown.current) { setRepCount(c=>c+1); wentDown.current = false; }
    setPosition(newPos);

    if (hp) {
      const ak = pts.leftAnkle || pts.rightAnkle || {x:hp.x,y:hp.y+100};
      const body = angleBetween(sh, hp, ak);
      setFeedback(body < 150 ? "Keep body straight!" : angle > 120 && newPos==="down" ? "Go deeper!" : "Good form!");
    }
  }, [isRunning, position]);

  // Frame processor — runs on worklet thread
  let frameProcessor: any = undefined;
  if (hasPose && useFrameProcessor) {
    try {
      const { Worklets } = require("react-native-worklets-core");
      const runPoseOnJS = Worklets.createRunOnJS(processPose);

      frameProcessor = useFrameProcessor((frame: any) => {
        "worklet";
        const result = posePlugin!.call(frame);
        if (result) {
          runPoseOnJS(result);
        }
      }, [runPoseOnJS]);
    } catch (e: any) {
      console.warn("Frame processor setup failed:", e?.message);
    }
  }

  const handleTap = () => {
    if (!isRunning) return;
    if (position === "up") { setPosition("down"); wentDown.current = true; }
    else { setPosition("up"); if (wentDown.current) { setRepCount(c=>c+1); wentDown.current = false; } }
  };

  const startSession = () => {
    setRepCount(0); setPosition("up"); setElapsed(0); setShowSummary(false);
    setIsRunning(true); setFeedback("Start pushing!"); wentDown.current = false;
    timerRef.current = setInterval(() => setElapsed(t=>t+1), 1000);
  };

  const stopSession = () => {
    setIsRunning(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setShowSummary(true);
  };

  const fmt = (s:number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

  if (!device) return <View style={[styles.container,styles.center]}><Text style={styles.statusText}>No camera</Text></View>;
  if (!hasPermission) return (
    <View style={[styles.container,styles.center,{paddingTop:insets.top}]}>
      <Text style={styles.title}>Camera Access Needed</Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={async()=>{const r=await requestPermission();if(!r) Linking.openSettings();}}><Text style={styles.primaryBtnText}>Grant Permission</Text></TouchableOpacity>
    </View>
  );

  if (showSummary) {
    const rpm = elapsed>0 ? ((repCount/elapsed)*60).toFixed(1) : "0";
    return (
      <View style={[styles.container,styles.center,{paddingTop:insets.top}]}>
        <Text style={styles.summaryEmoji}>{repCount>=20?"🔥":repCount>=10?"💪":"👊"}</Text>
        <Text style={styles.summaryTitle}>Session Complete</Text>
        <View style={styles.summaryCard}><Text style={styles.summaryBig}>{repCount}</Text><Text style={styles.summaryLabel}>push-ups</Text></View>
        <View style={styles.summaryRow}>
          <View style={styles.summarySmallCard}><Text style={styles.summaryStat}>{fmt(elapsed)}</Text><Text style={styles.summaryLabel}>time</Text></View>
          <View style={styles.summarySmallCard}><Text style={styles.summaryStat}>{rpm}</Text><Text style={styles.summaryLabel}>reps/min</Text></View>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={()=>setShowSummary(false)}><Text style={styles.primaryBtnText}>Go Again</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VCamera
        style={styles.camera}
        device={device}
        isActive={isActive}
        frameProcessor={frameProcessor}
      />

      {/* Skeleton overlay */}
      {points && (
        <View style={styles.skeletonOverlay} pointerEvents="none">
          {Object.values(points).map((pt,i) => (
            <View key={`d${i}`} style={[styles.kpDot,{left:pt.x-5,top:pt.y-5}]} />
          ))}
          {SKELETON_LINES.map(([a,b],i) => {
            const pa=points[a], pb=points[b];
            if (!pa||!pb) return null;
            const dx=pb.x-pa.x, dy=pb.y-pa.y;
            const len=Math.sqrt(dx*dx+dy*dy);
            const ang=Math.atan2(dy,dx)*(180/Math.PI);
            return <View key={`s${i}`} style={[styles.skelLine,{left:pa.x,top:pa.y-1.5,width:len,transform:[{rotate:`${ang}deg`}]}]} />;
          })}
        </View>
      )}

      {/* Tap zone fallback */}
      {!hasPose && isRunning && (
        <TouchableOpacity style={styles.tapZone} onPress={handleTap} activeOpacity={1}>
          <Text style={styles.tapHint}>Tap: {position==="up"?"down":"up"}</Text>
        </TouchableOpacity>
      )}

      {/* Top HUD */}
      <View style={[styles.topOverlay,{paddingTop:insets.top+8}]} pointerEvents="none">
        <View style={styles.repBox}><Text style={styles.repNum}>{repCount}</Text><Text style={styles.repLbl}>reps</Text></View>
        <View style={styles.badge}>
          <View style={[styles.dot,{backgroundColor:position==="down"?colors.primary:colors.success}]} />
          <Text style={styles.badgeTxt}>{!isRunning?"Ready":`${position.toUpperCase()} · ${fmt(elapsed)}`}</Text>
        </View>
      </View>

      {/* Feedback */}
      {isRunning && <View style={styles.fbBanner}><Text style={styles.fbTxt}>{feedback}</Text></View>}

      {/* Mode indicator */}
      {!isRunning && <View style={styles.fbBanner}><Text style={styles.fbTxt}>{hasPose?`Skeleton ON | Frames: ${poseFrames} | ${debugInfo}`:`Tap mode: ${poseError}`}</Text></View>}

      {/* Bottom */}
      <View style={[styles.botOverlay,{paddingBottom:insets.bottom+20}]}>
        <TouchableOpacity style={styles.sideBox} onPress={()=>setFacing(f=>f==="back"?"front":"back")} activeOpacity={0.7}>
          <Text style={styles.sideNum}>🔄</Text><Text style={styles.sideLbl}>flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainBtn,isRunning&&styles.stopBtn]} onPress={isRunning?stopSession:startSession}>
          <Text style={styles.mainTxt}>{isRunning?"Stop":"Start"}</Text>
        </TouchableOpacity>
        <View style={styles.sideBox}><Text style={styles.sideNum}>{isRunning?`${repCount}`:"—"}</Text><Text style={styles.sideLbl}>reps</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.bg},
  center:{justifyContent:"center",alignItems:"center",padding:32},
  camera:{flex:1},
  title:{fontSize:24,fontWeight:"800",color:colors.text,marginBottom:12},
  statusText:{fontSize:16,color:colors.textDim,textAlign:"center",lineHeight:24,marginBottom:24},
  skeletonOverlay:{...StyleSheet.absoluteFillObject},
  kpDot:{position:"absolute",width:10,height:10,borderRadius:5,backgroundColor:"#00FF88"},
  skelLine:{position:"absolute",height:3,backgroundColor:"rgba(0,255,136,0.7)",borderRadius:1.5,transformOrigin:"left center"},
  tapZone:{position:"absolute",top:"20%",bottom:"25%",left:0,right:0,justifyContent:"center",alignItems:"center"},
  tapHint:{color:"rgba(255,255,255,0.5)",fontSize:15,fontWeight:"600",backgroundColor:"rgba(0,0,0,0.3)",paddingHorizontal:16,paddingVertical:8,borderRadius:10},
  topOverlay:{position:"absolute",top:0,left:0,right:0,flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",paddingHorizontal:20},
  repBox:{backgroundColor:"rgba(0,0,0,0.7)",borderRadius:16,paddingHorizontal:20,paddingVertical:10,alignItems:"center"},
  repNum:{fontSize:48,fontWeight:"900",color:colors.text},
  repLbl:{fontSize:14,color:colors.textDim,fontWeight:"600"},
  badge:{flexDirection:"row",alignItems:"center",backgroundColor:"rgba(0,0,0,0.7)",borderRadius:12,paddingHorizontal:12,paddingVertical:8,gap:6},
  dot:{width:8,height:8,borderRadius:4},
  badgeTxt:{color:colors.text,fontSize:13,fontWeight:"600"},
  fbBanner:{position:"absolute",top:"40%",left:20,right:20,backgroundColor:"rgba(0,0,0,0.7)",borderRadius:14,paddingVertical:12,paddingHorizontal:16,alignItems:"center"},
  fbTxt:{color:colors.text,fontSize:17,fontWeight:"700",textAlign:"center"},
  botOverlay:{position:"absolute",bottom:0,left:0,right:0,flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingHorizontal:20},
  sideBox:{backgroundColor:"rgba(0,0,0,0.7)",borderRadius:14,paddingHorizontal:16,paddingVertical:10,alignItems:"center",minWidth:60},
  sideNum:{color:colors.text,fontSize:18,fontWeight:"800"},
  sideLbl:{color:colors.textDim,fontSize:11,fontWeight:"600"},
  mainBtn:{backgroundColor:colors.success,borderRadius:30,width:80,height:80,justifyContent:"center",alignItems:"center"},
  stopBtn:{backgroundColor:colors.primary},
  mainTxt:{color:colors.text,fontSize:16,fontWeight:"800"},
  primaryBtn:{backgroundColor:colors.primary,borderRadius:14,paddingVertical:16,paddingHorizontal:32,alignItems:"center"},
  primaryBtnText:{color:colors.text,fontSize:18,fontWeight:"700"},
  summaryEmoji:{fontSize:48,marginBottom:16},
  summaryTitle:{fontSize:28,fontWeight:"800",color:colors.text,marginBottom:24},
  summaryCard:{backgroundColor:colors.card,borderRadius:16,padding:20,alignItems:"center",marginBottom:12,width:"100%"},
  summaryBig:{fontSize:48,fontWeight:"900",color:colors.text},
  summaryLabel:{fontSize:14,color:colors.textDim,fontWeight:"600",marginTop:4},
  summaryRow:{flexDirection:"row",gap:12,marginBottom:24,width:"100%"},
  summarySmallCard:{flex:1,backgroundColor:colors.card,borderRadius:16,padding:16,alignItems:"center"},
  summaryStat:{fontSize:24,fontWeight:"800",color:colors.text},
});
