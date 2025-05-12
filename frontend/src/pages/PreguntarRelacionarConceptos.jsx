import React, { useState } from 'react';

function PreguntaRelacionarConceptos({ world, difficulty }) {
  const [respuestas, setRespuestas] = useState({});

  const conceptos = ['Clase', 'Método', 'Variable'];
  const definiciones = {
    'Clase': 'Define un tipo de objeto.',
    'Método': 'Contiene instrucciones que se ejecutan.',
    'Variable': 'Almacena datos.'
  };

  return (
    <div>
      <h3>Relaciona cada concepto con su definición:</h3>
      <div className="opciones">
        {conceptos.map((concepto) => (
          <div key={concepto} style={{ marginBottom: '1rem' }}>
            <strong>{concepto}:</strong>
            <select
              value={respuestas[concepto] || ''}
              onChange={(e) =>
                setRespuestas((prev) => ({ ...prev, [concepto]: e.target.value }))
              }
            >
              <option value="">Selecciona definición</option>
              {Object.values(definiciones).map((def, i) => (
                <option key={i} value={def}>{def}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreguntaRelacionarConceptos;
