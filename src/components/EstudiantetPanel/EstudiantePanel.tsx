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

interface Formulario {
  id: number;
  titulo: string;
  preguntas: Pregunta[];
}

export const EstudiantePanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Inicio');
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<Formulario | null>(null);

  const formularios: Formulario[] = [
    {
      id: 1,
      titulo: 'Formulario Ejemplo 1',
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
      ],
    },
    {
      id: 2,
      titulo: 'Formulario Ejemplo 2',
      preguntas: [
        {
          id: 1,
          texto: '¿Qué lenguaje de programación prefieres?',
          respuestas: ['JavaScript', 'Python', 'Java', 'C#'],
        },
        {
          id: 2,
          texto: '¿Cuál es tu sistema operativo favorito?',
          respuestas: ['Windows', 'macOS', 'Linux', 'Otro'],
        },
      ],
    },
  ];

  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState<{ [key: number]: string }>({});

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const renderContent = () => {
    if (formularioSeleccionado) {
      return (
        <div>
          <button className="btn-retroceder" onClick={() => setFormularioSeleccionado(null)}>
            Retroceder
          </button>
          <FormularioEstudiante
            formulario={formularioSeleccionado}
            respuestasSeleccionadas={respuestasSeleccionadas}
            setRespuestasSeleccionadas={setRespuestasSeleccionadas}
          />
        </div>
      );
    }

    switch (activeSection) {
      case 'Inicio':
        return <p>Bienvenido al Panel de Estudiante</p>;
      case 'Perfil':
        return <p>Esta es la sección de Perfil</p>;
      case 'Responder Formulario':
        return (
          <div className="lista-formularios">
            {formularios.map((formulario) => (
              <div
                key={formulario.id}
                className="formulario-cuadro"
                onClick={() => setFormularioSeleccionado(formulario)}
              >
                <h3>{formulario.titulo}</h3>
              </div>
            ))}
          </div>
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