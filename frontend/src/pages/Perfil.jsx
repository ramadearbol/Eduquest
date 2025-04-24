// src/pages/Perfil.jsx
import React, { useState, useEffect } from "react";
import iconoPerfil from "../assets/Perfil.png"; // Asegúrate de que esta imagen esté bien ubicada.
import '../styles/Perfil.css';

function Perfil() {
  // Estado para los campos
  const [nombre, setNombre] = useState("UsuarioEjemplo");
  const [correo, setCorreo] = useState("usuario@example.com");
  const [contraseñaActual, setContraseñaActual] = useState("");
  const [contraseñaNueva, setContraseñaNueva] = useState("");
  
  const [nombreOriginal, setNombreOriginal] = useState("UsuarioEjemplo");
  const [correoOriginal, setCorreoOriginal] = useState("usuario@example.com");
  const [contraseñaActualOriginal, setContraseñaActualOriginal] = useState("");
  const [contraseñaNuevaOriginal, setContraseñaNuevaOriginal] = useState("");

  const [changesMade, setChangesMade] = useState(false);

  // Comprobar si los cambios se han realizado
  useEffect(() => {
    // Compara los valores actuales con los valores originales
    if (
      nombre !== nombreOriginal ||
      correo !== correoOriginal ||
      contraseñaActual !== contraseñaActualOriginal ||
      contraseñaNueva !== contraseñaNuevaOriginal
    ) {
      setChangesMade(true);
    } else {
      setChangesMade(false);
    }
  }, [nombre, correo, contraseñaActual, contraseñaNueva, nombreOriginal, correoOriginal, contraseñaActualOriginal, contraseñaNuevaOriginal]);

  // Función para manejar los cambios en los inputs
  const handleInputChange = () => {
    // Verifica si se realiza algún cambio en los campos
    setChangesMade(true);
  };

  // Función para guardar los cambios
  const handleGuardarCambios = () => {
    // Lógica para guardar los cambios (por ejemplo, enviarlo a la base de datos)
    setNombreOriginal(nombre);
    setCorreoOriginal(correo);
    setContraseñaActualOriginal(contraseñaActual);
    setContraseñaNuevaOriginal(contraseñaNueva);
    console.log("Cambios guardados");

    setChangesMade(false); // Desactiva el botón después de guardar
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        {/* Foto de perfil */}
        <div className="perfil-photo">
          <img src={iconoPerfil} alt="Foto de perfil" className="perfil-img" />
        </div>

        {/* Formulario de edición */}
        <div className="perfil-form">
          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                handleInputChange();
              }}
              className="form-input"
            />
          </div>

          {/* Correo */}
          <div className="form-group">
            <label htmlFor="correo">Correo</label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                handleInputChange();
              }}
              className="form-input"
            />
          </div>

          {/* Contraseña actual */}
          <div className="form-group">
            <label htmlFor="contraseñaActual">Contraseña Actual</label>
            <input
              type="password"
              id="contraseñaActual"
              value={contraseñaActual}
              onChange={(e) => {
                setContraseñaActual(e.target.value);
                handleInputChange();
              }}
              className="form-input"
            />
          </div>

          {/* Contraseña nueva */}
          <div className="form-group">
            <label htmlFor="contraseñaNueva">Contraseña Nueva</label>
            <input
              type="password"
              id="contraseñaNueva"
              value={contraseñaNueva}
              onChange={(e) => {
                setContraseñaNueva(e.target.value);
                handleInputChange();
              }}
              className="form-input"
            />
          </div>

          {/* Botón guardar cambios */}
          <button
            onClick={handleGuardarCambios}
            className="save-btn"
            disabled={!changesMade} // El botón solo está habilitado si hay cambios
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
