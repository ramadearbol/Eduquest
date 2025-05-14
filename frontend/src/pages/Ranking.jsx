import React from "react";
import "../styles/Ranking.css";
import iconoLiga from '../assets/Liga.png';  // Asegúrate de tener esta imagen en la ruta indicada
import iconoPerfil from '../assets/Perfil.png';

const jugadores = [
  { nombre: "JugadorUno", nivel: 12, puntuacion: 2500 },
  { nombre: "JugadorDos", nivel: 10, puntuacion: 1600 },
  { nombre: "JugadorTres", nivel: 9, puntuacion: 1000 },
  { nombre: "JugadorCuatro", nivel: 8, puntuacion: 1800 },
  { nombre: "JugadorCinco", nivel: 7, puntuacion: 1500 },
];

function Ranking() {
  // Ordenar los jugadores por puntuación de mayor a menor
  const jugadoresOrdenados = jugadores.sort((a, b) => b.puntuacion - a.puntuacion);

  return (
    <div className="ranking-container">
      {/* Nueva intro box con ajustes */}
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
            <th>Puntuación</th>
          </tr>
        </thead>
        <tbody>
          {jugadoresOrdenados.map((jugador, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <div className="usuario-container">
                  <img src={iconoPerfil} alt="Perfil" className="perfil-icon" />
                  {jugador.nombre}
                </div>
              </td>
              <td>{jugador.nivel}</td>
              <td>{jugador.puntuacion}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cuadro de progreso de jugador */}
      <div className="jugador-progreso">
        <img src={iconoPerfil} alt="Foto Jugador" className="jugador-foto" />
        <div className="jugador-info">
          <div className="jugador-detalles">
            <p><strong>Jugador:</strong> JugadorUno</p>
            <p><strong>Nivel:</strong> 12</p>
            <p><strong>Experiencia:</strong> 4200 / 5000 XP</p>
          </div>
          <div className="barra-progreso">
            <div className="barra-externa">
              <div className="barra-interna" style={{ width: '84%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ranking;
