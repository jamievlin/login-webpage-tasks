#!/usr/bin/env python3

from flask import (
    Blueprint, jsonify, make_response
)
from utils import auth
from srv import accountmgmt as am
from http import HTTPStatus

user_mgmt = Blueprint('user_mgmt', __name__, template_folder='templates')


@user_mgmt.route('/api/userdata')
def userdata():
    usr = auth.get_username_by_session()
    user_id = am.get_userid(usr)
    if usr is None:
        return make_response(
            HTTPStatus.UNAUTHORIZED,
            jsonify(message='Invalid or expired session!'))
    return jsonify(username=usr, userid=user_id), HTTPStatus.OK
