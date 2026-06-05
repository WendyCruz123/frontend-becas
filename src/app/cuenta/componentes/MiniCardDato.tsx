export default function MiniCardDato({
  titulo,
  valor,
  icono,
}: {
  titulo: string;
  valor: string | number;
  icono: string;
}) {
  return (
    <div
      className="
        rounded-xl
        bg-white/60
        backdrop-blur
        shadow-md
        px-5 py-4
        flex flex-col items-center
        justify-center
        text-center
      "
    >
      <span className="text-2xl mb-1">{icono}</span>
      <span className="text-sm text-gray-600">{titulo}</span>
      <span className="text-2xl font-semibold">{valor}</span>
    </div>
  );
}
