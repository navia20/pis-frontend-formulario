import React, { useState } from 'react';
import './Perfil.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import type { Usuario, Admin, Alumno } from '../../types/usuario';
import { CambiarPasswordPerfil } from './CambiarPasswordPerfil';

interface PerfilProps {
  usuario: Usuario;
  editable?: boolean;
  onGuardar?: (usuario: Usuario) => void;
}

export const Perfil: React.FC<PerfilProps> = ({ usuario }) => {
  const [mostrarCambiarPassword, setMostrarCambiarPassword] = useState(false);

  const renderIconoTipo = () => {
    switch (usuario.tipo) {
      case 'admin':
        return <AdminPanelSettingsIcon className="profile-icon" />;
      case 'docente':
        return <BookIcon className="profile-icon" />;
      case 'alumno':
        return <SchoolIcon className="profile-icon" />;
      default:
        return <AccountCircleIcon className="profile-icon" />;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <AccountCircleIcon style={{ fontSize: 80 }} />
        </div>
        <div className="profile-title">
          <h2>{usuario.nombres} {usuario.apellidos}</h2>
          <div className="profile-type">
            {renderIconoTipo()}
            <span>{usuario.tipo.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3>Información Personal</h3>
        <div className="profile-field">
          <label>Nombres:</label>
          <input
            type="text"
            name="nombres"
            value={usuario.nombres}
            disabled
          />
        </div>
        <div className="profile-field">
          <label>Apellidos:</label>
          <input
            type="text"
            name="apellidos"
            value={usuario.apellidos}
            disabled
          />
        </div>
        <div className="profile-field">
          <label>RUT:</label>
          <input
            type="text"
            name="rut"
            value={usuario.rut}
            disabled
          />
        </div>
        {/* Campos específicos */}
        {usuario.tipo === 'admin' && (
          <div className="profile-field">
            <label>Rol:</label>
            <input
              type="text"
              name="rol"
              value={(usuario as Admin).rol}
              disabled
            />
          </div>
        )}
        {usuario.tipo === 'alumno' && (
          <>
            <div className="profile-field">
              <label>Carrera:</label>
              <input
                type="text"
                name="nombre_carrera"
                value={(usuario as Alumno).nombre_carrera || ''}
                disabled
              />
            </div>
            <div className="profile-field">
              <label>Año de Ingreso:</label>
              <input
                type="text"
                name="año_ingreso"
                value={(usuario as Alumno).año_ingreso || ''}
                disabled
              />
            </div>
          </>
        )}
      </div>

      <div className="profile-section">
        <h3>Información de Cuenta</h3>
        <div className="profile-field">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={usuario.email}
            disabled
          />
        </div>
        <div className="profile-field">
          <label>Contraseña:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="password"
              value="********"
              disabled
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setMostrarCambiarPassword(!mostrarCambiarPassword)}
              style={{
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {mostrarCambiarPassword ? 'Cancelar' : 'Cambiar'}
            </button>
          </div>
        </div>
      </div>

      {/* Componente para cambiar contraseña */}
      {mostrarCambiarPassword && (
        <CambiarPasswordPerfil
          usuarioId={usuario.id}
          tipoUsuario={usuario.tipo}
          onSuccess={() => {
            setMostrarCambiarPassword(false);
          }}
          onCancel={() => {
            setMostrarCambiarPassword(false);
          }}
        />
      )}
    </div>
  );
};