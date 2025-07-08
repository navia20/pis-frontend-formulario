// Servicio para consumir la API de encuestas (formularios)
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export interface Pregunta {
  id?: string;
  texto: string;
  respuestas: string[];
  respuestaCorrecta: number;
}

export interface Encuesta {
  id?: string;
  titulo: string;
  descripcion?: string;
  id_asignatura: string;
  fecha_creacion?: string;
  fecha_termino: string;
  preguntas: Pregunta[];
  activo?: boolean;
  publicado?: boolean;
  enviado?: boolean;
}

export const encuestaService = {
  // GET /encuestas
  getEncuestas: async (): Promise<Encuesta[]> => {
    try {
      const response = await axios.get(`${API_URL}/encuestas`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo encuestas:', error);
      throw error;
    }
  },

  // GET /encuestas/:id
  getEncuestaById: async (id: string): Promise<Encuesta | undefined> => {
    try {
      const response = await axios.get(`${API_URL}/encuestas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo encuesta:', error);
      throw error;
    }
  },

  // POST /encuestas
  createEncuesta: async (encuesta: Omit<Encuesta, 'id'>): Promise<Encuesta> => {
    try {
      const response = await axios.post(`${API_URL}/encuestas`, encuesta);
      return response.data;
    } catch (error) {
      console.error('Error creando encuesta:', error);
      throw error;
    }
  },

  // PATCH /encuestas/:id
  updateEncuesta: async (id: string, updateData: Partial<Encuesta>): Promise<Encuesta | undefined> => {
    try {
      const response = await axios.patch(`${API_URL}/encuestas/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando encuesta:', error);
      throw error;
    }
  },

  // Publicar encuesta para que esté disponible para estudiantes
  publicarEncuesta: async (id: string): Promise<Encuesta | undefined> => {
    try {
      const response = await axios.patch(`${API_URL}/encuestas/${id}/publicar`);
      return response.data;
    } catch (error) {
      console.error('Error publicando encuesta:', error);
      throw error;
    }
  },

  // Despublicar encuesta
  despublicarEncuesta: async (id: string): Promise<Encuesta | undefined> => {
    try {
      const response = await axios.patch(`${API_URL}/encuestas/${id}/despublicar`);
      return response.data;
    } catch (error) {
      console.error('Error despublicando encuesta:', error);
      throw error;
    }
  },

  // Obtener encuestas publicadas (para estudiantes)
  getEncuestasPublicadas: async (): Promise<Encuesta[]> => {
    try {
      const response = await axios.get(`${API_URL}/encuestas/publicadas/activas`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo encuestas publicadas:', error);
      throw error;
    }
  },
};