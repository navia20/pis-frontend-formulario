import React, { useState } from 'react';
import { Logo } from '../Logo';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

// Datos de prueba
const usuarios = [
  { rut: '12345678K', password: 'admin123', rol: 'admin' },
  { rut: '87654321K', password: 'estudiante123', rol: 'estudiante' },
  { rut: '11223344K', password: 'docente123', rol: 'docente' },
];

export const LoginForm: React.FC = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación del RUT
    if (!/^[0-9]+[0-9kK]{1}$/.test(rut)) {
      setError('Por favor ingrese un RUT válido (sin guión ni puntos)');
      return;
    }
    
    // Buscar usuario en los datos de prueba
    const usuario = usuarios.find(
    (user) => user.rut.toLowerCase() === rut.toLowerCase() && user.password === password
  );

  console.log('Usuario encontrado:', usuario);

  if (!usuario) {
    setError('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
    return;
  }

  if (usuario.rol === 'admin') {
    navigate('/admin'); // Redirige a la página de admin
  } else if (usuario.rol === 'estudiante') {
    navigate('/estudiante'); // Redirige a la página de estudiante
  } else if (usuario.rol === 'docente') {
    navigate('/docente'); // Redirige a la página de docente
  }
  
  };

  return (
  <div className="login-root">
    <div className="login-container">
      <Logo />

      <h1 className="login-title">Bienvenido(a) al Sistema de medición Resultados de Aprendizaje</h1>
      <h2 className="login-subtitle">Iniciar Sesión</h2>

      <form onSubmit={handleSubmit}>
        <div className="login-form-group">
          <h3 className="login-h3">
            <label htmlFor="rut" className="login-label">RUT con dígito y sin guión</label>
          </h3>
          <input
            type="text"
            id="rut"
            className="login-input"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            placeholder="Ej: 12345678K"
            required
          />
        </div>

        <div className="login-form-group">
          <h3 className="login-h3">
            <label htmlFor="password" className="login-label">Contraseña</label>
          </h3>
          <input
            type="password"
            id="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="login-checkbox-container">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <h3 className="login-h3">
            <label htmlFor="remember" className="login-label">Recordar mis datos</label>
          </h3>
        </div>

        {error && <div className="login-error-message">{error}</div>}

        <div className="login-forgot-password">
          <a href="/forgot-password">¿Olvidaste tu Contraseña?</a>
        </div>

        <button type="submit" className="login-btn">Ingresar</button>
      </form>
    </div>
  </div>
);
};