import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CrearFormulario } from '../CrearFormulario/CrearFormulario';

interface Pregunta {
  id: number;
  texto: string;
  respuestas: string[];
  editando: boolean;
  respuestaCorrecta?: number;
}

interface Formulario {
  id: number;
  titulo: string;
  preguntas: Pregunta[];
  asignatura?: string | null;
  fechaLimite?: string | null;
  enviado?: boolean;
  editandoTitulo?: boolean;
}

interface CuadroFormulariosProps {
  formularios: Formulario[];
  setFormularios: React.Dispatch<React.SetStateAction<Formulario[]>>;
  setFormularioSeleccionado: (formulario: Formulario | null) => void;
  setFormularioSoloLectura: (formulario: Formulario | null) => void;
}

export const CuadroFormularios: React.FC<CuadroFormulariosProps> = ({
  formularios,
  setFormularios,
  setFormularioSeleccionado,
  setFormularioSoloLectura,
}) => {
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [formularioEnEdicion, setFormularioEnEdicion] = useState<Formulario | null>(null);

  // Guardar formulario (nuevo o editado)
  const handleGuardarFormulario = (formulario: Formulario) => {
    if (formulario.id && formularios.some(f => f.id === formulario.id)) {
      setFormularios((prev) =>
        prev.map((f) => (f.id === formulario.id ? { ...formulario } : f))
      );
    } else {
      setFormularios((prev) => [
        ...prev,
        {
          ...formulario,
          id: prev.length ? Math.max(...prev.map((f) => f.id)) + 1 : 1,
          asignatura: formulario.asignatura || null,
          fechaLimite: formulario.fechaLimite || null,
          enviado: false,
          editandoTitulo: formulario.editandoTitulo ?? false,
        },
      ]);
    }
    setFormularioEnEdicion(null);
  };

  // Eliminar formulario
  const handleEliminarFormulario = (id: number) => {
    setFormularios((prev) => prev.filter((f) => f.id !== id));
    setMenuAbierto(null);
  };

  // Validar si el formulario está listo para enviar
  const puedeEnviarFormulario = (formulario: Formulario) => {
    if (!formulario.titulo.trim()) return false;
    if (formulario.editandoTitulo) return false;
    if (!formulario.preguntas.length) return false;
    if (!formulario.asignatura) return false;
    if (!formulario.fechaLimite) return false;
    for (const pregunta of formulario.preguntas) {
      if (pregunta.editando) return false;
      if (!pregunta.texto.trim()) return false;
    }
    return true;
  };

  // Enviar a asignatura (simulado)
  const handleEnviarAsignatura = (id: number) => {
    const formulario = formularios.find((f) => f.id === id);
    if (!formulario || !puedeEnviarFormulario(formulario)) return;
    // Aquí podrías hacer la petición a la API para guardar definitivamente el formulario
    setFormularios((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, enviado: true } : f
      )
    );
    setMenuAbierto(null);
  };

  // Render
  if (formularioEnEdicion) {
    return (
      <div>
        <button
          className="admin-btn-retroceder"
          onClick={() => setFormularioEnEdicion(null)}
        >
          Cancelar
        </button>
        <CrearFormulario
          formulario={formularioEnEdicion}
          setFormulario={setFormularioEnEdicion}
          onGuardar={handleGuardarFormulario}
        />
      </div>
    );
  }

  return (
    <div className="admin-formularios-lista">
      {formularios.map((formulario) => (
        <div key={formulario.id} className="admin-formulario-cuadro">
          <div className="admin-formulario-titulo">{formulario.titulo}</div>
          <div className="admin-formulario-info">
            {formulario.asignatura && (
              <span className="admin-formulario-asignatura">
                {formulario.asignatura}
              </span>
            )}
            {formulario.fechaLimite && (
              <span className="admin-formulario-fecha">
                Límite: {new Date(formulario.fechaLimite).toLocaleDateString()}
              </span>
            )}
          </div>
          <button
            className="admin-formulario-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenuAbierto(menuAbierto === formulario.id ? null : formulario.id);
            }}
          >
            <MoreVertIcon />
          </button>
          {menuAbierto === formulario.id && (
            <div className="admin-formulario-menu">
              <button
                onClick={() => {
                  setFormularioEnEdicion({
                    ...formulario,
                    editandoTitulo: formulario.editandoTitulo ?? false,
                  });
                  setMenuAbierto(null);
                }}
                disabled={formulario.enviado}
              >
                Editar
              </button>
              <button onClick={() => handleEliminarFormulario(formulario.id)}>
                Eliminar
              </button>
              {formulario.asignatura && (
                <button
                  onClick={() => handleEnviarAsignatura(formulario.id)}
                  disabled={formulario.enviado || !puedeEnviarFormulario(formulario)}
                  title={
                    !puedeEnviarFormulario(formulario)
                      ? 'Debes guardar el título, asignatura, fecha límite y todas las preguntas antes de enviar'
                      : undefined
                  }
                >
                  Enviar a Asignatura
                </button>
              )}
              {formulario.enviado && (
                <button
                  onClick={() => {
                    setFormularioSoloLectura(formulario);
                    setMenuAbierto(null);
                  }}
                >
                  Ver Formulario
                </button>
              )}
            </div>
          )}
          {formulario.enviado && (
            <div className="admin-formulario-enviado">Enviado</div>
          )}
        </div>
      ))}
      <div
        className="admin-formulario-cuadro admin-formulario-cuadro-nuevo"
        onClick={() =>
          setFormularioEnEdicion({
            id: 0,
            titulo: '',
            preguntas: [],
            asignatura: null,
            fechaLimite: null,
            enviado: false,
            editandoTitulo: true,
          })
        }
      >
        <AddIcon style={{ fontSize: 48 }} />
      </div>
    </div>
  );
};