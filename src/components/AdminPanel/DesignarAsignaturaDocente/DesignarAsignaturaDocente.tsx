import React, { useEffect, useState } from 'react';
import { designacionService } from '../../../services/designacionService';
import './DesignarAsignaturaDocente.css';

interface Docente {
  id: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  activo: boolean;
}

interface Asignatura {
  id: string;
  nombre: string;
  id_carrera: string;
  id_docentes: string[];
}

export const DesignarAsignaturaDocente: React.FC = () => {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [filtros, setFiltros] = useState({ nombre: '', rut: '' });
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [asignaturaId, setAsignaturaId] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    designacionService.getDocentes().then(setDocentes);
    designacionService.getAsignaturas().then(setAsignaturas);
  }, []);

  // Filtrado dinámico
  const docentesFiltrados = docentes.filter(d =>
    (filtros.nombre === '' || `${d.nombres} ${d.apellidos}`.toLowerCase().includes(filtros.nombre.toLowerCase())) &&
    (filtros.rut === '' || d.rut.includes(filtros.rut))
  );

  // Selección múltiple
  const toggleSeleccion = (id: string) => {
    setSeleccionados(sel =>
      sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]
    );
  };

  const toggleSeleccionTodos = () => {
    if (seleccionados.length === docentesFiltrados.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(docentesFiltrados.map(d => d.id));
    }
  };

  const handleFiltro = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asignaturaId || seleccionados.length === 0) {
      setMensaje('Selecciona al menos un docente y una asignatura');
      return;
    }
    try {
      await designacionService.asignarAsignaturaDocentes(seleccionados, asignaturaId);
      setMensaje('Asignatura designada correctamente');
      setSeleccionados([]);
    } catch {
      setMensaje('Error al designar asignatura');
    }
  };

  return (
    <form className="form-designar-asignatura-docente" onSubmit={handleSubmit}>
      <h2>Designar Asignatura a Docentes</h2>
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
      </div>
      <div className="tabla-docentes">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={seleccionados.length === docentesFiltrados.length && docentesFiltrados.length > 0}
                  onChange={toggleSeleccionTodos}
                />
              </th>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {docentesFiltrados.map(d => (
              <tr key={d.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(d.id)}
                    onChange={() => toggleSeleccion(d.id)}
                  />
                </td>
                <td>{d.nombres} {d.apellidos}</td>
                <td>{d.rut}</td>
                <td>{d.email}</td>
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