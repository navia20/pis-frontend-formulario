import { FormularioAlumno } from '../types/formularioAlumno';
import { encuestaService } from './encuestaService';
import { authService } from './authService';

export const formularioEstudianteService = {
  getFormularios: async (): Promise<FormularioAlumno[]> => {
    try {
      console.log('🔍 Obteniendo formularios para estudiante...');
      
      // Obtener todas las encuestas desde el backend
      const encuestas = await encuestaService.getEncuestas();
      console.log('📋 Encuestas obtenidas del backend:', encuestas.length);
      console.log('📋 Encuestas detalle:', encuestas);
      
      // Obtener el perfil del alumno
      const perfil = await authService.getProfile();
      console.log('👤 Perfil del alumno:', perfil);
      
      // Obtener asignaturas del alumno
      let asignaturasAlumno: string[] = [];
      try {
        asignaturasAlumno = await authService.getAsignaturasAlumno();
        console.log('📚 Asignaturas del alumno:', asignaturasAlumno);
      } catch (error) {
        console.warn('⚠️ No se pudieron obtener las asignaturas del alumno:', error);
      }
      
      // Filtrar encuestas que están publicadas
      const encuestasPublicadas = encuestas.filter(encuesta => {
        console.log(`🔍 Verificando encuesta "${encuesta.titulo}":`, {
          publicado: encuesta.publicado,
          activo: encuesta.activo,
          id_asignatura: encuesta.id_asignatura
        });
        
        // Solo mostrar encuestas publicadas y activas
        return encuesta.publicado && encuesta.activo;
      });
      
      console.log('✅ Encuestas publicadas y activas:', encuestasPublicadas.length);
      
      // Convertir a formato FormularioAlumno
      const formularios: FormularioAlumno[] = encuestasPublicadas.map(encuesta => {
        // Asegurar que el ID de la encuesta se maneja correctamente
        let encuestaId: number;
        if (encuesta.id) {
          // Intentar convertir a número, si no es posible, usar el ID como string
          try {
            encuestaId = parseInt(encuesta.id);
            if (isNaN(encuestaId)) {
              console.warn(`⚠️ ID de encuesta no es un número válido: ${encuesta.id}`);
              // Usar el string como base para un hash numérico
              encuestaId = encuesta.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            }
          } catch (e) {
            console.warn(`⚠️ Error al procesar ID de encuesta: ${encuesta.id}`, e);
            encuestaId = encuesta.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          }
        } else {
          // Si no hay ID, generar uno aleatorio (esto debería evitarse)
          encuestaId = Math.floor(Math.random() * 1000000);
          console.warn(`⚠️ Generando ID aleatorio para encuesta sin ID: ${encuestaId}`);
        }
        
        console.log(`🔢 ID procesado para encuesta "${encuesta.titulo}": ${encuestaId} (original: ${encuesta.id})`);
        
        return {
          id: encuestaId,
          idOriginal: encuesta.id, // Guardar el ID original de la encuesta
          titulo: encuesta.titulo,
          preguntas: encuesta.preguntas?.map(p => {
            // Procesar ID de pregunta de manera similar
            let preguntaId: number;
            if (p.id) {
              try {
                preguntaId = parseInt(p.id);
                if (isNaN(preguntaId)) {
                  preguntaId = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                }
              } catch (e) {
                preguntaId = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
              }
            } else {
              preguntaId = Math.floor(Math.random() * 1000000);
            }
            
            return {
              id: preguntaId,
              texto: p.texto,
              respuestas: p.respuestas,
              respuestaCorrecta: p.respuestaCorrecta
            };
          }) || [],
          asignatura: encuesta.id_asignatura,
          fechaLimite: encuesta.fecha_termino,
          enviado: false,
          correccionHabilitada: true, // Habilitar corrección para mostrar respuestas correctas
          respuestasCorrectas: encuesta.preguntas?.reduce((acc, pregunta, index) => {
            const preguntaId = pregunta.id ? parseInt(pregunta.id) : index + 1;
            const respuestaCorrecta = pregunta.respuestas[pregunta.respuestaCorrecta];
            acc[preguntaId] = respuestaCorrecta;
            return acc;
          }, {} as { [idPregunta: number]: string }) || {}
        };
      });
      
      console.log('📝 Formularios finales para el estudiante:', formularios);
      return formularios;
    } catch (error) {
      console.error('❌ Error al obtener formularios para estudiante:', error);
      return [];
    }
  },
};