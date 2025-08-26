export const calculateTotalTime = ({
  sets,
  reps,
  interSetRest,
  interRepRest,
  repWorkTime,
}: {
  sets: number;
  reps: number;
  interSetRest: number;
  interRepRest: number;
  repWorkTime: number;
}): number => {
  // last rep doesn't have an ensuing rest
  return (
    sets * (reps * (repWorkTime + interRepRest) - interRepRest) +
    (sets - 1) * interSetRest
  );
};
