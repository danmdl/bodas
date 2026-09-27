import { wedding } from "@/config/wedding";

export function getWeddingData() {
  const { received, currency, showAmounts, publicProgress, ...giftCopy } =
    wedding.gifts;
  let remaining = Math.max(0, received);
  const configured = wedding.destinations.every(
    (d) => d.goal !== null && d.goal > 0,
  );
  const totalGoal = wedding.destinations.reduce(
    (sum, d) => sum + Math.max(0, d.goal ?? 0),
    0,
  );
  const destinationData = wedding.destinations.map(
    ({ goal, ...destination }) => {
      const validGoal = goal !== null && goal > 0;
      const amount = validGoal ? Math.min(remaining, goal) : 0;
      // Do not pretend progress is known if any route goal is missing.
      const percentage =
        configured && validGoal
          ? Math.min(100, Math.floor((amount / goal) * 100))
          : null;
      if (validGoal) remaining = Math.max(0, remaining - goal);
      return {
        ...destination,
        percentage: publicProgress === "percentage" ? percentage : null,
        unlocked: configured && validGoal && amount >= goal,
        ...(showAmounts && validGoal
          ? {
              goalLabel: new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency,
                maximumFractionDigits: 0,
              }).format(goal),
            }
          : {}),
      };
    },
  );
  return {
    ...wedding,
    gifts: {
      ...giftCopy,
      publicProgress,
      configured,
      percentage:
        publicProgress === "percentage" && configured && totalGoal > 0
          ? Math.min(100, Math.floor((received / totalGoal) * 100))
          : null,
      unlockedCount: destinationData.filter((d) => d.unlocked).length,
      ...(showAmounts
        ? {
            receivedLabel: new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency,
              maximumFractionDigits: 0,
            }).format(received),
          }
        : {}),
    },
    destinations: destinationData,
  };
}
export type WeddingData = ReturnType<typeof getWeddingData>;
export type PublicDestination = WeddingData["destinations"][number];
