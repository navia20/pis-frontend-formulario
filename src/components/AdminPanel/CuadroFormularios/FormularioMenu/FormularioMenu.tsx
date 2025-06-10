import React from 'react';
import type { Formulario } from '../../../../types/formulario';
import './FormularioMenu.css';

interface FormularioMenuProps {
  formulario: Formulario;
  onEditar: () => void;
  onEliminar: () => void;
  onEnviar: () => void;
  onVer: () => void;
  puedeEnviar: boolean;
}

export const FormularioMenu: React.FC<FormularioMenuProps> = ({
  formulario,
  onEditar,
  onEliminar,
  onEnviar,
  onVer,
  puedeEnviar,
}) => (
  <div className="admin-formulario-menu">
    <button onClick={onEditar} disabled={formulario.enviado}>Editar</button>
    <button onClick={onEliminar}>Eliminar</button>
    {formulario.asignatura && (
      <button
        onClick={onEnviar}
        disabled={formulario.enviado || !puedeEnviar}
        title={
          !puedeEnviar
            ? 'Debes guardar el título, asignatura, fecha límite y todas las preguntas antes de enviar'
            : undefined
        }
      >
        Enviar a Asignatura
      </button>
    )}
    {formulario.enviado && (
      <button onClick={onVer}>Ver Formulario</button>
    )}
  </div>
);