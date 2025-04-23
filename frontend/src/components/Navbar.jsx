// src/components/Navbar.jsx
import React from 'react';
import '../styles/Navbar.css';
import iconoInicio from '../assets/Casa.png';
import iconoLogo from '../assets/Logo.png';
import iconoRetos from '../assets/Retos.png';
import iconoPerfil from '../assets/Perfil.png';
import iconoTrofeo from '../assets/Trofeo.png';



function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <img src={iconoLogo} alt="Logo EduQuest" className="logo-img" />
      </div>
      <ul className="navbar-links">
        <li>
          <img src={iconoInicio} alt="Icono Inicio" className="icon" />
          Inicio
        </li>
        <li>
          <img src={iconoRetos} alt="Icono Retos" className="icon" />
          Retos
        </li>
        <li>
          <img src={iconoTrofeo} alt="Icono Ranking" className="icon" />
          Ranking
        </li>
        <li>
          <img src={iconoPerfil} alt="Icono Perfil" className="icon" />
          Perfil
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
