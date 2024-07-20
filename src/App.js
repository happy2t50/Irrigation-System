import React, { useEffect, useState } from 'react';
import socket, { sendMessage } from './websocket';

function App() {
  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    distance: 0,
    ldr: 0,
    soilHumidity: 0,
  });

  useEffect(() => {
    socket.onmessageParsed = (parsedData) => {
      setData(parsedData);
    };
  }, []);

  const handleIrrigation = (state) => {
    sendMessage({ irrigation: state });
  };

  return (
    <div className="App">
      <h1>Sistema de Riego Automatizado</h1>
      <div>
        <h2>Datos en tiempo real</h2>
        <p>Temperatura: {data.temperature} °C</p>
        <p>Humedad: {data.humidity} %</p>
        <p>Distancia: {data.distance} cm</p>
        <p>Luz: {data.ldr}</p>
        <p>Humedad del suelo: {data.soilHumidity}</p>
      </div>
      
    </div>
  );
}

export default App;
