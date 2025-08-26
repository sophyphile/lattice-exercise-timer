import { TimerStep } from "@/types/timer-step.types";

export type TimerTimelineProps = {
  steps: TimerStep[];
  currentStepIndex: number;
  secondsLeft: number;
  timerIsRunning: boolean;
};
