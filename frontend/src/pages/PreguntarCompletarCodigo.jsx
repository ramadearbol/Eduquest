import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../styles/Pregunta.css';

const PreguntaCompletarCodigo = forwardRef(({ world, difficulty }, ref) => {
  const [preguntaData, setPreguntaData] = useState(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:8082/api/openai/preguntaCompletarCodigo?mundo=${encodeURIComponent(world.name)}&dificultad=${difficulty}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const parsed = await res.json();
        setPreguntaData(parsed);
        setInput(''); // Reiniciar input
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
      if (!preguntaData || !input) return null;
      return preguntaData.respuesta_correcta.trim().toLowerCase() === input.trim().toLowerCase();
    },
  }));

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Completar Código</h2>
        <p className="pregunta-contexto">
          Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong>
        </p>

        <p className="pregunta-texto">{preguntaData?.pregunta || 'Cargando pregunta...'}</p>

        <pre className="codigo-ejemplo">
          {preguntaData?.codigo || 'Cargando código...'}
        </pre>

        <input
          className="opcion-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe la parte que falta"
        />
      </div>
    </div>
  );
});

export default PreguntaCompletarCodigo;
