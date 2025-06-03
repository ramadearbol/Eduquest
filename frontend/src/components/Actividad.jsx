import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Actividad.css';

import PreguntaDefinicion from '../pages/PreguntaDefinicion';
import PreguntaOpcionMultiple from '../pages/PreguntaOpcionMultiple';
import PreguntaVerdaderoFalso from '../pages/PreguntaVerdaderoFalso';
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
  const [mostrarOverlay, setMostrarOverlay] = useState(false);
  const [resultadoCorrecto, setResultadoCorrecto] = useState(false);
  const [mensajeError, setMensajeError] = useState(null);

  const preguntaRef = useRef();
  const [PreguntaActual, setPreguntaActual] = useState(null);

  useEffect(() => {
    if (!world || !difficulty) {
      navigate('/home/aprender');
      return;
    }
  }, [world, difficulty, navigate]);

  useEffect(() => {
    if (indiceActual < preguntasComponentes.length) {
      const Componente = preguntasComponentes[indiceActual];
      setPreguntaActual(() => Componente);
    }
  }, [indiceActual]);

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

  const handleSkip = () => {
    setResultadoCorrecto(false);
    setMostrarOverlay(true);
  };

  const handleCheck = () => {
    if (!preguntaRef.current) return;

    const esCorrecto = preguntaRef.current.validarRespuesta();
    if (esCorrecto === null) {
      setMensajeError('Por favor, selecciona una respuesta antes de comprobar.');
      return;
    }

    setResultadoCorrecto(esCorrecto);
    setMostrarOverlay(true);
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
        {PreguntaActual ? (
          <PreguntaActual
            key={indiceActual}
            world={world}
            difficulty={difficulty}
            ref={preguntaRef}
          />
        ) : (
          <p>Cargando pregunta...</p>
        )}
      </div>

      <div className="actividad-footer">
        <button className="actividad-skip-btn" onClick={handleSkip}>SALTAR</button>
        <button className="actividad-btn" onClick={handleCheck}>COMPROBAR</button>
      </div>

      {mostrarOverlay && (
        <div className={`resultado-popup ${resultadoCorrecto ? 'correcto' : 'incorrecto'}`}>
          <h3>{resultadoCorrecto ? '✅ ¡Correcto!' : '❌ Incorrecto'}</h3>
          <button
            className="continuar-btn"
            onClick={() => {
              setMostrarOverlay(false);
              handleAvanzar(resultadoCorrecto ? 'acierto' : 'fallo');
            }}
          >
            Continuar
          </button>
        </div>
      )}

      {mensajeError && (
        <div className="resultado-popup incorrecto">
          <h3>⚠️ {mensajeError}</h3>
          <button className="continuar-btn" onClick={() => setMensajeError(null)}>
            OK
          </button>
        </div>
      )}
    </div>
  );
}

export default Actividad;
