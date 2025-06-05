import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import '../styles/Pregunta.css';

const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL;

const PreguntaDefinicion = forwardRef(({ world, difficulty }, ref) => {
  const [preguntaData, setPreguntaData] = useState(null);
  const [seleccionada, setSeleccionada] = useState(null);

  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${BACKEND_URL}/api/openai/preguntaDefinicion?mundo=${encodeURIComponent(world.name)}&dificultad=${difficulty}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const json = await res.json();
        setPreguntaData(json);
        setSeleccionada(null); // Reiniciar selección
      } catch (error) {
        console.error("Error cargando pregunta definición:", error);
      }
    };

    if (world && difficulty != null) {
      fetchPregunta();
    }
  }, [world, difficulty]); // quitamos índice de dependencias

  const handleSeleccion = (opcion) => {
    setSeleccionada(opcion);
  };

  useImperativeHandle(ref, () => ({
    validarRespuesta: () => {
      if (seleccionada === null) return null;
      return seleccionada === preguntaData?.respuesta_correcta;
    },
  }));

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Definición</h2>
        <p className="pregunta-contexto">
          Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong>
        </p>

        <p className="pregunta-texto">{preguntaData?.pregunta || "Cargando pregunta..."}</p>

        <div className="opciones">
          {preguntaData?.opciones?.map((opcion, index) => (
            <button
              key={index}
              className={`opcion-btn ${seleccionada === opcion ? 'selected' : ''}`}
              onClick={() => handleSeleccion(opcion)}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export default PreguntaDefinicion;
