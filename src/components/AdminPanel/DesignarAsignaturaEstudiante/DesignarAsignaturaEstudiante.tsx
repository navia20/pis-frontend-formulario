import React, { useEffect, useState } from 'react';
import { asignaturaService } from '../../../services/asignaturaService';
import { designacionService } from '../../../services/designacionService';
import './DesignarAsignaturaEstudiante.css';

interface Alumno {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  id_carrera: string;
  año_ingreso: number;
  activo: boolean;
}

export const DesignarAsignaturaEstudiante: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Alumno[]>([]);
  const [asignaturas, setAsignaturas] = useState<any[]>([]);
  const [filtros, setFiltros] = useState({ nombre: '', rut: '', año: '', carrera: '' });
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [asignaturaId, setAsignaturaId] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
  designacionService.getEstudiantes().then(data => {
    setEstudiantes(data);
  });
  asignaturaService.getAsignaturas().then(setAsignaturas);
}, []);

  // Filtrado dinámico
  const estudiantesFiltrados = estudiantes.filter(e =>
    (filtros.nombre === '' || `${e.nombres} ${e.apellidos}`.toLowerCase().includes(filtros.nombre.toLowerCase())) &&
    (filtros.rut === '' || e.rut.includes(filtros.rut)) &&
    (filtros.año === '' || String(e.año_ingreso) === filtros.año) &&
    (filtros.carrera === '' || e.id_carrera === filtros.carrera)
  );

  // Selección múltiple
  const toggleSeleccion = (id: string) => {
    setSeleccionados(sel =>
      sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]
    );
  };

  const toggleSeleccionTodos = () => {
    if (seleccionados.length === estudiantesFiltrados.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(estudiantesFiltrados.map(e => e.id));
    }
  };

  const handleFiltro = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asignaturaId || seleccionados.length === 0) {
      setMensaje('Selecciona al menos un estudiante y una asignatura');
      return;
    }
    try {
      await designacionService.asignarAsignaturaEstudiantes(seleccionados, asignaturaId);
      setMensaje('Asignatura designada correctamente');
      setSeleccionados([]);
    } catch {
      setMensaje('Error al designar asignatura');
    }
  };

  // Opcional: obtener lista de carreras y años únicos para los filtros
  const carreras = Array.from(new Set(estudiantes.map(e => e.id_carrera)));
  const años = Array.from(new Set(estudiantes.map(e => e.año_ingreso)));

  return (
    <form className="form-designar-asignatura" onSubmit={handleSubmit}>
      <h2>Designar Asignatura a Estudiantes</h2>
      <div className="filtros">
        <input name="nombre" placeholder="Buscar por nombre" value={filtros.nombre} onChange={handleFiltro} />
        <input name="rut" placeholder="Buscar por RUT" value={filtros.rut} onChange={handleFiltro} />
        <select name="carrera" value={filtros.carrera} onChange={handleFiltro}>
          <option value="">Todas las carreras</option>
          {carreras.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="año" value={filtros.año} onChange={handleFiltro}>
          <option value="">Todos los años</option>
          {años.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div className="tabla-estudiantes">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={seleccionados.length === estudiantesFiltrados.length && estudiantesFiltrados.length > 0}
                  onChange={toggleSeleccionTodos}
                />
              </th>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Carrera</th>
              <th>Año ingreso</th>
            </tr>
          </thead>
          <tbody>
            {estudiantesFiltrados.map(e => (
              <tr key={e.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(e.id)}
                    onChange={() => toggleSeleccion(e.id)}
                  />
                </td>
                <td>{e.nombres} {e.apellidos}</td>
                <td>{e.rut}</td>
                <td>{e.id_carrera}</td>
                <td>{e.año_ingreso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <select value={asignaturaId} onChange={e => setAsignaturaId(e.target.value)} required>
        <option value="">Selecciona asignatura</option>
        {asignaturas.map(a => (
          <option key={a.id} value={a.id}>{a.nombre}</option>
        ))}
      </select>
      <button type="submit">Designar</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
};