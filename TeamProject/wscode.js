const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const axios = require("axios");
const app = express();
const mysql = require("mysql"); // mysql 모듈 로드
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session); // express-mysql-session 모듈을 로드하되, 인자로 session을 넘겨주기

app.use(bodyParser.json()); // json 데이터 처리를 위한 설정

//DB연동
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

const sessionStore = new MySQLStore({}, db);

app.use(
  session({
    secret: "qwerasdfzx", //세션을 암호화하기위한 비밀키 키보드에서 랜덤으로 10자 타이핑함 글자수는 정해져있지는 않음
    resave: false, // 세션 데이터가 변경되지 않았을 때 세션을 저장소에 다시 저장하지 않는다.
    saveUninitialized: true, // 'true'로 설정하면 초기화되지 않은 세션(새로운 세션)도 저장소에 저장된다. 새로운 세션이란 아직 아무런 데이터가 설정되지 않았을 때를 의미
    store: sessionStore, // 세션 데이터를 저장할 저장소를 정의
  })
);

// 기존에 선언된 MySQL 데이터베이스 연결을 사용한다.

//쿼리문
const queryDatabase = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (error, data, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // 모든 도메인에서의 WebSocket 요청을 허용
    methods: ["GET", "POST"],
  },
});

// 로그인 처리
// 로그인 처리
// 로그인 처리

app.post("/api/login", (req, res) => {
  console.log(req.body);
  console.log(session);
  const { id, pw } = req.body;

  const query = "SELECT * FROM userInfo WHERE id = ? AND pw =? ";

  db.query(query, [id, pw], (err, result) => {
    if (err) {
      console.error("Query error: ", err);
      res.status(500).send({ message: "Database error", error: err });
    } else {
      if (result.length > 0) {
        req.session.userId = result[0].id;
        req.session.loggedIn = true;
        if (result[0].connect_id) {
          // connect_id 컬럼에 값이 존재하는 경우
          res.json({ status: "redirect", message: "Connect_id가 있습니다." });
        } else {
          // connect_id 컬럼이 비어 있는 경우
          res.json({ status: "stay", message: "connect_id가 없습니다." });
        }
      } else {
        res.status(401).send({ message: "Invalid ID or password" });
      }
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
  console.log(req.body);
  const { connect_id } = req.body;
  //로그인 상태 확인
  if (!userId) {
    return res.status(401).send({ message: "Unauthorized: No session found" });
  }

  const query = "UPDATE userInfo SET connect_id =? WHERE id =?";
  console.log(connect_id);
  db.query(query, [connect_id, userId], (err, results) => {
    if (err) {
      res.status(500).send({ message: "Database error", error: err.message });
    } else {
      res.status(200).send({ message: "Failed to save the code" });
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

  // DB에서 해당 사용자의 connect_id를 NULL로 변경
  const query = "UPDATE userInfo SET connect_id = NULL WHERE id = ?";
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

  //DB에서 해당 사용자의 ID를 확인하후 모든 정보 삭제
  const query = "DELETE FROM userInfo WHERE id =?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      //DB오류처리
      console.error("Query error:", err);
      res.status(500).send({ message: "Database error", error: err });
    } else {
      req.session.destroy(); // 세션도 삭제
      res.send({ message: "사용자의 데이터가 모두 제거 되었습니다." });
    }
  });
});

// WebSocket 연결 처리
// WebSocket 연결 처리
// WebSocket 연결 처리
// WebSocket 연결 처리

// 소켓 연결 및 이벤트 처리
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // 커플 매칭 확인 및 룸 입장
  socket.on("join room", (connectId) => {
    var sql5 = "SELECT * FROM userInfo WHERE connect_id = ?";
    var sql5params = [connectId];
    // 데이터베이스에서 커플 매칭 확인
    db.query(sql5, sql5params, (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        // 매칭된 커플이면 룸에 입장
        socket.join(connectId);
        console.log(`User ${socket.id} joined room ${connectId}`);
      }
    });
  });

  // 커플 룸 내에서 메시지 교환
  socket.on("chat message", (data) => {
    const { msg } = data;

    // 메시지 받을 때 로그 추가
    console.log(`Message from ${socket.id}: ${msg}`);

    // 데이터베이스에 메시지 저장
    var sql4 = "INSERT INTO chat(Message_text,MessageTime) VALUES(?,?)";
    let now = new Date();
    now.setHours(now.getHours() + 9); // UTC+9(대한민국,서울)로 시간 조정
    let message_time = now.toISOString().slice(0, 19).replace("T", " ");

    var sql4params = [msg, message_time];

    db.query(sql4, sql4params, (err, result) => {
      if (err) throw err;
      console.log("Message recorded in database");
    });

    // 룸에 메시지 브로드캐스트
    io.emit("chat message", msg, message_time);
  });

  // 연결 해제
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// 서버 시작
const PORT = 8080; // 포트 설정
server.listen(PORT, () => {
  console.log(`Server is running on http://3.34.6.50:${PORT}`);
});

//(서버에 정상적으로 연결되는지 확인하는 용도의 코드)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
