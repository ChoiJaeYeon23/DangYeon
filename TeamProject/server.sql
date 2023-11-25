DROP DATABASE post;
CREATE DATABASE post;
CREATE user
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




set SQL_SAFE_UPDATES = 0;




AlTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'dlavnf1290@!';
FLUSH privileges;