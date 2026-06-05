'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function BotonVolverDashboard() {
  const router = useRouter();
  const pathname = usePathname();

  const rutasPrincipales = ['/dashboard', '/admin', '/kardex', '/encargado'];

  if (rutasPrincipales.includes(pathname)) return null;

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="
  inline-flex w-fit items-center rounded-xl
  border border-slate-300 bg-white px-3 py-2
  text-xs font-bold text-slate-700 shadow-sm
  transition hover:bg-slate-50 active:scale-[0.98]
  sm:px-4 sm:text-sm
"
    >
      ← Volver
    </button>
  );
}