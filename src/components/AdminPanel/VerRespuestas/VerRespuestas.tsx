import React, { useEffect, useState } from 'react';
import { respuestaService } from '../../../services/respuestaService';
import './VerRespuestas.css';

// Componente para mostrar respuestas de formularios/encuestas
export const VerRespuestas: React.FC = () => {
  const [respuestas, setRespuestas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    respuestaService.getRespuestas()
      .then(setRespuestas)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando respuestas...</div>;

  return (
    <div>
      <h2>Respuestas de Formularios</h2>
      {respuestas.length === 0 ? (
        <p>No hay respuestas registradas.</p>
      ) : (
        <div className="tabla-respuestas">
          {respuestas.map((r, i) => (
            <div key={i} className="respuesta-card">
              <div>
                <strong>ID Formulario:</strong> {r.id_formulario}
              </div>
              <div>
                <strong>ID Usuario:</strong> {r.id_usuario}
              </div>
              <div>
                <strong>Fecha:</strong> {r.fecha}
              </div>
              <div>
                <strong>Respuestas:</strong>
                <ul>
                  {r.respuestas.map((resp: any, idx: number) => (
                    <li key={idx}>
                      <strong>{resp.pregunta}:</strong> {resp.respuesta}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};