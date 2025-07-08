// Servicio para gestionar carreras conectado al backend
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Tipo de carrera
export interface Carrera {
  id: string;
  nombre: string;
}

export const carreraService = {
  getCarreras: async (): Promise<Carrera[]> => {
    try {
      const response = await axios.get(`${API_URL}/carreras`);
      console.log('Respuesta de carreras del backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo carreras:', error);
      throw error; // Propagar el error en lugar de usar fallback
    }
  },
};