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
    <button onClick={onEditar} disabled={formulario.publicado}>
      Editar
    </button>
    <button onClick={onEliminar} disabled={formulario.publicado}>
      Eliminar
    </button>
    {formulario.asignatura && (
      <button
        onClick={onEnviar}
        disabled={!puedeEnviar && !formulario.publicado}
        title={
          !puedeEnviar && !formulario.publicado
            ? 'Debes guardar el título, asignatura, fecha límite y todas las preguntas antes de enviar'
            : undefined
        }
      >
        {formulario.publicado ? '❌ Despublicar' : '📢 Publicar'}
      </button>
    )}
    <button onClick={onVer}>Ver Formulario</button>
  </div>
);