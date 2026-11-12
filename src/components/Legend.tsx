import { CATEGORY_INFO } from "../data/seatMap";
import { formatPrice } from "../utils/pricing";

const ITEMS = [
  { className: "seat--standard seat--free seat--available", label: `Standard · ${formatPrice(CATEGORY_INFO.standard.price)}` },
  { className: "seat--premium seat--available", label: `Premium · ${formatPrice(CATEGORY_INFO.premium.price)}` },
  { className: "seat--extra-legroom seat--available", label: `Extra legroom · ${formatPrice(CATEGORY_INFO["extra-legroom"].price)}` },
  { className: "seat--selected", label: "Your selection" },
  { className: "seat--taken", label: "Other passenger" },
  { className: "seat--occupied", label: "Occupied" },
];

export default function Legend() {
  return (
    <ul className="legend" aria-label="Seat legend">
      {ITEMS.map((item) => (
        <li key={item.label} className="legend__item">
          <span className={`seat seat--mini ${item.className}`} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
