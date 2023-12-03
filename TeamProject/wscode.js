const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const axios = require("axios");
const mysql = require("mysql");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

// Express 앱 초기화
const app = express();

// bodyParser 미들웨어 적용
// 제한 값을 더 큰 값으로 설정, 예를 들어 '50mb'
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// DB 연동 설정
var db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "dlavnf1290@!",
  database: "dang",
  timezone: "Asia/Seoul",
  dateStrings: "date",
  multipleStatements: true,
});
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

// 세션 저장소 설정
const sessionStore = new MySQLStore({}, db);

// 세션 미들웨어 설정 및 적용
const Session = session({
  secret: "qwerasdfzx",
  resave: false, // 변경되지 않은 세션을 저장소에 다시 저장하지 않음
  saveUninitialized: true, // 초기화되지 않은 세션을 저장소에 저장
  store: sessionStore,
});

app.use(Session);

const corsOptions = {
  origin: "http://3.34.6.50:8080",
  credentials: true, // 쿠키를 전달 받기 위함
};
// CORS 미들웨어 적용
app.use(cors(corsOptions));

// 서버 및 Socket.IO 구성
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 로그인 처리
// 로그인 처리
// 로그인 처리

app.post("/api/login", (req, res) => {
  console.log(req.body);
  const { id, pw } = req.body;

  const userInfoQuery = "SELECT * FROM userInfo WHERE id = ? AND pw = ?";
  db.query(userInfoQuery, [id, pw], (err, userInfoResult) => {
    if (err) {
      console.error("Query error: ", err);
      res.status(500).send({ message: "Database error", error: err });
      return;
    }
    if (userInfoResult.length > 0) {
      req.session.userId = userInfoResult[0].id;
      req.session.loggedIn = true;
      console.log(req.session);
      // 로그인을 성공한후 couple_connection_check 테이블에서 user_id를 조회한 후 connect_id_me가 존재하거나 없으면 그에 따른 다른 응답을 클라이언트쪽으로 보냄
      const connectCheckQuery =
        "SELECT * FROM couple_connection_check WHERE user_id = ?";
      db.query(
        connectCheckQuery,
        [userInfoResult[0].id],
        (err, connectCheckResult) => {
          if (err) {
            console.error("Query error: ", err);
            res.status(500).send({ message: "Database error", error: err });
            return;
          }

          if (
            connectCheckResult.length > 0 &&
            connectCheckResult[0].connect_id_me
          ) {
            // connect_id_me 컬럼에 값이 존재하는 경우
            res.json({ status: "redirect", message: "Connect_id가 있습니다." });
          } else {
            // connect_id_me 컬럼이 비어 있는 경우
            res.json({ status: "stay", message: "connect_id가 없습니다." });
          }
        }
      );
    } else {
      res.status(401).send({ message: "Invalid ID or password" });
    }
  });
});

// 로그아웃 함수
// 로그아웃 함수
// 로그아웃 함수

app.post("/api/logout", (req, res) => {
  console.log(session);
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send("로그아웃 실패");
      } else {
        res.send("로그아웃 성공");
      }
    });
  } else {
    // 세션이 존재하지 않는 경우
    res.status(400).send("세션이 존재하지 않습니다.");
  }
});

/// 회원가입 처리
/// 회원가입 처리
/// 회원가입 처리

app.post("/api/signup", (req, res) => {
  console.log(req.body);
  const { username, id, pw, birthday, meetingDay, bloodType } = req.body;

  const query =
    "INSERT INTO userInfo (username, id, pw, birthday, meetingDay, blood_Type) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [username, id, pw, birthday, meetingDay, bloodType],
    (err, result) => {
      if (err) {
        console.error("Query error: ", err); // 오류 상세 출력
        res.status(500).send({ message: "Database error", error: err });
      } else {
        res.status(200).send({ message: "User registered successfully" });
      }
    }
  );
});

//ID 중복체크 함수
//ID 중복체크 함수
//ID 중복체크 함수
//ID 중복체크 함수

app.post("/api/check-id", (req, res) => {
  const { id } = req.body;
  const query = "SELECT COUNT(*) AS count FROM userInfo WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send({ message: "Database error", error: err });
    } else {
      if (results[0].count > 0) {
        // ID가 중복됨
        res.send({ isDuplicate: true });
      } else {
        // 사용 가능한 ID
        res.send({ isDuplicate: false });
      }
    }
  });
});

//커플 초대코드 저장하기
//커플 초대코드 저장하기
//커플 초대코드 저장하기

app.post("/api/save-code", (req, res) => {
  const userId = req.session.userId; // 세션에서 사용자 ID를 가져온다.
  console.log(req.session);
  console.log(req.body);
  const { connect_id_me, connect_id_lover } = req.body;
  //로그인 상태 확인
  if (!userId) {
    return res.status(401).send({ message: "Unauthorized: No session found" });
  }

  const query =
    "INSERT INTO couple_connection_check (user_id, connect_id_me, connect_id_lover) VALUES (?, ?, ?)";

  console.log(connect_id_me);
  db.query(query, [userId, connect_id_me, connect_id_lover], (err, results) => {
    if (err) {
      res.status(500).send({ message: "Database error", error: err.message });
    } else {
      res.status(200).send({ message: "Failed to save the code" });
    }
  });
});

// 내정보 업데이트
// 내정보 업데이트
// 내정보 업데이트
app.post("/api/my_dataUpdate", (req, res) => {
  const userId = req.session.userId; // 세션에서 사용저 id 가져오기
  const { username, birthday, meetingDay, user_image } = req.body;

  if (!userId) {
    return res.status(401).send({ message: "Unauthorized: No session found" });
  }

  const query =
    "UPDATE userInfo SET username = ? ,birthday = ?, meetingDay =?, user_image=? ";
  db.query(
    query,
    [name, birthday, bloodType, meetingDay, userId],
    (err, result) => {
      if (err) {
        console.err("Query error:", err);
        res.status(500).send({ message: "Database error", error: err });
      } else {
        res.send({ message: "사용자 정보를 수정하는데 성공하였습니다!" });
      }
    }
  );
});

// 연인 커플코드 추가하기
// 연인 커플코드 추가하기
// 연인 커플코드 추가하기
app.post("/api/add_lover_code", (req, res) => {
  const userId = req.session.userId; // 세션에서 사용자 ID 가져오기
  const { connect_id } = req.body;

  console.log(req.session, connect_id); // 세션과 connect_id 로깅

  if (!userId) {
    return res.status(401).send({ message: "Unauthorized: No session found" });
  }

  // connect_id_lover 값을 현재 세션의 사용자 ID에 해당하는 행에만 업데이트
  const query =
    "UPDATE couple_connection_check SET connect_id_lover = ? WHERE user_id = ?";

  db.query(query, [connect_id, userId], (err, result) => {
    if (err) {
      console.error("Query error", err);
      res.status(500).send({ message: "Database error", error: err });
    } else {
      res.send({ message: "Couple connection saved successfully" });
    }
  });
});

//커플 연결 끊기
//커플 연결 끊기
//커플 연결 끊기

app.post("/api/couple_break", (req, res) => {
  const userId = req.session.userId; // 세션에서 사용자 ID 가져오기

  // 로그인 상태 확인
  if (!userId) {
    return res.status(401).send({ message: "Unauthorized: No session found" });
  }

  // DB에서 해당 사용자의 connect_id_me를 NULL로 변경
  const query =
    "UPDATE couple_connection_check SET connect_id_lover = NULL WHERE user_id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      // DB 오류 처리
      console.error("Query error:", err);
      res.status(500).send({ message: "Database error", error: err });
    } else {
      // connect_id를 제거했음을 알림
      res.send({ message: "connect_id 제거에 성공하였습니다." });
    }
  });
});

// 회원 탈퇴 기능
// 회원 탈퇴 기능
// 회원 탈퇴 기능

app.post("/api/member_withdrawal", (req, res) => {
  const userId = req.session.userId; // 세션에서 사용자 id가져오기

  if (!userId) {
    return res.status(401).send({ message: "Unauthorized: No session found" });
  }

  // couple_connection_check 테이블에서 해당 사용자의 참조를 먼저 삭제
  const deleteReferencesQuery =
    "DELETE FROM couple_connection_check WHERE user_id = ? OR connect_id_lover = ?";
  db.query(deleteReferencesQuery, [userId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting user references:", err);
      return res.status(500).send({ message: "Database error", error: err });
    }

    // 이제 userInfo 테이블에서 사용자 정보를 안전하게 삭제
    const deleteUserQuery = "DELETE FROM userInfo WHERE id = ?";
    db.query(deleteUserQuery, [userId], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        res.status(500).send({ message: "Database error", error: err });
      } else {
        req.session.destroy((error) => {
          if (error) {
            console.error("Session destruction error:", error);
            return res
              .status(500)
              .send({ message: "Error destroying session", error: error });
          }
          res.send({ message: "사용자의 데이터가 모두 제거 되었습니다." });
        });
      }
    });
  });
});

// Picutre map부분
// Picutre map부분

const util = require("util");
const { connect } = require("http2");
const dbQuery = util.promisify(db.query).bind(db); // db.query를 프로미스로 변환

app.post("/api/upload-image", async (req, res) => {
  try {
    const { uri, region } = req.body;
    console.log(uri);
    console.log(region);

    // 데이터베이스에 저장하기 위한 쿼리
    const query = "INSERT INTO picture (image_uri, image_region) VALUES (?, ?)";

    // 비동기 쿼리 실행
    await dbQuery(query, [uri, region]);
    console.log("DB업로드 완료");
  } catch (err) {
    console.log("DB업로드 실패");
    console.error(err);
  }
});

// WebSocket 연결 처리
// WebSocket 연결 처리
// WebSocket 연결 처리

io.on("connection", (socket) => {
  console.log(`사용자가 Socket에 연결되었습니다. : ${socket.id}`);

  socket.on("identify user", (userId) => {
    console.log(`사용자 ID: ${userId}`);

    // 사용자 ID를 바탕으로 방 할당 로직 수행
    var sql5 = "SELECT * FROM couple_connection_check WHERE user_id = ?";
    var sql5params = [userId];
    db.query(sql5, sql5params, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return;
      }

      if (result.length > 0) {
        let userConnectId = result[0].connect_id_me;
        let partnerConnectId = result[0].connect_id_lover;

        // 사용자 ID를 정렬하여 room_id 생성
        const sortedUserIds = [userConnectId, partnerConnectId].sort();
        const roomId = sortedUserIds.join("-");

        var sql6 =
          "SELECT * FROM couple_connection_check WHERE connect_id_me = ? AND connect_id_lover = ?";
        var sql6params = [partnerConnectId, userConnectId];

        db.query(sql6, sql6params, (err, matchResult) => {
          if (err) {
            console.error("Database error:", err);
            return;
          }

          if (matchResult.length > 0) {
            socket.join(roomId);
            console.log(`사용자 ${socket.id} joined room ${roomId}`);
            socket.emit("room assigned", roomId); // 클라이언트에 방 할당 정보 전송
          }
        });
      }
    });
  });

  // 채팅 메시지 이벤트 핸들러
  socket.on("chat message", (data) => {
    const { msg, room_id } = data;
    console.log(`Received message: ${msg}, Room ID: ${room_id}`);

    var sql4 =
      "INSERT INTO chat(Message_text, MessageTime, room_id) VALUES(?, ?, ?)";
    let now = new Date();
    now.setHours(now.getHours() + 9);
    let Message_time = now.toISOString().slice(0, 19).replace("T", " ");
    var sql4params = [msg, Message_time, room_id];

    db.query(sql4, sql4params, (err, result) => {
      if (err) {
        console.error("Error recording message:", err);
        return;
      }
      console.log("Message recorded in databases");
    });

    socket.to(room_id).emit("chat message", { msg, Message_time });
  });

  // 연결 해제
  socket.on("disconnect", () => {
    console.log(`사용자가 연결을 끊었습니다: ${socket.id}`);
  });
});

// 서버 시작
const PORT = 8080; // 포트 설정
server.listen(PORT, () => {
  console.log(`Server is running on http://3.34.6.50:${PORT}`);
});

// (서버에 정상적으로 연결되는지 확인하는 용도의 코드)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
