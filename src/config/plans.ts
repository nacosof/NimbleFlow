export const plans = {
  free: {
    id: "free",
    name: "Free",
    priceRub: 0,
    periodDays: null as number | null,
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceRub: 990,
    periodDays: 30 as number | null,
  },
} as const;

export type PlanId = keyof typeof plans;

export function isPlanId(value: string): value is PlanId {
  return value in plans;
}
