// Servicio para designar asignaturas a estudiantes y docentes.
// Usa mocks para desarrollo y deja comentadas las llamadas reales al backend.

//import axios from 'axios';
//const API_URL = 'http://localhost:3000'; // Cambia según tu backend

// --- MOCK DATA ---
const mockEstudiantes = [
  { id: 'alumno1', nombre: 'Juan Pérez', asignaturas: ['1'] },
  { id: 'alumno2', nombre: 'Ana Gómez', asignaturas: ['2'] },
];

const mockDocentes = [
  { id: 'docente1', nombre: 'Carlos Ruiz', asignaturas: ['1'] },
  { id: 'docente2', nombre: 'María Soto', asignaturas: [] },
];

// --- SERVICE ---
export const designacionService = {
  // Obtener todos los estudiantes
  getEstudiantes: async () => {
    // return (await axios.get(`${API_URL}/alumnos`)).data; // <-- Llamada real
    return Promise.resolve(mockEstudiantes); // <-- Mock temporal
  },

  // Obtener todos los docentes
  getDocentes: async () => {
    // return (await axios.get(`${API_URL}/docentes`)).data; // <-- Llamada real
    return Promise.resolve(mockDocentes); // <-- Mock temporal
  },

  // Designar asignatura a estudiante
  asignarAsignaturaEstudiante: async (estudianteId: string, asignaturaId: string) => {
    // return (await axios.patch(`${API_URL}/alumnos/${estudianteId}`, { asignaturas: [asignaturaId] })).data; // <-- Llamada real
    const estudiante = mockEstudiantes.find(e => e.id === estudianteId);
    if (estudiante && !estudiante.asignaturas.includes(asignaturaId)) {
      estudiante.asignaturas.push(asignaturaId);
    }
    return Promise.resolve(estudiante); // <-- Mock temporal
  },

  // Designar asignatura a docente
  asignarAsignaturaDocente: async (docenteId: string, asignaturaId: string) => {
    // return (await axios.patch(`${API_URL}/asignaturas/${asignaturaId}/add-docente`, { docenteId })).data; // <-- Llamada real
    const docente = mockDocentes.find(d => d.id === docenteId);
    if (docente && !docente.asignaturas.includes(asignaturaId)) {
      docente.asignaturas.push(asignaturaId);
    }
    return Promise.resolve(docente); // <-- Mock temporal
  },
};