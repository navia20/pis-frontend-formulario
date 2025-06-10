import React, { useEffect, useState } from 'react';
import { formularioEstudianteService } from '../../../services/formularioEstudianteService';
import { FormularioAlumno } from '../../../types/FormularioAlumno';
import './ListaFormularios.css';

export const ListaFormularios: React.FC<{ onSeleccionar: (f: FormularioAlumno) => void; formulariosRespondidos: number[] }> = ({ onSeleccionar, formulariosRespondidos }) => {
  const [formularios, setFormularios] = useState<FormularioAlumno[]>([]);
  useEffect(() => {
    formularioEstudianteService.getFormularios().then(setFormularios);
  }, []);
  const pendientes = formularios.filter(f => !formulariosRespondidos.includes(f.id));
  return (
    <div className="lista-formularios">
      <h2>Formularios para responder</h2>
      {pendientes.length === 0 && <p>No tienes formularios pendientes.</p>}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        {pendientes.map((formulario) => (
          <div
            key={formulario.id}
            className="formulario-cuadro"
            onClick={() => onSeleccionar(formulario)}
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