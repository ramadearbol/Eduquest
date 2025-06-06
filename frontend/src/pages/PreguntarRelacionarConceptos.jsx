import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../styles/Pregunta.css';

// URL base del backend desde variable de entorno
const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

// Componente para pregunta de relacionar conceptos con sus definiciones
const PreguntaRelacionarConceptos = forwardRef(({ world, difficulty }, ref) => {
  // Estado para guardar datos de la pregunta
  const [preguntaData, setPreguntaData] = useState(null);

  // Estado para guardar respuestas seleccionadas por el usuario
  const [respuestas, setRespuestas] = useState({});

  // Al cambiar mundo o dificultad, obtener nueva pregunta del backend
  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const token = localStorage.getItem("token");

        // Solicitar pregunta de relacionar conceptos desde backend
        const res = await fetch(
          `${BACKEND_URL}/api/openai/preguntaRelacionarConceptos?mundo=${encodeURIComponent(world.name)}&dificultad=${difficulty}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        // Validar respuesta exitosa
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        // Parsear JSON con datos de pregunta
        const data = await res.json();

        // Guardar datos y resetear respuestas seleccionadas
        setPreguntaData(data);
        setRespuestas({});
      } catch (error) {
        console.error('Error al cargar la pregunta de relacionar conceptos:', error);
      }
    };

    // Solo ejecutar si mundo y dificultad están definidos
    if (world && difficulty != null) {
      fetchPregunta();
    }
  }, [world, difficulty]);

  // Exponer función para validar respuestas al componente padre
  useImperativeHandle(ref, () => ({
    validarRespuesta: () => {
      if (!preguntaData) return null;

      // Obtener definiciones correctas
      const correctas = preguntaData.definiciones;

      // Validar que para cada concepto la definición seleccionada sea correcta (ignorando espacios y mayúsculas)
      return Object.keys(correctas).every(
        (concepto) =>
          respuestas[concepto]?.trim().toLowerCase() === correctas[concepto].trim().toLowerCase()
      );
    },
  }));

  // Listas para renderizar: conceptos y definiciones disponibles
  const conceptos = preguntaData?.conceptos || [];
  const definiciones = preguntaData ? Object.values(preguntaData.definiciones) : [];

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Relacionar Conceptos</h2>

        {/* Mostrar contexto: mundo y dificultad */}
        <p className="pregunta-contexto">
          Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong>
        </p>

        {/* Texto introductorio de la pregunta */}
        <p className="pregunta-texto">
          {preguntaData?.pregunta || 'Relaciona cada concepto con su definición:'}
        </p>

        {/* Lista con cada concepto y un select para elegir su definición */}
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

                {/* Opciones con todas las definiciones para elegir */}
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
