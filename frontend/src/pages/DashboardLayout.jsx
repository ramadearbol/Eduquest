import React, { useState } from "react";
import Navbar from "../components/Navbar";
import BotonHambur from "../components/BotonHambur"; 
import { Outlet } from "react-router-dom";
import "../styles/DashboardLayout.css";

function DashboardLayout() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true); // Estado para controlar la visibilidad del navbar

  const toggleNavbar = () => {
    setIsNavbarVisible(!isNavbarVisible); // Cambiar el estado al hacer click
  };

  return (
    <div className="dashboard-layout">
      {/* El botón de hamburguesa solo se muestra si el navbar está visible */}
      <BotonHambur toggleNavbar={toggleNavbar} />

      {/* Condicionalmente renderizar el Navbar basado en el estado */}
      {isNavbarVisible && <Navbar />}

      <div className="dashboard-content">
        <Outlet /> {/* Esto renderiza las rutas internas, como /perfil */}
      </div>
    </div>
  );
}

export default DashboardLayout;
