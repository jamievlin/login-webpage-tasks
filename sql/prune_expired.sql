/*
 Delete all expired sessions from session table
 */

DELETE FROM login_webpage.sessions
WHERE expiry < NOW();
