import React, { useState } from 'react';
import './DocentePanel.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

export const DocentePanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Inicio');
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleLogout = () => {
    navigate('/login'); // Redirige al login
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Inicio':
        return <p>Bienvenido al Panel de Docente</p>;
      case 'Perfil':
        return <p>Esta es la sección de Perfil</p>;
      case 'Dashboard':
        return <p>Esta es la sección de Dashboard</p>;
      case 'Ver Respuestas Estudiantes':
        return <p>Esta es la sección de Ver Respuestas Estudiantes</p>;
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
          <li onClick={() => setActiveSection('Dashboard')}>
            <DashboardIcon className="docente-menu-icon" /> Dashboard
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