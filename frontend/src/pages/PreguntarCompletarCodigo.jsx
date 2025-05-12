import React, { useState } from 'react';

function PreguntaCompletarCodigo({ world, difficulty }) {
  const [input, setInput] = useState('');

  return (
    <div>
      <h3>Completa el siguiente código para imprimir “Hola Mundo”:</h3>
      <pre>
        public class Main {'{\n'}
        {'  '}public static void main(String[] args) {'{\n'}
        {'    '}System.out._____("Hola Mundo");
        {'  }\n'}
        {'}'}
      </pre>
      <input
        className="opcion-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe la parte que falta"
      />
    </div>
  );
}

export default PreguntaCompletarCodigo;
