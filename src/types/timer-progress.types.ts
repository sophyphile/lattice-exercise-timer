import { SessionConfig } from "@/types/session-config.types";
import { TimerStep } from "@/types/timer-step.types";

export type TimerProgressProps = {
    currentStep: TimerStep;
    currentStepIndex: number;
    totalSteps: number;
    secondsLeft: number;
    isRunning: boolean;
    onToggleTimer: () => void;
    sessionConfig: SessionConfig;
  };