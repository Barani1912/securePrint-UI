const express = require('express');
const { ExpressPeerServer } = require('peer');
const path = require('path');

const app = express();

// Serve built React client
app.use(express.static(path.join(__dirname, 'client', 'dist')));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('SecurePrint signalling server running on port', process.env.PORT || 3000);
});

const peerServer = ExpressPeerServer(server, {
  debug: false,
  path: '/',
  allow_discovery: false,   // peers cannot list each other
  cleanupOutOfDate: true,
  alive_timeout: 60000,     // auto-expire after 60 seconds idle
  expire_timeout: 60000,
});

app.use('/peerjs', peerServer);

// Health check — public endpoint for trust verification
app.get('/health', (req, res) => {
  res.json({ status: 'ok', stored: 'nothing' });
});

// SPA fallback — serve index.html for client-side routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
