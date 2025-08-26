export enum TimerStepType {
  Work = "work",
  InterRepRest = "inter-rep-rest",
  InterSetRest = "inter-set-rest",
}

export type TimerStep =
  | {
      type: TimerStepType.Work;
      label: string;
      duration: number;
      currentSet: number;
      firstRepOfSet?: boolean;
    }
  | {
      type: TimerStepType.InterRepRest | TimerStepType.InterSetRest;
      label: string;
      duration: number;
      currentSet: number | null;
    };
