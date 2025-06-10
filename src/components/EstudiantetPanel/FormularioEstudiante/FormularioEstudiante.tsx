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
  onEnviar: () => void;
}

export const FormularioEstudiante: React.FC<FormularioEstudianteProps> = ({
  formulario,
  respuestasSeleccionadas,
  setRespuestasSeleccionadas,
  onEnviar
}) => {
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const manejarCambioRespuesta = (idPregunta: number, respuesta: string) => {
    setRespuestasSeleccionadas({
      ...respuestasSeleccionadas,
      [idPregunta]: respuesta,
    });
  };

  const manejarEnvioFormulario = () => {
    if (window.confirm("¿Estás seguro que quieres enviar tus respuestas? Una vez enviado no podrás modificarlo.")) {
      setMensajeEnviado(true);
      onEnviar();
    }
  };

  return (
    <div className="alumno-formulario-estudiante">
      <h1 className="alumno-formulario-estudiante-titulo">{formulario.titulo}</h1>
      <div className="alumno-formulario-preguntas-container">
        {formulario.preguntas.map((pregunta) => (
          <div key={pregunta.id} className="alumno-formulario-pregunta">
            <div className="alumno-formulario-pregunta-header">
              <h3>Pregunta {pregunta.id}</h3>
            </div>
            <p className="alumno-formulario-pregunta-texto">{pregunta.texto}</p>
            <div className="alumno-formulario-respuestas">
              {pregunta.respuestas.map((respuesta, index) => (
                <label
                  key={index}
                  className={`alumno-formulario-respuesta ${
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
      <button className="alumno-formulario-btn-enviar" onClick={manejarEnvioFormulario}>
        Enviar
      </button>
      {mensajeEnviado && <p className="alumno-formulario-mensaje-enviado">Formulario enviado con éxito</p>}
    </div>
  );
};