// Servicio para gestionar asignaturas conectado al backend

import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Tipo de asignatura (según el backend)
export interface Asignatura {
  id: string;
  nombre: string;
  id_carrera: string;
  id_docentes: string[];
}

// --- SERVICE ---
export const asignaturaService = {
  // Obtener todas las asignaturas
  getAsignaturas: async (): Promise<Asignatura[]> => {
    try {
      const response = await axios.get(`${API_URL}/asignaturas`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo asignaturas:', error);
      throw error;
    }
  },

  // Crear una nueva asignatura
  crearAsignatura: async (asignatura: Omit<Asignatura, 'id'>): Promise<Asignatura> => {
    try {
      const response = await axios.post(`${API_URL}/asignaturas`, asignatura);
      return response.data;
    } catch (error) {
      console.error('Error creando asignatura:', error);
      throw error;
    }
  },

  // Editar una asignatura existente
  editarAsignatura: async (id: string, asignatura: Partial<Asignatura>): Promise<Asignatura> => {
    try {
      const response = await axios.patch(`${API_URL}/asignaturas/${id}`, asignatura);
      return response.data;
    } catch (error) {
      console.error('Error editando asignatura:', error);
      throw error;
    }
  },

  // Eliminar una asignatura
  eliminarAsignatura: async (id: string): Promise<{ deleted: boolean }> => {
    try {
      await axios.delete(`${API_URL}/asignaturas/${id}`);
      return { deleted: true };
    } catch (error) {
      console.error('Error eliminando asignatura:', error);
      throw error;
    }
  },

  // Actualizar docentes de una asignatura (reemplazar lista completa)
  actualizarDocentes: async (id: string, id_docentes: string[]): Promise<Asignatura> => {
    try {
      const response = await axios.patch(`${API_URL}/asignaturas/${id}/docentes`, { id_docentes });
      return response.data;
    } catch (error) {
      console.error('Error actualizando docentes de asignatura:', error);
      throw error;
    }
  },

  // Agregar un docente a una asignatura
  agregarDocente: async (id: string, docenteId: string): Promise<Asignatura> => {
    try {
      const response = await axios.patch(`${API_URL}/asignaturas/${id}/add-docente`, { docenteId });
      return response.data;
    } catch (error) {
      console.error('Error agregando docente a asignatura:', error);
      throw error;
    }
  },

  // Remover un docente de una asignatura
  removerDocente: async (id: string, docenteId: string): Promise<Asignatura> => {
    try {
      const response = await axios.patch(`${API_URL}/asignaturas/${id}/remove-docente`, { docenteId });
      return response.data;
    } catch (error) {
      console.error('Error removiendo docente de asignatura:', error);
      throw error;
    }
  },

  // Designar múltiples docentes a una asignatura
  designarDocentes: async (asignaturaId: string, docentesIds: string[]): Promise<Asignatura> => {
    try {
      // Agregar cada docente individualmente para evitar duplicados
      let asignaturaActualizada: Asignatura | null = null;
      
      for (const docenteId of docentesIds) {
        asignaturaActualizada = await asignaturaService.agregarDocente(asignaturaId, docenteId);
      }
      
      return asignaturaActualizada!;
    } catch (error) {
      console.error('Error designando docentes a asignatura:', error);
      throw error;
    }
  },
};