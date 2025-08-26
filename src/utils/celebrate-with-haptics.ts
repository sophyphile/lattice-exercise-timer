import * as Haptics from "expo-haptics";

export const celebrateWithHaptics = async (
  bursts: number,
  interval: number
): Promise<void> => {
  for (let i = 0; i < bursts; i++) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((res) => setTimeout(res, interval));
  }
};
