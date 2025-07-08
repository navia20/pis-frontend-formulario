import React, { useEffect, useState } from 'react';
import { formularioEstudianteService } from '../../../services/formularioEstudianteService';
import { FormularioAlumno } from '../../../types/formularioAlumno';
import { respuestaEstudianteService } from '../../../services/respuestaEstudianteService';
import './ListaFormulariosRespondidos.css';

export const ListaFormulariosRespondidos: React.FC<{ 
  onSeleccionar: (f: FormularioAlumno) => void; 
  formulariosRespondidos: number[] 
}> = ({ onSeleccionar, formulariosRespondidos }) => {
  const [formularios, setFormularios] = useState<FormularioAlumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondidos, setRespondidos] = useState<FormularioAlumno[]>([]);
  
  // Cargar todos los formularios
  useEffect(() => {
    const cargarFormularios = async () => {
      setLoading(true);
      try {
        const todosFormularios = await formularioEstudianteService.getFormularios();
        console.log('Todos los formularios cargados:', todosFormularios);
        console.log('IDs de formularios respondidos:', formulariosRespondidos);
        setFormularios(todosFormularios);
      } catch (error) {
        console.error('Error cargando formularios:', error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarFormularios();
  }, []);
  
  // Filtrar formularios respondidos cuando cambian los formularios o los IDs de respondidos
  useEffect(() => {
    const filtrarRespondidos = () => {
      console.log('Filtrando formularios respondidos con IDs:', formulariosRespondidos);
      
      // Filtrar formularios que han sido respondidos
      const filtrados = formularios.filter(f => {
        const esRespondido = formulariosRespondidos.includes(f.id);
        console.log(`Formulario ID ${f.id} - Título: "${f.titulo}" - ¿Respondido?: ${esRespondido}`);
        return esRespondido;
      });
      
      console.log('Formularios respondidos filtrados:', filtrados.map(f => ({ id: f.id, titulo: f.titulo })));
      setRespondidos(filtrados);
    };
    
    if (formularios.length > 0 && formulariosRespondidos.length > 0) {
      filtrarRespondidos();
    } else {
      setRespondidos([]);
    }
  }, [formularios, formulariosRespondidos]);
  
  // También cargar directamente las respuestas del alumno para comparar
  useEffect(() => {
    const cargarRespuestas = async () => {
      try {
        const respuestasGuardadas = await respuestaEstudianteService.obtenerRespuestasAlumno();
        console.log('Respuestas directas del backend:', respuestasGuardadas);
        
        // Si no hay formularios respondidos según los IDs pero sí hay respuestas, intentar emparejar
        if (respondidos.length === 0 && respuestasGuardadas.length > 0 && formularios.length > 0) {
          const idsEncuestas = respuestasGuardadas.map(r => r.id_encuesta);
          console.log('IDs de encuestas de respuestas guardadas:', idsEncuestas);
          
          // Intentar emparejar por ID string
          const emparejados = formularios.filter(f => 
            idsEncuestas.includes(f.id.toString()) || 
            idsEncuestas.some(id => id.includes(f.id.toString()))
          );
          
          if (emparejados.length > 0) {
            console.log('Formularios emparejados por ID string:', emparejados);
            setRespondidos(emparejados);
          }
        }
      } catch (error) {
        console.error('Error cargando respuestas directamente:', error);
      }
    };
    
    if (respondidos.length === 0 && formularios.length > 0) {
      cargarRespuestas();
    }
  }, [formularios, respondidos]);
  
  if (loading) {
    return <div className="alumno-respondidos-cargando">Cargando formularios respondidos...</div>;
  }
  
  return (
    <div className="alumno-respondidos-lista">
      <h2 className="alumno-respondidos-titulo-lista">Formularios respondidos</h2>
      {respondidos.length === 0 && (
        <p className="alumno-respondidos-vacio">
          No has respondido ningún formulario.
        </p>
      )}
      {respondidos.length > 0 && (
        <div className="alumno-respondidos-cards">
          {respondidos.map((formulario) => (
            <div
              key={formulario.id}
              className="alumno-respondidos-cuadro"
              onClick={() => {
                console.log('Seleccionando formulario respondido:', formulario);
                onSeleccionar(formulario);
              }}
            >
              <div className="alumno-respondidos-titulo">{formulario.titulo}</div>
              <div className="alumno-respondidos-info"><b>Asignatura:</b> {formulario.asignatura}</div>
              <div className="alumno-respondidos-info">
                <b>Fecha límite:</b> {formulario.fechaLimite ? new Date(formulario.fechaLimite).toLocaleDateString() : '-'}
              </div>
              <div className="alumno-respondidos-info">
                <b>ID:</b> {formulario.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};