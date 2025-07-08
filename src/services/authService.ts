// Servicio de autenticación y perfil de usuario
import axios from 'axios';
const API_URL = 'http://localhost:3000'; // URL del backend

// Definimos la interfaz de UserProfile
export interface UserProfile {
  id: string;
  rut: string;
  nombres: string;
  apellidos: string;
  email: string;
  tipo: 'alumno' | 'docente' | 'admin';
  id_carrera?: string;
  nombre_carrera?: string;
  año_ingreso?: number;
  fechaCreacion?: Date;
  asignaturas?: string[];
  rol?: string; // Para administradores
}

export const authService = {
  // Login
  login: async (rut: string, password: string, tipo: 'alumno' | 'docente' | 'admin') => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        rut,
        password,
        tipo
      });
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.data.accessToken);
      
      // Intentar obtener el perfil del usuario recién logueado
      try {
        await authService.refreshProfile();
      } catch (profileError) {
        console.error('Error al cargar perfil inicial:', profileError);
        // No propagamos este error, ya que el login fue exitoso
      }
      
      return response.data;
    } catch (error) {
      console.error('Error durante login:', error);
      throw error;
    }
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
  },
  
  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Obtener token
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  // Obtener perfil del usuario desde la API
  getProfile: async (): Promise<UserProfile> => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const profileData = response.data;
      
      // Guardar en localStorage para acceso rápido
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      return profileData;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  },
  
  // Obtener perfil almacenado en cache (localStorage)
  getCachedProfile: (): UserProfile | null => {
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      try {
        return JSON.parse(profileData);
      } catch (e) {
        console.error('Error al parsear perfil de usuario:', e);
        return null;
      }
    }
    return null;
  },
  
  // Refrescar el perfil del usuario desde el backend
  refreshProfile: async (): Promise<UserProfile | null> => {
    try {
      const profile = await authService.getProfile();
      return profile;
    } catch (error) {
      console.error('Error al refrescar perfil:', error);
      return null;
    }
  },
  
  // Obtener carrera por ID
  getCarrera: async (id: string) => {
    try {
      console.log(`Intentando obtener carrera con ID: ${id}`);
      console.log(`URL completa: ${API_URL}/carreras/${id}`);
      
      const response = await axios.get(`${API_URL}/carreras/${id}`);
      console.log('Respuesta de carrera:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo carrera:', error);
      console.error('Status:', error.response?.status);
      console.error('Status text:', error.response?.statusText);
      console.error('Response data:', error.response?.data);
      throw error;
    }
  },
  
  // Obtener asignaturas del alumno autenticado
  getAsignaturasAlumno: async (): Promise<string[]> => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      // Primero obtener el perfil para obtener el ID del alumno
      const profile = await authService.getProfile();
      
      if (profile.tipo !== 'alumno') {
        return [];
      }
      
      // Obtener las inscripciones del alumno
      const inscripcionesResponse = await axios.get(`${API_URL}/inscripciones/alumno/${profile.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const inscripciones = inscripcionesResponse.data;
      
      // Obtener los detalles de las asignaturas
      const asignaturasPromises = inscripciones.map((inscripcion: any) => 
        axios.get(`${API_URL}/asignaturas/${inscripcion.id_asignatura}`)
      );
      
      const asignaturasResponses = await Promise.all(asignaturasPromises);
      const asignaturas = asignaturasResponses.map(response => response.data.nombre);
      
      return asignaturas;
    } catch (error) {
      console.error('Error obteniendo asignaturas del alumno:', error);
      return [];
    }
  },
};
