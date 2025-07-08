import React, { useEffect, useState } from 'react';
import { inscripcionService, Alumno } from '../../../services/inscripcionService';
import { asignaturaService, Asignatura } from '../../../services/asignaturaService';
import { carreraService, Carrera } from '../../../services/carreraService';
import './DesignarAsignaturaEstudiante.css';

export const DesignarAsignaturaEstudiante: React.FC = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [filtros, setFiltros] = useState({ 
    nombre: '', 
    rut: '', 
    carrera: '',
    año_ingreso: '' 
  });
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [asignaturaId, setAsignaturaId] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [designando, setDesignando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [alumnosData, asignaturasData, carrerasData] = await Promise.all([
        inscripcionService.getAlumnos(),
        asignaturaService.getAsignaturas(),
        carreraService.getCarreras()
      ]);
      
      setAlumnos(alumnosData);
      setAsignaturas(asignaturasData);
      setCarreras(carrerasData);
      
      console.log('Datos cargados:');
      console.log('Alumnos:', alumnosData);
      console.log('Carreras:', carrerasData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setMensaje('Error cargando datos del servidor');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el nombre de la carrera
  const obtenerNombreCarrera = (id_carrera: string) => {
    console.log('Buscando carrera para ID:', id_carrera);
    console.log('Carreras disponibles:', carreras);
    const carrera = carreras.find(c => c.id === id_carrera);
    console.log('Carrera encontrada:', carrera);
    return carrera ? carrera.nombre : `ID: ${id_carrera}`;
  };

  // Filtrado dinámico
  const alumnosFiltrados = alumnos.filter(alumno => {
    const nombreCompleto = `${alumno.nombres} ${alumno.apellidos}`.toLowerCase();
    const nombreCarrera = obtenerNombreCarrera(alumno.id_carrera).toLowerCase();
    
    const cumpleFiltroNombre = !filtros.nombre || nombreCompleto.includes(filtros.nombre.toLowerCase());
    const cumpleFiltroRut = !filtros.rut || alumno.rut.includes(filtros.rut);
    const cumpleFiltroCarrera = !filtros.carrera || nombreCarrera.includes(filtros.carrera.toLowerCase());
    const cumpleFiltroAño = !filtros.año_ingreso || alumno.año_ingreso.toString().includes(filtros.año_ingreso);
    
    return cumpleFiltroNombre && cumpleFiltroRut && cumpleFiltroCarrera && cumpleFiltroAño && alumno.activo;
  });

  // Selección múltiple
  const toggleSeleccion = (id: string) => {
    setSeleccionados(sel =>
      sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]
    );
  };

  const toggleSeleccionTodos = () => {
    if (seleccionados.length === alumnosFiltrados.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(alumnosFiltrados.map(a => a.id));
    }
  };

  const handleFiltro = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asignaturaId || seleccionados.length === 0) {
      setMensaje('Selecciona al menos un estudiante y una asignatura');
      return;
    }

    try {
      setDesignando(true);
      setMensaje('');
      
      await inscripcionService.inscribirMultiples(asignaturaId, seleccionados);
      
      setMensaje(`Asignatura designada correctamente a ${seleccionados.length} estudiante(s)`);
      setSeleccionados([]);
      setAsignaturaId('');
      
      // Opcional: Recargar datos para ver las inscripciones actualizadas
      await cargarDatos();
    } catch (error) {
      console.error('Error designando asignatura:', error);
      setMensaje('Error al designar asignatura. Algunos estudiantes podrían ya estar inscritos.');
    } finally {
      setDesignando(false);
    }
  };

  if (loading) {
    return (
      <div className="form-designar-asignatura-estudiante">
        <div className="loading">Cargando estudiantes y asignaturas...</div>
      </div>
    );
  }

  return (
    <form className="form-designar-asignatura-estudiante" onSubmit={handleSubmit}>
      <h2>Designar Asignatura a Estudiantes</h2>
      
      {/* Filtros */}
      <div className="filtros">
        <input
          name="nombre"
          placeholder="Buscar por nombre"
          value={filtros.nombre}
          onChange={handleFiltro}
        />
        <input
          name="rut"
          placeholder="Buscar por RUT"
          value={filtros.rut}
          onChange={handleFiltro}
        />
        <input
          name="carrera"
          placeholder="Buscar por carrera"
          value={filtros.carrera}
          onChange={handleFiltro}
        />
        <input
          name="año_ingreso"
          placeholder="Año de ingreso"
          value={filtros.año_ingreso}
          onChange={handleFiltro}
        />
      </div>

      {/* Estadísticas */}
      <div className="estadisticas">
        <span>Total estudiantes: {alumnos.length}</span>
        <span>Filtrados: {alumnosFiltrados.length}</span>
        <span>Seleccionados: {seleccionados.length}</span>
      </div>

      {/* Tabla de estudiantes */}
      <div className="tabla-estudiantes">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={seleccionados.length === alumnosFiltrados.length && alumnosFiltrados.length > 0}
                  onChange={toggleSeleccionTodos}
                />
              </th>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Email</th>
              <th>Carrera</th>
              <th>Año Ingreso</th>
            </tr>
          </thead>
          <tbody>
            {alumnosFiltrados.map(alumno => (
              <tr key={alumno.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(alumno.id)}
                    onChange={() => toggleSeleccion(alumno.id)}
                  />
                </td>
                <td>{alumno.nombres} {alumno.apellidos}</td>
                <td>{alumno.rut}</td>
                <td>{alumno.email}</td>
                <td>{obtenerNombreCarrera(alumno.id_carrera)}</td>
                <td>{alumno.año_ingreso}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {alumnosFiltrados.length === 0 && (
          <div className="no-resultados">
            No se encontraron estudiantes con los filtros aplicados
          </div>
        )}
      </div>

      {/* Selector de asignatura */}
      <div className="selector-asignatura">
        <select 
          value={asignaturaId} 
          onChange={e => setAsignaturaId(e.target.value)} 
          required
          disabled={designando}
        >
          <option value="">Selecciona una asignatura</option>
          {asignaturas.map(asignatura => (
            <option key={asignatura.id} value={asignatura.id}>
              {asignatura.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Botón de submit */}
      <button 
        type="submit" 
        disabled={designando || seleccionados.length === 0 || !asignaturaId}
        className={designando ? 'designando' : ''}
      >
        {designando ? 'Designando...' : `Designar a ${seleccionados.length} estudiante(s)`}
      </button>

      {/* Mensaje de estado */}
      {mensaje && (
        <div className={`mensaje ${mensaje.includes('Error') ? 'error' : 'success'}`}>
          {mensaje}
        </div>
      )}
    </form>
  );
};