'use client'

type Props = {
  open: boolean
  qrImage: string | null
  status: string
  loading: boolean
  onClose: () => void
  onReset: () => void
  onAuthenticate: () => void
}

export default function WhatsAppQrModal({
  open,
  qrImage,
  status,
  loading,
  onClose,
  onReset,
  onAuthenticate,
}: Props) {
  if (!open) return null

  const ready = status === 'READY'
  const scanQr = status === 'SCAN_QR'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.65)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: '#0f172a',
          color: 'white',
          borderRadius: 18,
          padding: 24,
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,.15)',
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
          Vincular WhatsApp
        </h2>

        <p style={{ opacity: 0.8, marginBottom: 16 }}>
          Escanea el código desde WhatsApp &gt; Dispositivos vinculados.
        </p>

        <div style={{ marginBottom: 16 }}>
          Estado:{' '}
          <strong style={{ color: ready ? '#22c55e' : scanQr ? '#facc15' : '#93c5fd' }}>
            {status || 'DESCONOCIDO'}
          </strong>
        </div>

        {ready ? (
          <div
            style={{
              padding: 16,
              borderRadius: 14,
              background: 'rgba(34,197,94,.15)',
              border: '1px solid rgba(34,197,94,.35)',
              marginBottom: 16,
            }}
          >
            ✅ WhatsApp está conectado y listo para enviar mensajes.
          </div>
        ) : qrImage ? (
          <div
            style={{
              background: 'white',
              padding: 14,
              borderRadius: 14,
              display: 'inline-block',
              marginBottom: 16,
            }}
          >
            <img
              src={qrImage}
              alt="QR WhatsApp"
              style={{ width: 240, height: 240, display: 'block' }}
            />
          </div>
        ) : (
          <div style={{ marginBottom: 16, opacity: 0.8 }}>
            {loading ? 'Generando QR...' : 'Presiona “Autenticar WhatsApp”.'}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-outline" onClick={onAuthenticate} disabled={loading || ready}>
            Autenticar WhatsApp
          </button>

          <button className="btn-outline" onClick={onReset} disabled={loading}>
            Cambiar número
          </button>

          <button className="btn-ghost" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}