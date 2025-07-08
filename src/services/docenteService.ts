// Servicio para gestionar docentes conectado al backend

import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Tipo de docente (según el backend)
export interface Docente {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  contraseña?: string;
  activo: boolean;
}

// --- SERVICE ---
export const docenteService = {
  // Obtener todos los docentes
  getDocentes: async (): Promise<Docente[]> => {
    try {
      const response = await axios.get(`${API_URL}/docentes`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo docentes:', error);
      throw error;
    }
  },

  // Obtener docente por RUT
  getDocenteByRut: async (rut: string): Promise<Docente> => {
    try {
      const response = await axios.get(`${API_URL}/docentes/rut/${rut}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo docente por RUT:', error);
      throw error;
    }
  },

  // Crear un nuevo docente
  crearDocente: async (docente: Omit<Docente, 'id'>): Promise<Docente> => {
    try {
      const response = await axios.post(`${API_URL}/docentes`, docente);
      return response.data;
    } catch (error) {
      console.error('Error creando docente:', error);
      throw error;
    }
  },
};
