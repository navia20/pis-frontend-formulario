import React, { useState } from 'react';
import { asignaturaService } from '../../../services/asignaturaService';
import './AgregarAsignatura.css';

// Componente para agregar una nueva asignatura
export const AgregarAsignatura: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await asignaturaService.crearAsignatura({ nombre, id_carrera: 'carrera1', id_docentes: [] });
      setMensaje('Asignatura agregada');
      setNombre('');
    } catch {
      setMensaje('Error al agregar asignatura');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="agregar-asignatura-form">
      <h2>Agregar Asignatura</h2>
      <input
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        placeholder="Nombre"
        required
      />
      <button type="submit">Agregar</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
};