export interface PreguntaAlumno {
  id: number;
  texto: string;
  respuestas: string[];
}

export interface FormularioAlumno {
  id: number;
  titulo: string;
  preguntas: PreguntaAlumno[];
  asignatura?: string | null;
  fechaLimite?: string | null;
  enviado?: boolean;
  correccionHabilitada?: boolean;
  respuestasCorrectas?: { [idPregunta: number]: string };
}