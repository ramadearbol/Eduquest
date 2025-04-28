import React from "react";
import "../styles/BotonHambur.css"; // Actualiza la ruta al nuevo archivo CSS

function BotonHambur({ toggleNavbar }) {
  return (
    <div className="boton-hambur" onClick={toggleNavbar}>
      <div className="hamburger-icon"></div>
      <div className="hamburger-icon"></div>
      <div className="hamburger-icon"></div>
    </div>
  );
}

export default BotonHambur;
