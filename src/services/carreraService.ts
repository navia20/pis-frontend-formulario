// Mock de carreras
const mockCarreras = [
  { id: 'ING-SOFT', nombre: 'Ingeniería en Software' },
  { id: 'ING-CIVIL', nombre: 'Ingeniería Civil' },
  { id: 'DERECHO', nombre: 'Derecho' },
  // Agrega más carreras si lo necesitas
];

export const carreraService = {
  getCarreras: async () => {
    return Promise.resolve(mockCarreras);
  },
};