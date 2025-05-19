import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import logoEduQuest from "../assets/Logo.png";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const validateFields = () => {
    let valid = true;
    setEmailError("");
    setUsernameError("");
    setPasswordError("");
    setServerError("");

    if (!email) {
      setEmailError("El correo electrónico es obligatorio");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Correo electrónico inválido");
      valid = false;
    }

    if (!username) {
      setUsernameError("El nombre de usuario es obligatorio");
      valid = false;
    }

    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      valid = false;
    }

    return valid;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setServerError(data.message || "Error en el registro");
        return;
      }

      // Si todo ok, redirigir a /home/aprender
      navigate("/home/aprender");
    } catch (error) {
      console.error("Register error:", error);
      setServerError("Error de conexión al servidor");
    }
  };

  const goToLogin = () => {
    navigate("/");
  };

  return (
    <div className="register-container">
      <div className="login-box">
        <div className="logo-container">
          <img src={logoEduQuest} alt="Logo EduQuest" className="logo-img" />
        </div>
        <div className="form-container">
          <input
            type="email"
            placeholder={emailError ? emailError : "Correo electrónico"}
            className={`input-field ${emailError ? "input-error" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailError("")}
          />
          <input
            type="text"
            placeholder={usernameError ? usernameError : "Usuario"}
            className={`input-field ${usernameError ? "input-error" : ""}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setUsernameError("")}
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
          <button className="register-btn" onClick={handleRegister}>
            Finalizar Registro
          </button>
          <p className="nav-link" onClick={goToLogin}>
            ¿Tienes cuenta? Inicia Sesión
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
