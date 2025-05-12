import React, { useState } from 'react';

function PreguntaVerdaderoFalso({ world, difficulty }) {
  const [respuesta, setRespuesta] = useState(null);

  return (
    <div>
      <h3>¿Verdadero o falso? Una clase en Java puede tener múltiples constructores.</h3>
      <div className="opciones">
        <button
          className={`opcion-btn ${respuesta === 'verdadero' ? 'selected' : ''}`}
          onClick={() => setRespuesta('verdadero')}
        >
          Verdadero
        </button>
        <button
          className={`opcion-btn ${respuesta === 'falso' ? 'selected' : ''}`}
          onClick={() => setRespuesta('falso')}
        >
          Falso
        </button>
      </div>
    </div>
  );
}

export default PreguntaVerdaderoFalso;
