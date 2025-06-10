import React, { useEffect, useState } from 'react';
import { asignaturaService } from '../../../services/asignaturaService';
import { designacionService } from '../../../services/designacionService';
import './DesignarAsignaturaDocente.css';

// Componente para asignar una asignatura a un docente
export const DesignarAsignaturaDocente: React.FC = () => {
  const [docentes, setDocentes] = useState<any[]>([]);
  const [asignaturas, setAsignaturas] = useState<any[]>([]);
  const [seleccion, setSeleccion] = useState({ docenteId: '', asignaturaId: '' });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    designacionService.getDocentes().then(setDocentes);
    asignaturaService.getAsignaturas().then(setAsignaturas);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeleccion({ ...seleccion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await designacionService.asignarAsignaturaDocente(seleccion.docenteId, seleccion.asignaturaId);
      setMensaje('Asignatura designada correctamente');
    } catch {
      setMensaje('Error al designar asignatura');
    }
  };

  return (
    <form className="form-designar-asignatura-docente" onSubmit={handleSubmit}>
      <h2>Designar Asignatura a Docente</h2>
      <select name="docenteId" value={seleccion.docenteId} onChange={handleChange} required>
        <option value="">Selecciona docente</option>
        {docentes.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
      </select>
      <select name="asignaturaId" value={seleccion.asignaturaId} onChange={handleChange} required>
        <option value="">Selecciona asignatura</option>
        {asignaturas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
      </select>
      <button type="submit">Designar</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
};