'use client';

import { useEffect, useState } from 'react';
import '@/app/tablas.css';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

function BadgeBool({ active, label }: { active?: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black ${
        active
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
          : 'bg-slate-100 text-slate-400 border border-slate-200'
      }`}
    >
      {active ? '✓' : '—'} {label}
    </span>
  );
}

function RequisitoRow({
  p,
  onVer,
  onQuitar,
}: {
  p: any;
  onVer: (r: any) => void;
  onQuitar: (p: any) => void;
}) {
  const r = p.requisito;
  const esEtapa = r.tipo_requisito === 'ETAPA';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: p.ID_pasosBeca });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="rounded-3xl bg-white/85 shadow-[0_10px_28px_rgba(15,23,42,0.10)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_34px_rgba(15,23,42,0.16)]"
    >
      <td className="rounded-l-3xl px-4 py-4 align-top">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-black text-cyan-800 active:cursor-grabbing"
        >
          #{p.orden} ⋮⋮ Mover
        </button>
      </td>

      <td className="px-4 py-4 align-top">
        <span
          className={`inline-flex rounded-full px-3 py-2 text-[11px] font-black ${
            esEtapa
              ? 'bg-violet-100 text-violet-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {esEtapa ? '🧩 ETAPA' : '📄 DOCUMENTO'}
        </span>
      </td>

      <td className="px-4 py-4 align-top">
        <strong className="block max-w-[260px] text-sm font-black uppercase leading-snug text-slate-800">
          {r.nombre}
        </strong>
      </td>

      <td className="px-4 py-4 align-top">
        <div className="flex max-w-[360px] flex-wrap gap-2">
          {esEtapa ? (
            <>
              <BadgeBool active={r.requiere_nota} label="Nota" />
              <BadgeBool active={r.requiere_fecha_descripcion} label="Fecha/Descripción" />
              <BadgeBool active={r.requiere_ruta_360} label="Ruta 360°" />
              <BadgeBool active={r.requiere_otro} label="Otro" />
              <span className="rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1 text-[11px] font-black text-cyan-800">
                Encargados: {r.encargados?.length ?? 0}
              </span>
            </>
          ) : (
            <>
              <BadgeBool active={r.requiere_legalizacion} label="Legalización" />
              <BadgeBool active={!!r.archivo_ejemplo_url} label="PDF" />
              <BadgeBool active={!!r.url_externa} label="URL" />
            </>
          )}
        </div>
      </td>

      <td className="rounded-r-3xl px-4 py-4 align-top">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onVer(r)}
            className="rounded-2xl bg-cyan-600 px-4 py-2 text-xs font-black text-white shadow-lg shadow-cyan-600/25 transition hover:bg-cyan-700"
          >
            👁 Ver
          </button>

          <button
            onClick={() => onQuitar(p)}
            className="rounded-2xl bg-rose-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-rose-500/25 transition hover:bg-rose-600"
          >
            🗑 Quitar
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function RequisitosAsignadosTable({
  pasos,
  ordenEdits,
  setOrdenEdits,
  onSaveOrden,
  onSaveOrdenMasivo,
  onVer,
  onQuitar,
}: {
  pasos: any[];
  ordenEdits: Record<number, number>;
  setOrdenEdits: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  onSaveOrden: (p: any) => void;
  onSaveOrdenMasivo: (nuevos: any[]) => void;
  onVer: (r: any) => void;
  onQuitar: (p: any) => void;
}) {
  const [localPasos, setLocalPasos] = useState<any[]>(pasos);

  useEffect(() => {
    setLocalPasos(pasos);
  }, [pasos]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = localPasos.findIndex(
      (p) => p.ID_pasosBeca === active.id
    );

    const newIndex = localPasos.findIndex(
      (p) => p.ID_pasosBeca === over.id
    );

    const nuevos = arrayMove(localPasos, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        orden: index + 1,
      })
    );

    setLocalPasos(nuevos);

    const nuevosOrdenes: Record<number, number> = {};

    nuevos.forEach((item) => {
      nuevosOrdenes[item.ID_pasosBeca] = item.orden;
    });

    setOrdenEdits((prev) => ({
      ...prev,
      ...nuevosOrdenes,
    }));

    onSaveOrdenMasivo(nuevos);
  }

  return (
    <div className="hidden md:block overflow-hidden rounded-[26px] border border-white/70 bg-white/70 p-4 shadow-[0_22px_55px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localPasos.map((p) => p.ID_pasosBeca)}
          strategy={verticalListSortingStrategy}
        >
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-[12px] uppercase tracking-[0.08em] text-slate-600">
                <th className="px-4 py-3">Ordenar</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Requisito</th>
                <th className="px-4 py-3">Configuración</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {localPasos.map((p) => (
                <RequisitoRow
                  key={p.ID_pasosBeca}
                  p={p}
                  onVer={onVer}
                  onQuitar={onQuitar}
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
}