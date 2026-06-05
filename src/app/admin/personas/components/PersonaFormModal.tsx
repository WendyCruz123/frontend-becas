'use client';

import '@/app/modal.css';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { PersonaListItem, PersonaFull } from '../types';
import { onlyNumbers} from '@/lib/formUtils';
import { usePersonaFull } from '../hooks/usePersonaFull';

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

const EXPEDIDOS = [
  { v: 'LP', l: 'La Paz' },
  { v: 'SCZ', l: 'Santa Cruz' },
  { v: 'CBBA', l: 'Cochabamba' },
  { v: 'OR', l: 'Oruro' },
  { v: 'PT', l: 'Potosí' },
  { v: 'CH', l: 'Chuquisaca' },
  { v: 'TJA', l: 'Tarija' },
  { v: 'BE', l: 'Beni' },
  { v: 'PD', l: 'Pando' },
];

export default function PersonaFormModal({
  persona,
  onClose,
  onSaved,
}: {
  persona: PersonaListItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(persona);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data: fullPersona } = usePersonaFull(persona?.ID_persona);

const [form, setForm] = useState<PersonaFull>({
  ci: '',
  expedido: '',
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  apellido_casado: '',
  genero: 'M',
  fecha_nacimiento: '',
  estado_civil: '',
  direccion: '',
  correo_electronico: '',
  celular: '',

  ru: 0,
  promedio: 0,
  numero_Materias_Reprobadas: 0,
  año_ingreso: new Date().getFullYear(),
  semestre: false,
});

  useEffect(() => {
    if (!fullPersona) return;
    const estudiante = Array.isArray(fullPersona.estudiante)
  ? fullPersona.estudiante[0]
  : fullPersona.estudiante;
    setForm({
      ci: fullPersona.ci ?? '',
      expedido: fullPersona.expedido ?? '',
      nombre: fullPersona.nombre ?? '',
      apellido_paterno: fullPersona.apellido_paterno ?? '',
      apellido_materno: fullPersona.apellido_materno ?? '',
      apellido_casado: fullPersona.apellido_casado ?? '',
      genero: fullPersona.genero ?? 'M',
      fecha_nacimiento: fullPersona.fecha_nacimiento
        ? fullPersona.fecha_nacimiento.split('T')[0]
        : '',
      estado_civil: fullPersona.estado_civil ?? '',
      direccion: fullPersona.direccion ?? '',
      correo_electronico: fullPersona.correo_electronico ?? '',
      celular: fullPersona.celular ?? '',
      ru: estudiante?.ru ?? 0,
      promedio: estudiante?.promedio ?? 0,
      numero_Materias_Reprobadas:
        estudiante?.numero_Materias_Reprobadas ?? 0,
      año_ingreso: estudiante?.año_ingreso ?? new Date().getFullYear(),
      semestre: estudiante?.semestre ?? false,
    });
  }, [fullPersona]);

async function getBackendError(r: Response) {
  try {
    const data = await r.json();

    console.log('ERROR BACKEND PERSONA:', data);

    const normalize = (value: any): string => {
      if (!value) return '';

      if (typeof value === 'string') return value;

      if (Array.isArray(value)) {
        return value.map(normalize).filter(Boolean).join('\n');
      }

      if (typeof value === 'object') {
        if (typeof value.message === 'string') return value.message;
        if (Array.isArray(value.message)) return normalize(value.message);
        if (typeof value.error === 'string') return value.error;

        return Object.values(value).map(normalize).filter(Boolean).join('\n');
      }

      return String(value);
    };

    const message = normalize(data.message || data.error || data);

    return message || 'Error al guardar persona. Verifique los datos ingresados.';
  } catch {
    return 'Error al guardar persona. Verifique los datos ingresados.';
  }
}

async function submit() {
  setSaving(true);
  setError('');

  try {
    const payload = {
      ...form,
      ru: form.ru ? Number(form.ru) : null,
      promedio: Number(form.promedio),
      numero_Materias_Reprobadas: Number(form.numero_Materias_Reprobadas),
      año_ingreso: Number(form.año_ingreso),
      semestre: !!form.semestre,
      fecha_nacimiento: form.fecha_nacimiento || undefined,
    };

    const url = isEdit
      ? `${BACKEND}/persona/${persona!.ID_persona}`
      : `${BACKEND}/persona`;

    const r = await fetchWithAuth(url, {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const backendMessage = await getBackendError(r);
      throw new Error(backendMessage);
    }

    onSaved();
    onClose();
  } catch (e: any) {
  console.log('ERROR PERSONA:', e);

  const message =
    e?.message && typeof e.message === 'string'
      ? e.message
      : typeof e === 'string'
      ? e
      : 'Error al guardar persona. Verifique los datos ingresados.';

  setError(message);
}  finally {
    setSaving(false);
  }
}
  return (
    <div className="modal-overlay">
      <div className="
        modal-container modal--form-estudiante beca-modal
        w-[92vw] max-w-[720px]
        max-h-[90vh] overflow-y-auto
        rounded-[22px]
        sm:w-full
      ">
        <button className="modal-close" onClick={onClose} type="button">
          ×
        </button>

        <div className="beca-modal-header">
          <div>
            <span className="beca-modal-badge">Gestión de personas</span>
            <h2>{isEdit ? 'Editar persona' : 'Nueva persona'}</h2>
            <p>Registro de datos personales institucionales — Paso {step} de 3.</p>
          </div>
        </div>

        <div className="modal-body">
          <form className="beca-form">
            {step === 1 && (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Cédula de identidad</label>
                    <input
                      className="neo-input"
                      placeholder="Ej. 12345678"
                      value={form.ci}
                      onChange={(e) =>
                        setForm({ ...form, ci: onlyNumbers(e.target.value) })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Expedido</label>
                    <select
                      className="neo-input"
                      value={form.expedido}
                      onChange={(e) =>
                        setForm({ ...form, expedido: e.target.value })
                      }
                    >
                      <option value="">Seleccione</option>
                      {EXPEDIDOS.map((d) => (
                        <option key={d.v} value={d.v}>
                          {d.v} - {d.l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Nombres</label>
                  <input
                    className="neo-input"
                    placeholder="Ej. JUAN CARLOS"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value.toUpperCase() })
                    }
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Apellido paterno</label>
                    <input
                      className="neo-input"
                      value={form.apellido_paterno}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          apellido_paterno: e.target.value.toUpperCase(),
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Apellido materno</label>
                    <input
                      className="neo-input"
                      value={form.apellido_materno}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          apellido_materno: e.target.value.toUpperCase(),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Apellido de casado</label>
                  <input
                    className="neo-input"
                    placeholder="Opcional"
                    value={form.apellido_casado ?? ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        apellido_casado: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>

                <div className="modal-footer grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    className="modal-btn secondary w-full"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="modal-btn primary w-full"
                    onClick={() => setStep(2)}
                  >
                    Siguiente
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Género</label>
                    <select
                      className="neo-input"
                      value={form.genero}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          genero: e.target.value as 'M' | 'F',
                        })
                      }
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Fecha de nacimiento</label>
                    <input
                      type="date"
                      className="neo-input"
                      value={form.fecha_nacimiento}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fecha_nacimiento: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Estado civil</label>
                  <select
                      className="neo-input"
                      value={form.estado_civil}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          estado_civil: e.target.value.toUpperCase(),
                        })
                      }
                    >
                      <option value="SOLTERO">Soltero</option>
                      <option value="CASADO">Casado</option>
                      <option value="DIVORCIADO">Divorciado</option>
                      <option value="VIUDO">Viudo</option>
                    </select>
                </div>
                

                <div className="form-group">
                  <label>Dirección</label>
                  <textarea
                    className="neo-input"
                    value={form.direccion}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        direccion: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Correo electrónico</label>
                    <input
                      type="email"
                      className="neo-input"
                      value={form.correo_electronico}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          correo_electronico: e.target.value.toLowerCase(),
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Celular</label>
                    <input
                      className="neo-input"
                      value={form.celular ?? ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          celular: onlyNumbers(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="modal-footer grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    className="modal-btn secondary w-full"
                    onClick={() => setStep(1)}
                  >
                    Anterior
                  </button>

                  <button
                    type="button"
                    className="modal-btn primary w-full"
                    onClick={() => setStep(3)}
                  >
                    Siguiente
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
            <>
            <label>SOLO ESTUDIANTES</label>
              <div className="form-grid">
                <div className="form-group">
                  <label>Promedio general</label>
                  <input
                    type="number"
                    className="neo-input"
                    min={0}
                    max={100}
                    value={form.promedio ?? 0}
                    onChange={(e) =>
                      setForm({ ...form, promedio: Number(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Registro universitario</label>
                  <input
                    className="neo-input"
                    value={form.ru ?? ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        ru: Number(onlyNumbers(e.target.value)) || null,
                      })
                    }
                  />
                </div>
      <div className="form-group">
        <label>Número de materias reprobadas</label>
        <input
          type="number"
          className="neo-input"
          min={0}
          value={form.numero_Materias_Reprobadas ?? 0}
          onChange={(e) =>
            setForm({
              ...form,
              numero_Materias_Reprobadas: Number(e.target.value),
            })
          }
          required
        />
      </div>

      <div className="form-group">
        <label>Año de ingreso</label>
        <input
          type="number"
          className="neo-input"
          min={2000}
          max={new Date().getFullYear()}
          value={form.año_ingreso ?? new Date().getFullYear()}
          onChange={(e) =>
            setForm({ ...form, año_ingreso: Number(e.target.value) })
          }
          required
        />
      </div>

      <div className="form-group">
        <label>Validación de semestre</label>

        <label className="flex items-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={!!form.semestre}
            onChange={(e) =>
              setForm({ ...form, semestre: e.target.checked })
            }
          />
          ¿Cursa alguna materia de 2do o 1er semestre?
        </label>
      </div>
    </div>

    {error && <p className="error-msg">{error}</p>}

<div className="modal-footer grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
  <button
    type="button"
    className="modal-btn secondary w-full"
    onClick={() => setStep(2)}
    disabled={saving}
  >
    Anterior
  </button>

  <button
    type="button"
    className="modal-btn primary w-full"
    onClick={submit}
    disabled={saving}
  >
    {saving ? 'Guardando...' : isEdit ? 'Actualizar persona' : 'Guardar persona'}
  </button>
</div>
  </>
)}
          </form>
        </div>
      </div>
    </div>
  );
}