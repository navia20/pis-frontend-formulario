import React, { useState, useEffect } from 'react';
import { Logo } from '../Logo';
import '../LoginForm/LoginForm.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface LocationState {
  email?: string;
  token?: string;
  codigoVerificado?: boolean;
}

export const NuevaPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as LocationState;
  const email = state?.email || '';
  const token = state?.token || '';

  // Si no hay email o token, redirigir a solicitar recuperación
  useEffect(() => {
    if (!email || !token || !state?.codigoVerificado) {
      navigate('/solicitar-recuperacion');
    }
  }, [email, token, state?.codigoVerificado, navigate]);

  const validarPassword = (pass: string): string[] => {
    const errores: string[] = [];
    
    if (pass.length < 8) {
      errores.push('Debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(pass)) {
      errores.push('Debe contener al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(pass)) {
      errores.push('Debe contener al menos una letra minúscula');
    }
    if (!/\d/.test(pass)) {
      errores.push('Debe contener al menos un número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      errores.push('Debe contener al menos un carácter especial');
    }
    
    return errores;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    const erroresPassword = validarPassword(password);
    if (erroresPassword.length > 0) {
      setError('Contraseña no válida:\n' + erroresPassword.join('\n'));
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/cambiar-password`, {
        email: email,
        token: token,
        nuevaPassword: password
      });

      if (response.data.success) {
        console.log('Contraseña cambiada exitosamente');
        setSuccess(true);
        
        // Redirigir al login después de 5 segundos
        setTimeout(() => {
          navigate('/');
        }, 5000);
      }
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      
      if (error.response?.status === 400) {
        setError('Token inválido o expirado');
      } else if (error.response?.status === 404) {
        setError('Usuario no encontrado');
      } else {
        setError('Error al cambiar la contraseña. Intente nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/verificar-codigo', { 
      state: { 
        email: email,
        codigoEnviado: true 
      } 
    });
  };

  if (success) {
    return (
      <div className="login-root">
        <div className="login-container">
          <Logo />
          <h1 className="login-title">Contraseña Actualizada</h1>
          
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#155724'
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '1.2rem' }}>
              ✅ ¡Contraseña cambiada exitosamente!
            </p>
            <p style={{ margin: '0', fontSize: '0.9rem' }}>
              Tu contraseña ha sido actualizada correctamente.
            </p>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem' }}>
              Redirigiendo al login en 5 segundos...
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button 
              className="login-btn"
              onClick={() => navigate('/')}
            >
              Ir al Login Ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  const erroresPassword = password ? validarPassword(password) : [];

  return (
    <div className="login-root">
      <div className="login-container">
        <Logo />

        <h1 className="login-title">Nueva Contraseña</h1>
        <h2 className="login-subtitle">
          Ingresa tu nueva contraseña para<br/>
          <strong>{email}</strong>
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <h3 className="login-h3">
              <label htmlFor="password" className="login-label">Nueva Contraseña</label>
            </h3>
            <div style={{ position: 'relative' }}>
              <input
                type={mostrarPassword ? 'text' : 'password'}
                id="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                required
                disabled={loading}
                style={{ paddingRight: '50px' }}
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#666'
                }}
              >
                {mostrarPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="login-form-group">
            <h3 className="login-h3">
              <label htmlFor="confirmPassword" className="login-label">Confirmar Contraseña</label>
            </h3>
            <input
              type={mostrarPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="login-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu nueva contraseña"
              required
              disabled={loading}
            />
          </div>

          {/* Requisitos de contraseña */}
          <div style={{ 
            marginBottom: '15px', 
            padding: '10px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '5px',
            fontSize: '0.8rem'
          }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Requisitos de contraseña:</p>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              {[
                { text: 'Al menos 8 caracteres', valid: password.length >= 8 },
                { text: 'Una letra mayúscula', valid: /[A-Z]/.test(password) },
                { text: 'Una letra minúscula', valid: /[a-z]/.test(password) },
                { text: 'Un número', valid: /\d/.test(password) },
                { text: 'Un carácter especial', valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
              ].map((req, index) => (
                <li 
                  key={index}
                  style={{ 
                    color: password ? (req.valid ? '#28a745' : '#dc3545') : '#666',
                    marginBottom: '2px'
                  }}
                >
                  {password ? (req.valid ? '✅' : '❌') : '⚪'} {req.text}
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="login-error-message" style={{ 
              marginBottom: '15px',
              whiteSpace: 'pre-line'
            }}>
              {error}
            </div>
          )}

          {/* Indicador de coincidencia de contraseñas */}
          {confirmPassword && (
            <div style={{ 
              marginBottom: '15px', 
              textAlign: 'center',
              fontSize: '0.9rem',
              color: password === confirmPassword ? '#28a745' : '#dc3545'
            }}>
              {password === confirmPassword ? 
                '✅ Las contraseñas coinciden' : 
                '❌ Las contraseñas no coinciden'
              }
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '15px', 
            marginTop: '20px' 
          }}>
            <button 
              type="submit" 
              className="login-btn"
              disabled={loading || erroresPassword.length > 0 || password !== confirmPassword}
              style={{
                opacity: (loading || erroresPassword.length > 0 || password !== confirmPassword) ? 0.7 : 1,
                cursor: (loading || erroresPassword.length > 0 || password !== confirmPassword) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
            
            <button 
              type="button" 
              className="login-btn" 
              style={{ 
                background: '#6c757d', 
                fontSize: '0.9rem',
                padding: '10px 16px'
              }}
              onClick={handleVolver}
              disabled={loading}
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
