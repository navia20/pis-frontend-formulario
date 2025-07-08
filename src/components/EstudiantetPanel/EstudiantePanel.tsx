import React, { useState, useEffect } from 'react';
import './EstudiantePanel.css';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { FormularioEstudiante } from './FormularioEstudiante/FormularioEstudiante';
import { PerfilContainer } from '../Perfil/PerfilContainer';
import { PanelInicio } from '../panel-incio/panel-inicio';
import { RespuestasEstudiante } from './VerRespuestasEstudiante/VerRespuestasEstudiante';
import { FormularioAlumno } from '../../types/formularioAlumno';
import { ListaFormularios } from './ListaFormularios/ListaFormularios';
import { ListaFormulariosRespondidos } from './ListaFormulariosRespondidos/ListaFormulariosRespondidos';
import { authService } from '../../services/authService';
import { respuestaEstudianteService } from '../../services/respuestaEstudianteService';

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

// Función para obtener el nombre de la carrera por ID
const obtenerNombreCarrera = (idCarrera: string): string => {
  const id = idCarrera.toString();
  
  if (id.includes('6864a7a75e81cd0a3fadf92e')) {
    return 'Ingeniería Civil Industrial';
  } else if (id.includes('6864a7bd5e81cd0a3fadf930')) {
    return 'Ingeniería Civil en Computación e Informática';
  } else if (id.includes('6864a7d35e81cd0a3fadf932')) {
    return 'Ingeniería en Tecnologías de Información';
  } else {
    console.log('ID de carrera no reconocido:', idCarrera);
    return 'Carrera no identificada';
  }
};

export const EstudiantePanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('Inicio');
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<FormularioAlumno | null>(null);
  const [formularioRespondidoSeleccionado, setFormularioRespondidoSeleccionado] = useState<FormularioAlumno | null>(null);
  const [respuestasAlumno, setRespuestasAlumno] = useState<RespuestaAlumno[]>([]);
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para almacenar la información del alumno desde el backend
  const [alumnoUser, setAlumnoUser] = useState<Alumno>({
    id: '',
    nombres: '',
    apellidos: '',
    rut: '',
    email: '',
    tipo: 'alumno',
    id_carrera: '',
    nombre_carrera: '',
    año_ingreso: '',
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  // Cuando el alumno responde y envía el formulario
  const handleEnviarRespuestas = async (formulario: FormularioAlumno, respuestas: { [key: number]: string }) => {
    try {
      // Convertir las respuestas al formato que espera el backend
      const respuestasParaBackend: { [idPregunta: string]: string } = {};
      Object.keys(respuestas).forEach(key => {
        respuestasParaBackend[key] = respuestas[parseInt(key)];
      });

      console.log('Enviando respuestas al backend:', {
        id_encuesta: formulario.idOriginal || formulario.id.toString(),
        respuestas: respuestasParaBackend
      });

      // Enviar respuestas al backend
      const respuestaGuardada = await respuestaEstudianteService.enviarRespuesta({
        id_encuesta: formulario.idOriginal || formulario.id.toString(), // Usar ID original si está disponible
        respuestas: respuestasParaBackend
      });

      console.log('Respuesta guardada en el backend:', respuestaGuardada);

      // Procesar ID de encuesta para asegurar que sea consistente
      let idFormulario: number;
      try {
        idFormulario = parseInt(respuestaGuardada.id_encuesta);
        if (isNaN(idFormulario)) {
          console.warn(`ID de encuesta no es un número válido: ${respuestaGuardada.id_encuesta}`);
          // Usar el string como base para un hash numérico
          idFormulario = respuestaGuardada.id_encuesta.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        }
      } catch (e) {
        console.warn(`Error al procesar ID de encuesta: ${respuestaGuardada.id_encuesta}`, e);
        idFormulario = respuestaGuardada.id_encuesta.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      }
      
      console.log(`ID procesado para nueva respuesta: ${idFormulario} (original: ${respuestaGuardada.id_encuesta})`);

      // Actualizar el estado local con la respuesta del backend
      const nuevaRespuesta = {
        idFormulario: idFormulario,
        respuestas,
        fechaEnvio: respuestaGuardada.fecha_envio,
      };
      
      console.log('Nueva respuesta añadida al estado local:', nuevaRespuesta);
      setRespuestasAlumno([...respuestasAlumno, nuevaRespuesta]);
      
      // Recargar las respuestas desde el backend para asegurar sincronización
      const respuestasActualizadas = await respuestaEstudianteService.obtenerRespuestasAlumno();
      
      const respuestasFormateadas = respuestasActualizadas.map(resp => {
        // Procesar ID de encuesta para asegurar que sea consistente
        let idForm: number;
        try {
          idForm = parseInt(resp.id_encuesta);
          if (isNaN(idForm)) {
            idForm = resp.id_encuesta.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          }
        } catch (e) {
          idForm = resp.id_encuesta.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        }
        
        // Convertir IDs de preguntas de string a number en las respuestas
        const respFormateadas = Object.keys(resp.respuestas).reduce((acc, key) => {
          try {
            const keyNum = parseInt(key);
            acc[isNaN(keyNum) ? key.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : keyNum] = resp.respuestas[key];
          } catch (e) {
            acc[key.split('').reduce((a, c) => a + c.charCodeAt(0), 0)] = resp.respuestas[key];
          }
          return acc;
        }, {} as { [key: number]: string });
        
        return {
          idFormulario: idForm,
          respuestas: respFormateadas,
          fechaEnvio: resp.fecha_envio
        };
      });
      
      console.log('Respuestas actualizadas desde el backend:', respuestasFormateadas);
      setRespuestasAlumno(respuestasFormateadas);
      
      setFormularioSeleccionado(null);
      setRespuestasSeleccionadas({});
      setActiveSection('Ver Respuestas'); // Ir automáticamente a ver respuestas
      
      alert('Respuestas enviadas correctamente');
    } catch (error: any) {
      console.error('Error al enviar respuestas:', error);
      alert('Error al enviar respuestas: ' + error.message);
    }
  };

  // Cargar perfil del alumno al iniciar
  useEffect(() => {
    const cargarPerfilAlumno = async () => {
      setLoading(true);
      try {
        // Verificar si el usuario está autenticado
        if (!authService.isAuthenticated()) {
          navigate('/');
          return;
        }
        
        // Obtener perfil del usuario
        const perfil = await authService.getProfile();
        console.log('Perfil completo obtenido:', JSON.stringify(perfil, null, 2));
        console.log('ID de carrera en perfil:', perfil.id_carrera);
        console.log('Tipo de id_carrera:', typeof perfil.id_carrera);
        
        if (perfil.tipo !== 'alumno') {
          console.error('El usuario no es un alumno');
          navigate('/');
          return;
        }
        
        // Si hay un ID de carrera, obtener el nombre de la carrera
        let nombreCarrera = '';
        let asignaturasAlumno: string[] = [];
        
        if (perfil.id_carrera) {
          console.log('ID de carrera encontrado:', perfil.id_carrera);
          
          nombreCarrera = obtenerNombreCarrera(perfil.id_carrera);
          
          console.log('Nombre de carrera asignado:', nombreCarrera);
        } else {
          console.log('No se encontró ID de carrera en el perfil');
          nombreCarrera = 'Sin carrera asignada';
        }
        
        // Obtener las asignaturas del alumno
        try {
          asignaturasAlumno = await authService.getAsignaturasAlumno();
        } catch (err) {
          console.error('Error al obtener asignaturas del alumno:', err);
        }
        
        // Cargar respuestas previas del alumno
        try {
          const respuestasGuardadas = await respuestaEstudianteService.obtenerRespuestasAlumno();
          console.log('Respuestas guardadas obtenidas del backend:', respuestasGuardadas);
          
          const respuestasFormateadas = respuestasGuardadas.map(resp => {
            console.log(`Procesando respuesta para encuesta ID: ${resp.id_encuesta}`);
            
            // Procesar ID de encuesta para asegurar que sea consistente
            let idFormulario: number;
            try {
              idFormulario = parseInt(resp.id_encuesta);
              if (isNaN(idFormulario)) {
                console.warn(`ID de encuesta no es un número válido: ${resp.id_encuesta}`);
                // Usar el string como base para un hash numérico
                idFormulario = resp.id_encuesta.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
              }
            } catch (e) {
              console.warn(`Error al procesar ID de encuesta: ${resp.id_encuesta}`, e);
              idFormulario = resp.id_encuesta.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            }
            
            console.log(`ID procesado para respuesta: ${idFormulario} (original: ${resp.id_encuesta})`);
            
            // Convertir IDs de preguntas de string a number en las respuestas
            const respuestasFormateadas = Object.keys(resp.respuestas).reduce((acc, key) => {
              try {
                const keyNum = parseInt(key);
                acc[isNaN(keyNum) ? key.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : keyNum] = resp.respuestas[key];
              } catch (e) {
                console.warn(`Error al procesar ID de pregunta: ${key}`, e);
                // Si hay error, usar el string como está
                acc[key.split('').reduce((a, c) => a + c.charCodeAt(0), 0)] = resp.respuestas[key];
              }
              return acc;
            }, {} as { [key: number]: string });
            
            return {
              idFormulario: idFormulario,
              respuestas: respuestasFormateadas,
              fechaEnvio: resp.fecha_envio
            };
          });
          
          console.log('Respuestas formateadas para el estado local:', respuestasFormateadas);
          setRespuestasAlumno(respuestasFormateadas);
        } catch (err) {
          console.error('Error al cargar respuestas del alumno:', err);
        }
        
        // Actualizar estado con la información del alumno
        const alumnoData = {
          id: perfil.id || '',
          nombres: perfil.nombres || '',
          apellidos: perfil.apellidos || '',
          rut: perfil.rut || '',
          email: perfil.email || '',
          tipo: 'alumno' as const,
          id_carrera: perfil.id_carrera || '',
          nombre_carrera: nombreCarrera,
          año_ingreso: perfil.año_ingreso ? perfil.año_ingreso.toString() : 'No especificado',
          asignaturas: asignaturasAlumno
        };
        
        console.log('Datos del alumno procesados:', alumnoData);
        setAlumnoUser(alumnoData);
        
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        setError('Error al cargar el perfil del usuario');
      } finally {
        setLoading(false);
      }
    };
    
    cargarPerfilAlumno();
  }, [navigate]);



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
      // Intentar encontrar la respuesta exacta por ID
      let respuestaAlumno = respuestasAlumno.find(
        r => r.idFormulario === formularioRespondidoSeleccionado.id
      );
      
      console.log('Formulario respondido seleccionado:', formularioRespondidoSeleccionado);
      console.log('Respuesta encontrada por ID exacto:', respuestaAlumno);
      
      // Si no se encuentra por ID exacto, intentar buscar por otras coincidencias
      if (!respuestaAlumno && respuestasAlumno.length > 0) {
        // Buscar por similitud en IDs o títulos
        const posiblesRespuestas = respuestasAlumno.filter(r => {
          // Verificar si el ID como string contiene parte del ID del formulario o viceversa
          const idFormString = formularioRespondidoSeleccionado.id.toString();
          const idRespString = r.idFormulario.toString();
          
          return idFormString.includes(idRespString) || 
                 idRespString.includes(idFormString);
        });
        
        console.log('Posibles respuestas encontradas por similitud:', posiblesRespuestas);
        
        if (posiblesRespuestas.length > 0) {
          // Usar la primera coincidencia
          respuestaAlumno = posiblesRespuestas[0];
          console.log('Usando respuesta alternativa:', respuestaAlumno);
        }
      }
      
      console.log('Todas las respuestas del alumno:', respuestasAlumno);
      
      if (!respuestaAlumno) {
        console.error(`No se encontró la respuesta para el formulario con ID ${formularioRespondidoSeleccionado.id}`);
        
        // Intentar cargar las respuestas frescas del backend
        const intentarCargarRespuestaDirecta = async () => {
          try {
            const respuestaDirecta = await respuestaEstudianteService.verificarRespuestaExistente(
              formularioRespondidoSeleccionado.id.toString()
            );
            
            if (respuestaDirecta) {
              console.log('Respuesta encontrada directamente del backend:', respuestaDirecta);
              
              // Formatear la respuesta para el componente
              const respuestasFormateadas = Object.keys(respuestaDirecta.respuestas).reduce((acc, key) => {
                try {
                  const keyNum = parseInt(key);
                  acc[isNaN(keyNum) ? key.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : keyNum] = respuestaDirecta.respuestas[key];
                } catch (e) {
                  acc[key.split('').reduce((a, c) => a + c.charCodeAt(0), 0)] = respuestaDirecta.respuestas[key];
                }
                return acc;
              }, {} as { [key: number]: string });
              
              const respuestaFormateada = {
                idFormulario: formularioRespondidoSeleccionado.id,
                respuestas: respuestasFormateadas,
                fechaEnvio: respuestaDirecta.fecha_envio
              };
              
              // Actualizar el estado y mostrar el formulario con respuestas
              setRespuestasAlumno([...respuestasAlumno, respuestaFormateada]);
              
              return (
                <div>
                  <button className="btn-retroceder" onClick={() => setFormularioRespondidoSeleccionado(null)}>
                    Retroceder
                  </button>
                  <RespuestasEstudiante
                    formulario={formularioRespondidoSeleccionado}
                    respuestaAlumno={respuestaFormateada}
                    mostrarCorrecion={!!formularioRespondidoSeleccionado.correccionHabilitada}
                    respuestasCorrectas={formularioRespondidoSeleccionado.respuestasCorrectas || {}}
                    expandido
                  />
                </div>
              );
            }
          } catch (error) {
            console.error('Error al intentar cargar respuesta directa:', error);
          }
          
          return (
            <div>
              <button className="btn-retroceder" onClick={() => setFormularioRespondidoSeleccionado(null)}>
                Retroceder
              </button>
              <div className="error-message">
                No se encontraron respuestas para este formulario. Es posible que haya un problema de sincronización de IDs.
                <p>ID del formulario: {formularioRespondidoSeleccionado.id}</p>
                <p>Título: {formularioRespondidoSeleccionado.titulo}</p>
              </div>
            </div>
          );
        };
        
        return intentarCargarRespuestaDirecta();
      }
      
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
        if (loading) {
          return <div className="loading">Cargando información del estudiante...</div>;
        }
        if (error) {
          return <div className="error">{error}</div>;
        }
        return <PanelInicio usuario={{
          id: alumnoUser.id,
          nombres: alumnoUser.nombres,
          apellidos: alumnoUser.apellidos,
          tipo: "alumno",
          nombre_carrera: alumnoUser.nombre_carrera,
          asignaturas: alumnoUser.asignaturas,
          año_ingreso: alumnoUser.año_ingreso,
        }} />;
      case 'Perfil':
        return <PerfilContainer />;
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