// Servicio para gestión de formularios (admin)
// import axios from 'axios';
// const API_URL = 'http://localhost:3000/formularios';

import { Formulario } from '../types/formulario';

// --- MOCK DATA ---
const mockFormularios: Formulario[] = [
  {
    id: 1,
    titulo: 'Encuesta de Matemáticas',
    preguntas: [
      { id: 1, texto: '¿Te gustó la clase?', respuestas: ['Sí', 'No'], editando: false },
      { id: 2, texto: '¿Recomendarías la asignatura?', respuestas: ['Sí', 'No'], editando: false },
    ],
    asignatura: 'Matemáticas',
    fechaLimite: '2025-06-30',
    enviado: true,
    // Puedes agregar otros campos si tu tipo Formulario los requiere
  },
  // ...otros formularios...
];

// --- SERVICE ---
export const formularioService = {
  // Obtener todos los formularios
  getFormularios: async (): Promise<Formulario[]> => {
    // return (await axios.get(API_URL)).data;
    return Promise.resolve(mockFormularios);
  },

  // Crear un nuevo formulario
  crearFormulario: async (formulario: Omit<Formulario, 'id'>): Promise<Formulario> => {
    // return (await axios.post(API_URL, formulario)).data;
    const nuevo: Formulario = { ...formulario, id: Math.floor(Math.random() * 10000) };
    mockFormularios.push(nuevo);
    return Promise.resolve(nuevo);
  },

  // Editar un formulario existente
  editarFormulario: async (id: number, update: Partial<Formulario>): Promise<Formulario | undefined> => {
    // return (await axios.patch(`${API_URL}/${id}`, update)).data;
    const idx = mockFormularios.findIndex(f => f.id === id);
    if (idx !== -1) {
      mockFormularios[idx] = { ...mockFormularios[idx], ...update };
      return Promise.resolve(mockFormularios[idx]);
    }
    return Promise.resolve(undefined);
  },

  // Eliminar un formulario
  eliminarFormulario: async (id: number): Promise<{ deleted: boolean }> => {
    // return (await axios.delete(`${API_URL}/${id}`)).data;
    const idx = mockFormularios.findIndex(f => f.id === id);
    if (idx !== -1) {
      mockFormularios.splice(idx, 1);
      return Promise.resolve({ deleted: true });
    }
    return Promise.resolve({ deleted: false });
  },
};