// Servicio para gestionar asignaturas. Usa mocks para desarrollo y deja comentadas las llamadas reales al backend.

//import axios from 'axios';
// Cambia la URL según tu entorno/backend real
//const API_URL = 'http://localhost:3000/asignaturas';

// Tipo de asignatura (ajusta según tu backend)
export interface Asignatura {
  id: string;
  nombre: string;
  id_carrera: string;
  id_docentes: string[];
}

// --- MOCK DATA PARA DESARROLLO ---
const mockAsignaturas: Asignatura[] = [
  {
    id: '1',
    nombre: 'Matemáticas',
    id_carrera: 'carrera1',
    id_docentes: ['docente1', 'docente2'],
  },
  {
    id: '2',
    nombre: 'Lenguaje',
    id_carrera: 'carrera2',
    id_docentes: ['docente3'],
  },
];

// --- SERVICE ---
export const asignaturaService = {
  // Obtener todas las asignaturas
  getAsignaturas: async (): Promise<Asignatura[]> => {
    // return (await axios.get(API_URL)).data; // <-- Llamada real
    return Promise.resolve(mockAsignaturas); // <-- Mock temporal
  },

  // Crear una nueva asignatura
  crearAsignatura: async (asignatura: Omit<Asignatura, 'id'>): Promise<Asignatura> => {
    // return (await axios.post(API_URL, asignatura)).data; // <-- Llamada real
    const nueva: Asignatura = { ...asignatura, id: (Math.random() * 10000).toFixed(0) };
    mockAsignaturas.push(nueva);
    return Promise.resolve(nueva); // <-- Mock temporal
  },

  // Editar una asignatura existente
  editarAsignatura: async (id: string, asignatura: Partial<Asignatura>): Promise<Asignatura | undefined> => {
    // return (await axios.patch(`${API_URL}/${id}`, asignatura)).data; // <-- Llamada real
    const idx = mockAsignaturas.findIndex(a => a.id === id);
    if (idx !== -1) {
      mockAsignaturas[idx] = { ...mockAsignaturas[idx], ...asignatura };
      return Promise.resolve(mockAsignaturas[idx]);
    }
    return Promise.resolve(undefined);
  },

  // Eliminar una asignatura
  eliminarAsignatura: async (id: string): Promise<{ deleted: boolean }> => {
    // return (await axios.delete(`${API_URL}/${id}`)).data; // <-- Llamada real
    const idx = mockAsignaturas.findIndex(a => a.id === id);
    if (idx !== -1) {
      mockAsignaturas.splice(idx, 1);
      return Promise.resolve({ deleted: true });
    }
    return Promise.resolve({ deleted: false });
  },
};