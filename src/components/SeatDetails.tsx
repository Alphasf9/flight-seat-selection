import { CATEGORY_INFO } from "../data/seatMap";
import type { Seat, SeatOwner } from "../types";
import { formatPrice } from "../utils/pricing";

interface Props {
  seat: Seat | null;
  owner?: SeatOwner;
}

export default function SeatDetails({ seat, owner }: Props) {
  if (!seat) {
    return <div className="seat-details seat-details--empty">Hover or tap a seat to see its details</div>;
  }

  const status = seat.occupied ? "Occupied" : owner ? `Assigned to ${owner.name}` : "Available";

  return (
    <div className="seat-details" aria-live="polite">
      <strong>Seat {seat.id}</strong>
      <span>{CATEGORY_INFO[seat.category].label}</span>
      <span className="seat-details__price">{formatPrice(seat.price)}</span>
      <span className="seat-details__status">{status}</span>
    </div>
  );
}
