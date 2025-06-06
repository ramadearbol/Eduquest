// Importaciones necesarias de React y CSS
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import '../styles/Pregunta.css';

// Se obtiene la URL del backend desde variables de entorno
const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

// Componente principal definido como forwardRef para poder usar ref desde el componente padre
const PreguntaDefinicion = forwardRef(({ world, difficulty }, ref) => {
  // Estado para guardar la pregunta que viene desde el backend
  const [preguntaData, setPreguntaData] = useState(null);

  // Estado para saber qué opción eligió el usuario
  const [seleccionada, setSeleccionada] = useState(null);

  // Hook que se ejecuta cada vez que cambian `world` o `difficulty`
  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const token = localStorage.getItem("token");

        // Se hace una petición GET al backend para obtener una pregunta tipo definición
        const res = await fetch(
          `${BACKEND_URL}/api/openai/preguntaDefinicion?mundo=${encodeURIComponent(world.name)}&dificultad=${difficulty}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        // Validación del estado de la respuesta
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

        // Se obtiene el JSON de la respuesta
        const json = await res.json();

        // Se guarda la pregunta en el estado y se reinicia la selección del usuario
        setPreguntaData(json);
        setSeleccionada(null);
      } catch (error) {
        console.error("Error cargando pregunta definición:", error);
      }
    };

    // Solo se llama a la API si hay `world` y `difficulty` definidos
    if (world && difficulty != null) {
      fetchPregunta();
    }
  }, [world, difficulty]); // Ejecutar efecto si cambia alguno de estos dos valores

  // Maneja la selección del usuario (guarda la opción elegida)
  const handleSeleccion = (opcion) => {
    setSeleccionada(opcion);
  };

  // Permite al componente padre ejecutar una función desde fuera usando `ref`
  useImperativeHandle(ref, () => ({
    // Esta función devuelve true si la respuesta es correcta, false si no, y null si no ha seleccionado nada
    validarRespuesta: () => {
      if (seleccionada === null) return null;
      return seleccionada === preguntaData?.respuesta_correcta;
    },
  }));

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Definición</h2>

        {/* Mostrar mundo y dificultad actual */}
        <p className="pregunta-contexto">
          Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong>
        </p>

        {/* Mostrar la pregunta o texto de carga */}
        <p className="pregunta-texto">{preguntaData?.pregunta || "Cargando pregunta..."}</p>

        {/* Mostrar las opciones como botones */}
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
