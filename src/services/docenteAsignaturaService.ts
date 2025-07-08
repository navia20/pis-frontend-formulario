// Servicio para gestionar las asignaturas y respuestas de formularios para docentes
import axios from 'axios';
import { authService } from './authService';
import { encuestaService, Encuesta } from './encuestaService';
import { FormularioDocente, RespuestaAlumno } from '../types/formularioDocente';

const API_URL = 'http://localhost:3000';

interface Alumno {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
}

interface Inscripcion {
  id: string;
  id_alumno: string;
  id_asignatura: string;
}

interface RespuestaBackend {
  id: string;
  id_encuesta: string;
  id_alumno: string; // Cambiado de id_usuario a id_alumno
  respuestas: {
    [key: string]: string; // Cambiado de array a objeto
  };
  fecha_envio: string; // Cambiado de fecha a fecha_envio
}

export const docenteAsignaturaService = {
  // Método auxiliar para generar ID consistente a partir del ID original
  generateConsistentId: (originalId: string, baseIndex: number = 0): number => {
    if (!originalId) return baseIndex + 1000;
    
    // Generar hash consistente basado SOLO en el ID original, ignorando el índice
    const hash = originalId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 1000 + hash; // Removemos baseIndex para mayor consistencia
  },

  // Método auxiliar para obtener el ID de una asignatura por su nombre
  getAsignaturaIdPorNombre: async (nombreAsignatura: string): Promise<string | null> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const response = await axios.get(`${API_URL}/asignaturas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const todasAsignaturas = response.data;
      const asignatura = todasAsignaturas.find((asig: any) => asig.nombre === nombreAsignatura);
      
      return asignatura ? asignatura.id : null;
    } catch (error) {
      console.error('❌ Error al obtener ID de asignatura:', error);
      return null;
    }
  },

  // Obtener asignaturas del docente desde el backend
  getAsignaturasDocente: async (): Promise<string[]> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      // Obtener perfil del docente
      const perfil = await authService.getProfile();
      
      if (perfil.tipo !== 'docente') {
        throw new Error('El usuario no es un docente');
      }
      
      console.log('🔍 Obteniendo asignaturas para el docente ID:', perfil.id);
      
      // Obtener todas las asignaturas desde el backend
      const response = await axios.get(`${API_URL}/asignaturas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const todasAsignaturas = response.data;
      console.log('📋 Todas las asignaturas obtenidas:', todasAsignaturas.length);
      
      // Filtrar asignaturas donde el docente está en el array id_docentes
      const asignaturasDocente = todasAsignaturas.filter((asignatura: any) => {
        return asignatura.id_docentes && asignatura.id_docentes.includes(perfil.id);
      });
      
      console.log('✅ Asignaturas del docente filtradas:', asignaturasDocente.length);
      
      // Extraer solo los nombres de las asignaturas
      const nombresAsignaturas = asignaturasDocente.map((asig: any) => asig.nombre);
      
      console.log('📚 Nombres de asignaturas del docente:', nombresAsignaturas);
      return nombresAsignaturas;
    } catch (error) {
      console.error('❌ Error al obtener asignaturas del docente:', error);
      return [];
    }
  },
  
  // Obtener todos los formularios asociados a las asignaturas del docente
  getFormulariosDocente: async (): Promise<FormularioDocente[]> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      // Obtener perfil del docente
      const perfil = await authService.getProfile();
      
      console.log('🔍 Obteniendo formularios para el docente ID:', perfil.id);
      
      // Obtener todas las asignaturas desde el backend
      const asignaturasResponse = await axios.get(`${API_URL}/asignaturas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const todasAsignaturas = asignaturasResponse.data;
      
      // Filtrar asignaturas donde el docente está en el array id_docentes
      const asignaturasDocente = todasAsignaturas.filter((asignatura: any) => {
        return asignatura.id_docentes && asignatura.id_docentes.includes(perfil.id);
      });
      
      console.log('📚 Asignaturas del docente:', asignaturasDocente.length);
      
      // Obtener IDs de las asignaturas del docente
      const asignaturasIds = asignaturasDocente.map((asig: any) => asig.id);
      const asignaturasNombres = asignaturasDocente.map((asig: any) => asig.nombre);
      
      console.log('🆔 IDs de asignaturas del docente:', asignaturasIds);
      console.log('📝 Nombres de asignaturas del docente:', asignaturasNombres);
      
      // Obtener todas las encuestas
      const encuestas = await encuestaService.getEncuestas();
      console.log('📋 Encuestas obtenidas:', encuestas.length);
      
      // Filtrar encuestas por IDs de asignaturas del docente
      const encuestasDocente = encuestas.filter(encuesta => 
        asignaturasIds.includes(encuesta.id_asignatura)
      );
      
      console.log('✅ Encuestas del docente:', encuestasDocente.length);
      
      // Convertir al formato FormularioDocente
      const formularios: FormularioDocente[] = encuestasDocente.map((encuesta, index) => {
        // Buscar el nombre de la asignatura
        const asignatura = asignaturasDocente.find((asig: any) => asig.id === encuesta.id_asignatura);
        const nombreAsignatura = asignatura ? asignatura.nombre : encuesta.id_asignatura;
        
        // Usar método consistente para generar ID (sin depender del índice)
        const frontendId = docenteAsignaturaService.generateConsistentId(encuesta.id || '');
        
        console.log(`🔗 Mapeando encuesta "${encuesta.titulo}": ID original="${encuesta.id}" -> ID frontend=${frontendId}`);
        
        return {
          id: frontendId,
          idOriginal: encuesta.id, // Guardar el ID original para usar en las consultas
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
              respuestas: p.respuestas
            };
          }) || [],
          asignatura: nombreAsignatura,
          fechaLimite: encuesta.fecha_termino,
          enviado: encuesta.enviado ?? false,
          correccionHabilitada: true,
          respuestasCorrectas: encuesta.preguntas?.reduce((acc, pregunta, index) => {
            const preguntaId = pregunta.id ? parseInt(pregunta.id) : index + 1;
            const respuestaCorrecta = pregunta.respuestas[pregunta.respuestaCorrecta];
            acc[preguntaId] = respuestaCorrecta;
            return acc;
          }, {} as { [idPregunta: number]: string }) || {}
        };
      });
      
      console.log('📝 Formularios procesados para el docente:', formularios);
      return formularios;
    } catch (error) {
      console.error('❌ Error al obtener formularios para el docente:', error);
      return [];
    }
  },
  
  // Obtener alumnos que han respondido formularios en una asignatura específica
  getAlumnosConRespuestas: async (nombreAsignatura: string): Promise<{ alumno: Alumno, formularios: FormularioDocente[] }[]> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      console.log('🔍 Obteniendo alumnos con respuestas para la asignatura:', nombreAsignatura);
      
      // Primero obtener el ID de la asignatura usando su nombre
      const asignaturasResponse = await axios.get(`${API_URL}/asignaturas`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const todasAsignaturas = asignaturasResponse.data;
      console.log('🏫 Todas las asignaturas disponibles:', todasAsignaturas.map((a: any) => ({ id: a.id, nombre: a.nombre })));
      
      const asignatura = todasAsignaturas.find((asig: any) => asig.nombre === nombreAsignatura);
      
      if (!asignatura) {
        console.error('❌ No se encontró la asignatura:', nombreAsignatura);
        console.log('🔍 Asignaturas disponibles:', todasAsignaturas.map((a: any) => a.nombre));
        return [];
      }
      
      const asignaturaId = asignatura.id;
      console.log('🆔 ID de la asignatura encontrada:', asignaturaId);
      
      // Obtener todas las encuestas de esta asignatura
      const encuestas = await encuestaService.getEncuestas();
      console.log('📚 Total de encuestas en el sistema:', encuestas.length);
      console.log('📚 Todas las encuestas:', encuestas.map(e => ({ id: e.id, titulo: e.titulo, id_asignatura: e.id_asignatura })));
      
      const encuestasAsignatura = encuestas.filter(e => e.id_asignatura === asignaturaId);
      
      console.log('📋 Encuestas de la asignatura:', encuestasAsignatura.length);
      console.log('📋 IDs de encuestas:', encuestasAsignatura.map(e => e.id));
      console.log('📋 Detalles de encuestas de la asignatura:', encuestasAsignatura);
      
      if (encuestasAsignatura.length === 0) {
        console.log('⚠️ No hay encuestas para esta asignatura');
        console.log('🔍 Comparando:', { asignaturaId, encuestas: encuestas.map(e => ({ id_asignatura: e.id_asignatura, titulo: e.titulo })) });
        return [];
      }
      
      // Obtener todas las respuestas para estas encuestas
      const respuestasPromises = encuestasAsignatura.map(encuesta => {
        console.log(`🔍 Buscando respuestas para encuesta ID: ${encuesta.id}`);
        return axios.get(`${API_URL}/respuestas/encuesta/${encuesta.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).catch(error => {
          console.warn(`⚠️ Error obteniendo respuestas para encuesta ${encuesta.id}:`, error);
          return { data: [] };
        });
      });
      
      const respuestasResponses = await Promise.all(respuestasPromises);
      const todasRespuestas = respuestasResponses.flatMap(response => response.data);
      
      console.log('📝 Respuestas totales obtenidas:', todasRespuestas.length);
      console.log('📝 Detalle de respuestas:', todasRespuestas);
      
      if (todasRespuestas.length === 0) {
        console.log('⚠️ No hay respuestas para las encuestas de esta asignatura');
        return [];
      }
      
      // Agrupar respuestas por alumno
      const respuestasPorAlumno = new Map<string, any[]>();
      todasRespuestas.forEach((respuesta: any) => {
        // Verificar que el alumno tenga un ID válido
        if (respuesta.id_alumno && respuesta.id_alumno !== 'undefined') {
          if (!respuestasPorAlumno.has(respuesta.id_alumno)) {
            respuestasPorAlumno.set(respuesta.id_alumno, []);
          }
          respuestasPorAlumno.get(respuesta.id_alumno)!.push(respuesta);
        } else {
          console.warn('⚠️ Respuesta con id_alumno inválido:', respuesta);
        }
      });
      
      console.log('👥 Alumnos únicos con respuestas:', respuestasPorAlumno.size);
      
      // Obtener información de cada alumno y crear los formularios correspondientes
      const alumnosConRespuestas = [];
      
      for (const [alumnoId, respuestasAlumno] of Array.from(respuestasPorAlumno.entries())) {
        try {
          // Obtener datos del alumno con múltiples intentos
          let alumnoResponse;
          let alumno = null;
          
          try {
            // Primer intento: /alumno/:id
            alumnoResponse = await axios.get(`${API_URL}/alumno/${alumnoId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            alumno = alumnoResponse.data;
          } catch (error1) {
            console.warn(`⚠️ Error con /alumno/${alumnoId}:`, error1);
            
            try {
              // Segundo intento: /alumnos/:id
              alumnoResponse = await axios.get(`${API_URL}/alumnos/${alumnoId}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              alumno = alumnoResponse.data;
            } catch (error2) {
              console.warn(`⚠️ Error con /alumnos/${alumnoId}:`, error2);
              
              // Crear un alumno con datos básicos si no se puede obtener
              alumno = {
                id: alumnoId,
                nombres: 'Nombre no disponible',
                apellidos: 'Apellido no disponible',
                rut: 'RUT no disponible',
                email: 'Email no disponible'
              };
              console.warn(`⚠️ Usando datos básicos para alumno ${alumnoId}`);
            }
          }
          
          // Validar que tengamos información válida del alumno
          if (!alumno || !alumno.id) {
            console.warn(`⚠️ Datos de alumno inválidos para ID ${alumnoId}:`, alumno);
            continue;
          }
          
          // Crear formularios basados en las respuestas del alumno
          const formulariosAlumno: FormularioDocente[] = [];
          
          for (const respuesta of respuestasAlumno) {
            // Encontrar la encuesta correspondiente
            const encuesta = encuestasAsignatura.find(e => e.id === respuesta.id_encuesta);
            if (encuesta && encuesta.id) {
              // Usar método consistente para generar ID (sin depender del índice)
              const frontendId = docenteAsignaturaService.generateConsistentId(encuesta.id);
              
              console.log(`🔗 Mapeando respuesta: Encuesta "${encuesta.titulo}" ID original="${encuesta.id}" -> Frontend ID=${frontendId}`);
              
              formulariosAlumno.push({
                id: frontendId,
                idOriginal: encuesta.id,
                titulo: encuesta.titulo,
                preguntas: encuesta.preguntas?.map(p => {
                  let preguntaId: number;
                  try {
                    preguntaId = parseInt(p.id || '0');
                    if (isNaN(preguntaId)) {
                      preguntaId = (p.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    }
                  } catch (e) {
                    preguntaId = (p.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                  }
                  
                  return {
                    id: preguntaId,
                    texto: p.texto,
                    respuestas: p.respuestas
                  };
                }) || [],
                asignatura: nombreAsignatura,
                fechaLimite: encuesta.fecha_termino,
                enviado: true,
                correccionHabilitada: true,
                respuestasCorrectas: encuesta.preguntas?.reduce((acc, pregunta, index) => {
                  const preguntaId = pregunta.id ? parseInt(pregunta.id) : index + 1;
                  const respuestaCorrecta = pregunta.respuestas[pregunta.respuestaCorrecta];
                  acc[preguntaId] = respuestaCorrecta;
                  return acc;
                }, {} as { [idPregunta: number]: string }) || {}
              });
            }
          }
          
          if (formulariosAlumno.length > 0 && alumno) {
            alumnosConRespuestas.push({
              alumno,
              formularios: formulariosAlumno
            });
          }
          
        } catch (error) {
          console.warn(`⚠️ No se pudo obtener información del alumno ${alumnoId}:`, error);
        }
      }
      
      console.log('✅ Alumnos con respuestas procesados:', alumnosConRespuestas.length);
      return alumnosConRespuestas;
      
    } catch (error) {
      console.error('❌ Error al obtener alumnos con respuestas:', error);
      return [];
    }
  },
  
  // Obtener respuestas de los alumnos para un formulario específico
  getRespuestasFormulario: async (formularioId: number): Promise<RespuestaAlumno[]> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      console.log('🔍 Obteniendo respuestas para el formulario ID:', formularioId);
      
      // Obtener todos los formularios del docente para encontrar el ID original
      const formularios = await docenteAsignaturaService.getFormulariosDocente();
      const formulario = formularios.find(f => f.id === formularioId);
      
      if (!formulario || !formulario.idOriginal) {
        console.error('❌ No se encontró el formulario o su ID original:', formularioId);
        return [];
      }
      
      console.log('✅ Formulario encontrado:', formulario.titulo, 'ID original:', formulario.idOriginal);
      
      // Usar el ID original de la encuesta para obtener las respuestas
      console.log('🌐 Haciendo petición a:', `${API_URL}/respuestas/encuesta/${formulario.idOriginal}`);
      const respuestasResponse = await axios.get(`${API_URL}/respuestas/encuesta/${formulario.idOriginal}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const respuestasBackend: RespuestaBackend[] = respuestasResponse.data;
      console.log('📝 Respuestas obtenidas del backend:', respuestasBackend.length);
      console.log('📝 Datos crudos de respuestas:', respuestasBackend);
      
      if (respuestasBackend.length === 0) {
        console.log('⚠️ No hay respuestas para esta encuesta');
        return [];
      }
      
      // Obtener información de cada alumno
      const alumnosPromises = respuestasBackend.map(respuesta => 
        axios.get(`${API_URL}/alumno/${respuesta.id_alumno}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).catch(async (error) => {
          // Si falla con /alumno/, intentar con /alumnos/
          console.warn(`⚠️ Error con /alumno/${respuesta.id_alumno}, intentando /alumnos/${respuesta.id_alumno}`);
          return axios.get(`${API_URL}/alumnos/${respuesta.id_alumno}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }).catch(() => ({ data: null }));
        })
      );
      
      const alumnosResponses = await Promise.all(alumnosPromises);
      
      // Convertir al formato RespuestaAlumno
      const respuestasAlumnos: RespuestaAlumno[] = respuestasBackend.map((respuesta, index) => {
        const alumno = alumnosResponses[index].data;
        
        console.log('🔄 Procesando respuesta del alumno:', respuesta.id_alumno);
        console.log('📊 Respuestas de la encuesta:', respuesta.respuestas);
        
        // Convertir respuestas del formato backend al formato del frontend
        const respuestasMap: { [idPregunta: number]: string } = {};
        
        // Las respuestas ahora vienen como objeto, no como array
        Object.entries(respuesta.respuestas).forEach(([preguntaId, respuestaTexto]) => {
          // Usar el ID real de la pregunta, no el índice
          const preguntaIdNumerico = parseInt(preguntaId);
          
          console.log(`🔢 Pregunta ID=${preguntaId} -> Frontend ID=${preguntaIdNumerico}, Respuesta: ${respuestaTexto}`);
          
          if (!isNaN(preguntaIdNumerico)) {
            respuestasMap[preguntaIdNumerico] = respuestaTexto;
          } else {
            console.warn(`⚠️ ID de pregunta no válido: ${preguntaId}`);
          }
        });
        
        console.log('📋 Mapa de respuestas final:', respuestasMap);
        
        return {
          idFormulario: formularioId,
          respuestas: respuestasMap,
          fechaEnvio: respuesta.fecha_envio,
          alumnoId: respuesta.id_alumno,
          alumnoNombre: alumno ? `${alumno.nombres} ${alumno.apellidos}` : 'Alumno Desconocido'
        };
      });
      
      console.log('✅ Respuestas procesadas exitosamente:', respuestasAlumnos.length);
      return respuestasAlumnos;
    } catch (error) {
      console.error('❌ Error al obtener respuestas de los alumnos:', error);
      return [];
    }
  }
};
