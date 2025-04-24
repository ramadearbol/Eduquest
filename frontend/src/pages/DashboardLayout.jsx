// src/pages/DashboardLayout.jsx
import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import "../styles/DashboardLayout.css";

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Outlet /> {/* Esto renderiza las rutas internas, como /perfil */}
      </div>
    </div>
  );
}

export default DashboardLayout;
