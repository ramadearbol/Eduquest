import React, { useEffect, useState } from "react";
import "../styles/Ranking.css";
import iconoLiga from '../assets/Liga.png';
import iconoPerfil from '../assets/Perfil.png';

const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

function Ranking() {
  const [jugadores, setJugadores] = useState([]);
  const [miRanking, setMiRanking] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchRanking = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/ranking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener el ranking");

        const data = await response.json();
        const ordenados = data.sort((a, b) => a.posicion - b.posicion);
        setJugadores(ordenados);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchMiRanking = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/ranking/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener mi ranking");

        const data = await response.json();
        setMiRanking(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRanking();
    fetchMiRanking();
  }, []);

  const calcularProgresoXP = () => {
    if (!miRanking) return 0;
    const progreso = (miRanking.xp_total / miRanking.xp_para_siguiente_nivel) * 100;
    return progreso > 100 ? 100 : progreso;
  };

  return (
    <div className="ranking-container">
      <div className="intro-box">
        <div className="intro-text">
          <h1>Ranking de Jugadores</h1>
          <p>¡Compite con los mejores y sube al top del ranking!</p>
        </div>
        <div className="intro-image">
          <img src={iconoLiga} alt="Liga" />
        </div>
      </div>

      <table className="ranking-table">
        <thead>
          <tr>
            <th>Posición</th>
            <th>Usuario</th>
            <th>Nivel</th>
            <th>Experiencia</th>
          </tr>
        </thead>
        <tbody>
          {jugadores.map((jugador) => (
            <tr key={jugador.id_usuario}>
              <td>{jugador.posicion}</td>
              <td>
                <div className="usuario-container">
                  <img src={iconoPerfil} alt="Perfil" className="perfil-icon" />
                  {jugador.username}
                </div>
              </td>
              <td>{jugador.nivel}</td>
              <td>{jugador.xp_total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {miRanking && (
        <div className="jugador-progreso">
          <img src={iconoPerfil} alt="Foto Jugador" className="jugador-foto" />
          <div className="jugador-info">
            <div className="jugador-detalles">
              <p><strong>Jugador:</strong> {miRanking.username}</p>
              <p><strong>Nivel:</strong> {miRanking.nivel}</p>
              <p>
                <strong>Experiencia:</strong> {miRanking.xp_total} / {miRanking.xp_para_siguiente_nivel} XP
              </p>
            </div>
            <div className="barra-progreso">
              <div className="barra-externa">
                <div
                  className="barra-interna"
                  style={{ width: `${calcularProgresoXP()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ranking;
