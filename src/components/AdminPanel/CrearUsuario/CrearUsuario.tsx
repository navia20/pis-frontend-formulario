import React, { useState } from 'react';
import { usuarioService } from '../../../services/usuarioService';
import './CrearUsuario.css';

// Componente para crear un usuario (alumno o docente)
export const CrearUsuario: React.FC = () => {
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    rut: '',
    email: '',
    tipo: 'alumno', // 'alumno' o 'docente'
    id_carrera: '',
    año_ingreso: '',
    contraseña: '',
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usuarioService.crearUsuario(form);
      setMensaje('Usuario creado correctamente');
      setForm({
        nombres: '',
        apellidos: '',
        rut: '',
        email: '',
        tipo: 'alumno',
        id_carrera: '',
        año_ingreso: '',
        contraseña: '',
      });
    } catch {
      setMensaje('Error al crear usuario');
    }
  };

  return (
    <form className="form-crear-usuario" onSubmit={handleSubmit}>
      <h2>Crear Usuario</h2>
      <select name="tipo" value={form.tipo} onChange={handleChange}>
        <option value="alumno">Alumno</option>
        <option value="docente">Docente</option>
      </select>
      <input name="nombres" value={form.nombres} onChange={handleChange} placeholder="Nombres" required />
      <input name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Apellidos" required />
      <input name="rut" value={form.rut} onChange={handleChange} placeholder="RUT" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required type="email" />
      <input name="contraseña" value={form.contraseña} onChange={handleChange} placeholder="Contraseña" required type="password" />
      {form.tipo === 'alumno' && (
        <>
          <input name="id_carrera" value={form.id_carrera} onChange={handleChange} placeholder="ID Carrera" required />
          <input name="año_ingreso" value={form.año_ingreso} onChange={handleChange} placeholder="Año de Ingreso" required type="number" />
        </>
      )}
      <button type="submit">Crear</button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  );
};