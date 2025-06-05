import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../styles/Pregunta.css';

const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL;

const PreguntaVerdaderoFalso = forwardRef(({ world, difficulty }, ref) => {
  const [preguntaData, setPreguntaData] = useState(null);
  const [respuesta, setRespuesta] = useState(null);

  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${BACKEND_URL}/api/openai/preguntaVerdadero?mundo=${encodeURIComponent(world.name)}&dificultad=${difficulty}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const parsed = await res.json();
        setPreguntaData(parsed);
        setRespuesta(null); // Reiniciar selección
      } catch (error) {
        console.error('Error al cargar la pregunta:', error);
      }
    };

    if (world && difficulty != null) {
      fetchPregunta();
    }
  }, [world, difficulty]);

  useImperativeHandle(ref, () => ({
    validarRespuesta: () => {
      if (!respuesta || !preguntaData) return null;
      return preguntaData.respuesta_correcta.toLowerCase().trim() === respuesta.toLowerCase().trim();
    },
  }));

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Verdadero o Falso</h2>
        <p className="pregunta-contexto">
          Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong>
        </p>

        <p className="pregunta-texto">
          {preguntaData?.pregunta || 'Cargando pregunta...'}
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
});

export default PreguntaVerdaderoFalso;
