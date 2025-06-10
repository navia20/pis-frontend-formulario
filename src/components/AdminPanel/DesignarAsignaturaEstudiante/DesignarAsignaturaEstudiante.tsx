import React, { useEffect, useState } from 'react';
import { asignaturaService } from '../../../services/asignaturaService';
import { designacionService } from '../../../services/designacionService';
import './DesignarAsignaturaEstudiante.css';

// Componente para asignar una asignatura a un estudiante
export const DesignarAsignaturaEstudiante: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<any[]>([]);
  const [asignaturas, setAsignaturas] = useState<any[]>([]);
  const [seleccion, setSeleccion] = useState({ estudianteId: '', asignaturaId: '' });
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    designacionService.getEstudiantes().then(setEstudiantes);
    asignaturaService.getAsignaturas().then(setAsignaturas);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeleccion({ ...seleccion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await designacionService.asignarAsignaturaEstudiante(seleccion.estudianteId, seleccion.asignaturaId);
      setMensaje('Asignatura designada correctamente');
    } catch {
      setMensaje('Error al designar asignatura');
    }
  };

  return (
    <form className="form-designar-asignatura" onSubmit={handleSubmit}>
      <h2>Designar Asignatura a Estudiante</h2>
      <select name="estudianteId" value={seleccion.estudianteId} onChange={handleChange} required>
        <option value="">Selecciona estudiante</option>
        {estudiantes.map(e => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}
      </select>
      <select name="asignaturaId" value={seleccion.asignaturaId} onChange={handleChange} required>
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