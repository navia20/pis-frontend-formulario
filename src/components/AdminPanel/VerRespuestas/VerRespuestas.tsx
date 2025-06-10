import React, { useEffect, useState } from 'react';
import { respuestaService } from '../../../services/respuestaService';
import './VerRespuestas.css';

interface RespuestaFormulario {
  id_formulario: number;
  id_usuario: string;
  fecha: string;
  titulo: string;
  preguntas: {
    id: number;
    texto: string;
    opciones: string[];
  }[];
  respuestas: {
    id_pregunta: number;
    respuesta: string;
  }[];
}

export const VerRespuestas: React.FC = () => {
  const [respuestas, setRespuestas] = useState<RespuestaFormulario[]>([]);
  const [loading, setLoading] = useState(true);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);

  useEffect(() => {
    respuestaService.getRespuestas()
      .then((data: any[]) => {
        const adaptadas: RespuestaFormulario[] = data.map((r: any) => ({
          id_formulario: Number(r.id_formulario),
          id_usuario: r.id_usuario,
          fecha: r.fecha,
          titulo: r.titulo || 'Sin título',
          preguntas: r.preguntas || [],
          respuestas: (r.respuestas || []).map((resp: any) => ({
            id_pregunta: resp.id_pregunta ?? resp.pregunta ?? 0,
            respuesta: resp.respuesta,
          })),
        }));
        setRespuestas(adaptadas);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando respuestas...</div>;

  // Si hay un formulario seleccionado, muestra el detalle visual centrado y compacto
  if (seleccionada !== null) {
    const r = respuestas[seleccionada];
    return (
      <div className="ver-respuestas-root">
        <button className="btn-retroceder" onClick={() => setSeleccionada(null)}>Volver</button>
        <h2>Respuestas de: {r.titulo}</h2>
        <div style={{ marginBottom: 18 }}>
          <strong>ID Formulario:</strong> {r.id_formulario}<br />
          <strong>ID Usuario:</strong> {r.id_usuario}<br />
          <strong>Fecha:</strong> {r.fecha}<br />
        </div>
        <div className="preguntas-container">
          {r.preguntas.map((pregunta) => {
            const respuestaUsuario = r.respuestas.find(
              resp => resp.id_pregunta === pregunta.id
            )?.respuesta;
            return (
              <div key={pregunta.id} className="pregunta">
                <div className="pregunta-header">
                  <h3>{pregunta.texto}</h3>
                </div>
                <div className="respuestas">
                  {pregunta.opciones.map((opcion, idx) => (
                    <label
                      key={idx}
                      className={
                        'respuesta' +
                        (respuestaUsuario === opcion ? ' seleccionada' : '')
                      }
                      style={{
                        pointerEvents: 'none',
                        opacity: respuestaUsuario === opcion ? 1 : 0.7,
                      }}
                    >
                      <input
                        type="radio"
                        name={`pregunta-${pregunta.id}-usuario-${r.id_usuario}`}
                        value={opcion}
                        checked={respuestaUsuario === opcion}
                        readOnly
                        tabIndex={-1}
                      />
                      {opcion}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Lista de formularios respondidos para seleccionar
  return (
    <div>
      <h2>Respuestas de Formularios</h2>
      {respuestas.length === 0 ? (
        <p>No hay respuestas registradas.</p>
      ) : (
        <div className="tabla-respuestas">
          {respuestas.map((r, i) => (
            <div
              key={i}
              className="respuesta-card"
              style={{ cursor: 'pointer' }}
              onClick={() => setSeleccionada(i)}
            >
              <div className="respuesta-card-titulo">{r.titulo}</div>
              <div style={{ fontSize: '0.97rem', color: '#2c3550', marginBottom: 4 }}>
                <strong>ID Formulario:</strong> {r.id_formulario}
              </div>
              <div style={{ fontSize: '0.97rem', color: '#2c3550', marginBottom: 4 }}>
                <strong>ID Usuario:</strong> {r.id_usuario}
              </div>
              <div style={{ fontSize: '0.97rem', color: '#2c3550', marginBottom: 4 }}>
                <strong>Fecha:</strong> {r.fecha}
              </div>
              <div style={{ color: '#2980b9', marginTop: 8, fontWeight: 500 }}>Ver respuestas</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};