import { useEffect, useState, useRef } from "react";
import { View, Text, Pressable, StyleSheet, ColorValue } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import TimerProgress from "../components/timer-progress";
import { generateTimerSteps, TimerStep } from "../utils/timer-logic";
import { Ionicons } from "@expo/vector-icons";

export default function TimerScreen() {
  const { sets, reps, interSetRest, interRepRest, repWorkTime } =
    useLocalSearchParams();

  // Step state
  const [steps, setSteps] = useState<TimerStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(true);

  const getGradientColors: (
    stepType: TimerStep["type"]
  ) => readonly [ColorValue, ColorValue, ...ColorValue[]] = (
    stepType: TimerStep["type"]
  ) => {
    return ["#121212", "rgba(48, 126, 174, 1)"];
  };

  const parsed = {
    sets: Number(sets),
    reps: Number(reps),
    interSetRest: Number(interSetRest),
    interRepRest: Number(interRepRest),
    repWorkTime: Number(repWorkTime),
  };

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
    setSecondsLeft(generatedSteps[0].duration);
  }, []);

  // Tick every second
  useEffect(() => {
    if (steps.length === 0 || !isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        if (currentStepIndex + 1 < steps.length) {
          setCurrentStepIndex((i) => i + 1);
          return steps[currentStepIndex + 1].duration;
        } else {
          clearInterval(intervalRef.current!);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [steps, currentStepIndex, isRunning]);

  // Navigate to success screen when timer completes
  useEffect(() => {
    if (
      steps.length > 0 &&
      currentStepIndex === steps.length - 1 &&
      secondsLeft === 0
    ) {
      // Delayed nav to allow render to settle
      setTimeout(() => router.replace("/success"), 100);
    }
  }, [secondsLeft, currentStepIndex, steps.length]);

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
            if (isRunning && intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setIsRunning((prev) => !prev);
          }}
        />
      </View>

      {/* Bottom Cancel Button */}
      <View style={styles.buttonArea}>
        {/* Cancel Button */}
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && { opacity: 0.9 },
          ]}
          onPress={() => {
            clearInterval(intervalRef.current!);
            router.back();
          }}
        >
          <Ionicons name="close" size={24} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    // padding: 20,
    // paddingBottom: 140,
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
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
  },
  loading: {
    color: "#f6f6f6",
    fontSize: 18,
  },
  cancelButton: {
    marginTop: 0,
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
