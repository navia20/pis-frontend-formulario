import React, { useState } from 'react';
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
import { RespuestasEstudiante } from './VerRespuestasEstudiante/VerRespuestasEstudiante';
import { FormularioAlumno } from '../../types/formularioAlumno';
import { ListaFormularios } from './ListaFormularios/ListaFormularios';
import { ListaFormulariosRespondidos } from './ListaFormulariosRespondidos/ListaFormulariosRespondidos';

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

interface RespuestaAlumno {
  idFormulario: number;
  respuestas: { [idPregunta: number]: string };
  fechaEnvio: string;
}

export const EstudiantePanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Inicio');
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<FormularioAlumno | null>(null);
  const [formularioRespondidoSeleccionado, setFormularioRespondidoSeleccionado] = useState<FormularioAlumno | null>(null);
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

  const handleLogout = () => {
    navigate('/');
  };

  // Cuando el alumno responde y envía el formulario
  const handleEnviarRespuestas = (formulario: FormularioAlumno, respuestas: { [key: number]: string }) => {
    const nuevasRespuestas = [
      ...respuestasAlumno,
      {
        idFormulario: formulario.id,
        respuestas,
        fechaEnvio: new Date().toISOString(),
      }
    ];
    setRespuestasAlumno(nuevasRespuestas);
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
          <ListaFormularios
            onSeleccionar={setFormularioSeleccionado}
            formulariosRespondidos={respuestasAlumno.map(r => r.idFormulario)}
          />
        );
      case 'Ver Respuestas':
        return (
          <ListaFormulariosRespondidos
            onSeleccionar={setFormularioRespondidoSeleccionado}
            formulariosRespondidos={respuestasAlumno.map(r => r.idFormulario)}
          />
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