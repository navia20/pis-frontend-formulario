// Servicio para gestionar respuestas de formularios/encuestas.
// Usa mocks para desarrollo y deja comentadas las llamadas reales al backend.

//import axios from 'axios';
//const API_URL = 'http://localhost:3000'; // Cambia según tu backend

// --- MOCK DATA ---
const mockRespuestas = [
  {
    id: 'resp1',
    id_formulario: '1',
    id_usuario: 'alumno1',
    respuestas: [
      { pregunta: '¿Qué te pareció la clase?', respuesta: 'Muy buena' },
      { pregunta: '¿Recomendarías la asignatura?', respuesta: 'Sí' },
    ],
    fecha: '2024-06-09',
  },
  {
    id: 'resp2',
    id_formulario: '2',
    id_usuario: 'alumno2',
    respuestas: [
      { pregunta: '¿Qué te pareció la clase?', respuesta: 'Regular' },
      { pregunta: '¿Recomendarías la asignatura?', respuesta: 'No' },
    ],
    fecha: '2024-06-09',
  },
];

// --- SERVICE ---
export const respuestaService = {
  // Obtener todas las respuestas (o filtrar por formulario)
  getRespuestas: async (formularioId?: string) => {
    // const url = formularioId ? `${API_URL}/respuestas?formularioId=${formularioId}` : `${API_URL}/respuestas`;
    // return (await axios.get(url)).data; // <-- Llamada real
    if (formularioId) {
      return Promise.resolve(mockRespuestas.filter(r => r.id_formulario === formularioId));
    }
    return Promise.resolve(mockRespuestas); // <-- Mock temporal
  },

  // Crear una nueva respuesta
  crearRespuesta: async (respuesta: any) => {
    // return (await axios.post(`${API_URL}/respuestas`, respuesta)).data; // <-- Llamada real
    const nueva = { ...respuesta, id: (Math.random() * 10000).toFixed(0), fecha: new Date().toISOString() };
    mockRespuestas.push(nueva);
    return Promise.resolve(nueva); // <-- Mock temporal
  },
};