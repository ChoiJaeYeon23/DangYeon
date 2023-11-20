const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // CORS 라이브러리 임포트

const app = express();
app.use(cors()); // CORS를 전역 미들웨어로 추가

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // 모든 도메인에서의 WebSocket 요청을 허용
    methods: ["GET", "POST"], // 허용되는 HTTP 메소드
  },
});

// 클라이언트에게 index.html 파일 제공
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// WebSocket 연결 처리
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`); // 사용자 연결 로그에 socket.id 추가

  socket.on("chat message", (msg) => {
    console.log(`Message from ${socket.id}: ${msg}`); // 메시지 받을 때 로그 추가
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`); // 사용자 연결 해제 로그에 socket.id 추가
  });
});

server.listen(3000, () => {
  console.log("Listening on *:3000");
});
