import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { CrearFormulario } from '../components/AdminPanel/CrearFormulario/CrearFormulario';
import { CuadroFormularios } from '../components/AdminPanel/CuadroFormularios/CuadroFormularios';
import { Perfil } from '../components/Perfil/Perfil';
import type { Usuario } from '../components/Perfil/Perfil';
import { useNavigate } from 'react-router-dom';
import { PanelInicio } from '../components/panel-incio/panel-inicio';
import { encuestaService } from '../services/encuestaService';

// Importación de los nuevos componentes del panel de administración
import { CrearUsuario } from '../components/AdminPanel/CrearUsuario/CrearUsuario';
import { VerRespuestas } from '../components/AdminPanel/VerRespuestas/VerRespuestas';
import { AgregarAsignatura } from '../components/AdminPanel/AgregarAsignatura/AgregarAsignatura';
import { DesignarAsignaturaEstudiante } from '../components/AdminPanel/DesignarAsignaturaEstudiante/DesignarAsignaturaEstudiante';
import { DesignarAsignaturaDocente } from '../components/AdminPanel/DesignarAsignaturaDocente/DesignarAsignaturaDocente';

// TODO: Mover estos tipos a src/types/formulario.ts si se usan en más archivos
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

  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Cargar formularios desde el service al montar
  useEffect(() => {
    setLoading(true);
    setError(null);
    encuestaService.getEncuestas()
      .then((data) => {
        setFormularios(
          data.map((e) => ({
            id: Number(e.id),
            titulo: e.titulo,
            preguntas: [], // TODO: Mapear preguntas si el backend las entrega
            asignatura: e.id_asignatura,
            enviado: false,
            editandoTitulo: false,
          }))
        );
      })
      .catch(() => setError('Error al cargar los formularios'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  // Guardar formulario (nuevo o editado)
  const handleGuardarFormulario = async (formulario: Formulario) => {
    try {
      let nuevoFormulario = formulario;
      if (formulario.id && formularios.some(f => f.id === formulario.id)) {
        // Actualizar
        await encuestaService.updateEncuesta(formulario.id.toString(), {
          titulo: formulario.titulo,
          // ...otros campos que correspondan
        });
        setFormularios((prev) =>
          prev.map((f) => (f.id === formulario.id ? { ...formulario } : f))
        );
      } else {
        // Crear
        const creado = await encuestaService.createEncuesta({
          titulo: formulario.titulo,
          descripcion: '', // TODO: Ajustar según tu modelo
          id_asignatura: formulario.asignatura || '',
          fecha_creacion: new Date().toISOString(),
          fecha_termino: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });
        nuevoFormulario = {
          ...formulario,
          id: Number(creado.id),
          asignatura: creado.id_asignatura,
        };
        setFormularios((prev) => [...prev, nuevoFormulario]);
      }
      setFormularioSeleccionado(null);
    } catch (e) {
      setError('Error al guardar el formulario');
    }
  };

  // Usuario de ejemplo (puedes reemplazarlo por el usuario real logueado)
  const adminUser: Usuario = {
    id: '1',
    nombres: 'Admin',
    apellidos: 'Sistema',
    rut: '12.345.678-9',
    email: 'admin@universidad.cl',
    tipo: 'admin',
    rol: 'Administrador Principal'
  };

  // Render de contenido principal
  const renderContent = () => {
    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error">{error}</div>;

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
          setFormularioSoloLectura={setFormularioSoloLectura}
        />
      );
    }

    // Secciones del panel de administración
    switch (activeSection) {
      case 'Inicio':
        return <PanelInicio usuario={{
          id: "admin1",
          nombres: "eric ross",
          apellidos: "General",
          tipo: "admin",
          total_usuarios: 120,
          total_docentes: 15,
          total_alumnos: 105,
        }} />;
      case 'Perfil':
        return (
          <Perfil
            usuario={adminUser}
            editable={true}
            onGuardar={(usuarioActualizado: Usuario) => {
              console.log('Usuario actualizado:', usuarioActualizado);
              // TODO: Llamar a backend para actualizar usuario
            }}
          />
        );
      case 'Ver Respuestas':
        return <VerRespuestas />;
      case 'Agregar Asignatura':
        return <AgregarAsignatura />;
      case 'Designar Asignatura en Estudiante':
        return <DesignarAsignaturaEstudiante />;
      case 'Designar Asignatura en Docente':
        return <DesignarAsignaturaDocente />;
      case 'Crear Usuario':
        return <CrearUsuario />;
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