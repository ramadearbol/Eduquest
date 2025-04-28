import React from "react";
import "../styles/Ranking.css";
import iconoLiga from '../assets/Liga.png';  // Asegúrate de tener esta imagen en la ruta indicada

const jugadores = [
  { nombre: "JugadorUno", nivel: 12, puntuacion: 2500 },
  { nombre: "JugadorDos", nivel: 10, puntuacion: 2200 },
  { nombre: "JugadorTres", nivel: 9, puntuacion: 2000 },
  { nombre: "JugadorCuatro", nivel: 8, puntuacion: 1800 },
  { nombre: "JugadorCinco", nivel: 7, puntuacion: 1500 },
];

function Ranking() {
  // Ordenar los jugadores por puntuación de mayor a menor
  const jugadoresOrdenados = jugadores.sort((a, b) => b.puntuacion - a.puntuacion);

  return (
    <div className="ranking-container">
      {/* Imagen de la liga arriba */}
      <div className="liga-logo">
        <img src={iconoLiga} alt="Liga" />
      </div>

      <h1>Ranking de Jugadores</h1>
      
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
              <td>{jugador.nombre}</td>
              <td>{jugador.nivel}</td>
              <td>{jugador.puntuacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ranking;
