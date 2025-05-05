import React, { useEffect, useRef, useState } from 'react';
import "../styles/Aprender.css";

function Aprender() {
  const [activeWorld, setActiveWorld] = useState('Mundo 1');
  const [activeTitle, setActiveTitle] = useState('Programación Básica (Java)');
  const [showPopup, setShowPopup] = useState(false);
  const [popupWorld, setPopupWorld] = useState(null);
  const worldRefs = useRef([]);

  const worlds = [
    { id: 1, name: 'Programación Básica (Java)', image: '💻' },
    { id: 2, name: 'Bases de Datos (SQL)', image: '🗄️' },
    { id: 3, name: 'Interfaces Gráficas (JavaFX)', image: '🖥️' },
    { id: 4, name: 'Algoritmos y Estructuras de Datos', image: '📊' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find(entry => entry.isIntersecting);
        if (visible) {
          const id = visible.target.getAttribute('data-id');
          const title = worlds.find(world => world.id.toString() === id)?.name;
          setActiveWorld(`Mundo ${id}`);
          setActiveTitle(title);
        }
      },
      { threshold: 0.5 }
    );

    worldRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => {
      worldRefs.current.forEach((ref) => ref && observer.unobserve(ref));
    };
  }, []);

  const handleMouseEnter = (id) => {
    const title = worlds.find(world => world.id === id)?.name;
    setActiveWorld(`Mundo ${id}`);
    setActiveTitle(title);
  };

  const handleStartClick = (world) => {
    setPopupWorld(world);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupWorld(null);
  };

  return (
    <div className={`aprende-container ${showPopup ? 'blurred' : ''}`}>
      <div className="intro-box fixed-top">
        <div className="intro-text centered">
          <h1>{activeWorld}</h1>
          <h2>{activeTitle}</h2>
        </div>
      </div>

      <div className="worlds-list">
        {worlds.map((world, index) => (
          <div
            key={world.id}
            data-id={world.id}
            ref={(el) => (worldRefs.current[index] = el)}
            className="mundo-section"
            onMouseEnter={() => handleMouseEnter(world.id)}
          >
            <h2>{world.name}</h2>
            <div className="mundo-image">{world.image}</div>
            <button className="start-btn" onClick={() => handleStartClick(world)}>
              Empezar
            </button>
            <hr className="divider" />
            {world.id === 4 && (
              <p className="coming-soon">Próximamente</p>
            )}
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <h3>Selecciona la dificultad</h3>
            <div className="stars">
              <button className="star-btn">⭐</button>
              <button className="star-btn">⭐⭐</button>
              <button className="star-btn">⭐⭐⭐</button>
            </div>
            <button className="close-btn" onClick={closePopup}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Aprender;
