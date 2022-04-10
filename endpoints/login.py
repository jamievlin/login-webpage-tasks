#!/usr/bin/env python3

from flask import (
    Blueprint, jsonify, request, abort, Response
)
from utils import auth
from ipaddress import IPv4Address
from srv import accountmgmt as am

from http import HTTPStatus

login_page = Blueprint('login_endpoint', __name__, template_folder='templates')


@login_page.route('/api/testlogin', methods=['GET'])
def test_login():
    usr = auth.get_username_by_pw_or_session()
    return jsonify(valid=usr is not None), HTTPStatus.OK


@login_page.route('/api/login', methods=['POST'])
def login():
    usr = auth.get_username_auth()
    if usr is None:
        return jsonify(message='User login failed!'), \
               HTTPStatus.UNAUTHORIZED
    ret = am.create_session(usr, IPv4Address(request.remote_addr))
    if ret is None:
        return jsonify(message='Cannot create user session'), \
               HTTPStatus.UNAUTHORIZED
    session, exp = ret

    retval = {
        'session': session.hex(),
        'expiry': exp.isoformat()
    }
    return jsonify(**retval), 201
