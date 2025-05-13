import React, { useState } from 'react';
import '../styles/Pregunta.css';

function PreguntaVerdaderoFalso({ world, difficulty, preguntaData }) {
  // preguntaData esperado:
  // {
  //   pregunta: "¿Verdadero o falso? Una clase en Java puede tener múltiples constructores."
  // }

  const [respuesta, setRespuesta] = useState(null);

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Verdadero o Falso</h2>
        <p className="pregunta-contexto">
          Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong>
        </p>

        <p className="pregunta-texto">
          {preguntaData?.pregunta || '¿Verdadero o falso? Una clase en Java puede tener múltiples constructores.'}
        </p>

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
    </div>
  );
}

export default PreguntaVerdaderoFalso;
