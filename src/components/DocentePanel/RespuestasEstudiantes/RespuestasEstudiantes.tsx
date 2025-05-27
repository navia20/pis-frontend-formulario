import React, { useState, useEffect } from 'react';
import './RespuestasEstudiantes.css';

// Interfaces base
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
  alumnoId: string;
  alumnoNombre: string;
}

// Utilidades para sincronizar corrección
const getCorreccionHabilitada = (): { [formularioId: number]: boolean } => {
  return JSON.parse(localStorage.getItem('correccionHabilitada') || '{}');
};
const setCorreccionHabilitada = (obj: { [formularioId: number]: boolean }) => {
  localStorage.setItem('correccionHabilitada', JSON.stringify(obj));
};

export const RespuestasEstudiantes: React.FC = () => {
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState<string | null>(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<string | null>(null);
  const [formularioSeleccionado, setFormularioSeleccionado] = useState<number | null>(null);
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [respuestas, setRespuestas] = useState<RespuestaAlumno[]>([]);
  const [correccionHabilitada, setCorreccionHabilitadaState] = useState<{ [formularioId: number]: boolean }>(getCorreccionHabilitada());

  // Cargar formularios y respuestas reales
  useEffect(() => {
    const formulariosLS = localStorage.getItem('formularios');
    setFormularios(formulariosLS ? JSON.parse(formulariosLS) : []);
    // Buscar todas las respuestas de todos los alumnos
    const respuestasTotales: RespuestaAlumno[] = [];
    for (let key in localStorage) {
      if (key.startsWith('respuestasAlumno_')) {
        const alumnoId = key.replace('respuestasAlumno_', '');
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        arr.forEach((r: any) => {
          respuestasTotales.push({
            ...r,
            alumnoId,
            alumnoNombre: localStorage.getItem(`nombreAlumno_${alumnoId}`) || `Alumno ${alumnoId}`,
          });
        });
      }
    }
    setRespuestas(respuestasTotales);
  }, []);

  // Actualizar corrección en localStorage y estado
  const toggleCorreccion = (formularioId: number) => {
    const nuevo = { ...correccionHabilitada, [formularioId]: !correccionHabilitada[formularioId] };
    setCorreccionHabilitada(nuevo);
    setCorreccionHabilitadaState(nuevo);
  };

  // Agrupar por asignatura
  const asignaturas = Array.from(
    new Set(formularios.map(f => f.asignatura).filter(Boolean))
  ) as string[];

  // Mostrar formulario respondido de un estudiante
  if (formularioSeleccionado && estudianteSeleccionado) {
    const respuestaAlumno = respuestas.find(
      r => r.idFormulario === formularioSeleccionado && r.alumnoId === estudianteSeleccionado
    );
    const formulario = formularios.find(f => f.id === formularioSeleccionado);
    if (!respuestaAlumno || !formulario) return null;
    const mostrarCorrecion = correccionHabilitada[formulario.id] ?? true; // Por defecto true para docente

    return (
      <div className="respuestas-estudiantes">
        <button className="btn-retroceder" onClick={() => setFormularioSeleccionado(null)}>
          Retroceder
        </button>
        <h2>
          {respuestaAlumno.alumnoNombre} - {formulario.titulo}
        </h2>
        <div style={{ marginBottom: 16 }}>
          <label>
            <input
              type="checkbox"
              checked={mostrarCorrecion}
              onChange={() => toggleCorreccion(formulario.id)}
            />{' '}
            Habilitar corrección para estudiantes
          </label>
        </div>
        <div className="preguntas-container">
          {formulario.preguntas.map((pregunta) => {
            const respuesta = respuestaAlumno.respuestas[pregunta.id];
            const correcta = formulario.respuestasCorrectas?.[pregunta.id];
            return (
              <div key={pregunta.id} className="pregunta">
                <div className="pregunta-header">
                  <h3>Pregunta {pregunta.id}</h3>
                </div>
                <p className="pregunta-texto">{pregunta.texto}</p>
                <div className="respuestas">
                  {pregunta.respuestas.map((opcion, idx) => {
                    let clase = "respuesta";
                    if (respuesta === opcion) {
                      if (mostrarCorrecion && correcta) {
                        clase +=
                          respuesta === correcta
                            ? " seleccionada respuesta-correcta"
                            : " seleccionada respuesta-incorrecta";
                      } else {
                        clase += " seleccionada";
                      }
                    }
                    if (mostrarCorrecion && correcta && opcion === correcta) {
                      clase += " respuesta-correcta";
                    }
                    return (
                      <label
                        key={idx}
                        className={clase}
                        style={{
                          pointerEvents: "none",
                          opacity: respuesta === opcion ? 1 : 0.7,
                        }}
                      >
                        <input
                          type="radio"
                          name={`pregunta-${pregunta.id}`}
                          value={opcion}
                          checked={respuesta === opcion}
                          readOnly
                          tabIndex={-1}
                        />
                        {opcion}
                        {mostrarCorrecion && correcta && opcion === correcta && (
                          <span style={{ marginLeft: 8, color: "#219653", fontWeight: 600 }}>✔</span>
                        )}
                        {mostrarCorrecion && correcta && respuesta === opcion && respuesta !== correcta && (
                          <span style={{ marginLeft: 8, color: "#c0392b", fontWeight: 600 }}>✘</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Mostrar estudiantes de la asignatura seleccionada
  if (asignaturaSeleccionada) {
    // Buscar formularios de esa asignatura
    const formulariosAsignatura = formularios.filter(f => f.asignatura === asignaturaSeleccionada);
    // Buscar respuestas de alumnos para esos formularios
    const respuestasAsignatura = respuestas.filter(r =>
      formulariosAsignatura.some(f => f.id === r.idFormulario)
    );
    // Agrupar por alumno
    const alumnos = Array.from(
      new Set(respuestasAsignatura.map(r => r.alumnoId))
    );
    return (
      <div className="respuestas-estudiantes">
        <button className="btn-retroceder" onClick={() => setAsignaturaSeleccionada(null)}>
          Retroceder
        </button>
        <h2>{asignaturaSeleccionada}</h2>
        <div className="lista-respuestas">
          {alumnos.map((alumnoId) => {
            const respuesta = respuestasAsignatura.find(r => r.alumnoId === alumnoId);
            if (!respuesta) return null;
            const alumnoNombre = respuesta.alumnoNombre;
            // Mostrar todos los formularios respondidos por este alumno en esta asignatura
            return formulariosAsignatura
              .filter(f => respuestasAsignatura.some(r => r.alumnoId === alumnoId && r.idFormulario === f.id))
              .map(f => (
                <div
                  key={f.id + '-' + alumnoId}
                  className="respuesta-cuadro"
                  onClick={() => {
                    setEstudianteSeleccionado(alumnoId);
                    setFormularioSeleccionado(f.id);
                  }}
                >
                  <strong>{alumnoNombre}</strong>
                  <div>{f.titulo}</div>
                </div>
              ));
          })}
        </div>
      </div>
    );
  }

  // Mostrar cuadros de asignaturas
  return (
    <div className="respuestas-estudiantes">
      <h2>Asignaturas</h2>
      <div className="lista-respuestas">
        {asignaturas.map((asig) => (
          <div
            key={asig}
            className="respuesta-cuadro"
            onClick={() => setAsignaturaSeleccionada(asig)}
          >
            <strong>{asig}</strong>
            <div>
              {respuestas.filter(r => {
                const f = formularios.find(fm => fm.id === r.idFormulario);
                return f && f.asignatura === asig;
              }).length} respuesta(s)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};