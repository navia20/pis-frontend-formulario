import React, { useEffect, useState } from 'react';
import { adminRespuestasService } from '../../../services/adminRespuestasService';
import './VerRespuestas.css';

interface RespuestaFormulario {
  id: string;
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
  nombre_estudiante: string;
  rut_estudiante: string;
  carrera: string;
  asignatura: string;
  año_ingreso: number;
}

export const VerRespuestas: React.FC = () => {
  const [respuestas, setRespuestas] = useState<RespuestaFormulario[]>([]);
  const [loading, setLoading] = useState(true);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);

  // Filtros
  const [filtros, setFiltros] = useState({
    nombre: '',
    rut: '',
    carrera: '',
    asignatura: '',
    año: '',
  });

  // Opciones para selects
  const [asignaturas, setAsignaturas] = useState<{ id: string; nombre: string }[]>([]);
  const [carreras, setCarreras] = useState<{ id: string; nombre: string }[]>([]);
  const [años, setAños] = useState<number[]>([]);

  useEffect(() => {
    console.log('🔍 Admin: Cargando respuestas desde la base de datos...');
    
    adminRespuestasService.getRespuestas()
      .then((data) => {
        console.log('✅ Respuestas obtenidas para admin:', data.length);
        console.log('📋 Datos completos recibidos:', data);
        setRespuestas(data);

        // Opciones únicas para selects
        setCarreras(
          Array.from(new Set(data.map(r => r.carrera).filter((carrera): carrera is string => typeof carrera === 'string' && carrera !== '')))
            .map(nombre => ({ id: nombre, nombre }))
        );
        setAsignaturas(
          Array.from(new Set(data.map(r => r.asignatura).filter((asignatura): asignatura is string => typeof asignatura === 'string' && asignatura !== '')))
            .map(nombre => ({ id: nombre, nombre }))
        );
        setAños(
          Array.from(new Set(data.map(r => r.año_ingreso).filter((a): a is number => typeof a === 'number')))
        );
      })
      .catch((error) => {
        console.error('❌ Error al obtener respuestas:', error);
      })
      .finally(() => {
        console.log('🏁 Carga de respuestas finalizada');
        setLoading(false);
      });
  }, []);

  const handleFiltro = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Filtrado dinámico
  const respuestasFiltradas = respuestas.filter(r =>
    (filtros.nombre === '' || r.nombre_estudiante.toLowerCase().includes(filtros.nombre.toLowerCase())) &&
    (filtros.rut === '' || r.rut_estudiante.includes(filtros.rut)) &&
    (filtros.carrera === '' || r.carrera === filtros.carrera) &&
    (filtros.asignatura === '' || r.asignatura === filtros.asignatura) &&
    (filtros.año === '' || String(r.año_ingreso) === filtros.año)
  );

  if (loading) return <div>Cargando respuestas...</div>;

  // Vista detalle
  if (seleccionada !== null) {
    const r = respuestasFiltradas[seleccionada];
    if (!r) return <div>No encontrada</div>;
    return (
      <div className="ver-respuestas-root">
        <button className="btn-retroceder" onClick={() => setSeleccionada(null)}>Volver</button>
        <h2>Respuestas de: {r.titulo}</h2>
        <div style={{ marginBottom: 18 }}>
          <strong>Estudiante:</strong> {r.nombre_estudiante}<br />
          <strong>RUT:</strong> {r.rut_estudiante}<br />
          <strong>Carrera:</strong> {r.carrera}<br />
          <strong>Asignatura:</strong> {r.asignatura}<br />
          <strong>Año ingreso:</strong> {r.año_ingreso}<br />
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

  // Vista lista con filtros
  return (
    <div>
      <h2>Respuestas de Formularios</h2>
      <div className="filtros" style={{ marginBottom: 18 }}>
        <input
          name="nombre"
          placeholder="Buscar por nombre"
          value={filtros.nombre}
          onChange={handleFiltro}
        />
        <input
          name="rut"
          placeholder="Buscar por RUT"
          value={filtros.rut}
          onChange={handleFiltro}
        />
        <select name="carrera" value={filtros.carrera} onChange={handleFiltro}>
          <option value="">Todas las carreras</option>
          {carreras.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <select name="asignatura" value={filtros.asignatura} onChange={handleFiltro}>
          <option value="">Todas las asignaturas</option>
          {asignaturas.map(a => (
            <option key={a.id} value={a.id}>{a.nombre}</option>
          ))}
        </select>
        <select name="año" value={filtros.año} onChange={handleFiltro}>
          <option value="">Todos los años</option>
          {años.map(a => (
            <option key={a} value={String(a)}>{a}</option>
          ))}
        </select>
      </div>
      {respuestasFiltradas.length === 0 ? (
        <div>
          <p>No hay respuestas registradas.</p>
          <div style={{ marginTop: 10, padding: 10, backgroundColor: '#f0f0f0', fontSize: '0.9em' }}>
            <strong>Debug Info:</strong><br/>
            Total respuestas cargadas: {respuestas.length}<br/>
            Carreras disponibles: {carreras.length}<br/>
            Asignaturas disponibles: {asignaturas.length}<br/>
            Años disponibles: {años.length}<br/>
            <small>Revisa la consola (F12) para más detalles</small>
          </div>
        </div>
      ) : (
        <div className="tabla-respuestas">
          {respuestasFiltradas.map((r, i) => (
            <div
              key={i}
              className="respuesta-card"
              style={{ cursor: 'pointer' }}
              onClick={() => setSeleccionada(i)}
            >
              <div className="respuesta-card-titulo">{r.titulo}</div>
              <div style={{ fontSize: '0.97rem', color: '#2c3550', marginBottom: 4 }}>
                <strong>Estudiante:</strong> {r.nombre_estudiante}
              </div>
              <div style={{ fontSize: '0.97rem', color: '#2c3550', marginBottom: 4 }}>
                <strong>RUT:</strong> {r.rut_estudiante}
              </div>
              <div style={{ fontSize: '0.97rem', color: '#2c3550', marginBottom: 4 }}>
                <strong>Carrera:</strong> {r.carrera}
              </div>
              <div style={{ fontSize: '0.97rem', color: '#2c3550', marginBottom: 4 }}>
                <strong>Asignatura:</strong> {r.asignatura}
              </div>
              <div style={{ fontSize: '0.97rem', color: '#2c3550', marginBottom: 4 }}>
                <strong>Año ingreso:</strong> {r.año_ingreso}
              </div>
              <div style={{ color: '#2980b9', marginTop: 8, fontWeight: 500 }}>Ver respuestas</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}