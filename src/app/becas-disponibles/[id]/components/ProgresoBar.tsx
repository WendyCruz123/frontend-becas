export function ProgresoBar({ value }: { value: number }) {
  return (
    <div className="progreso-container">
      <div
        className="progreso-bar"
        style={{ width: `${value}%` }}
      />
      <div className="progreso-label">{value}%</div>
      <div className="progreso-start">START</div>
      <div className="progreso-end">META</div>
    </div>
  );
}
