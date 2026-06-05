export default function EstadoPostulacion({
  puedePostular,
}: {
  puedePostular: boolean;
}) {
  return (
    <div
      className={`
        w-full
        rounded-2xl
        px-8 py-6
        shadow-lg
        backdrop-blur
        border
        flex items-center gap-4
        ${
          puedePostular
            ? 'bg-green-100/70 border-green-300 text-green-800'
            : 'bg-red-100/70 border-red-300 text-red-800'
        }
      `}
    >
      <span className="text-3xl">
        {puedePostular ? '✅' : '❌'}
      </span>

      <div>
        <h2 className="text-xl font-semibold">
          {puedePostular
            ? 'Puede postular a becas'
            : 'No puede postular a becas'}
        </h2>
        <p className="text-sm opacity-80">
          Resultado automático según los requisitos académicos
        </p>
      </div>
    </div>
  );
}
