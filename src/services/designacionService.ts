// Servicio para designar asignaturas a estudiantes y docentes.
// Usa mocks para desarrollo y deja comentadas las llamadas reales al backend.

//import axios from 'axios';
//const API_URL = 'http://localhost:3000'; // Cambia según tu backend

// Mock de alumnos con estructura completa tipo Alumno
const mockAlumnos = [
  {
    id: '1',
    nombres: 'Juan',
    apellidos: 'Pérez',
    rut: '11.111.111-1',
    email: 'juan.perez@ucn.cl',
    id_carrera: 'ING-SOFT',
    año_ingreso: 2022,
    activo: true,
  },
  {
    id: '2',
    nombres: 'María',
    apellidos: 'Gómez',
    rut: '22.222.222-2',
    email: 'maria.gomez@ucn.cl',
    id_carrera: 'ING-CIVIL',
    año_ingreso: 2023,
    activo: true,
  },
  // ...agrega más alumnos si quieres
];

// Mock de docentes con estructura completa tipo Docente
const mockDocentes = [
  {
    id: 'd1',
    nombres: 'Ana',
    apellidos: 'García',
    rut: '11.111.111-1',
    email: 'ana.garcia@ucn.cl',
    activo: true,
  },
  {
    id: 'd2',
    nombres: 'Luis',
    apellidos: 'Martínez',
    rut: '22.222.222-2',
    email: 'luis.martinez@ucn.cl',
    activo: true,
  },
  // ...agrega más docentes si quieres
];

// Mock de asignaturas con estructura completa tipo Asignatura
const mockAsignaturas = [
  {
    id: 'a1',
    nombre: 'Matemáticas I',
    id_carrera: 'ING-SOFT',
    id_docentes: [] as string[],
  },
  {
    id: 'a2',
    nombre: 'Historia Universal',
    id_carrera: 'ING-CIVIL',
    id_docentes: [] as string[],
  },
  // ...agrega más asignaturas si quieres
];

// Mock de asignaciones (solo para simular)
let asignaciones = [] as { estudianteId: string; asignaturaId: string }[];

// Mock de asignaciones a docentes (solo para simular)
let asignacionesDocentes = [] as { docenteId: string; asignaturaId: string }[];

export const designacionService = {
  // Devuelve todos los alumnos con estructura completa
  getEstudiantes: async () => {
    return Promise.resolve(mockAlumnos);
  },

  // Devuelve docentes con estructura completa
  getDocentes: async () => {
    return Promise.resolve(mockDocentes);
  },

  // Devuelve asignaturas con estructura completa
  getAsignaturas: async () => {
    return Promise.resolve(mockAsignaturas);
  },

  // Asignar una asignatura a un solo estudiante
  asignarAsignaturaEstudiante: async (estudianteId: string, asignaturaId: string) => {
    asignaciones.push({ estudianteId, asignaturaId });
    return Promise.resolve();
  },

  // Asignar una asignatura a varios estudiantes (masivo)
  asignarAsignaturaEstudiantes: async (estudiantesIds: string[], asignaturaId: string) => {
    estudiantesIds.forEach(id => {
      asignaciones.push({ estudianteId: id, asignaturaId });
    });
    return Promise.resolve();
  },

  // Asignar una asignatura a un docente
  asignarAsignaturaDocentes: async (docentesIds: string[], asignaturaId: string) => {
  docentesIds.forEach(docenteId => {
    const asignatura = mockAsignaturas.find(a => a.id === asignaturaId);
    if (asignatura && !asignatura.id_docentes.includes(docenteId)) {
      asignatura.id_docentes.push(docenteId);
    }
    // Registrar la asignación:
    asignacionesDocentes.push({ docenteId, asignaturaId });
  });
  return Promise.resolve();
  },
};