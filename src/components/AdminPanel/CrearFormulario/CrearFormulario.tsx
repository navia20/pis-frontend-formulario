import React, { useState } from 'react';
import './CrearFormulario.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

interface Pregunta {
  id: number;
  texto: string;
  respuestas: string[];
  editando: boolean;
}

export const CrearFormulario: React.FC = () => {
  const [titulo, setTitulo] = useState('');
  const [editandoTitulo, setEditandoTitulo] = useState(true);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

  const agregarPregunta = () => {
    const nuevaPregunta: Pregunta = {
      id: preguntas.length + 1,
      texto: '',
      respuestas: ['', '', '', ''], // 4 alternativas por defecto
      editando: true,
    };
    setPreguntas([...preguntas, nuevaPregunta]);
  };

  const actualizarPregunta = (id: number, texto: string) => {
    setPreguntas(
      preguntas.map((pregunta) =>
        pregunta.id === id ? { ...pregunta, texto } : pregunta
      )
    );
  };

  const actualizarRespuesta = (id: number, index: number, texto: string) => {
    setPreguntas(
      preguntas.map((pregunta) =>
        pregunta.id === id
          ? {
              ...pregunta,
              respuestas: pregunta.respuestas.map((respuesta, i) =>
                i === index ? texto : respuesta
              ),
            }
          : pregunta
      )
    );
  };

  const agregarAlternativa = (id: number) => {
    setPreguntas(
      preguntas.map((pregunta) =>
        pregunta.id === id
          ? { ...pregunta, respuestas: [...pregunta.respuestas, ''] }
          : pregunta
      )
    );
  };

  const guardarPregunta = (id: number) => {
    setPreguntas(
      preguntas.map((pregunta) =>
        pregunta.id === id ? { ...pregunta, editando: false } : pregunta
      )
    );
  };

  const editarPregunta = (id: number) => {
    setPreguntas(
      preguntas.map((pregunta) =>
        pregunta.id === id ? { ...pregunta, editando: true } : pregunta
      )
    );
  };

  const eliminarPregunta = (id: number) => {
    setPreguntas(
      preguntas
        .filter((pregunta) => pregunta.id !== id)
        .map((pregunta, index) => ({ ...pregunta, id: index + 1 }))
    );
  };

  const guardarTitulo = () => {
    setEditandoTitulo(false);
  };

  const editarTitulo = () => {
    setEditandoTitulo(true);
  };

  return (
    <div className="crear-formulario">
      <h1>Crear Formulario</h1>
      <div className="titulo-container">
        {editandoTitulo ? (
          <input
            type="text"
            placeholder="Nombre de la asignatura"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="titulo-input"
          />
        ) : (
          <h2>{titulo}</h2>
        )}
        <button
          className="btn-titulo"
          onClick={editandoTitulo ? guardarTitulo : editarTitulo}
        >
          {editandoTitulo ? <SaveIcon /> : <EditIcon />}
        </button>
      </div>
      <div className="preguntas-container">
        {preguntas.map((pregunta) => (
          <div key={pregunta.id} className="pregunta">
            <div className="pregunta-header">
              <h3>Pregunta {pregunta.id}</h3>
              <button
                className="btn-eliminar"
                onClick={() => eliminarPregunta(pregunta.id)}
              >
                <DeleteIcon />
              </button>
            </div>
            <textarea
              value={pregunta.texto}
              onChange={(e) => actualizarPregunta(pregunta.id, e.target.value)}
              disabled={!pregunta.editando}
              placeholder="Escribe la pregunta aquí..."
            />
            <div className="respuestas">
              {pregunta.respuestas.map((respuesta, index) => (
                <input
                  key={index}
                  type="text"
                  value={respuesta}
                  onChange={(e) =>
                    actualizarRespuesta(pregunta.id, index, e.target.value)
                  }
                  placeholder={`Respuesta ${index + 1}`}
                  disabled={!pregunta.editando}
                />
              ))}
              {pregunta.editando && (
                <button
                  className="btn-agregar-alternativa"
                  onClick={() => agregarAlternativa(pregunta.id)}
                >
                  <AddIcon /> Agregar Alternativa
                </button>
              )}
            </div>
            <div className="pregunta-actions">
              {pregunta.editando ? (
                <button
                  className="btn-guardar"
                  onClick={() => guardarPregunta(pregunta.id)}
                >
                  <SaveIcon />
                </button>
              ) : (
                <button
                  className="btn-editar"
                  onClick={() => editarPregunta(pregunta.id)}
                >
                  <EditIcon />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="btn-agregar-container">
        <button className="btn-agregar" onClick={agregarPregunta}>
          <AddIcon /> Agregar Pregunta
        </button>
      </div>
    </div>
  );
};