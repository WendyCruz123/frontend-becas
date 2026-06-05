'use client'
import './modal-institucional.css'
type Props = {
  open: boolean
  beca: string
  gestion: string | number
  tipo: string
  cantidad: number
  onConfirm: () => void
  onCancel: () => void
}

export default function EnviarMensajesConfirmModal({
  open,
  beca,
  gestion,
  tipo,
  cantidad,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null

  return (
  <div className="institutional-overlay">
    <div className="institutional-modal">

      <div className="institutional-header">
        <div>
          <h3>Confirmar envío</h3>
          <p>
            Verifique la información antes de continuar
          </p>
        </div>

        <button
          className="institutional-close"
          onClick={onCancel}
        >
          ✕
        </button>
      </div>

      <div className="institutional-body">

        <div className="confirm-content">
          <div className="confirm-row">
            <span>Beca</span>
            <strong>{beca}</strong>
          </div>

          <div className="confirm-row">
            <span>Gestión</span>
            <strong>{gestion}</strong>
          </div>

          <div className="confirm-row">
            <span>Tipo</span>
            <strong>{tipo}</strong>
          </div>

          <div className="confirm-row highlight">
            <span>Estudiantes</span>
            <strong>
              {cantidad} {cantidad === 1 ? 'persona' : 'personas'}
            </strong>
          </div>
        </div>

        <p className="confirm-question">
          ¿Desea enviar las notificaciones?
        </p>

      </div>

      <div className="institutional-footer">
        <button
          className="btn-institutional btn-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>

        <button
          className="btn-institutional btn-primary"
          onClick={onConfirm}
        >
          Confirmar envío
        </button>
      </div>

    </div>
  </div>
)
}