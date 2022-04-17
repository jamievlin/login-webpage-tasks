#!/usr/bin/env python3
from datetime import datetime
from dateutil import parser
import mysql.connector
import typing as ty

from .db_helper import DbCursor

MARIADB_DATETIME_PARSERINFO = parser.parserinfo(
    dayfirst=False,
    yearfirst=True
)


class Message:
    def __init__(
            self,
            msg_id: int, user_id: int,
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
    def get_msg_by_user(cls, user_id: int, max_count=100) -> ty.List:
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
