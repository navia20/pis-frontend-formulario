import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { CrearFormulario } from '../CrearFormulario/CrearFormulario';
import { FormularioCard } from './FormularioCard/FormularioCard';
import type { Formulario } from '../../../types/formulario';
import './CuadroFormularios.css';

interface CuadroFormulariosProps {
  formularios: Formulario[];
  setFormularios: React.Dispatch<React.SetStateAction<Formulario[]>>;
  setFormularioSoloLectura: (formulario: Formulario | null) => void;
}

export const CuadroFormularios: React.FC<CuadroFormulariosProps> = ({
  formularios,
  setFormularios,
  setFormularioSoloLectura,
}) => {
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [formularioEnEdicion, setFormularioEnEdicion] = useState<Formulario | null>(null);

  const handleGuardarFormulario = (formulario: Formulario) => {
    if (formulario.id && formularios.some(f => f.id === formulario.id)) {
      setFormularios(prev =>
        prev.map(f => (f.id === formulario.id ? { ...formulario } : f))
      );
    } else {
      setFormularios(prev => [
        ...prev,
        {
          ...formulario,
          id: prev.length ? Math.max(...prev.map(f => f.id)) + 1 : 1,
          asignatura: formulario.asignatura || null,
          fechaLimite: formulario.fechaLimite || null,
          enviado: false,
          editandoTitulo: formulario.editandoTitulo ?? false,
        },
      ]);
    }
    setFormularioEnEdicion(null);
  };

  const handleEliminarFormulario = (id: number) => {
    setFormularios(prev => prev.filter(f => f.id !== id));
    setMenuAbierto(null);
    // TODO: Llamar a backend para eliminar si existe endpoint
  };

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

  const handleEnviarAsignatura = (id: number) => {
    const formulario = formularios.find(f => f.id === id);
    if (!formulario || !puedeEnviarFormulario(formulario)) return;
    // TODO: Llamar a backend para marcar como enviado
    setFormularios(prev =>
      prev.map(f => (f.id === id ? { ...f, enviado: true } : f))
    );
    setMenuAbierto(null);
  };

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
      {formularios.map(formulario => (
        <FormularioCard
          key={formulario.id}
          formulario={formulario}
          menuAbierto={menuAbierto}
          setMenuAbierto={setMenuAbierto}
          onEditar={() => {
            setFormularioEnEdicion({
              ...formulario,
              editandoTitulo: formulario.editandoTitulo ?? false,
            });
            setMenuAbierto(null);
          }}
          onEliminar={() => handleEliminarFormulario(formulario.id)}
          onEnviar={() => handleEnviarAsignatura(formulario.id)}
          onVer={() => {
            setFormularioSoloLectura(formulario);
            setMenuAbierto(null);
          }}
          puedeEnviar={puedeEnviarFormulario(formulario)}
        />
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
        aria-label="Crear nuevo formulario"
      >
        <AddIcon style={{ fontSize: 48 }} />
      </div>
    </div>
  );
};