// Servicio para gestionar inscripciones de estudiantes a asignaturas

import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Tipos
export interface Inscripcion {
  id: string;
  id_alumno: string;
  id_asignatura: string;
  fecha_inscripcion: Date;
  activo: boolean;
  estado: string; // inscrito, retirado, completado
}

export interface Alumno {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  id_carrera: string;
  año_ingreso: number;
  activo: boolean;
}

export const inscripcionService = {
  // Obtener todas las inscripciones
  getInscripciones: async (): Promise<Inscripcion[]> => {
    try {
      const response = await axios.get(`${API_URL}/inscripciones`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo inscripciones:', error);
      throw error;
    }
  },

  // Obtener inscripciones de un alumno
  getInscripcionesByAlumno: async (id_alumno: string): Promise<Inscripcion[]> => {
    try {
      const response = await axios.get(`${API_URL}/inscripciones/alumno/${id_alumno}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo inscripciones del alumno:', error);
      throw error;
    }
  },

  // Obtener inscripciones de una asignatura
  getInscripcionesByAsignatura: async (id_asignatura: string): Promise<Inscripcion[]> => {
    try {
      const response = await axios.get(`${API_URL}/inscripciones/asignatura/${id_asignatura}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo inscripciones de la asignatura:', error);
      throw error;
    }
  },

  // Obtener todos los alumnos
  getAlumnos: async (): Promise<Alumno[]> => {
    try {
      const response = await axios.get(`${API_URL}/alumnos`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo alumnos:', error);
      throw error;
    }
  },

  // Crear una inscripción individual
  crearInscripcion: async (id_alumno: string, id_asignatura: string): Promise<Inscripcion> => {
    try {
      const response = await axios.post(`${API_URL}/inscripciones`, {
        id_alumno,
        id_asignatura
      });
      return response.data;
    } catch (error) {
      console.error('Error creando inscripción:', error);
      throw error;
    }
  },

  // Inscribir múltiples alumnos a una asignatura
  inscribirMultiples: async (id_asignatura: string, ids_alumnos: string[]): Promise<Inscripcion[]> => {
    try {
      const response = await axios.post(`${API_URL}/inscripciones/inscribir-multiples`, {
        id_asignatura,
        ids_alumnos
      });
      return response.data;
    } catch (error) {
      console.error('Error inscribiendo múltiples alumnos:', error);
      throw error;
    }
  },

  // Eliminar inscripción (soft delete)
  eliminarInscripcion: async (id: string): Promise<Inscripcion> => {
    try {
      const response = await axios.delete(`${API_URL}/inscripciones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando inscripción:', error);
      throw error;
    }
  },

  // Eliminar inscripción por alumno y asignatura
  eliminarInscripcionByAlumnoAsignatura: async (id_alumno: string, id_asignatura: string): Promise<Inscripcion> => {
    try {
      const response = await axios.delete(`${API_URL}/inscripciones/alumno/${id_alumno}/asignatura/${id_asignatura}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando inscripción:', error);
      throw error;
    }
  },

  // Actualizar estado de inscripción
  actualizarEstadoInscripcion: async (id: string, estado: string): Promise<Inscripcion> => {
    try {
      const response = await axios.patch(`${API_URL}/inscripciones/${id}`, { estado });
      return response.data;
    } catch (error) {
      console.error('Error actualizando estado de inscripción:', error);
      throw error;
    }
  },
};
