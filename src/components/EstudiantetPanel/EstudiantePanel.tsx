import React, { useState, useEffect } from 'react';
import './EstudiantePanel.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { FormularioEstudiante } from './FormularioEstudiante/FormularioEstudiante';
import { Perfil } from '../Perfil/Perfil';
import { PanelInicio } from '../panel-incio/panel-inicio';
import { RespuestasEstudiante } from './RespuestasEstudiante/RespuestasEstudiante';

interface Alumno {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  tipo: 'alumno';
  id_carrera?: string;
  nombre_carrera?: string;
  año_ingreso?: string;
  asignaturas?: string[];
}

interface Pregunta {
  id: number;
  texto: string;
  respuestas: string[];
}

interface Formulario {
  id: number;
  titulo: string;
  preguntas: Pregunta[];
  asignatura?: string | null;
  fechaLimite?: string | null;
  enviado?: boolean;
  correccionHabilitada?: boolean;
  respuestasCorrectas?: { [idPregunta: number]: string };
}

interface RespuestaAlumno {
  idFormulario: number;
  respuestas: { [idPregunta: number]: string };
  fechaEnvio: string;
}

export const EstudiantePanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Inicio');
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<Formulario | null>(null);
  const [formularioRespondidoSeleccionado, setFormularioRespondidoSeleccionado] = useState<Formulario | null>(null);
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [respuestasAlumno, setRespuestasAlumno] = useState<RespuestaAlumno[]>([]);
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState<{ [key: number]: string }>({});

  const navigate = useNavigate();

  // Datos de prueba de alumno
  const alumnoUser: Alumno = {
    id: '3',
    nombres: 'Carlos Alberto',
    apellidos: 'Gómez Soto',
    rut: '20.345.678-9',
    email: 'carlos.gomez@alumnos.universidad.cl',
    tipo: 'alumno',
    id_carrera: 'ICI',
    nombre_carrera: 'Ingeniería Civil Informática',
    año_ingreso: '2021',
    asignaturas: ['Matemáticas', 'Programación', 'Bases de Datos', 'Física'],
  };

  // Cargar formularios desde localStorage
  useEffect(() => {
    const data = localStorage.getItem('formularios');
    if (data) {
      setFormularios(JSON.parse(data));
    }
    // Cargar respuestas del alumno desde localStorage
    const respuestas = localStorage.getItem(`respuestasAlumno_${alumnoUser.id}`);
    if (respuestas) {
      setRespuestasAlumno(JSON.parse(respuestas));
    }
  }, [alumnoUser.id]);

  // Guardar respuestas del alumno en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem(`respuestasAlumno_${alumnoUser.id}`, JSON.stringify(respuestasAlumno));
  }, [respuestasAlumno, alumnoUser.id]);

  const handleLogout = () => {
    navigate('/');
  };

  // Filtrar formularios activos para el estudiante
  const formulariosParaResponder = formularios.filter((formulario) => {
    if (!formulario.enviado) return false;
    if (!formulario.asignatura) return false;
    if (!alumnoUser.asignaturas?.includes(formulario.asignatura)) return false;
    if (!formulario.fechaLimite) return false;
    // Fecha límite
    const hoy = new Date();
    const fechaLimite = new Date(formulario.fechaLimite);
    if (fechaLimite < hoy) return false;
    // Ya respondido
    if (respuestasAlumno.some(r => r.idFormulario === formulario.id)) return false;
    return true;
  });

  // Formularios ya respondidos
  const formulariosRespondidos = formularios.filter((formulario) =>
    respuestasAlumno.some(r => r.idFormulario === formulario.id)
  );

  // Cuando el alumno responde y envía el formulario
  const handleEnviarRespuestas = (formulario: Formulario, respuestas: { [key: number]: string }) => {
    const nuevasRespuestas = [
      ...respuestasAlumno,
      {
        idFormulario: formulario.id,
        respuestas,
        fechaEnvio: new Date().toISOString(),
      }
    ];
    setRespuestasAlumno(nuevasRespuestas);
    localStorage.setItem(`respuestasAlumno_${alumnoUser.id}`, JSON.stringify(nuevasRespuestas));
    setFormularioSeleccionado(null);
    setRespuestasSeleccionadas({});
    setActiveSection('Ver Respuestas'); // Ir automáticamente a ver respuestas
  };

  const renderContent = () => {
    // Si está respondiendo un formulario
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
            onEnviar={() => {
              if (window.confirm("¿Estás seguro que quieres enviar tus respuestas? Una vez enviado no podrás modificarlo.")) {
                handleEnviarRespuestas(formularioSeleccionado, respuestasSeleccionadas);
              }
            }}
          />
        </div>
      );
    }

    // Si está viendo un formulario respondido
    if (activeSection === 'Ver Respuestas' && formularioRespondidoSeleccionado) {
      const respuestaAlumno = respuestasAlumno.find(
        r => r.idFormulario === formularioRespondidoSeleccionado.id
      );
      if (!respuestaAlumno) return null;
      return (
        <div>
          <button className="btn-retroceder" onClick={() => setFormularioRespondidoSeleccionado(null)}>
            Retroceder
          </button>
          <RespuestasEstudiante
            formulario={formularioRespondidoSeleccionado}
            respuestaAlumno={respuestaAlumno}
            mostrarCorrecion={!!formularioRespondidoSeleccionado.correccionHabilitada}
            respuestasCorrectas={formularioRespondidoSeleccionado.respuestasCorrectas || {}}
            expandido
          />
        </div>
      );
    }

    switch (activeSection) {
      case 'Inicio':
        return <PanelInicio usuario={{
          id: "1",
          nombres: "Juan Carlos",
          apellidos: "Pérez González",
          tipo: "alumno",
          nombre_carrera: "Ingeniería Civil Informática",
          semestre: "6° Semestre",
          asignaturas: ["Matemáticas", "Programación", "Bases de Datos"],
          año_ingreso: "2022",
        }} />;
      case 'Perfil':
        return (
          <Perfil
            usuario={alumnoUser}
            editable={true}
            onGuardar={(usuarioActualizado) => {
              console.log('Usuario actualizado:', usuarioActualizado);
              // Aquí iría la lógica para actualizar el usuario en tu backend
            }}
          />
        );
      case 'Responder Formulario':
        return (
          <div className="lista-formularios">
            <h2>Formularios para responder</h2>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
              {formulariosParaResponder.length === 0 && <p>No tienes formularios pendientes.</p>}
              {formulariosParaResponder.map((formulario) => (
                <div
                  key={formulario.id}
                  className="formulario-cuadro"
                  onClick={() => setFormularioSeleccionado(formulario)}
                >
                  <h3>{formulario.titulo}</h3>
                  <p><b>Asignatura:</b> {formulario.asignatura}</p>
                  <p><b>Fecha límite:</b> {formulario.fechaLimite ? new Date(formulario.fechaLimite).toLocaleDateString() : '-'}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Ver Respuestas':
        return (
          <div className="lista-formularios">
            <h2>Formularios respondidos</h2>
            {formulariosRespondidos.length === 0 && <p>No has respondido ningún formulario.</p>}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
              {formulariosRespondidos.map((formulario) => (
                <div
                  key={formulario.id}
                  className="formulario-cuadro"
                  onClick={() => setFormularioRespondidoSeleccionado(formulario)}
                  style={{ cursor: "pointer" }}
                >
                  <h3>{formulario.titulo}</h3>
                  <p><b>Asignatura:</b> {formulario.asignatura}</p>
                  <p><b>Fecha límite:</b> {formulario.fechaLimite ? new Date(formulario.fechaLimite).toLocaleDateString() : '-'}</p>
                </div>
              ))}
            </div>
          </div>
        );
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