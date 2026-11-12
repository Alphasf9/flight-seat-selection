import { useCallback, useMemo, useReducer } from "react";
import Legend from "./components/Legend";
import LayoutToggle from "./components/LayoutToggle";
import PassengerCountSelector from "./components/PassengerCountSelector";
import PassengerList from "./components/PassengerList";
import SeatMap from "./components/SeatMap";
import SeatMapSkeleton from "./components/SeatMapSkeleton";
import Summary from "./components/Summary";
import Toast from "./components/Toast";
import { MEALS_BY_ID } from "./data/meals";
import { LAYOUTS } from "./data/seatMap";
import { useSeatMap } from "./hooks/useSeatMap";
import { initialState, MAX_PASSENGERS, MIN_PASSENGERS, seatReducer } from "./store/seatReducer";
import type { Seat, SeatOwner } from "./types";
import { buildLineItems, calculateTotals, formatCurrency } from "./utils/pricing";

export default function App() {
  const [state, dispatch] = useReducer(seatReducer, initialState);
  const seatMap = useSeatMap(state.layout);

  // seatId -> seat, derived from the loaded map.
  const seatsById = useMemo(() => {
    const index: Record<string, Seat> = {};
    if (seatMap.status === "success") {
      for (const row of seatMap.rows) {
        for (const group of row.groups) {
          for (const seat of group) index[seat.id] = seat;
        }
      }
    }
    return index;
  }, [seatMap]);

  // seatId -> who holds it, derived from state.seats (never stored twice).
  const owners = useMemo(() => {
    const map: Record<string, SeatOwner> = {};
    state.passengers.forEach((passenger, index) => {
      const seatId = state.seats[passenger.id];
      if (seatId) map[seatId] = { passengerId: passenger.id, index, name: passenger.name };
    });
    return map;
  }, [state.passengers, state.seats]);

  const lineItems = useMemo(
    () => buildLineItems(state.passengers, state.seats, state.meals, seatsById, MEALS_BY_ID),
    [state.passengers, state.seats, state.meals, seatsById],
  );
  const totals = useMemo(() => calculateTotals(lineItems), [lineItems]);

  const dismissNotice = useCallback(() => dispatch({ type: "DISMISS_NOTICE" }), []);
  const handleSelectSeat = useCallback((seat: Seat) => dispatch({ type: "TOGGLE_SEAT", seat }), []);

  const handleConfirm = () =>
    dispatch({
      type: "NOTIFY",
      level: "success",
      text: `Seats confirmed (demo). Total ${formatCurrency(totals.total)}.`,
    });

  const activePassenger = state.passengers.find((p) => p.id === state.activeId);

  return (
    <div className="app">
      <header className="app__header">
        <h1>Choose your seats</h1>
        <p className="muted">Select passengers, pick a seat for each, and see the total update instantly.</p>
      </header>

      <div className="layout">
        <main className="layout__main">
          <section className="card">
            <div className="card__head">
              <h2>Passengers</h2>
              <PassengerCountSelector
                count={state.passengers.length}
                min={MIN_PASSENGERS}
                max={MAX_PASSENGERS}
                onChange={(count) => dispatch({ type: "SET_COUNT", count })}
              />
            </div>
            <PassengerList
              passengers={state.passengers}
              activeId={state.activeId}
              seatAssignments={state.seats}
              mealAssignments={state.meals}
              seatsById={seatsById}
              onSelect={(id) => dispatch({ type: "SELECT_PASSENGER", id })}
              onRename={(id, name) => dispatch({ type: "RENAME_PASSENGER", id, name })}
              onRemoveSeat={(passengerId) => dispatch({ type: "REMOVE_SEAT", passengerId })}
              onMealChange={(passengerId, mealId) => dispatch({ type: "SET_MEAL", passengerId, mealId })}
            />
          </section>

          <section className="card">
            <div className="card__head">
              <h2>Seat map</h2>
              <LayoutToggle value={state.layout} onChange={(layout) => dispatch({ type: "SET_LAYOUT", layout })} />
            </div>

            <p className="hint">
              Selecting seat for <strong>{activePassenger?.name}</strong>
            </p>
            <Legend />

            {seatMap.status === "loading" && <SeatMapSkeleton />}

            {seatMap.status === "error" && (
              <div className="state state--error" role="alert">
                <p>{seatMap.message}</p>
                <button type="button" className="btn btn--primary" onClick={seatMap.retry}>
                  Try again
                </button>
              </div>
            )}

            {seatMap.status === "success" && seatMap.rows.length === 0 && (
              <div className="state">No seats available for this flight.</div>
            )}

            {seatMap.status === "success" && seatMap.rows.length > 0 && (
              <SeatMap
                rows={seatMap.rows}
                layout={LAYOUTS[state.layout]}
                owners={owners}
                activePassengerId={state.activeId}
                onSelectSeat={handleSelectSeat}
              />
            )}
          </section>
        </main>

        <Summary items={lineItems} totals={totals} onReset={() => dispatch({ type: "RESET" })} onConfirm={handleConfirm} />
      </div>

      <Toast notice={state.notice} onDismiss={dismissNotice} />
    </div>
  );
}
