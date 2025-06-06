import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import logoEduQuest from "../assets/Logo.png";

// URL base del backend desde variables de entorno
const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

function Register() {
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Estados para mensajes de error específicos por campo y servidor
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  /**
   * Función para validar los campos del formulario de registro:
   * - Comprueba que email, username y password no estén vacíos.
   * - Verifica formato correcto del email.
   * - Verifica longitud mínima de la contraseña.
   * - Actualiza los estados de error correspondientes.
   * - Devuelve true si todos los campos son válidos.
   */
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

  /**
   * Función que maneja el proceso de registro:
   * 1. Valida los campos antes de enviar.
   * 2. Envía POST al endpoint /auth/register con email, username y password.
   * 3. Si falla, muestra el error recibido del backend.
   * 4. Si éxito, realiza login automático para obtener token.
   * 5. Si login automático falla, muestra error.
   * 6. Si éxito, guarda token en localStorage y navega al dashboard.
   */
  const handleRegister = async () => {
    if (!validateFields()) return;

    try {
      // Paso 1: Registrar el usuario en el backend
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        // Mostrar error recibido del backend si falla registro
        const data = await response.json();
        setServerError(data.message || "Error en el registro");
        return;
      }

      // Paso 2: Login automático tras registro exitoso
      const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        // Mostrar error recibido del backend si falla login automático
        const loginData = await loginRes.json();
        setServerError(loginData.message || "Error al iniciar sesión automáticamente");
        return;
      }

      // Login exitoso: guardar token y navegar a dashboard
      const loginData = await loginRes.json();
      localStorage.setItem("token", loginData.token);

      navigate("/home/aprender");
    } catch (error) {
      console.error("Register error:", error);
      setServerError("Error de conexión al servidor");
    }
  };

  /**
   * Función para navegar a la pantalla de login
   */
  const goToLogin = () => {
    navigate("/");
  };

  return (
    <div className="register-container">
      <div className="login-box">

        {/* Logo de la aplicación */}
        <div className="logo-container">
          <img src={logoEduQuest} alt="Logo EduQuest" className="logo-img" />
        </div>

        {/* Formulario de registro */}
        <div className="form-container">
          <input
            type="email"
            placeholder={emailError || "Correo electrónico"}
            className={`input-field ${emailError ? "input-error" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailError("")} // Limpiar error al enfocar
          />
          <input
            type="text"
            placeholder={usernameError || "Usuario"}
            className={`input-field ${usernameError ? "input-error" : ""}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setUsernameError("")} // Limpiar error al enfocar
          />
          <input
            type="password"
            placeholder={passwordError || "Contraseña"}
            className={`input-field ${passwordError ? "input-error" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordError("")} // Limpiar error al enfocar
          />

          {/* Mostrar error general del servidor */}
          {serverError && <p className="error-msg">{serverError}</p>}

          {/* Botón para finalizar registro */}
          <button className="register-btn" onClick={handleRegister}>
            Finalizar Registro
          </button>

          {/* Link para ir a login */}
          <p className="nav-link" onClick={goToLogin}>
            ¿Tienes cuenta? Inicia Sesión
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
