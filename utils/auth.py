#!/usr/bin/env python3

from flask import request, current_app
import typing as ty
import srv.accountmgmt


def get_username_auth() -> ty.Optional[str]:
    auth = request.authorization
    if auth is None:
        return None

    if auth.type == 'basic':
        valid = srv.accountmgmt.verify_login(auth.username, auth.password)
        if valid:
            current_app.logger.info(f'User {auth.username} login success')
            return auth.username
    else:
        current_app.logger.info(f'User {auth.username} login failed!')
        return None
