const COUNTER_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID?.trim();

export function getMetrikaCounterId(): number | null {
  if (!COUNTER_ID) {
    return null;
  }

  const id = Number(COUNTER_ID);
  return Number.isFinite(id) && id > 0 ? id : null;
}

declare global {
  interface Window {
    ym?: (
      counterId: number,
      method: string,
      ...args: unknown[]
    ) => void;
  }
}

export function metrikaReachGoal(goal: string, params?: Record<string, unknown>) {
  const id = getMetrikaCounterId();
  if (!id || typeof window === "undefined" || typeof window.ym !== "function") {
    return;
  }

  if (params) {
    window.ym(id, "reachGoal", goal, params);
    return;
  }

  window.ym(id, "reachGoal", goal);
}

export function metrikaHit(url: string) {
  const id = getMetrikaCounterId();
  if (!id || typeof window === "undefined" || typeof window.ym !== "function") {
    return;
  }

  window.ym(id, "hit", url);
}
