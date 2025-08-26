import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { formatTime } from "../utils/format-time";
import { SessionConfig } from "../types/session";
import { TimerStep } from "../types/timer";

const CIRCLE_RADIUS = 35;
const CIRCLE_LENGTH = 2 * Math.PI * CIRCLE_RADIUS;

type Props = {
  currentStep: TimerStep;
  currentStepIndex: number;
  totalSteps: number;
  secondsLeft: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  sessionConfig: SessionConfig;
};

export default function TimerProgress({
  currentStep,
  currentStepIndex,
  totalSteps,
  secondsLeft,
  isRunning,
  onToggleTimer,
  sessionConfig,
}: Props) {
  const progress =
    currentStep.duration > 0 ? 1 - secondsLeft / currentStep.duration : 1;

  const strokeDashoffset = CIRCLE_LENGTH * (1 - progress);
  const RUNNING_BUTTON_COLOUR = "#f5d329";
  const PAUSED_BUTTON_COLOUR = "#307eae";

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulsing animation of background circle
  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (isRunning) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 950,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.stopAnimation();
    }

    return () => {
      animation?.stop();
    };
  }, [isRunning]);

  return (
    <View style={styles.container}>
      <View style={styles.spacerTop} />
      <View style={styles.stepTypeWrapper}>
        <Animated.View
          style={[
            styles.stepTypeBackground,
            {
              backgroundColor:
                currentStep.type === "work" ? "#307eae" : "#f5d329",
              shadowColor: currentStep.type === "work" ? "#307eae" : "#f5d329",
              opacity: currentStep.type === "work" ? 0.4 : 0.5,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        <Text style={styles.stepType}>
          {currentStep.type === "work" ? "WORK" : "REST"}
        </Text>
      </View>
      <Text style={styles.stepLabel}>{currentStep.label}</Text>
      <Text style={styles.sessionConfig}>
        {`Rep: ${sessionConfig.repWorkTime}s   •   Rep Rest: ${sessionConfig.interRepRest}s   •   Set Rest: ${sessionConfig.interSetRest}s`}
      </Text>
      <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
      <View style={styles.svgContainer}>
        <Svg width="100" height="100">
          {/* Background circle */}
          <Circle
            cx="50"
            cy="50"
            r={CIRCLE_RADIUS}
            stroke="#333"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx="50"
            cy="50"
            r={CIRCLE_RADIUS}
            stroke="#f6f6f6"
            strokeWidth="8"
            fill="none"
            strokeDasharray={CIRCLE_LENGTH}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin="50, 50"
          />
        </Svg>

        {/* Play/Pause button */}
        <Pressable
          style={[
            styles.playPauseButton,
            {
              backgroundColor: isRunning
                ? RUNNING_BUTTON_COLOUR
                : PAUSED_BUTTON_COLOUR,
            },
          ]}
          onPress={onToggleTimer}
        >
          <Ionicons
            name={isRunning ? "pause" : "play"}
            size={24}
            color="#ffffff"
          />
        </Pressable>
      </View>

      <Text style={styles.stepCount}>
        Step {currentStepIndex + 1} of {totalSteps}
      </Text>

      <View style={styles.spacerBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    flex: 1,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  spacerTop: {
    flex: 1,
  },
  spacerBottom: {
    height: 100,
    flex: 1,
  },
  svgContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  playPauseButton: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  stepLabel: {
    fontSize: 18,
    color: "#f6f6f6",
    marginBottom: 10,
    textAlign: "center",
  },
  sessionConfig: {
    fontSize: 18,
    color: "#f6f6f6",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
    opacity: 0.82,
  },
  timerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f6f6f6",
    marginBottom: 20,
    textAlign: "center",
  },
  stepCount: {
    fontSize: 18,
    color: "#f6f6f6",
    textAlign: "center",
    opacity: 0.82,
  },
  stepTypeWrapper: {
    position: "relative",
    marginBottom: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  stepTypeBackground: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 9999,
    // Glowing effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  stepType: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#f6f6f6",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
