import React, { useState } from 'react';
import { Logo } from '../Logo';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import axios from 'axios';

export const LoginForm: React.FC = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<'docente' | 'estudiante'>('docente');
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validación del RUT
    if (!/^[0-9]+[0-9kK]{1}$/.test(rut)) {
      setError('Por favor ingrese un RUT válido (sin guión ni puntos)');
      return;
    }
    
    try {
      const tipo = tipoUsuario === 'estudiante' ? 'alumno' : 'docente';
      const response = await axios.post('http://localhost:3000/auth/login', {
        rut,
        password,
        tipo,
      });
      
      if (response.data && response.data.accessToken) {
        if (tipo === 'alumno') {
          navigate('/estudiante');
        } else {
          navigate('/docente');
        }
      } else {
        setError('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
      }
    } catch (error) {
      setError('Error al conectar con el servidor. Intente más tarde.');
      console.error(error);
    }
  };

  return (
    <div className="login-root">
      <div className="login-container">
        <Logo />

        <h1 className="login-title">Bienvenido(a) al Sistema de medición Resultados de Aprendizaje</h1>
        <h2 className="login-subtitle">Iniciar Sesión</h2>

        {/* Selector visual de tipo de usuario */}
        <div className="login-form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <label htmlFor="tipoUsuario" className="login-label" style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            Tipo de usuario
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
            <button
              type="button"
              className={`login-btn${tipoUsuario === 'docente' ? ' login-btn-selected' : ''}`}
              style={{ 
                background: tipoUsuario === 'docente' ? '#1976d2' : '#e0e0e0', 
                color: tipoUsuario === 'docente' ? '#fff' : '#333', 
                border: 'none', 
                borderRadius: 8, 
                padding: '8px 16px', 
                cursor: 'pointer', 
                fontWeight: 500, 
                minWidth: 100,
                fontSize: '0.9rem'
              }}
              onClick={() => setTipoUsuario('docente')}
            >
              Docente
            </button>
            <button
              type="button"
              className={`login-btn${tipoUsuario === 'estudiante' ? ' login-btn-selected' : ''}`}
              style={{ 
                background: tipoUsuario === 'estudiante' ? '#1976d2' : '#e0e0e0', 
                color: tipoUsuario === 'estudiante' ? '#fff' : '#333', 
                border: 'none', 
                borderRadius: 8, 
                padding: '8px 16px', 
                cursor: 'pointer', 
                fontWeight: 500, 
                minWidth: 100,
                fontSize: '0.9rem'
              }}
              onClick={() => setTipoUsuario('estudiante')}
            >
              Estudiante
            </button>
          </div>
        </div>

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

          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <button type="submit" className="login-btn">Ingresar</button>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '0px' }}>
            <a 
              href="/login-admin" 
              style={{ 
                color: '#1976d2', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              Acceso de Administrador
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};