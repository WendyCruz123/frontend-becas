'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

import EnviarMensajesFilters from './components/EnviarMensajesTipoBecaFilters';
import EnviarMensajesCards from './components/EnviarMensajesCards';
import EnviarMensajesPagination from './components/EnviarMensajesPagination';
import EnviarMensajesTipoActions from './components/EnviarMensajesTipoActions';
import EnviarMensajesConfirmModal from './components/EnviarMensajesConfirmModal';
import WhatsAppQrModal from './components/WhatsAppQrModal';
import { useEnviarMensajes } from './hooks/useEnviarMensajes';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:5000';

export default function EnviarMensajesPage() {
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [waQrImage, setWaQrImage] = useState<string | null>(null);
  const [waStatus, setWaStatus] = useState('');
  const [waLoading, setWaLoading] = useState(false);
  const [oficinas, setOficinas] = useState<any[]>([]);
  const [tipoModalOpen, setTipoModalOpen] = useState(false);
  const [oficinaIdObservacion, setOficinaIdObservacion] = useState('');

  const {
    rows,
    loading,
    page,
    setPage,

    tipoBeca,
    setTipoBeca,
    estadoFiltro,
    setEstadoFiltro,

    searchBeca,
    setSearchBeca,
    searchEstudiante,
    setSearchEstudiante,

    selectedIds,
    mensaje,
    setMensaje,
    tipo,
    setTipo,
    confirmar,
    setConfirmar,
    totalPages,
    toggleSeleccion,
    buscar,
    abrirConfirmacion,
    enviarMensajes,
    becaConfirmacion,
    gestionConfirmacion,
    tipoConfirmacion,
  } = useEnviarMensajes();

  const [usarFecha, setUsarFecha] = useState(false);
  const [usarNota, setUsarNota] = useState(false);
  const [usarDescripcion, setUsarDescripcion] = useState(false);
  const [usarTextoExtra, setUsarTextoExtra] = useState(false);

  const [fechaEtapa, setFechaEtapa] = useState('');
  const [notaEtapa, setNotaEtapa] = useState('');
  const [descripcionEtapa, setDescripcionEtapa] = useState('');
  const [textoExtraEtapa, setTextoExtraEtapa] = useState('');

  async function cargarWhatsapp() {
    setWaLoading(true);

    try {
      const statusRes = await fetchWithAuth(`${BACKEND}/whatsapp/status`);
      const statusData = await statusRes.json();
      setWaStatus(statusData.status || 'DESCONOCIDO');

      const qrRes = await fetchWithAuth(`${BACKEND}/whatsapp/qr`);
      const qrData = await qrRes.json();
      setWaQrImage(qrData.qrImage || null);
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar WhatsApp.');
    } finally {
      setWaLoading(false);
    }
  }

  async function autenticarWhatsapp() {
    setWaLoading(true);

    try {
      await fetchWithAuth(`${BACKEND}/whatsapp/authenticate`, {
        method: 'POST',
      });

      await cargarWhatsapp();
    } catch (error) {
      console.error(error);
      alert('No se pudo iniciar la autenticación de WhatsApp.');
    } finally {
      setWaLoading(false);
    }
  }

  async function abrirWhatsappModal() {
    setWaModalOpen(true);
    await cargarWhatsapp();
  }

  async function generarNuevoQr() {
    setWaLoading(true);

    try {
      await fetchWithAuth(`${BACKEND}/whatsapp/reset-session`, {
        method: 'POST',
      });

      setWaQrImage(null);
      setWaStatus('DISCONNECTED');

      await fetchWithAuth(`${BACKEND}/whatsapp/authenticate`, {
        method: 'POST',
      });

      setTimeout(() => {
        cargarWhatsapp();
      }, 2500);
    } catch (error) {
      console.error(error);
      alert('No se pudo generar un nuevo QR.');
    } finally {
      setWaLoading(false);
    }
  }

  useEffect(() => {
    async function cargarOficinas() {
      const res = await fetchWithAuth(`${BACKEND}/oficinas?limit=100`);
      const data = await res.json();
      setOficinas(data?.rows || data?.data?.rows || []);
    }

    cargarOficinas();
  }, []);

  function validarAntesDeConfirmar() {
    if (tipo === 'OBSERVADO' && !oficinaIdObservacion) {
      alert('Debe seleccionar la oficina donde el estudiante debe apersonarse.');
      return;
    }

    if (tipo === 'APROBAR_DOCUMENTACION_ETAPAS' && !oficinaIdObservacion) {
      alert('Debe seleccionar la oficina o recorrido 360° para la etapa.');
      return;
    }

    abrirConfirmacion();
  }

  return (
    <main className="px-5 pb-6 pt-0 -mt-40 md:mt-0 md:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="dashboard-title mb-1">NOTIFICACIONES</h2>
          <p className="text-sm font-semibold text-slate-500">
            Gestión de mensajes y cambios de estado por tipo de beca.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="btn-outline" onClick={abrirWhatsappModal}>
            📱 Cambiar número WhatsApp
          </button>

          <button
            className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-black text-white shadow-md transition hover:bg-cyan-800 active:scale-[0.98]"
            onClick={() => setTipoModalOpen(true)}
          >
            ✉️ Tipo mensaje
          </button>
        </div>
      </div>

      <EnviarMensajesFilters
        tipoBeca={tipoBeca}
        setTipoBeca={(value) => {
          setTipoBeca(value);
          setEstadoFiltro('PENDIENTE');
          setPage(0);
        }}
        estadoFiltro={estadoFiltro}
        setEstadoFiltro={(value) => {
          setEstadoFiltro(value);
          setPage(0);
        }}
        searchBeca={searchBeca}
        searchEstudiante={searchEstudiante}
        setSearchBeca={setSearchBeca}
        setSearchEstudiante={setSearchEstudiante}
        onBuscar={buscar}
      />

      <EnviarMensajesCards
        rows={rows}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSeleccion={toggleSeleccion}
      />

      <EnviarMensajesPagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(0, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />

      <EnviarMensajesTipoActions
        open={tipoModalOpen}
        onClose={() => setTipoModalOpen(false)}
        tipoBeca={tipoBeca}
        estadoFiltro={estadoFiltro}
        tipo={tipo}
        mensaje={mensaje}
        oficinas={oficinas}
        oficinaIdObservacion={oficinaIdObservacion}
        setTipo={setTipo}
        setMensaje={setMensaje}
        setOficinaIdObservacion={setOficinaIdObservacion}
        usarFecha={usarFecha}
        setUsarFecha={setUsarFecha}
        usarNota={usarNota}
        setUsarNota={setUsarNota}
        usarDescripcion={usarDescripcion}
        setUsarDescripcion={setUsarDescripcion}
        usarTextoExtra={usarTextoExtra}
        setUsarTextoExtra={setUsarTextoExtra}
        fechaEtapa={fechaEtapa}
        setFechaEtapa={setFechaEtapa}
        notaEtapa={notaEtapa}
        setNotaEtapa={setNotaEtapa}
        descripcionEtapa={descripcionEtapa}
        setDescripcionEtapa={setDescripcionEtapa}
        textoExtraEtapa={textoExtraEtapa}
        setTextoExtraEtapa={setTextoExtraEtapa}
        onEnviarClick={validarAntesDeConfirmar}
      />

      <EnviarMensajesConfirmModal
        open={confirmar}
        beca={becaConfirmacion}
        gestion={gestionConfirmacion}
        tipo={tipoConfirmacion}
        cantidad={selectedIds.length}
        onConfirm={() =>
          enviarMensajes(oficinaIdObservacion, {
            fecha: usarFecha ? fechaEtapa : undefined,
            nota: usarNota && notaEtapa ? Number(notaEtapa) : undefined,
            descripcion: usarDescripcion ? descripcionEtapa : undefined,
            textoExtra: usarTextoExtra ? textoExtraEtapa : undefined,
            oficinaRutaId: oficinaIdObservacion
              ? Number(oficinaIdObservacion)
              : undefined,
          })
        }
        onCancel={() => setConfirmar(false)}
      />

      <WhatsAppQrModal
        open={waModalOpen}
        qrImage={waQrImage}
        status={waStatus}
        loading={waLoading}
        onClose={() => setWaModalOpen(false)}
        onReset={generarNuevoQr}
        onAuthenticate={autenticarWhatsapp}
      />
    </main>
  );
}