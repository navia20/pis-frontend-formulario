import React, { useState } from 'react';
import './AdminPanel.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import EditSquareIcon from '@mui/icons-material/Edit';
import { CrearFormulario } from './CrearFormulario/CrearFormulario';

export const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Inicio');

  const renderContent = () => {
    switch (activeSection) {
      case 'Inicio':
        return <p>Bienvenido al Panel de Administración</p>;
      case 'Perfil':
        return <p>Esta es la sección de Perfil</p>;
      case 'Dashboard':
        return <p>Esta es la sección de Dashboard</p>;
      case 'Ver Respuestas':
        return <p>Esta es la sección de Ver Respuestas</p>;
      case 'Crear Formulario':
        return <CrearFormulario />;
      case 'Agregar Asignatura':
        return <p>Esta es la sección de Agregar Asignatura</p>;
      case 'Designar Asignatura en Estudiante':
        return <p>Esta es la sección de Designar Asignatura en Estudiante</p>;
      case 'Designar Asignatura en Docente':
        return <p>Esta es la sección de Designar Asignatura en Docente</p>;
      case 'Crear Usuario':
        return <p>Esta es la sección de Crear Usuario</p>;
      case 'Cerrar Sesión':
        return <p>Has cerrado sesión</p>;
      default:
        return <p>Selecciona una opción</p>;
    }
  };

  return (
    <div className="admin-panel">
      <div className="sidebar">
        <div className="logo-container">
          <div className="logo logo-left"></div>
          <div className="logo logo-right"></div>
        </div>
        <ul className="menu">
          <li onClick={() => setActiveSection('Inicio')}>
            <HomeIcon className="menu-icon" /> Inicio
          </li>
          <li onClick={() => setActiveSection('Perfil')}>
            <AccountCircleIcon className="menu-icon" /> Perfil
          </li>
          <li onClick={() => setActiveSection('Dashboard')}>
            <DashboardIcon className="menu-icon" /> Dashboard
          </li>
          <li onClick={() => setActiveSection('Ver Respuestas')}>
            <SearchIcon className="menu-icon" /> Ver Respuestas
          </li>
          <li onClick={() => setActiveSection('Crear Formulario')}>
            <EditSquareIcon className="menu-icon" /> Crear Formulario
          </li>
          <li onClick={() => setActiveSection('Agregar Asignatura')}>
            <EditSquareIcon className="menu-icon" /> Agregar Asignatura
          </li>
          <li onClick={() => setActiveSection('Designar Asignatura en Estudiante')}>
            <EditSquareIcon className="menu-icon" /> Designar Asignatura en Estudiante
          </li>
          <li onClick={() => setActiveSection('Designar Asignatura en Docente')}>
            <EditSquareIcon className="menu-icon" /> Designar Asignatura en Docente
          </li>
          <li onClick={() => setActiveSection('Crear Usuario')}>
            <PersonAddIcon className="menu-icon" /> Crear Usuario
          </li>
          <li className="logout" onClick={() => setActiveSection('Cerrar Sesión')}>
            <LogoutIcon className="menu-icon" /> Cerrar Sesión
          </li>
        </ul>
      </div>
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};