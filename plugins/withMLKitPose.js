const {
  withAppBuildGradle,
  withDangerousMod,
  withMainApplication,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const MLKIT_POSE_PLUGIN_KT = `
package com.fjodor010.calysthenics

import android.util.Log
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.pose.Pose
import com.google.mlkit.vision.pose.PoseDetection
import com.google.mlkit.vision.pose.PoseDetector
import com.google.mlkit.vision.pose.PoseLandmark
import com.google.mlkit.vision.pose.defaults.PoseDetectorOptions
import com.google.android.gms.tasks.Tasks
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy

class MLKitPosePlugin(proxy: VisionCameraProxy, options: Map<String, Any>?) : FrameProcessorPlugin() {

  private val TAG = "MLKitPose"
  private val poseDetector: PoseDetector = PoseDetection.getClient(
    PoseDetectorOptions.Builder()
      .setDetectorMode(PoseDetectorOptions.STREAM_MODE)
      .build()
  )

  override fun callback(frame: Frame, params: Map<String, Any>?): Any? {
    return try {
      if (!frame.getIsValid()) return null

      val mediaImage = frame.getImage() ?: return null
      val rotationDegrees = frame.getOrientation().toSurfaceRotation() * 90

      val inputImage = InputImage.fromMediaImage(mediaImage, rotationDegrees)
      val pose: Pose = Tasks.await(poseDetector.process(inputImage))

      val landmarks = pose.allPoseLandmarks
      Log.d(TAG, "Detected landmarks count: " + landmarks.size)
      if (landmarks.isEmpty()) return null

      // Get frame dimensions for coordinate scaling
      val frameWidth = frame.getWidth()
      val frameHeight = frame.getHeight()

      val result = HashMap<String, Any>()
      // Add frame size for JS-side scaling
      result["_frameWidth"] = frameWidth.toDouble()
      result["_frameHeight"] = frameHeight.toDouble()

      for (landmark in landmarks) {
        val name = when (landmark.landmarkType) {
          PoseLandmark.NOSE -> "nose"
          PoseLandmark.LEFT_SHOULDER -> "leftShoulder"
          PoseLandmark.RIGHT_SHOULDER -> "rightShoulder"
          PoseLandmark.LEFT_ELBOW -> "leftElbow"
          PoseLandmark.RIGHT_ELBOW -> "rightElbow"
          PoseLandmark.LEFT_WRIST -> "leftWrist"
          PoseLandmark.RIGHT_WRIST -> "rightWrist"
          PoseLandmark.LEFT_HIP -> "leftHip"
          PoseLandmark.RIGHT_HIP -> "rightHip"
          PoseLandmark.LEFT_KNEE -> "leftKnee"
          PoseLandmark.RIGHT_KNEE -> "rightKnee"
          PoseLandmark.LEFT_ANKLE -> "leftAnkle"
          PoseLandmark.RIGHT_ANKLE -> "rightAnkle"
          else -> null
        } ?: continue

        val point = HashMap<String, Any>()
        point["x"] = landmark.position.x.toDouble()
        point["y"] = landmark.position.y.toDouble()
        result[name] = point
      }
      Log.d(TAG, "Returning result with keys: " + result.keys.joinToString(","))
      result
    } catch (e: Exception) {
      Log.e(TAG, "Error in callback: " + e.message, e)
      // Return error info to JS for debugging
      val err = HashMap<String, Any>()
      err["_error"] = e.message ?: "unknown"
      err
    }
  }
}
`;

const MLKIT_POSE_PACKAGE_KT = `
package com.fjodor010.calysthenics

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.mrousavy.camera.frameprocessors.FrameProcessorPluginRegistry

class MLKitPosePackage : ReactPackage {
  companion object {
    init {
      FrameProcessorPluginRegistry.addFrameProcessorPlugin("mlkitPose") { proxy, options ->
        MLKitPosePlugin(proxy, options)
      }
    }
  }

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> = emptyList()
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}
`;

function withMLKitGradle(config) {
  return withAppBuildGradle(config, (config) => {
    const contents = config.modResults.contents;
    if (!contents.includes("pose-detection")) {
      config.modResults.contents = contents.replace(
        /dependencies\s*\{/,
        `dependencies {\n    implementation 'com.google.mlkit:pose-detection:18.0.0-beta5'`
      );
    }
    return config;
  });
}

function withMLKitKotlinFiles(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const kotlinDir = path.join(
        projectRoot, "android", "app", "src", "main", "java",
        "com", "fjodor010", "calysthenics"
      );
      fs.mkdirSync(kotlinDir, { recursive: true });
      fs.writeFileSync(path.join(kotlinDir, "MLKitPosePlugin.kt"), MLKIT_POSE_PLUGIN_KT.trim());
      fs.writeFileSync(path.join(kotlinDir, "MLKitPosePackage.kt"), MLKIT_POSE_PACKAGE_KT.trim());
      return config;
    },
  ]);
}

function withMLKitMainApplication(config) {
  return withMainApplication(config, (config) => {
    let contents = config.modResults.contents;
    if (!contents.includes("MLKitPosePackage")) {
      // Add import at the top with other imports
      contents = contents.replace(
        /import com\.facebook\.react\.defaults\./,
        `import com.fjodor010.calysthenics.MLKitPosePackage\nimport com.facebook.react.defaults.`
      );
      // Add package to the packages list
      contents = contents.replace(
        /PackageList\(this\)\.packages\.apply\s*\{/,
        `PackageList(this).packages.apply {\n              add(MLKitPosePackage())`
      );
      config.modResults.contents = contents;
    }
    return config;
  });
}

module.exports = function withMLKitPose(config) {
  config = withMLKitGradle(config);
  config = withMLKitKotlinFiles(config);
  config = withMLKitMainApplication(config);
  return config;
};
