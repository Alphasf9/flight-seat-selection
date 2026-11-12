import { CATEGORY_INFO } from "../data/seatMap";
import type { LineItem, Totals } from "../types";
import { formatCurrency, formatPrice } from "../utils/pricing";

interface Props {
  items: LineItem[];
  totals: Totals;
  onReset: () => void;
  onConfirm: () => void;
}

export default function Summary({ items, totals, onReset, onConfirm }: Props) {
  const seated = items.filter((item) => item.seat).length;
  const missing = items.length - seated;

  return (
    <aside className="card summary" aria-label="Price summary">
      <h2>Summary</h2>

      {seated === 0 && items.every((i) => !i.meal) ? (
        <p className="muted">No seats selected yet. Pick a passenger, then choose a seat on the map.</p>
      ) : (
        <ul className="summary__list">
          {items.map(({ passenger, seat, meal, seatPrice, mealPrice }) => (
            <li key={passenger.id} className="summary__item">
              <div className="summary__name">{passenger.name}</div>
              <div className="summary__line">
                <span>
                  {seat ? `Seat ${seat.id} (${CATEGORY_INFO[seat.category].label})` : "No seat selected"}
                </span>
                <span>{seat ? formatPrice(seatPrice) : "—"}</span>
              </div>
              {meal && (
                <div className="summary__line">
                  <span>{meal.name}</span>
                  <span>{formatPrice(mealPrice)}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <dl className="summary__totals">
        <div>
          <dt>Seat charges</dt>
          <dd>{formatCurrency(totals.seats)}</dd>
        </div>
        <div>
          <dt>Meal charges</dt>
          <dd>{formatCurrency(totals.meals)}</dd>
        </div>
        <div className="summary__grand">
          <dt>Total</dt>
          <dd>{formatCurrency(totals.total)}</dd>
        </div>
      </dl>

      {missing > 0 && seated > 0 && (
        <p className="muted small">
          {missing} passenger{missing > 1 ? "s" : ""} still need{missing > 1 ? "" : "s"} a seat.
        </p>
      )}

      <button type="button" className="btn btn--primary" disabled={missing > 0} onClick={onConfirm}>
        Confirm selection
      </button>
      <button type="button" className="btn btn--ghost" onClick={onReset}>
        Reset all
      </button>
    </aside>
  );
}
