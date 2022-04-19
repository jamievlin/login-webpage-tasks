#!/usr/bin/env python3
from datetime import datetime
from dateutil import parser
import mysql.connector
import typing as ty

from .db_helper import DbCursor, DbConnection, cursor_commit

MARIADB_DATETIME_PARSERINFO = parser.parserinfo(
    dayfirst=False,
    yearfirst=True
)

M = ty.TypeVar('M', bound='Message')


class Message:
    def __init__(
            self,
            msg_id: int | None, user_id: int,
            starred: bool | int = False,
            created: datetime | str = datetime.now(),
            updated: datetime | str = datetime.now(),
            text: str = ''):
        self.msg_id = msg_id
        self.user_id = user_id

        if isinstance(created, str):
            created = parser.parse(created, MARIADB_DATETIME_PARSERINFO)

        if isinstance(updated, str):
            updated = parser.parse(updated, MARIADB_DATETIME_PARSERINFO)

        if isinstance(starred, int):
            starred = bool(starred)

        self.starred = starred
        self.created = created
        self.updated = updated
        self.text = text

    def save_to_db(self) -> int | None:
        query = """
        INSERT INTO login_webpage.tasks_collection
        (user_id, starred, created, updated, content)
        VALUES (%s, %s, %s, %s, %s)
        """

        with DbConnection() as conn:
            with cursor_commit(conn) as cur:
                try:
                    cur.execute(query,
                                (self.user_id, self.starred, self.created,
                                 self.updated, self.text))
                except mysql.connector.Error as e:
                    print(f'Error: {e}')
                    return None
            cur2 = conn.cursor()
            cur2.execute("SELECT LAST_INSERT_ID()")
            self.msg_id, = cur2.fetchone()
        return self.user_id

    def dictify(self) -> dict:
        return {
            'msg_id': self.msg_id,
            'user_id': self.user_id,
            'starred': self.starred,
            'created': self.created.isoformat(),
            'updated': self.updated.isoformat(),
            'text': self.text
        }

    @classmethod
    def get_msg_by_user(cls: ty.Type[M], user_id: int, max_count=100) \
            -> ty.List[M]:
        query = """
        SELECT *
        FROM login_webpage.tasks_collection
        WHERE user_id=%s
        ORDER BY created
        """

        with DbCursor() as cur:
            try:
                cur.execute(query, (user_id,))
            except mysql.connector.Error as e:
                print(f'Error: {e}')
                return []
            rows = cur.fetchmany(max_count)

        return [cls(*dat) for dat in rows]


def delete_message(message_ids: int | ty.List[int] | ty.Tuple[int]):
    if isinstance(message_ids, int):
        message_ids = (message_ids,)
    elif isinstance(message_ids, list):
        message_ids = tuple(message_ids)
    else:
        raise ValueError('Message must be an integer or a '
                         'collection of integers!')
    assert isinstance(message_ids, tuple)

    query = f"""
    DELETE FROM login_webpage.tasks_collection
    WHERE msg_id in ({','.join(['%s'] * len(message_ids))})
    """

    with DbCursor(True) as cur:
        try:
            cur.execute(query, tuple(message_ids))
        except mysql.connector.Error as e:
            print(f'Error: {e}')
            return None
    return True
