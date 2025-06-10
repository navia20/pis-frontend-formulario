export interface Pregunta {
  id: number;
  texto: string;
  respuestas: string[];
}
export interface FormularioDocente {
  id: number;
  titulo: string;
  preguntas: Pregunta[];
  asignatura?: string;
  fechaLimite?: string;
  enviado?: boolean;
  correccionHabilitada?: boolean;
  respuestasCorrectas?: { [idPregunta: number]: string };
}
export interface RespuestaAlumno {
  idFormulario: number;
  respuestas: { [idPregunta: number]: string };
  fechaEnvio: string;
  alumnoId: string;
  alumnoNombre: string;
}