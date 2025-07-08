import React, { useEffect, useState } from 'react';
import { docenteAsignaturaService } from '../../../services/docenteAsignaturaService';
import { FormularioDocente, RespuestaAlumno } from '../../../types/formularioDocente';
import './VerRespuestasAlumno.css';

export const VerRespuestasAlumno: React.FC<{
  alumnoId: string;
  formularioId: number;
  onBack: () => void;
}> = ({ alumnoId, formularioId, onBack }) => {
  const [formulario, setFormulario] = useState<FormularioDocente | null>(null);
  const [respuestaAlumno, setRespuestaAlumno] = useState<RespuestaAlumno | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        console.log('🔍 Buscando formulario con ID:', formularioId, 'para alumno:', alumnoId);
        
        // Obtener todos los formularios del docente
        const formulariosDocente = await docenteAsignaturaService.getFormulariosDocente();
        console.log('📚 Formularios disponibles del docente:', formulariosDocente.map(f => ({ id: f.id, titulo: f.titulo, idOriginal: f.idOriginal })));
        
        const formularioEncontrado = formulariosDocente.find(f => f.id === formularioId || f.idOriginal === formularioId.toString());
        console.log('🎯 Formulario encontrado:', formularioEncontrado ? { 
          id: formularioEncontrado.id, 
          titulo: formularioEncontrado.titulo, 
          idOriginal: formularioEncontrado.idOriginal,
          tipoMatch: formularioEncontrado.id === formularioId ? 'Por ID' : 'Por ID Original'
        } : 'NO ENCONTRADO');
        
        setFormulario(formularioEncontrado || null);
        
        if (!formularioEncontrado) {
          console.error('❌ No se encontró formulario con ID:', formularioId);
          console.log('📋 IDs disponibles:', formulariosDocente.map(f => f.id));
          setError('No se encontró el formulario solicitado');
          setLoading(false);
          return;
        }
        
        console.log('📋 Obteniendo respuestas para formulario ID:', formularioId);
        console.log('📋 Usando formulario encontrado con ID:', formularioEncontrado.id);
        
        // Obtener respuestas para este formulario usando el ID del formulario encontrado
        const respuestas = await docenteAsignaturaService.getRespuestasFormulario(formularioEncontrado.id);
        console.log('📝 Respuestas obtenidas:', respuestas.length);
        console.log('📝 Respuestas detalladas:', respuestas.map(r => ({ alumnoId: r.alumnoId, alumnoNombre: r.alumnoNombre })));
        
        const respuestaDelAlumno = respuestas.find(r => r.alumnoId === alumnoId);
        console.log('🎯 Respuesta del alumno encontrada:', respuestaDelAlumno ? { alumnoId: respuestaDelAlumno.alumnoId, alumnoNombre: respuestaDelAlumno.alumnoNombre } : 'NO ENCONTRADA');
        
        setRespuestaAlumno(respuestaDelAlumno || null);
        
        if (!respuestaDelAlumno) {
          console.error('❌ No se encontraron respuestas del alumno:', alumnoId);
          console.log('👥 IDs de alumnos disponibles:', respuestas.map(r => r.alumnoId));
          setError('No se encontraron respuestas del alumno para este formulario');
        }
      } catch (err) {
        console.error('❌ Error al cargar datos de respuestas:', err);
        setError('Error al cargar las respuestas. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [alumnoId, formularioId]);

  if (loading) {
    return (
      <div className="ver-respuestas-alumno">
        <button className="btn-retroceder" onClick={onBack}>Retroceder</button>
        <div className="loading-message">Cargando respuestas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ver-respuestas-alumno">
        <button className="btn-retroceder" onClick={onBack}>Retroceder</button>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!formulario || !respuestaAlumno) {
    return (
      <div className="ver-respuestas-alumno">
        <button className="btn-retroceder" onClick={onBack}>Retroceder</button>
        <div className="error-message">No se encontraron datos de respuestas</div>
      </div>
    );
  }

  const mostrarCorrecion = formulario.correccionHabilitada ?? true;

  return (
    <div className="ver-respuestas-alumno">
      <button className="btn-retroceder" onClick={onBack}>Retroceder</button>
      <h2>
        {respuestaAlumno.alumnoNombre} - {formulario.titulo}
      </h2>
      <div className="preguntas-container">
        {formulario.preguntas.map((pregunta) => {
          const respuesta = respuestaAlumno.respuestas[pregunta.id];
          const correcta = formulario.respuestasCorrectas?.[pregunta.id];
          return (
            <div key={pregunta.id} className="pregunta">
              <div className="pregunta-header">
                <h3>Pregunta {pregunta.id}</h3>
              </div>
              <p className="pregunta-texto">{pregunta.texto}</p>
              <div className="respuestas">
                {pregunta.respuestas.map((opcion, idx) => {
                  let clase = "respuesta";
                  if (respuesta === opcion) {
                    if (mostrarCorrecion && correcta) {
                      clase +=
                        respuesta === correcta
                          ? " seleccionada respuesta-correcta"
                          : " seleccionada respuesta-incorrecta";
                    } else {
                      clase += " seleccionada";
                    }
                  }
                  if (mostrarCorrecion && correcta && opcion === correcta) {
                    clase += " respuesta-correcta";
                  }
                  return (
                    <label
                      key={idx}
                      className={clase}
                      style={{
                        pointerEvents: "none",
                        opacity: respuesta === opcion ? 1 : 0.7,
                      }}
                    >
                      <input
                        type="radio"
                        name={`pregunta-${pregunta.id}`}
                        value={opcion}
                        checked={respuesta === opcion}
                        readOnly
                        tabIndex={-1}
                      />
                      {opcion}
                      {mostrarCorrecion && correcta && opcion === correcta && (
                        <span style={{ marginLeft: 8, color: "#219653", fontWeight: 600 }}>✔</span>
                      )}
                      {mostrarCorrecion && correcta && respuesta === opcion && respuesta !== correcta && (
                        <span style={{ marginLeft: 8, color: "#c0392b", fontWeight: 600 }}>✘</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};