'use client';

type OficinaPublica = {
  ID_oficina: number;
  nombre: string;
  descripcion?: string | null;
  horario_atencion?: string | null;
  panorama_route_slug?: string | null;
};

type Props = {
  selectedOffice: OficinaPublica | null;
  onSelect: (office: OficinaPublica) => void;
};

const oficinas: OficinaPublica[] = [
  {
    ID_oficina: 2,
    nombre: 'DIRECCIÓN DE CARRERA',
    panorama_route_slug: 'direccion',
  },
  {
    ID_oficina: 3,
    nombre: 'KARDEX DE CARRERA',
    panorama_route_slug: 'kardex',
  },
  {
    ID_oficina: 4,
    nombre: 'CENTRO DE ESTUDIANTES',
    panorama_route_slug: 'centro_de_estudiantes',
  },
  {
    ID_oficina: 5,
    nombre: 'DISBEDC',
    panorama_route_slug: 'disbedc',
  },
  {
    ID_oficina: 6,
    nombre: 'FEDERACIÓN UNIVERSITARIA LOCAL (FUL)',
    panorama_route_slug: 'ful',
  },
];

export default function OfficesPanel({ selectedOffice, onSelect }: Props) {
  return (
    <>
      <nav className="fixed left-3 top-[70%] z-40 -translate-y-1/2 pointer-events-none md:hidden">
        <div className="pointer-events-auto space-y-2">
          {oficinas.map((item) => {
            const active = selectedOffice?.nombre === item.nombre;

            return (
              <button
                key={item.ID_oficina}
                onClick={() => onSelect(item)}
                className={`block max-w-[180px] truncate rounded-full px-4 py-2 text-left text-[12px] font-bold shadow-[0_6px_15px_rgba(0,0,0,.35)] transition-all duration-300 ${
                  active
                    ? 'bg-white text-black scale-105'
                    : 'bg-black/90 text-white hover:bg-white hover:text-black'
                }`}
              >
                {item.nombre}
              </button>
            );
          })}
        </div>
      </nav>

      <nav className="hidden md:block fixed left-0 top-0 z-40 h-screen w-[360px] px-8 pt-60 text-white pointer-events-none">
        <div className="pointer-events-auto space-y-4 mt-10">
          {oficinas.map((item) => {
            const active = selectedOffice?.nombre === item.nombre;

            return (
              <button
                key={item.ID_oficina}
                onClick={() => onSelect(item)}
                className={`block w-full rounded-full px-5 py-3.5 text-left text-[17px] font-black shadow-[0_10px_25px_rgba(0,0,0,.35)] transition duration-300 ${
                  active
                    ? 'bg-white text-black scale-[1.02]'
                    : 'bg-black text-white hover:bg-white hover:text-black hover:translate-x-1'
                }`}
              >
                {item.nombre}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}