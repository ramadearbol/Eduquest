import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logoEduQuest from "../assets/Logo.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const validateFields = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setServerError("");

    if (!email) {
      setEmailError("El correo electrónico es obligatorio");
      valid = false;
    }

    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setServerError(data.message || "Error en la autenticación");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/home/aprender");
    } catch (error) {
      console.error("Login error:", error);
      setServerError("Error de conexión al servidor");
    }
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
            <input
              type="text"
              placeholder={emailError ? emailError : "Correo electrónico"}
              className={`input-field ${emailError ? "input-error" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailError("")}
            />
            <input
              type="password"
              placeholder={passwordError ? passwordError : "Contraseña"}
              className={`input-field ${passwordError ? "input-error" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordError("")}
            />
            {serverError && <p className="error-msg">{serverError}</p>}
            <button className="login-btn" onClick={handleLogin}>
              Iniciar Sesión
            </button>
            <p className="nav-link" onClick={goToRegister}>
              ¿No tienes cuenta? Regístrate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
