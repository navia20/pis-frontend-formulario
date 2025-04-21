import React, { useState } from 'react';
import { Logo } from '../Logo';
import './LoginForm.css';


export const LoginForm: React.FC = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación del RUT
    if (!/^[0-9]+[0-9kK]{1}$/.test(rut)) {
      setError('Por favor ingrese un RUT válido (sin guión ni puntos)');
      return;
    }
    
    setError('');
    console.log('Iniciando sesión con:', { rut, password, rememberMe });
    // Aquí iría la llamada a la API para autenticar
  };

  return (
    <div className="login-container">
      <Logo />
      
      <h1>Bienvenido(a) al Sistema de medición Resultados de Aprendizaje</h1>
        <h2>Iniciar Sesión</h2>
      
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rut">RUT con dígito y sin guión</label>
          <input
            type="text"
            id="rut"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            placeholder="Ej: 12345678K"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember">Recordar mis datos</label>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="forgot-password">
          <a href="/forgot-password">¿Olvidaste tu Contraseña?</a>
        </div>
        
        <button type="submit" className="btn">Ingresar</button>
      </form>
    </div>
  );
};