const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let activeSocket = null;
const pendingRequests = new Map();

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Figma Plugin connected to WebSocket server');
  activeSocket = ws;

  ws.on('message', (messageStr) => {
    try {
      const message = JSON.parse(messageStr);
      console.log('Received response from plugin:', message.id);
      
      if (message.id && pendingRequests.has(message.id)) {
        const { resolve, timer } = pendingRequests.get(message.id);
        clearTimeout(timer);
        pendingRequests.delete(message.id);
        resolve(message);
      }
    } catch (err) {
      console.error('Error parsing plugin message:', err);
    }
  });

  ws.on('close', () => {
    console.log('Figma Plugin disconnected');
    if (activeSocket === ws) {
      activeSocket = null;
    }
  });
  
  ws.on('error', (err) => {
    console.error('WebSocket socket error:', err);
  });
});

// HTTP POST endpoint for AI commands
app.post('/command', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Missing code in request body' });
  }

  if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) {
    return res.status(503).json({ error: 'Figma Plugin is not connected to the local server' });
  }

  const requestId = Math.random().toString(36).substring(2, 15);
  console.log(`Sending command [${requestId}] to Figma`);

  const responsePromise = new Promise((resolve) => {
    const timer = setTimeout(() => {
      pendingRequests.delete(requestId);
      resolve({ id: requestId, success: false, error: 'Request timed out after 10 seconds' });
    }, 10000);

    pendingRequests.set(requestId, { resolve, timer });
  });

  try {
    activeSocket.send(JSON.stringify({
      id: requestId,
      action: 'eval',
      code: code
    }));
  } catch (err) {
    pendingRequests.delete(requestId);
    return res.status(500).json({ error: 'Failed to send command to plugin: ' + err.message });
  }

  const result = await responsePromise;
  if (result.success) {
    res.json({ success: true, result: result.result });
  } else {
    res.status(500).json({ success: false, error: result.error });
  }
});

// Simple health check endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'running',
    pluginConnected: !!activeSocket && activeSocket.readyState === WebSocket.OPEN
  });
});

const PORT = 8999;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Antigravity Figma Bridge Server listening on port ${PORT}`);
  console.log(`HTTP endpoint: http://localhost:${PORT}/command`);
  console.log(`WebSocket server running on the same port.`);
  console.log(`====================================================`);
});
