import React, { useState, useEffect } from 'react';
import './DocentePanel.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { PerfilContainer } from '../Perfil/PerfilContainer';
import { PanelInicio } from '../panel-incio/panel-inicio';
import { ListaAsignaturas } from './ListaAsignaturas/ListaAsignaturas';
import { authService } from '../../services/authService';
import { docenteAsignaturaService } from '../../services/docenteAsignaturaService';
import type { Usuario, Docente } from '../../types/usuario';

export const DocentePanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Inicio');
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState<string | null>(null);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<{ alumnoId: string, formularioId: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docenteUser, setDocenteUser] = useState<Docente>({
    id: '',
    nombres: '',
    apellidos: '',
    rut: '',
    email: '',
    tipo: 'docente',
    asignaturas: []
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPerfilDocente = async () => {
      setLoading(true);
      try {
        // Verificar si el usuario está autenticado
        if (!authService.isAuthenticated()) {
          navigate('/');
          return;
        }
        
        // Obtener perfil del usuario
        const perfil = await authService.getProfile();
        console.log('Perfil completo del docente obtenido:', JSON.stringify(perfil, null, 2));
        
        if (perfil.tipo !== 'docente') {
          console.error('El usuario no es un docente');
          navigate('/');
          return;
        }
        
        // Obtener asignaturas del docente
        let asignaturasDocente: string[] = [];
        let totalEstudiantes = 0;
        try {
          console.log('Obteniendo asignaturas del docente...');
          asignaturasDocente = await docenteAsignaturaService.getAsignaturasDocente();
          console.log('Asignaturas obtenidas:', asignaturasDocente);
          
          // Obtener total de estudiantes únicos que han respondido formularios
          console.log('Obteniendo total de estudiantes...');
          let estudiantesUnicos = new Set<string>();
          
          for (const nombreAsignatura of asignaturasDocente) {
            try {
              const alumnos = await docenteAsignaturaService.getAlumnosConRespuestas(nombreAsignatura);
              alumnos.forEach(item => {
                if (item.alumno?.id) {
                  estudiantesUnicos.add(item.alumno.id);
                }
              });
            } catch (err) {
              console.warn(`Error al obtener datos de asignatura ${nombreAsignatura}:`, err);
            }
          }
          
          totalEstudiantes = estudiantesUnicos.size;
          console.log('Total de estudiantes únicos encontrados:', totalEstudiantes);
          
        } catch (err) {
          console.error('Error al obtener datos del docente:', err);
          // Fallback: usar datos del perfil si están disponibles
          asignaturasDocente = perfil.asignaturas || [];
        }
        
        // Actualizar estado con la información del docente
        const docenteData: Docente = {
          id: perfil.id || '',
          nombres: perfil.nombres || '',
          apellidos: perfil.apellidos || '',
          rut: perfil.rut || '',
          email: perfil.email || '',
          tipo: 'docente',
          asignaturas: asignaturasDocente,
          estudiantes_total: totalEstudiantes
        };
        
        console.log('Datos del docente procesados:', docenteData);
        setDocenteUser(docenteData);
        
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        setError('Error al cargar el perfil del usuario');
      } finally {
        setLoading(false);
      }
    };
    
    cargarPerfilDocente();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const renderContent = () => {
    if (alumnoSeleccionado) {
      // Detalle de respuestas de un alumno
      return (
        <ListaAsignaturas.VerRespuestasAlumno
          alumnoId={alumnoSeleccionado.alumnoId}
          formularioId={alumnoSeleccionado.formularioId}
          onBack={() => setAlumnoSeleccionado(null)}
        />
      );
    }
    if (asignaturaSeleccionada) {
      // Lista de estudiantes de la asignatura
      return (
        <ListaAsignaturas.ListaEstudiantes
          asignatura={asignaturaSeleccionada}
          onBack={() => setAsignaturaSeleccionada(null)}
          onSeleccionarAlumno={(alumnoId: string, formularioId: number) =>
            setAlumnoSeleccionado({ alumnoId, formularioId })
          }
        />
      );
    }
    
    // Mostrar loading o error si están presentes
    if (loading) {
      return <div className="loading-message">Cargando información del docente...</div>;
    }
    
    if (error) {
      return <div className="error-message">{error}</div>;
    }
    
    switch (activeSection) {
      case 'Inicio':
        return (
          <PanelInicio usuario={{
            id: docenteUser.id,
            nombres: docenteUser.nombres,
            apellidos: docenteUser.apellidos,
            tipo: "docente" as const,
            asignaturas: docenteUser.asignaturas || [],
            estudiantes_total: docenteUser.estudiantes_total || 0
          }} />
        );
      case 'Perfil':
        return <PerfilContainer />;
      case 'Ver Respuestas Estudiantes':
        return (
          <ListaAsignaturas
            onSeleccionarAsignatura={setAsignaturaSeleccionada}
          />
        );
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