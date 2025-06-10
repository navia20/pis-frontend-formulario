export interface RespuestaAlumno {
  idFormulario: number;
  respuestas: { [idPregunta: number]: string };
  fechaEnvio: string;
}