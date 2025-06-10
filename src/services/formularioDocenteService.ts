import { FormularioDocente, RespuestaAlumno } from '../types/formularioDocente';

export const formularioDocenteService = {
  getFormularios: async (): Promise<FormularioDocente[]> => {
    // Simula fetch a backend
    return [
      {
        id: 1,
        titulo: "Formulario Matemáticas",
        preguntas: [
          { id: 1, texto: "¿Cuánto es 2+2?", respuestas: ["3", "4", "5"] },
        ],
        asignatura: "Matemáticas",
        fechaLimite: "2025-12-31",
        enviado: true,
        correccionHabilitada: true,
        respuestasCorrectas: { 1: "4" }
      }
    ];
  },
  getRespuestas: async (): Promise<RespuestaAlumno[]> => {
    // Simula fetch a backend
    return [
      {
        idFormulario: 1,
        respuestas: { 1: "4" },
        fechaEnvio: "2025-06-10",
        alumnoId: "a1",
        alumnoNombre: "Juan Pérez"
      }
    ];
  }
};