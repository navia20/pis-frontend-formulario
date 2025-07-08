export interface PreguntaAlumno {
  id: number;
  texto: string;
  respuestas: string[];
  respuestaCorrecta?: number; // Índice de la respuesta correcta
}

export interface FormularioAlumno {
  id: number;
  idOriginal?: string; // ID original de la encuesta en el backend
  titulo: string;
  preguntas: PreguntaAlumno[];
  asignatura?: string | null;
  fechaLimite?: string | null;
  enviado?: boolean;
  correccionHabilitada?: boolean;
  respuestasCorrectas?: { [idPregunta: number]: string };
}