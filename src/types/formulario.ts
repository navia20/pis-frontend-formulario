export interface Pregunta {
  id: string;
  texto: string;
  respuestas: string[];
  editando: boolean;
  respuestaCorrecta?: number;
}

export interface Formulario {
  id?: string;
  titulo: string;
  preguntas: Pregunta[];
  asignatura?: string | null;
  fechaLimite?: string | null;
  enviado?: boolean;
  editandoTitulo?: boolean;
  descripcion?: string;
  id_asignatura?: string;
  fecha_creacion?: string;
  fecha_termino?: string;
  publicado?: boolean;
  activo?: boolean;
}