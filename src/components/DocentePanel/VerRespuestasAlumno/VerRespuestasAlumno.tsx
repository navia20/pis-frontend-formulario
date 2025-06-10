import React, { useEffect, useState } from 'react';
import { formularioDocenteService } from '../../../services/formularioDocenteService';
import { FormularioDocente, RespuestaAlumno } from '../../../types/formularioDocente';
import './VerRespuestasAlumno.css';

export const VerRespuestasAlumno: React.FC<{
  alumnoId: string;
  formularioId: number;
  onBack: () => void;
}> = ({ alumnoId, formularioId, onBack }) => {
  const [formulario, setFormulario] = useState<FormularioDocente | null>(null);
  const [respuestaAlumno, setRespuestaAlumno] = useState<RespuestaAlumno | null>(null);

  useEffect(() => {
    formularioDocenteService.getFormularios().then(formularios => {
      setFormulario(formularios.find(f => f.id === formularioId) || null);
    });
    formularioDocenteService.getRespuestas().then(respuestas => {
      setRespuestaAlumno(respuestas.find(r => r.idFormulario === formularioId && r.alumnoId === alumnoId) || null);
    });
  }, [alumnoId, formularioId]);

  if (!formulario || !respuestaAlumno) return null;

  const mostrarCorrecion = formulario.correccionHabilitada ?? true;

  return (
    <div className="ver-respuestas-alumno">
      <button className="btn-retroceder" onClick={onBack}>Retroceder</button>
      <h2>
        {respuestaAlumno.alumnoNombre} - {formulario.titulo}
      </h2>
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
};