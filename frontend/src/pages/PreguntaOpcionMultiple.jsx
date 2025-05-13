import React, { useState } from 'react';
import '../styles/Pregunta.css'; // Asegúrate de tener un archivo de estilos común para todas las preguntas

function PreguntaOpcionMultiple({ world, difficulty, preguntaData }) {
  // preguntaData debe tener esta estructura:
  // {
  //   pregunta: "¿Cuál de estos es un tipo de dato primitivo en Java?",
  //   opciones: ["int", "String", "float", "boolean"],
  //   respuestaCorrecta: "int"
  // }

  const [seleccion, setSeleccion] = useState(null);

  const handleSeleccion = (opcion) => {
    setSeleccion(opcion);
  };

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Opción Múltiple</h2>
        <p className="pregunta-contexto">
          Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong>
        </p>

        <p className="pregunta-texto">{preguntaData?.pregunta || "Cargando pregunta..."}</p>

        <div className="opciones">
          {preguntaData?.opciones?.map((opcion, index) => (
            <button
              key={index}
              className={`opcion-btn ${seleccion === opcion ? 'selected' : ''}`}
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

export default PreguntaOpcionMultiple;
