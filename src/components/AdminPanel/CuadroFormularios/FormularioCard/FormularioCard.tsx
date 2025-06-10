import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { Formulario } from '../../../../types/formulario';
import { FormularioMenu } from '../FormularioMenu/FormularioMenu';
import './FormularioCard.css';

interface FormularioCardProps {
  formulario: Formulario;
  menuAbierto: number | null;
  setMenuAbierto: (id: number | null) => void;
  onEditar: () => void;
  onEliminar: () => void;
  onEnviar: () => void;
  onVer: () => void;
  puedeEnviar: boolean;
}

export const FormularioCard: React.FC<FormularioCardProps> = ({
  formulario,
  menuAbierto,
  setMenuAbierto,
  onEditar,
  onEliminar,
  onEnviar,
  onVer,
  puedeEnviar,
}) => (
  <div className="admin-formulario-cuadro">
    <div className="admin-formulario-titulo">{formulario.titulo}</div>
    <div className="admin-formulario-info">
      {formulario.asignatura && (
        <span className="admin-formulario-asignatura">{formulario.asignatura}</span>
      )}
      {formulario.fechaLimite && (
        <span className="admin-formulario-fecha">
          Límite: {new Date(formulario.fechaLimite).toLocaleDateString()}
        </span>
      )}
    </div>
    <button
      className="admin-formulario-menu-btn"
      aria-label="Opciones"
      onClick={e => {
        e.stopPropagation();
        setMenuAbierto(menuAbierto === formulario.id ? null : formulario.id);
      }}
    >
      <MoreVertIcon />
    </button>
    {menuAbierto === formulario.id && (
      <FormularioMenu
        formulario={formulario}
        onEditar={onEditar}
        onEliminar={onEliminar}
        onEnviar={onEnviar}
        onVer={onVer}
        puedeEnviar={puedeEnviar}
      />
    )}
    {formulario.enviado && (
      <div className="admin-formulario-enviado">Enviado</div>
    )}
  </div>
);