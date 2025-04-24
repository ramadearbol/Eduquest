import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import logoEduQuest from "../assets/Logo.png";

function Register() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/home");
  };

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
        </div>
      </div>
    </div>
  );
}

export default Register;
