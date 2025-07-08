import React, { useEffect, useState } from 'react';
import { asignaturaService } from '../../../services/asignaturaService';
import { docenteService } from '../../../services/docenteService';
import type { Docente } from '../../../services/docenteService';
import './DesignarAsignaturaDocente.css';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Obtener docentes y asignaturas en paralelo
        const [docentesData, asignaturasData] = await Promise.all([
          docenteService.getDocentes(),
          asignaturaService.getAsignaturas()
        ]);
        
        setDocentes(docentesData);
        setAsignaturas(asignaturasData);
        
        console.log('Docentes cargados:', docentesData);
        console.log('Asignaturas cargadas:', asignaturasData);
        
      } catch (error) {
        console.error('Error cargando datos:', error);
        setMensaje('Error cargando datos. Verifica que el backend esté funcionando.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
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
    // Limpiar mensaje cuando el usuario empieza a filtrar
    if (mensaje) setMensaje('');
  };

  if (loading) {
    return (
      <div className="form-designar-asignatura-docente">
        <h2>Designar Asignatura a Docentes</h2>
        <div className="loading-message">
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asignaturaId || seleccionados.length === 0) {
      setMensaje('Selecciona al menos un docente y una asignatura');
      return;
    }
    
    try {
      setLoading(true);
      setMensaje('Designando asignatura...');
      
      // Designar la asignatura a los docentes seleccionados
      await asignaturaService.designarDocentes(asignaturaId, seleccionados);
      
      const asignaturaSeleccionada = asignaturas.find(a => a.id === asignaturaId);
      const docentesSeleccionados = docentes.filter(d => seleccionados.includes(d.id));
      const nombresDocentes = docentesSeleccionados.map(d => `${d.nombres} ${d.apellidos}`).join(', ');
      
      setMensaje(`Asignatura "${asignaturaSeleccionada?.nombre}" designada correctamente a: ${nombresDocentes}`);
      setSeleccionados([]);
      setAsignaturaId('');
      
      // Actualizar la lista de asignaturas para reflejar los cambios
      const asignaturasActualizadas = await asignaturaService.getAsignaturas();
      setAsignaturas(asignaturasActualizadas);
      
    } catch (error: any) {
      console.error('Error al designar asignatura:', error);
      setMensaje(`Error al designar asignatura: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
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
      
      <div className="info-seleccion">
        <p>Docentes seleccionados: {seleccionados.length}</p>
        {seleccionados.length > 0 && (
          <p className="docentes-seleccionados">
            {docentes
              .filter(d => seleccionados.includes(d.id))
              .map(d => `${d.nombres} ${d.apellidos}`)
              .join(', ')
            }
          </p>
        )}
      </div>
      
      <button type="submit" disabled={loading || !asignaturaId || seleccionados.length === 0}>
        {loading ? 'Designando...' : 'Designar'}
      </button>
      
      {mensaje && (
        <div className={`mensaje ${mensaje.includes('Error') ? 'error' : 'success'}`}>
          {mensaje}
        </div>
      )}
    </form>
  );
};