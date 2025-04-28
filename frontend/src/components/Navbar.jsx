import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import iconoInicio from '../assets/Casa.png';
import iconoLogo from '../assets/Logo.png';
import iconoRetos from '../assets/Retos.png';
import iconoPerfil from '../assets/Perfil.png';
import iconoTrofeo from '../assets/Trofeo.png';
import iconoApagar from '../assets/Apagar.png'; 

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={iconoLogo} alt="Logo EduQuest" className="logo-img" />
      </div>
      <ul className="navbar-links">
        <li onClick={() => navigate("/home")}>
          <img src={iconoInicio} alt="Inicio" className="icon" />
          Inicio
        </li>
        <li>
          <img src={iconoRetos} alt="Retos" className="icon" />
          Retos
        </li>
        <li onClick={() => navigate("/home/ranking")}>
          <img src={iconoTrofeo} alt="Ranking" className="icon" />
          Ranking
        </li>
        <li onClick={() => navigate("/home/perfil")}>
          <img src={iconoPerfil} alt="Perfil" className="icon" />
          Perfil
        </li>
      </ul>

      <div className="logout-container">
        <ul className="navbar-links">
          <li onClick={handleLogout}>
            <img src={iconoApagar} alt="Cerrar Sesión" className="icon logout-icon" />
            Cerrar Sesión
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
