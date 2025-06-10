import React, { useEffect, useState } from 'react';
import { formularioEstudianteService } from '../../../services/formularioEstudianteService';
import { FormularioAlumno } from '../../../types/formularioAlumno';
import './ListaFormulariosRespondidos.css';

export const ListaFormulariosRespondidos: React.FC<{ onSeleccionar: (f: FormularioAlumno) => void; formulariosRespondidos: number[] }> = ({ onSeleccionar, formulariosRespondidos }) => {
  const [formularios, setFormularios] = useState<FormularioAlumno[]>([]);
  useEffect(() => {
    formularioEstudianteService.getFormularios().then(setFormularios);
  }, []);
  const respondidos = formularios.filter(f => formulariosRespondidos.includes(f.id));
  return (
    <div className="alumno-respondidos-lista">
      <h2 className="alumno-respondidos-titulo-lista">Formularios respondidos</h2>
      {respondidos.length === 0 && <p className="alumno-respondidos-vacio">No has respondido ningún formulario.</p>}
      <div className="alumno-respondidos-cards">
        {respondidos.map((formulario) => (
          <div
            key={formulario.id}
            className="alumno-respondidos-cuadro"
            onClick={() => onSeleccionar(formulario)}
          >
            <div className="alumno-respondidos-titulo">{formulario.titulo}</div>
            <div className="alumno-respondidos-info"><b>Asignatura:</b> {formulario.asignatura}</div>
            <div className="alumno-respondidos-info"><b>Fecha límite:</b> {formulario.fechaLimite ? new Date(formulario.fechaLimite).toLocaleDateString() : '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};