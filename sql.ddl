create database db;

grant all privileges on DATABASE_NAME.* TO 'user'@'localhost' identified by 'password';

create table posts (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    meta VARCHAR(100) NOT NULL,
    body TEXT NOT NULL,
    PRIMARY KEY (id)
);
