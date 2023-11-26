DROP DATABASE post;
CREATE DATABASE post;
CREATE userInfo;
CREATE coupleInfo;
CREATE chat;
CREATE bucketList;
CREATE calendar;
CREATE picturemap;

USE coupleInfo
USE userInfo
USE post;

/* 게시판 테이블 */
CREATE TABLE postInfo(
    postNum        INTEGER PRIMARY KEY auto_increment,
    author         VARCHAR(20),
    authorIcon     text,
    email          text,
    title         text,
    content         LONGTEXT,
    img            text,
    DATE         text,
    hit            INTEGER
);

/* 유저 정보 테이블 */
CREATE TABLE userInfo( 
    username        VARCHAR(20),
    id              VARCHAR(20),
    pw              VARCHAR(20),
    birthday        DATE,
    connectid       TEXT,
    bloodtype       VARCHAR(5)
    userimage       TEXT,
    coupleid        VARCHAR(20)
    PRIMARY KEY (id),
    FOREIGN KEY (couple_id) REFERENCES coupleInfo(couple_id)
)

/* 커플 정보 테이블 */
CREATE TABLE coupleInfo(
    meetdate        DATE,
    couple_id        VARCHAR(20),
    PRIMARY KEY (couple_id),
)

/* 채팅 내역 테이블*/
CREATE TABLE chat(
    couple_id                VARCHAR(20)
    user1_id                 VARCHAR(20),
    user2_id                 VARCHAR(20),
    user1_Messagetext        TEXT,
    user2_Messagetext        TEXT,
    user1_MessageTime        DATETIME,
    user2_MessageTime        DATETIME,
    FOREIGN KEY (user1_id) REFERENCES userInfo(id),
    FOREIGN KEY (user2_id) REFERENCES userInfo(id),
    PRIMARY KEY (couple_id) REFERENCES coupleInfo(couple_id)
)

/* 버킷리스트 테이블 */
CREATE TABLE bucketList(
    bucket_id    VARCHAR(20),
    bucket_text  TEXT,
    couple_id    VARCHAR(20),
    PRIMARY KEY (couple_id) REFERENCES coupleInfo(couple_id)
)

/* 캘린더 테이블 */
CREATE TABLE calendar(
    schedule_id     VARCHAR(20),
    schedule_text   TEXT,
    schedule_date   DATE,
    couple_id    VARCHAR(20),
    PRIMARY KEY (couple_id) REFERENCES coupleInfo(couple_id)
)

/* 사진지도 테이블 */
CREATE TABLE picturemap(
    image_id    TEXT,
    image_date  DATE,
    couple_id    VARCHAR(20),
    PRIMARY KEY (couple_id) REFERENCES coupleInfo(couple_id)
)

/* 랭킹 테이블 */
-- CREATE TABLE calendar(
    -- couple_id    VARCHAR(20),
    -- PRIMARY KEY (couple_id) REFERENCES coupleInfo(couple_id)
-- )
/* 출석체크 테이블 */
-- CREATE TABLE calendar(
    -- couple_id    VARCHAR(20),
    -- PRIMARY KEY (couple_id) REFERENCES coupleInfo(couple_id)
-- )

set SQL_SAFE_UPDATES = 0;


AlTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'dlavnf1290@!';
FLUSH privileges;