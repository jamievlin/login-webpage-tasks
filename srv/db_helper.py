#!/usr/bin/env python3
import mariadb
from contextlib import contextmanager
import typing as ty


@contextmanager
def db_conn(commit=False):
    conn = mariadb.connect(
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
        except mariadb.Error as e:
            print(f'error: {e}')
            return None
