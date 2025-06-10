import React, { useEffect, useState } from 'react';
import { formularioEstudianteService } from '../../../services/formularioEstudianteService';
import { FormularioAlumno } from '../../../types/FormularioAlumno';
import './ListaFormulariosRespondidos.css';

export const ListaFormulariosRespondidos: React.FC<{ onSeleccionar: (f: FormularioAlumno) => void; formulariosRespondidos: number[] }> = ({ onSeleccionar, formulariosRespondidos }) => {
  const [formularios, setFormularios] = useState<FormularioAlumno[]>([]);
  useEffect(() => {
    formularioEstudianteService.getFormularios().then(setFormularios);
  }, []);
  const respondidos = formularios.filter(f => formulariosRespondidos.includes(f.id));
  return (
    <div className="lista-formularios">
      <h2>Formularios respondidos</h2>
      {respondidos.length === 0 && <p>No has respondido ningún formulario.</p>}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        {respondidos.map((formulario) => (
          <div
            key={formulario.id}
            className="formulario-cuadro"
            onClick={() => onSeleccionar(formulario)}
            style={{ cursor: "pointer" }}
          >
            <h3>{formulario.titulo}</h3>
            <p><b>Asignatura:</b> {formulario.asignatura}</p>
            <p><b>Fecha límite:</b> {formulario.fechaLimite ? new Date(formulario.fechaLimite).toLocaleDateString() : '-'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};