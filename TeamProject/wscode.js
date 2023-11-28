const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const axios = require("axios");
const mysql = require("mysql"); // mysql 모듈 로드

const request = require("request");

var express = require('express');
var app = express();
var client_id = 'OqbYyPi3lOqgNJuqAvXL';
var client_secret = 'IKB4nzvJuE';
var state = "963zgWM3yy-ZNG_mqDV70g";
var redirectURI = "http://3.34.6.50:8080/auth/naver/callback";
var api_url = "";

// //DB연동
// var db = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "dlavnf1290@!",
//   database: "dang",
//   timezone: "Asia/Seoul",
//   dateStrings: "date",
//   multipleStatements: true,
// });

// db.connect();

// //쿼리문
// const queryDatabase = (sql) => {
//   return new Promise((resolve, reject) => {
//     db.query(sql, (error, data, fields) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(data);
//       }
//     });
//   });
// };

app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // 모든 도메인에서의 WebSocket 요청을 허용
    methods: ["GET", "POST"],
  },
});
console.log("서버 및 소켓 IO 초기화 완료");


// //아래까지 db로 로그인
// //아래까지 db로 로그인
// //아래까지 db로 로그인
// //아래까지 db로 로그인

// io.on("login", (socket) => {
//   console.log(`A user connected2: ${socket.id}`);
//   socket.on("login check", (data2) => {
//     const { id, pw } = data2;
//     console.log(`Message from ${socket.id}: ${id}아이디 맞냐?위`);
//     console.log(`Message from ${socket.id}: ${pw}비번 맞냐?위`);
//     var sql6 = "SELECT * FROM userInfo WHERE id = ? AND pw = ?";
//     var sql6params = [id, pw];
//     db.query(sql6, sql6params, (err, results) => {
//       if (err) throw err;
//       console.log(`Message from ${socket.id}: ${id}아이디 맞냐?아래`);
//       console.log(`Message from ${socket.id}: ${pw}비번 맞냐?아래`);
//     });
//   });

//   // 연결 해제
//   socket.on("disconnect2", () => {
//     console.log(`User disconnected2: ${socket.id}`);
//   });
// });

// //위에까지 db로 로그인
// //위에까지 db로 로그인
// //위에까지 db로 로그인
// //위에까지 db로 로그인

// //네이버 로그인
// //네이버 로그인
// //네이버 로그인
// //네이버 로그인
// //네이버 로그인(아래)





// 네이버 로그인 라우트
app.get('/naverlogin', function (req, res) {
  console.log("/naverlogin 경로 접근");
  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
  res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
  res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
});

// 네이버 로그인 콜백 라우트
app.get('/auth/naver/callback', function (req, res) {
  console.log("/callback 경로 접근");
  var code = req.query.code;
  var receivedState = req.query.state;
  console.log(`받은 code: ${code}, state: ${receivedState}`);
  api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
  var request = require('request');
  var options = {
    url: api_url,
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("네이버에서 액세스 토큰 받음");
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
    } else {
      console.error("네이버 토큰 요청 실패:", error);
      res.status(response.statusCode).end();
    }
  });
});



// 네이버로그인(위)
// 네이버로그인(위)
// 네이버로그인(위)
// 네이버로그인(위)
// 네이버로그인(위)
// 네이버로그인(위)

    // // 사용자 정보 처리
    // const userInfo = userInfoResponse.data;

    // // 네이버 API로부터 받은 userInfo 객체에서 birthyear와 birthday를 추출하고 합치는 함수
    // const formatNaverBirthday = (birthyear, birthday) => {
    //   return `${birthyear}-${birthday}`;
    // };

    // // 사용자 정보 처리 부분에서
    // const formattedBirthday = formatNaverBirthday(
    //   userInfo.response.birthyear,
    //   userInfo.response.birthday
    // );
    // userInfo.response.birthday = formattedBirthday; // 합쳐진 날짜로 업데이트

    // // 처리 결과 응답 (예시)
    // res.json(userInfo);
    // console.log(userInfo);

    // // db있는값 가져오기
    // const checkAndInsertUser = async (userInfo) => {
    //   try {
    //     // 첫 번째 쿼리 실행
    //     let sql = `SELECT * FROM userInfo WHERE id = '${userInfo.response.id}';`;
    //     let data1 = await queryDatabase(sql);

    //     if (data1[0] == undefined) {
    //       console.log("신규 가입자");

    //       // 신규 사용자 등록
    //       let sql2 = `INSERT INTO userInfo (id, username,  birthday) VALUES (
    //         '${userInfo.response.id}', 
    //         '${userInfo.response.name}', 
    //         '${userInfo.response.birthday}'
    //         );`;
    //       queryDatabase(sql2);
    //     }

        /* 사용자가 입력하는 추가 정보들을 받아와서 DB에 저장하기 
        else {
      // 기존 사용자 정보 업데이트
      let bloodType = userInfo.response.bloodType; // 혈액형
      let profilePicture = userInfo.response.profilePicture; // 프로필 사진
      let coupleId = userInfo.response.coupleId; // 커플 ID

      let updateSql = `UPDATE userInfo SET blood_type ='${userInfo.response.blood_type}',
      user_image = '${userInfo.response.user_image}',
      couple_id = '${userInfo.response.couple_id}' WHERE id = '${userInfo.response.id}';`;
      await queryDatabase(updateSql, [bloodType, user_image couple_id, userInfo.response.id]);
    }
  } catch (error) {
    throw error;
  }
};
*/
//         // 결과 확인을 위한 추가 쿼리
//         let sql3 = "SELECT * FROM userInfo;";
//         db.query(sql3, (error, data, fields) => {
//           if (error) throw error;
//           console.log(data);
//         });
//       } catch (error) {
//         throw error;
//       }
//     };
//     checkAndInsertUser(userInfo);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("오류 발생");
//   }
// });

// //(서버에 정상적으로 연결되는지 확인하는 용도의 코드)
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

// WebSocket 연결 처리
// WebSocket 연결 처리
// WebSocket 연결 처리
// WebSocket 연결 처리

// // 소켓 연결 및 이벤트 처리
// io.on("connection", (socket) => {
//   console.log(`A user connected: ${socket.id}`);

//   // 커플 매칭 확인 및 룸 입장
//   socket.on("join room", (connectId) => {
//     var sql5 = "SELECT * FROM userInfo WHERE connect_id = ?";
//     var sql5params = [connectId];
//     // 데이터베이스에서 커플 매칭 확인
//     db.query(sql5, sql5params, (err, results) => {
//       if (err) throw err;
//       if (results.length > 0) {
//         // 매칭된 커플이면 룸에 입장
//         socket.join(connectId);
//         console.log(`User ${socket.id} joined room ${connectId}`);
//       }
//     });
//   });

//   // 커플 룸 내에서 메시지 교환
//   socket.on("chat message", (data) => {
//     const { msg } = data;

//     // 메시지 받을 때 로그 추가
//     console.log(`Message from ${socket.id}: ${msg}`);

//     // 데이터베이스에 메시지 저장
//     var sql4 = "INSERT INTO chat(Message_text,MessageTime) VALUES(?,?,?)";
//     let now = new Date();
//     now.setHours(now.getHours() + 9); // UTC+9(대한민국,서울)로 시간 조정
//     let message_time = now.toISOString().slice(0, 19).replace("T", " ");

//     var sql4params = [msg, message_time];

//     db.query(sql4, sql4params, (err, result) => {
//       if (err) throw err;
//       console.log("Message recorded in database");
//     });

//     // 룸에 메시지 브로드캐스트
//     io.emit("chat message", msg, message_time);
//   });

//   // 연결 해제
//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });

// 서버 시작
const PORT = 8080; // 포트 설정
server.listen(PORT, () => {
  console.log(`Server is running on http://3.34.6.50:${PORT}`);
});