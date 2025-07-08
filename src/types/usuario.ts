export interface UsuarioBase {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  tipo: 'alumno' | 'docente' | 'admin';
}

export interface Admin extends UsuarioBase {
  tipo: 'admin';
  rol: string;
}

export interface Docente extends UsuarioBase {
  tipo: 'docente';
  asignaturas?: string[];
  estudiantes_total?: number;
}

export interface Alumno extends UsuarioBase {
  tipo: 'alumno';
  id_carrera?: string;
  nombre_carrera?: string;
  año_ingreso?: string;
  asignaturas?: string[];
}

export type Usuario = Admin | Docente | Alumno;