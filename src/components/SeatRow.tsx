import type { Seat as SeatType, SeatOwner, SeatRowData } from "../types";
import Seat from "./Seat";

interface Props {
  data: SeatRowData;
  owners: Record<string, SeatOwner>;
  activePassengerId: string;
  onSelect: (seat: SeatType) => void;
  onInspect: (seat: SeatType | null) => void;
}

export default function SeatRow({ data, owners, activePassengerId, onSelect, onInspect }: Props) {
  return (
    <div className="seat-row" role="group" aria-label={`Row ${data.row}`}>
      <span className="row-number">{data.row}</span>
      {data.groups.map((group, groupIndex) => (
        <div className="seat-group" key={groupIndex}>
          {group.map((seat) => {
            const owner = owners[seat.id];
            return (
              <Seat
                key={seat.id}
                seat={seat}
                owner={owner}
                isActiveOwner={owner?.passengerId === activePassengerId}
                onSelect={onSelect}
                onInspect={onInspect}
              />
            );
          })}
        </div>
      ))}
      <span className="row-number">{data.row}</span>
    </div>
  );
}
