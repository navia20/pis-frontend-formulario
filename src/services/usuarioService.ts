// Servicio para gestionar usuarios (alumnos y docentes).
// Conectado al backend NestJS

import axios from 'axios';
const API_URL = 'http://localhost:3000'; // URL del backend

// --- MOCK DATA (para referencia) ---
const mockUsuarios = [
  {
    id: 'alumno1',
    tipo: 'alumno',
    nombres: 'Juan',
    apellidos: 'Pérez',
    rut: '11.111.111-1',
    email: 'juan@correo.cl',
    id_carrera: 'carrera1',
    año_ingreso: 2022,
    contraseña: '1234',
    activo: true,
  },
  {
    id: 'docente1',
    tipo: 'docente',
    nombres: 'Carlos',
    apellidos: 'Ruiz',
    rut: '22.222.222-2',
    email: 'carlos@correo.cl',
    contraseña: 'abcd',
    activo: true,
  },
];

// --- SERVICE ---
export const usuarioService = {
  // Obtener todos los usuarios (alumnos y docentes)
  getUsuarios: async () => {
    try {
      const [alumnos, docentes] = await Promise.all([
        axios.get(`${API_URL}/alumnos`),
        axios.get(`${API_URL}/docentes`)
      ]);
      return [...alumnos.data, ...docentes.data];
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return Promise.resolve(mockUsuarios); // Fallback a mock en caso de error
    }
  },

  // Crear un nuevo usuario (alumno o docente)
  crearUsuario: async (usuario: any) => {
    try {
      if (usuario.tipo === 'alumno') {
        // Crear alumno usando el endpoint de auth/register
        const alumnoData = {
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          rut: usuario.rut,
          email: usuario.email,
          contraseña: usuario.contraseña,
          id_carrera: usuario.id_carrera,
          año_ingreso: parseInt(usuario.año_ingreso),
          tipo: 'alumno'
        };
        const response = await axios.post(`${API_URL}/auth/register`, alumnoData);
        return response.data;
      } else if (usuario.tipo === 'docente') {
        // Crear docente usando el endpoint de auth/register
        const docenteData = {
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          rut: usuario.rut,
          email: usuario.email,
          contraseña: usuario.contraseña,
          tipo: 'docente'
        };
        const response = await axios.post(`${API_URL}/auth/register`, docenteData);
        return response.data;
      }
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error; // Propagar el error para manejo en el componente
    }
  },

  // Editar usuario
  editarUsuario: async (id: string, usuario: Partial<any>) => {
    // return (await axios.patch(`${API_URL}/usuarios/${id}`, usuario)).data; // <-- Llamada real (ajusta la ruta)
    const idx = mockUsuarios.findIndex(u => u.id === id);
    if (idx !== -1) {
      mockUsuarios[idx] = { ...mockUsuarios[idx], ...usuario };
      return Promise.resolve(mockUsuarios[idx]);
    }
    return Promise.resolve(undefined);
  },

  // Eliminar usuario (soft delete)
  eliminarUsuario: async (id: string) => {
    // return (await axios.patch(`${API_URL}/alumnos/${id}/soft-delete`)).data; // <-- Llamada real para alumno
    // return (await axios.patch(`${API_URL}/docentes/${id}/soft-delete`)).data; // <-- Llamada real para docente
    const idx = mockUsuarios.findIndex(u => u.id === id);
    if (idx !== -1) {
      mockUsuarios[idx].activo = false;
      return Promise.resolve({ deleted: true });
    }
    return Promise.resolve({ deleted: false });
  },

  // Obtener estadísticas de usuarios (total, alumnos, docentes)
  getEstadisticas: async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/estadisticas`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      // Fallback a datos mock en caso de error
      return {
        total_usuarios: 120,
        total_alumnos: 105,
        total_docentes: 15,
        total_admins: 3
      };
    }
  },
};