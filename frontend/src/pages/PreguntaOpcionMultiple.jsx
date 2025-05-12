import React, { useState } from 'react';

function PreguntaOpcionMultiple({ world, difficulty }) {
  const [seleccion, setSeleccion] = useState(null);

  const opciones = ['int', 'String', 'float', 'boolean'];

  return (
    <div>
      <h3>¿Cuál de estos es un tipo de dato primitivo en Java?</h3>
      <ul className="opciones">
        {opciones.map((opcion, index) => (
          <button
            key={index}
            className={`opcion-btn ${seleccion === opcion ? 'selected' : ''}`}
            onClick={() => setSeleccion(opcion)}
          >
            {opcion}
          </button>
        ))}
      </ul>
    </div>
  );
}

export default PreguntaOpcionMultiple;
