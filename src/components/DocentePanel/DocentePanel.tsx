import React, { useState } from 'react';
import './DocentePanel.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { RespuestasEstudiantes } from './RespuestasEstudiantes/RespuestasEstudiantes';
import { Perfil } from '../Perfil/Perfil';
import type { Usuario } from '../Perfil/Perfil';
import { PanelInicio } from '../panel-incio/panel-inicio';

export const DocentePanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Inicio');
  const navigate = useNavigate();

  // Usuario de ejemplo (puedes reemplazarlo por el usuario real logueado)
  const docenteUser: Usuario = {
    id: '2',
    nombres: 'María Elena',
    apellidos: 'Rodríguez Vega',
    rut: '10.234.567-8',
    email: 'maria.rodriguez@universidad.cl',
    tipo: 'docente'
  };

  const handleLogout = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Inicio':
        return (
          <PanelInicio usuario={{
            id: "2",
            nombres: "María Fernanda",
            apellidos: "Rojas Díaz",
            tipo: "docente",
            asignaturas: ["Matemáticas", "Física", "Álgebra"],
            estudiantes_total: 120,
          }} />
        );
      case 'Perfil':
        return (
          <Perfil
            usuario={docenteUser}
            editable={true}
            onGuardar={(usuarioActualizado: Usuario) => {
              console.log('Usuario actualizado:', usuarioActualizado);
              // Aquí iría la lógica para actualizar el usuario en tu backend
            }}
          />
        );
      case 'Ver Respuestas Estudiantes':
        // Aquí puedes pasar props si necesitas, por ejemplo para refrescar la corrección
        return <RespuestasEstudiantes />;
      default:
        return <p>Selecciona una opción</p>;
    }
  };

  return (
    <div className="docente-panel">
      <div className="docente-sidebar">
        <div className="docente-logo-container">
          <div className="logo logo-left"></div>
          <div className="logo logo-right"></div>
        </div>
        <ul className="docente-menu">
          <li onClick={() => setActiveSection('Inicio')}>
            <HomeIcon className="docente-menu-icon" /> Inicio
          </li>
          <li onClick={() => setActiveSection('Perfil')}>
            <AccountCircleIcon className="docente-menu-icon" /> Perfil
          </li>
          <li onClick={() => setActiveSection('Ver Respuestas Estudiantes')}>
            <SearchIcon className="docente-menu-icon" /> Ver Respuestas Estudiantes
          </li>
          <li className="docente-logout" onClick={handleLogout}>
            <LogoutIcon className="docente-menu-icon" /> Cerrar Sesión
          </li>
        </ul>
      </div>
      <div className="docente-content">{renderContent()}</div>
    </div>
  );
};