import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import '../styles/Pregunta.css';

const PreguntaDefinicion = forwardRef(({ world, difficulty }, ref) => {
  const [preguntaData, setPreguntaData] = useState(null);
  const [seleccionada, setSeleccionada] = useState(null);

  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:8082/api/openai/preguntaDefinicion?mundo=${encodeURIComponent(world.name)}&dificultad=${difficulty}`,
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
  }, [world, difficulty]); // <--- QUITAMOS indice de dependencias

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
