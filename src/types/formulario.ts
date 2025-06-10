export interface Pregunta {
  id: number;
  texto: string;
  respuestas: string[];
  editando: boolean;
  respuestaCorrecta?: number;
}

export interface Formulario {
  id: number;
  titulo: string;
  preguntas: Pregunta[];
  asignatura?: string | null;
  fechaLimite?: string | null;
  enviado?: boolean;
  editandoTitulo?: boolean;
}