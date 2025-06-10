// Servicio para gestionar usuarios (alumnos y docentes).
// Usa mocks para desarrollo y deja comentadas las llamadas reales al backend.

//import axios from 'axios';
//const API_URL = 'http://localhost:3000'; // Cambia según tu backend

// --- MOCK DATA ---
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
    // return (await axios.get(`${API_URL}/usuarios`)).data; // <-- Llamada real (ajusta la ruta según tu backend)
    return Promise.resolve(mockUsuarios); // <-- Mock temporal
  },

  // Crear un nuevo usuario (alumno o docente)
  crearUsuario: async (usuario: any) => {
    // return (await axios.post(`${API_URL}/alumnos`, usuario)).data; // <-- Llamada real para alumno
    // return (await axios.post(`${API_URL}/docentes`, usuario)).data; // <-- Llamada real para docente
    const nuevo = { ...usuario, id: (Math.random() * 10000).toFixed(0), activo: true };
    mockUsuarios.push(nuevo);
    return Promise.resolve(nuevo); // <-- Mock temporal
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
};