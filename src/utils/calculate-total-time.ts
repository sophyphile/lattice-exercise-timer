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
    return (
        sets *
        (reps * (repWorkTime + interRepRest) -
            interRepRest) + // last rep doesn't have a following rest
        (sets - 1) * interSetRest
    );
}