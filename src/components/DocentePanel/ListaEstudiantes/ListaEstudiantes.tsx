import React, { useEffect, useState } from 'react';
import { docenteAsignaturaService } from '../../../services/docenteAsignaturaService';
import { FormularioDocente } from '../../../types/formularioDocente';
import './ListaEstudiantes.css';

// Definimos una interfaz para los alumnos con sus formularios
interface AlumnoConFormularios {
  alumno: {
    id: string;
    nombres: string;
    apellidos: string;
    rut: string;
    email: string;
  } | null; // Permitir null para casos donde no se pudo obtener la información
  formularios: FormularioDocente[];
}

export const ListaEstudiantes: React.FC<{
  asignatura: string;
  onBack: () => void;
  onSeleccionarAlumno: (alumnoId: string, formularioId: number) => void;
}> = ({ asignatura, onBack, onSeleccionarAlumno }) => {
  const [alumnosConRespuestas, setAlumnosConRespuestas] = useState<AlumnoConFormularios[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        console.log('🔍 Cargando alumnos con respuestas para:', asignatura);
        
        // Obtener alumnos que han respondido formularios en esta asignatura
        const alumnos = await docenteAsignaturaService.getAlumnosConRespuestas(asignatura);
        setAlumnosConRespuestas(alumnos);
        
        console.log('✅ Alumnos con respuestas cargados:', alumnos.length);
        
      } catch (err) {
        console.error('❌ Error al cargar datos de estudiantes:', err);
        setError('Error al cargar los estudiantes. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [asignatura]);

  if (loading) {
    return (
      <div className="lista-estudiantes">
        <button className="btn-retroceder" onClick={onBack}>Retroceder</button>
        <h2>{asignatura}</h2>
        <div className="loading-message">Cargando estudiantes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lista-estudiantes">
        <button className="btn-retroceder" onClick={onBack}>Retroceder</button>
        <h2>{asignatura}</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="lista-estudiantes">
      <button className="btn-retroceder" onClick={onBack}>Retroceder</button>
      <h2>{asignatura}</h2>
      
      {alumnosConRespuestas.length === 0 ? (
        <div className="empty-message">No hay respuestas de estudiantes para esta asignatura.</div>
      ) : (
        <div className="lista-estudiantes-cards">
          {alumnosConRespuestas.map((item) => {
            const { alumno, formularios } = item;
            
            // Validar que el alumno no sea null
            if (!alumno || !alumno.id) {
              console.warn('⚠️ Alumno con datos nulos encontrado:', item);
              return null;
            }
            
            // Para cada alumno, mostrar todos los formularios que ha respondido
            return formularios.map(formulario => (
              <div
                key={`${alumno.id}-${formulario.id}`}
                className="estudiante-cuadro"
                onClick={() => {
                  console.log('🎯 Seleccionando alumno:', {
                    alumnoId: alumno.id,
                    formularioId: formulario.id,
                    formularioTitulo: formulario.titulo,
                    formularioIdOriginal: formulario.idOriginal
                  });
                  onSeleccionarAlumno(alumno.id, formulario.id);
                }}
              >
                <strong>{`${alumno.nombres || 'Sin nombre'} ${alumno.apellidos || 'Sin apellido'}`}</strong>
                <div>{formulario.titulo}</div>
                <div className="alumno-info">RUT: {alumno.rut || 'Sin RUT'}</div>
              </div>
            ));
          }).filter(Boolean)}
        </div>
      )}
    </div>
  );
};