DROP DATABASE dang;
CREATE DATABASE dang;
USE dang;

-- 사용자 정보 테이블
CREATE TABLE userInfo( 
    id          VARCHAR(50) PRIMARY KEY,
    username    VARCHAR(20),
    pw          VARCHAR(255), -- 해시된 비밀번호를 위해 길이 변경
    birthday    DATE,
    meetingDay  DATE,
    blood_type  VARCHAR(5),
    user_image  TEXT
);

-- 초대코드 테이블
CREATE TABLE invite_codes (
    code_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    code VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES userInfo(id)
);

-- 커플 연결을 위한 테이블
CREATE TABLE couple_connection_check_for_s (
    check_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id1 VARCHAR(50),
    user_id2 VARCHAR(50),
    FOREIGN KEY (user_id1) REFERENCES userInfo(id),
    FOREIGN KEY (user_id2) REFERENCES userInfo(id)
);

-- 게시판 테이블
CREATE TABLE postInfo(
    post_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50),
    check_id INTEGER,
    postdate DATE,
    title VARCHAR(255),
    content TEXT,
    img TEXT,
    FOREIGN KEY (user_id) REFERENCES userInfo(id),
    FOREIGN KEY (check_id) REFERENCES couple_connection_check_for_s(check_id)
);

-- 채팅 테이블
CREATE TABLE chat(
    message_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    room_id VARCHAR(10),
    Message_text VARCHAR(100),
    user_id VARCHAR(50),
    MessageTime DATETIME
);

-- 버킷리스트 테이블
CREATE TABLE bucketList (
  bucket_id INT AUTO_INCREMENT PRIMARY KEY,
  bucket_text VARCHAR(255) NOT NULL,
  isCompleted BOOLEAN NOT NULL DEFAULT FALSE,
  check_id INT,
  FOREIGN KEY (check_id) REFERENCES couple_connection_check_for_s(check_id)
);

-- 달력 테이블
CREATE TABLE calendar(
    schedule_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    schedule_text TEXT,
    schedule_date DATE,
    check_id INT,
    FOREIGN KEY (check_id) REFERENCES couple_connection_check_for_s(check_id)

);

-- 채팅 테이블
CREATE TABLE picture(
    image_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    image_uri VARCHAR(255) NOT NULL,
    image_region VARCHAR(100),
    image_address VARCHAR(255),
    check_id INT,
    FOREIGN KEY (check_id) REFERENCES couple_connection_check_for_s(check_id)
);

-- 캔디 저장 테이블
CREATE TABLE candy(
    check_id INT PRIMARY KEY,
    candy INTEGER,
    month_candy INT,
    FOREIGN KEY(check_id) REFERENCES couple_connection_check_for_s(check_id)
);

SET SQL_SAFE_UPDATES = 0;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'dlavnf1290@!';
FLUSH privileges;