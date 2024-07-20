const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, maxPayload: 104857600 }); // Máxima carga útil de 100MB

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Nuevo cliente conectado');
  clients.add(ws);
  ws.isAlive = true;

  ws.on('message', (message) => {
    console.log('Recibido:', message);
    // Reenviar el mensaje a todos los clientes conectados
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('Error de WebSocket:', error);
  });
});

const interval = setInterval(() => {
  wss.clients.forEach((client) => {
    if (!client.isAlive) return client.terminate();

    client.isAlive = false;
    client.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});

server.listen(8080, () => {
  console.log('El servidor está escuchando en el puerto 8080');
});
