import React, { useEffect, useState } from 'react';
import { formularioDocenteService } from '../../../services/formularioDocenteService';
import { FormularioDocente, RespuestaAlumno } from '../../../types/formularioDocente';
import './ListaAsignaturas.css';
import { ListaEstudiantes } from './../ListaEstudiantes/ListaEstudiantes';
import { VerRespuestasAlumno } from './../VerRespuestasAlumno/VerRespuestasAlumno';

export const ListaAsignaturas: React.FC<{ onSeleccionarAsignatura: (asig: string) => void }> & {
  ListaEstudiantes: typeof ListaEstudiantes;
  VerRespuestasAlumno: typeof VerRespuestasAlumno;
} = ({ onSeleccionarAsignatura }) => {
  const [formularios, setFormularios] = useState<FormularioDocente[]>([]);
  const [respuestas, setRespuestas] = useState<RespuestaAlumno[]>([]);

  useEffect(() => {
    formularioDocenteService.getFormularios().then(setFormularios);
    formularioDocenteService.getRespuestas().then(setRespuestas);
  }, []);

  const asignaturas = Array.from(
    new Set(formularios.map(f => f.asignatura).filter(Boolean))
  ) as string[];

  return (
    <div className="lista-asignaturas">
      <h2>Asignaturas</h2>
      <div className="lista-asignaturas-cards">
        {asignaturas.map(asig => (
          <div
            key={asig}
            className="asignatura-cuadro"
            onClick={() => onSeleccionarAsignatura(asig)}
          >
            <strong>{asig}</strong>
            <div>
              {respuestas.filter(r => {
                const f = formularios.find(fm => fm.id === r.idFormulario);
                return f && f.asignatura === asig;
              }).length} respuesta(s)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ListaAsignaturas.ListaEstudiantes = ListaEstudiantes;
ListaAsignaturas.VerRespuestasAlumno = VerRespuestasAlumno;