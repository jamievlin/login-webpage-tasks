#!/usr/bin/env python3

from flask import request, current_app
import typing as ty
import srv.accountmgmt


def get_username_auth() -> ty.Optional[str]:
    if (auth := request.authorization) is not None and auth.type == 'basic':
        valid = srv.accountmgmt.verify_login(auth.username, auth.password)
        if valid:
            current_app.logger.info(f'User {auth.username} login success')
            return auth.username
        else:
            current_app.logger.info(f'User {auth.username} login failed!')
    current_app.logger.info(f'Login attempt failed!')
    return None


def get_username_by_session() -> ty.Optional[str]:
    if (tok := get_bearer_if_exists()) is not None:
        ret = srv.accountmgmt.verify_session(bytes.fromhex(tok))
        if ret is not None:
            usr, expiry = ret
            current_app.logger.info(f'User {usr} login success by token')
            return usr
    current_app.logger.info(f'Login attempt failed!')
    return None


def get_bearer_if_exists():
    auth = request.headers['Authorization']
    if auth.startswith('Bearer '):
        _, tok = auth.split(' ')
        return tok
    else:
        return None


def get_username_by_pw_or_session() -> ty.Optional[str]:
    if (ret := get_username_auth()) is not None:
        return ret
    else:
        return get_username_by_session()
