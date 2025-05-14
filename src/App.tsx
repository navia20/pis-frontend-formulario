import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginForm } from './components/LoginForm/LoginForm';
import { AdminPanel } from './components/AdminPanel/AdminPanel';
import { EstudiantePanel } from './components/EstudiantetPanel/EstudiantePanel';
import { DocentePanel } from './components/DocentePanel/DocentePanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/estudiante" element={<EstudiantePanel />} />
        <Route path="/docente" element={<DocentePanel />} />
      </Routes>
    </Router>
  );
}

export default App; // Cambiar a exportación por defecto