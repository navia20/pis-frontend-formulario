import React, { useState } from 'react';
import { Logo } from '../Logo';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export const LoginAdminForm: React.FC = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validación del RUT
    if (!/^[0-9]+[0-9kK]{1}$/.test(rut)) {
      setError('Por favor ingrese un RUT válido (sin guión ni puntos)');
      return;
    }
    
    try {
      // Usar el servicio de autenticación en lugar de axios directo
      const response = await authService.login(rut, password, 'admin');
      
      if (response && response.accessToken) {
        console.log('Login de admin exitoso. Redirigiendo al panel de administración');
        
        // También obtener el perfil del admin para validar
        try {
          const profile = await authService.getProfile();
          console.log('Perfil de admin cargado:', profile);
        } catch (profileError) {
          console.error('Error al cargar perfil del admin:', profileError);
        }
        
        navigate('/admin');
      } else {
        setError('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setError('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
      } else {
        setError('Error al conectar con el servidor. Intente más tarde.');
      }
      console.error('Error en login de admin:', error);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="login-root">
      <div className="login-container">
        <Logo />

        <h1 className="login-title">Sistema de medición Resultados de Aprendizaje</h1>
        <h2 className="login-subtitle">Acceso de Administrador</h2>

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
            <a href="/solicitar-recuperacion">¿Olvidaste tu Contraseña?</a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
            <button type="submit" className="login-btn">Ingresar como Administrador</button>
            
            <button 
              type="button" 
              className="login-btn" 
              style={{ 
                background: '#6c757d', 
                fontSize: '0.9rem',
                padding: '10px 16px'
              }}
              onClick={handleBackToLogin}
            >
              Volver al Login Principal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
