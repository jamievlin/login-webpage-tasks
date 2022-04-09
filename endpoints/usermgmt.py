#!/usr/bin/env python3

from flask import (
    Blueprint, jsonify, make_response
)
from utils import auth


user_mgmt = Blueprint('user_mgmt', __name__, template_folder='templates')


@user_mgmt.route('/api/userdata')
def userdata():
    usr = auth.get_username_by_session()
    if usr is None:
        return make_response(
            401, jsonify(message='Invalid or expired session!'))
    return jsonify(username=usr), 200
