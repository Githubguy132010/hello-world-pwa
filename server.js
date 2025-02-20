// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

// Serve static files from the public folder
app.use(express.static('public'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  // send a welcome message on connection
  ws.send(JSON.stringify({ message: 'Hello from server' }));

  // periodically send notifications
  const interval = setInterval(() => {
    if(ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message: 'Push: Hello world!' }));
    }
  }, 5000);

  ws.on('close', () => {
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
