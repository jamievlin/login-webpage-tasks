#!/usr/bin/env python3
import mariadb
from contextlib import contextmanager


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
