'use client';

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title = 'Confirmar acción',
  message,
  confirmText = 'Sí, eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <div className="confirm-header">
          <h3>{title}</h3>
          <p>Esta acción requiere confirmación.</p>
        </div>

        <p className="confirm-question whitespace-pre-line">{message}</p>

        <div className="confirm-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>

          <button type="button" className="btn-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}