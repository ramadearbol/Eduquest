import React, { useState, useEffect } from "react";
import iconoPerfil from "../assets/Perfil.png";
import '../styles/Perfil.css';

const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

function Perfil() {
  // Estados para el formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseñaActual, setContraseñaActual] = useState("");
  const [contraseñaNueva, setContraseñaNueva] = useState("");
  const [nombreOriginal, setNombreOriginal] = useState("");
  const [changesMade, setChangesMade] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Al montar el componente, obtener datos del perfil desde backend
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${BACKEND_URL}/api/user/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar el perfil");
        return res.json();
      })
      .then(data => {
        setNombre(data.username);
        setCorreo(data.email);
        setNombreOriginal(data.username);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg("Sesión expirada o no autorizada");
      });
  }, []);

  // Detecta si hay cambios para activar o desactivar el botón "Guardar"
  useEffect(() => {
    const changed = 
      nombre !== nombreOriginal ||
      contraseñaActual.length > 0 ||
      contraseñaNueva.length > 0;

    setChangesMade(changed);
  }, [nombre, contraseñaActual, contraseñaNueva, nombreOriginal]);

  // Maneja el guardado de cambios en nombre o contraseña
  const handleGuardarCambios = () => {
    setErrorMsg("");

    // Validación: si se quiere cambiar contraseña, ambos campos deben estar completos
    if ((contraseñaNueva && !contraseñaActual) || (!contraseñaNueva && contraseñaActual)) {
      setErrorMsg("Debe completar ambos campos de contraseña para cambiarla");
      return;
    }

    const token = localStorage.getItem("token");

    // Payload para enviar al backend
    const payload = {
      username: nombre,
      password: contraseñaNueva || null
    };

    // Si cambia la contraseña, enviamos la contraseña actual como query param para validar backend
    const url = `${BACKEND_URL}/api/user/me${contraseñaNueva ? `?oldPassword=${encodeURIComponent(contraseñaActual)}` : ""}`;

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) return res.json().then(data => { throw new Error(data.message || "Error al actualizar el perfil"); });
        return res.json();
      })
      .then(data => {
        // Actualizar estado con nuevos valores tras guardado exitoso
        setNombreOriginal(data.username);
        setContraseñaActual("");
        setContraseñaNueva("");
        setChangesMade(false);
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(err.message);
      });
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-photo">
          <img src={iconoPerfil} alt="Foto de perfil" className="perfil-img" />
        </div>
        <div className="perfil-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo</label>
            <input
              type="email"
              id="correo"
              value={correo}
              disabled
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contraseñaActual">Contraseña Actual</label>
            <input
              type="password"
              id="contraseñaActual"
              value={contraseñaActual}
              onChange={(e) => setContraseñaActual(e.target.value)}
              className="form-input"
              autoComplete="current-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contraseñaNueva">Contraseña Nueva</label>
            <input
              type="password"
              id="contraseñaNueva"
              value={contraseñaNueva}
              onChange={(e) => setContraseñaNueva(e.target.value)}
              className="form-input"
              autoComplete="new-password"
            />
          </div>

          {/* Mostrar mensaje de error si existe */}
          {errorMsg && (
            <div className="error-message">
              {errorMsg}
            </div>
          )}

          {/* Botón deshabilitado si no hay cambios */}
          <button
            onClick={handleGuardarCambios}
            className="save-btn"
            disabled={!changesMade}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
