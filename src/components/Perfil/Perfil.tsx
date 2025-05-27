import React from 'react';
import './Perfil.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Tipos generales
interface UsuarioBase {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  tipo: 'docente' | 'alumno' | 'admin';
}

interface Admin extends UsuarioBase {
  tipo: 'admin';
  rol: string;
}

interface Docente extends UsuarioBase {
  tipo: 'docente';
}

interface Alumno extends UsuarioBase {
  tipo: 'alumno';
  id_carrera?: string;
  nombre_carrera?: string;
  año_ingreso?: string;
}

export type Usuario = Admin | Docente | Alumno;

interface PerfilProps {
  usuario: Usuario;
  editable?: boolean; // ya no se usará para edición
  onGuardar?: (usuario: Usuario) => void;
}

export const Perfil: React.FC<PerfilProps> = ({ usuario }) => {
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
          <input
            type="password"
            value="********"
            disabled
          />
        </div>
      </div>
    </div>
  );
};