import { useEffect, useState, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppState } from "react-native";
import * as Haptics from "expo-haptics";

import TimerTimeline from "@/components/timer-timeline";
import TimerProgress from "@/components/timer-progress";
import { generateTimerSteps } from "@/utils/generate-timer-steps";
import { celebrateWithHaptics } from "@/utils/celebrate-with-haptics";
import { calculateTotalTime } from "@/utils/calculate-total-time";

import { SessionConfig } from "@/types/session-config.types";
import { TimerStep } from "@/types/timer-step.types";

export default function TimerScreen() {
  const { sets, reps, interSetRest, interRepRest, repWorkTime } =
    useLocalSearchParams();

  const [steps, setSteps] = useState<TimerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepDuration, setStepDuration] = useState(0); 
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const frameRef = useRef<number | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const isRunningRef = useRef(isRunning);
  const stepDurationRef = useRef(stepDuration);
  const currentStepIndexRef = useRef(currentStepIndex);
  const stepsRef = useRef<TimerStep[]>([]);
  const wasPausedDueToAppStateRef = useRef(false);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  const parsed: SessionConfig = {
    sets: Number(sets),
    reps: Number(reps),
    interSetRest: Number(interSetRest),
    interRepRest: Number(interRepRest),
    repWorkTime: Number(repWorkTime),
  };

  // Calculate total exercise time
  const totalTimeSeconds: number = calculateTotalTime(parsed);

  // Start a step
  const startStep = (duration: number) => {
    setStepDuration(duration);
    setSecondsLeft(duration);
    stepDurationRef.current = duration;
    startTimestampRef.current = Date.now();
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setTimeout(() => {
      frameRef.current = requestAnimationFrame(tick);
    }, 50);
  };

  // Start a step for a given index
  const startStepForIndex = (index: number) => {
    const step = stepsRef.current[index];
    if (!step) return;
    currentStepIndexRef.current = index;
    setCurrentStepIndex(index);
    startStep(step.duration);
  };

  const tick = () => {
    if (!isRunningRef.current || startTimestampRef.current === null) {
      return;
    }

    if (stepDurationRef.current === 0) {
      console.warn("Warning: Current step duration is 0, skipping tick");
      return;
    }

    const now = Date.now();
    const elapsed = (now - startTimestampRef.current) / 1000;
    const newSecondsLeft = Math.max(stepDurationRef.current - elapsed, 0);

    setSecondsLeft(Math.ceil(newSecondsLeft));

    if (newSecondsLeft <= 0) {
      // Trigger haptics when switching to next step
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Advance to next step
      const nextIndex = currentStepIndexRef.current + 1;
      if (nextIndex < stepsRef.current.length) {
        startStepForIndex(nextIndex);
      } else {
        setIsRunning(false);
        return;
      }
    } else {
      frameRef.current = requestAnimationFrame(tick);
    }
  };

  const pause = () => {
    if (!isRunning) return;
    setIsRunning(false);
    pausedAtRef.current = Date.now();
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  };

  const resume = () => {
    if (isRunning || pausedAtRef.current === null) return;

    const pauseDuration = Date.now() - pausedAtRef.current;

    if (startTimestampRef.current) {
      startTimestampRef.current += pauseDuration;
    }
    pausedAtRef.current = null;
    setIsRunning(true);

    // Defer tick to next frame
    setTimeout(() => {
      frameRef.current = requestAnimationFrame(tick);
    }, 0);
  };

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    stepDurationRef.current = stepDuration;
  }, [stepDuration]);

  useEffect(() => {
    currentStepIndexRef.current = currentStepIndex;
  }, [currentStepIndex]);

  // Generate steps on mount
  useEffect(() => {
    const generatedSteps = generateTimerSteps(
      parsed.sets,
      parsed.reps,
      parsed.interSetRest,
      parsed.interRepRest,
      parsed.repWorkTime
    );

    setSteps(generatedSteps);
    setCurrentStepIndex(0);
    startStep(generatedSteps[0].duration);
    setIsRunning(true);
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  // Navigate to success screen when timer completes
  useEffect(() => {
    if (
      steps.length > 0 &&
      currentStepIndex === steps.length - 1 &&
      secondsLeft === 0
    ) {
      // Delayed nav to allow render to settle
      setTimeout(() => {
        // Haptics feedback
        celebrateWithHaptics(20, 25);

        router.replace({
          pathname: "/success",
          params: {
            totalTimeSeconds,
          },
        });
      }, 50);
    }
  }, [secondsLeft, currentStepIndex, steps.length]);

  // Pause timer when app is moved to background or inactive
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState !== "active") {
        pause();
        wasPausedDueToAppStateRef.current = true;
      }

      if (nextAppState === "active" && wasPausedDueToAppStateRef.current) {
        resume();
        wasPausedDueToAppStateRef.current = false;
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  if (steps.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading timer...</Text>
      </View>
    );
  }

  const currentStep = steps[currentStepIndex];

  return (
    <View style={styles.container}>
      {/* Timer Area */}
      <View style={styles.timerArea}>
        <TimerProgress
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          secondsLeft={secondsLeft}
          isRunning={isRunning}
          onToggleTimer={() => {
            if (isRunning) pause();
            else resume();
          }}
          sessionConfig={parsed}
        />
      </View>

      {/* Bottom Cancel Button */}
      <View style={styles.buttonArea}>
        {/* Cancel Button */}
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && { opacity: 0.88 },
          ]}
          onPress={() => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            pausedAtRef.current = null;
            router.back();
          }}
        >
          <Ionicons name="close" size={24} color="#ffffff" />
        </Pressable>
      </View>

      {/* Timeline */}
      <TimerTimeline
        steps={steps}
        currentStepIndex={currentStepIndex}
        secondsLeft={secondsLeft}
        timerIsRunning={isRunning}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    flex: 1,
  },
  timerArea: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  buttonArea: {
    flex: 0.3,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 40,
    marginTop: 20,
  },
  loading: {
    color: "#f6f6f6",
    fontSize: 18,
  },
  cancelButton: {
    marginTop: 60,
    backgroundColor: "#c82506",
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
