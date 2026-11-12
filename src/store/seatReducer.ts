import type { LayoutId, Notice, NoticeType, Passenger, Seat } from "../types";

export const MAX_PASSENGERS = 6;
export const MIN_PASSENGERS = 1;

export interface State {
  passengers: Passenger[];
  activeId: string;
  layout: LayoutId;
  /** passengerId -> seatId. The single source of truth for seat assignment. */
  seats: Record<string, string>;
  /** passengerId -> mealId */
  meals: Record<string, string>;
  notice: Notice | null;
}

export type Action =
  | { type: "SET_COUNT"; count: number }
  | { type: "SELECT_PASSENGER"; id: string }
  | { type: "RENAME_PASSENGER"; id: string; name: string }
  | { type: "SET_LAYOUT"; layout: LayoutId }
  | { type: "TOGGLE_SEAT"; seat: Seat }
  | { type: "REMOVE_SEAT"; passengerId: string }
  | { type: "SET_MEAL"; passengerId: string; mealId: string }
  | { type: "NOTIFY"; level: NoticeType; text: string }
  | { type: "DISMISS_NOTICE" }
  | { type: "RESET" };

const createPassenger = (index: number): Passenger => ({
  id: `p${index + 1}`,
  name: `Passenger ${index + 1}`,
});

export const initialState: State = {
  passengers: [createPassenger(0), createPassenger(1)],
  activeId: "p1",
  layout: "3-2",
  seats: {},
  meals: {},
  notice: null,
};

// ---------- helpers ----------

function withNotice(state: State, type: NoticeType, text: string): State {
  return { ...state, notice: { id: (state.notice?.id ?? 0) + 1, type, text } };
}

function pick<T>(record: Record<string, T>, keep: Set<string>): Record<string, T> {
  return Object.fromEntries(Object.entries(record).filter(([id]) => keep.has(id)));
}

function omit<T>(record: Record<string, T>, key: string): Record<string, T> {
  const { [key]: _removed, ...rest } = record;
  return rest;
}

function nextUnseatedId(
  passengers: Passenger[],
  currentId: string,
  seats: Record<string, string>,
): string {
  const start = passengers.findIndex((p) => p.id === currentId);
  for (let step = 1; step <= passengers.length; step += 1) {
    const candidate = passengers[(start + step) % passengers.length];
    if (!seats[candidate.id]) return candidate.id;
  }
  return currentId; // everyone already has a seat
}

// ---------- reducer ----------

export function seatReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_COUNT": {
      const count = Math.min(MAX_PASSENGERS, Math.max(MIN_PASSENGERS, action.count));
      if (count === state.passengers.length) return state;

      const passengers = Array.from(
        { length: count },
        (_, i) => state.passengers[i] ?? createPassenger(i),
      );
      const keep = new Set(passengers.map((p) => p.id));

      return {
        ...state,
        passengers,
        seats: pick(state.seats, keep),
        meals: pick(state.meals, keep),
        activeId: keep.has(state.activeId) ? state.activeId : passengers[0].id,
      };
    }

    case "SELECT_PASSENGER":
      return { ...state, activeId: action.id };

    case "RENAME_PASSENGER":
      return {
        ...state,
        passengers: state.passengers.map((p) =>
          p.id === action.id ? { ...p, name: action.name } : p,
        ),
      };

    case "SET_LAYOUT": {
      if (action.layout === state.layout) return state;
      const hadSeats = Object.keys(state.seats).length > 0;
      const next: State = { ...state, layout: action.layout, seats: {}, notice: null };
      return hadSeats
        ? withNotice(next, "info", "Seats were cleared because the aircraft layout changed.")
        : next;
    }

    case "TOGGLE_SEAT": {
      const { seat } = action;

      if (seat.occupied) {
        return withNotice(state, "error", `Seat ${seat.id} is already occupied.`);
      }

      const holderId = Object.keys(state.seats).find((pid) => state.seats[pid] === seat.id);

      // Clicking your own seat again removes it.
      if (holderId === state.activeId) {
        return { ...state, seats: omit(state.seats, state.activeId), notice: null };
      }

      // Seat belongs to someone else -> block (no double booking).
      if (holderId) {
        const holder = state.passengers.find((p) => p.id === holderId);
        return withNotice(
          state,
          "error",
          `Seat ${seat.id} is already assigned to ${holder?.name ?? "another passenger"}.`,
        );
      }

      // Assign (or change) the active passenger's seat.
      const hadSeat = Boolean(state.seats[state.activeId]);
      const seats = { ...state.seats, [state.activeId]: seat.id };

      return {
        ...state,
        seats,
        notice: null,
        // Auto-advance to the next passenger who still needs a seat,
        // but stay put when the user is just changing an existing seat.
        activeId: hadSeat ? state.activeId : nextUnseatedId(state.passengers, state.activeId, seats),
      };
    }

    case "REMOVE_SEAT":
      return { ...state, seats: omit(state.seats, action.passengerId) };

    case "SET_MEAL":
      return { ...state, meals: { ...state.meals, [action.passengerId]: action.mealId } };

    case "NOTIFY":
      return withNotice(state, action.level, action.text);

    case "DISMISS_NOTICE":
      return { ...state, notice: null };

    case "RESET":
      return { ...initialState, layout: state.layout, notice: null };

    default:
      return state;
  }
}
