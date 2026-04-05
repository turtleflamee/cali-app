const {
  withAppBuildGradle,
  withDangerousMod,
  withMainApplication,
} = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// Kotlin source for the ML Kit Pose Detection frame processor plugin
const MLKIT_POSE_PLUGIN_KT = `
package com.fjodor010.calysthenics

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

  private val poseDetector: PoseDetector

  init {
    val opts = PoseDetectorOptions.Builder()
      .setDetectorMode(PoseDetectorOptions.STREAM_MODE)
      .build()
    poseDetector = PoseDetection.getClient(opts)
  }

  override fun callback(frame: Frame, params: Map<String, Any>?): Any? {
    try {
      if (!frame.isValid) return null

      val mediaImage = frame.image ?: return null
      val rotation = when (frame.orientation) {
        "portrait" -> 0
        "landscape-left" -> 90
        "portrait-upside-down" -> 180
        "landscape-right" -> 270
        else -> 0
      }

      val inputImage = InputImage.fromMediaImage(mediaImage, rotation)
      val pose: Pose = Tasks.await(poseDetector.process(inputImage))

      val landmarks = pose.allPoseLandmarks
      if (landmarks.isEmpty()) return null

      val result = HashMap<String, Any>()

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

      return result
    } catch (e: Exception) {
      return null
    }
  }
}
`;

// Kotlin source that registers the plugin at app startup
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

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return emptyList()
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return emptyList()
  }
}
`;

// 1. Add ML Kit dependency to build.gradle
function withMLKitGradle(config) {
  return withAppBuildGradle(config, (config) => {
    const contents = config.modResults.contents;

    // Add ML Kit pose detection dependency
    if (!contents.includes("pose-detection")) {
      config.modResults.contents = contents.replace(
        /dependencies\s*\{/,
        `dependencies {
    implementation 'com.google.mlkit:pose-detection:18.0.0-beta5'`
      );
    }

    return config;
  });
}

// 2. Write Kotlin source files
function withMLKitKotlinFiles(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const kotlinDir = path.join(
        projectRoot,
        "android",
        "app",
        "src",
        "main",
        "java",
        "com",
        "fjodor010",
        "calysthenics"
      );

      // Create directory if it doesn't exist
      fs.mkdirSync(kotlinDir, { recursive: true });

      // Write plugin file
      fs.writeFileSync(
        path.join(kotlinDir, "MLKitPosePlugin.kt"),
        MLKIT_POSE_PLUGIN_KT.trim()
      );

      // Write package file
      fs.writeFileSync(
        path.join(kotlinDir, "MLKitPosePackage.kt"),
        MLKIT_POSE_PACKAGE_KT.trim()
      );

      return config;
    },
  ]);
}

// 3. Register the package in MainApplication
function withMLKitMainApplication(config) {
  return withMainApplication(config, (config) => {
    const contents = config.modResults.contents;

    // Add import
    if (!contents.includes("MLKitPosePackage")) {
      config.modResults.contents = contents.replace(
        /import com\.facebook\.react\.defaults\./,
        `import com.fjodor010.calysthenics.MLKitPosePackage\nimport com.facebook.react.defaults.`
      );

      // Add to getPackages
      config.modResults.contents = config.modResults.contents.replace(
        /override fun getPackages\(\): List<ReactPackage> \{/,
        `override fun getPackages(): List<ReactPackage> {\n          packages.add(MLKitPosePackage())`
      );
    }

    return config;
  });
}

// Combined plugin
module.exports = function withMLKitPose(config) {
  config = withMLKitGradle(config);
  config = withMLKitKotlinFiles(config);
  config = withMLKitMainApplication(config);
  return config;
};
