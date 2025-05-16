import React, { useState } from 'react';
import './AdminPanel.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CrearFormulario } from './CrearFormulario/CrearFormulario';
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
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

  // Simulación de formularios existentes
  const [formularios, setFormularios] = useState<Formulario[]>([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  // Guardar formulario (nuevo o editado)
  const handleGuardarFormulario = (formulario: Formulario) => {
    if (formulario.id) {
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

  // Eliminar formulario
  const handleEliminarFormulario = (id: number) => {
    setFormularios((prev) => prev.filter((f) => f.id !== id));
    setMenuAbierto(null);
  };

  // Asignar asignatura (simulado)
  const handleAsignarAsignatura = (id: number) => {
    setFormularios((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, asignatura: 'Asignatura X' } : f
      )
    );
    setMenuAbierto(null);
  };

  // Validar si el formulario está listo para enviar
  const puedeEnviarFormulario = (formulario: Formulario) => {
    if (!formulario.titulo.trim()) return false;
    if (formulario.editandoTitulo) return false;
    if (!formulario.preguntas.length) return false;
    for (const pregunta of formulario.preguntas) {
      if (pregunta.editando) return false;
      if (!pregunta.texto.trim()) return false;
    }
    return true;
  };

  // Enviar a asignatura (simulado)
  const handleEnviarAsignatura = (id: number) => {
    const formulario = formularios.find((f) => f.id === id);
    if (!formulario || !puedeEnviarFormulario(formulario)) return;
    setFormularios((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, enviado: true } : f
      )
    );
    setMenuAbierto(null);
  };

  // Renderiza los cuadros de formularios
  const renderFormulariosCuadros = () => (
    <div className="admin-formularios-lista">
      {formularios.map((formulario) => (
        <div key={formulario.id} className="admin-formulario-cuadro">
          <div className="admin-formulario-titulo">{formulario.titulo}</div>
          <button
            className="admin-formulario-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenuAbierto(menuAbierto === formulario.id ? null : formulario.id);
            }}
          >
            <MoreVertIcon />
          </button>
          {menuAbierto === formulario.id && (
            <div className="admin-formulario-menu">
              <button
                onClick={() => {
                  setFormularioSeleccionado({
                    ...formulario,
                    editandoTitulo: formulario.editandoTitulo ?? false,
                  });
                  setMenuAbierto(null);
                }}
                disabled={formulario.enviado}
              >
                Editar
              </button>
              <button onClick={() => handleEliminarFormulario(formulario.id)}>
                Eliminar
              </button>
              <button
                onClick={() => handleAsignarAsignatura(formulario.id)}
                disabled={formulario.enviado}
              >
                Asignar Asignatura
              </button>
              {formulario.asignatura && (
                <button
                  onClick={() => handleEnviarAsignatura(formulario.id)}
                  disabled={formulario.enviado || !puedeEnviarFormulario(formulario)}
                  title={
                    !puedeEnviarFormulario(formulario)
                      ? 'Debes guardar el título y todas las preguntas antes de enviar'
                      : undefined
                  }
                >
                  Enviar a Asignatura
                </button>
              )}
              {formulario.enviado && (
                <button
                  onClick={() => {
                    setFormularioSoloLectura(formulario);
                    setMenuAbierto(null);
                  }}
                >
                  Ver Formulario
                </button>
              )}
            </div>
          )}
          {formulario.enviado && (
            <div className="admin-formulario-enviado">Enviado</div>
          )}
        </div>
      ))}
      <div
        className="admin-formulario-cuadro admin-formulario-cuadro-nuevo"
        onClick={() =>
          setFormularioSeleccionado({
            id: 0,
            titulo: '',
            preguntas: [],
            asignatura: null,
            enviado: false,
            editandoTitulo: true,
          })
        }
      >
        <AddIcon style={{ fontSize: 48 }} />
      </div>
    </div>
  );

  // Renderiza el contenido principal según la sección activa
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
      return renderFormulariosCuadros();
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