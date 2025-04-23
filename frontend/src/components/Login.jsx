import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';
import logoEduquest from '../assets/Logo.png'; // Asegúrate de tener la imagen del logo

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Aquí puedes agregar la lógica para autenticar al usuario
    navigate("/home");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-container">
          <img src={logoEduquest} alt="Logo EduQuest" className="logo-img" />
        </div>
        <div className="form-container">
          <input
            type="text"
            className="input-field"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="input-field"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="login-btn">
            Iniciar Sesión
          </button>
          <button onClick={handleRegister} className="register-btn">
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
