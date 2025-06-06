import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Aprender.css";

function Aprender() {
  // Estado para la sección activa (ej. "Sección 1")
  const [activeWorld, setActiveWorld] = useState('Sección 1');
  // Estado para el título activo (nombre del mundo)
  const [activeTitle, setActiveTitle] = useState('Programación Básica (Java)');
  // Estado para controlar la visibilidad del popup de selección de dificultad
  const [showPopup, setShowPopup] = useState(false);
  // Estado para guardar qué mundo fue seleccionado para el popup
  const [popupWorld, setPopupWorld] = useState(null);
  // Referencias a los elementos DOM de cada "mundo" para observar su visibilidad
  const worldRefs = useRef([]);

  // Datos de los mundos con id, nombre y emoji que representa la sección
  const worlds = [
    { id: 1, name: 'Programación Básica (Java)', image: '💻' },
    { id: 2, name: 'Bases de Datos (SQL)', image: '🗄️' },
    { id: 3, name: 'Interfaces Gráficas (JavaFX)', image: '🖥️' },
    { id: 4, name: 'Algoritmos y Estructuras de Datos', image: '📊' },
  ];

  const navigate = useNavigate();

  /**
   * Maneja el clic en una dificultad (1, 2 o 3 estrellas)
   * Navega a la ruta de la actividad pasando el mundo y la dificultad por estado
   */
  const handleStarClick = (difficulty) => {
    navigate('/home/actividad', {
      state: {
        world: popupWorld,
        difficulty: difficulty
      }
    });
  };

  useEffect(() => {
    // Timeout para "debounce" que evita que el estado cambie demasiado rápido al hacer scroll
    const debounceTimeout = 300; 
    let timeoutId;

    // Intersection Observer para detectar qué sección está visible en pantalla
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            const title = worlds.find(world => world.id.toString() === id)?.name;

            // Actualizar estado con "debounce" para evitar cambios rápidos
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              setActiveWorld(`Sección ${id}`);
              setActiveTitle(title);
            }, debounceTimeout);
          }
        });
      },
      { threshold: 0.5 } // Se activa cuando el 50% del elemento es visible
    );

    // Observar cada elemento de mundo para detectar visibilidad
    worldRefs.current.forEach((ref) => ref && observer.observe(ref));

    // Cleanup: desactivar observador y limpiar timeout al desmontar componente
    return () => {
      worldRefs.current.forEach((ref) => ref && observer.unobserve(ref));
      clearTimeout(timeoutId);
    };
  }, []);

  /**
   * Cuando se pasa el mouse sobre una sección,
   * actualiza el estado para reflejar la sección y título activos
   */
  const handleMouseEnter = (id) => {
    const title = worlds.find(world => world.id === id)?.name;
    setActiveWorld(`Sección ${id}`);
    setActiveTitle(title);
  };

  /**
   * Al hacer clic en "Empezar" abre el popup de selección de dificultad
   * y guarda qué mundo se seleccionó
   */
  const handleStartClick = (world) => {
    setPopupWorld(world);
    setShowPopup(true);
  };

  /**
   * Cierra el popup y limpia el estado relacionado
   */
  const closePopup = () => {
    setShowPopup(false);
    setPopupWorld(null);
  };

  return (
    // Contenedor principal con clase 'blurred' si el popup está abierto para efecto visual
    <div className={`aprende-container ${showPopup ? 'blurred' : ''}`}>
      {/* Caja fija superior que muestra la sección y título activos */}
      <div className="intro-box fixed-top">
        <div className="intro-text centered">
          <h1>{activeWorld}</h1>
          <h2>{activeTitle}</h2>
        </div>
      </div>

      {/* Lista de mundos/secciones disponibles */}
      <div className="worlds-list">
        {worlds.map((world, index) => (
          <div
            key={world.id}
            data-id={world.id}
            ref={(el) => (worldRefs.current[index] = el)} // Asigna la referencia para IntersectionObserver
            className="mundo-section"
            onMouseEnter={() => handleMouseEnter(world.id)} // Actualiza título y sección al pasar mouse
          >
            <h2>{world.name}</h2>
            <div className="mundo-image">{world.image}</div>
            <button className="start-btn" onClick={() => handleStartClick(world)}>
              Empezar
            </button>
            <hr className="divider" />
            {/* Si es la última sección, mostrar "Próximamente" */}
            {world.id === 4 && (
              <p className="coming-soon">Próximamente</p>
            )}
          </div>
        ))}
      </div>

      {/* Popup para selección de dificultad */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          {/* Evitar que el clic dentro del popup cierre el popup */}
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h3>Selecciona La Dificultad</h3>
            <div className="stars">
              {/* Botones con estrellas para seleccionar dificultad */}
              <button className="star-btn" onClick={() => handleStarClick(1)}>⭐</button>
              <button className="star-btn" onClick={() => handleStarClick(2)}>⭐⭐</button>
              <button className="star-btn" onClick={() => handleStarClick(3)}>⭐⭐⭐</button>
            </div>
            <button className="close-btn" onClick={closePopup}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Aprender;
