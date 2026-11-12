interface Props {
  count: number;
  min: number;
  max: number;
  onChange: (count: number) => void;
}

export default function PassengerCountSelector({ count, min, max, onChange }: Props) {
  return (
    <div className="stepper" role="group" aria-label="Number of passengers">
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(count - 1)}
        disabled={count <= min}
        aria-label="Remove a passenger"
      >
        −
      </button>
      <output className="stepper__value" aria-live="polite">
        {count}
      </output>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(count + 1)}
        disabled={count >= max}
        aria-label="Add a passenger"
      >
        +
      </button>
    </div>
  );
}
