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

-- 게시판 테이블
CREATE TABLE postInfo(
    post_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    postdate DATE,
    title VARCHAR(255),
    content TEXT,
    img TEXT
);

-- 채팅 테이블
CREATE TABLE chat(
    message_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    room_id VARCHAR(255),
    Message_text VARCHAR(100),
    MessageTime DATETIME
);

-- 커플 연결 확인 테이블
CREATE TABLE couple_connection_check (
    check_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    connect_id_me VARCHAR(50),
    connect_id_lover VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES userInfo(id)
);

-- 버킷리스트 테이블
CREATE TABLE bucketList(
    bucket_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    bucket_text TEXT
);

-- 달력 테이블
CREATE TABLE calendar(
    schedule_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    schedule_text TEXT,
    schedule_date DATE
);

CREATE TABLE picture(
    image_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    image_uri VARCHAR(255) NOT NULL,
    image_region VARCHAR(100)
);

SET SQL_SAFE_UPDATES = 0;

AlTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'dlavnf1290@!';
FLUSH privileges;