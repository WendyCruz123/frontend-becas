export function BuscadorBecas({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="           
            mb-6 rounded-[28px]
            border border-white/30
            bg-white/30
            backdrop-blur-md

            p-6

            shadow-[0_18px_45px_rgba(15,23,42,0.08)]

            dark:border-white/10
            dark:bg-slate-900/38
          ">
      <input
        className="
          w-full rounded-2xl border border-slate-200 bg-slate-50
          px-4 py-3 text-sm text-slate-700 outline-none
          transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100
        "
        placeholder="Buscar por nombre o tipo de beca..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}