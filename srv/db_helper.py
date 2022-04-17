#!/usr/bin/env python3
import mysql.connector
from contextlib import contextmanager
import typing as ty


class DbCursor:
    def __init__(self, commit=False):
        self._connection = mysql.connector.MySQLConnection(
            user='default', password='password',
            host='localhost', port=3306,
            database='login_webpage'
        )
        self.commit = commit

    def __enter__(self):
        return self._connection.cursor()

    def __exit__(self, ex_type, ex_val, ex_tb):
        if self.commit:
            self._connection.commit()
        self._connection.close()
        return False


@contextmanager
def db_conn(commit=False):
    conn = mysql.connector.MySQLConnection(
        user='default', password='password',
        host='localhost', port=3306,
        database='login_webpage'
    )
    try:
        yield conn.cursor()
        if commit:
            conn.commit()
    finally:
        conn.close()


def fetch_one(query: str, in_val: tuple) -> ty.Optional[tuple]:
    with db_conn() as cur:
        try:
            cur.execute(query, in_val)
            ret = cur.fetchone()
            return ret
        except mysql.connector.Error as e:
            print(f'error: {e}')
            return None
