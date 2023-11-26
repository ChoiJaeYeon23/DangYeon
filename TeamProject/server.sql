DROP DATABASE dang;
CREATE DATABASE dang;
USE dang;

-- 커플 정보 테이블
CREATE TABLE coupleInfo(
    couple_id VARCHAR(20) PRIMARY KEY,
    meet_date DATE
);

-- 유저 정보 테이블
CREATE TABLE userInfo( 
    id          VARCHAR(50) PRIMARY KEY,
    username    VARCHAR(20),
    pw          VARCHAR(20),
    birthday    DATE,
    connect_id  TEXT,
    blood_type  VARCHAR(5),
    user_image  TEXT,
    couple_id   VARCHAR(20),
    FOREIGN KEY (couple_id) REFERENCES coupleInfo(couple_id)
);

-- 게시판 정보 테이블
CREATE TABLE postInfo(
    post_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    postdate DATE,
    title VARCHAR(255),
    content TEXT,
    img TEXT,
    couple_id VARCHAR(20),
    FOREIGN KEY (couple_id) REFERENCES coupleInfo(couple_id)
);

-- 채팅 내역 테이블
CREATE TABLE chat(
    chat_id VARCHAR(20) PRIMARY KEY,
    couple_id VARCHAR(20),
    user1_Message_text TEXT,
    user2_Message_text TEXT,
    user1_MessageTime DATETIME,
    user2_MessageTime DATETIME,
    FOREIGN KEY (couple_id) REFERENCES coupleInfo(couple_id)
);

-- 버킷리스트 테이블
CREATE TABLE bucketList(
    bucket_id VARCHAR(20) PRIMARY KEY,
    bucket_text TEXT,
    couple_id VARCHAR(20),
    FOREIGN KEY (couple_id) REFERENCES coupleInfo(couple_id)
);

-- 캘린더 테이블
CREATE TABLE calendar(
    schedule_id VARCHAR(20) PRIMARY KEY,
    schedule_text TEXT,
    schedule_date DATE,
    couple_id VARCHAR(20),
    FOREIGN KEY (couple_id) REFERENCES coupleInfo(couple_id)
);

-- 사진지도 테이블
CREATE TABLE picture_map(
    image_id VARCHAR(20) PRIMARY KEY,
    image_date DATE,
    couple_id VARCHAR(20),
    FOREIGN KEY (couple_id) REFERENCES coupleInfo(couple_id)
);

SET SQL_SAFE_UPDATES = 0;

AlTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'dlavnf1290@!';
FLUSH privileges;