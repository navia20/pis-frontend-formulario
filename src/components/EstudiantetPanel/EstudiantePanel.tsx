import React, { useState } from 'react';
import './EstudiantePanel.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { FormularioEstudiante } from './FormularioEstudiante/FormularioEstudiante';

interface Pregunta {
  id: number;
  texto: string;
  respuestas: string[];
}

export const EstudiantePanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Inicio');
  
  const [formulario] = useState({
    titulo: 'Formulario de Ejemplo',
    preguntas: [
      {
        id: 1,
        texto: '¿Cuál es tu color favorito?',
        respuestas: ['Rojo', 'Azul', 'Verde', 'Amarillo'],
      },
      {
        id: 2,
        texto: '¿Cuál es tu animal favorito?',
        respuestas: ['Perro', 'Gato', 'Pájaro', 'Pez'],
      },
    ] as Pregunta[],
  });

// Estado para las respuestas seleccionadas
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState<{ [key: number]: string }>({});

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Inicio':
        return <p>Bienvenido al Panel de Estudiante</p>;
      case 'Perfil':
        return <p>Esta es la sección de Perfil</p>;
      case 'Responder Formulario':
        return (
          <FormularioEstudiante
            formulario={formulario}
            respuestasSeleccionadas={respuestasSeleccionadas}
            setRespuestasSeleccionadas={setRespuestasSeleccionadas}
            />
        );
      case 'Ver Respuestas':
        return <p>Esta es la sección de Ver Respuestas</p>;
      default:
        return <p>Selecciona una opción</p>;
    }
  };

  return (
    <div className="estudiante-panel">
      <div className="estudiante-sidebar">
        <div className="estudiante-logo-container">
          <div className="logo logo-left"></div>
          <div className="logo logo-right"></div>
        </div>
        <ul className="estudiante-menu">
          <li onClick={() => setActiveSection('Inicio')}>
            <HomeIcon className="estudiante-menu-icon" /> Inicio
          </li>
          <li onClick={() => setActiveSection('Perfil')}>
            <AccountCircleIcon className="estudiante-menu-icon" /> Perfil
          </li>
          <li onClick={() => setActiveSection('Responder Formulario')}>
            <AssignmentIcon className="estudiante-menu-icon" /> Responder Formulario
          </li>
          <li onClick={() => setActiveSection('Ver Respuestas')}>
            <SearchIcon className="estudiante-menu-icon" /> Ver Respuestas
          </li>
          <li className="estudiante-logout" onClick={handleLogout}>
            <LogoutIcon className="estudiante-menu-icon" /> Cerrar Sesión
          </li>
        </ul>
      </div>
      <div className="estudiante-content">{renderContent()}</div>
    </div>
  );
};