import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DashboardLayout from './pages/DashboardLayout';
import Perfil from './pages/Perfil'; // Ruta para el perfil
import Ranking from './pages/Ranking';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas sin Navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas con Navbar */}
        <Route path="/home/*" element={<DashboardLayout />}>
          <Route path="perfil" element={<Perfil />} />
          <Route path='ranking' element={<Ranking />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
