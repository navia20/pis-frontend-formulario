import React, { useState, useEffect } from "react";
import "./panel-inicio.css";

interface UsuarioBase {
  id: string;
  nombres: string;
  apellidos: string;
  tipo: "docente" | "alumno" | "admin";
}

interface Docente extends UsuarioBase {
  tipo: "docente";
  asignaturas?: string[];
  estudiantes_total?: number;
}

interface Alumno extends UsuarioBase {
  tipo: "alumno";
  nombre_carrera?: string;
  semestre?: string;
  asignaturas?: string[];
  año_ingreso?: string;
}

interface Admin extends UsuarioBase {
  tipo: "admin";
  total_usuarios?: number;
  total_docentes?: number;
  total_alumnos?: number;
}

type Usuario = Docente | Alumno | Admin;

interface PanelInicioProps {
  usuario?: Usuario;
}

export const PanelInicio: React.FC<PanelInicioProps> = ({ usuario }) => {
  const [usuarioActual, setUsuarioActual] = useState<Usuario | undefined>(usuario);
  const [horaActual, setHoraActual] = useState<string>("");

  useEffect(() => {
    // Usar siempre el usuario proporcionado por props, sin fallback a datos mock
    setUsuarioActual(usuario);

    // Actualizar hora actual
    const actualizarHora = () => {
      const ahora = new Date();
      const hora = ahora.getHours();
      if (hora < 12) {
        setHoraActual("Buenos días");
      } else if (hora < 18) {
        setHoraActual("Buenas tardes");
      } else {
        setHoraActual("Buenas noches");
      }
    };

    actualizarHora();
    const intervalo = setInterval(actualizarHora, 60000);

    return () => clearInterval(intervalo);
  }, [usuario]);

  if (!usuarioActual) {
    return (
      <div className="panel-container">
        <div className="loading-message">
          <p>Cargando panel de inicio...</p>
        </div>
      </div>
    );
  }

  const getTituloPrincipal = () => {
    switch (usuarioActual.tipo) {
      case "docente":
        return "Panel de Docente";
      case "alumno":
        return "Panel de Estudiante";
      case "admin":
        return "Panel de Administración";
      default:
        return "Panel de Usuario";
    }
  };

  // Estadísticas según tipo de usuario
  const getEstadisticas = () => {
    switch (usuarioActual.tipo) {
      case "docente":
        const docente = usuarioActual as Docente;
        return [
          { label: "Estudiantes Total", valor: docente.estudiantes_total || 0, color: "green", esTexto: false },
          { label: "Asignaturas", valor: docente.asignaturas?.length || 0, color: "purple", esTexto: false },
        ];
      case "alumno":
        const alumno = usuarioActual as Alumno;
        return [
          { label: "Carrera", valor: alumno.nombre_carrera || "-", color: "blue", esTexto: true },
          { label: "Año de Ingreso", valor: alumno.año_ingreso || "-", color: "green", esTexto: true },
          { label: "Asignaturas cursando", valor: alumno.asignaturas || [], color: "purple" },
        ];
      case "admin":
        const admin = usuarioActual as Admin;
        return [
          { label: "Total Usuarios", valor: admin.total_usuarios || 0, color: "blue", esTexto: false },
          { label: "Docentes Activos", valor: admin.total_docentes || 0, color: "green", esTexto: false },
          { label: "Estudiantes Activos", valor: admin.total_alumnos || 0, color: "purple", esTexto: false },
        ];
      default:
        return [];
    }
  };

  const estadisticas = getEstadisticas();

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div className="header-content">
          <div className="welcome-text">
            <h1>
              {horaActual}, {usuarioActual.nombres}
            </h1>
            <p>Bienvenido al {getTituloPrincipal()}</p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h2 className="section-title">Resumen</h2>
        <div className="stats-grid">
          {estadisticas.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <p className={`stat-value ${stat.color}`}>
                {Array.isArray(stat.valor) ? (
                  <div className="asignaturas-list">
                    {stat.valor.length > 0
                      ? stat.valor.map((asig: string, idx: number) => (
                          <span className="asignatura-chip" key={idx}>{asig}</span>
                        ))
                      : <span className="asignatura-chip asignatura-chip-vacia">Sin asignaturas</span>
                    }
                  </div>
                ) : (
                  stat.valor
                )}
              </p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};