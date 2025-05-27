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
  respuestaCorrecta?: number;
}

interface CrearFormularioProps {
  formulario: {
    id: number;
    titulo: string;
    preguntas: Pregunta[];
    asignatura?: string | null;
    fechaLimite?: string | null;
    enviado?: boolean;
    editandoTitulo?: boolean;
  };
  setFormulario: React.Dispatch<React.SetStateAction<any>>;
  onGuardar: (formulario: any) => void;
  soloLectura?: boolean;
}

export const CrearFormulario: React.FC<CrearFormularioProps> = ({
  formulario,
  setFormulario,
  onGuardar,
  soloLectura = false,
}) => {
  const { titulo, preguntas, asignatura, fechaLimite } = formulario;

  const [editandoTitulo, setEditandoTitulo] = useState(
    formulario.editandoTitulo ?? !soloLectura
  );
  const [errorTitulo, setErrorTitulo] = useState('');
  const [errorPregunta, setErrorPregunta] = useState<{ [id: number]: string }>({});
  const [errorFormulario, setErrorFormulario] = useState('');

  // Opciones de asignatura (simulado)
  const asignaturasDisponibles = [
    'Matemáticas',
    'Lenguaje',
    'Historia',
    'Ciencias',
    'Inglés',
  ];

  // NUEVO: Actualizar fecha límite
  const actualizarFechaLimite = (nuevaFecha: string) => {
    if (soloLectura) return;
    setFormulario({
      ...formulario,
      fechaLimite: nuevaFecha,
    });
  };

  // NUEVO: Actualizar asignatura
  const actualizarAsignatura = (nuevaAsignatura: string) => {
    if (soloLectura) return;
    setFormulario({
      ...formulario,
      asignatura: nuevaAsignatura,
    });
  };

  // Agrega una nueva pregunta al formulario
  const agregarPregunta = () => {
    if (soloLectura) return;
    const nuevaPregunta: Pregunta = {
      id: preguntas.length + 1,
      texto: '',
      respuestas: ['', '', '', ''],
      editando: true,
      respuestaCorrecta: undefined,
    };
    setFormulario({
      ...formulario,
      preguntas: [...preguntas, nuevaPregunta],
    });
  };

  // Actualiza el texto de una pregunta
  const actualizarPregunta = (id: number, texto: string) => {
    if (soloLectura) return;
    setFormulario({
      ...formulario,
      preguntas: preguntas.map((pregunta: Pregunta) =>
        pregunta.id === id ? { ...pregunta, texto } : pregunta
      ),
    });
  };

  // Actualiza el texto de una respuesta de una pregunta
  const actualizarRespuesta = (id: number, index: number, texto: string) => {
    if (soloLectura) return;
    setFormulario({
      ...formulario,
      preguntas: preguntas.map((pregunta: Pregunta) =>
        pregunta.id === id
          ? {
              ...pregunta,
              respuestas: pregunta.respuestas.map((respuesta, i) =>
                i === index ? texto : respuesta
              ),
            }
          : pregunta
      ),
    });
  };

  // Selecciona la respuesta correcta
  const seleccionarRespuestaCorrecta = (id: number, index: number) => {
    if (soloLectura) return;
    setFormulario({
      ...formulario,
      preguntas: preguntas.map((pregunta: Pregunta) =>
        pregunta.id === id
          ? { ...pregunta, respuestaCorrecta: index }
          : pregunta
      ),
    });
  };

  // Agrega una alternativa a una pregunta
  const agregarAlternativa = (id: number) => {
    if (soloLectura) return;
    setFormulario({
      ...formulario,
      preguntas: preguntas.map((pregunta: Pregunta) =>
        pregunta.id === id
          ? { ...pregunta, respuestas: [...pregunta.respuestas, ''] }
          : pregunta
      ),
    });
  };

  // Guarda una pregunta (deja de estar en modo edición)
  const guardarPregunta = (id: number) => {
    if (soloLectura) return;
    const pregunta = preguntas.find((p: Pregunta) => p.id === id);
    let error = '';
    if (!pregunta) return;
    if (!pregunta.texto.trim()) error = 'La pregunta no puede estar vacía.';
    else if (pregunta.respuestas.some((r) => !r.trim())) error = 'Todas las respuestas deben estar llenas.';
    else if (
      pregunta.respuestaCorrecta === undefined ||
      !pregunta.respuestas[pregunta.respuestaCorrecta] ||
      !pregunta.respuestas[pregunta.respuestaCorrecta].trim()
    )
      error = 'Debes seleccionar una respuesta correcta.';
    if (error) {
      setErrorPregunta((prev) => ({ ...prev, [id]: error }));
      return;
    }
    setErrorPregunta((prev) => ({ ...prev, [id]: '' }));
    setFormulario({
      ...formulario,
      preguntas: preguntas.map((pregunta: Pregunta) =>
        pregunta.id === id ? { ...pregunta, editando: false } : pregunta
      ),
    });
  };

  // Permite editar una pregunta
  const editarPregunta = (id: number) => {
    if (soloLectura) return;
    setFormulario({
      ...formulario,
      preguntas: preguntas.map((pregunta: Pregunta) =>
        pregunta.id === id ? { ...pregunta, editando: true } : pregunta
      ),
    });
  };

  // Elimina una pregunta y reordena los IDs
  const eliminarPregunta = (id: number) => {
    if (soloLectura) return;
    setFormulario({
      ...formulario,
      preguntas: preguntas
        .filter((pregunta: Pregunta) => pregunta.id !== id)
        .map((pregunta: Pregunta, index: number) => ({ ...pregunta, id: index + 1 })),
    });
  };

  // Actualiza el título del formulario
  const actualizarTitulo = (nuevoTitulo: string) => {
    if (soloLectura) return;
    setFormulario({
      ...formulario,
      titulo: nuevoTitulo,
      editandoTitulo: true,
    });
  };

  // Guarda el título (deja de estar en modo edición)
  const guardarTitulo = () => {
    if (soloLectura) return;
    if (!titulo.trim()) {
      setErrorTitulo('El título no puede estar vacío.');
      return;
    }
    setErrorTitulo('');
    setEditandoTitulo(false);
    setFormulario({
      ...formulario,
      editandoTitulo: false,
    });
  };

  // Permite editar el título
  const editarTitulo = () => {
    if (soloLectura) return;
    setEditandoTitulo(true);
    setFormulario({
      ...formulario,
      editandoTitulo: true,
    });
  };

  // Guarda el formulario completo y vuelve a la lista de formularios
  const guardarFormularioCompleto = () => {
    if (soloLectura) return;
    if (!titulo.trim()) {
      setErrorFormulario('El título no puede estar vacío.');
      return;
    }
    if (preguntas.length === 0) {
      setErrorFormulario('Debe haber al menos una pregunta.');
      return;
    }
    if (!formulario.asignatura) {
      setErrorFormulario('Debes seleccionar una asignatura.');
      return;
    }
    if (!formulario.fechaLimite) {
      setErrorFormulario('Debes seleccionar una fecha límite.');
      return;
    }
    setErrorFormulario('');
    onGuardar(formulario);
  };

  return (
    <div className="cf-crear-formulario">
      <div className="cf-header-row">
        <h1>{soloLectura ? 'Ver Formulario' : 'Crear Formulario'}</h1>
        <div className="cf-header-options">
          <div>
            <label>Asignatura:&nbsp;</label>
            {soloLectura ? (
              <span>{asignatura || '-'}</span>
            ) : (
              <select
                value={asignatura || ''}
                onChange={e => actualizarAsignatura(e.target.value)}
                disabled={soloLectura}
              >
                <option value="">Selecciona</option>
                {asignaturasDisponibles.map((asig) => (
                  <option key={asig} value={asig}>{asig}</option>
                ))}
              </select>
            )}
          </div>
          <div style={{ marginLeft: 16 }}>
            <label>Fecha límite:&nbsp;</label>
            {soloLectura ? (
              <span>{fechaLimite ? new Date(fechaLimite).toLocaleDateString() : '-'}</span>
            ) : (
              <input
                type="date"
                value={fechaLimite || ''}
                onChange={e => actualizarFechaLimite(e.target.value)}
                disabled={soloLectura}
              />
            )}
          </div>
        </div>
      </div>
      <div className="cf-titulo-container">
        {editandoTitulo && !soloLectura ? (
          <input
            type="text"
            placeholder="Nombre de la asignatura"
            value={titulo}
            onChange={(e) => actualizarTitulo(e.target.value)}
            className="cf-titulo-input"
            disabled={soloLectura}
          />
        ) : (
          <h2>{titulo}</h2>
        )}
        {!soloLectura && (
          <button
            className="cf-btn-titulo"
            onClick={editandoTitulo ? guardarTitulo : editarTitulo}
          >
            {editandoTitulo ? <SaveIcon /> : <EditIcon />}
          </button>
        )}
      </div>
      {errorTitulo && <div style={{ color: 'red', marginBottom: 10 }}>{errorTitulo}</div>}
      <div className="cf-preguntas-container">
        {preguntas.map((pregunta: Pregunta) => (
          <div key={pregunta.id} className="cf-pregunta">
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
                    style={{
                      border:
                        pregunta.respuestaCorrecta === index
                          ? '2px solid #27ae60'
                          : undefined,
                      background:
                        pregunta.respuestaCorrecta === index
                          ? '#eafaf1'
                          : undefined,
                      marginRight: 8,
                      flex: 1,
                    }}
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
            {errorPregunta[pregunta.id] && (
              <div style={{ color: 'red', marginTop: 5 }}>
                {errorPregunta[pregunta.id]}
              </div>
            )}
          </div>
        ))}
      </div>
      {!soloLectura && (
        <>
          <div className="cf-btn-agregar-container">
            <button className="cf-btn-agregar" onClick={agregarPregunta}>
              <AddIcon /> Agregar Pregunta
            </button>
          </div>
          <div className="cf-btn-guardar-formulario-container">
            <button className="cf-btn-guardar-formulario" onClick={guardarFormularioCompleto}>
              Guardar Formulario Completo
            </button>
          </div>
          {errorFormulario && (
            <div style={{ color: 'red', marginTop: 10 }}>{errorFormulario}</div>
          )}
        </>
      )}
    </div>
  );
};