import React, { useEffect, useState } from "react";
import "../styles/Retos.css";
import { FaRegClock } from 'react-icons/fa'; // Usamos un ícono de reloj de react-icons

const desafiosDiarios = [
  { id: 1, descripcion: "Completar 5 partidas", exp: 100 },
];

const desafiosSemanales = [
  { id: 1, descripcion: "Ganar 10 partidas esta semana", exp: 500 },
  { id: 2, descripcion: "Jugar durante 5 horas esta semana", exp: 300 },
  { id: 3, descripcion: "Completar 3 misiones", exp: 200 },
];

function Retos() {
  const [timeRemainingDaily, setTimeRemainingDaily] = useState(0);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);  // Progreso del slider

  useEffect(() => {
    const intervalDaily = setInterval(() => {
      const now = new Date();
      const resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const diff = resetTime - now;
      setTimeRemainingDaily(diff);
    }, 1000);

    return () => {
      clearInterval(intervalDaily);
    };
  }, []);

  // Función para manejar el desafío diario
  const handleCompleteDaily = () => {
    setDailyCompleted(true);
    alert("¡Desafío Diario Completado! Ganaste EXP.");
  };

  return (
    <div className="retos-container">
      {/* Desafío Diario */}
      <div className="daily-header">
        <h2>Desafío Diario</h2>
        <div className="time-remaining">
          <FaRegClock color="yellow" size={24} />
          <span>{Math.floor(timeRemainingDaily / 1000 / 60 / 60)}h</span>
        </div>
      </div>

      <div className="daily-container">
        {dailyCompleted ? (
          <div className="reto-completado">
            <p>¡Has completado el desafío de hoy!</p>
            <button onClick={handleCompleteDaily}>Reclamar Recompensa</button>
          </div>
        ) : (
          <div className="reto">
            <p>{desafiosDiarios[0].descripcion}</p>
            <div className="progress-container">
              <label>Progreso:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(e.target.value)}
              />
              <span>{sliderValue}%</span>
            </div>
            <button onClick={handleCompleteDaily}>Completar Desafío</button>
          </div>
        )}
      </div>

      {/* Desafíos Semanales */}
      <div className="weekly-container">
        <h2>Desafíos Semanales</h2>
        {desafiosSemanales.map((desafio) => (
          <div className="reto" key={desafio.id}>
            <p>{desafio.descripcion}</p>
            <button>Completar Desafío</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Retos;
