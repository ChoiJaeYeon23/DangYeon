const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // 모든 도메인에서의 WebSocket 요청을 허용
    methods: ['GET', 'POST'],
  },
});

// 네이버 로그인 API 관련 설정
const NAVER_CLIENT_ID =  "OqbYyPi3lOqgNJuqAvXL";
const NAVER_CLIENT_SECRET = "IKB4nzvJuE";
const NAVER_REDIRECT_URI = 'http://13.236.248.201:8080/auth/naver/callback';

// 네이버 로그인 URL로 리디렉션하는 엔드포인트
app.get('/auth/naver', (req, res) => {
  // ... 네이버 로그인 리디렉션 로직
});

// 네이버 로그인 콜백 처리 엔드포인트
app.get('/auth/naver/callback', async (req, res) => {
  // ... 네이버 로그인 콜백 처리 로직
});

// 클라이언트에게 index.html 파일 제공
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// WebSocket 연결 처리
io.on('connection', (socket) => {
  console.log('A user connected: ${socket.id}');

  socket.on('chat message', (msg) => {
    console.log('Message from ${socket.id}: ${msg}');
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ${socket.id}');
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log('Server is running on http://13.236.248.201:${PORT}');
});
