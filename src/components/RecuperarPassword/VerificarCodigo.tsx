import React, { useState, useEffect } from 'react';
import { Logo } from '../Logo';
import '../LoginForm/LoginForm.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface LocationState {
  email?: string;
  codigoEnviado?: boolean;
  codigoDesarrollo?: string;
}

export const VerificarCodigo: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState(900); // 15 minutos en segundos
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as LocationState;
  const email = state?.email || '';
  const codigoDesarrollo = state?.codigoDesarrollo || null;

  // Si no hay email, redirigir a solicitar recuperación
  useEffect(() => {
    if (!email) {
      navigate('/solicitar-recuperacion');
    }
  }, [email, navigate]);

  // Contador de tiempo restante
  useEffect(() => {
    if (tiempoRestante > 0) {
      const timer = setTimeout(() => {
        setTiempoRestante(tiempoRestante - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [tiempoRestante]);

  // Formatear tiempo restante
  const formatearTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validación del código
    if (codigo.length !== 6 || !/^\d{6}$/.test(codigo)) {
      setError('El código debe tener exactamente 6 dígitos');
      setLoading(false);
      return;
    }

    if (tiempoRestante <= 0) {
      setError('El código ha expirado. Solicita uno nuevo');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/verificar-codigo`, {
        email: email,
        codigo: codigo
      });

      if (response.data.success) {
        console.log('Código verificado exitosamente');
        
        // Redirigir a cambiar contraseña con token temporal
        navigate('/nueva-password', { 
          state: { 
            email: email,
            token: response.data.resetToken,
            codigoVerificado: true
          } 
        });
      }
    } catch (error: any) {
      console.error('Error al verificar código:', error);
      
      if (error.response?.status === 400) {
        setError('Código incorrecto');
      } else if (error.response?.status === 410) {
        setError('El código ha expirado. Solicita uno nuevo');
      } else {
        setError('Error al verificar el código. Intente nuevamente');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReenviarCodigo = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/auth/solicitar-recuperacion`, {
        email: email
      });

      if (response.data.success) {
        setTiempoRestante(900); // Reiniciar timer
        
        // En desarrollo, mostrar el código en consola y alert
        if (response.data.codigoDesarrollo) {
          console.log('🔑 NUEVO CÓDIGO DE DESARROLLO:', response.data.codigoDesarrollo);
          alert(`NUEVO CÓDIGO PARA DESARROLLO: ${response.data.codigoDesarrollo}\n\n(Este mensaje solo aparece en desarrollo)`);
        }
        
        alert('Nuevo código enviado a tu email');
      }
    } catch (error: any) {
      console.error('Error al reenviar código:', error);
      setError('Error al reenviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/solicitar-recuperacion');
  };

  // Manejar entrada del código (solo números)
  const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length <= 6) {
      setCodigo(value);
    }
  };

  return (
    <div className="login-root">
      <div className="login-container">
        <Logo />

        <h1 className="login-title">Verificar Código</h1>
        <h2 className="login-subtitle">
          Ingresa el código de 6 dígitos enviado a<br/>
          <strong>{email}</strong>
          {codigoDesarrollo && (
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              borderRadius: '5px',
              fontSize: '0.9rem',
              color: '#856404'
            }}>
              🔧 <strong>MODO DESARROLLO:</strong> Código: <strong>{codigoDesarrollo}</strong>
            </div>
          )}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <h3 className="login-h3">
              <label htmlFor="codigo" className="login-label">Código de Verificación</label>
            </h3>
            <input
              type="text"
              id="codigo"
              className="login-input"
              value={codigo}
              onChange={handleCodigoChange}
              placeholder="123456"
              maxLength={6}
              style={{ 
                textAlign: 'center',
                fontSize: '1.5rem',
                letterSpacing: '0.5rem',
                fontFamily: 'monospace'
              }}
              required
              disabled={loading || tiempoRestante <= 0}
            />
          </div>

          {/* Timer */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '15px',
            fontSize: '0.9rem',
            color: tiempoRestante <= 60 ? '#dc3545' : '#6c757d'
          }}>
            {tiempoRestante > 0 ? (
              <>⏰ Tiempo restante: <strong>{formatearTiempo(tiempoRestante)}</strong></>
            ) : (
              <span style={{ color: '#dc3545' }}>⚠️ Código expirado</span>
            )}
          </div>

          {error && (
            <div className="login-error-message" style={{ marginBottom: '15px' }}>
              {error}
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '10px', 
            marginTop: '20px' 
          }}>
            <button 
              type="submit" 
              className="login-btn"
              disabled={loading || tiempoRestante <= 0 || codigo.length !== 6}
              style={{
                opacity: (loading || tiempoRestante <= 0 || codigo.length !== 6) ? 0.7 : 1,
                cursor: (loading || tiempoRestante <= 0 || codigo.length !== 6) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Verificando...' : 'Verificar Código'}
            </button>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className="login-btn" 
                style={{ 
                  background: '#28a745', 
                  fontSize: '0.9rem',
                  padding: '8px 12px'
                }}
                onClick={handleReenviarCodigo}
                disabled={loading}
              >
                Reenviar Código
              </button>

              <button 
                type="button" 
                className="login-btn" 
                style={{ 
                  background: '#6c757d', 
                  fontSize: '0.9rem',
                  padding: '8px 12px'
                }}
                onClick={handleVolver}
                disabled={loading}
              >
                Volver
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.8rem', color: '#666' }}>
            <p>
              ¿No recibiste el código? Revisa tu carpeta de spam<br/>
              o solicita uno nuevo haciendo clic en "Reenviar Código"
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
