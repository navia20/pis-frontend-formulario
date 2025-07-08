import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { CrearFormulario } from '../components/AdminPanel/CrearFormulario/CrearFormulario';
import { CuadroFormularios } from '../components/AdminPanel/CuadroFormularios/CuadroFormularios';
import { Perfil } from '../components/Perfil/Perfil';
import type { Usuario } from '../types/usuario';
import type { Formulario } from '../types/formulario';
import { useNavigate } from 'react-router-dom';
import { PanelInicio } from '../components/panel-incio/panel-inicio';
import { encuestaService } from '../services/encuestaService';
import { usuarioService } from '../services/usuarioService';
import { authService } from '../services/authService';

// Importación de los nuevos componentes del panel de administración
import { CrearUsuario } from '../components/AdminPanel/CrearUsuario/CrearUsuario';
import { CargaMasivaUsuarios } from '../components/AdminPanel/CargaMasiva/CargaMasivaUsuarios';
import { VerRespuestas } from '../components/AdminPanel/VerRespuestas/VerRespuestas';
import { AgregarAsignatura } from '../components/AdminPanel/AgregarAsignatura/AgregarAsignatura';
import { DesignarAsignaturaEstudiante } from '../components/AdminPanel/DesignarAsignaturaEstudiante/DesignarAsignaturaEstudiante';
import { DesignarAsignaturaDocente } from '../components/AdminPanel/DesignarAsignaturaDocente/DesignarAsignaturaDocente';

export const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Inicio');
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<Formulario | null>(null);
  const [formularioSoloLectura, setFormularioSoloLectura] = useState<Formulario | null>(null);

  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para las estadísticas
  const [estadisticas, setEstadisticas] = useState({
    total_usuarios: 0,
    total_docentes: 0,
    total_alumnos: 0,
    total_admins: 0
  });

  const navigate = useNavigate();

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const verificarAutenticacion = async () => {
      const token = authService.getToken();
      
      if (!token) {
        console.log('No hay token de autenticación. Redirigiendo al login de admin.');
        navigate('/login-admin');
        return;
      }

      try {
        // Intentar obtener el perfil para validar que el token es válido
        const profile = await authService.getProfile();
        
        if (profile.tipo !== 'admin') {
          console.log('Usuario no es admin. Redirigiendo al login de admin.');
          navigate('/login-admin');
          return;
        }
        
        console.log('Admin autenticado correctamente:', profile);
      } catch (error) {
        console.error('Token inválido o expirado. Redirigiendo al login de admin.', error);
        authService.logout(); // Limpiar token inválido
        navigate('/login-admin');
      }
    };

    verificarAutenticacion();
  }, [navigate]);

  // Cargar formularios desde el service al montar
  const cargarFormularios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await encuestaService.getEncuestas();
      setFormularios(
        data.map((e) => ({
          id: e.id,
          titulo: e.titulo,
          preguntas: e.preguntas?.map((p) => ({
            id: p.id || `pregunta_${Math.random()}`,
            texto: p.texto,
            respuestas: p.respuestas,
            editando: false,
            respuestaCorrecta: p.respuestaCorrecta,
          })) || [],
          asignatura: e.id_asignatura,
          fechaLimite: e.fecha_termino,
          descripcion: e.descripcion,
          enviado: e.enviado || false,
          publicado: e.publicado || false,
          editandoTitulo: false,
        }))
      );
    } catch (err) {
      setError('Error al cargar los formularios');
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas de usuarios
  const cargarEstadisticas = async () => {
    try {
      const data = await usuarioService.getEstadisticas();
      setEstadisticas(data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    }
  };

  useEffect(() => {
    cargarFormularios();
    cargarEstadisticas();
    
    // Actualizar estadísticas cada 60 segundos
    const intervalId = setInterval(() => {
      cargarEstadisticas();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    console.log('Cerrando sesión de admin');
    authService.logout();
    navigate('/login-admin');
  };

  // Guardar formulario (nuevo o editado)
  const handleGuardarFormulario = async (formulario: Formulario) => {
    try {
      let nuevoFormulario = formulario;
      if (formulario.id && formularios.some(f => f.id === formulario.id)) {
        // Actualizar encuesta existente
        const preguntasParaBackend = formulario.preguntas
          .filter(p => !p.editando && p.texto.trim() && p.respuestaCorrecta !== undefined)
          .map(p => ({
            texto: p.texto,
            respuestas: p.respuestas,
            respuestaCorrecta: p.respuestaCorrecta!,
          }));

        await encuestaService.updateEncuesta(formulario.id, {
          titulo: formulario.titulo,
          descripcion: formulario.descripcion || '',
          id_asignatura: formulario.asignatura || '',
          fecha_termino: formulario.fechaLimite || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          preguntas: preguntasParaBackend,
        });
        
        setFormularios((prev) =>
          prev.map((f) => (f.id === formulario.id ? { ...formulario } : f))
        );
      } else {
        // Crear nueva encuesta
        const preguntasParaBackend = formulario.preguntas
          .filter(p => !p.editando && p.texto.trim() && p.respuestaCorrecta !== undefined)
          .map(p => ({
            texto: p.texto,
            respuestas: p.respuestas,
            respuestaCorrecta: p.respuestaCorrecta!,
          }));

        const creado = await encuestaService.createEncuesta({
          titulo: formulario.titulo,
          descripcion: formulario.descripcion || '',
          id_asignatura: formulario.asignatura || '',
          fecha_termino: formulario.fechaLimite || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          preguntas: preguntasParaBackend,
        });
        
        nuevoFormulario = {
          ...formulario,
          id: creado.id,
          asignatura: creado.id_asignatura,
        };
        setFormularios((prev) => [...prev, nuevoFormulario]);
      }
      setFormularioSeleccionado(null);
    } catch (e) {
      console.error('Error al guardar formulario:', e);
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
          onRecargarFormularios={cargarFormularios}
          onGuardarFormulario={handleGuardarFormulario}
        />
      );
    }

    // Secciones del panel de administración
    switch (activeSection) {
      case 'Inicio':
        return <PanelInicio usuario={{
          id: "admin1",
          nombres: "Administrador",
          apellidos: "General",
          tipo: "admin",
          total_usuarios: estadisticas.total_usuarios,
          total_docentes: estadisticas.total_docentes,
          total_alumnos: estadisticas.total_alumnos,
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
      case 'Carga Masiva':
        return <CargaMasivaUsuarios />;
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
          <li onClick={() => setActiveSection('Carga Masiva')}>
            <UploadFileIcon className="menu-icon" /> Carga Masiva
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