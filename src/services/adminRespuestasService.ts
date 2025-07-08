// Servicio para administradores - obtener todas las respuestas de formularios desde la base de datos
import axios from 'axios';
import { authService } from './authService';
import { encuestaService } from './encuestaService';

const API_URL = 'http://localhost:3000';

interface AlumnoInfo {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  id_carrera: string;
  año_ingreso: number;
}

interface RespuestaAdmin {
  id: string;
  id_formulario: number;
  id_usuario: string;
  titulo: string;
  preguntas: {
    id: number;
    texto: string;
    opciones: string[];
  }[];
  respuestas: {
    id_pregunta: number;
    respuesta: string;
  }[];
  fecha: string;
  nombre_estudiante: string;
  rut_estudiante: string;
  carrera: string;
  asignatura: string;
  año_ingreso: number;
}

interface RespuestaBackend {
  id: string;
  id_encuesta: string;
  id_alumno: string;
  respuestas: {
    [key: string]: string;
  };
  fecha_envio: string;
}

export const adminRespuestasService = {
  getRespuestas: async (): Promise<RespuestaAdmin[]> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('🔍 Admin: Obteniendo todas las respuestas del sistema...');

      // Obtener todas las encuestas
      const encuestas = await encuestaService.getEncuestas();
      console.log('📚 Total de encuestas encontradas:', encuestas.length);
      console.log('📚 Detalles de encuestas:', encuestas);

      if (encuestas.length === 0) {
        console.warn('⚠️ No se encontraron encuestas en el sistema');
        return [];
      }

      // Obtener todas las asignaturas para mapear nombres
      const asignaturasResponse = await axios.get(`${API_URL}/asignaturas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const asignaturas = asignaturasResponse.data;
      console.log('🏫 Total de asignaturas encontradas:', asignaturas.length);

      // Obtener todas las carreras para mapear nombres
      const carrerasResponse = await axios.get(`${API_URL}/carreras`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const carreras = carrerasResponse.data;
      console.log('🎓 Total de carreras encontradas:', carreras.length);

      const todasRespuestas: RespuestaAdmin[] = [];

      // Para cada encuesta, obtener sus respuestas
      for (const encuesta of encuestas) {
        try {
          console.log(`🔍 Obteniendo respuestas para encuesta: ${encuesta.titulo} (ID: ${encuesta.id})`);
          
          const respuestasResponse = await axios.get(`${API_URL}/respuestas/encuesta/${encuesta.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const respuestasEncuesta: RespuestaBackend[] = respuestasResponse.data;
          console.log(`📝 Respuestas encontradas para "${encuesta.titulo}":`, respuestasEncuesta.length);
          
          if (respuestasEncuesta.length === 0) {
            console.log(`⚠️ No hay respuestas para la encuesta "${encuesta.titulo}"`);
            continue;
          }

          // Buscar la asignatura correspondiente
          const asignatura = asignaturas.find((a: any) => a.id === encuesta.id_asignatura);
          const nombreAsignatura = asignatura ? asignatura.nombre : 'Asignatura Desconocida';

          // Para cada respuesta, obtener información del alumno
          for (const respuesta of respuestasEncuesta) {
            try {
              // Obtener información del alumno
              let alumno: AlumnoInfo | null = null;
              try {
                console.log(`👤 Obteniendo información del alumno: ${respuesta.id_alumno}`);
                const alumnoResponse = await axios.get(`${API_URL}/alumnos/${respuesta.id_alumno}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                alumno = alumnoResponse.data;
                console.log(`✅ Alumno obtenido: ${alumno?.nombres} ${alumno?.apellidos}`);
              } catch (error) {
                console.warn(`⚠️ No se pudo obtener alumno ${respuesta.id_alumno}:`, error);
                continue;
              }

              if (!alumno) continue;

              // Obtener información de la carrera del alumno
              const carrera = carreras.find((c: any) => c.id === alumno!.id_carrera);
              const nombreCarrera = carrera ? carrera.nombre : 'Carrera Desconocida';

              // Generar ID consistente para el formulario (mismo método que en docenteAsignaturaService)
              const encuestaId = encuesta.id || '';
              const hash = encuestaId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
              const frontendFormularioId = 1000 + hash;

              // Procesar preguntas y respuestas
              const preguntasProcesadas = encuesta.preguntas?.map((p: any) => ({
                id: parseInt(p.id) || 0,
                texto: p.texto || '',
                opciones: p.respuestas || []
              })) || [];

              const respuestasProcesadas = Object.entries(respuesta.respuestas).map(([preguntaId, respuestaTexto]) => ({
                id_pregunta: parseInt(preguntaId),
                respuesta: respuestaTexto
              }));

              const respuestaAdmin: RespuestaAdmin = {
                id: respuesta.id,
                id_formulario: frontendFormularioId,
                id_usuario: respuesta.id_alumno,
                titulo: encuesta.titulo,
                preguntas: preguntasProcesadas,
                respuestas: respuestasProcesadas,
                fecha: respuesta.fecha_envio,
                nombre_estudiante: `${alumno!.nombres} ${alumno!.apellidos}`,
                rut_estudiante: alumno!.rut,
                carrera: nombreCarrera,
                asignatura: nombreAsignatura,
                año_ingreso: alumno!.año_ingreso || new Date().getFullYear()
              };

              todasRespuestas.push(respuestaAdmin);
              console.log(`✅ Respuesta procesada para ${respuestaAdmin.nombre_estudiante} en ${respuestaAdmin.asignatura}`);

            } catch (error) {
              console.warn(`⚠️ Error procesando respuesta ${respuesta.id}:`, error);
            }
          }

        } catch (error) {
          console.warn(`⚠️ Error obteniendo respuestas para encuesta ${encuesta.id}:`, error);
        }
      }

      console.log('✅ Total de respuestas procesadas para admin:', todasRespuestas.length);
      console.log('📋 Resumen de respuestas:', todasRespuestas.map(r => ({
        estudiante: r.nombre_estudiante,
        asignatura: r.asignatura,
        titulo: r.titulo
      })));
      return todasRespuestas;

    } catch (error) {
      console.error('❌ Error al obtener respuestas para admin:', error);
      return [];
    }
  },

  // Método para obtener respuestas filtradas
  getRespuestasFiltradas: async (filtros: {
    nombre?: string;
    rut?: string;
    carrera?: string;
    asignatura?: string;
    año?: number;
  } = {}): Promise<RespuestaAdmin[]> => {
    const todasRespuestas = await adminRespuestasService.getRespuestas();
    
    return todasRespuestas.filter(respuesta => {
      return (
        (!filtros.nombre || respuesta.nombre_estudiante.toLowerCase().includes(filtros.nombre.toLowerCase())) &&
        (!filtros.rut || respuesta.rut_estudiante.includes(filtros.rut)) &&
        (!filtros.carrera || respuesta.carrera === filtros.carrera) &&
        (!filtros.asignatura || respuesta.asignatura === filtros.asignatura) &&
        (!filtros.año || respuesta.año_ingreso === filtros.año)
      );
    });
  }
};
