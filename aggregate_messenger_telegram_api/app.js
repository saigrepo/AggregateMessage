const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const config = require('./config');
const telegramRoutes = require('./routes/telegramRoutes');
const errorHandler = require('./middleware/errorHandler');
const SocketHandler = require('./websocket/socketHandler');
const telegramService = require('./services/telegramService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: config.server.corsOrigin }
});

// Middleware
app.use(cors({
    origin: config.server.corsOrigin,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Routes
app.use(telegramRoutes);

// Error handling
app.use(errorHandler);

// Initialize socket handler
new SocketHandler(io, telegramService);

// Start server
server.listen(config.server.port, () => {
    console.log(`Server running on port ${config.server.port}`);
});