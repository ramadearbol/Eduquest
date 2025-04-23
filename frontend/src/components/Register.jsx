// src/components/Register.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/home");
  };

  return (
    <div className="login-container">
      <h1>Registro en EduQuest</h1>
      <button onClick={handleRegister}>Finalizar Registro</button>
    </div>
  );
}

export default Register;
