import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../styles/Pregunta.css';

// URL base del backend desde variable de entorno
const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

// Componente para pregunta tipo Verdadero o Falso
const PreguntaVerdaderoFalso = forwardRef(({ world, difficulty }, ref) => {
  // Estado para guardar los datos de la pregunta recibida del backend
  const [preguntaData, setPreguntaData] = useState(null);

  // Estado para guardar la respuesta seleccionada por el usuario ("verdadero" o "falso")
  const [respuesta, setRespuesta] = useState(null);

  // Al cambiar el mundo o la dificultad, obtener nueva pregunta desde backend
  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const token = localStorage.getItem("token");

        // Solicitar pregunta Verdadero/Falso según mundo y dificultad
        const res = await fetch(
          `${BACKEND_URL}/api/openai/preguntaVerdadero?mundo=${encodeURIComponent(world.name)}&dificultad=${difficulty}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        // Validar que la respuesta fue exitosa
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        // Parsear JSON con datos de la pregunta
        const parsed = await res.json();

        // Guardar datos en estado y resetear respuesta seleccionada
        setPreguntaData(parsed);
        setRespuesta(null);
      } catch (error) {
        console.error('Error al cargar la pregunta:', error);
      }
    };

    // Solo ejecutar si mundo y dificultad están definidos
    if (world && difficulty != null) {
      fetchPregunta();
    }
  }, [world, difficulty]);

  // Exponer función para validar la respuesta al componente padre
  useImperativeHandle(ref, () => ({
    validarRespuesta: () => {
      if (!respuesta || !preguntaData) return null;

      // Comparar respuesta seleccionada con la respuesta correcta (ignorando mayúsculas y espacios)
      return preguntaData.respuesta_correcta.toLowerCase().trim() === respuesta.toLowerCase().trim();
    },
  }));

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Verdadero o Falso</h2>

        {/* Mostrar contexto con mundo y dificultad */}
        <p className="pregunta-contexto">
          Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong>
        </p>

        {/* Mostrar el enunciado de la pregunta o mensaje de carga */}
        <p className="pregunta-texto">
          {preguntaData?.pregunta || 'Cargando pregunta...'}
        </p>

        {/* Botones para elegir Verdadero o Falso */}
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
