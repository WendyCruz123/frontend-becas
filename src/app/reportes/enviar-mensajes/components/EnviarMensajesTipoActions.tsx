
'use client';

import type {
  EstadoFiltroNotificacion,
  OficinaOption,
  TipoBecaFiltro,
  TipoMensajeEnvio,
} from '../types';

import '@/app/modal.css';
import './modal-institucional.css';

import TipoActionsConEtapas from './tipo-actions/TipoActionsConEtapas';
import TipoActionsSinEtapas from './tipo-actions/TipoActionsSinEtapas';

type Props = {
  open: boolean;
  onClose: () => void;

  tipoBeca: TipoBecaFiltro;
  estadoFiltro: EstadoFiltroNotificacion;

  tipo: TipoMensajeEnvio;
  mensaje: string;
  oficinas: OficinaOption[];
  oficinaIdObservacion: string;

  usarFecha: boolean;
  usarNota: boolean;
  usarDescripcion: boolean;
  usarTextoExtra: boolean;

  fechaEtapa: string;
  notaEtapa: string;
  descripcionEtapa: string;
  textoExtraEtapa: string;

  setTipo: (value: TipoMensajeEnvio) => void;
  setMensaje: (value: string) => void;
  setOficinaIdObservacion: (value: string) => void;

  setUsarFecha: (value: boolean) => void;
  setUsarNota: (value: boolean) => void;
  setUsarDescripcion: (value: boolean) => void;
  setUsarTextoExtra: (value: boolean) => void;

  setFechaEtapa: (value: string) => void;
  setNotaEtapa: (value: string) => void;
  setDescripcionEtapa: (value: string) => void;
  setTextoExtraEtapa: (value: string) => void;

  onEnviarClick: () => void;
};

export default function EnviarMensajesTipoActions({
  open,
  onClose,
  tipoBeca,
  tipo,
  mensaje,
  oficinas,
  oficinaIdObservacion,

  usarFecha,
  usarNota,
  usarDescripcion,
  usarTextoExtra,

  fechaEtapa,
  notaEtapa,
  descripcionEtapa,
  textoExtraEtapa,

  setTipo,
  setMensaje,
  setOficinaIdObservacion,

  setUsarFecha,
  setUsarNota,
  setUsarDescripcion,
  setUsarTextoExtra,

  setFechaEtapa,
  setNotaEtapa,
  setDescripcionEtapa,
  setTextoExtraEtapa,

  onEnviarClick,
}: Props) {
  if (!open) return null;

  return (
    <div className="institutional-overlay">
      <div className="institutional-modal">
        <div className="institutional-header">
          <div>
            <h3>Tipo de mensaje</h3>
            <p>Configure la notificación que será enviada a los estudiantes.</p>
          </div>

          <button
            type="button"
            className="institutional-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="institutional-body">
          {tipoBeca === 'CON_ETAPAS' ? (
            <TipoActionsConEtapas
              tipo={tipo}
              mensaje={mensaje}
              oficinas={oficinas}
              oficinaIdObservacion={oficinaIdObservacion}
              usarFecha={usarFecha}
              usarNota={usarNota}
              usarDescripcion={usarDescripcion}
              usarTextoExtra={usarTextoExtra}
              fechaEtapa={fechaEtapa}
              notaEtapa={notaEtapa}
              descripcionEtapa={descripcionEtapa}
              textoExtraEtapa={textoExtraEtapa}
              setTipo={setTipo}
              setMensaje={setMensaje}
              setOficinaIdObservacion={setOficinaIdObservacion}
              setUsarFecha={setUsarFecha}
              setUsarNota={setUsarNota}
              setUsarDescripcion={setUsarDescripcion}
              setUsarTextoExtra={setUsarTextoExtra}
              setFechaEtapa={setFechaEtapa}
              setNotaEtapa={setNotaEtapa}
              setDescripcionEtapa={setDescripcionEtapa}
              setTextoExtraEtapa={setTextoExtraEtapa}
              onEnviarClick={onEnviarClick}
            />
          ) : (
            <TipoActionsSinEtapas
              tipo={tipo}
              mensaje={mensaje}
              oficinas={oficinas}
              oficinaIdObservacion={oficinaIdObservacion}
              usarDescripcion={usarDescripcion}
              descripcionEtapa={descripcionEtapa}
              setTipo={setTipo}
              setMensaje={setMensaje}
              setOficinaIdObservacion={setOficinaIdObservacion}
              setUsarDescripcion={setUsarDescripcion}
              setDescripcionEtapa={setDescripcionEtapa}
              onEnviarClick={onEnviarClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}