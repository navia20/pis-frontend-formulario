// Servicio para gestionar respuestas de formularios/encuestas.
// Usa mocks para desarrollo y deja comentadas las llamadas reales al backend.

//import axios from 'axios';
//const API_URL = 'http://localhost:3000'; // Cambia según tu backend

// --- MOCK DATA ---
// Ahora cada respuesta incluye preguntas y opciones para que el admin pueda ver el detalle visual
const mockRespuestas = [
  {
    id: 'resp1',
    id_formulario: 1,
    id_usuario: 'alumno1',
    titulo: 'Formulario de Matemáticas',
    preguntas: [
      {
        id: 1,
        texto: '¿Cuánto es 2+2?',
        opciones: ['3', '4', '5']
      },
      {
        id: 2,
        texto: '¿Capital de Francia?',
        opciones: ['Madrid', 'París', 'Roma']
      }
    ],
    respuestas: [
      { id_pregunta: 1, respuesta: '4' },
      { id_pregunta: 2, respuesta: 'París' }
    ],
    fecha: '2024-06-09',
  },
  {
    id: 'resp2',
    id_formulario: 2,
    id_usuario: 'alumno2',
    titulo: 'Formulario de Historia',
    preguntas: [
      {
        id: 1,
        texto: '¿Quién descubrió América?',
        opciones: ['Colón', 'Magallanes', 'Pizarro']
      },
      {
        id: 2,
        texto: '¿Año de la independencia de Chile?',
        opciones: ['1810', '1818', '1821']
      }
    ],
    respuestas: [
      { id_pregunta: 1, respuesta: 'Colón' },
      { id_pregunta: 2, respuesta: '1818' }
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
      return Promise.resolve(mockRespuestas.filter(r => String(r.id_formulario) === String(formularioId)));
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