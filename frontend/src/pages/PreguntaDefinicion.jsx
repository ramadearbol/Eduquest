import React from 'react';

function PreguntaDefinicion({ world, difficulty }) {
  return (
    <div>
      <h3>Pregunta de definición</h3>
      <p>Mundo: {world?.name}</p>
      <p>Dificultad: {difficulty} ⭐</p>
      <p>¿Qué es una variable en Java?</p>
      {/* Aquí irían las opciones/respuesta */}
    </div>
  );
}

export default PreguntaDefinicion;
