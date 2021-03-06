#!/usr/bin/env python3
import datetime
import mysql.connector
import secrets
import typing as ty
import ipaddress
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
        except mysql.connector.Error as e:
            if e.errno == 1062:
                print(f'User {username} already exists!')
            else:
                print(f'Error: {e}')


def get_userid(username: str) -> ty.Optional[int]:
    query = """
    SELECT user_id
    FROM login_webpage.user_login
    WHERE user_name = %s
    """
    ret = fetch_one(query, (username, ))
    if ret is None:
        return None
    userid, = ret
    return userid


def get_username(user_id: int) -> ty.Optional[str]:
    query = """
    SELECT user_name
    FROM login_webpage.user_login
    WHERE user_id = %s
    """
    ret = fetch_one(query, (user_id, ))
    if ret is None:
        return None
    username, = ret
    return username


def create_session(
        username: str,
        ip_addr: ty.Union[ipaddress.IPv4Address, ipaddress.IPv6Address]) \
        -> ty.Optional[ty.Tuple[bytes, datetime.datetime]]:
    session_bytes = secrets.token_bytes(32)
    expiry = datetime.datetime.now() + datetime.timedelta(minutes=30)
    query = """
    INSERT INTO login_webpage.sessions
    (session_id, user_id, expiry, ip_addr)
    VALUES (%s, %s, %s, %s)
    """
    userid = get_userid(username)
    if userid is None:
        return None

    with db_conn(True) as cur:
        try:
            cur.execute(query, (session_bytes, userid, expiry, ip_addr.packed))
        except mysql.connector.Error as e:
            print(f'error: {e}')
            return None
    return session_bytes, expiry


def clear_all_session(username: str):
    userid = get_userid(username)
    if userid is None:
        return

    query = """
    DELETE FROM login_webpage.sessions
    WHERE user_id = %s
    """

    with db_conn(True) as cur:
        try:
            cur.execute(query, (userid,))
        except mysql.connector.Error as e:
            print(f'error: {e}')
            return None


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
        except mysql.connector.Error as e:
            print(f'oops... {e}')


def verify_session(session: bytes) -> \
        ty.Optional[ty.Tuple[str, datetime.datetime]]:
    query = """
    SELECT user_id, expiry
    FROM login_webpage.sessions
    WHERE session_id = %s AND expiry >= NOW()
    """
    ret = fetch_one(query, (session, ))
    if ret is None:
        return None
    userid, expiry = ret

    new_expiry = expiry + datetime.timedelta(minutes=30)
    username = get_username(userid)
    update_expiry = """
    UPDATE login_webpage.sessions
    SET expiry = %s
    WHERE session_id = %s
    """

    with db_conn(True) as cur:
        try:
            cur.execute(update_expiry, (new_expiry, session))
        except mysql.connector.Error as e:
            print(f'error: {e}')
            return username, expiry
    return username, new_expiry


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


def delete_session(session: bytes) -> bool:
    query = """
    DELETE FROM login_webpage.sessions
    WHERE session_id=%s
    """

    with db_conn(True) as cur:
        try:
            cur.execute(query, (session, ))
        except mysql.connector.Error as e:
            print(f'error: {e}')
            return False
    return True


def clear_all_sessions(user_id: int, excl_session: ty.Optional[bytes]) -> \
        bool:
    query = """
    DELETE FROM login_webpage.sessions
    WHERE
        (user_id=%(uid)s)
    AND (
        (%(excl_sess)s=FALSE) OR (session_id<>%(session)s)
    )
    """

    # (A=FALSE) OR (B) is used to show logical implication
    # i.e. if A then B
    # In this case, if excl_sess is set to true, then session must not equal
    # the specified session as well

    enable_exclude_session = excl_session is not None
    dud_bytes = b'0'
    val = {
        'uid': user_id,
        'excl_sess': enable_exclude_session,
        'session': excl_session if enable_exclude_session else dud_bytes
        # if excl_sess is False, session value is ignored, hence the dud b'0'.
    }

    with db_conn(True) as cur:
        try:
            cur.execute(query, val)
        except mysql.connector.Error as e:
            print(f'error: {e}')
            return False
    return True
