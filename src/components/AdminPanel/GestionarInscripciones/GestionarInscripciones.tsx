import React, { useEffect, useState } from 'react';
import { inscripcionService, Inscripcion, Alumno } from '../../../services/inscripcionService';
import { asignaturaService, Asignatura } from '../../../services/asignaturaService';
import { carreraService } from '../../../services/carreraService';
import './GestionarInscripciones.css';

interface InscripcionConDatos {
  inscripcion: Inscripcion;
  alumno: Alumno | null;
  asignatura: Asignatura | null;
}

export const GestionarInscripciones: React.FC = () => {
  const [inscripciones, setInscripciones] = useState<InscripcionConDatos[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [carreras, setCarreras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [filtros, setFiltros] = useState({
    alumno: '',
    asignatura: '',
    estado: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      const [inscripcionesData, alumnosData, asignaturasData, carrerasData] = await Promise.all([
        inscripcionService.getInscripciones(),
        inscripcionService.getAlumnos(),
        asignaturaService.getAsignaturas(),
        carreraService.getCarreras()
      ]);

      setAlumnos(alumnosData);
      setAsignaturas(asignaturasData);
      setCarreras(carrerasData);

      // Combinar datos de inscripciones con información de alumnos y asignaturas
      const inscripcionesConDatos: InscripcionConDatos[] = inscripcionesData.map(inscripcion => ({
        inscripcion,
        alumno: alumnosData.find(a => a.id === inscripcion.id_alumno) || null,
        asignatura: asignaturasData.find(a => a.id === inscripcion.id_asignatura) || null
      }));

      setInscripciones(inscripcionesConDatos);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setMensaje('Error cargando datos del servidor');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el nombre de la carrera
  const obtenerNombreCarrera = (id_carrera: string) => {
    const carrera = carreras.find(c => c.id === id_carrera);
    return carrera ? carrera.nombre : id_carrera;
  };

  const inscripcionesFiltradas = inscripciones.filter(item => {
    const cumpleFiltroAlumno = !filtros.alumno || 
      (item.alumno && `${item.alumno.nombres} ${item.alumno.apellidos}`.toLowerCase().includes(filtros.alumno.toLowerCase()));
    
    const cumpleFiltroAsignatura = !filtros.asignatura || 
      (item.asignatura && item.asignatura.nombre.toLowerCase().includes(filtros.asignatura.toLowerCase()));
    
    const cumpleFiltroEstado = !filtros.estado || item.inscripcion.estado === filtros.estado;
    
    return cumpleFiltroAlumno && cumpleFiltroAsignatura && cumpleFiltroEstado && item.inscripcion.activo;
  });

  const handleFiltro = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const eliminarInscripcion = async (inscripcionId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta inscripción?')) {
      return;
    }

    try {
      await inscripcionService.eliminarInscripcion(inscripcionId);
      setMensaje('Inscripción eliminada correctamente');
      await cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('Error eliminando inscripción:', error);
      setMensaje('Error al eliminar inscripción');
    }
  };

  const cambiarEstadoInscripcion = async (inscripcionId: string, nuevoEstado: string) => {
    try {
      await inscripcionService.actualizarEstadoInscripcion(inscripcionId, nuevoEstado);
      setMensaje(`Estado actualizado a: ${nuevoEstado}`);
      await cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('Error actualizando estado:', error);
      setMensaje('Error al actualizar estado');
    }
  };

  if (loading) {
    return (
      <div className="gestionar-inscripciones">
        <div className="loading">Cargando inscripciones...</div>
      </div>
    );
  }

  return (
    <div className="gestionar-inscripciones">
      <h2>Gestionar Inscripciones de Estudiantes</h2>

      {mensaje && (
        <div className={`mensaje ${mensaje.includes('Error') ? 'error' : 'success'}`}>
          {mensaje}
        </div>
      )}

      {/* Filtros */}
      <div className="filtros">
        <input
          name="alumno"
          placeholder="Buscar por nombre de alumno"
          value={filtros.alumno}
          onChange={handleFiltro}
        />
        <input
          name="asignatura"
          placeholder="Buscar por asignatura"
          value={filtros.asignatura}
          onChange={handleFiltro}
        />
        <select
          name="estado"
          value={filtros.estado}
          onChange={handleFiltro}
        >
          <option value="">Todos los estados</option>
          <option value="inscrito">Inscrito</option>
          <option value="retirado">Retirado</option>
          <option value="completado">Completado</option>
        </select>
      </div>

      {/* Estadísticas */}
      <div className="estadisticas">
        <span>Total inscripciones: {inscripciones.length}</span>
        <span>Filtradas: {inscripcionesFiltradas.length}</span>
        <span>Activas: {inscripciones.filter(i => i.inscripcion.activo).length}</span>
      </div>

      {/* Tabla de inscripciones */}
      <div className="tabla-inscripciones">
        <table>
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>RUT</th>
              <th>Asignatura</th>
              <th>Estado</th>
              <th>Fecha Inscripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inscripcionesFiltradas.map(item => (
              <tr key={item.inscripcion.id}>
                <td>
                  {item.alumno ? 
                    `${item.alumno.nombres} ${item.alumno.apellidos}` : 
                    'Alumno no encontrado'
                  }
                </td>
                <td>{item.alumno?.rut || 'N/A'}</td>
                <td>{item.asignatura?.nombre || 'Asignatura no encontrada'}</td>
                <td>
                  <span className={`estado estado-${item.inscripcion.estado}`}>
                    {item.inscripcion.estado}
                  </span>
                </td>
                <td>
                  {new Date(item.inscripcion.fecha_inscripcion).toLocaleDateString()}
                </td>
                <td>
                  <div className="acciones">
                    <select
                      value={item.inscripcion.estado}
                      onChange={(e) => cambiarEstadoInscripcion(item.inscripcion.id, e.target.value)}
                      className="select-estado"
                    >
                      <option value="inscrito">Inscrito</option>
                      <option value="retirado">Retirado</option>
                      <option value="completado">Completado</option>
                    </select>
                    <button
                      onClick={() => eliminarInscripcion(item.inscripcion.id)}
                      className="btn-eliminar"
                      title="Eliminar inscripción"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {inscripcionesFiltradas.length === 0 && (
          <div className="no-resultados">
            No se encontraron inscripciones con los filtros aplicados
          </div>
        )}
      </div>

      <div className="acciones-generales">
        <button onClick={cargarDatos} className="btn-actualizar">
          Actualizar Lista
        </button>
      </div>
    </div>
  );
};
