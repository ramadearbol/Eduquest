import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../styles/Pregunta.css';

// URL base del backend desde variable de entorno
const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

// Componente que renderiza una pregunta para completar código
const PreguntaCompletarCodigo = forwardRef(({ world, difficulty }, ref) => {
  // Estados para guardar los datos de la pregunta y el input del usuario
  const [preguntaData, setPreguntaData] = useState(null);
  const [input, setInput] = useState('');

  // Al cambiar el mundo o dificultad, cargar una nueva pregunta desde backend
  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const token = localStorage.getItem("token");

        // Realiza la solicitud al backend con el mundo y dificultad como parámetros
        const res = await fetch(
          `${BACKEND_URL}/api/openai/preguntaCompletarCodigo?mundo=${encodeURIComponent(world.name)}&dificultad=${difficulty}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        // Manejo de error si la respuesta no es exitosa
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        // Parsear respuesta JSON y guardar en estado
        const parsed = await res.json();
        setPreguntaData(parsed);
        setInput(""); // Limpiar input al cargar nueva pregunta
      } catch (error) {
        console.error('Error al cargar la pregunta:', error);
      }
    };

    // Solo buscar pregunta si el mundo y la dificultad están definidos
    if (world && difficulty != null) {
      fetchPregunta();
    }
  }, [world, difficulty]);

  // Exponer función validarRespuesta al componente padre a través de la referencia
  useImperativeHandle(ref, () => ({
    validarRespuesta: () => {
      // Si no hay pregunta cargada o el input está vacío, no se puede validar
      if (!preguntaData || !input) return null;

      // Comparar input del usuario con la respuesta correcta (ignorando espacios y mayúsculas)
      return preguntaData.respuesta_correcta.trim().toLowerCase() === input.trim().toLowerCase();
    },
  }));

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Completar Código</h2>

        {/* Mostrar contexto de la pregunta: mundo y dificultad */}
        <p className="pregunta-contexto">
          Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong>
        </p>

        {/* Texto de la pregunta */}
        <p className="pregunta-texto">
          {preguntaData?.pregunta || 'Cargando pregunta...'}
        </p>

        {/* Mostrar el fragmento de código que debe ser completado */}
        <pre className="codigo-ejemplo">
          {preguntaData?.codigo || 'Cargando código...'}
        </pre>

        {/* Input para que el usuario escriba la parte faltante */}
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
