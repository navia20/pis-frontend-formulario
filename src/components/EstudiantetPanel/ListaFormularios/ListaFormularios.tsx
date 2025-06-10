import React, { useEffect, useState } from 'react';
import { formularioEstudianteService } from '../../../services/formularioEstudianteService';
import { FormularioAlumno } from '../../../types/formularioAlumno';
import './ListaFormularios.css';

export const ListaFormularios: React.FC<{ onSeleccionar: (f: FormularioAlumno) => void; formulariosRespondidos: number[] }> = ({ onSeleccionar, formulariosRespondidos }) => {
  const [formularios, setFormularios] = useState<FormularioAlumno[]>([]);
  useEffect(() => {
    formularioEstudianteService.getFormularios().then(setFormularios);
  }, []);
  const pendientes = formularios.filter(f => !formulariosRespondidos.includes(f.id));
  return (
    <div className="alumno-formularios-lista">
      <h2 className="alumno-formularios-titulo-lista">Formularios para responder</h2>
      {pendientes.length === 0 && <p className="alumno-formularios-vacio">No tienes formularios pendientes.</p>}
      <div className="alumno-formularios-cards">
        {pendientes.map((formulario) => (
          <div
            key={formulario.id}
            className="alumno-formulario-cuadro"
            onClick={() => onSeleccionar(formulario)}
          >
            <div className="alumno-formulario-titulo">{formulario.titulo}</div>
            <div className="alumno-formulario-info">
              {formulario.asignatura && (
                <span className="alumno-formulario-asignatura">{formulario.asignatura}</span>
              )}
              {formulario.fechaLimite && (
                <span className="alumno-formulario-fecha">
                  Límite: {new Date(formulario.fechaLimite).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};