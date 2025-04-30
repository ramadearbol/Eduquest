import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DashboardLayout from './pages/DashboardLayout';
import Perfil from './pages/Perfil'; // Ruta para el perfil
import Ranking from './pages/Ranking';
import Retos from './pages/Retos';
import Aprender from './pages/Aprender';

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
          <Route path='retos' element={<Retos />} />
          <Route path='aprender' element={<Aprender />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
