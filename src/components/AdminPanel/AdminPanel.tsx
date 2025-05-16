import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { CrearFormulario } from './CrearFormulario/CrearFormulario';
import { CuadroFormularios } from './CuadroFormularios/CuadroFormularios';
import { useNavigate } from 'react-router-dom';

interface Pregunta {
  id: number;
  texto: string;
  respuestas: string[];
  editando: boolean;
}

interface Formulario {
  id: number;
  titulo: string;
  preguntas: Pregunta[];
  asignatura?: string | null;
  enviado?: boolean;
  editandoTitulo?: boolean;
}

export const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Inicio');
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<Formulario | null>(null);
  const [formularioSoloLectura, setFormularioSoloLectura] = useState<Formulario | null>(null);

  // Estado global de formularios
  const [formularios, setFormularios] = useState<Formulario[]>(() => {
    const data = localStorage.getItem('formularios');
    return data ? JSON.parse(data) : [];
  });

  // Sincroniza formularios con localStorage
  useEffect(() => {
    localStorage.setItem('formularios', JSON.stringify(formularios));
  }, [formularios]);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  // Guardar formulario (nuevo o editado)
  const handleGuardarFormulario = (formulario: Formulario) => {
    if (formulario.id && formularios.some(f => f.id === formulario.id)) {
      setFormularios((prev) =>
        prev.map((f) => (f.id === formulario.id ? { ...formulario } : f))
      );
    } else {
      setFormularios((prev) => [
        ...prev,
        {
          ...formulario,
          id: prev.length ? Math.max(...prev.map((f) => f.id)) + 1 : 1,
          asignatura: null,
          enviado: false,
          editandoTitulo: formulario.editandoTitulo ?? false,
        },
      ]);
    }
    setFormularioSeleccionado(null);
  };

  const renderContent = () => {
    if (formularioSoloLectura) {
      return (
        <div>
          <button
            className="admin-btn-retroceder"
            onClick={() => setFormularioSoloLectura(null)}
          >
            Retroceder
          </button>
          <CrearFormulario
            formulario={formularioSoloLectura}
            setFormulario={() => {}}
            onGuardar={() => {}}
            soloLectura={true}
          />
        </div>
      );
    }

    if (activeSection === 'Crear Formulario') {
      if (formularioSeleccionado) {
        return (
          <div>
            <button
              className="admin-btn-retroceder"
              onClick={() => setFormularioSeleccionado(null)}
            >
              Retroceder
            </button>
            <CrearFormulario
              formulario={formularioSeleccionado}
              setFormulario={setFormularioSeleccionado}
              onGuardar={handleGuardarFormulario}
            />
          </div>
        );
      }
      return (
        <CuadroFormularios
          formularios={formularios}
          setFormularios={setFormularios}
          setFormularioSeleccionado={setFormularioSeleccionado}
          setFormularioSoloLectura={setFormularioSoloLectura}
        />
      );
    }

    switch (activeSection) {
      case 'Inicio':
        return <p>Bienvenido al Panel de Administración</p>;
      case 'Perfil':
        return <p>Esta es la sección de Perfil</p>;
      case 'Dashboard':
        return <p>Esta es la sección de Dashboard</p>;
      case 'Ver Respuestas':
        return <p>Esta es la sección de Ver Respuestas</p>;
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
          <li className="logout" onClick={handleLogout}>
            <LogoutIcon className="menu-icon" /> Cerrar Sesión
          </li>
        </ul>
      </div>
      <div className="content">{renderContent()}</div>
    </div>
  );
};