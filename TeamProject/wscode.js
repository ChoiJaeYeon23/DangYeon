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
const NAVER_REDIRECT_URI = 'http://3.34.6.50:8080/auth/naver/callback';

// 네이버 로그인 URL로 리디렉션하는 엔드포인트
app.get('/auth/naver', (req, res) => {
  res.send('로그인 시도')
});

// 네이버 로그인 콜백 처리 엔드포인트
app.get('/auth/naver/callback', async (req, res) => {
  try {
      const code = req.query.code;

      // 토큰 요청
      const tokenResponse = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
          params: {
              grant_type: 'authorization_code',
              client_id: NAVER_CLIENT_ID,
              client_secret: NAVER_CLIENT_SECRET,
              redirect_uri: NAVER_REDIRECT_URI,
              code: code
          }
      });

      const { access_token } = tokenResponse.data;

      // 사용자 정보 요청
      const userInfoResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
          headers: {
              'Authorization': `Bearer ${access_token}`
          }
      });

      // 사용자 정보 처리
      const userInfo = userInfoResponse.data;

      // 처리 결과 응답 (예시)
      res.json(userInfo);
      console.log(userInfo);
  } catch (error) {
      console.error(error);
      res.status(500).send('오류 발생');
  }
});

//(서버에 정상적으로 연결되는지 확인하는 용도의 코드)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// WebSocket 연결 처리
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // 메세지 받을 때 로그 추가
  socket.on(`chat message`, (msg) => {
    console.log(`Message from ${socket.id}: ${msg}`);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`); // 사용자가 연결을 해제 했을때의 로그 추가
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://3.34.6.50:${PORT}`);
});
