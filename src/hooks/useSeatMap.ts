import { useEffect, useState } from "react";
import { buildSeatMap } from "../data/seatMap";
import type { LayoutId, SeatRowData } from "../types";

type SeatMapState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; rows: SeatRowData[] };

/**
 * Simulates fetching a seat map from an API so the UI can show real
 * loading and error states. Open the app with `?error` to see the error
 * state on first load (the retry button then succeeds).
 */
export function useSeatMap(layoutId: LayoutId) {
  const [state, setState] = useState<SeatMapState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setState({ status: "loading" });

    const timer = setTimeout(() => {
      const forceError =
        attempt === 0 && new URLSearchParams(window.location.search).has("error");

      if (forceError) {
        setState({ status: "error", message: "We couldn't load the seat map. Please try again." });
      } else {
        setState({ status: "success", rows: buildSeatMap(layoutId) });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [layoutId, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
