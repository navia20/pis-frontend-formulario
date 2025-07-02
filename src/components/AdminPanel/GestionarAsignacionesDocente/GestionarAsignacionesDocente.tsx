import React, { useEffect, useState } from 'react';
import { asignaturaService, Asignatura } from '../../../services/asignaturaService';
import { usuarioService } from '../../../services/usuarioService';
import './GestionarAsignacionesDocente.css';

interface Docente {
  id: string;
  tipo: string;
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  activo: boolean;
}

interface AsignacionDocente {
  docente: Docente;
  asignaturas: Asignatura[];
}

export const GestionarAsignacionesDocente: React.FC = () => {
  const [asignaciones, setAsignaciones] = useState<AsignacionDocente[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Obtener docentes y asignaturas
      const [usuarios, asignaturasData] = await Promise.all([
        usuarioService.getUsuarios(),
        asignaturaService.getAsignaturas()
      ]);

      const docentesData = usuarios.filter(u => u.tipo === 'docente');
      setDocentes(docentesData);
      setAsignaturas(asignaturasData);

      // Crear asignaciones: para cada docente, encontrar sus asignaturas
      const asignacionesData: AsignacionDocente[] = docentesData.map(docente => ({
        docente,
        asignaturas: asignaturasData.filter(asignatura => 
          asignatura.id_docentes.includes(docente.id)
        )
      }));

      setAsignaciones(asignacionesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setMensaje('Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const removerAsignacion = async (docenteId: string, asignaturaId: string) => {
    try {
      await asignaturaService.removerDocente(asignaturaId, docenteId);
      setMensaje('Asignación removida correctamente');
      // Recargar datos para actualizar la vista
      await cargarDatos();
    } catch (error) {
      console.error('Error removiendo asignación:', error);
      setMensaje('Error al remover asignación');
    }
  };

  if (loading) {
    return <div className="loading">Cargando asignaciones...</div>;
  }

  return (
    <div className="gestionar-asignaciones-docente">
      <h2>Gestionar Asignaciones de Docentes</h2>
      
      {mensaje && (
        <div className={`mensaje ${mensaje.includes('Error') ? 'error' : 'success'}`}>
          {mensaje}
        </div>
      )}

      <div className="asignaciones-container">
        {asignaciones.map(({ docente, asignaturas }) => (
          <div key={docente.id} className="docente-card">
            <div className="docente-info">
              <h3>{docente.nombres} {docente.apellidos}</h3>
              <p><strong>RUT:</strong> {docente.rut}</p>
              <p><strong>Email:</strong> {docente.email}</p>
              <p><strong>Asignaturas asignadas:</strong> {asignaturas.length}</p>
            </div>
            
            <div className="asignaturas-list">
              {asignaturas.length === 0 ? (
                <p className="no-asignaturas">No tiene asignaturas asignadas</p>
              ) : (
                <div className="asignaturas-grid">
                  {asignaturas.map(asignatura => (
                    <div key={asignatura.id} className="asignatura-item">
                      <span className="asignatura-nombre">{asignatura.nombre}</span>
                      <button 
                        className="btn-remover"
                        onClick={() => removerAsignacion(docente.id, asignatura.id)}
                        title="Remover asignación"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="acciones">
        <button onClick={cargarDatos} className="btn-actualizar">
          Actualizar Lista
        </button>
      </div>
    </div>
  );
};
