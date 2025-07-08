import React, { useState, useEffect } from 'react';
import { Perfil } from './Perfil';
import { authService, UserProfile } from '../../services/authService';
import type { Usuario } from '../../types/usuario';

export const PerfilContainer: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para transformar el perfil de la API al formato necesario para el componente Perfil
  const transformProfileToUsuario = (profile: UserProfile): Usuario => {
    const baseUser = {
      id: profile.id,
      nombres: profile.nombres,
      apellidos: profile.apellidos,
      rut: profile.rut,
      email: profile.email,
    };

    switch (profile.tipo) {
      case 'alumno':
        return {
          ...baseUser,
          tipo: 'alumno' as const,
          id_carrera: profile.id_carrera,
          nombre_carrera: profile.nombre_carrera,
          año_ingreso: profile.año_ingreso?.toString(),
          asignaturas: profile.asignaturas || []
        };
      case 'docente':
        return {
          ...baseUser,
          tipo: 'docente' as const,
        };
      case 'admin':
        return {
          ...baseUser,
          tipo: 'admin' as const,
          rol: profile.rol || 'Administrador', // Usar el rol del perfil o valor por defecto
        };
      default:
        throw new Error(`Tipo de usuario no reconocido: ${profile.tipo}`);
    }
  };

  // Cargar perfil de usuario
  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      try {
        // Primero intentar obtener del localStorage
        const cachedProfile = authService.getCachedProfile();
        if (cachedProfile) {
          setUsuario(transformProfileToUsuario(cachedProfile));
        }

        // Luego intentar obtener del backend para actualizar los datos
        const profile = await authService.refreshProfile();
        if (profile) {
          setUsuario(transformProfileToUsuario(profile));
        } else {
          if (!cachedProfile) {
            setError('No se pudo cargar el perfil del usuario');
          }
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        setError('Error al cargar el perfil del usuario');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  // Función para guardar cambios en el perfil
  const handleGuardarPerfil = async (usuarioActualizado: Usuario) => {
    setLoading(true);
    try {
      // Aquí podríamos implementar la lógica para actualizar el perfil en el backend
      // Por ahora, solo simulamos que se actualizó
      console.log('Actualizando perfil:', usuarioActualizado);
      
      // Simular actualización del perfil
      setTimeout(() => {
        setUsuario(usuarioActualizado);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError('Error al actualizar el perfil');
      setLoading(false);
    }
  };

  // Función para recargar perfil
  const handleRefreshProfile = async () => {
    setLoading(true);
    try {
      const profile = await authService.refreshProfile();
      if (profile) {
        setUsuario(transformProfileToUsuario(profile));
        setError(null);
      } else {
        setError('No se pudo actualizar el perfil');
      }
    } catch (err) {
      console.error('Error al recargar perfil:', err);
      setError('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !usuario) {
    return <div>Cargando perfil...</div>;
  }

  if (error && !usuario) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={handleRefreshProfile}>Reintentar</button>
      </div>
    );
  }

  return (
    <Perfil
      usuario={usuario as Usuario}
      editable={true}
      onGuardar={handleGuardarPerfil}
    />
  );
};
