import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from "react-native";
import { useEffect, useRef } from "react";
import { TimerStep } from "../utils/generate-timer-steps";

const MIN_BLOCK_WIDTH = 42;

const TYPE_COLORS: Record<TimerStep["type"], string> = {
  work: "#307eae",
  "inter-rep-rest": "#f5d329",
  "inter-set-rest": "#f5d329",
};

export type TimerTimelineProps = {
  steps: TimerStep[];
  currentStepIndex: number;
  secondsLeft: number;
  timerIsRunning: boolean;
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

  const totalSteps = steps.length;

  const MAX_VISIBLE_BLOCKS = Math.floor(screenWidth / MIN_BLOCK_WIDTH);
  //   const blockWidth =
  //     totalSteps <= MAX_VISIBLE_BLOCKS
  //       ? Math.floor(screenWidth - 64) / totalSteps
  //       : MIN_BLOCK_WIDTH;

  const canFitWithoutScroll = steps.length <= MAX_VISIBLE_BLOCKS;
  const totalTimelineWidth = canFitWithoutScroll
    ? screenWidth - 64
    : steps.length * MIN_BLOCK_WIDTH;

  const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

  const blockWidths = steps.map((step) => {
    const proportionalWidth =
      (step.duration / totalDuration) * totalTimelineWidth;
    return Math.max(proportionalWidth, MIN_BLOCK_WIDTH);
  });

  // const setGroups: Record<number, { indices: number[]; startIndex: number }> =
  //   {};

  // steps.forEach((step, i) => {
  //   if (typeof step.currentSet === "number") {
  //     const set = step.currentSet;
  //     if (!setGroups[set]) {
  //       setGroups[set] = { indices: [], startIndex: i };
  //     }
  //     setGroups[set].indices.push(i);
  //   }
  // });

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
          const isSetRest = item.type === "inter-set-rest";
          const belongsToSet = typeof item.currentSet === "number";

          // const shouldRenderLabelHere = Object.entries(setGroups).some(
          //   ([set, group]) => group.startIndex === index
          // );

          const shouldRenderLabelHere = item.type === "work" && item.firstRepOfSet;

          const setLabel = shouldRenderLabelHere ? (
            <View
              style={{
                // position: "absolute",
                // left: 0,
                width: blockWidths[index],
                // width:
                //   blockWidths[index] *
                //   setGroups[item.currentSet!].indices.length,
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
                    isCurrent && { borderTopRightRadius: 8, borderTopLeftRadius: 8 },
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
                    {item.type === "work" ? "W" : "R"}
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
                      : TYPE_COLORS["inter-set-rest"],
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
                <Text
                  style={[
                    { opacity: 0.8 },
                    { textAlign: "center" },
                  ]}
                >
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
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  //   container: {
  //     paddingVertical: 12,
  //     paddingHorizontal: 32,
  //   },
  timelineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 48,
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
  },
  //   blockWrapper: {
  //     marginHorizontal: 0,
  //     alignItems: "center",
  //   },
  block: {
    justifyContent: "center",
    overflow: "hidden",
  },
  progressOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    // backgroundColor: "#ffffff80",
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
