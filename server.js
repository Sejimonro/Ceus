const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

const messageController = require('./controllers/messageController');
io.on('connection', (socket) => {
  console.log('New user connected');

  messageController.initMessages(socket);

  socket.on('message', (msg) => {
    messageController.saveMessage(io, msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
