import React, { useState, useEffect } from 'react';
import { asignaturaService } from '../../../services/asignaturaService';
import { carreraService } from '../../../services/carreraService';
import { usuarioService } from '../../../services/usuarioService';
import './AgregarAsignatura.css';

export const AgregarAsignatura: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [idCarrera, setIdCarrera] = useState('');
  const [idDocentes, setIdDocentes] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [carreras, setCarreras] = useState<{ id: string; nombre: string }[]>([]);
  const [docentes, setDocentes] = useState<any[]>([]);
  const [loadingCarreras, setLoadingCarreras] = useState(true);
  const [loadingDocentes, setLoadingDocentes] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [carrerasData, usuarios] = await Promise.all([
          carreraService.getCarreras(),
          usuarioService.getUsuarios()
        ]);
        setCarreras(carrerasData);
        // Filtrar solo docentes
        const docentesData = usuarios.filter(usuario => usuario.tipo === 'docente');
        setDocentes(docentesData);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setMensaje('Error cargando carreras y docentes');
      } finally {
        setLoadingCarreras(false);
        setLoadingDocentes(false);
      }
    };

    cargarDatos();
  }, []);

  const handleDocenteChange = (docenteId: string, isChecked: boolean) => {
    if (isChecked) {
      setIdDocentes([...idDocentes, docenteId]);
    } else {
      setIdDocentes(idDocentes.filter(id => id !== docenteId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    
    try {
      await asignaturaService.crearAsignatura({
        nombre,
        id_carrera: idCarrera,
        id_docentes: idDocentes,
      });
      setMensaje('Asignatura agregada correctamente');
      setNombre('');
      setIdCarrera('');
      setIdDocentes([]);
    } catch (error: any) {
      console.error('Error al agregar asignatura:', error);
      if (error.response?.data?.message) {
        setMensaje(`Error: ${error.response.data.message}`);
      } else {
        setMensaje('Error al agregar asignatura. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
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