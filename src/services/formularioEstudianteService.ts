import { FormularioAlumno } from '../types/FormularioAlumno';

const mockFormularios: FormularioAlumno[] = [
  {
    id: 1,
    titulo: 'Encuesta de Matemáticas',
    preguntas: [
      { id: 1, texto: '¿Te gustó la clase?', respuestas: ['Sí', 'No'] },
      { id: 2, texto: '¿Recomendarías la asignatura?', respuestas: ['Sí', 'No'] },
    ],
    asignatura: 'Matemáticas',
    fechaLimite: '2025-06-30',
    enviado: true,
    correccionHabilitada: false,
    respuestasCorrectas: { 1: 'Sí', 2: 'Sí' }
  },
  // ...otros formularios...
];

export const formularioEstudianteService = {
  getFormularios: async (): Promise<FormularioAlumno[]> => {
    // return (await axios.get(API_URL)).data;
    return Promise.resolve(mockFormularios);
  },
};