import React, { useState } from 'react';
import './RespuestasEstudiantes.css';

// Datos simulados
const datosSimulados = [
  {
    asignatura: 'Matemáticas',
    estudiantes: [
      {
        nombre: 'Juan Pérez',
        formulario: {
          titulo: 'Formulario Matemáticas',
          preguntas: [
            {
              id: 1,
              texto: '¿Cuánto es 2 + 2?',
              respuestas: ['3', '4', '5', '6'],
              respuestaSeleccionada: '4',
            },
            {
              id: 2,
              texto: '¿Cuál es la raíz cuadrada de 9?',
              respuestas: ['2', '3', '4', '5'],
              respuestaSeleccionada: '3',
            },
          ],
        },
      },
      {
        nombre: 'Ana Torres',
        formulario: {
          titulo: 'Formulario Matemáticas',
          preguntas: [
            {
              id: 1,
              texto: '¿Cuánto es 2 + 2?',
              respuestas: ['3', '4', '5', '6'],
              respuestaSeleccionada: '5',
            },
            {
              id: 2,
              texto: '¿Cuál es la raíz cuadrada de 9?',
              respuestas: ['2', '3', '4', '5'],
              respuestaSeleccionada: '3',
            },
          ],
        },
      },
    ],
  },
  {
    asignatura: 'Lenguaje',
    estudiantes: [
      {
        nombre: 'María López',
        formulario: {
          titulo: 'Formulario Lenguaje',
          preguntas: [
            {
              id: 1,
              texto: '¿Cuál es un sinónimo de "feliz"?',
              respuestas: ['Triste', 'Contento', 'Enojado', 'Cansado'],
              respuestaSeleccionada: 'Contento',
            },
            {
              id: 2,
              texto: '¿Cuál es el antónimo de "alto"?',
              respuestas: ['Grande', 'Pequeño', 'Bajo', 'Ancho'],
              respuestaSeleccionada: 'Bajo',
            },
          ],
        },
      },
    ],
  },
];

export const RespuestasEstudiantes: React.FC = () => {
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState<number | null>(null);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<number | null>(null);

  // Mostrar formulario respondido
  if (
    asignaturaSeleccionada !== null &&
    estudianteSeleccionado !== null
  ) {
    const estudiante = datosSimulados[asignaturaSeleccionada].estudiantes[estudianteSeleccionado];
    return (
      <div className="respuestas-estudiantes">
        <button className="btn-retroceder" onClick={() => setEstudianteSeleccionado(null)}>
          Retroceder
        </button>
        <h2>
          {estudiante.nombre} - {estudiante.formulario.titulo}
        </h2>
        <div className="preguntas-container">
          {estudiante.formulario.preguntas.map((pregunta) => (
            <div key={pregunta.id} className="pregunta">
              <div className="pregunta-header">
                <h3>Pregunta {pregunta.id}</h3>
              </div>
              <p className="pregunta-texto">{pregunta.texto}</p>
              <div className="respuestas">
                {pregunta.respuestas.map((resp, idx) => (
                  <div
                    key={idx}
                    className={`respuesta ${
                      pregunta.respuestaSeleccionada === resp ? 'seleccionada' : ''
                    }`}
                  >
                    {resp}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mostrar estudiantes de la asignatura seleccionada
  if (asignaturaSeleccionada !== null) {
    const asignatura = datosSimulados[asignaturaSeleccionada];
    return (
      <div className="respuestas-estudiantes">
        <button className="btn-retroceder" onClick={() => setAsignaturaSeleccionada(null)}>
          Retroceder
        </button>
        <h2>{asignatura.asignatura}</h2>
        <div className="lista-respuestas">
          {asignatura.estudiantes.map((est, idx) => (
            <div
              key={idx}
              className="respuesta-cuadro"
              onClick={() => setEstudianteSeleccionado(idx)}
            >
              <strong>{est.nombre}</strong>
              <div>{est.formulario.titulo}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Mostrar cuadros de asignaturas
  return (
    <div className="respuestas-estudiantes">
      <h2>Asignaturas</h2>
      <div className="lista-respuestas">
        {datosSimulados.map((asig, idx) => (
          <div
            key={idx}
            className="respuesta-cuadro"
            onClick={() => setAsignaturaSeleccionada(idx)}
          >
            <strong>{asig.asignatura}</strong>
            <div>{asig.estudiantes.length} estudiante(s)</div>
          </div>
        ))}
      </div>
    </div>
  );
};