import { CATEGORY_INFO } from "../data/seatMap";
import type { Seat as SeatType, SeatOwner } from "../types";
import { formatPrice } from "../utils/pricing";

interface Props {
  seat: SeatType;
  owner?: SeatOwner;
  isActiveOwner: boolean;
  onSelect: (seat: SeatType) => void;
  onInspect: (seat: SeatType | null) => void;
}

export default function Seat({ seat, owner, isActiveOwner, onSelect, onInspect }: Props) {
  const state = seat.occupied
    ? "occupied"
    : owner
      ? isActiveOwner
        ? "selected"
        : "taken"
      : "available";

  const description = seat.occupied
    ? "occupied"
    : owner
      ? `assigned to ${owner.name}`
      : "available";

  const ariaLabel = `Seat ${seat.id}, ${CATEGORY_INFO[seat.category].label}, ${formatPrice(seat.price)}, ${description}`;

  const classes = [
    "seat",
    `seat--${seat.category}`,
    `seat--${state}`,
    seat.price === 0 ? "seat--free" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      aria-label={ariaLabel}
      aria-disabled={seat.occupied}
      aria-pressed={isActiveOwner}
      title={ariaLabel}
      onClick={() => {
        onInspect(seat);
        onSelect(seat);
      }}
      onMouseEnter={() => onInspect(seat)}
      onMouseLeave={() => onInspect(null)}
      onFocus={() => onInspect(seat)}
      onBlur={() => onInspect(null)}
    >
      {seat.occupied ? "✕" : owner ? `P${owner.index + 1}` : seat.letter}
    </button>
  );
}
