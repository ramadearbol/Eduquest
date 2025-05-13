import React, { useState } from 'react';
import '../styles/Pregunta.css'; // Asegúrate de importar los estilos comunes

function PreguntaCompletarCodigo({ world, difficulty, preguntaData }) {
  // preguntaData debe tener esta estructura:
  // {
  //   pregunta: "Completa el siguiente código para imprimir 'Hola Mundo':",
  //   codigo: `public class Main {\n  public static void main(String[] args) {\n    System.out._____("Hola Mundo");\n  }\n}`,
  //   respuestaCorrecta: "println"
  // }

  const [input, setInput] = useState('');

  return (
    <div className="pregunta-wrapper">
      <div className="pregunta-box">
        <h2 className="pregunta-titulo">Completar Código</h2>
        <p className="pregunta-contexto">
          Mundo: <strong>{world?.name}</strong> · Dificultad: <strong>{difficulty} ⭐</strong>
        </p>

        <p className="pregunta-texto">{preguntaData?.pregunta || 'Cargando pregunta...'}</p>

        <pre className="codigo-ejemplo">
          {preguntaData?.codigo || `public class Main {\n  public static void main(String[] args) {\n    System.out._____("Hola Mundo");\n  }\n}`}
        </pre>

        <input
          className="opcion-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe la parte que falta"
        />
      </div>
    </div>
  );
}

export default PreguntaCompletarCodigo;
