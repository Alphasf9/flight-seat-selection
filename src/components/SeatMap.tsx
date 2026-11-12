import { useState } from "react";
import type { LayoutConfig, Seat, SeatOwner, SeatRowData } from "../types";
import SeatDetails from "./SeatDetails";
import SeatRow from "./SeatRow";

interface Props {
  rows: SeatRowData[];
  layout: LayoutConfig;
  owners: Record<string, SeatOwner>;
  activePassengerId: string;
  onSelectSeat: (seat: Seat) => void;
}

export default function SeatMap({ rows, layout, owners, activePassengerId, onSelectSeat }: Props) {
  const [inspected, setInspected] = useState<Seat | null>(null);

  return (
    <div className="seat-map">
      <SeatDetails seat={inspected} owner={inspected ? owners[inspected.id] : undefined} />

      <div className="cabin" role="region" aria-label={`Seat map, ${layout.label} layout`}>
        <div className="seat-row seat-row--header" aria-hidden="true">
          <span className="row-number" />
          {layout.groups.map((group, groupIndex) => (
            <div className="seat-group" key={groupIndex}>
              {group.map((letter) => (
                <span className="seat-letter" key={letter}>
                  {letter}
                </span>
              ))}
            </div>
          ))}
          <span className="row-number" />
        </div>

        {rows.map((row) => (
          <SeatRow
            key={row.row}
            data={row}
            owners={owners}
            activePassengerId={activePassengerId}
            onSelect={onSelectSeat}
            onInspect={setInspected}
          />
        ))}
      </div>
    </div>
  );
}
