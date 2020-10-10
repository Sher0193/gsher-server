create database db;

grant all privileges on DATABASE_NAME.* TO 'user'@'localhost' identified by 'password';

DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

create table users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(240) NOT NULL,
    password VARCHAR(240) NOT NULL,
    PRIMARY KEY (id)
);

create table posts (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    meta VARCHAR(100) NOT NULL,
    link VARCHAR(256) NOT NULL,
    price INT NOT NULL,
    sold TINYINT(1) NOT NULL,
    body TEXT,
    PRIMARY KEY (id)
);
