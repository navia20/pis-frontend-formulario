import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import type { Pregunta } from '../../../../types/formulario';
import './PreguntaEditor.css';

interface PreguntaEditorProps {
  pregunta: Pregunta;
  soloLectura: boolean;
  error: string;
  actualizarPregunta: (id: string, texto: string) => void;
  actualizarRespuesta: (id: string, index: number, texto: string) => void;
  seleccionarRespuestaCorrecta: (id: string, index: number) => void;
  agregarAlternativa: (id: string) => void;
  guardarPregunta: (id: string) => void;
  editarPregunta: (id: string) => void;
  eliminarPregunta: (id: string) => void;
}

export const PreguntaEditor: React.FC<PreguntaEditorProps> = ({
  pregunta,
  soloLectura,
  error,
  actualizarPregunta,
  actualizarRespuesta,
  seleccionarRespuestaCorrecta,
  agregarAlternativa,
  guardarPregunta,
  editarPregunta,
  eliminarPregunta,
}) => (
  <div className="cf-pregunta">
    <div className="cf-pregunta-header">
      <h3>Pregunta {pregunta.id}</h3>
      {!soloLectura && (
        <button
          className="cf-btn-eliminar"
          onClick={() => eliminarPregunta(pregunta.id)}
        >
          <DeleteIcon />
        </button>
      )}
    </div>
    <textarea
      value={pregunta.texto}
      onChange={(e) => actualizarPregunta(pregunta.id, e.target.value)}
      disabled={!pregunta.editando || soloLectura}
      placeholder="Escribe la pregunta aquí..."
      className="cf-textarea"
    />
    <div className="cf-respuestas">
      {pregunta.respuestas.map((respuesta, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <input
            type="text"
            value={respuesta}
            onChange={(e) =>
              actualizarRespuesta(pregunta.id, index, e.target.value)
            }
            placeholder={`Respuesta ${index + 1}`}
            disabled={!pregunta.editando || soloLectura}
            className={
              pregunta.respuestaCorrecta === index
                ? 'respuesta-correcta'
                : undefined
            }
            onClick={() =>
              pregunta.editando && !soloLectura
                ? seleccionarRespuestaCorrecta(pregunta.id, index)
                : undefined
            }
          />
          {pregunta.editando && !soloLectura && (
            <input
              type="radio"
              name={`respuesta-correcta-${pregunta.id}`}
              checked={pregunta.respuestaCorrecta === index}
              onChange={() =>
                seleccionarRespuestaCorrecta(pregunta.id, index)
              }
              style={{ accentColor: '#27ae60', marginLeft: 4 }}
            />
          )}
        </div>
      ))}
      {pregunta.editando && !soloLectura && (
        <button
          className="cf-btn-agregar-alternativa"
          onClick={() => agregarAlternativa(pregunta.id)}
        >
          <AddIcon /> Agregar Alternativa
        </button>
      )}
    </div>
    <div className="cf-pregunta-actions">
      {!soloLectura &&
        (pregunta.editando ? (
          <button
            className="cf-btn-guardar"
            onClick={() => guardarPregunta(pregunta.id)}
          >
            <SaveIcon />
          </button>
        ) : (
          <button
            className="cf-btn-editar"
            onClick={() => editarPregunta(pregunta.id)}
          >
            <EditIcon />
          </button>
        ))}
    </div>
    {error && (
      <div style={{ color: 'red', marginTop: 5 }}>
        {error}
      </div>
    )}
  </div>
);