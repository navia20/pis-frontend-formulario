import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginForm } from './components/LoginForm/LoginForm';
import { LoginAdminForm } from './components/LoginForm/LoginAdminForm';
import { AdminPanel } from './pages/AdminPanel';
import { EstudiantePanel } from './components/EstudiantetPanel/EstudiantePanel';
import { DocentePanel } from './components/DocentePanel/DocentePanel';

// Componentes de recuperación de contraseña
import { SolicitarRecuperacion } from './components/RecuperarPassword/SolicitarRecuperacion';
import { VerificarCodigo } from './components/RecuperarPassword/VerificarCodigo';
import { NuevaPassword } from './components/RecuperarPassword/NuevaPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login-admin" element={<LoginAdminForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/estudiante" element={<EstudiantePanel />} />
        <Route path="/docente" element={<DocentePanel />} />
        
        {/* Rutas de recuperación de contraseña */}
        <Route path="/solicitar-recuperacion" element={<SolicitarRecuperacion />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/nueva-password" element={<NuevaPassword />} />
      </Routes>
    </Router>
  );
}

export default App;