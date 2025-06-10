import React from "react";
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
  return (
    <div className="cf-crear-formulario">
      <div className="cf-header-row">
        <h1>Ver Formulario</h1>
        <div className="cf-header-options">
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
      <div className="cf-titulo-container">
        <h2>{formulario.titulo}</h2>
      </div>
      <div className="cf-preguntas-container">
        {formulario.preguntas.map((pregunta) => (
          <div key={pregunta.id} className="cf-pregunta">
            <div className="cf-pregunta-header">
              <h3>Pregunta {pregunta.id}</h3>
            </div>
            <textarea
              value={pregunta.texto}
              disabled
              className="cf-textarea"
              style={{ background: "#f4f4f4", color: "#333" }}
            />
            <div className="cf-respuestas">
              {pregunta.respuestas.map((respuesta, index) => {
                const seleccionada = respuestaAlumno.respuestas[pregunta.id] === respuesta;
                let style: React.CSSProperties = {
                  border: seleccionada ? "2px solid #27ae60" : undefined,
                  background: seleccionada ? "#eafaf1" : undefined,
                  marginRight: 8,
                  flex: 1,
                  color: seleccionada ? "#155724" : undefined,
                  fontWeight: seleccionada ? 600 : undefined,
                };
                // Corrección visual si corresponde
                if (mostrarCorrecion && respuestasCorrectas[pregunta.id]) {
                  if (respuesta === respuestasCorrectas[pregunta.id]) {
                    style = {
                      ...style,
                      border: "2px solid #219653",
                      background: "#eafaf1",
                      color: "#219653",
                    };
                  } else if (seleccionada && respuesta !== respuestasCorrectas[pregunta.id]) {
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
                      className="cf-respuesta-input"
                      style={style}
                    />
                    {mostrarCorrecion &&
                      respuestasCorrectas[pregunta.id] &&
                      respuesta === respuestasCorrectas[pregunta.id] && (
                        <span style={{ marginLeft: 8, color: "#219653", fontWeight: 600 }}>✔</span>
                      )}
                    {mostrarCorrecion &&
                      respuestasCorrectas[pregunta.id] &&
                      seleccionada &&
                      respuesta !== respuestasCorrectas[pregunta.id] && (
                        <span style={{ marginLeft: 8, color: "#c0392b", fontWeight: 600 }}>✘</span>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};