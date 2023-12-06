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

// 버킷리스트 추가
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

//  게시글 추가
//  게시글 추가
//  게시글 추가

app.post("/api/add_post", (req, res) => {
  const { title, content, img } = req.body;
  const imagesAsString = JSON.stringify(img);
  console.log("Received data:", req.body);

  const userId = req.session.userId; // 예시: 세션에서 user_id 가져오기
  const checkId = req.session.checkId; // 예시: 세션에서 check_id 가져오기

  db.query(
    "INSERT INTO postInfo (user_id, check_id, title, content, img) VALUES (?, ?, ?, ?, ?)",
    [userId, checkId, title, content, imagesAsString],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      // 생성된 게시글의 post_id 반환 -> 클라이언트쪽에서 post_id를 못받아오고 있기때문에 글을 저장하고 생성된 post_id 값을 바로 넘겨준다.
      res.json({
        postId: result.insertId, // 자동 생성된 게시글 ID
        userId: userId,
        checkId: checkId,
        title: title,
        content: content,
        img: img,
      });
      console.log("Insert result:", result);
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
          "SELECT post_id, title, content, img FROM postInfo WHERE check_id = ?",
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

app.put("/api/update_post/:id", (req, res) => {
  const postId = req.params.id;
  const updatedPost = req.body;
  db.query(
    "UPDATE postInfo SET ? WHERE post_id = ?",
    [updatedPost, postId],
    (err, result) => {
      if (err) res.status(500).send(err);
      res.json({ message: "Post updated" });
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
