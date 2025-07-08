// Servicio para gestionar respuestas de formularios de estudiantes
import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:3000'; // URL del backend

interface RespuestaFormulario {
  id_encuesta: string;
  respuestas: { [idPregunta: string]: string };
}

interface RespuestaGuardada {
  id: string;
  id_encuesta: string;
  id_alumno: string;
  rut_alumno: string;
  respuestas: { [idPregunta: string]: string };
  fecha_envio: string;
  calificado: boolean;
  puntuacion?: number;
}

export const respuestaEstudianteService = {
  // Enviar respuestas de un formulario
  enviarRespuesta: async (respuestaData: RespuestaFormulario): Promise<RespuestaGuardada> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const response = await axios.post(`${API_URL}/respuestas`, respuestaData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error al enviar respuesta:', error);
      
      if (error.response?.status === 400 && error.response?.data?.message?.includes('Ya has respondido')) {
        throw new Error('Ya has respondido esta encuesta');
      }
      
      throw new Error('Error al enviar la respuesta');
    }
  },
  
  // Obtener respuestas del alumno actual
  obtenerRespuestasAlumno: async (): Promise<RespuestaGuardada[]> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const response = await axios.get(`${API_URL}/respuestas/alumno`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Respuestas obtenidas del backend:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('Error al obtener respuestas del alumno:', error);
      return [];
    }
  },
  
  // Verificar si el alumno ya respondió una encuesta específica
  verificarRespuestaExistente: async (idEncuesta: string): Promise<RespuestaGuardada | null> => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const response = await axios.get(`${API_URL}/respuestas/alumno/${idEncuesta}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No ha respondido la encuesta
      }
      console.error('Error al verificar respuesta existente:', error);
      return null;
    }
  }
};
