import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logoEduQuest from "../assets/Logo.png";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home");
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="logo-container">
            <img src={logoEduQuest} alt="Logo EduQuest" className="logo-img" />
          </div>
          <div className="form-container">
            <input type="text" placeholder="Usuario" className="input-field" />
            <input type="password" placeholder="Contraseña" className="input-field" />
            <button className="login-btn" onClick={handleLogin}>Iniciar Sesión</button>
            <p className="nav-link" onClick={goToRegister}>¿No tienes cuenta? Regístrate</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
