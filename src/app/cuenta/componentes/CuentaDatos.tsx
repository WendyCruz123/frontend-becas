import Image from 'next/image';
import '../estilos/datos.css';
import '@/app/tablas.css';
import { useRoles } from '@/components/useRoles';
import ModalCambiarPassword from './ModalCambiarPassword';
import { useState } from 'react';


export default function CuentaDatos({ persona }: { persona: any }) {
  const genero = persona.genero;
const roles = useRoles();
 const [showModal, setShowModal] = useState(false);
 
const roleBadges = roles.map((role) => {
  switch (role) {
    case 'admin':
      return {
        label: 'Administrador',
        icon: '👤',
        className: 'bg-purple-100 text-purple-700',
      };
    case 'estudiante':
      return {
        label: 'Estudiante',
        icon: '🎓',
        className: 'bg-blue-100 text-blue-700',
      };
    default:
      return {
        label: role,
        icon: '👤',
        className: 'bg-gray-100 text-gray-700',
      };
  }
});

  const avatarSrc =
    genero === 'M'
      ? '/usuario/hombre.png'
      : '/usuario/mujer.png';

  return (
    <div className="modal-datos">
      <div className="perfil-top">
        <div className="avatar">
          <Image
            src={avatarSrc}
            alt="Avatar usuario"
            width={80}
            height={80}
            priority
          />
        </div>

    <div className="flex flex-col">
        <h3 className="leading-tight uppercase">
          {persona.nombre} <br />
          {persona.apellido_paterno} {persona.apellido_materno}
      </h3>

        {/* ROLES DEBAJO DEL NOMBRE */}
        <div className="mt-2 flex flex-wrap gap-2">
            {roleBadges.map((r) => (
            <span
                key={r.label}
                className={`
                inline-flex items-center gap-2
                px-3 py-1
                rounded-full
                text-xs font-semibold
                ${r.className}
                `}
            >
                {r.icon} {r.label}
            </span>
            ))}
        </div>
    </div>

      </div>

      <ul className="lista-datos">
        <li><span className="icono">📧</span> {persona.correo_electronico}</li>
        <li><span className="icono">🪪</span> {persona.ci} {persona.expedido}</li>
        <li><span className="icono">📱</span> {persona.celular}</li>
        <li><span className="icono">📍</span> {persona.direccion}</li>
        <li><span className="icono">⚧️</span> {persona.genero}</li>
        <li><span className="icono">💍</span> {persona.estado_civil}</li>
      </ul>
        <div className="flex justify-end mt-4">
        <button
            className="btn-outline"
            onClick={() => setShowModal(true)}
        >
            Cambiar contraseña
        </button>
        </div>
    {showModal && (
        <ModalCambiarPassword onClose={() => setShowModal(false)} />
    )}
    </div>
  );    
}
