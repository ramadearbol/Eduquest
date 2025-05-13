import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Actividad.css';

import PreguntaDefinicion from '../pages/PreguntaDefinicion';
import PreguntaOpcionMultiple from '../pages/PreguntaOpcionMultiple';
import PreguntaVerdaderoFalso from '../pages/PregunatVerdaderoFalso';
import PreguntaCompletarCodigo from '../pages/PreguntarCompletarCodigo';
import PreguntaRelacionarConceptos from '../pages/PreguntarRelacionarConceptos';

const preguntasComponentes = [
  PreguntaDefinicion,
  PreguntaOpcionMultiple,
  PreguntaVerdaderoFalso,
  PreguntaCompletarCodigo,
  PreguntaRelacionarConceptos,
];

const MAX_PREGUNTAS = 5;

function Actividad() {
  const navigate = useNavigate();
  const location = useLocation();
  const { world, difficulty } = location.state || {};

  const [indiceActual, setIndiceActual] = useState(0);
  const [progresoColores, setProgresoColores] = useState([]);
  const [preguntas, setPreguntas] = useState([]);
  
  const [mostrarOverlay, setMostrarOverlay] = useState(false); // Estado para controlar la visibilidad del overlay
  const [resultadoCorrecto, setResultadoCorrecto] = useState(false); // Estado para determinar si la respuesta es correcta

  // Genera una pregunta aleatoria de la lista de componentes
  const generarPregunta = (index) => {
    const Componente = preguntasComponentes[Math.floor(Math.random() * preguntasComponentes.length)];
    return <Componente key={index} world={world} difficulty={difficulty} />;
  };

  // Al cargar, genera las preguntas y las almacena
  useEffect(() => {
    if (!world || !difficulty) {
      navigate('/home/aprender');
      return;
    }

    const preguntasIniciales = Array.from({ length: MAX_PREGUNTAS }, (_, i) => generarPregunta(i));
    setPreguntas(preguntasIniciales);
  }, [world, difficulty, navigate]);

  // Maneja el avance al siguiente paso
  const handleAvanzar = (resultado) => {
    setProgresoColores((prev) => [...prev, resultado]);

    if (indiceActual + 1 >= MAX_PREGUNTAS) {
      setTimeout(() => {
        navigate('/home/aprender');
      }, 800);
    } else {
      setIndiceActual((prev) => prev + 1);
    }
  };

  // Salta a la siguiente pregunta, marca como incorrecto
  const handleSkip = () => {
    setResultadoCorrecto(false);
    setMostrarOverlay(true); // Muestra el overlay de incorrecto
    handleAvanzar('fallo');
  };

  // Marca siempre como correcto al presionar el botón "COMPROBAR"
  const handleCheck = () => {
    setResultadoCorrecto(true);
    setMostrarOverlay(true); // Muestra el overlay de correcto
    handleAvanzar('acierto');
  };

  return (
    <div className="actividad-wrapper">
      <div className="actividad-header">
        <button className="actividad-close-btn" onClick={() => navigate('/home/aprender')}>✕</button>

        <div className="actividad-progreso-barra">
          {Array.from({ length: MAX_PREGUNTAS }).map((_, i) => (
            <div
              key={i}
              className={`progreso-segmento ${
                progresoColores[i] === 'acierto' ? 'verde' : progresoColores[i] === 'fallo' ? 'rojo' : ''
              }`}
            />
          ))}
        </div>
      </div>

      <div className="actividad-contenido">
        {preguntas[indiceActual]} {/* Muestra la pregunta actual */}
      </div>

      <div className="actividad-footer">
        <button className="actividad-skip-btn" onClick={handleSkip}>SALTAR</button>
        <button className="actividad-btn" onClick={handleCheck}>COMPROBAR</button>
      </div>

      {/* Overlay de resultado */}
      {mostrarOverlay && (
        <div className={`resultado-popup ${resultadoCorrecto ? 'correcto' : 'incorrecto'}`}>
          <h3>{resultadoCorrecto ? '✅ ¡Correcto!' : '❌ Incorrecto'}</h3>
          <button className="continuar-btn" onClick={() => setMostrarOverlay(false)}>
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}

export default Actividad;
