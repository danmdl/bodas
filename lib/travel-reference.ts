/** A proportional, symbolic illustration. It never changes contribution totals. */
export function symbolicKilometers(
  amountArs: number,
  arsPerUsd: number,
  flightUsd: number,
  roundTripKm: number,
) {
  if (
    ![amountArs, arsPerUsd, flightUsd, roundTripKm].every(Number.isFinite) ||
    amountArs < 0 ||
    arsPerUsd <= 0 ||
    flightUsd <= 0 ||
    roundTripKm <= 0
  )
    return 0;
  return (
    Math.round(
      Math.min(roundTripKm, (amountArs / arsPerUsd / flightUsd) * roundTripKm) /
        10,
    ) * 10
  );
}
export function tripBudget(reference: {
  flightUsd: number;
  nights: number;
  days: number;
  roomPerNightUsd: number[];
  mealsPerDayForTwoUsd: number[];
  localTransportAndVisitsUsd: number[];
}) {
  return [0, 1].map(
    (i) =>
      Math.ceil(
        (reference.flightUsd +
          reference.nights * reference.roomPerNightUsd[i] +
          reference.days * reference.mealsPerDayForTwoUsd[i] +
          reference.localTransportAndVisitsUsd[i]) /
          50,
      ) * 50,
  );
}
