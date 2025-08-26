import { TimerStep, TimerStepType } from "@/types/timer-step.types";

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
        type: TimerStepType.Work,
        currentSet: set,
        firstRepOfSet: rep === 1,
      });

      // Add inter-rep rest *unless it's the last rep*
      if (rep < reps) {
        steps.push({
          label: `Set ${set} - Rep ${rep} Rest`,
          duration: interRepRest,
          type: TimerStepType.InterRepRest,
          currentSet: set,
        });
      }
    }

    // Add inter-set rest *unless it's the last set*
    if (set < sets) {
      steps.push({
        label: `Rest after Set ${set}`,
        duration: interSetRest,
        type: TimerStepType.InterSetRest,
        currentSet: null,
      });
    }
  }

  return steps;
}
