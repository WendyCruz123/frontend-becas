'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { Beca } from '../hooks/useBecas';
import '@/app/modal.css';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

const NOMBRES_BECAS = [
  'BECA TRABAJO INSTITUCIONAL',
  'BECA COMEDOR INSTITUCIONAL',
  'BECA AUXILIATURA',
  'BECA EXCELENCIA ACADÉMICA',
  'BECA INVESTIGACIÓN',
];

export default function BecaFormModal({
  mode,
  beca,
  onClose,
  onSaved,
}: {
  mode: 'create' | 'edit';
  beca?: Beca;
  onClose: () => void;
  onSaved: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [nombre, setNombre] = useState(beca?.nombre ?? '');
  const [tipo, setTipo] = useState(beca?.tipo ?? '');
  const [cupos, setCupos] = useState(
    beca?.cupos !== null && beca?.cupos !== undefined ? String(beca.cupos) : ''
  );
  const [detalle, setDetalle] = useState(beca?.detalle ?? '');
  const [imagen, setImagen] = useState<string>(beca?.imagen ?? '');
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(beca?.imagen ?? '');

  const [fechaInicio, setFechaInicio] = useState(
    beca?.fecha_inicio
      ? new Date(beca.fecha_inicio).toISOString().slice(0, 10)
      : ''
  );

  const [fechaFin, setFechaFin] = useState(
    beca?.fecha_fin ? new Date(beca.fecha_fin).toISOString().slice(0, 10) : ''
  );
  const [periodoBloqueo, setPeriodoBloqueo] = useState<'ANUAL' | 'SEMESTRAL'>(
  beca?.periodo_bloqueo ?? 'ANUAL'
);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!beca) return;

    setNombre(beca.nombre ?? '');
    setTipo(beca.tipo ?? '');
    setCupos(
      beca.cupos !== null && beca.cupos !== undefined ? String(beca.cupos) : ''
    );
    setDetalle(beca.detalle ?? '');
    setImagen(beca.imagen ?? '');
    setPreview(beca.imagen ?? '');
    setPeriodoBloqueo(beca.periodo_bloqueo ?? 'ANUAL');
    setFechaInicio(
      beca.fecha_inicio ? new Date(beca.fecha_inicio).toISOString().slice(0, 10) : ''
    );

    setFechaFin(
      beca.fecha_fin ? new Date(beca.fecha_fin).toISOString().slice(0, 10) : ''
    );
    
  }, [beca]);

  const selectImage = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMsg('Solo se permiten imágenes.');
      return;
    }

    setImagenFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imagenFile) return imagen || undefined;

    const formData = new FormData();
    formData.append('file', imagenFile);

    const r = await fetchWithAuth(`${BACKEND}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!r.ok) {
      throw new Error('No se pudo subir la imagen');
    }

    const data = await r.json();

    return data.url || data.fileUrl || data.path;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const imagenUrl = await uploadImage();

      const payload = {
        nombre,
        tipo,
        cupos: cupos.trim() ? Number(cupos) : null,
        detalle: detalle || undefined,
        imagen: imagenUrl || undefined,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin || undefined,
        periodo_bloqueo: periodoBloqueo,
      };

      const url =
        mode === 'create'
          ? `${BACKEND}/becas`
          : `${BACKEND}/becas/${beca!.ID_beca}`;

      const method = mode === 'create' ? 'POST' : 'PATCH';

      const r = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!r.ok) {
        const data = await r.json().catch(() => ({ message: 'Error' }));
        throw new Error(data.message || 'Error al guardar');
      }

      onSaved();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error';
      setMsg(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div
        className="
          modal-container modal--form-estudiante beca-modal
          w-[92vw] max-w-[560px]
          max-h-[90vh] overflow-y-auto
          rounded-[22px]
          sm:w-full
        "
      >
        <button className="modal-close" onClick={onClose} type="button">
          ×
        </button>

        <div className="beca-modal-header">
          <div>
            <span className="beca-modal-badge">Gestión de becas</span>
            <h2>{mode === 'create' ? 'Nueva beca' : 'Editar beca'}</h2>
            <p>Complete los datos necesarios para registrar la convocatoria.</p>
          </div>
        </div>

        <div className="modal-body">
          <form onSubmit={submit} className="beca-form">
            <div className="form-group">
              <label>Nombre de la beca</label>

              <div className="relative">
                <input
                  placeholder="Seleccione o escriba una nueva beca"
                  className="neo-input pr-10"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value.toUpperCase());
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  onBlur={() => setTimeout(() => setOpen(false), 150)}
                  required
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  ▼
                </span>

                {open && (
                  <div className="absolute z-50 mt-2 w-full rounded-xl border border-cyan-200 bg-white shadow-lg max-h-48 overflow-y-auto">
                    {NOMBRES_BECAS.filter((item) =>
                      item.includes(nombre.toUpperCase())
                    ).map((item) => (
                      <div
                        key={item}
                        onClick={() => {
                          setNombre(item);
                          setOpen(false);
                        }}
                        className="px-4 py-2 cursor-pointer text-slate-700 hover:bg-cyan-100 transition"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Fuente de Financiamiento</label>
              <input
                placeholder="Ej. IDH, INSTITUCIONAL..."
                className="neo-input"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Cupos disponibles</label>
              <input
  type="number"
  min={0}
  className="neo-input"
  placeholder="Ej. 20"
  value={cupos}
  onChange={(e) => setCupos(e.target.value)}
  onWheel={(e) => e.currentTarget.blur()}
/>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                Cantidad máxima de becas que pueden ser asignadas. Este dato permite calcular becas asignadas y acefalías en reportes.
              </p>
            </div>

            <div className="form-group">
              <label>Detalle</label>
              <textarea
                className="neo-input"
                placeholder="Detalle de la beca, requisitos generales o información importante."
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Imagen de convocatoria opcional</label>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  selectImage(e.dataTransfer.files?.[0]);
                }}
                className={`
                  cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center transition
                  ${dragActive ? 'border-cyan-500 bg-cyan-50' : 'border-cyan-200 bg-white/70'}
                `}
              >
                {preview ? (
                  <div className="space-y-3">
                    <img
                      src={preview}
                      alt="Vista previa"
                      className="mx-auto h-40 w-full rounded-xl object-cover border border-cyan-100"
                    />
                    <p className="text-sm text-slate-600">
                      Click o arrastre otra imagen para cambiarla
                    </p>
                  </div>
                ) : (
                  <div className="py-5">
                    <p className="font-semibold text-slate-700">
                      Arrastre una imagen aquí
                    </p>
                    <p className="text-sm text-slate-500">
                      o haga click para seleccionar desde documentos
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => selectImage(e.target.files?.[0])}
                />
              </div>

              {preview && (
                <button
                  type="button"
                  className="mt-2 text-sm font-semibold text-red-600 hover:underline"
                  onClick={() => {
                    setImagen('');
                    setImagenFile(null);
                    setPreview('');
                  }}
                >
                  Quitar imagen
                </button>
              )}
            </div>
              <div className="form-group">
            <label>Periodo de bloqueo</label>
            <select
              className="neo-input"
              value={periodoBloqueo}
              onChange={(e) =>
                setPeriodoBloqueo(e.target.value as 'ANUAL' | 'SEMESTRAL')
              }
              required
            >
              <option value="ANUAL">ANUAL</option>
              <option value="SEMESTRAL">SEMESTRAL</option>
            </select>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Define si una beca aprobada bloquea al estudiante por toda la gestión o solo por el semestre.
            </p>
          </div>
            <div className="form-grid grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="form-group">
                <label>Fecha de inicio</label>
                <input
                  type="date"
                  className="neo-input"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha de fin</label>
                <input
                  type="date"
                  className="neo-input"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>

            {msg && <p className="error-msg">{msg}</p>}

            <div className="modal-footer grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                type="button"
                className="modal-btn secondary w-full"
                onClick={onClose}
                disabled={saving}
              >
                Cancelar
              </button>

              <button className="modal-btn primary w-full" disabled={saving}>
                {saving
                  ? 'Guardando…'
                  : mode === 'create'
                    ? 'Registrar beca'
                    : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}