import React, { useEffect, useState } from "react";
import "../styles/Retos.css";
import { FaRegClock } from 'react-icons/fa';
import iconoMan from '../assets/Man.png';
import gifMoneda from '../assets/Moneda.gif';

const desafiosDiarios = [
  { id: 1, descripcion: "Completar 5 partidas", exp: 100, progreso: 5, total: 5 },
];

const desafiosSemanalesInicial = [
  { id: 1, descripcion: "Ganar 10 partidas", exp: 300, progreso: 10, total: 10 },
  { id: 2, descripcion: "Jugar durante 2 horas", exp: 200, progreso: 1, total: 2 },
  { id: 3, descripcion: "Invitar a 2 amigos", exp: 150, progreso: 0, total: 2 },
];

function Retos() {
  const [timeRemainingDaily, setTimeRemainingDaily] = useState(0);
  const [timeRemainingWeekly, setTimeRemainingWeekly] = useState(0);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [completedWeekly, setCompletedWeekly] = useState([]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const resetDaily = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const dayOfWeek = now.getDay();
      const daysUntilSunday = 7 - dayOfWeek;
      const resetWeekly = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday);
      resetWeekly.setHours(23, 59, 59, 999);

      setTimeRemainingDaily(resetDaily - now);
      setTimeRemainingWeekly(resetWeekly - now);
    };

    const interval = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(interval);
  }, []);

  const handleClaimDailyReward = () => {
    setDailyCompleted(true);
    alert("¡Desafío Diario Completado! Ganaste EXP.");
  };

  const handleClaimWeeklyReward = (id) => {
    setCompletedWeekly(prev => [...prev, id]);
    alert("¡Desafío Semanal Completado! Ganaste EXP.");
  };

  const formatTime = (ms) => {
    const totalHours = Math.floor(ms / (1000 * 60 * 60));
    return `${totalHours} Horas`;
  };

  const daily = desafiosDiarios[0];
  const porcentajeDiario = Math.min(100, Math.round((daily.progreso / daily.total) * 100));
  const progresoCompleto = daily.progreso >= daily.total;

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

      {/* DESAFÍO DIARIO */}
      <div className="contenido-retos">
        <div className="daily-header">
          <h2 className="daily-title">Desafío Diario</h2>
          <div className="time-remaining">
            <FaRegClock color="#FFAB33" size={24} />
            <span className="hora-texto">{formatTime(timeRemainingDaily)}</span>
          </div>
        </div>

        <div className="daily-container">
          {!dailyCompleted ? (
            <div className="reto-daily-box">
              <div className="reto-daily-video">
                <img src={gifMoneda} alt="Moneda" />
              </div>
              <div className="reto-daily-text">
                <p><strong>{daily.descripcion}</strong></p>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-background">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${porcentajeDiario}%` }}
                    ></div>
                    <span>{daily.progreso}/{daily.total}</span>
                  </div>
                </div>
                {progresoCompleto && (
                  <button onClick={handleClaimDailyReward}>Reclamar Recompensa</button>
                )}
              </div>
            </div>
          ) : (
            <div className="reto-completado">
              <p>¡Has completado el desafío de hoy!</p>
            </div>
          )}
        </div>

        {/* DESAFÍOS SEMANALES */}
        <div className="daily-header">
          <h2 className="daily-title">Desafíos Semanales</h2>
          <div className="time-remaining">
            <FaRegClock color="#FFAB33" size={24} />
            <span className="hora-texto">{formatTime(timeRemainingWeekly)}</span>
          </div>
        </div>

        {desafiosSemanalesInicial.map((desafio) => {
          const porcentaje = Math.min(100, Math.round((desafio.progreso / desafio.total) * 100));
          const completado = desafio.progreso >= desafio.total;
          const yaReclamado = completedWeekly.includes(desafio.id);

          return (
            <div className="daily-container" key={desafio.id}>
              {!yaReclamado ? (
                <div className="reto-daily-box">
                  <div className="reto-daily-video">
                    <img src={gifMoneda} alt="Moneda" />
                  </div>
                  <div className="reto-daily-text">
                    <p><strong>{desafio.descripcion}</strong></p>
                    <div className="progress-bar-wrapper">
                      <div className="progress-bar-background">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${porcentaje}%` }}
                        ></div>
                        <span>{desafio.progreso}/{desafio.total}</span>
                      </div>
                    </div>
                    {completado && (
                      <button onClick={() => handleClaimWeeklyReward(desafio.id)}>
                        Reclamar Recompensa
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="reto-completado">
                  <p>¡Has completado el desafío semanal!</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Retos;
