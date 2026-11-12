export default function SeatMapSkeleton() {
  return (
    <div className="cabin cabin--skeleton" aria-busy="true" aria-label="Loading seat map">
      {Array.from({ length: 8 }, (_, i) => (
        <div className="skeleton-row" key={i} />
      ))}
    </div>
  );
}
