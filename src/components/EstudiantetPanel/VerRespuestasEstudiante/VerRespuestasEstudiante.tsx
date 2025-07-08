import React, { useEffect } from "react";
import "./VerRespuestasEstudiante.css";

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

interface RespuestasEstudianteProps {
  formulario: Formulario;
  respuestaAlumno: RespuestaAlumno;
  mostrarCorrecion?: boolean;
  respuestasCorrectas?: { [idPregunta: number]: string };
  expandido?: boolean;
}

export const RespuestasEstudiante: React.FC<RespuestasEstudianteProps> = ({
  formulario,
  respuestaAlumno,
  mostrarCorrecion = false,
  respuestasCorrectas = {},
}) => {
  
  useEffect(() => {
    console.log("Mostrando respuestas de formulario:", formulario);
    console.log("Respuestas del alumno:", respuestaAlumno);
    console.log("Respuestas correctas:", respuestasCorrectas);
    console.log("Mostrar corrección:", mostrarCorrecion);
  }, [formulario, respuestaAlumno, respuestasCorrectas, mostrarCorrecion]);
  
  return (
    <div className="alumno-verrespuestas-formulario">
      <div className="alumno-verrespuestas-header-row">
        <h1>Ver Formulario</h1>
        <div className="alumno-verrespuestas-header-options">
          <div>
            <label>Asignatura:&nbsp;</label>
            <span>{formulario.asignatura || '-'}</span>
          </div>
          <div style={{ marginLeft: 16 }}>
            <label>Fecha de envío:&nbsp;</label>
            <span>
              {respuestaAlumno.fechaEnvio
                ? new Date(respuestaAlumno.fechaEnvio).toLocaleDateString()
                : '-'}
            </span>
          </div>
        </div>
      </div>
      <div className="alumno-verrespuestas-titulo-container">
        <h2>{formulario.titulo}</h2>
      </div>
      <div className="alumno-verrespuestas-preguntas-container">
        {formulario.preguntas.map((pregunta) => {
          console.log(`Pregunta ${pregunta.id} - Respuesta del alumno:`, respuestaAlumno.respuestas[pregunta.id]);
          console.log(`Pregunta ${pregunta.id} - Respuesta correcta:`, respuestasCorrectas[pregunta.id]);
          
          return (
            <div key={pregunta.id} className="alumno-verrespuestas-pregunta">
              <div className="alumno-verrespuestas-pregunta-header">
                <h3>Pregunta {pregunta.id}</h3>
              </div>
              <textarea
                value={pregunta.texto}
                disabled
                className="alumno-verrespuestas-textarea"
                style={{ background: "#f4f4f4", color: "#333" }}
              />
              <div className="alumno-verrespuestas-respuestas">
                {pregunta.respuestas.map((respuesta, index) => {
                  const seleccionada = respuestaAlumno.respuestas[pregunta.id] === respuesta;
                  const esRespuestaCorrecta = respuestasCorrectas[pregunta.id] === respuesta;
                  
                  console.log(`Pregunta ${pregunta.id} - Opción ${index}: "${respuesta}" - Seleccionada: ${seleccionada}, Correcta: ${esRespuestaCorrecta}`);
                  
                  let style: React.CSSProperties = {
                    border: seleccionada ? "2px solid #27ae60" : undefined,
                    background: seleccionada ? "#eafaf1" : undefined,
                    marginRight: 8,
                    flex: 1,
                    color: seleccionada ? "#155724" : undefined,
                    fontWeight: seleccionada ? 600 : undefined,
                  };
                  
                  // Corrección visual si corresponde
                  if (mostrarCorrecion) {
                    if (esRespuestaCorrecta) {
                      style = {
                        ...style,
                        border: "2px solid #219653",
                        background: "#eafaf1",
                        color: "#219653",
                      };
                    } else if (seleccionada && !esRespuestaCorrecta) {
                      style = {
                        ...style,
                        border: "2px solid #c0392b",
                        background: "#fdecea",
                        color: "#c0392b",
                      };
                    }
                  }
                  
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 4,
                        width: "100%",
                      }}
                    >
                      <input
                        type="text"
                        value={respuesta}
                        disabled
                        className="alumno-verrespuestas-respuesta-input"
                        style={style}
                      />
                      {mostrarCorrecion && esRespuestaCorrecta && (
                        <span style={{ marginLeft: 8, color: "#219653", fontWeight: 600 }}>✔</span>
                      )}
                      {mostrarCorrecion && seleccionada && !esRespuestaCorrecta && (
                        <span style={{ marginLeft: 8, color: "#c0392b", fontWeight: 600 }}>✘</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};