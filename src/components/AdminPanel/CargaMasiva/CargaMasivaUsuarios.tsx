import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './CargaMasiva.css';

const API_URL = 'http://localhost:3000';

interface ResultadoCarga {
  usuariosCreados: number;
  usuariosConError: number;
  detalles: Array<{
    fila: number;
    usuario: string;
    status: 'creado' | 'error';
    mensaje: string;
  }>;
}

export const CargaMasivaUsuarios: React.FC = () => {
  const [tipoUsuario, setTipoUsuario] = useState<'admin' | 'docente' | 'alumno'>('alumno');
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ResultadoCarga | null>(null);
  const [error, setError] = useState('');
  const [vistaPrevia, setVistaPrevia] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivo(file);
      setError('');
      setResultado(null);
      
      // Generar vista previa
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Mostrar solo los primeros 5 registros
        setVistaPrevia(jsonData.slice(0, 5));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const descargarPlantilla = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay sesión activa');
        return;
      }

      const response = await fetch(`${API_URL}/auth/descargar-plantilla`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipoUsuario }),
      });

      if (!response.ok) {
        throw new Error('Error al descargar la plantilla');
      }

      const data = await response.json();
      
      if (data.success) {
        // Convertir base64 a blob
        const byteCharacters = atob(data.archivo);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        const blob = new Blob([byteArray], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        
        // Crear enlace de descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.nombreArchivo || `plantilla_${tipoUsuario}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error(data.message || 'Error al generar la plantilla');
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Error al descargar la plantilla');
    }
  };

  const subirArchivo = async () => {
    if (!archivo) {
      setError('Debe seleccionar un archivo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const formData = new FormData();
      formData.append('archivo', archivo);
      formData.append('tipoUsuario', tipoUsuario);

      const response = await fetch(`${API_URL}/auth/cargar-usuarios-excel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar el archivo');
      }

      setResultado(data);
      setArchivo(null);
      setVistaPrevia([]);
      
      // Limpiar el input file
      const fileInput = document.getElementById('archivo') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Error al cargar el archivo');
    } finally {
      setLoading(false);
    }
  };

  const limpiarResultados = () => {
    setResultado(null);
    setError('');
    setArchivo(null);
    setVistaPrevia([]);
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="carga-masiva-container">
      <div className="carga-masiva-header">
        <h2>Carga Masiva de Usuarios</h2>
        <p>Importe múltiples usuarios desde un archivo Excel</p>
      </div>

      <div className="carga-masiva-form">
        {/* Selector de tipo de usuario */}
        <div className="form-group">
          <label htmlFor="tipoUsuario">Tipo de Usuario:</label>
          <select
            id="tipoUsuario"
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value as 'admin' | 'docente' | 'alumno')}
            disabled={loading}
          >
            <option value="alumno">Alumno</option>
            <option value="docente">Docente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {/* Botón para descargar plantilla */}
        <div className="form-group">
          <button
            type="button"
            className="btn-plantilla"
            onClick={descargarPlantilla}
            disabled={loading}
          >
            📥 Descargar Plantilla Excel
          </button>
          <small>Descargue la plantilla con el formato correcto para {tipoUsuario}s</small>
        </div>

        {/* Selector de archivo */}
        <div className="form-group">
          <label htmlFor="archivo">Seleccionar Archivo Excel:</label>
          <input
            id="archivo"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            disabled={loading}
          />
          {archivo && (
            <div className="archivo-info">
              <span>📄 {archivo.name}</span>
              <span>({(archivo.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
        </div>

        {/* Vista previa */}
        {vistaPrevia.length > 0 && (
          <div className="vista-previa">
            <h4>Vista Previa (primeros 5 registros):</h4>
            <div className="tabla-previa">
              <table>
                <thead>
                  <tr>
                    {Object.keys(vistaPrevia[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vistaPrevia.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value: any, cellIndex) => (
                        <td key={cellIndex}>{value?.toString() || ''}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Botón de carga */}
        <div className="form-group">
          <button
            type="button"
            className="btn-cargar"
            onClick={subirArchivo}
            disabled={loading || !archivo}
          >
            {loading ? '⏳ Procesando...' : '📤 Cargar Usuarios'}
          </button>
        </div>

        {/* Errores */}
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Resultados */}
        {resultado && (
          <div className="resultado-carga">
            <div className="resultado-header">
              <h3>Resultado de la Carga</h3>
              <button className="btn-limpiar" onClick={limpiarResultados}>
                🗑️ Limpiar
              </button>
            </div>
            
            <div className="resultado-stats">
              <div className="stat-item success">
                <span className="stat-number">{resultado.usuariosCreados}</span>
                <span className="stat-label">Usuarios Creados</span>
              </div>
              <div className="stat-item error">
                <span className="stat-number">{resultado.usuariosConError}</span>
                <span className="stat-label">Errores</span>
              </div>
            </div>

            {resultado.detalles.length > 0 && (
              <div className="resultado-detalles">
                <h4>Detalle por Usuario:</h4>
                <div className="detalles-lista">
                  {resultado.detalles.map((detalle, index) => (
                    <div
                      key={index}
                      className={`detalle-item ${detalle.status}`}
                    >
                      <span className="detalle-fila">Fila {detalle.fila}</span>
                      <span className="detalle-usuario">{detalle.usuario}</span>
                      <span className="detalle-status">
                        {detalle.status === 'creado' ? '✅' : '❌'}
                      </span>
                      <span className="detalle-mensaje">{detalle.mensaje}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
