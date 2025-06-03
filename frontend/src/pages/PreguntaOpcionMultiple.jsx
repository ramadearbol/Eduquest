import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../styles/Pregunta.css';

const PreguntaOpcionMultiple = forwardRef(({ world, difficulty }, ref) => {
  const [preguntaData, setPreguntaData] = useState(null);
  const [seleccion, setSeleccion] = useState(null);

  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:8082/api/openai/preguntaOpcionMultiple?mundo=${encodeURIComponent(world.name)}&dificultad=${difficulty}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const dataText = await res.text();
        const parsed = JSON.parse(dataText);
        setPreguntaData(parsed);
        setSeleccion(null);
      } catch (error) {
        console.error('Error al cargar la pregunta de opción múltiple:', error);
      }
    };

    if (world && difficulty != null) {
      fetchPregunta();
    }
  }, [world?.name, difficulty]);

  useImperativeHandle(ref, () => ({
    validarRespuesta: () => {
      if (!seleccion || !preguntaData) return null;
      return preguntaData.respuesta_correcta.trim().toLowerCase() === seleccion.trim().toLowerCase();
    },
  }));

  const handleSeleccion = (opcion) => {
    setSeleccion(opcion);
  };

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Opción Múltiple</h2>
        <p className="pregunta-contexto">
          Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong>
        </p>

        <p className="pregunta-texto">{preguntaData?.pregunta || "Cargando pregunta..."}</p>

        <div className="opciones">
          {preguntaData?.opciones?.map((opcion, index) => (
            <button
              key={index}
              className={`opcion-btn ${seleccion === opcion ? 'selected' : ''}`}
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

export default PreguntaOpcionMultiple;
