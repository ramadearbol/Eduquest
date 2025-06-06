import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logoEduQuest from "../assets/Logo.png";

// URL base del backend desde variables de entorno
const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

function Login() {
  const navigate = useNavigate();

  // Estados para campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados para mensajes de error por campo y del servidor
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  // Estado para controlar la carga (loading) durante la llamada al backend
  const [loading, setLoading] = useState(false);

  /**
   * Función para validar los campos del formulario.
   * - Verifica que email no esté vacío y tenga formato válido.
   * - Verifica que password no esté vacío.
   * - Actualiza estados de error y devuelve booleano de validez.
   */
  const validateFields = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");
    setServerError("");

    if (!email) {
      setEmailError("El correo electrónico es obligatorio");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Correo electrónico inválido");
      valid = false;
    }

    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      valid = false;
    }

    return valid;
  };

  /**
   * Función que maneja el proceso de login:
   * - Valida campos antes de enviar.
   * - Envía POST al backend con email y password.
   * - Si error de backend, muestra mensaje.
   * - Si éxito, guarda token en localStorage y navega a la página principal.
   * - Controla estado de carga para deshabilitar botón.
   */
  const handleLogin = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Si la respuesta no es OK, obtener mensaje de error y mostrarlo
        const data = await response.json();
        setServerError(data.message || "Error en la autenticación");
        return;
      }

      // Login exitoso: obtener token y navegar
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/home/aprender");
    } catch (error) {
      console.error("Login error:", error);
      setServerError("Error de conexión al servidor");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Función para redirigir a la página de registro
   */
  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">

          {/* Logo de la app */}
          <div className="logo-container">
            <img src={logoEduQuest} alt="Logo EduQuest" className="logo-img" />
          </div>

          {/* Formulario de login */}
          <div className="form-container">
            <input
              type="email"
              // Muestra error como placeholder si existe, sino texto normal
              placeholder={emailError ? emailError : "Correo electrónico"}
              className={`input-field ${emailError ? "input-error" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailError("")} // Limpiar error al enfocar
            />
            <input
              type="password"
              placeholder={passwordError ? passwordError : "Contraseña"}
              className={`input-field ${passwordError ? "input-error" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordError("")} // Limpiar error al enfocar
            />

            {/* Mostrar error general del servidor */}
            {serverError && <p className="error-msg">{serverError}</p>}

            {/* Botón login, deshabilitado mientras carga */}
            <button className="login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>

            {/* Link para ir a registro */}
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
