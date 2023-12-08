const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const axios = require("axios");
const mysql = require("mysql");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const multer = require("multer");
const path = require("path");

// 파일 필터링 함수
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); // 이미지가 jpeg나 png인 경우 파일 저장을 허용
  } else {
    cb(null, false); // 다른 형식의 파일은 저장을 거부
  }
};

// Multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/ubuntu/chat-server/images"); // 이미지가 저장될 경로
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Express 앱 초기화
const app = express();
// 정적 파일로서 '/home/ubuntu/chat-server/images' 디렉토리 제공
app.use("/images", express.static("/home/ubuntu/chat-server/images"));

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

// 로그인 처리
// 로그인 처리
// 로그인 처리
app.post("/api/login", (req, res) => {
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

      // 커플 연결 상태 및 check_id 확인
      const checkCoupleQuery =
        "SELECT check_id FROM couple_connection_check_for_s WHERE user_id1 = ? OR user_id2 = ?";
      db.query(
        checkCoupleQuery,
        [userInfoResult[0].id, userInfoResult[0].id],
        (err, coupleResult) => {
          if (err) {
            console.error("Query error: ", err);
            res.status(500).send({ message: "Database error", error: err });
            return;
          }

          if (coupleResult.length > 0) {
            // 이미 커플로 연결된 경우, check_id를 세션에 저장
            req.session.checkId = coupleResult[0].check_id;
            res.json({
              status: "login_success",
              message: "Login successful",
              coupleConnected: true,
            });
          } else {
            // 커플로 연결되지 않은 경우
            res.json({
              status: "login_success",
              message: "Login successful",
              coupleConnected: false,
            });
          }
        }
      );
    } else {
      res.status(401).send({ message: "Invalid ID or password" });
    }
  });
});

// 초대 코드 생성 및 저장
// 초대 코드 생성 및 저장
// 초대 코드 생성 및 저장
app.post("/api/generate-invite-code", (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).send({ message: "Unauthorized: No session found" });
  }

  // 기존 코드가 있는지 확인
  const checkCodeQuery = "SELECT code FROM invite_codes WHERE user_id = ?";
  db.query(checkCodeQuery, [userId], (err, results) => {
    if (err) {
      res.status(500).send({ message: "Database error", error: err });
      return;
    }

    if (results.length === 0) {
      // 새 코드 생성 및 저장
      const generateRandomCode = () => {
        const randomNum7Digits =
          Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
        return randomNum7Digits.toString();
      };
      const newCode = generateRandomCode(); // 적절한 랜덤 코드 생성 함수 필요
      const insertCodeQuery =
        "INSERT INTO invite_codes (user_id, code) VALUES (?, ?)";
      db.query(insertCodeQuery, [userId, newCode], (err, result) => {
        if (err) {
          res.status(500).send({ message: "Database error", error: err });
        } else {
          res.send({
            message: "Invite code generated successfully",
            code: newCode,
          });
        }
      });
    } else {
      // 기존 코드 재사용
      res.send({ message: "Existing invite code", code: results[0].code });
    }
  });
});

// 커플연결
// 커플연결
// 커플연결
app.post("/api/connect-couple", (req, res) => {
  const userId = req.session.userId;
  const { inviteCode } = req.body;

  if (!userId) {
    return res.status(401).send({ message: "Unauthorized: No session found" });
  }

  // 초대 코드를 확인하여 다른 사용자의 ID를 찾음
  const query = "SELECT user_id FROM invite_codes WHERE code = ?";
  db.query(query, [inviteCode], (err, results) => {
    if (err || results.length === 0) {
      res.status(400).send({ message: "Invalid invite code" });
      return;
    }

    const otherUserId = results[0].user_id;

    // 커플 관계 저장 전에 중복 확인
    const checkCoupleQuery =
      "SELECT * FROM couple_connection_check_for_s WHERE (user_id1 = ? AND user_id2 = ?) OR (user_id1 = ? AND user_id2 = ?)";
    db.query(
      checkCoupleQuery,
      [userId, otherUserId, otherUserId, userId],
      (err, coupleResult) => {
        if (err) {
          res.status(500).send({ message: "Database error", error: err });
          return;
        }

        if (coupleResult.length === 0) {
          // 새로운 커플 관계 저장
          const coupleInsertQuery =
            "INSERT INTO couple_connection_check_for_s (user_id1, user_id2) VALUES (?, ?)";
          db.query(coupleInsertQuery, [userId, otherUserId], (err, result) => {
            if (err) {
              res.status(500).send({ message: "Database error", error: err });
            } else {
              // 초대 코드 사용 후 비활성화 또는 삭제
              const disableCodeQuery =
                "DELETE FROM invite_codes WHERE code = ?";
              db.query(disableCodeQuery, [inviteCode], (err, deleteResult) => {
                if (err) {
                  // 초대 코드 비활성화 실패 처리
                  console.error("Failed to disable invite code", err);
                }
                res.send({ message: "Couple connected successfully" });
              });
            }
          });
        } else {
          res.status(400).send({ message: "Already connected as a couple" });
        }
      }
    );
  });
});

// 캘린더 내용 저장
// 캘린더 내용 저장
// 캘린더 내용 저장

app.post("/api/calendar_schedule", (req, res) => {
  console.log("Received request to save event:", req.body);
  if (!req.session.checkId) {
    return res.status(403).send("권한 없음");
  }
  const { date: schedule_date, text: schedule_text } = req.body;
  const checkId = req.session.checkId;

  const query =
    "INSERT INTO calendar (schedule_text, schedule_date, check_id) VALUES (?, ?, ?)";
  db.query(query, [schedule_text, schedule_date, checkId], (err, result) => {
    if (err) {
      // 데이터베이스 에러 처리
      console.error(err);
      return res.status(500).send("서버 에러");
    }
    // 성공 응답
    res.status(200).send("일정 저장 성공");
  });
});

// 캘린더 일정 표시
// 캘린더 내용 표시
// 캘린더 내용 표시

app.get("/api/calendar_load", (req, res) => {
  console.log(
    "Received request to load events for checkId:",
    req.session.checkId
  );
  if (!req.session.checkId) {
    return res.status(403).send("권한 없음");
  }
  const checkId = req.session.checkId;

  const query = "SELECT * FROM calendar WHERE check_id = ?";
  db.query(query, [checkId], (error, results, fields) => {
    if (error) {
      res.status(500).send("서버 에러");
      return;
    }
    res.status(200).json(results);
  });
});

// 캘린더 날짜에 데이터 불러오기
// 캘린더 날짜에 데이터 불러오기
// 캘린더 날짜에 데이터 불러오기

app.get("/api/load_calendar_text", (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).send("Date is required");
  }

  // 예시 쿼리: 'SELECT * FROM events WHERE date = ?'
  db.query(
    "SELECT * FROM calendar WHERE schedule_date= ?",
    [date],
    (error, results) => {
      if (error) {
        console.error("Error fetching events for date:", date, error);
        return res.status(500).send("Internal Server Error");
      }

      res.json(results);
    }
  );
});

//캘린더일정 내용 수정
//캘린더일정 내용 수정
//캘린더일정 내용 수정

app.put("/api/calendar_text_update/:schedule_id", (req, res) => {
  const { schedule_id } = req.params;
  const { text } = req.body;

  if (!schedule_id || !text) {
    return res.status(400).send("All fields are required");
  }

  const query = "UPDATE calendar SET schedule_text = ? WHERE schedule_id = ?";
  db.query(query, [text, schedule_id], (error, result) => {
    if (error) {
      console.error("Update event error:", error);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      // schedule_id에 해당하는 이벤트가 없는 경우
      return res.status(404).send("Event not found");
    }

    res.send("Event updated successfully");
  });
});

//캘린더일정 삭제
//캘린더일정 삭제
//캘린더일정 삭제

app.delete("/api/del_calendar/:schedule_id", (req, res) => {
  const { schedule_id } = req.params; // URL 경로에서 캘린더 내용ID를 추출

  if (!schedule_id) {
    return res.status(400).send("Event ID is required");
  }

  const query = "DELETE FROM calendar WHERE schedule_id = ?";
  db.query(query, [schedule_id], (error, result) => {
    if (error) {
      // 에러 발생 시 클라이언트에 에러 메시지 전송
      console.error("Delete event error:", error);
      return res.status(500).send("Internal Server Error");
    }
    // 성공적으로 삭제되었음을 클라이언트에 알림
    if (result.affectedRows > 0) {
      res.send("Event deleted successfully");
    } else {
      // 삭제하려는 이벤트가 없는 경우
      res.status(404).send("Event not found");
    }
  });
});

// 버킷리스트 추가
// 버킷리스트 추가
// 버킷리스트 추가

app.post("/api/bucketlist", (req, res) => {
  const checkId = req.session.checkId;
  const { text } = req.body;

  if (!checkId) {
    return res.status(401).send({ message: "Unauthorized: No session found" });
  }

  const insertQuery =
    "INSERT INTO bucketList (check_id, bucket_text, isCompleted) VALUES (?, ?, false)";
  db.query(insertQuery, [checkId, text], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send({ message: "Database error", error: err });
      return;
    }

    res.status(200).send({ message: "Bucketlist item added successfully" });
  });
});

// 버킷리스트 불러오기(checkId 별)
// 버킷리스트 불러오기(checkId 별)
// 버킷리스트 불러오기(checkId 별)
app.get("/api/bucketlist", (req, res) => {
  const checkId = req.session.checkId;

  if (!checkId) {
    return res.status(401).send({ message: "Unauthorized: No session found" });
  }

  const query =
    "SELECT bucket_text, isCompleted,bucket_id FROM bucketList WHERE check_id = ?";
  db.query(query, [checkId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send({ message: "Database error", error: err });
      return;
    }

    res.status(200).send(results);
  });
});

// 버킷리스트 항목 완료 상태 업데이트
// 버킷리스트 항목 완료 상태 업데이트
// 버킷리스트 항목 완료 상태 업데이트
app.put("/api/bucketlist/:id", (req, res) => {
  const { id } = req.params;
  const { isCompleted } = req.body;

  const updateQuery =
    "UPDATE bucketList SET isCompleted = ? WHERE bucket_id = ?";
  db.query(updateQuery, [isCompleted, id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send({ message: "Database error", error: err });
      return;
    }

    res.status(200).send({ message: "Bucketlist item updated successfully" });
  });
});

// 버킷리스트 항목 삭제 업데이트 (bucket_id로 판단)
// 버킷리스트 항목 삭제 업데이트 (bucket_id로 판단)
// 버킷리스트 항목 삭제 업데이트 (bucket_id로 판단)
app.delete("/api/bucketlist/:id", (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM bucketList WHERE bucket_id = ?";
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send({ message: "Database error", error: err });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send({ message: "Item not found" });
    } else {
      res.status(200).send({ message: "Bucketlist item deleted successfully" });
    }
  });
});

// D-Day 계산 (Main화면)
// D-Day 계산 (Main화면)
// D-Day 계산 (Main화면)
app.get("/api/D-day/", (req, res) => {
  const id = req.session.userId;

  const calculateDateQuery = "SELECT meetingDay FROM userInfo WHERE id = ?";
  db.query(calculateDateQuery, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send({ message: "Database error", error: err });
      return;
    }
    res.send(result); // meetingDay 전달
  });
});

// 사용자 이름 가져오기 (2개) (main화면)
// 사용자 이름 가져오기 (2개) (main화면)
// 사용자 이름 가져오기 (2개) (main화면)
app.get("/api/usersname", (req, res) => {
  const checkId = req.session.checkId;

  // couple_connection_check_for_s 테이블에서 user_id1과 user_id2 조회
  const getUserIdsQuery =
    "SELECT user_id1, user_id2 FROM couple_connection_check_for_s WHERE check_id = ?";
  db.query(getUserIdsQuery, [checkId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send({ message: "Database error", error: err });
      return;
    }
    if (results.length > 0) {
      const { user_id1, user_id2 } = results[0];
      // userInfo 테이블에서 username 조회
      const getUsernamesQuery =
        "SELECT username FROM userInfo WHERE id IN (?, ?)";
      db.query(getUsernamesQuery, [user_id1, user_id2], (err, userResults) => {
        if (err) {
          console.error("Database error:", err);
          res.status(500).send({ message: "Database error", error: err });
          return;
        }
        res.send(userResults); // 두 사용자의 username 전달
      });
    } else {
      res.status(404).send({ message: "No users found for given check_id" });
    }
  });
});

// 내 정보 화면에 정보 가져오기
// 내 정보 화면에 정보 가져오기
// 내 정보 화면에 정보 가져오기
app.get("/api/userInfos", (req, res) => {
  const userId = req.session.userId;
  const getuserInfos =
    "SELECT username, birthday, meetingDay, blood_type FROM userInfo WHERE id = ?";
  db.query(getuserInfos, [userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send({ message: "Database error", error: err });
      return;
    }
    if (results.length > 0) {
      res.send(results);
    } else {
      res.status(404).send({ message: "No users found for given userId" });
    }
  });
});

// 프로필 수정부분
// 프로필 수정부분
// 프로필 수정부분
app.post("/api/userInfo_modify", (req, res) => {
  const userId = req.session.userId;
  const { username, birthday, meetingDay, bloodType } = req.body;

  console.log("Received profile data from client:", req.body); // 클라이언트로부터 받은 데이터 로그 남기기

  const modifyQuery =
    "UPDATE userInfo SET username = ?, birthday = ?, meetingDay = ?, blood_Type = ? WHERE id = ?";
  db.query(
    modifyQuery,
    [username, birthday, meetingDay, bloodType, userId],
    (err, result) => {
      if (err) {
        console.error("Database error:", err); // 데이터베이스 에러 로그 남기기
        res.send({ message: "뭔가 에러가 있음", error: err });
      } else {
        console.log("Profile updated successfully", result); // 성공적인 업데이트 로그 남기기
        res.send({ message: "성공" });
      }
    }
  );
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

app.post("/api/save-code", (req, res) => {
  const userId = req.session.userId; // 세션에서 사용자 ID를 가져온다.
  console.log(req.session);
  console.log(req.body);
  const { connect_id_me, connect_id_lover } = req.body;

  // 로그인 상태 확인
  if (!userId) {
    return res.status(401).send({ message: "Unauthorized: No session found" });
  }

  // couple_connection_check_for_s 테이블에 커플 관계 저장
  const query =
    "INSERT INTO couple_connection_check_for_s (user_id1, user_id2) VALUES (?, ?)";

  db.query(query, [userId, connect_id_lover], (err, results) => {
    if (err) {
      res.status(500).send({ message: "Database error", error: err.message });
    } else {
      res.status(200).send({ message: "Couple code saved successfully" });
    }
  });
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
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).send({ message: "Unauthorized: No session found" });
  }

  // invite_codes 테이블에서 해당 사용자를 참조하는 레코드 삭제
  const deleteFromInviteCodes = "DELETE FROM invite_codes WHERE user_id = ?";
  db.query(deleteFromInviteCodes, [userId], (err, results) => {
    if (err) {
      console.error("Error deleting from invite_codes:", err);
      return res
        .status(500)
        .send({ message: "Error deleting from invite_codes", error: err });
    }

    // couple_connection_check_for_s 테이블에서 해당 사용자의 check_id 조회
    const getCheckIdQuery =
      "SELECT check_id FROM couple_connection_check_for_s WHERE user_id1 = ? OR user_id2 = ?";
    db.query(getCheckIdQuery, [userId, userId], (err, checkIds) => {
      if (err) {
        console.error("Error fetching check_id:", err);
        return res.status(500).send({ message: "Database error", error: err });
      }

      if (checkIds.length > 0) {
        const checkId = checkIds[0].check_id;

        // postInfo 테이블에서 해당 check_id를 참조하는 레코드 삭제
        const deleteFromPostInfo = "DELETE FROM postInfo WHERE check_id = ?";
        db.query(deleteFromPostInfo, [checkId], (err, results) => {
          if (err) {
            console.error("Error deleting from postInfo:", err);
            return res
              .status(500)
              .send({ message: "Error deleting from postInfo", error: err });
          }

          // bucketList 테이블에서 해당 check_id를 참조하는 레코드 삭제
          const deleteFromBucketList =
            "DELETE FROM bucketList WHERE check_id = ?";
          db.query(deleteFromBucketList, [checkId], (err, results) => {
            if (err) {
              console.error("Error deleting from bucketList:", err);
              return res.status(500).send({
                message: "Error deleting from bucketList",
                error: err,
              });
            }

            // chat 테이블에서 해당 사용자와 관련된 레코드 삭제
            const deleteFromChat = "DELETE FROM chat WHERE user_id = ?";
            db.query(deleteFromChat, [userId], (err, results) => {
              if (err) {
                console.error("Error deleting from chat:", err);
                return res
                  .status(500)
                  .send({ message: "Error deleting from chat", error: err });
              }

              // couple_connection_check_for_s 테이블에서 해당 사용자의 레코드 삭제
              const deleteFromCoupleConnection =
                "DELETE FROM couple_connection_check_for_s WHERE user_id1 = ? OR user_id2 = ?";
              db.query(
                deleteFromCoupleConnection,
                [userId, userId],
                (err, results) => {
                  if (err) {
                    console.error(
                      "Error deleting from couple_connection_check_for_s:",
                      err
                    );
                    return res.status(500).send({
                      message:
                        "Error deleting from couple_connection_check_for_s",
                      error: err,
                    });
                  }

                  // userInfo 테이블에서 사용자 정보 삭제
                  const deleteUserQuery = "DELETE FROM userInfo WHERE id = ?";
                  db.query(deleteUserQuery, [userId], (err, result) => {
                    if (err) {
                      console.error("Error deleting user from userInfo:", err);
                      return res.status(500).send({
                        message: "Error deleting user from userInfo",
                        error: err,
                      });
                    }
                    req.session.destroy((error) => {
                      if (error) {
                        console.error("Error destroying session:", error);
                        return res.status(500).send({
                          message: "Error destroying session",
                          error: error,
                        });
                      }
                      res.send({
                        message: "사용자의 데이터가 모두 제거 되었습니다.",
                      });
                    });
                  });
                }
              );
            });
          });
        });
      } else {
        // 해당 check_id가 없는 경우, 바로 userInfo 삭제
        const deleteUserQuery = "DELETE FROM userInfo WHERE id = ?";
        db.query(deleteUserQuery, [userId], (err, result) => {
          if (err) {
            console.error("Error deleting user from userInfo:", err);
            return res.status(500).send({
              message: "Error deleting user from userInfo",
              error: err,
            });
          }
          req.session.destroy((error) => {
            if (error) {
              console.error("Error destroying session:", error);
              return res
                .status(500)
                .send({ message: "Error destroying session", error: error });
            }
            res.send({ message: "사용자의 데이터가 모두 제거 되었습니다." });
          });
        });
      }
    });
  });
});

//  게시글 추가
//  게시글 추가
//  게시글 추가
app.post("/api/add_post", upload.single("img"), (req, res) => {
  const { title, content } = req.body;
  console.log("Received body:", req.body);
  const imgFile = req.file; // Multer에 의해 추가된 파일 정보
  console.log("Received file:", imgFile);
  // 파일이 정상적으로 업로드되었는지 확인
  if (!imgFile) {
    res.status(400).send("이미지가 업로드되지 않았습니다.");
    return;
  }

  // 이미지 URL 생성 (클라이언트에서 접근 가능한 웹 URL)
  const imageUrl = `http://3.34.6.50:8080/images/${imgFile.filename}`;

  const userId = req.session.userId;
  const checkId = req.session.checkId;

  const now = new Date();
  now.setHours(now.getHours() + 9); // 서버 시간대가 UTC를 사용한다고 가정할 때 KST로 조정합니다.
  const postdate = now.toISOString().slice(0, 19).replace("T", " ");
  console.log(
    "여긴가봐요 : userId, checkId, postdate, title, content, imageUrl",
    userId,
    checkId,
    postdate,
    title,
    content,
    imageUrl
  );
  // 데이터베이스에 게시글 정보와 이미지 URL 저장
  db.query(
    "INSERT INTO postInfo (user_id, check_id, postdate, title, content, img) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, checkId, postdate, title, content, imageUrl],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.json({
        postId: result.insertId,
        userId: userId,
        checkId: checkId,
        postdate: postdate,
        title: title,
        content: content,
        img: imageUrl, // 클라이언트에서 접근 가능한 URL 전달
      });
    }
  );
});

// 게시글 목록 가져오기
// 게시글 목록 가져오기
// 게시글 목록 가져오기

app.get("/api/load_post", (req, res) => {
  console.log("Session data:", req.session); // 세션 정보
  const userId = req.session.userId; // 세션에서 user_id 가져오기

  // user_id를 사용하여 check_id 찾기
  db.query(
    "SELECT check_id FROM couple_connection_check_for_s WHERE user_id1 = ? OR user_id2 = ?",
    [userId, userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching check_id:", err);
        res.status(500).send(err);
        return;
      }

      console.log("check_id query results:", results);

      if (results.length > 0) {
        const checkId = results[0].check_id;

        // check_id를 기반으로 게시글 필터링
        db.query(
          "SELECT post_id, title, content, img, postdate FROM postInfo WHERE check_id = ?",
          [checkId],
          (err, posts) => {
            if (err) {
              console.error("Error fetching posts:", err);
              res.status(500).send(err);
              return;
            }

            console.log("Fetched posts:", posts);
            res.json(posts);
          }
        );
      } else {
        console.log("Matching couple not found for user:", userId);
        res.status(404).send("Matching couple not found");
      }
    }
  );
});

// 게시글 수정
// 게시글 수정
// 게시글 수정

app.put("/api/update_post/:id", upload.single("img"), (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  let updatedPost = { title, content };

  if (req.file) {
    // 올바른 이미지 URL 경로 생성
    const imageUrl = `http://3.34.6.50:8080/images/${req.file.filename}`;
    updatedPost.img = imageUrl;
  }

  db.query(
    "UPDATE postInfo SET ? WHERE post_id = ?",
    [updatedPost, postId],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json({ message: "Post updated", updatedPost });
    }
  );
});

// 게시글 삭제
// 게시글 삭제
// 게시글 삭제

app.delete("/api/del_post/:id", (req, res) => {
  const postId = req.params.id;
  console.log("Received delete request for post ID:", postId);
  console.log("Request details:", req);

  db.query(
    "DELETE FROM postInfo WHERE post_id = ?",
    [postId],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send(err);
      }
      console.log("Query result:", result);
      res.json({ message: "Post deleted" });
    }
  );
});

// multer 설정 picutreMap 컴포넌트 부분
const upload_pic = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "/home/ubuntu/chat-server/images"); // 이미지 저장 경로
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
  }),
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  }
});


// picutreMap 컴포넌트에서 사용자의 사진을 서버에 저장(한번에 최대10장)
app.post("/api/upload_images", upload_pic.array("img", 10), (req, res) => {
  const files = req.files;
  const checkId = req.session.checkId; // 세션에서 checkId 가져오기

  if (!files || files.length === 0) {
    return res.status(400).send("이미지가 업로드되지 않았습니다.");
  }

  files.forEach(file => {
    const imageUrl = `http://3.34.6.50:8080/images/${file.filename}`;

    // 데이터베이스에 이미지 정보 저장
    db.query(
      "INSERT INTO picture (image_uri, check_id) VALUES (?, ?)",
      [imageUrl, checkId],
      (err, result) => {
        if (err) {
          console.error("Database insertion error:", err);
          return res.status(500).send("데이터베이스 저장 중 오류 발생");
        }
        console.log("성공")
        // 성공적으로 데이터베이스에 저장된 경우의 처리
      }
    );
  });
  res.status(200).json({ message: "이미지가 성공적으로 업로드되었습니다.", files });
});


// 사진 불러오기(picutreMap)
app.get("/api/get_images", (req, res) => {
  const checkId = req.session.checkId; // 세션에서 checkId 가져오기

  db.query("SELECT image_uri FROM picture WHERE check_id = ?", [checkId], (err, results) => {
    if (err) {
      res.status(500).send("데이터베이스 조회 중 오류 발생");
    } else {
      res.status(200).json(results);
    }
  });
});



// WebSocket 연결 처리
// WebSocket 연결 처리
// WebSocket 연결 처리
io.on("connection", (socket) => {
  console.log(`사용자가 Socket에 연결되었습니다: ${socket.id}`);

  socket.on("identify user", (userId) => {
    console.log(`사용자 ID: ${userId}`);

    // 사용자의 check_id를 찾아 채팅방에 입장시킴
    const coupleCheckQuery =
      "SELECT check_id FROM couple_connection_check_for_s WHERE user_id1 = ? OR user_id2 = ?";
    db.query(coupleCheckQuery, [userId, userId], (err, coupleResult) => {
      if (err) {
        console.error("Database error:", err);
        return;
      }

      if (coupleResult.length > 0) {
        const roomId = `room_${coupleResult[0].check_id}`;
        socket.join(roomId);
        console.log(`User ${userId} joined room: ${roomId}`);
        socket.emit("room assigned", roomId);
      }
    });
  });

  // 채팅 메시지 이벤트 핸들러
  // 채팅 메시지 이벤트 핸들러
  // 채팅 메시지 이벤트 핸들러
  socket.on("chat message", (data) => {
    const { msg, room_id, user_id } = data;
    console.log(
      `Received message: ${msg}, Room ID: ${room_id}, User ID: ${user_id}`
    );
    var sql4 =
      "INSERT INTO chat(Message_text, MessageTime, room_id, user_id) VALUES(?, ?, ?, ?)";
    let now = new Date();
    now.setHours(now.getHours() + 9); // 서버 시간대가 UTC를 사용한다고 가정할 때 KST로 조정합니다.
    let Message_time = now.toISOString().slice(0, 19).replace("T", " ");
    var sql4params = [msg, Message_time, room_id, user_id];

    db.query(sql4, sql4params, (err, result) => {
      if (err) {
        console.error("Error recording message:", err);
        return;
      }
      console.log("Message recorded in databases with user ID");
    });
    socket.to(room_id).emit("chat message", { msg, Message_time, user_id });
  });

  // 이전채팅내역 불러오기
  // 이전채팅내역 불러오기
  // 이전채팅내역 불러오기
  socket.on("load message", (data) => {
    const { room_id } = data;
    var sql99 =
      "SELECT Message_text, MessageTime, user_id FROM chat WHERE room_id = ?";
    var sql99params = [room_id];

    db.query(sql99, sql99params, (err, result) => {
      if (err) {
        console.error("Error loading messages:", err);
        return;
      }
      const messages = result.map((row) => {
        return {
          ...row,
          isUserMessage: row.user_id === socket.handshake.query.userId,
        };
      });
      console.log(messages);
      socket.emit("tttest", messages);
    });
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
