'use client';

import '@/app/modal.css';
import { useEffect, useMemo, useState } from 'react';
import { Requisito } from './catalogo/RequisitosCatalogo';
import {
  apiListEncargados,
  apiListOficinas,
  apiListUsuariosLegalizacion,
  apiSaveRequisito,
  apiUploadRequisitoFile,
} from '../api';
import {
  LegalizacionFlujoItem,
  nombreUsuario,
  Oficina,
  RequisitoLegalizacionPayload,
  UsuarioMini,
} from '../types';

export default function RequisitoFormModal({
  mode,
  row,
  onClose,
  onSaved,
}: {
  mode: 'create' | 'edit';
  row?: Requisito;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nombre, setNombre] = useState(row?.nombre ?? '');
  const [descripcion, setDescripcion] = useState(row?.descripcion ?? '');
  const [archivoUrl, setArchivoUrl] = useState(row?.archivo_ejemplo_url ?? '');
  const [urlExterna, setUrlExterna] = useState(row?.url_externa ?? '');
  const [archivo, setArchivo] = useState<File | null>(null);

  const [oficinas, setOficinas] = useState<Oficina[]>([]);
  const [encargados, setEncargados] = useState<UsuarioMini[]>([]);
  const [usuariosLegalizacion, setUsuariosLegalizacion] = useState<UsuarioMini[]>(
    [],
  );

  const [oficinaId, setOficinaId] = useState<number | ''>(
    row?.oficina?.ID_oficina ?? row?.oficinaId ?? '',
  );

  const [tipoRequisito, setTipoRequisito] = useState<'DOCUMENTO' | 'ETAPA'>(
    row?.tipo_requisito ?? 'DOCUMENTO',
  );

  const [requiereLegalizacion, setRequiereLegalizacion] = useState(
    row?.requiere_legalizacion ?? false,
  );
  const [diasEstimadosLegalizacion, setDiasEstimadosLegalizacion] = useState<
  number | ''
>((row as any)?.dias_estimados_legalizacion ?? '');

  const [entregaFinalUsuarioId, setEntregaFinalUsuarioId] = useState<number | ''>(
    (row as any)?.entrega_final_usuarioId ?? '',
  );

  const [legalizacionFlujo, setLegalizacionFlujo] = useState<
    RequisitoLegalizacionPayload[]
  >(
    ((row as any)?.legalizacion_flujo as LegalizacionFlujoItem[] | undefined)
      ?.map((f) => ({
        usuarioId: f.usuarioId,
        orden: f.orden,
      }))
      .sort((a, b) => a.orden - b.orden) ?? [],
  );

  const [usuarioFlujoSeleccionado, setUsuarioFlujoSeleccionado] = useState<
    number | ''
  >('');

  const [requiereNota, setRequiereNota] = useState(row?.requiere_nota ?? false);
  const [requiereFechaDescripcion, setRequiereFechaDescripcion] = useState(
    row?.requiere_fecha_descripcion ?? false,
  );
  const [requiereRuta360, setRequiereRuta360] = useState(
    row?.requiere_ruta_360 ?? false,
  );
  const [requiereOtro, setRequiereOtro] = useState(row?.requiere_otro ?? false);

  const [encargadoIds, setEncargadoIds] = useState<number[]>(
    row?.encargados?.map((e: any) => e.usuarioId).filter(Boolean) ?? [],
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const usuariosFlujoDisponibles = useMemo(() => {
    const usados = new Set(legalizacionFlujo.map((f) => f.usuarioId));
    return usuariosLegalizacion.filter((u) => !usados.has(u.ID_usuario));
  }, [usuariosLegalizacion, legalizacionFlujo]);

  useEffect(() => {
    async function loadData() {
      try {
        const [ofiData, encData, legData] = await Promise.all([
          apiListOficinas(),
          apiListEncargados(),
          apiListUsuariosLegalizacion(),
        ]);

        setOficinas(ofiData);
        setEncargados(encData);
        setUsuariosLegalizacion(legData);
      } catch {
        setOficinas([]);
        setEncargados([]);
        setUsuariosLegalizacion([]);
      }
    }

    loadData();
  }, []);

  function toggleEncargado(id: number) {
    setEncargadoIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function agregarUsuarioFlujo() {
    if (!usuarioFlujoSeleccionado) return;

    setLegalizacionFlujo((prev) => [
      ...prev,
      {
        usuarioId: Number(usuarioFlujoSeleccionado),
        orden: prev.length + 1,
      },
    ]);

    setUsuarioFlujoSeleccionado('');
  }

  function quitarUsuarioFlujo(usuarioId: number) {
    setLegalizacionFlujo((prev) =>
      prev
        .filter((f) => f.usuarioId !== usuarioId)
        .map((f, index) => ({
          ...f,
          orden: index + 1,
        })),
    );
  }

  function moverFlujo(usuarioId: number, direccion: 'up' | 'down') {
    setLegalizacionFlujo((prev) => {
      const index = prev.findIndex((f) => f.usuarioId === usuarioId);
      if (index < 0) return prev;

      const newIndex = direccion === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const copia = [...prev];
      const temp = copia[index];
      copia[index] = copia[newIndex];
      copia[newIndex] = temp;

      return copia.map((f, i) => ({
        ...f,
        orden: i + 1,
      }));
    });
  }

  function getUsuario(id: number) {
    return usuariosLegalizacion.find((u) => u.ID_usuario === id);
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      if (tipoRequisito === 'ETAPA' && encargadoIds.length === 0) {
        throw new Error('Debe seleccionar al menos un encargado para la etapa.');
      }

      if (tipoRequisito === 'DOCUMENTO' && requiereLegalizacion) {
        if (legalizacionFlujo.length === 0) {
          throw new Error(
            'Debe agregar al menos un usuario al flujo de legalización presencial.',
          );
        }

        if (!entregaFinalUsuarioId) {
          throw new Error('Debe seleccionar el encargado final de entrega.');
        }
      }

      let uploadedUrl = archivoUrl || undefined;

      if (archivo) {
        setUploading(true);
        uploadedUrl = await apiUploadRequisitoFile(archivo);
      }

      const esEtapa = tipoRequisito === 'ETAPA';
      const usaLegalizacion = !esEtapa && !!requiereLegalizacion;

      const payload = {
        nombre,
        descripcion: descripcion || undefined,

        oficinaId:
          !esEtapa && oficinaId !== '' ? Number(oficinaId) : undefined,

        archivo_ejemplo_url: !esEtapa ? uploadedUrl : undefined,
        url_externa: !esEtapa ? urlExterna || undefined : undefined,

        requiere_legalizacion: usaLegalizacion,
        dias_estimados_legalizacion: usaLegalizacion
        ? diasEstimadosLegalizacion === ''
          ? undefined
          : Number(diasEstimadosLegalizacion)
        : undefined,
        entrega_final_usuarioId: usaLegalizacion
          ? Number(entregaFinalUsuarioId)
          : undefined,

        legalizacionFlujo: usaLegalizacion
          ? legalizacionFlujo.map((f, index) => ({
              usuarioId: Number(f.usuarioId),
              orden: index + 1,
            }))
          : [],

        tipo_requisito: tipoRequisito,

        requiere_nota: esEtapa ? !!requiereNota : false,
        requiere_fecha_descripcion: esEtapa
          ? !!requiereFechaDescripcion
          : false,
        requiere_ruta_360: esEtapa ? !!requiereRuta360 : false,
        requiere_otro: esEtapa ? !!requiereOtro : false,

        encargadoIds: esEtapa ? encargadoIds : [],
      };

      await apiSaveRequisito({
        mode,
        requisitoId: row?.ID_paso,
        payload,
      });

      onSaved();
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Error');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div
        className="
          modal-container modal--form-estudiante beca-modal
          w-[92vw] max-w-[680px]
          max-h-[90vh] overflow-y-auto
          rounded-[22px]
        "
      >
        <button className="modal-close" onClick={onClose} type="button">
          ×
        </button>

        <div className="beca-modal-header">
          <div>
            <span className="beca-modal-badge">Gestión de requisitos</span>
            <h2>{mode === 'create' ? 'Nuevo requisito' : 'Editar requisito'}</h2>
            <p>Configure si será documento normal o requisito-etapa.</p>
          </div>
        </div>

        <div className="modal-body">
          <form onSubmit={submit} className="beca-form">
            <div className="form-group">
              <label>Tipo de requisito</label>
              <select
                className="neo-input"
                value={tipoRequisito}
                onChange={(e) => {
                  const value = e.target.value as 'DOCUMENTO' | 'ETAPA';
                  setTipoRequisito(value);

                  if (value === 'ETAPA') {
                    setRequiereLegalizacion(false);
                    setLegalizacionFlujo([]);
                    setEntregaFinalUsuarioId('');
                  }
                }}
              >
                <option value="DOCUMENTO">DOCUMENTO NORMAL</option>
                <option value="ETAPA">REQUISITO - ETAPA</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nombre del requisito</label>
              <input
                className="neo-input"
                placeholder="Ej. RÉCORD ACADÉMICO"
                value={nombre}
                onChange={(e) => setNombre(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div className="form-group">
              <label>Recomendaciones / descripción</label>
              <textarea
                className="neo-input"
                placeholder="Anote las recomendaciones para este requisito"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            {tipoRequisito === 'DOCUMENTO' && (
              <>
                <div className="form-group">
                  <label>Oficina relacionada</label>
                  <select
                    value={oficinaId}
                    className="neo-input"
                    onChange={(e) =>
                      setOficinaId(e.target.value ? Number(e.target.value) : '')
                    }
                  >
                    <option value="">— Sin oficina —</option>
                    {oficinas.map((o) => (
                      <option key={o.ID_oficina} value={o.ID_oficina}>
                        {o.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Documento ejemplo (PDF o Word)</label>
                  <div
                    className="upload-box"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) setArchivo(file);
                    }}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      hidden
                      id="fileInputRequisito"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setArchivo(file);
                      }}
                    />

                    <label htmlFor="fileInputRequisito" className="upload-label">
                      {archivo ? (
                        <span>📄 {archivo.name}</span>
                      ) : (
                        <>
                          <span>Arrastra tu archivo aquí</span>
                          <small>o haz clic para seleccionar</small>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Link externo</label>
                  <input
                    className="neo-input"
                    placeholder="https://..."
                    value={urlExterna}
                    onChange={(e) => setUrlExterna(e.target.value)}
                  />
                </div>

                <label className="status-check">
                  <input
                    type="checkbox"
                    checked={requiereLegalizacion}
                    onChange={(e) => setRequiereLegalizacion(e.target.checked)}
                  />
                  <span>
                    <strong>Requiere legalización presencial</strong>
                    <small>
                      Active esta opción si el documento debe pasar por una o más
                      áreas antes de ser entregado al estudiante.
                    </small>
                  </span>
                </label>

                {requiereLegalizacion && (
                  <div className="info-box">
                    <strong>Flujo de legalización presencial</strong>
                    <div className="form-group mt-3">
                      <label>Tiempo estimado de legalización</label>
                      <input
                        className="neo-input"
                        type="number"
                        min={1}
                        max={30}
                        value={diasEstimadosLegalizacion}
                        onChange={(e) =>
                          setDiasEstimadosLegalizacion(
                            e.target.value ? Number(e.target.value) : '',
                          )
                        }
                        placeholder="Ej. 3"
                      />
                      <small>
                        Indique cuántos días hábiles puede tardar la legalización. Si no se
                        configura, se mostrará 3 a 4 días hábiles.
                      </small>
                    </div>
                    <p>
                      Agregue los usuarios en el orden en que revisarán el
                      requisito. El primer usuario recibe la entrega física; los
                      siguientes reciben directamente el documento en revisión.
                    </p>

                    <div className="form-group mt-3">
                      <label>Agregar usuario al flujo</label>
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                        <select
                          className="neo-input"
                          value={usuarioFlujoSeleccionado}
                          onChange={(e) =>
                            setUsuarioFlujoSeleccionado(
                              e.target.value ? Number(e.target.value) : '',
                            )
                          }
                        >
                          <option value="">— Seleccionar usuario —</option>
                          {usuariosFlujoDisponibles.map((u) => (
                            <option key={u.ID_usuario} value={u.ID_usuario}>
                              {nombreUsuario(u)}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          className="modal-btn secondary"
                          onClick={agregarUsuarioFlujo}
                        >
                          Agregar
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-2 mt-3">
                      {legalizacionFlujo.length === 0 ? (
                        <small>No se agregó ningún usuario al flujo.</small>
                      ) : (
                        legalizacionFlujo.map((f, index) => {
                          const user = getUsuario(f.usuarioId);

                          return (
                            <div
                              key={`${f.usuarioId}-${index}`}
                              className="status-check"
                            >
                              <span>
                                <strong>
                                  {index + 1}. {nombreUsuario(user)}
                                </strong>
                                <small>
                                  Orden de revisión: {index + 1}
                                </small>
                              </span>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="neo-action-btn"
                                  onClick={() => moverFlujo(f.usuarioId, 'up')}
                                  disabled={index === 0}
                                >
                                  ↑
                                </button>

                                <button
                                  type="button"
                                  className="neo-action-btn"
                                  onClick={() => moverFlujo(f.usuarioId, 'down')}
                                  disabled={index === legalizacionFlujo.length - 1}
                                >
                                  ↓
                                </button>

                                <button
                                  type="button"
                                  className="neo-action-btn"
                                  onClick={() => quitarUsuarioFlujo(f.usuarioId)}
                                >
                                  Quitar
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="form-group mt-3">
                      <label>Encargado final de entrega</label>
                      <select
                        className="neo-input"
                        value={entregaFinalUsuarioId}
                        onChange={(e) =>
                          setEntregaFinalUsuarioId(
                            e.target.value ? Number(e.target.value) : '',
                          )
                        }
                      >
                        <option value="">— Seleccionar encargado final —</option>
                        {usuariosLegalizacion.map((u) => (
                          <option key={u.ID_usuario} value={u.ID_usuario}>
                            {nombreUsuario(u)}
                          </option>
                        ))}
                      </select>
                      <small>
                        Este usuario marcará ENTREGAR cuando el documento ya
                        esté legalizado y listo para que el estudiante lo recoja.
                      </small>
                    </div>
                  </div>
                )}
              </>
            )}

            {tipoRequisito === 'ETAPA' && (
              <>
                <div className="info-box">
                  <strong>Configuración de etapa</strong>
                  <p>
                    Este requisito será habilitado después de aprobar la parte
                    documental. El encargado registrará el resultado de la etapa.
                  </p>
                </div>

                <label className="status-check">
                  <input
                    type="checkbox"
                    checked={requiereNota}
                    onChange={(e) => setRequiereNota(e.target.checked)}
                  />
                  <span>
                    <strong>Solicitar nota</strong>
                    <small>El encargado debe registrar una nota.</small>
                  </span>
                </label>

                <label className="status-check">
                  <input
                    type="checkbox"
                    checked={requiereFechaDescripcion}
                    onChange={(e) =>
                      setRequiereFechaDescripcion(e.target.checked)
                    }
                  />
                  <span>
                    <strong>Solicitar fecha y descripción</strong>
                    <small>
                      Se usará para indicar fecha, aula, instrucciones u otra
                      información.
                    </small>
                  </span>
                </label>

                <label className="status-check">
                  <input
                    type="checkbox"
                    checked={requiereRuta360}
                    onChange={(e) => setRequiereRuta360(e.target.checked)}
                  />
                  <span>
                    <strong>Solicitar oficina con recorrido 360°</strong>
                    <small>
                      El encargado seleccionará una oficina para que el
                      estudiante vea el recorrido virtual 360°.
                    </small>
                  </span>
                </label>

                <label className="status-check">
                  <input
                    type="checkbox"
                    checked={requiereOtro}
                    onChange={(e) => setRequiereOtro(e.target.checked)}
                  />
                  <span>
                    <strong>Solicitar texto adicional</strong>
                    <small>
                      Permite que el encargado agregue información adicional.
                    </small>
                  </span>
                </label>

                <div className="form-group">
                  <label>Encargados asignados</label>

                  <div className="grid gap-2">
                    {encargados.length === 0 ? (
                      <small>No hay usuarios con rol ENCARGADO.</small>
                    ) : (
                      encargados.map((u) => (
                        <label key={u.ID_usuario} className="status-check">
                          <input
                            type="checkbox"
                            checked={encargadoIds.includes(u.ID_usuario)}
                            onChange={() => toggleEncargado(u.ID_usuario)}
                          />
                          <span>
                            <strong>{nombreUsuario(u)}</strong>
                            <small>{u.username}</small>
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

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

              <button
                className="modal-btn primary w-full"
                disabled={saving || uploading}
              >
                {saving || uploading
                  ? 'Guardando…'
                  : mode === 'create'
                    ? 'Registrar requisito'
                    : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}