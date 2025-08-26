export type TimerStep = {
  label: string; // e.g. "Set 1 - Rep 1 Work", "Set 1 - Rep 1 Rest", "Rest after Set 1"
  duration: number; // in seconds
  type: "work" | "inter-rep-rest" | "inter-set-rest";
  currentSet: number | null;
  firstRepOfSet?: boolean;
};
