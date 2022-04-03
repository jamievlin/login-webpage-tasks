/*
 Init script for database.
 */

CREATE DATABASE IF NOT EXISTS login_webpage;

CREATE TABLE IF NOT EXISTS login_webpage.user_login (
    user_id INT NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(255) NOT NULL UNIQUE,
    pwd_hash VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS login_webpage.sessions (
    session_id BINARY(32) NOT NULL,
    user_id INT NOT NULL,
    expiry TIMESTAMP NOT NULL,
    ip_addr BINARY(16),
    PRIMARY KEY (session_id)
);

GRANT ALTER, INSERT, UPDATE, DELETE, SELECT,
    REFERENCES
    ON login_webpage.*
    TO 'default'@'localhost' WITH GRANT OPTION;

FLUSH PRIVILEGES;
