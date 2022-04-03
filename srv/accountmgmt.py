#!/usr/bin/env python3
import mariadb
from passlib.hash import argon2

from .db_helper import db_conn, fetch_one


def create_user(username: str, password: str):
    new_hash = argon2.hash(password)
    query = """
    INSERT INTO login_webpage.user_login
    (user_name, pwd_hash)
    VALUES (%s, %s)
    """

    with db_conn(True) as cur:
        try:
            cur.execute(query, (username, new_hash))
        except mariadb.Error as e:
            if e.errno == 1062:
                print(f'User {username} already exists!')
            else:
                print(f'Error: {e}')


def change_password(username: str, new_password: str):
    new_hash = argon2.hash(new_password)
    query = """
    UPDATE login_webpage.user_login
    SET pwd_hash=%(pwdhash)s
    WHERE user_name=%(usr)s
    """

    with db_conn(True) as cur:
        try:
            cur.execute(query, {'pwdhash': new_hash, 'usr': username})
        except mariadb.Error as e:
            print(f'oops... {e}')


def verify_login(username: str, password: str) -> bool:
    query = """
    SELECT pwd_hash
    FROM login_webpage.user_login
    WHERE user_name=%s
    """
    ret = fetch_one(query, (username, ))
    if ret is None:
        return False
    cmp_hash, = ret
    return argon2.verify(password, cmp_hash)
