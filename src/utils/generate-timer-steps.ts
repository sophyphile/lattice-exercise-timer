export type TimerStep = {
  label: string; // e.g. "Set 1 - Rep 1 Work", "Set 1 - Rep 1 Rest", "Rest after Set 1"
  duration: number; // in seconds
  type: "work" | "inter-rep-rest" | "inter-set-rest"
  currentSet: number | null;
  firstRepOfSet?: boolean;
};

export function generateTimerSteps(
  sets: number,
  reps: number,
  interSetRest: number,
  interRepRest: number,
  repWorkTime: number
): TimerStep[] {
  const steps: TimerStep[] = [];

  for (let set = 1; set <= sets; set++) {
    for (let rep = 1; rep <= reps; rep++) {
      steps.push({
        label: `Set ${set} - Rep ${rep} Work`,
        duration: repWorkTime,
        type: "work",
        currentSet: set,
        firstRepOfSet: rep === 1,
      });

      // Add inter-rep rest *unless it's the last rep*
      if (rep < reps) {
        steps.push({
          label: `Set ${set} - Rep ${rep} Rest`,
          duration: interRepRest,
          type: "inter-rep-rest",
          currentSet: set,
        });
      }
    }

    // Add inter-set rest *unless it's the last set*
    if (set < sets) {
      steps.push({
        label: `Rest after Set ${set}`,
        duration: interSetRest,
        type: "inter-set-rest",
        currentSet: null,
      });
    }
  }

  return steps;
}
