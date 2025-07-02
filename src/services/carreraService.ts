// Servicio para gestionar carreras conectado al backend
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const carreraService = {
  getCarreras: async () => {
    try {
      const response = await axios.get(`${API_URL}/carreras`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo carreras:', error);
      throw error; // Propagar el error en lugar de usar fallback
    }
  },
};