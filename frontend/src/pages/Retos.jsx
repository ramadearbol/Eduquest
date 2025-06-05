import React, { useEffect, useState } from "react";
import "../styles/Retos.css";
import { FaRegClock } from "react-icons/fa";
import iconoMan from "../assets/Man.png";
import gifMoneda from "../assets/Moneda.gif";

const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

function Retos() {
  const [desafiosDiarios, setDesafiosDiarios] = useState([]);
  const [desafiosSemanales, setDesafiosSemanales] = useState([]);
  const [timeRemainingDaily, setTimeRemainingDaily] = useState(0);
  const [timeRemainingWeekly, setTimeRemainingWeekly] = useState(0);
  const [retosReclamados, setRetosReclamados] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchRetos = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/retos/usuario`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar retos");
        const data = await res.json();
        setDesafiosDiarios(data.diarios);
        setDesafiosSemanales(data.semanales);
      } catch (e) {
        console.error(e);
      }
    };

    fetchRetos();

    const updateTime = () => {
      const now = new Date();
      const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      const nowCET = new Date(utcNow.getTime() + 3600000);

      const resetDaily = new Date(nowCET);
      resetDaily.setHours(24, 0, 0, 0);

      const dayOfWeek = nowCET.getDay();
      const daysUntilSunday = (7 - dayOfWeek) % 7;
      const resetWeekly = new Date(nowCET);
      resetWeekly.setDate(resetWeekly.getDate() + daysUntilSunday);
      resetWeekly.setHours(23, 59, 59, 999);

      setTimeRemainingDaily(resetDaily - nowCET);
      setTimeRemainingWeekly(resetWeekly - nowCET);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    const actualizarRetoHora = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${BACKEND_URL}/api/retos/hora`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Error al actualizar reto de 1 hora");
        } else {
          console.log("Reto de 1 hora actualizado automáticamente");
        }
      } catch (e) {
        console.error("Error al actualizar reto de 1 hora", e);
      }
    };

    const msHastaSiguienteHora = () => {
      const ahora = new Date();
      const siguienteHora = new Date();
      siguienteHora.setHours(ahora.getHours() + 1, 0, 0, 0);
      return siguienteHora - ahora;
    };

    const timeoutId = setTimeout(() => {
      actualizarRetoHora();

      const intervaloId = setInterval(actualizarRetoHora, 60 * 60 * 1000);
      cleanup.intervaloId = intervaloId;
    }, msHastaSiguienteHora());

    const cleanup = {
      intervaloId: null,
    };

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
      if (cleanup.intervaloId) clearInterval(cleanup.intervaloId);
    };
  }, []);

  const formatTime = (ms) => {
    if (ms <= 0) return "0 Horas";
    const totalHours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${totalHours}h ${minutes}m`;
  };

  const handleClaimReward = async (reto) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.alert("Usuario no autenticado");
      return;
    }

      console.log("👉 Clic en reclamar reto:", reto);
      console.log("📤 Enviando POST para reclamar recompensa...");

    try {
      const res = await fetch(`${BACKEND_URL}/api/retos/reclamar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idReto: reto.idReto,
          tipo: reto.tipo,
          xpRecompensa: reto.xpRecompensa,
        }),
      });

        console.log("📥 Respuesta recibida del backend...");

      if (!res.ok) {
        const errorText = await res.text();
        window.alert(`Error al reclamar recompensa: ${errorText}`);
        return;
      }

      const mensaje = await res.text();
      console.log("✅ Mensaje del backend:", mensaje);

      if (mensaje === "Ya has reclamado este reto recientemente.") {
        setRetosReclamados((prev) => ({ ...prev, [reto.idReto]: "YA_RECLAMADO" }));
      } else if (mensaje === "Recompensa reclamada correctamente.") {
        setRetosReclamados((prev) => ({ ...prev, [reto.idReto]: "RECLAMADO" }));
      } else {
        window.alert(mensaje);
      }
    } catch (e) {
      console.error(e);
      window.alert("Error al reclamar recompensa");
    }
  };

  const renderReto = (d, tipo) => {
    const porcentaje = Math.min(100, Math.round((d.progresoActual / d.total) * 100));
    const estadoReclamo = retosReclamados[d.idReto];

    return (
      <div className="daily-container" key={d.idReto}>
        <div className="reto-daily-box">
          <div className="reto-daily-video">
            <img src={gifMoneda} alt="Moneda" />
          </div>
          <div className="reto-daily-text">
            <p>
              <strong>{d.descripcion}</strong>
            </p>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-background">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${porcentaje}%` }}
                ></div>
                <span>
                  {d.progresoActual}/{d.total}
                </span>
              </div>
            </div>

            {d.completado && (
              estadoReclamo === "YA_RECLAMADO" ? (
                <div className="reto-completado">
                  <p>Ya reclamaste este reto recientemente.</p>
                </div>
              ) : estadoReclamo === "RECLAMADO" ? (
                <div className="reto-completado">
                  <p>¡Recompensa reclamada exitosamente!</p>
                </div>
              ) : (
                <button
                  className="reclamar-btn"                  
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("🟡 Click en reclamar reto:", d); // ⬅️ IMPORTANTE
                    handleClaimReward({ ...d, tipo });
                  }}
                >
                  Reclamar Recompensa
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

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

      {/* Desafíos Diarios */}
      <div className="contenido-retos">
        <div className="daily-header">
          <h2 className="daily-title">Desafíos Diarios</h2>
          <div className="time-remaining">
            <FaRegClock color="#FFAB33" size={24} />
            <span className="hora-texto">{formatTime(timeRemainingDaily)}</span>
          </div>
        </div>

        {desafiosDiarios.length === 0 && <p>No hay desafíos diarios asignados</p>}

        {desafiosDiarios.map((d) => renderReto(d, "diario"))}
      </div>

      {/* Desafíos Semanales */}
      <div className="contenido-retos">
        <div className="daily-header">
          <h2 className="daily-title">Desafíos Semanales</h2>
          <div className="time-remaining">
            <FaRegClock color="#FFAB33" size={24} />
            <span className="hora-texto">{formatTime(timeRemainingWeekly)}</span>
          </div>
        </div>

        {desafiosSemanales.length === 0 && <p>No hay desafíos semanales asignados</p>}

        {desafiosSemanales.map((d) => renderReto(d, "semanal"))}
      </div>
    </div>
  );
}

export default Retos;
