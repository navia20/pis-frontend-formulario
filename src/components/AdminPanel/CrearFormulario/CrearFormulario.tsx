import React, { useState, useEffect } from 'react';
import './CrearFormulario.css';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import type { Pregunta, Formulario } from '../../../types/formulario';
import { PreguntaEditor } from './PreguntaEditor/PreguntaEditor';
import { asignaturaService, Asignatura } from '../../../services/asignaturaService';

/**
 * Componente para crear o editar un formulario de preguntas.
 * - Compatible con integración backend (estructura de datos limpia).
 * - Usa subcomponente PreguntaEditor para cada pregunta.
 * - Buenas prácticas: hooks al inicio, props tipados, validaciones claras.
 * - Si soloLectura=true, todo es solo visualización.
 */

interface CrearFormularioProps {
  formulario: Formulario | null;
  setFormulario: React.Dispatch<React.SetStateAction<Formulario | null>>;
  onGuardar: (formulario: Formulario) => void;
  soloLectura?: boolean;
}

export const CrearFormulario: React.FC<CrearFormularioProps> = ({
  formulario,
  setFormulario,
  onGuardar,
  soloLectura = false,
}) => {
  // Hooks siempre al inicio
  const [editandoTitulo, setEditandoTitulo] = useState(
    formulario?.editandoTitulo ?? !soloLectura
  );
  const [errorTitulo, setErrorTitulo] = useState('');
  const [errorPregunta, setErrorPregunta] = useState<{ [id: string]: string }>({});
  const [errorFormulario, setErrorFormulario] = useState('');
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);

  // Cargar asignaturas del backend
  useEffect(() => {
    const cargarAsignaturas = async () => {
      try {
        const asignaturasData = await asignaturaService.getAsignaturas();
        setAsignaturas(asignaturasData);
      } catch (error) {
        console.error('Error cargando asignaturas:', error);
      }
    };
    cargarAsignaturas();
  }, []);

  // Validación: si no hay formulario, no renderizar nada
  if (!formulario) return null;

  // Desestructuración para claridad
  const { titulo, preguntas, asignatura, fechaLimite } = formulario;

  // Actualiza la fecha límite del formulario
  const actualizarFechaLimite = (nuevaFecha: string) => {
    if (soloLectura) return;
    setFormulario({
      ...formulario,
      fechaLimite: nuevaFecha,
    });
  };

  // Actualiza la asignatura seleccionada
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
      id: `pregunta_${preguntas.length + 1}_${Date.now()}`,
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
  const actualizarPregunta = (id: string, texto: string) => {
    if (soloLectura) return;
    setFormulario({
      ...formulario,
      preguntas: preguntas.map((pregunta: Pregunta) =>
        pregunta.id === id ? { ...pregunta, texto } : pregunta
      ),
    });
  };

  // Actualiza el texto de una respuesta de una pregunta
  const actualizarRespuesta = (id: string, index: number, texto: string) => {
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

  // Selecciona la respuesta correcta de una pregunta
  const seleccionarRespuestaCorrecta = (id: string, index: number) => {
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

  // Agrega una alternativa/respuesta a una pregunta
  const agregarAlternativa = (id: string) => {
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

  // Guarda una pregunta (valida antes)
  const guardarPregunta = (id: string) => {
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

  // Permite editar una pregunta ya guardada
  const editarPregunta = (id: string) => {
    if (soloLectura) return;
    setFormulario({
      ...formulario,
      preguntas: preguntas.map((pregunta: Pregunta) =>
        pregunta.id === id ? { ...pregunta, editando: true } : pregunta
      ),
    });
  };

  // Elimina una pregunta del formulario
  const eliminarPregunta = (id: string) => {
    if (soloLectura) return;
    setFormulario({
      ...formulario,
      preguntas: preguntas
        .filter((pregunta: Pregunta) => pregunta.id !== id)
        .map((pregunta: Pregunta, index: number) => ({ ...pregunta, id: `pregunta_${index + 1}` })),
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

  // Guarda el título (valida antes)
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

  // Guarda el formulario completo (valida antes)
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
    // TODO: Aquí puedes hacer la llamada al backend para guardar el formulario
    onGuardar(formulario);
  };

  return (
    <div className="cf-crear-formulario">
      {/* Header con asignatura y fecha */}
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
                {asignaturas.map((asig) => (
                  <option key={asig.id} value={asig.id}>{asig.nombre}</option>
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
      {/* Título editable */}
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
      {/* Lista de preguntas */}
      <div className="cf-preguntas-container">
        {preguntas.map((pregunta: Pregunta) => (
          <PreguntaEditor
            key={pregunta.id}
            pregunta={pregunta}
            soloLectura={soloLectura}
            error={errorPregunta[pregunta.id]}
            actualizarPregunta={actualizarPregunta}
            actualizarRespuesta={actualizarRespuesta}
            seleccionarRespuestaCorrecta={seleccionarRespuestaCorrecta}
            agregarAlternativa={agregarAlternativa}
            guardarPregunta={guardarPregunta}
            editarPregunta={editarPregunta}
            eliminarPregunta={eliminarPregunta}
          />
        ))}
      </div>
      {/* Acciones para agregar pregunta y guardar formulario */}
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