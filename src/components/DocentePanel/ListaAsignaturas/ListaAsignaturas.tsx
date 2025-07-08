import React, { useEffect, useState } from 'react';
import { docenteAsignaturaService } from '../../../services/docenteAsignaturaService';
import { FormularioDocente, RespuestaAlumno } from '../../../types/formularioDocente';
import './ListaAsignaturas.css';
import { ListaEstudiantes } from './../ListaEstudiantes/ListaEstudiantes';
import { VerRespuestasAlumno } from './../VerRespuestasAlumno/VerRespuestasAlumno';

export const ListaAsignaturas: React.FC<{ onSeleccionarAsignatura: (asig: string) => void }> & {
  ListaEstudiantes: typeof ListaEstudiantes;
  VerRespuestasAlumno: typeof VerRespuestasAlumno;
} = ({ onSeleccionarAsignatura }) => {
  const [formularios, setFormularios] = useState<FormularioDocente[]>([]);
  const [asignaturas, setAsignaturas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        // Obtener asignaturas del docente directamente
        const asignaturasDocente = await docenteAsignaturaService.getAsignaturasDocente();
        setAsignaturas(asignaturasDocente);
        
        // Obtener formularios para estas asignaturas
        const formulariosDocente = await docenteAsignaturaService.getFormulariosDocente();
        setFormularios(formulariosDocente);
      } catch (err) {
        console.error('Error al cargar datos de asignaturas:', err);
        setError('Error al cargar las asignaturas. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  // Usando el estado de asignaturas que obtenemos de la API

  if (loading) {
    return <div className="loading-message">Cargando asignaturas...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="lista-asignaturas">
      <h2>Asignaturas</h2>
      {asignaturas.length === 0 ? (
        <div className="empty-message">No tiene asignaturas asignadas.</div>
      ) : (
        <div className="lista-asignaturas-cards">
          {asignaturas.map(asig => {
            // Contar formularios para esta asignatura
            const formulariosAsignatura = formularios.filter(f => f.asignatura === asig).length;
            
            return (
              <div
                key={asig}
                className="asignatura-cuadro"
                onClick={() => onSeleccionarAsignatura(asig)}
              >
                <strong>{asig}</strong>
                <div>
                  {formulariosAsignatura} formulario(s)
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

ListaAsignaturas.ListaEstudiantes = ListaEstudiantes;
ListaAsignaturas.VerRespuestasAlumno = VerRespuestasAlumno;