import React, { useState } from 'react';
import '../styles/Pregunta.css';

function PreguntaRelacionarConceptos({ world, difficulty, preguntaData }) {
  // preguntaData esperado:
  // {
  //   pregunta: "Relaciona cada concepto con su definición:",
  //   conceptos: ["Clase", "Método", "Variable"],
  //   definiciones: {
  //     Clase: "Define un tipo de objeto.",
  //     Método: "Contiene instrucciones que se ejecutan.",
  //     Variable: "Almacena datos."
  //   }
  // }

  const [respuestas, setRespuestas] = useState({});
  const conceptos = preguntaData?.conceptos || ['Clase', 'Método', 'Variable'];
  const definiciones = preguntaData?.definiciones || {
    Clase: 'Define un tipo de objeto.',
    Método: 'Contiene instrucciones que se ejecutan.',
    Variable: 'Almacena datos.'
  };

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Relacionar Conceptos</h2>
        <p className="pregunta-contexto">
          Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong>
        </p>

        <p className="pregunta-texto">{preguntaData?.pregunta || 'Relaciona cada concepto con su definición:'}</p>

        <div className="relacionar-lista">
          {conceptos.map((concepto, index) => (
            <div key={index} className="relacion-item">
              <label className="relacion-label">{concepto}</label>
              <select
                className="relacion-select"
                value={respuestas[concepto] || ''}
                onChange={(e) =>
                  setRespuestas((prev) => ({ ...prev, [concepto]: e.target.value }))
                }
              >
                <option value="">Selecciona definición</option>
                {Object.values(definiciones).map((definicion, i) => (
                  <option key={i} value={definicion}>
                    {definicion}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreguntaRelacionarConceptos;
