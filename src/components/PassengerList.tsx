import { MEALS } from "../data/meals";
import type { Passenger, Seat } from "../types";
import { formatPrice } from "../utils/pricing";
import { CATEGORY_INFO } from "../data/seatMap";

interface Props {
  passengers: Passenger[];
  activeId: string;
  seatAssignments: Record<string, string>;
  mealAssignments: Record<string, string>;
  seatsById: Record<string, Seat>;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onRemoveSeat: (id: string) => void;
  onMealChange: (id: string, mealId: string) => void;
}

export default function PassengerList({
  passengers,
  activeId,
  seatAssignments,
  mealAssignments,
  seatsById,
  onSelect,
  onRename,
  onRemoveSeat,
  onMealChange,
}: Props) {
  return (
    <ul className="passengers">
      {passengers.map((passenger, index) => {
        const active = passenger.id === activeId;
        const seat = seatsById[seatAssignments[passenger.id]];

        return (
          <li
            key={passenger.id}
            className={`passenger${active ? " is-active" : ""}`}
            onClick={() => onSelect(passenger.id)}
            aria-current={active}
          >
            <div className="passenger__top">
              <button
                type="button"
                className="passenger__avatar"
                onClick={() => onSelect(passenger.id)}
                aria-label={`Select ${passenger.name}`}
              >
                {index + 1}
              </button>
              <input
                className="passenger__name"
                value={passenger.name}
                maxLength={24}
                onChange={(e) => onRename(passenger.id, e.target.value)}
                onBlur={(e) => {
                  if (!e.target.value.trim()) onRename(passenger.id, `Passenger ${index + 1}`);
                }}
                aria-label={`Name of passenger ${index + 1}`}
              />
            </div>

            <div className="passenger__seat">
              {seat ? (
                <>
                  <span className="badge">
                    Seat {seat.id} · {CATEGORY_INFO[seat.category].label} · {formatPrice(seat.price)}
                  </span>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSeat(passenger.id);
                    }}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <span className="muted">{active ? "Pick a seat on the map" : "No seat yet"}</span>
              )}
            </div>

            <label className="passenger__meal" onClick={(e) => e.stopPropagation()}>
              <span>Meal</span>
              <select
                value={mealAssignments[passenger.id] ?? "none"}
                onChange={(e) => onMealChange(passenger.id, e.target.value)}
              >
                {MEALS.map((meal) => (
                  <option key={meal.id} value={meal.id}>
                    {meal.name} — {formatPrice(meal.price)}
                  </option>
                ))}
              </select>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
