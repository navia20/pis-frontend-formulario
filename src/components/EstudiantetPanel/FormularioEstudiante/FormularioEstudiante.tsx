import React, { useState } from 'react';
import './FormularioEstudiante.css';

interface Pregunta {
  id: number;
  texto: string;
  respuestas: string[];
}

interface FormularioEstudianteProps {
  formulario: {
    titulo: string;
    preguntas: Pregunta[];
  };
  respuestasSeleccionadas: { [key: number]: string };
  setRespuestasSeleccionadas: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
}

export const FormularioEstudiante: React.FC<FormularioEstudianteProps> = ({
  formulario,
  respuestasSeleccionadas,
  setRespuestasSeleccionadas,
}) => {
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const manejarCambioRespuesta = (idPregunta: number, respuesta: string) => {
    setRespuestasSeleccionadas({
      ...respuestasSeleccionadas,
      [idPregunta]: respuesta,
    });
  };

  const manejarEnvioFormulario = () => {
    setMensajeEnviado(true);
    console.log('Respuestas enviadas:', respuestasSeleccionadas);
  };

  return (
    <div className="formulario-estudiante">
      <h1>{formulario.titulo}</h1>
      <div className="preguntas-container">
        {formulario.preguntas.map((pregunta) => (
          <div key={pregunta.id} className="pregunta">
            <div className="pregunta-header">
              <h3>Pregunta {pregunta.id}</h3>
            </div>
            <p className="pregunta-texto">{pregunta.texto}</p>
            <div className="respuestas">
              {pregunta.respuestas.map((respuesta, index) => (
                <label
                  key={index}
                  className={`respuesta ${
                    respuestasSeleccionadas[pregunta.id] === respuesta ? 'seleccionada' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`pregunta-${pregunta.id}`}
                    value={respuesta}
                    checked={respuestasSeleccionadas[pregunta.id] === respuesta}
                    onChange={() => manejarCambioRespuesta(pregunta.id, respuesta)}
                  />
                  {respuesta}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="btn-enviar" onClick={manejarEnvioFormulario}>
        Enviar
      </button>
      {mensajeEnviado && <p className="mensaje-enviado">Formulario enviado con éxito</p>}
    </div>
  );
};