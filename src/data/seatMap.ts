import type {
  LayoutConfig,
  LayoutId,
  Seat,
  SeatCategory,
  SeatRowData,
} from "../types";

export const TOTAL_ROWS = 12;

export const CATEGORY_INFO: Record<SeatCategory, { label: string; price: number }> = {
  standard: { label: "Standard", price: 0 },
  premium: { label: "Premium", price: 250 },
  "extra-legroom": { label: "Extra legroom", price: 350 },
};

// Adding a new aircraft layout only requires a new entry here.
export const LAYOUTS: Record<LayoutId, LayoutConfig> = {
  "3-2": {
    id: "3-2",
    label: "3–2",
    description: "A B C · D E",
    groups: [
      ["A", "B", "C"],
      ["D", "E"],
    ],
  },
  "2-3-2": {
    id: "2-3-2",
    label: "2–3–2",
    description: "A B · C D E · F G",
    groups: [
      ["A", "B"],
      ["C", "D", "E"],
      ["F", "G"],
    ],
  },
};

/**
 * Pricing rules:
 *  - rows 1 and 8 are exit / front rows  -> Extra legroom
 *  - rows 2 and 3 are near the front      -> Premium
 *  - everything else                      -> Standard (free)
 *  - middle seats of a 3-seat group are always free
 */
function categoryFor(row: number, indexInGroup: number, groupSize: number): SeatCategory {
  const isMiddleSeat = groupSize === 3 && indexInGroup === 1;
  if (isMiddleSeat) return "standard";
  if (row === 1 || row === 8) return "extra-legroom";
  if (row === 2 || row === 3) return "premium";
  return "standard";
}

// Deterministic "pre-booked" seats so the demo looks the same on every load.
function isOccupied(row: number, columnIndex: number): boolean {
  return (row * 3 + columnIndex * 5) % 7 === 0;
}

export function buildSeatMap(layoutId: LayoutId): SeatRowData[] {
  const { groups } = LAYOUTS[layoutId];

  return Array.from({ length: TOTAL_ROWS }, (_, rowIndex) => {
    const row = rowIndex + 1;
    let column = 0;

    return {
      row,
      groups: groups.map((letters) =>
        letters.map((letter, indexInGroup): Seat => {
          const category = categoryFor(row, indexInGroup, letters.length);
          const seat: Seat = {
            id: `${row}${letter}`,
            row,
            letter,
            category,
            price: CATEGORY_INFO[category].price,
            occupied: isOccupied(row, column),
          };
          column += 1;
          return seat;
        }),
      ),
    };
  });
}
