import React, { useState, useEffect } from 'react';
import { asignaturaService } from '../../../services/asignaturaService';
import { carreraService } from '../../../services/carreraService'; // Debes tener un service para carreras
import './AgregarAsignatura.css';

export const AgregarAsignatura: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [idCarrera, setIdCarrera] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [carreras, setCarreras] = useState<{ id: string; nombre: string }[]>([]);

  useEffect(() => {
    carreraService.getCarreras().then(setCarreras);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await asignaturaService.crearAsignatura({
        nombre,
        id_carrera: idCarrera,
        id_docentes: [],
      });
      setMensaje('Asignatura agregada');
      setNombre('');
      setIdCarrera('');
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
      <select
        value={idCarrera}
        onChange={e => setIdCarrera(e.target.value)}
        required
      >
        <option value="">Selecciona carrera</option>
        {carreras.map(c => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>
      <button type="submit">Agregar</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
};