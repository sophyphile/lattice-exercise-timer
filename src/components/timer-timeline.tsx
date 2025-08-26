import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from "react-native";
import { useEffect, useRef } from "react";

import { TimerStep, TimerStepType } from "@/types/timer-step.types";
import { TimerTimelineProps } from "@/types/timer-timeline.types";

const MIN_BLOCK_WIDTH = 42;

const TYPE_COLORS: Record<TimerStep["type"], string> = {
  [TimerStepType.Work]: "#307eae",
  [TimerStepType.InterRepRest]: "#f5d329",
  [TimerStepType.InterSetRest]: "#f5d329",
};

export default function TimerTimeline({
  steps,
  currentStepIndex,
  secondsLeft,
  timerIsRunning,
}: TimerTimelineProps) {
  const flatListRef = useRef<FlatList>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = useWindowDimensions();

  const currentStep = steps[currentStepIndex];
  const progress =
    currentStep.duration > 0 ? 1 - secondsLeft / currentStep.duration : 1;

  const MAX_VISIBLE_BLOCKS = Math.floor(screenWidth / MIN_BLOCK_WIDTH);

  const canFitWithoutScroll = steps.length <= MAX_VISIBLE_BLOCKS;
  const totalTimelineWidth = canFitWithoutScroll
    ? screenWidth - styles.wrapper.paddingHorizontal * 2
    : steps.length * MIN_BLOCK_WIDTH;

  const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

  const blockWidths = steps.map((step) => {
    const proportionalWidth =
      (step.duration / totalDuration) * totalTimelineWidth;
    return Math.max(proportionalWidth, MIN_BLOCK_WIDTH);
  });

  // Scroll to current step when it updates
  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: currentStepIndex,
      animated: true,
      viewPosition: 0.5,
    });
  }, [currentStepIndex]);

  // Animate progress bar across the block
  useEffect(() => {
    if (!timerIsRunning) return;

    if (progress === 0) {
      progressAnim.setValue(0);
      return;
    }

    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [progress, timerIsRunning]);

  return (
    <View style={styles.wrapper}>
      <FlatList
        horizontal
        ref={flatListRef}
        data={steps}
        keyExtractor={(_, i) => `step-${i}`}
        contentContainerStyle={styles.timelineContainer}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const isCurrent = index === currentStepIndex;
          const isSetRest = item.type === TimerStepType.InterSetRest;
          const belongsToSet = typeof item.currentSet === "number";

          const shouldRenderLabelHere =
            item.type === TimerStepType.Work && item.firstRepOfSet;

          const setLabel = shouldRenderLabelHere ? (
            <View
              style={{
                width: blockWidths[index],
                alignItems: "center",
                justifyContent: "center",
                height: 24,
              }}
            >
              <Text style={styles.setNumber}>Set {item.currentSet}</Text>
            </View>
          ) : null;

          return (
            <View key={index} style={styles.column}>
              {/* Top bar: step */}
              <View style={{ height: 30, justifyContent: "flex-end" }}>
                <View
                  style={[
                    styles.block,
                    {
                      width: blockWidths[index],
                      height: isCurrent ? 30 : 20,
                      marginTop: isCurrent ? 0 : 10,
                      backgroundColor:
                        TYPE_COLORS[item.type as TimerStep["type"]],
                      opacity: isCurrent ? 0.9 : 0.72,
                    },
                    index === 0 && {
                      borderTopLeftRadius: 8,
                    },
                    index === steps.length - 1 && {
                      borderTopRightRadius: 8,
                    },
                    isCurrent && {
                      borderTopRightRadius: 8,
                      borderTopLeftRadius: 8,
                    },
                  ]}
                >
                  {isCurrent && (
                    <Animated.View
                      style={[
                        styles.progressOverlay,
                        {
                          height: "100%",
                          backgroundColor: "#ffffff66",
                          width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, blockWidths[index]],
                          }),
                        },
                      ]}
                    />
                  )}
                  <Text style={styles.stepLabel}>
                    {item.type === TimerStepType.Work ? "W" : "R"}
                  </Text>
                </View>
              </View>

              {/* Bottom bar: set grouping */}
              <View
                style={[
                  styles.setBar,
                  {
                    width: blockWidths[index],
                    backgroundColor: belongsToSet
                      ? "#333"
                      : TYPE_COLORS[TimerStepType.InterSetRest],
                    opacity: belongsToSet ? 0.9 : isCurrent ? 0.9 : 0.72,
                  },
                  index === 0 && {
                    borderBottomLeftRadius: 8,
                  },
                  index === steps.length - 1 && {
                    borderBottomRightRadius: 8,
                  },
                ]}
              >
                {isCurrent && isSetRest && (
                  <Animated.View
                    style={[
                      styles.progressOverlay,
                      {
                        height: "100%",
                        backgroundColor: "#ffffff66",
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, blockWidths[index]],
                        }),
                      },
                    ]}
                  />
                )}
                <Text style={[{ opacity: 0.8 }, { textAlign: "center" }]}>
                  {setLabel}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  timelineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 56,
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
  },
  block: {
    justifyContent: "center",
    overflow: "hidden",
  },
  progressOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  setBar: {
    height: 28,
  },
  setNumber: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24,
  },
  stepLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold",
  },
});
