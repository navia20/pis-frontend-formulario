// Servicio para consumir la API de encuestas (formularios)
// Por ahora, usa datos simulados. Cuando conectes el backend, descomenta el fetch real.

export interface Encuesta {
  id: string;
  titulo: string;
  descripcion: string;
  id_asignatura: string;
  fecha_creacion: string;
  fecha_termino: string;
}

const encuestasMock: Encuesta[] = [
  {
    id: '1',
    titulo: 'Encuesta de ejemplo',
    descripcion: 'Esta es una encuesta de prueba.',
    id_asignatura: '123',
    fecha_creacion: new Date().toISOString(),
    fecha_termino: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const encuestaService = {
  // GET /encuestas
  getEncuestas: async (): Promise<Encuesta[]> => {
    // return fetch('/api/encuestas').then(r => r.json());
    return Promise.resolve(encuestasMock); // Simulado
  },

  // GET /encuestas/:id
  getEncuestaById: async (id: string): Promise<Encuesta | undefined> => {
    // return fetch(`/api/encuestas/${id}`).then(r => r.json());
    return Promise.resolve(encuestasMock.find(e => e.id === id));
  },

  // POST /encuestas
  createEncuesta: async (encuesta: Omit<Encuesta, 'id'>): Promise<Encuesta> => {
    // return fetch('/api/encuestas', { method: 'POST', body: JSON.stringify(encuesta), headers: { 'Content-Type': 'application/json' } }).then(r => r.json());
    const nueva = { ...encuesta, id: Date.now().toString() };
    encuestasMock.push(nueva);
    return Promise.resolve(nueva);
  },

  // PATCH /encuestas/:id
  updateEncuesta: async (id: string, updateData: Partial<Encuesta>): Promise<Encuesta | undefined> => {
    // return fetch(`/api/encuestas/${id}`, { method: 'PATCH', body: JSON.stringify(updateData), headers: { 'Content-Type': 'application/json' } }).then(r => r.json());
    const idx = encuestasMock.findIndex(e => e.id === id);
    if (idx !== -1) {
      encuestasMock[idx] = { ...encuestasMock[idx], ...updateData };
      return Promise.resolve(encuestasMock[idx]);
    }
    return Promise.resolve(undefined);
  },

  // Si necesitas eliminar una encuesta, pide a backend que agregue DELETE /encuestas/:id
  // deleteEncuesta: async (id: string) => {
  //   // Solicitar a backend implementar esta ruta si se requiere
  // },
};