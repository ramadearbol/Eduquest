import React, { useState } from 'react';
import '../styles/Pregunta.css'; // Asegúrate de tener estilos separados si no los tienes

function PreguntaDefinicion({ world, difficulty, preguntaData }) {
  // preguntaData puede venir así:
  // {
  //   pregunta: "¿Qué es una variable en Java?",
  //   opciones: ["Un tipo de dato", "Una función", "Una ubicación en memoria", "Un paquete"],
  //   respuestaCorrecta: "Una ubicación en memoria"
  // }

  const [seleccionada, setSeleccionada] = useState(null);

  const handleSeleccion = (opcion) => {
    setSeleccionada(opcion);
  };

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Definición</h2>
        <p className="pregunta-contexto">Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong></p>

        <p className="pregunta-texto">{preguntaData?.pregunta || "Cargando pregunta..."}</p>

        <div className="opciones">
          {preguntaData?.opciones?.map((opcion, index) => (
            <button
              key={index}
              className={`opcion-btn ${seleccionada === opcion ? 'selected' : ''}`}
              onClick={() => handleSeleccion(opcion)}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreguntaDefinicion;
