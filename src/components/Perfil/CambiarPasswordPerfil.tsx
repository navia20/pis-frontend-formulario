import React, { useState } from 'react';
import axios from 'axios';
import './Perfil.css';

const API_URL = 'http://localhost:3000';

interface CambiarPasswordPerfilProps {
  usuarioId: string;
  tipoUsuario: 'admin' | 'docente' | 'alumno';
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CambiarPasswordPerfil: React.FC<CambiarPasswordPerfilProps> = ({
  usuarioId,
  tipoUsuario,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    passwordActual: '',
    passwordNueva: '',
    confirmarPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const togglePasswordVisibility = (field: 'actual' | 'nueva' | 'confirmar') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePasswords = (): boolean => {
    if (!formData.passwordActual.trim()) {
      setError('La contraseña actual es obligatoria');
      return false;
    }

    if (!formData.passwordNueva.trim()) {
      setError('La nueva contraseña es obligatoria');
      return false;
    }

    if (formData.passwordNueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.passwordNueva !== formData.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (formData.passwordActual === formData.passwordNueva) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePasswords()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      console.log('🔄 Enviando solicitud de cambio de contraseña...');
      console.log('📝 Usuario ID:', usuarioId);
      console.log('� Usuario ID tipo:', typeof usuarioId);
      console.log('�👤 Tipo Usuario:', tipoUsuario);
      console.log('🔑 Token presente:', !!token);

      const response = await axios.post(
        `${API_URL}/auth/cambiar-password-perfil`,
        {
          usuarioId,
          tipoUsuario,
          passwordActual: formData.passwordActual,
          passwordNueva: formData.passwordNueva,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Respuesta del servidor:', response.data);

      if (response.data.success) {
        alert('✅ Contraseña cambiada exitosamente');
        setFormData({
          passwordActual: '',
          passwordNueva: '',
          confirmarPassword: '',
        });
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      console.error('❌ Response error:', error.response);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Data:', error.response?.data);
      
      if (error.response?.status === 401) {
        setError('Contraseña actual incorrecta');
      } else if (error.response?.status === 404) {
        setError('Usuario no encontrado');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al cambiar la contraseña. Intente más tarde');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cambiar-password-container">
      <div className="profile-section">
        <h3>Cambiar Contraseña</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="profile-field">
            <label htmlFor="passwordActual">Contraseña Actual:</label>
            <div className="password-input-container">
              <input
                type={showPasswords.actual ? 'text' : 'password'}
                id="passwordActual"
                name="passwordActual"
                value={formData.passwordActual}
                onChange={handleInputChange}
                placeholder="Ingresa tu contraseña actual"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('actual')}
                disabled={loading}
              >
                {showPasswords.actual ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="profile-field">
            <label htmlFor="passwordNueva">Nueva Contraseña:</label>
            <div className="password-input-container">
              <input
                type={showPasswords.nueva ? 'text' : 'password'}
                id="passwordNueva"
                name="passwordNueva"
                value={formData.passwordNueva}
                onChange={handleInputChange}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('nueva')}
                disabled={loading}
              >
                {showPasswords.nueva ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="profile-field">
            <label htmlFor="confirmarPassword">Confirmar Nueva Contraseña:</label>
            <div className="password-input-container">
              <input
                type={showPasswords.confirmar ? 'text' : 'password'}
                id="confirmarPassword"
                name="confirmarPassword"
                value={formData.confirmarPassword}
                onChange={handleInputChange}
                placeholder="Repite la nueva contraseña"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility('confirmar')}
                disabled={loading}
              >
                {showPasswords.confirmar ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message" style={{ 
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              padding: '8px 12px',
              marginBottom: '15px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <div className="password-form-buttons">
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginRight: '10px'
              }}
            >
              {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
            
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
              disabled={loading}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>

        <div className="password-requirements" style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b8daff',
          borderRadius: '4px',
          fontSize: '0.8rem',
          color: '#004085'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>Requisitos para la nueva contraseña:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>Mínimo 6 caracteres</li>
            <li>Diferente a la contraseña actual</li>
            <li>Se recomienda incluir letras, números y símbolos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
