import React, { useState } from 'react';
import './DocentePanel.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { Perfil } from '../Perfil/Perfil';
import { PanelInicio } from '../panel-incio/panel-inicio';
import { ListaAsignaturas } from './ListaAsignaturas/ListaAsignaturas';
import type { Usuario } from '../../types/usuario';

export const DocentePanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Inicio');
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState<string | null>(null);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<{ alumnoId: string, formularioId: number } | null>(null);
  const navigate = useNavigate();

  // Usa el tipo Usuario para evitar errores de tipo
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
              // Aquí iría la lógica para actualizar el usuario en tu backend
              console.log('Usuario actualizado:', usuarioActualizado);
            }}
          />
        );
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