import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../styles/Pregunta.css';

// Se obtiene la URL base del backend desde las variables de entorno
const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

const PreguntaOpcionMultiple = forwardRef(({ world, difficulty }, ref) => {
  // Estados para guardar los datos de la pregunta y la opción seleccionada por el usuario
  const [preguntaData, setPreguntaData] = useState(null);
  const [seleccion, setSeleccion] = useState(null);

  // Al montar o cambiar el mundo o dificultad, se obtiene una nueva pregunta desde el backend
  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${BACKEND_URL}/api/openai/preguntaOpcionMultiple?mundo=${encodeURIComponent(world.name)}&dificultad=${difficulty}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const data = await res.json();
        setPreguntaData(data);        // Guardar pregunta recibida
        setSeleccion(null);           // Reiniciar selección del usuario
      } catch (error) {
        console.error('Error al cargar la pregunta de opción múltiple:', error);
      }
    };

    if (world && difficulty != null) {
      fetchPregunta(); // Solo si ambos están definidos
    }
  }, [world?.name, difficulty]); // Se ejecuta cuando cambia el nombre del mundo o dificultad

  // Permite al componente padre validar la respuesta seleccionada
  useImperativeHandle(ref, () => ({
    validarRespuesta: () => {
      if (!seleccion || !preguntaData) return null;

      // Comparación de forma segura (ignorando mayúsculas y espacios)
      return preguntaData.respuesta_correcta.trim().toLowerCase() === seleccion.trim().toLowerCase();
    },
  }));

  // Guardar opción seleccionada
  const handleSeleccion = (opcion) => {
    setSeleccion(opcion);
  };

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Opción Múltiple</h2>

        {/* Contexto de la pregunta */}
        <p className="pregunta-contexto">
          Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong>
        </p>

        {/* Texto de la pregunta o indicador de carga */}
        <p className="pregunta-texto">{preguntaData?.pregunta || "Cargando pregunta..."}</p>

        {/* Botones de opciones */}
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
