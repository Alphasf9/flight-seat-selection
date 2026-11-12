import { LAYOUTS } from "../data/seatMap";
import type { LayoutId } from "../types";

interface Props {
  value: LayoutId;
  onChange: (id: LayoutId) => void;
}

export default function LayoutToggle({ value, onChange }: Props) {
  return (
    <div className="segmented" role="radiogroup" aria-label="Aircraft layout">
      {Object.values(LAYOUTS).map((layout) => {
        const active = layout.id === value;
        return (
          <button
            key={layout.id}
            type="button"
            role="radio"
            aria-checked={active}
            className={`segmented__btn${active ? " is-active" : ""}`}
            onClick={() => onChange(layout.id)}
          >
            <strong>{layout.label}</strong>
            <small>{layout.description}</small>
          </button>
        );
      })}
    </div>
  );
}
