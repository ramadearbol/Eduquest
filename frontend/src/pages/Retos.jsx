import React, { useEffect, useState } from "react";
import "../styles/Retos.css";
import { FaRegClock } from 'react-icons/fa';
import iconoMan from '../assets/Man.png';
import gifMoneda from '../assets/Moneda.gif'; // Asegúrate de tener este gif en tu proyecto

const desafiosDiarios = [
  { id: 1, descripcion: "Completar 5 partidas", exp: 100, progreso: 2, total: 5 },
];

function Retos() {
  const [timeRemainingDaily, setTimeRemainingDaily] = useState(0);
  const [dailyCompleted, setDailyCompleted] = useState(false);

  useEffect(() => {
    const intervalDaily = setInterval(() => {
      const now = new Date();
      const resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = resetTime - now;
      setTimeRemainingDaily(diff);
    }, 1000);

    return () => clearInterval(intervalDaily);
  }, []);

  const handleCompleteDaily = () => {
    setDailyCompleted(true);
    alert("¡Desafío Diario Completado! Ganaste EXP.");
  };

  const daily = desafiosDiarios[0];
  const progreso = daily.progreso;
  const total = daily.total;
  const porcentaje = Math.min(100, Math.round((progreso / total) * 100));
  const horasRestantes = Math.floor(timeRemainingDaily / (1000 * 60 * 60));

  return (
    <div className="retos-container">
      <div className="intro-box">
        <div className="intro-text">
          <h1>¡Tú Puedes!</h1>
          <p>Completa desafíos cada día y gana experiencia para avanzar.</p>
        </div>
        <div className="intro-image">
          <img src={iconoMan} alt="Motivación" />
        </div>
      </div>

      <div className="contenido-retos">
        <div className="daily-header">
          <h2>Desafío Diario</h2>
          <div className="time-remaining">
            <FaRegClock color="#FFAB33" size={24} />
            <span>{horasRestantes} Horas</span>
          </div>
        </div>

        <div className="daily-container">
          {!dailyCompleted ? (
            <div className="reto-daily-box">
              <div className="reto-daily-video">
                <img src={gifMoneda} alt="Moneda" style={{ width: '80px', height: 'auto' }} />
              </div>
              <div className="reto-daily-text">
                <p><strong>{daily.descripcion}</strong></p>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-background">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${porcentaje}%` }}
                    >
                      <span>{progreso}/{total}</span>
                    </div>
                  </div>
                </div>
                <button onClick={handleCompleteDaily}>Completar Desafío</button>
              </div>
            </div>
          ) : (
            <div className="reto-completado">
              <p>¡Has completado el desafío de hoy!</p>
              <button>Reclamar Recompensa</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Retos;
