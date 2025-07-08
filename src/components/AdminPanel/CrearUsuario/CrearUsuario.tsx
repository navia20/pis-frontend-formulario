import React, { useState, useEffect } from 'react';
import { usuarioService } from '../../../services/usuarioService';
import { carreraService } from '../../../services/carreraService';
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
    confirmarContraseña: '',
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [carreras, setCarreras] = useState<any[]>([]);
  const [loadingCarreras, setLoadingCarreras] = useState(true);
  const [errorCarreras, setErrorCarreras] = useState('');

  // Cargar carreras al montar el componente
  useEffect(() => {
    const cargarCarreras = async () => {
      try {
        const carrerasData = await carreraService.getCarreras();
        setCarreras(carrerasData);
        setErrorCarreras('');
      } catch (error) {
        console.error('Error cargando carreras:', error);
        setErrorCarreras('Error cargando carreras. Verifique la conexión con el servidor.');
        setCarreras([]);
      } finally {
        setLoadingCarreras(false);
      }
    };

    cargarCarreras();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    
    // Validar que las contraseñas coincidan
    if (form.contraseña !== form.confirmarContraseña) {
      setMensaje('Error: Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    
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
        confirmarContraseña: '',
      });
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      if (error.response?.data?.message) {
        setMensaje(`Error: ${error.response.data.message}`);
      } else {
        setMensaje('Error al crear usuario. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
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
      <input 
        name="confirmarContraseña" 
        value={form.confirmarContraseña} 
        onChange={handleChange} 
        placeholder="Confirmar Contraseña" 
        required 
        type="password"
        style={{
          borderColor: form.confirmarContraseña && form.contraseña !== form.confirmarContraseña ? '#e74c3c' : '#ddd'
        }}
      />
      {form.confirmarContraseña && form.contraseña !== form.confirmarContraseña && (
        <p className="error-message" style={{ fontSize: '0.85rem', marginTop: '5px' }}>
          Las contraseñas no coinciden
        </p>
      )}
      {form.tipo === 'alumno' && (
        <>
          <select 
            name="id_carrera" 
            value={form.id_carrera} 
            onChange={handleChange} 
            required
            disabled={loadingCarreras || errorCarreras !== ''}
          >
            <option value="">
              {loadingCarreras 
                ? 'Cargando carreras...' 
                : errorCarreras 
                  ? 'Error cargando carreras' 
                  : 'Seleccione una carrera'
              }
            </option>
            {carreras.map((carrera) => (
              <option key={carrera.id} value={carrera.id}>
                {carrera.nombre}
              </option>
            ))}
          </select>
          {errorCarreras && (
            <p className="error-message" style={{ fontSize: '0.85rem', marginTop: '5px' }}>
              {errorCarreras}
            </p>
          )}
          <input name="año_ingreso" value={form.año_ingreso} onChange={handleChange} placeholder="Año de Ingreso" required type="number" />
        </>
      )}
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear'}
      </button>
      {mensaje && (
        <p className={mensaje.includes('Error') ? 'error-message' : 'success-message'}>
          {mensaje}
        </p>
      )}
    </form>
  );
};