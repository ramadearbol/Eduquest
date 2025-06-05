import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../styles/Pregunta.css';

const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL;

const PreguntaRelacionarConceptos = forwardRef(({ world, difficulty }, ref) => {
  const [preguntaData, setPreguntaData] = useState(null);
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${BACKEND_URL}/api/openai/preguntaRelacionarConceptos?mundo=${encodeURIComponent(world.name)}&dificultad=${difficulty}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const data = await res.json();
        setPreguntaData(data);
        setRespuestas({});
      } catch (error) {
        console.error('Error al cargar la pregunta de relacionar conceptos:', error);
      }
    };

    if (world && difficulty != null) {
      fetchPregunta();
    }
  }, [world, difficulty]);

  useImperativeHandle(ref, () => ({
    validarRespuesta: () => {
      if (!preguntaData) return null;

      const correctas = preguntaData.definiciones;
      return Object.keys(correctas).every(
        (concepto) =>
          respuestas[concepto]?.trim().toLowerCase() === correctas[concepto].trim().toLowerCase()
      );
    },
  }));

  const conceptos = preguntaData?.conceptos || [];
  const definiciones = preguntaData ? Object.values(preguntaData.definiciones) : [];

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
                {definiciones.map((definicion, i) => (
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
});

export default PreguntaRelacionarConceptos;
