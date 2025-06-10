import React, { useEffect, useState } from 'react';
import { formularioDocenteService } from '../../../services/formularioDocenteService';
import { FormularioDocente, RespuestaAlumno } from '../../../types/formularioDocente';
import './ListaEstudiantes.css';

export const ListaEstudiantes: React.FC<{
  asignatura: string;
  onBack: () => void;
  onSeleccionarAlumno: (alumnoId: string, formularioId: number) => void;
}> = ({ asignatura, onBack, onSeleccionarAlumno }) => {
  const [formularios, setFormularios] = useState<FormularioDocente[]>([]);
  const [respuestas, setRespuestas] = useState<RespuestaAlumno[]>([]);

  useEffect(() => {
    formularioDocenteService.getFormularios().then(setFormularios);
    formularioDocenteService.getRespuestas().then(setRespuestas);
  }, []);

  const formulariosAsignatura = formularios.filter(f => f.asignatura === asignatura);
  const respuestasAsignatura = respuestas.filter(r =>
    formulariosAsignatura.some(f => f.id === r.idFormulario)
  );
  const alumnos = Array.from(
    new Set(respuestasAsignatura.map(r => r.alumnoId))
  );

  return (
    <div className="lista-estudiantes">
      <button className="btn-retroceder" onClick={onBack}>Retroceder</button>
      <h2>{asignatura}</h2>
      <div className="lista-estudiantes-cards">
        {alumnos.map(alumnoId => {
          const respuesta = respuestasAsignatura.find(r => r.alumnoId === alumnoId);
          if (!respuesta) return null;
          const alumnoNombre = respuesta.alumnoNombre;
          return formulariosAsignatura
            .filter(f => respuestasAsignatura.some(r => r.alumnoId === alumnoId && r.idFormulario === f.id))
            .map(f => (
              <div
                key={f.id + '-' + alumnoId}
                className="estudiante-cuadro"
                onClick={() => onSeleccionarAlumno(alumnoId, f.id)}
              >
                <strong>{alumnoNombre}</strong>
                <div>{f.titulo}</div>
              </div>
            ));
        })}
      </div>
    </div>
  );
};