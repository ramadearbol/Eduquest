import React from "react";
import "../styles/Ranking.css";

const jugadores = [
  { nombre: "JugadorUno", nivel: 12, puntuacion: 2500 },
  { nombre: "JugadorDos", nivel: 10, puntuacion: 2200 },
  { nombre: "JugadorTres", nivel: 9, puntuacion: 2000 },
  { nombre: "JugadorCuatro", nivel: 8, puntuacion: 1800 },
  { nombre: "JugadorCinco", nivel: 7, puntuacion: 1500 },
];

function Ranking() {
  return (
    <div className="ranking-container">
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
          {jugadores.map((jugador, index) => (
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
