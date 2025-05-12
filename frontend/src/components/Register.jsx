import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import logoEduQuest from "../assets/Logo.png";

function Register() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/home/aprender");
  };

  const goToLogin = () => {
    navigate("/");
  }

  return (
    <div className="register-container">
      <div className="login-box">
        <div className="logo-container">
          <img src={logoEduQuest} alt="Logo EduQuest" className="logo-img" />
        </div>
        <div className="form-container">
          <input type="email" placeholder="Correo electrónico" className="input-field" />
          <input type="text" placeholder="Usuario" className="input-field" />
          <input type="password" placeholder="Contraseña" className="input-field" />
          <button className="register-btn" onClick={handleRegister}>Finalizar Registro</button>
          <p className="nav-link" onClick={goToLogin}>¿Tienes cuenta? Inicia Sesión</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
