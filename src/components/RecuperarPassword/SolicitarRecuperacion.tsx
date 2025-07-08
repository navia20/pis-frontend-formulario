import React, { useState } from 'react';
import { Logo } from '../Logo';
import '../LoginForm/LoginForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const SolicitarRecuperacion: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingrese un email válido');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Enviando solicitud de recuperación a:', `${API_URL}/auth/solicitar-recuperacion`);
      console.log('📧 Email:', email);
      
      const response = await axios.post(`${API_URL}/auth/solicitar-recuperacion`, {
        email: email
      });

      console.log('✅ Respuesta recibida:', response.data);

      if (response.data.success) {
        setSuccess(true);
        console.log('Código de recuperación enviado exitosamente');
        
        // En desarrollo, mostrar el código si está disponible
        if (response.data.codigoDesarrollo) {
          console.log('🔑 CÓDIGO PARA DESARROLLO:', response.data.codigoDesarrollo);
          alert(`CÓDIGO PARA DESARROLLO: ${response.data.codigoDesarrollo}\n\n(Este mensaje solo aparece en desarrollo)`);
        }
        
        // Redirigir a la página de verificación después de 3 segundos
        setTimeout(() => {
          navigate('/verificar-codigo', { 
            state: { 
              email: email,
              codigoEnviado: true,
              codigoDesarrollo: response.data.codigoDesarrollo || null
            } 
          });
        }, 3000);
      }
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      console.error('❌ Response error:', error.response);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Data:', error.response?.data);
      
      if (error.response?.status === 404) {
        setError('No se encontró una cuenta con este email');
      } else if (error.response?.status === 429) {
        setError('Demasiados intentos. Intente más tarde');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Error de conexión. Verifica que el backend esté funcionando en http://localhost:3000');
      } else {
        setError('Error al enviar el código. Intente más tarde');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/');
  };

  if (success) {
    return (
      <div className="login-root">
        <div className="login-container">
          <Logo />
          <h1 className="login-title">Código Enviado</h1>
          
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#155724'
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
              ✅ Código enviado exitosamente
            </p>
            <p style={{ margin: '0', fontSize: '0.9rem' }}>
              Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
            </p>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem' }}>
              Redirigiendo en 3 segundos...
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button 
              className="login-btn"
              onClick={() => navigate('/verificar-codigo', { 
                state: { 
                  email: email,
                  codigoEnviado: true,
                  codigoDesarrollo: null
                } 
              })}
            >
              Continuar Ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-root">
      <div className="login-container">
        <Logo />

        <h1 className="login-title">Recuperar Contraseña</h1>
        <h2 className="login-subtitle">Ingresa tu email para recibir un código de verificación</h2>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <h3 className="login-h3">
              <label htmlFor="email" className="login-label">Email</label>
            </h3>
            <input
              type="email"
              id="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@universidad.cl"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="login-error-message" style={{ marginBottom: '15px' }}>
              {error}
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
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Enviando...' : 'Enviar Código'}
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
              Volver al Login
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.8rem', color: '#666' }}>
            <p>
              El código será válido por 15 minutos.<br/>
              Revisa tu bandeja de entrada y carpeta de spam.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
